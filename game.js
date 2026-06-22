// =============================================================================
// BUG SQUASHER — Rubber Duck Debugging: The Game
// =============================================================================
// Architecture:
//   CONFIG           — all tunable constants
//   AudioManager     — Web Audio API synthesized sounds (no files)
//   InputManager     — keyboard + mouse + virtual touch joystick
//   Particle         — single particle for death explosions
//   ParticleSystem   — manages all particles
//   Entity           — base class (x, y, radius, dead, collidesWith)
//   Bullet           — extends Entity, fired by player
//   Player           — extends Entity, the rubber duck hero
//   Spider           — extends Entity, NullPointerException Spider
//   Snake            — extends Entity, SegFault Snake
//   Octopus          — extends Entity, InfiniteLoop Octopus
//   Ghost            — extends Entity, MemoryLeak Ghost
//   WaveManager      — spawns enemies in progressive waves
//   Game             — orchestrator, state machine, main loop
// =============================================================================

// =============================================================================
// CONFIG
// =============================================================================
const CONFIG = {
  WIDTH:  window.innerWidth,
  HEIGHT: window.innerHeight,
  MAX_DT: 50,

  PLAYER_SPEED:       220,
  PLAYER_RADIUS:      18,
  PLAYER_MAX_HP:      5,
  PLAYER_INVINCIBLE_MS: 1200,
  BULLET_SPEED:       480,
  BULLET_RADIUS:      5,
  SHOOT_COOLDOWN:     180,

  COMBO_RESET_MS:     3000,
  SHAKE_DECAY:        0.82,
  WAVE_GAP_MS:        3000,

  BASE_SCORES: { Spider: 10, Snake: 15, Octopus: 20, Ghost: 25 },

  MASTER_VOLUME: 0.28,
  HS_KEY: 'bugSquasher_hs',

  COLORS: {
    bg:      '#0d1117',
    player:  '#FFD700',
    bullet:  '#FFE066',
    spider:  '#cc2200',
    snake:   '#39FF14',
    octopus: '#9B59B6',
    ghost:   '#00FFFF',
    hud:     '#E6EDF3',
    accent:  '#58A6FF',
    dim:     '#8B949E',
  }
};

// =============================================================================
// AudioManager
// =============================================================================
class AudioManager {
  constructor() {
    this.actx = null;
  }

  _ensure() {
    if (!this.actx) {
      this.actx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.actx.state === 'suspended') this.actx.resume();
  }

  _tone(freq, type, duration, volume, attack, decay) {
    this._ensure();
    const now = this.actx.currentTime;
    const osc  = this.actx.createOscillator();
    const gain = this.actx.createGain();
    osc.connect(gain);
    gain.connect(this.actx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume * CONFIG.MASTER_VOLUME, now + (attack || 0.005));
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  _sweep(f0, f1, type, duration, volume) {
    this._ensure();
    const now = this.actx.currentTime;
    const osc  = this.actx.createOscillator();
    const gain = this.actx.createGain();
    osc.connect(gain);
    gain.connect(this.actx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(f0, now);
    osc.frequency.exponentialRampToValueAtTime(f1, now + duration);
    gain.gain.setValueAtTime(volume * CONFIG.MASTER_VOLUME, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playShoot()  { this._tone(880,  'sine',     0.08,  0.4,  0.003, 0.06); }
  playPop()    { this._sweep(440, 110, 'triangle', 0.18, 0.5); }
  playHurt()   { this._tone(120,  'sawtooth', 0.35,  0.6,  0.002, 0.3); }

  playWaveClear() {
    this._ensure();
    [261.63, 329.63, 392.00].forEach((freq, i) => {
      const now = this.actx.currentTime + i * 0.085;
      const osc  = this.actx.createOscillator();
      const gain = this.actx.createGain();
      osc.connect(gain);
      gain.connect(this.actx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.28 * CONFIG.MASTER_VOLUME, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.25);
    });
  }
}

// =============================================================================
// InputManager
// =============================================================================
class InputManager {
  constructor(canvas) {
    this.keys   = {};
    this.mouse  = { x: window.innerWidth / 2, y: window.innerHeight / 2, down: false };
    this.touch  = {
      joystick: { active: false, id: -1, startX: 0, startY: 0, curX: 0, curY: 0 },
      shoot:    { active: false, id: -1, x: 0, y: 0 }
    };
    this._pauseConsumed  = false;
    this._actionConsumed = false;
    this._clickConsumed  = false;

    this._bindKeyboard();
    this._bindMouse(canvas);
    this._bindTouch(canvas);
  }

  _bindKeyboard() {
    window.addEventListener('keydown', e => {
      this.keys[e.code] = true;
      if (e.code === 'KeyP') this._pauseConsumed = true;
      if (e.code === 'Space' || e.code === 'Enter') {
        this._actionConsumed = true;
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', e => { this.keys[e.code] = false; });
  }

  _bindMouse(canvas) {
    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      this.mouse.x = (e.clientX - r.left) * (canvas.width  / r.width  / (window.devicePixelRatio || 1));
      this.mouse.y = (e.clientY - r.top)  * (canvas.height / r.height / (window.devicePixelRatio || 1));
    });
    canvas.addEventListener('mousedown', e => {
      this.mouse.down = true;
      this._clickConsumed = true;
      if (e.target.tagName === 'CANVAS') e.preventDefault();
    });
    canvas.addEventListener('mouseup',   () => { this.mouse.down = false; });
  }

  _bindTouch(canvas) {
    const toCanvas = (cx, cy) => {
      const r = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      return {
        x: (cx - r.left) * (canvas.width  / r.width  / dpr),
        y: (cy - r.top)  * (canvas.height / r.height / dpr)
      };
    };

    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        const p = toCanvas(t.clientX, t.clientY);
        if (p.x < CONFIG.WIDTH / 2) {
          this.touch.joystick = { active: true, id: t.identifier, startX: p.x, startY: p.y, curX: p.x, curY: p.y };
        } else {
          this.touch.shoot = { active: true, id: t.identifier, x: p.x, y: p.y };
          this._clickConsumed = true;
          this._actionConsumed = true;
        }
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', e => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        const p = toCanvas(t.clientX, t.clientY);
        if (this.touch.joystick.active && t.identifier === this.touch.joystick.id) {
          this.touch.joystick.curX = p.x;
          this.touch.joystick.curY = p.y;
        }
        if (this.touch.shoot.active && t.identifier === this.touch.shoot.id) {
          this.touch.shoot.x = p.x;
          this.touch.shoot.y = p.y;
        }
      }
    }, { passive: false });

    canvas.addEventListener('touchend', e => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        if (this.touch.joystick.active && t.identifier === this.touch.joystick.id)
          this.touch.joystick.active = false;
        if (this.touch.shoot.active && t.identifier === this.touch.shoot.id)
          this.touch.shoot.active = false;
      }
    }, { passive: false });
  }

  getMoveVector() {
    let dx = 0, dy = 0;
    if (this.keys['KeyW'] || this.keys['ArrowUp'])    dy -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown'])  dy += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft'])  dx -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) dx += 1;

    if (dx === 0 && dy === 0 && this.touch.joystick.active) {
      const jdx = this.touch.joystick.curX - this.touch.joystick.startX;
      const jdy = this.touch.joystick.curY - this.touch.joystick.startY;
      const jlen = Math.hypot(jdx, jdy);
      if (jlen > 8) { dx = jdx / jlen; dy = jdy / jlen; }
    }

    const len = Math.hypot(dx, dy);
    return len > 0 ? { x: dx / len, y: dy / len } : { x: 0, y: 0 };
  }

  getAimAngle(px, py) {
    if (this.touch.shoot.active)
      return Math.atan2(this.touch.shoot.y - py, this.touch.shoot.x - px);
    return Math.atan2(this.mouse.y - py, this.mouse.x - px);
  }

  isShootingHeld()  { return this.mouse.down || this.touch.shoot.active; }
  consumePause()    { const v = this._pauseConsumed;  this._pauseConsumed  = false; return v; }
  consumeAction()   { const v = this._actionConsumed; this._actionConsumed = false; return v; }
  consumeClick()    { const v = this._clickConsumed;  this._clickConsumed  = false; return v; }
}

// =============================================================================
// Particle / ParticleSystem
// =============================================================================
class Particle {
  constructor(x, y, vx, vy, color, radius, life) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.color   = color;
    this.radius  = radius;
    this.life    = life;
    this.maxLife = life;
  }

  update(dt) {
    this.x += this.vx * dt * 0.001;
    this.y += this.vy * dt * 0.001;
    this.vx *= 0.96;
    this.vy *= 0.96;
    this.life -= dt;
  }

  draw(ctx) {
    const alpha  = Math.max(0, this.life / this.maxLife);
    const radius = this.radius * alpha;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur  = 4;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  get isDead() { return this.life <= 0; }
}

class ParticleSystem {
  constructor() { this.particles = []; }

  emit(x, y, color, count, opts) {
    const o = opts || {};
    const sMin = o.speedMin  || 60;
    const sMax = o.speedMax  || 200;
    const lMin = o.lifeMin   || 300;
    const lMax = o.lifeMax   || 700;
    const rMin = o.radiusMin || 2;
    const rMax = o.radiusMax || 6;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = sMin + Math.random() * (sMax - sMin);
      const life  = lMin + Math.random() * (lMax - lMin);
      const rad   = rMin + Math.random() * (rMax - rMin);
      this.particles.push(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, rad, life));
    }
  }

  update(dt) {
    for (const p of this.particles) p.update(dt);
    this.particles = this.particles.filter(p => !p.isDead);
  }

  draw(ctx) { for (const p of this.particles) p.draw(ctx); }
}

// =============================================================================
// Entity (base)
// =============================================================================
class Entity {
  constructor(x, y, radius) {
    this.x = x; this.y = y;
    this.radius = radius;
    this.vx = 0; this.vy = 0;
    this.dead = false;
  }

  collidesWith(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.hypot(dx, dy) < this.radius + other.radius;
  }

  update() {}
  draw()   {}
}

// =============================================================================
// Bullet
// =============================================================================
class Bullet extends Entity {
  constructor(x, y, angle) {
    super(x, y, CONFIG.BULLET_RADIUS);
    this.vx    = Math.cos(angle) * CONFIG.BULLET_SPEED;
    this.vy    = Math.sin(angle) * CONFIG.BULLET_SPEED;
    this.trail = [];
  }

  update(dt) {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 5) this.trail.shift();
    this.x += this.vx * dt * 0.001;
    this.y += this.vy * dt * 0.001;
    if (this.x < -20 || this.x > CONFIG.WIDTH + 20 ||
        this.y < -20 || this.y > CONFIG.HEIGHT + 20) {
      this.dead = true;
    }
  }

  draw(ctx) {
    ctx.save();
    // Trail
    for (let i = 0; i < this.trail.length; i++) {
      const alpha = (i / this.trail.length) * 0.4;
      const rad   = this.radius * (i / this.trail.length) * 0.7;
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = CONFIG.COLORS.bullet;
      ctx.beginPath();
      ctx.arc(this.trail[i].x, this.trail[i].y, rad, 0, Math.PI * 2);
      ctx.fill();
    }
    // Main bullet
    ctx.globalAlpha = 1;
    ctx.shadowColor = CONFIG.COLORS.bullet;
    ctx.shadowBlur  = 8;
    ctx.fillStyle   = CONFIG.COLORS.bullet;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }
}

// =============================================================================
// Player (Rubber Duck)
// =============================================================================
class Player extends Entity {
  constructor(x, y) {
    super(x, y, CONFIG.PLAYER_RADIUS);
    this.hp               = CONFIG.PLAYER_MAX_HP;
    this.shootTimer       = 0;
    this.invincibleTimer  = 0;
    this.squishTimer      = 0;
    this.time             = 0;
    this.facing           = 0;
    this.moving           = false;
  }

  update(dt, input) {
    this.time        += dt * 0.001;
    this.shootTimer   = Math.max(0, this.shootTimer   - dt);
    this.invincibleTimer = Math.max(0, this.invincibleTimer - dt);
    this.squishTimer  = Math.max(0, this.squishTimer  - dt);

    const mv = input.getMoveVector();
    this.vx = mv.x * CONFIG.PLAYER_SPEED;
    this.vy = mv.y * CONFIG.PLAYER_SPEED;
    this.moving = mv.x !== 0 || mv.y !== 0;

    this.x = Math.max(this.radius, Math.min(CONFIG.WIDTH  - this.radius, this.x + this.vx * dt * 0.001));
    this.y = Math.max(this.radius, Math.min(CONFIG.HEIGHT - this.radius, this.y + this.vy * dt * 0.001));

    this.facing = input.getAimAngle(this.x, this.y);
  }

  tryShoot(audio) {
    if (this.shootTimer > 0) return null;
    this.shootTimer  = CONFIG.SHOOT_COOLDOWN;
    this.squishTimer = 100;
    audio.playShoot();
    return new Bullet(this.x, this.y, this.facing);
  }

  takeDamage(audio) {
    if (this.invincibleTimer > 0) return;
    this.hp--;
    this.invincibleTimer = CONFIG.PLAYER_INVINCIBLE_MS;
    audio.playHurt();
  }

  draw(ctx) {
    // Invincibility blink
    if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer / 100) % 2 === 0) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    // Bounce when moving
    const bounceY = this.moving ? Math.sin(this.time * 8) * 3 : 0;
    ctx.translate(0, bounceY);

    // Idle wobble
    ctx.rotate(Math.sin(this.time * 3) * 0.15);

    // Shoot squish
    if (this.squishTimer > 0) ctx.scale(1.2, 0.82);

    this._drawBody(ctx);
    this._drawHead(ctx);
    this._drawBill(ctx);
    this._drawEye(ctx);

    ctx.restore();
  }

  _drawBody(ctx) {
    ctx.save();
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur  = 6;
    ctx.fillStyle   = CONFIG.COLORS.player;
    ctx.beginPath();
    ctx.ellipse(0, 3, 17, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#CC9900';
    ctx.lineWidth   = 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  _drawHead(ctx) {
    ctx.save();
    ctx.fillStyle = CONFIG.COLORS.player;
    ctx.beginPath();
    ctx.arc(7, -10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#CC9900';
    ctx.lineWidth   = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  _drawBill(ctx) {
    ctx.save();
    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.moveTo(15,  -11);
    ctx.quadraticCurveTo(28, -9, 26, -5);
    ctx.lineTo(15, -6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  _drawEye(ctx) {
    ctx.save();
    ctx.translate(10, -13);
    // Sclera
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    // Googly pupil — tracks aim direction
    const px = Math.cos(this.facing) * 1.5;
    const py = Math.sin(this.facing) * 1.5;
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(px, py, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// =============================================================================
// Spider — NullPointerException Spider
// =============================================================================
class Spider extends Entity {
  constructor(x, y) {
    super(x, y, 14);
    this.hp       = 2;
    this.speed    = 80 + Math.random() * 30;
    this.legPhase = Math.random() * Math.PI * 2;
    this.color    = CONFIG.COLORS.spider;
  }

  update(dt, player) {
    const dx   = player.x - this.x;
    const dy   = player.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    this.vx = (dx / dist) * this.speed;
    this.vy = (dy / dist) * this.speed;
    this.x += this.vx * dt * 0.001;
    this.y += this.vy * dt * 0.001;
    this.legPhase += dt * 0.008;
    if (this.x < -100 || this.x > CONFIG.WIDTH + 100 ||
        this.y < -100 || this.y > CONFIG.HEIGHT + 100) this.dead = true;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const facingAngle = Math.atan2(this.vy, this.vx);

    // 8 legs
    ctx.strokeStyle = this.color;
    ctx.lineWidth   = 1.5;
    const legOffsets = [-0.9, -0.45, 0.45, 0.9];
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const a   = facingAngle + side * (Math.PI * 0.55 + legOffsets[i]);
        const len = 13 + Math.sin(this.legPhase + i * 0.7) * 3;
        const bx  = Math.cos(a) * len * 0.55;
        const by  = Math.sin(a) * len * 0.55;
        const tx  = Math.cos(a + side * 0.25) * len;
        const ty  = Math.sin(a + side * 0.25) * len;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(bx, by, tx, ty);
        ctx.stroke();
      }
    }

    // Body
    ctx.shadowColor = this.color;
    ctx.shadowBlur  = 12;
    ctx.fillStyle   = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Eyes
    ctx.fillStyle = '#FF3300';
    for (const ex of [-3.5, 3.5]) {
      ctx.beginPath();
      ctx.arc(ex, -4, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// =============================================================================
// Snake — SegFault Snake
// =============================================================================
class Snake extends Entity {
  constructor(x, y, player) {
    super(x, y, 10);
    this.hp         = 1;
    this.speed      = 170 + Math.random() * 40;
    this.sinePhase  = 0;
    this.baseAngle  = Math.atan2(player.y - y, player.x - x);
    this.color      = CONFIG.COLORS.snake;
    this.spineX     = x;
    this.spineY     = y;
  }

  update(dt, player) {
    const s = dt * 0.001;
    this.sinePhase += dt * 0.005;
    this.spineX += Math.cos(this.baseAngle) * this.speed * s;
    this.spineY += Math.sin(this.baseAngle) * this.speed * s;

    const perp   = this.baseAngle + Math.PI / 2;
    const offset = Math.sin(this.sinePhase) * 28;
    this.x = this.spineX + Math.cos(perp) * offset;
    this.y = this.spineY + Math.sin(perp) * offset;

    // Slight homing
    const dx   = player.x - this.x;
    const dy   = player.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    this.baseAngle += Math.atan2(dy / dist, dx / dist) * 0.025;

    if (this.x < -50 || this.x > CONFIG.WIDTH + 50 ||
        this.y < -50 || this.y > CONFIG.HEIGHT + 50) this.dead = true;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.shadowColor = this.color;
    ctx.shadowBlur  = 14;

    const perp = this.baseAngle + Math.PI / 2;
    const segColors = ['#1a5c0a', '#237512', '#2d9916', '#35bb1b', this.color];
    for (let i = 4; i >= 0; i--) {
      const segOffset = Math.sin(this.sinePhase - i * 0.55) * 28;
      const sx = Math.cos(perp) * (segOffset - Math.sin(this.sinePhase) * 28) + Math.cos(this.baseAngle + Math.PI) * i * 9;
      const sy = Math.sin(perp) * (segOffset - Math.sin(this.sinePhase) * 28) + Math.sin(this.baseAngle + Math.PI) * i * 9;
      ctx.fillStyle = segColors[i];
      ctx.beginPath();
      ctx.arc(sx, sy, 9 - i * 0.9, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tongue
    ctx.shadowBlur  = 0;
    ctx.strokeStyle = '#FF1111';
    ctx.lineWidth   = 1.2;
    const tlen = 11;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const ta = this.baseAngle;
    ctx.lineTo(Math.cos(ta) * tlen * 0.7, Math.sin(ta) * tlen * 0.7);
    ctx.moveTo(Math.cos(ta) * tlen * 0.7, Math.sin(ta) * tlen * 0.7);
    ctx.lineTo(Math.cos(ta - 0.3) * tlen, Math.sin(ta - 0.3) * tlen);
    ctx.moveTo(Math.cos(ta) * tlen * 0.7, Math.sin(ta) * tlen * 0.7);
    ctx.lineTo(Math.cos(ta + 0.3) * tlen, Math.sin(ta + 0.3) * tlen);
    ctx.stroke();

    ctx.restore();
  }
}

// =============================================================================
// Octopus — InfiniteLoop Octopus
// =============================================================================
class Octopus extends Entity {
  constructor(x, y) {
    super(x, y, 16);
    this.hp              = 4;
    this.orbitAngle      = Math.atan2(y - CONFIG.HEIGHT / 2, x - CONFIG.WIDTH / 2);
    this.orbitRadius     = Math.min(CONFIG.WIDTH, CONFIG.HEIGHT) * 0.42;
    this.orbitSpeed      = 0.55 + Math.random() * 0.25;
    this.chargeTimer     = 2800 + Math.random() * 1500;
    this.charging        = false;
    this.chargeVx        = 0;
    this.chargeVy        = 0;
    this.chargeDuration  = 0;
    this.tentaclePhase   = Math.random() * Math.PI * 2;
    this.color           = CONFIG.COLORS.octopus;
  }

  update(dt, player) {
    this.tentaclePhase += dt * 0.004;

    if (this.charging) {
      this.x += this.chargeVx * dt * 0.001;
      this.y += this.chargeVy * dt * 0.001;
      this.chargeVx += (player.x - this.x) * 0.05;
      this.chargeVy += (player.y - this.y) * 0.05;
      this.chargeDuration -= dt;
      if (this.chargeDuration <= 0) {
        this.charging = false;
        this.chargeTimer = 3000 + Math.random() * 1500;
        // Reattach to orbit
        this.orbitAngle = Math.atan2(this.y - CONFIG.HEIGHT / 2, this.x - CONFIG.WIDTH / 2);
      }
    } else {
      this.orbitRadius = Math.min(CONFIG.WIDTH, CONFIG.HEIGHT) * 0.42;
      this.orbitAngle += this.orbitSpeed * dt * 0.001;
      this.x = CONFIG.WIDTH  / 2 + Math.cos(this.orbitAngle) * this.orbitRadius;
      this.y = CONFIG.HEIGHT / 2 + Math.sin(this.orbitAngle) * this.orbitRadius;

      this.chargeTimer -= dt;
      if (this.chargeTimer <= 0) {
        this.charging = true;
        const dx   = player.x - this.x;
        const dy   = player.y - this.y;
        const dist = Math.hypot(dx, dy) || 1;
        const cspeed = 320;
        this.chargeVx       = (dx / dist) * cspeed;
        this.chargeVy       = (dy / dist) * cspeed;
        this.chargeDuration = 900;
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.shadowColor = this.color;
    ctx.shadowBlur  = 18;

    // Tentacles
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const wave  = Math.sin(this.tentaclePhase + i * 0.78) * 9;
      const cpx   = Math.cos(angle + 0.4) * 20 + wave;
      const cpy   = Math.sin(angle + 0.4) * 20;
      const ex    = Math.cos(angle) * 30;
      const ey    = Math.sin(angle) * 30;
      ctx.strokeStyle = this.color;
      ctx.lineWidth   = 3.5 - i * 0.15;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(cpx, cpy, ex, ey);
      ctx.stroke();
    }

    // Body disc
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();

    // Glow ring when charging
    if (this.charging) {
      ctx.shadowBlur  = 0;
      ctx.strokeStyle = '#FF88FF';
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.stroke();
    }

    // ∞ symbol
    ctx.shadowBlur  = 0;
    ctx.fillStyle   = '#E8D5F5';
    ctx.font        = '11px Courier New';
    ctx.textAlign   = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('∞', 0, 0);

    ctx.restore();
  }
}

// =============================================================================
// Ghost — MemoryLeak Ghost
// =============================================================================
class Ghost extends Entity {
  constructor(x, y) {
    super(x, y, 14);
    this.hp          = 3;
    this.speed       = 44 + Math.random() * 16;
    this.floatPhase  = Math.random() * Math.PI * 2;
    this.color       = CONFIG.COLORS.ghost;
  }

  update(dt, player) {
    const dx   = player.x - this.x;
    const dy   = player.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    this.vx = (dx / dist) * this.speed;
    this.vy = (dy / dist) * this.speed;
    this.x += this.vx * dt * 0.001;
    this.y += this.vy * dt * 0.001;
    this.floatPhase += dt * 0.003;
    if (this.x < -100 || this.x > CONFIG.WIDTH + 100 ||
        this.y < -100 || this.y > CONFIG.HEIGHT + 100) this.dead = true;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const pulse  = 0.5 + 0.5 * Math.sin(this.floatPhase * 2);
    const floatY = Math.sin(this.floatPhase) * 5;

    ctx.globalAlpha = 0.55;
    ctx.shadowColor = this.color;
    ctx.shadowBlur  = 12 + pulse * 14;
    ctx.translate(0, floatY);

    // Ghost silhouette
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, -5, 14, Math.PI, 0);
    // Wavy skirt
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      const sx = -14 + (i / steps) * 28;
      const sy =  9 + Math.sin(i * Math.PI + this.floatPhase * 2.5) * 4;
      ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.fill();

    // Eyes
    ctx.shadowBlur  = 0;
    ctx.globalAlpha = 0.8;
    ctx.fillStyle   = '#0d1117';
    for (const ex of [-5, 5]) {
      ctx.beginPath();
      ctx.ellipse(ex, -6, 3, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tiny "NULL" tag — dev humor
    ctx.globalAlpha  = 0.35;
    ctx.fillStyle    = this.color;
    ctx.font         = '5px Courier New';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NULL', 0, 10);

    ctx.restore();
  }
}

// =============================================================================
// WaveManager
// =============================================================================
class WaveManager {
  constructor() {
    this.wave             = 0;
    this.state            = 'gap';
    this.gapTimer         = 1500;
    this.spawnQueue       = [];
    this.enemiesThisWave  = 0;
    this.waveCleared      = false;
  }

  update(dt, enemies, audio) {
    this.waveCleared = false;

    if (this.state === 'gap') {
      this.gapTimer -= dt;
      if (this.gapTimer <= 0) {
        this.wave++;
        this._buildWave();
        this.state = 'active';
      }
      return;
    }

    // Process staggered spawn queue
    if (this.spawnQueue.length > 0) {
      this.spawnQueue[0].timer -= dt;
      if (this.spawnQueue[0].timer <= 0) {
        const entry = this.spawnQueue.shift();
        enemies.push(this._spawnEnemy(entry.type, entry.player));
      }
    }

    // Wave cleared when queue empty and all enemies dead
    if (this.spawnQueue.length === 0 && enemies.length === 0) {
      this.state    = 'gap';
      this.gapTimer = CONFIG.WAVE_GAP_MS;
      this.waveCleared = true;
      audio.playWaveClear();
    }
  }

  _buildWave() {
    const w = this.wave;
    const types = [];

    // Progressive composition
    const nSpiders  = Math.min(3 + w,           10);
    const nSnakes   = Math.max(0, Math.floor(w / 2));
    const nOctopi   = Math.max(0, Math.floor((w - 2) / 2));
    const nGhosts   = Math.max(0, Math.floor((w - 3) / 3));

    for (let i = 0; i < nSpiders;  i++) types.push('Spider');
    for (let i = 0; i < nSnakes;   i++) types.push('Snake');
    for (let i = 0; i < nOctopi;   i++) types.push('Octopus');
    for (let i = 0; i < nGhosts;   i++) types.push('Ghost');

    // Shuffle
    for (let i = types.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [types[i], types[j]] = [types[j], types[i]];
    }

    this.spawnQueue = types.map((type, i) => ({ type, timer: i * 380, player: null }));
    this.enemiesThisWave = types.length;
  }

  _spawnEnemy(type, playerRef) {
    const pos = this._edgePosition();
    const p   = playerRef || { x: CONFIG.WIDTH / 2, y: CONFIG.HEIGHT / 2 };
    if (type === 'Spider')  return new Spider(pos.x, pos.y);
    if (type === 'Snake')   return new Snake(pos.x, pos.y, p);
    if (type === 'Octopus') return new Octopus(pos.x, pos.y);
    return new Ghost(pos.x, pos.y);
  }

  // Called during update to inject live player reference
  injectPlayer(player) {
    for (const entry of this.spawnQueue) entry.player = player;
  }

  _edgePosition() {
    const edge = Math.floor(Math.random() * 4);
    const W = CONFIG.WIDTH, H = CONFIG.HEIGHT;
    if (edge === 0) return { x: Math.random() * W, y: -35 };
    if (edge === 1) return { x: W + 35,  y: Math.random() * H };
    if (edge === 2) return { x: Math.random() * W, y: H + 35 };
    return { x: -35, y: Math.random() * H };
  }
}

// =============================================================================
// Game
// =============================================================================
class Game {
  constructor() {
    this.canvas   = document.getElementById('gameCanvas');
    this.ctx      = this.canvas.getContext('2d');
    this.state    = 'MENU';
    this.lastTs   = 0;
    this.shakeX   = 0;
    this.shakeY   = 0;

    this.player   = null;
    this.enemies  = [];
    this.bullets  = [];
    this.ps       = new ParticleSystem();
    this.waves    = new WaveManager();
    this.audio    = new AudioManager();
    this.input    = new InputManager(this.canvas);

    this.score      = 0;
    this.combo      = 1;
    this.comboTimer = 0;
    this.highScore  = parseInt(localStorage.getItem(CONFIG.HS_KEY)) || 0;

    this._initCanvas();
    window.addEventListener('resize', () => this._onResize());
    this._startLoop();
  }

  _initCanvas() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width  = CONFIG.WIDTH  * dpr;
    this.canvas.height = CONFIG.HEIGHT * dpr;
    this.canvas.style.width  = CONFIG.WIDTH  + 'px';
    this.canvas.style.height = CONFIG.HEIGHT + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  _onResize() {
    CONFIG.WIDTH  = window.innerWidth;
    CONFIG.HEIGHT = window.innerHeight;
    this._initCanvas();
    if (this.player) {
      this.player.x = Math.max(this.player.radius, Math.min(CONFIG.WIDTH  - this.player.radius, this.player.x));
      this.player.y = Math.max(this.player.radius, Math.min(CONFIG.HEIGHT - this.player.radius, this.player.y));
    }
  }

  _startLoop() {
    const loop = (ts) => {
      let dt = ts - this.lastTs;
      this.lastTs = ts;
      if (dt > CONFIG.MAX_DT) dt = CONFIG.MAX_DT;
      if (dt < 0) dt = 0;
      this._loop(dt, ts);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  _loop(dt, ts) {
    if (this.state === 'PLAYING') this._update(dt, ts);
    this._draw(ts);
  }

  // ---- State Transitions ----

  toPlaying() {
    this.score      = 0;
    this.combo      = 1;
    this.comboTimer = 0;
    this.enemies    = [];
    this.bullets    = [];
    this.ps         = new ParticleSystem();
    this.waves      = new WaveManager();
    this.player     = new Player(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);
    this.shakeX     = 0;
    this.shakeY     = 0;
    this.state      = 'PLAYING';
  }

  toPaused() { this.state = 'PAUSED'; }

  toResumed() { this.state = 'PLAYING'; }

  toGameOver() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem(CONFIG.HS_KEY, this.highScore);
    }
    this.state = 'GAME_OVER';
  }

  // ---- Update ----

  _update(dt, ts) {
    const input = this.input;

    // Pause
    if (input.consumePause()) { this.toPaused(); return; }

    // Inject live player reference for snake homing
    this.waves.injectPlayer(this.player);

    // Shoot
    if (input.isShootingHeld()) {
      const bullet = this.player.tryShoot(this.audio);
      if (bullet) this.bullets.push(bullet);
    }

    // Update player
    this.player.update(dt, input);

    // Update bullets
    for (const b of this.bullets) b.update(dt);

    // Update enemies
    for (const e of this.enemies) e.update(dt, this.player);

    // Update waves
    this.waves.update(dt, this.enemies, this.audio);

    // Update particles
    this.ps.update(dt);

    // Combo timeout
    if (this.combo > 1) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) { this.combo = 1; this.comboTimer = 0; }
    }

    // Shake decay
    this.shakeX *= CONFIG.SHAKE_DECAY;
    this.shakeY *= CONFIG.SHAKE_DECAY;
    if (Math.abs(this.shakeX) < 0.1) this.shakeX = 0;
    if (Math.abs(this.shakeY) < 0.1) this.shakeY = 0;

    this._checkCollisions();
  }

  _checkCollisions() {
    // Bullets vs Enemies
    for (const b of this.bullets) {
      if (b.dead) continue;
      for (const e of this.enemies) {
        if (e.dead) continue;
        if (b.collidesWith(e)) {
          b.dead = true;
          e.hp--;
          if (e.hp <= 0) {
            e.dead = true;
            this._onKill(e);
          }
          break;
        }
      }
    }

    // Enemies vs Player
    if (this.player.invincibleTimer <= 0) {
      for (const e of this.enemies) {
        if (e.dead) continue;
        if (e.collidesWith(this.player)) {
          this.player.takeDamage(this.audio);
          this.combo      = 1;
          this.comboTimer = 0;
          this._shake(9);
          if (this.player.hp <= 0) { this.toGameOver(); return; }
          break;
        }
      }
    }

    // Cull
    this.bullets = this.bullets.filter(b => !b.dead);
    this.enemies = this.enemies.filter(e => !e.dead);
  }

  _onKill(enemy) {
    this.combo      = Math.min(this.combo + 1, 10);
    this.comboTimer = CONFIG.COMBO_RESET_MS;
    this.score     += (CONFIG.BASE_SCORES[enemy.constructor.name] || 10) * this.combo;
    this.ps.emit(enemy.x, enemy.y, enemy.color, 18, {
      speedMin: 60, speedMax: 200, lifeMin: 300, lifeMax: 700, radiusMin: 2, radiusMax: 6
    });
    this.audio.playPop();
    this._shake(4);
  }

  _shake(magnitude) {
    this.shakeX = (Math.random() * 2 - 1) * magnitude;
    this.shakeY = (Math.random() * 2 - 1) * magnitude;
  }

  _isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  // ---- Draw ----

  _draw(ts) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

    if (this.state === 'MENU')      { this._drawMenu(ts);     return; }
    if (this.state === 'GAME_OVER') { this._drawGameOver(ts); return; }

    this._drawGame(ts);

    if (this.state === 'PAUSED') {
      ctx.save();
      ctx.fillStyle = 'rgba(13,17,23,0.6)';
      ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
      ctx.fillStyle   = CONFIG.COLORS.hud;
      ctx.font        = 'bold 36px Courier New';
      ctx.textAlign   = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = CONFIG.COLORS.accent;
      ctx.shadowBlur  = 20;
      ctx.fillText('// PAUSED', CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 20);
      ctx.shadowBlur  = 0;
      ctx.font        = '14px Courier New';
      ctx.fillStyle   = CONFIG.COLORS.dim;
      const resumeHint = this._isTouchDevice() ? 'TAP ANYWHERE TO RESUME' : 'PRESS P TO RESUME';
      ctx.fillText(resumeHint, CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 + 20);
      ctx.restore();
    }

    // Paused input handling
    if (this.state === 'PAUSED') {
      if (this.input.consumePause()) this.toResumed();
      else if (this._isTouchDevice() && this.input.consumeClick()) this.toResumed();
    }
  }

  _drawGame(ts) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.shakeX, this.shakeY);

    // Background
    ctx.fillStyle = CONFIG.COLORS.bg;
    ctx.fillRect(-Math.abs(this.shakeX) - 2, -Math.abs(this.shakeY) - 2, CONFIG.WIDTH + 4, CONFIG.HEIGHT + 4);

    // Arena edge hint (subtle grid dots)
    ctx.fillStyle = '#1a2233';
    for (let gx = 40; gx < CONFIG.WIDTH; gx += 40) {
      for (let gy = 40; gy < CONFIG.HEIGHT; gy += 40) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Entities
    this.ps.draw(ctx);
    for (const e of this.enemies) e.draw(ctx);
    for (const b of this.bullets) b.draw(ctx);
    this.player.draw(ctx);

    ctx.restore();

    // HUD (no shake)
    this._drawHUD(ts);
    this._drawTouchOverlay();
    this._drawCRT();
  }

  _drawHUD(ts) {
    const ctx = this.ctx;
    ctx.save();

    // Health hearts
    for (let i = 0; i < CONFIG.PLAYER_MAX_HP; i++) {
      ctx.fillStyle    = i < this.player.hp ? '#FF4444' : '#2a1a1a';
      ctx.font         = '22px Courier New';
      ctx.textBaseline = 'top';
      ctx.textAlign    = 'left';
      ctx.shadowColor  = i < this.player.hp ? '#FF4444' : 'transparent';
      ctx.shadowBlur   = i < this.player.hp ? 6 : 0;
      ctx.fillText('♥', 14 + i * 26, 10);
    }
    ctx.shadowBlur = 0;

    // Score
    ctx.fillStyle    = CONFIG.COLORS.hud;
    ctx.font         = 'bold 22px Courier New';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(this.score, CONFIG.WIDTH / 2, 8);

    // High score
    ctx.fillStyle = CONFIG.COLORS.dim;
    ctx.font      = '11px Courier New';
    ctx.fillText('HI ' + this.highScore, CONFIG.WIDTH / 2, 33);

    // Combo
    if (this.combo > 1) {
      const pulse = 1 + Math.sin(ts * 0.01) * 0.06;
      ctx.textAlign = 'right';
      ctx.fillStyle = this.combo >= 5 ? CONFIG.COLORS.player : CONFIG.COLORS.accent;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur  = 10;
      ctx.font        = 'bold ' + Math.floor((13 + this.combo) * pulse) + 'px Courier New';
      ctx.fillText('x' + this.combo + ' COMBO', CONFIG.WIDTH - 12, 10);
      ctx.shadowBlur  = 0;
    }

    // Wave label (bottom center)
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle    = CONFIG.COLORS.dim;
    ctx.font         = '13px Courier New';
    const waveText = this.waves.state === 'gap'
      ? (this.waves.wave === 0 ? 'GET READY...' : 'WAVE ' + (this.waves.wave + 1) + ' INCOMING...')
      : 'WAVE ' + this.waves.wave;
    ctx.fillText(waveText, CONFIG.WIDTH / 2, CONFIG.HEIGHT - 8);

    ctx.restore();
  }

  _drawCRT() {
    const ctx = this.ctx;
    ctx.save();
    // Scanlines
    ctx.fillStyle   = '#000000';
    ctx.globalAlpha = 0.04;
    for (let y = 0; y < CONFIG.HEIGHT; y += 3) {
      ctx.fillRect(0, y, CONFIG.WIDTH, 1);
    }
    // Vignette
    ctx.globalAlpha = 0.22;
    const grad = ctx.createRadialGradient(
      CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2, CONFIG.HEIGHT * 0.28,
      CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2, CONFIG.HEIGHT * 0.82
    );
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.9)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
    ctx.restore();
  }

  _drawTouchOverlay() {
    if (!this._isTouchDevice()) return;
    const ctx = this.ctx;
    const j   = this.input.touch.joystick;
    const s   = this.input.touch.shoot;
    ctx.save();

    // Vertical divider
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(CONFIG.WIDTH / 2, 0);
    ctx.lineTo(CONFIG.WIDTH / 2, CONFIG.HEIGHT);
    ctx.stroke();

    // Zone labels when idle
    ctx.font         = '11px Courier New';
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign    = 'center';
    if (!j.active) {
      ctx.fillStyle = CONFIG.COLORS.dim;
      ctx.fillText('MOVE', CONFIG.WIDTH * 0.25, CONFIG.HEIGHT - 35);
    }
    if (!s.active) {
      ctx.fillStyle = CONFIG.COLORS.dim;
      ctx.fillText('SHOOT', CONFIG.WIDTH * 0.75, CONFIG.HEIGHT - 35);
    }

    // Joystick visual
    if (j.active) {
      const dx    = j.curX - j.startX;
      const dy    = j.curY - j.startY;
      const dist  = Math.hypot(dx, dy);
      const maxR  = 45;
      const cx    = j.startX + (dist > maxR ? (dx / dist) * maxR : dx);
      const cy    = j.startY + (dist > maxR ? (dy / dist) * maxR : dy);
      // Outer ring
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.arc(j.startX, j.startY, maxR, 0, Math.PI * 2);
      ctx.stroke();
      // Inner dot
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shoot crosshair
    if (s.active) {
      ctx.strokeStyle = CONFIG.COLORS.player;
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,215,0,0.4)';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(s.x - 30, s.y); ctx.lineTo(s.x + 30, s.y);
      ctx.moveTo(s.x, s.y - 30); ctx.lineTo(s.x, s.y + 30);
      ctx.stroke();
    }

    ctx.restore();
  }

  _drawMenu(ts) {
    const ctx = this.ctx;
    ctx.fillStyle = CONFIG.COLORS.bg;
    ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

    const titleY    = Math.round(CONFIG.HEIGHT * 0.17);
    const subtitleY = Math.round(CONFIG.HEIGHT * 0.23);
    const duckY     = Math.round(CONFIG.HEIGHT * 0.42);
    const ctrlYBase = Math.round(CONFIG.HEIGHT * 0.60);
    const promptY   = Math.round(CONFIG.HEIGHT * 0.78);
    const hsY       = Math.round(CONFIG.HEIGHT * 0.84);

    // Title
    ctx.save();
    ctx.textAlign    = 'center';
    ctx.shadowColor  = CONFIG.COLORS.player;
    ctx.shadowBlur   = 35;
    ctx.fillStyle    = CONFIG.COLORS.player;
    ctx.font         = 'bold 56px Courier New';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('BUG SQUASHER', CONFIG.WIDTH / 2, titleY);
    ctx.shadowBlur   = 0;

    ctx.fillStyle = CONFIG.COLORS.accent;
    ctx.font      = '15px Courier New';
    ctx.fillText('rubber duck debugging, taken literally', CONFIG.WIDTH / 2, subtitleY);
    ctx.restore();

    // Duck illustration (centered, large)
    this._drawMenuDuck(ctx, CONFIG.WIDTH / 2, duckY, ts);

    // Controls
    ctx.save();
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle    = CONFIG.COLORS.dim;
    ctx.font         = '13px Courier New';
    const lines = this._isTouchDevice()
      ? ['TAP LEFT HALF — move', 'TAP RIGHT HALF — aim + shoot', 'Tap both sides simultaneously']
      : ['WASD / ARROWS — move', 'MOUSE AIM + CLICK — shoot', 'P — pause'];
    lines.forEach((ln, i) => ctx.fillText(ln, CONFIG.WIDTH / 2, ctrlYBase + i * 22));
    ctx.restore();

    // Enemies preview row
    this._drawEnemyPreviews(ctx, ts);

    // Flashing start prompt
    if (Math.floor(ts / 540) % 2 === 0) {
      ctx.save();
      ctx.fillStyle    = CONFIG.COLORS.hud;
      ctx.font         = 'bold 17px Courier New';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'alphabetic';
      const promptText = this._isTouchDevice() ? '[ TAP ANYWHERE TO START ]' : '[ CLICK OR PRESS SPACE TO START ]';
      ctx.fillText(promptText, CONFIG.WIDTH / 2, promptY);
      ctx.restore();
    }

    // High score
    if (this.highScore > 0) {
      ctx.save();
      ctx.fillStyle    = CONFIG.COLORS.accent;
      ctx.font         = '13px Courier New';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('HIGH SCORE: ' + this.highScore, CONFIG.WIDTH / 2, hsY);
      ctx.restore();
    }

    this._drawCRT();

    // Start game on click/space
    if (this.input.consumeAction() || this.input.consumeClick()) this.toPlaying();
  }

  _drawMenuDuck(ctx, x, y, ts) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2.2, 2.2);
    ctx.rotate(Math.sin(ts * 0.0018) * 0.18);

    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur  = 8;

    // Body
    ctx.fillStyle = CONFIG.COLORS.player;
    ctx.beginPath();
    ctx.ellipse(0, 3, 17, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#CC9900';
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    // Head
    ctx.fillStyle = CONFIG.COLORS.player;
    ctx.beginPath();
    ctx.arc(7, -10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#CC9900';
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    // Bill
    ctx.shadowBlur  = 0;
    ctx.fillStyle   = '#FF8C00';
    ctx.beginPath();
    ctx.moveTo(15, -11);
    ctx.quadraticCurveTo(28, -9, 26, -5);
    ctx.lineTo(15, -6);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.translate(10, -13);
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    const ex = Math.cos(ts * 0.0012) * 1.5;
    const ey = Math.sin(ts * 0.0012) * 1.5;
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(ex, ey, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  _drawEnemyPreviews(ctx, ts) {
    const previewY = Math.round(CONFIG.HEIGHT * 0.72);
    const previews = [
      { label: 'NULL PTR SPIDER',  color: CONFIG.COLORS.spider,  x: Math.round(CONFIG.WIDTH * 0.23) },
      { label: 'SEGFAULT SNAKE',   color: CONFIG.COLORS.snake,   x: Math.round(CONFIG.WIDTH * 0.41) },
      { label: 'INFINITE LOOP ∞',  color: CONFIG.COLORS.octopus, x: Math.round(CONFIG.WIDTH * 0.59) },
      { label: 'MEMORY LEAK',      color: CONFIG.COLORS.ghost,   x: Math.round(CONFIG.WIDTH * 0.78) },
    ];
    previews.forEach(p => {
      ctx.save();
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle    = p.color;
      ctx.shadowColor  = p.color;
      ctx.shadowBlur   = 8;
      ctx.font         = '9px Courier New';
      ctx.fillText(p.label, p.x, previewY);
      ctx.restore();
    });
  }

  _drawGameOver(ts) {
    const ctx = this.ctx;

    // Still render game behind (frozen)
    this._drawGame(ts);

    ctx.save();
    ctx.fillStyle = 'rgba(13,17,23,0.88)';
    ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

    ctx.textAlign    = 'center';
    ctx.textBaseline = 'alphabetic';

    ctx.shadowColor = '#FF4444';
    ctx.shadowBlur  = 24;
    ctx.fillStyle   = '#FF4444';
    ctx.font        = 'bold 44px Courier New';
    ctx.fillText('SEGMENTATION FAULT', CONFIG.WIDTH / 2, Math.round(CONFIG.HEIGHT * 0.35));

    ctx.shadowBlur  = 0;
    ctx.fillStyle   = CONFIG.COLORS.dim;
    ctx.font        = '14px Courier New';
    ctx.fillText('(core dumped)', CONFIG.WIDTH / 2, Math.round(CONFIG.HEIGHT * 0.40));

    ctx.fillStyle   = CONFIG.COLORS.hud;
    ctx.font        = 'bold 30px Courier New';
    ctx.fillText('SCORE: ' + this.score, CONFIG.WIDTH / 2, Math.round(CONFIG.HEIGHT * 0.50));

    if (this.score > 0 && this.score >= this.highScore) {
      ctx.fillStyle   = CONFIG.COLORS.player;
      ctx.shadowColor = CONFIG.COLORS.player;
      ctx.shadowBlur  = 14;
      ctx.font        = 'bold 18px Courier New';
      ctx.fillText('NEW HIGH SCORE!', CONFIG.WIDTH / 2, Math.round(CONFIG.HEIGHT * 0.56));
      ctx.shadowBlur  = 0;
    } else if (this.highScore > 0) {
      ctx.fillStyle = CONFIG.COLORS.dim;
      ctx.font      = '14px Courier New';
      ctx.fillText('BEST: ' + this.highScore, CONFIG.WIDTH / 2, Math.round(CONFIG.HEIGHT * 0.56));
    }

    if (Math.floor(ts / 540) % 2 === 0) {
      ctx.fillStyle = CONFIG.COLORS.hud;
      ctx.font      = 'bold 16px Courier New';
      const restartText = this._isTouchDevice() ? '[ TAP TO RESTART ]' : '[ CLICK OR SPACE TO RESTART ]';
      ctx.fillText(restartText, CONFIG.WIDTH / 2, Math.round(CONFIG.HEIGHT * 0.70));
    }

    this._drawCRT();
    ctx.restore();

    if (this.input.consumeAction() || this.input.consumeClick()) this.toPlaying();
  }
}

// =============================================================================
// Bootstrap
// =============================================================================
window.addEventListener('load', () => { window.game = new Game(); });
