// =============================================================================
// BUG SQUASHER — Rubber Duck Debugging: The Game  v1.2.0
// =============================================================================
// Architecture:
//   CONFIG / STRINGS / T()  — constants, i18n translations, translation helper
//   AudioManager            — Web Audio API synthesized sounds (no files)
//   InputManager            — keyboard + mouse + virtual touch joystick
//   Particle / ParticleSystem
//   Entity (base) → Bullet, Player, Spider, Snake, Octopus, Ghost
//   WaveManager             — progressive wave spawning
//   Game                    — orchestrator, state machine, main loop
//
// State machine:  LANG_SELECT → NAME_INPUT → MENU → PLAYING → PAUSED → GAME_OVER
//                                            MENU ←────────────────────────────┘
// =============================================================================

// =============================================================================
// CONFIG
// =============================================================================
const CONFIG = {
  WIDTH:  window.innerWidth,
  HEIGHT: window.innerHeight,
  MAX_DT: 50,

  PLAYER_SPEED:         260,
  PLAYER_RADIUS:        18,
  PLAYER_MAX_HP:        5,
  PLAYER_INVINCIBLE_MS: 1200,
  BULLET_SPEED:         500,
  BULLET_RADIUS:        5,
  SHOOT_COOLDOWN:       130,

  COMBO_RESET_MS:  3000,
  SHAKE_DECAY:     0.82,
  WAVE_GAP_MS:     1800,

  BASE_SCORES: { Spider: 10, Snake: 15, Octopus: 20, Ghost: 25 },

  MASTER_VOLUME:   0.28,
  HS_KEY:          'bugSquasher_hs',
  LANG_KEY:        'bugSquasher_lang',
  SCORES_KEY:      'bugSquasher_scores',

  // Set a Firebase Realtime DB URL here to enable online leaderboard.
  // e.g. 'https://your-project-default-rtdb.firebaseio.com/scores'
  LEADERBOARD_URL: '',

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
    card:    '#161b22',
    cardHov: '#1f2937',
  }
};

// =============================================================================
// STRINGS  (i18n)
// =============================================================================
const STRINGS = {
  en: {
    subtitle:      'rubber duck debugging, taken literally',
    ctrl_move_t:   'TAP LEFT — move',
    ctrl_shoot_t:  'TAP RIGHT — aim + shoot',
    ctrl_both_t:   'Use both sides simultaneously',
    ctrl_move:     'WASD / ARROWS — move',
    ctrl_shoot:    'MOUSE + CLICK — shoot',
    ctrl_pause:    'P — pause',
    start_t:       '[ TAP TO START ]',
    start:         '[ CLICK OR SPACE TO START ]',
    hi_score:      'HIGH SCORE',
    paused:        '// PAUSED',
    resume_t:      'TAP ANYWHERE TO RESUME',
    resume:        'PRESS P TO RESUME',
    get_ready:     'GET READY...',
    wave_in:       'WAVE {n} INCOMING...',
    wave:          'WAVE {n}',
    move:          'MOVE',
    shoot:         'SHOOT',
    seg_fault:     'SEGMENTATION FAULT',
    core_dump:     '(core dumped)',
    score_lbl:     'SCORE',
    new_hi:        'NEW HIGH SCORE!',
    best:          'BEST',
    restart_t:     '[ TAP TO RESTART ]',
    restart:       '[ CLICK OR SPACE TO RESTART ]',
    lang_title:    'SELECT LANGUAGE',
    lang_sub:      'Your browser language was pre-selected',
    name_title:    'ENTER YOUR NAME',
    name_sub:      'This will appear on the leaderboard',
    name_hint:     'Press ENTER to confirm',
    name_hint_t:   'Tap CONFIRM to continue',
    name_back:     '← back',
    name_confirm:  'CONFIRM →',
    leaderboard:   'LEADERBOARD',
    submitting:    'Saving score...',
    lb_rank:       '#',
    lb_name:       'NAME',
    lb_score:      'SCORE',
    lb_wave:       'WAVE',
    lb_offline:    'Offline — score saved locally',
    enemy_spider:  'NULL PTR SPIDER',
    enemy_snake:   'SEGFAULT SNAKE',
    enemy_octopus: 'INFINITE LOOP ∞',
    enemy_ghost:   'MEMORY LEAK',
    combo:         'COMBO',
  },
  de: {
    subtitle:      'Rubber-Duck-Debugging, wörtlich genommen',
    ctrl_move_t:   'LINKS TIPPEN — bewegen',
    ctrl_shoot_t:  'RECHTS TIPPEN — zielen + schießen',
    ctrl_both_t:   'Beide Seiten gleichzeitig nutzen',
    ctrl_move:     'WASD / PFEILE — bewegen',
    ctrl_shoot:    'MAUS + KLICK — schießen',
    ctrl_pause:    'P — Pause',
    start_t:       '[ TIPPEN UM ZU STARTEN ]',
    start:         '[ KLICKEN ODER LEERTASTE ]',
    hi_score:      'HIGHSCORE',
    paused:        '// PAUSE',
    resume_t:      'TIPPEN UM FORTZUFAHREN',
    resume:        'P DRÜCKEN UM FORTZUFAHREN',
    get_ready:     'BEREIT MACHEN...',
    wave_in:       'WELLE {n} KOMMT...',
    wave:          'WELLE {n}',
    move:          'BEWEGEN',
    shoot:         'SCHIESSEN',
    seg_fault:     'SEGMENTATION FAULT',
    core_dump:     '(core dumped)',
    score_lbl:     'PUNKTE',
    new_hi:        'NEUER HIGHSCORE!',
    best:          'BEST',
    restart_t:     '[ TIPPEN ZUM NEUSTART ]',
    restart:       '[ KLICK ODER LEERTASTE ]',
    lang_title:    'SPRACHE WÄHLEN',
    lang_sub:      'Deine Browser-Sprache wurde vorausgewählt',
    name_title:    'DEINEN NAMEN EINGEBEN',
    name_sub:      'Er erscheint in der Bestenliste',
    name_hint:     'ENTER drücken zum Bestätigen',
    name_hint_t:   'BESTÄTIGEN tippen',
    name_back:     '← zurück',
    name_confirm:  'BESTÄTIGEN →',
    leaderboard:   'BESTENLISTE',
    submitting:    'Punkte werden gespeichert...',
    lb_rank:       '#',
    lb_name:       'NAME',
    lb_score:      'PUNKTE',
    lb_wave:       'WELLE',
    lb_offline:    'Offline — lokal gespeichert',
    enemy_spider:  'NULL-PTR-SPINNE',
    enemy_snake:   'SEGFAULT-SCHLANGE',
    enemy_octopus: 'ENDLOSSCHLEIFE ∞',
    enemy_ghost:   'SPEICHERLECK',
    combo:         'KOMBO',
  },
  fr: {
    subtitle:      'débogage par canard en caoutchouc, au pied de la lettre',
    ctrl_move_t:   'GAUCHE — déplacer',
    ctrl_shoot_t:  'DROITE — viser + tirer',
    ctrl_both_t:   'Utiliser les deux côtés simultanément',
    ctrl_move:     'WASD / FLÈCHES — déplacer',
    ctrl_shoot:    'SOURIS + CLIC — tirer',
    ctrl_pause:    'P — pause',
    start_t:       '[ TOUCHER POUR COMMENCER ]',
    start:         '[ CLIC OU ESPACE POUR COMMENCER ]',
    hi_score:      'MEILLEUR SCORE',
    paused:        '// PAUSE',
    resume_t:      'TOUCHER POUR REPRENDRE',
    resume:        'APPUYER P POUR REPRENDRE',
    get_ready:     'PRÉPAREZ-VOUS...',
    wave_in:       'VAGUE {n} EN APPROCHE...',
    wave:          'VAGUE {n}',
    move:          'DÉPLACER',
    shoot:         'TIRER',
    seg_fault:     'SEGMENTATION FAULT',
    core_dump:     '(core dumped)',
    score_lbl:     'SCORE',
    new_hi:        'NOUVEAU RECORD!',
    best:          'MEILLEUR',
    restart_t:     '[ TOUCHER POUR RECOMMENCER ]',
    restart:       '[ CLIC OU ESPACE POUR RECOMMENCER ]',
    lang_title:    'CHOISIR LA LANGUE',
    lang_sub:      'La langue de votre navigateur a été présélectionnée',
    name_title:    'ENTREZ VOTRE NOM',
    name_sub:      'Il apparaîtra dans le classement',
    name_hint:     'ENTRÉE pour confirmer',
    name_hint_t:   'Appuyer sur CONFIRMER',
    name_back:     '← retour',
    name_confirm:  'CONFIRMER →',
    leaderboard:   'CLASSEMENT',
    submitting:    'Enregistrement du score...',
    lb_rank:       '#',
    lb_name:       'NOM',
    lb_score:      'SCORE',
    lb_wave:       'VAGUE',
    lb_offline:    'Hors ligne — score enregistré localement',
    enemy_spider:  'ARAIGNÉE NULL PTR',
    enemy_snake:   'SERPENT SEGFAULT',
    enemy_octopus: 'PIEUVRE BOUCLE ∞',
    enemy_ghost:   'FANTÔME FUITE MÉM.',
    combo:         'COMBO',
  },
  es: {
    subtitle:      'depuración con pato de goma, tomada literalmente',
    ctrl_move_t:   'IZQUIERDA — mover',
    ctrl_shoot_t:  'DERECHA — apuntar + disparar',
    ctrl_both_t:   'Usar ambos lados simultáneamente',
    ctrl_move:     'WASD / FLECHAS — mover',
    ctrl_shoot:    'RATÓN + CLIC — disparar',
    ctrl_pause:    'P — pausa',
    start_t:       '[ TOCA PARA COMENZAR ]',
    start:         '[ CLIC O ESPACIO PARA COMENZAR ]',
    hi_score:      'PUNTUACIÓN MÁX.',
    paused:        '// PAUSA',
    resume_t:      'TOCA PARA CONTINUAR',
    resume:        'PRESIONA P PARA CONTINUAR',
    get_ready:     'PREPÁRATE...',
    wave_in:       'OLA {n} EN CAMINO...',
    wave:          'OLA {n}',
    move:          'MOVER',
    shoot:         'DISPARAR',
    seg_fault:     'SEGMENTATION FAULT',
    core_dump:     '(core dumped)',
    score_lbl:     'PUNTOS',
    new_hi:        '¡NUEVO RÉCORD!',
    best:          'MEJOR',
    restart_t:     '[ TOCA PARA REINICIAR ]',
    restart:       '[ CLIC O ESPACIO PARA REINICIAR ]',
    lang_title:    'SELECCIONAR IDIOMA',
    lang_sub:      'El idioma de tu navegador fue preseleccionado',
    name_title:    'INGRESA TU NOMBRE',
    name_sub:      'Aparecerá en la tabla de clasificación',
    name_hint:     'ENTER para confirmar',
    name_hint_t:   'Toca CONFIRMAR',
    name_back:     '← atrás',
    name_confirm:  'CONFIRMAR →',
    leaderboard:   'CLASIFICACIÓN',
    submitting:    'Guardando puntuación...',
    lb_rank:       '#',
    lb_name:       'NOMBRE',
    lb_score:      'PUNTOS',
    lb_wave:       'OLA',
    lb_offline:    'Sin conexión — guardado localmente',
    enemy_spider:  'ARAÑA NULL PTR',
    enemy_snake:   'SERPIENTE SEGFAULT',
    enemy_octopus: 'PULPO BUCLE ∞',
    enemy_ghost:   'FANTASMA FUGA MEM.',
    combo:         'COMBO',
  },
};

// T(key, n) — translate with optional {n} substitution
function T(key, n) {
  const lang = window.__bsLang || 'en';
  const dict = STRINGS[lang] || STRINGS.en;
  let s = dict[key] !== undefined ? dict[key] : (STRINGS.en[key] || key);
  if (n !== undefined) s = s.replace('{n}', n);
  return s;
}

// =============================================================================
// AudioManager
// =============================================================================
class AudioManager {
  constructor() { this.actx = null; }

  _ensure() {
    if (!this.actx) this.actx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.actx.state === 'suspended') this.actx.resume();
  }

  _tone(freq, type, duration, volume, attack) {
    this._ensure();
    const now = this.actx.currentTime;
    const osc = this.actx.createOscillator();
    const g   = this.actx.createGain();
    osc.connect(g); g.connect(this.actx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(volume * CONFIG.MASTER_VOLUME, now + (attack || 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.start(now); osc.stop(now + duration + 0.02);
  }

  _sweep(f0, f1, type, duration, volume) {
    this._ensure();
    const now = this.actx.currentTime;
    const osc = this.actx.createOscillator();
    const g   = this.actx.createGain();
    osc.connect(g); g.connect(this.actx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(f0, now);
    osc.frequency.exponentialRampToValueAtTime(f1, now + duration);
    g.gain.setValueAtTime(volume * CONFIG.MASTER_VOLUME, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.start(now); osc.stop(now + duration + 0.02);
  }

  playShoot()  { this._tone(880,  'sine',     0.08, 0.4,  0.003); }
  playPop()    { this._sweep(440, 110, 'triangle', 0.18, 0.5); }
  playHurt()   { this._tone(120,  'sawtooth', 0.35, 0.6,  0.002); }

  playWaveClear() {
    this._ensure();
    [261.63, 329.63, 392.00].forEach((freq, i) => {
      const now = this.actx.currentTime + i * 0.085;
      const osc = this.actx.createOscillator();
      const g   = this.actx.createGain();
      osc.connect(g); g.connect(this.actx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.28 * CONFIG.MASTER_VOLUME, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      osc.start(now); osc.stop(now + 0.25);
    });
  }
}

// =============================================================================
// InputManager
// =============================================================================
class InputManager {
  constructor(canvas) {
    this.keys  = {};
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, down: false };
    this.touch = {
      joystick: { active: false, id: -1, startX: 0, startY: 0, curX: 0, curY: 0 },
      shoot:    { active: false, id: -1, x: 0, y: 0 },
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
      if (e.code === 'Space' || e.code === 'Enter') { this._actionConsumed = true; e.preventDefault(); }
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
      this.mouse.down = true; this._clickConsumed = true;
      if (e.target.tagName === 'CANVAS') e.preventDefault();
    });
    canvas.addEventListener('mouseup', () => { this.mouse.down = false; });
  }

  _bindTouch(canvas) {
    const toCanvas = (cx, cy) => {
      const r   = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      return {
        x: (cx - r.left) * (canvas.width  / r.width  / dpr),
        y: (cy - r.top)  * (canvas.height / r.height / dpr),
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
          this._clickConsumed = true; this._actionConsumed = true;
        }
      }
    }, { passive: false });
    canvas.addEventListener('touchmove', e => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        const p = toCanvas(t.clientX, t.clientY);
        if (this.touch.joystick.active && t.identifier === this.touch.joystick.id) {
          this.touch.joystick.curX = p.x; this.touch.joystick.curY = p.y;
        }
        if (this.touch.shoot.active && t.identifier === this.touch.shoot.id) {
          this.touch.shoot.x = p.x; this.touch.shoot.y = p.y;
        }
      }
    }, { passive: false });
    canvas.addEventListener('touchend', e => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        if (this.touch.joystick.active && t.identifier === this.touch.joystick.id) this.touch.joystick.active = false;
        if (this.touch.shoot.active   && t.identifier === this.touch.shoot.id)    this.touch.shoot.active = false;
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
      const jl  = Math.hypot(jdx, jdy);
      if (jl > 8) { dx = jdx / jl; dy = jdy / jl; }
    }
    const len = Math.hypot(dx, dy);
    return len > 0 ? { x: dx / len, y: dy / len } : { x: 0, y: 0 };
  }

  getAimAngle(px, py) {
    if (this.touch.shoot.active) return Math.atan2(this.touch.shoot.y - py, this.touch.shoot.x - px);
    return Math.atan2(this.mouse.y - py, this.mouse.x - px);
  }

  isShootingHeld() { return this.mouse.down || this.touch.shoot.active; }
  consumePause()   { const v = this._pauseConsumed;  this._pauseConsumed  = false; return v; }
  consumeAction()  { const v = this._actionConsumed; this._actionConsumed = false; return v; }
  consumeClick()   { const v = this._clickConsumed;  this._clickConsumed  = false; return v; }
}

// =============================================================================
// Particle / ParticleSystem
// =============================================================================
class Particle {
  constructor(x, y, vx, vy, color, radius, life) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.color = color; this.radius = radius; this.life = life; this.maxLife = life;
  }
  update(dt) {
    this.x += this.vx * dt * 0.001; this.y += this.vy * dt * 0.001;
    this.vx *= 0.96; this.vy *= 0.96; this.life -= dt;
  }
  draw(ctx) {
    const a = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = a; ctx.fillStyle = this.color;
    ctx.shadowColor = this.color; ctx.shadowBlur = 4;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.radius * a, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0; ctx.restore();
  }
  get isDead() { return this.life <= 0; }
}

class ParticleSystem {
  constructor() { this.particles = []; }
  emit(x, y, color, count, o) {
    o = o || {};
    const sMin = o.speedMin || 60, sMax = o.speedMax || 200;
    const lMin = o.lifeMin  || 300, lMax = o.lifeMax  || 700;
    const rMin = o.radiusMin|| 2,   rMax = o.radiusMax || 6;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = sMin + Math.random() * (sMax - sMin);
      this.particles.push(new Particle(x, y, Math.cos(a)*sp, Math.sin(a)*sp, color,
        rMin + Math.random()*(rMax-rMin), lMin + Math.random()*(lMax-lMin)));
    }
  }
  update(dt) { for (const p of this.particles) p.update(dt); this.particles = this.particles.filter(p => !p.isDead); }
  draw(ctx)  { for (const p of this.particles) p.draw(ctx); }
}

// =============================================================================
// Entity (base)
// =============================================================================
class Entity {
  constructor(x, y, radius) {
    this.x = x; this.y = y; this.radius = radius;
    this.vx = 0; this.vy = 0; this.dead = false;
  }
  collidesWith(o) { return Math.hypot(this.x - o.x, this.y - o.y) < this.radius + o.radius; }
  update() {} draw() {}
}

// =============================================================================
// Bullet
// =============================================================================
class Bullet extends Entity {
  constructor(x, y, angle) {
    super(x, y, CONFIG.BULLET_RADIUS);
    this.vx = Math.cos(angle) * CONFIG.BULLET_SPEED;
    this.vy = Math.sin(angle) * CONFIG.BULLET_SPEED;
    this.trail = [];
  }
  update(dt) {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 5) this.trail.shift();
    this.x += this.vx * dt * 0.001; this.y += this.vy * dt * 0.001;
    if (this.x < -20 || this.x > CONFIG.WIDTH+20 || this.y < -20 || this.y > CONFIG.HEIGHT+20) this.dead = true;
  }
  draw(ctx) {
    ctx.save();
    for (let i = 0; i < this.trail.length; i++) {
      ctx.globalAlpha = (i / this.trail.length) * 0.4;
      ctx.fillStyle   = CONFIG.COLORS.bullet;
      ctx.beginPath(); ctx.arc(this.trail[i].x, this.trail[i].y, this.radius*(i/this.trail.length)*0.7, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.shadowColor = CONFIG.COLORS.bullet; ctx.shadowBlur = 8;
    ctx.fillStyle = CONFIG.COLORS.bullet;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0; ctx.restore();
  }
}

// =============================================================================
// Player (Rubber Duck)
// =============================================================================
class Player extends Entity {
  constructor(x, y) {
    super(x, y, CONFIG.PLAYER_RADIUS);
    this.hp = CONFIG.PLAYER_MAX_HP;
    this.shootTimer = 0; this.invincibleTimer = 0; this.squishTimer = 0;
    this.time = 0; this.facing = 0; this.moving = false;
  }
  update(dt, input) {
    this.time += dt * 0.001;
    this.shootTimer      = Math.max(0, this.shootTimer      - dt);
    this.invincibleTimer = Math.max(0, this.invincibleTimer - dt);
    this.squishTimer     = Math.max(0, this.squishTimer     - dt);
    const mv = input.getMoveVector();
    this.vx = mv.x * CONFIG.PLAYER_SPEED; this.vy = mv.y * CONFIG.PLAYER_SPEED;
    this.moving = mv.x !== 0 || mv.y !== 0;
    this.x = Math.max(this.radius, Math.min(CONFIG.WIDTH  - this.radius, this.x + this.vx * dt * 0.001));
    this.y = Math.max(this.radius, Math.min(CONFIG.HEIGHT - this.radius, this.y + this.vy * dt * 0.001));
    this.facing = input.getAimAngle(this.x, this.y);
  }
  tryShoot(audio) {
    if (this.shootTimer > 0) return null;
    this.shootTimer = CONFIG.SHOOT_COOLDOWN; this.squishTimer = 100;
    audio.playShoot();
    return new Bullet(this.x, this.y, this.facing);
  }
  takeDamage(audio) {
    if (this.invincibleTimer > 0) return;
    this.hp--; this.invincibleTimer = CONFIG.PLAYER_INVINCIBLE_MS; audio.playHurt();
  }
  draw(ctx) {
    if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer / 100) % 2 === 0) return;
    ctx.save(); ctx.translate(this.x, this.y);
    ctx.translate(0, this.moving ? Math.sin(this.time * 8) * 3 : 0);
    ctx.rotate(Math.sin(this.time * 3) * 0.15);
    if (this.squishTimer > 0) ctx.scale(1.2, 0.82);
    this._drawBody(ctx); this._drawHead(ctx); this._drawBill(ctx); this._drawEye(ctx);
    ctx.restore();
  }
  _drawBody(ctx) {
    ctx.save(); ctx.shadowColor='#FFD700'; ctx.shadowBlur=6; ctx.fillStyle=CONFIG.COLORS.player;
    ctx.beginPath(); ctx.ellipse(0,3,17,13,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#CC9900'; ctx.lineWidth=1.5; ctx.stroke(); ctx.shadowBlur=0; ctx.restore();
  }
  _drawHead(ctx) {
    ctx.save(); ctx.fillStyle=CONFIG.COLORS.player;
    ctx.beginPath(); ctx.arc(7,-10,10,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#CC9900'; ctx.lineWidth=1.5; ctx.stroke(); ctx.restore();
  }
  _drawBill(ctx) {
    ctx.save(); ctx.fillStyle='#FF8C00';
    ctx.beginPath(); ctx.moveTo(15,-11); ctx.quadraticCurveTo(28,-9,26,-5); ctx.lineTo(15,-6); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  _drawEye(ctx) {
    ctx.save(); ctx.translate(10,-13);
    ctx.fillStyle='white'; ctx.beginPath(); ctx.arc(0,0,4,0,Math.PI*2); ctx.fill();
    const px=Math.cos(this.facing)*1.5, py=Math.sin(this.facing)*1.5;
    ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(px,py,2.2,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
}

// =============================================================================
// Spider — NullPointerException Spider
// =============================================================================
class Spider extends Entity {
  constructor(x, y) {
    super(x, y, 14);
    this.hp = 2; this.speed = 110 + Math.random() * 40;
    this.legPhase = Math.random() * Math.PI * 2; this.color = CONFIG.COLORS.spider;
  }
  update(dt, player) {
    const dx=player.x-this.x, dy=player.y-this.y, d=Math.hypot(dx,dy)||1;
    this.vx=(dx/d)*this.speed; this.vy=(dy/d)*this.speed;
    this.x+=this.vx*dt*0.001; this.y+=this.vy*dt*0.001;
    this.legPhase+=dt*0.008;
    if (this.x<-100||this.x>CONFIG.WIDTH+100||this.y<-100||this.y>CONFIG.HEIGHT+100) this.dead=true;
  }
  draw(ctx) {
    ctx.save(); ctx.translate(this.x,this.y);
    const fa=Math.atan2(this.vy,this.vx);
    ctx.strokeStyle=this.color; ctx.lineWidth=1.5;
    for (const side of [-1,1]) {
      for (let i=0;i<4;i++) {
        const a=fa+side*(Math.PI*0.55+[-0.9,-0.45,0.45,0.9][i]);
        const len=13+Math.sin(this.legPhase+i*0.7)*3;
        ctx.beginPath(); ctx.moveTo(0,0);
        ctx.quadraticCurveTo(Math.cos(a)*len*0.55,Math.sin(a)*len*0.55,
          Math.cos(a+side*0.25)*len,Math.sin(a+side*0.25)*len); ctx.stroke();
      }
    }
    ctx.shadowColor=this.color; ctx.shadowBlur=12; ctx.fillStyle=this.color;
    ctx.beginPath(); ctx.ellipse(0,0,11,9,0,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
    ctx.fillStyle='#FF3300';
    for (const ex of[-3.5,3.5]){ctx.beginPath();ctx.arc(ex,-4,2.2,0,Math.PI*2);ctx.fill();}
    ctx.restore();
  }
}

// =============================================================================
// Snake — SegFault Snake
// =============================================================================
class Snake extends Entity {
  constructor(x, y, player) {
    super(x, y, 10);
    this.hp=1; this.speed=210+Math.random()*60;
    this.sinePhase=0; this.baseAngle=Math.atan2(player.y-y,player.x-x);
    this.color=CONFIG.COLORS.snake; this.spineX=x; this.spineY=y;
  }
  update(dt, player) {
    const s=dt*0.001;
    this.sinePhase+=dt*0.005;
    this.spineX+=Math.cos(this.baseAngle)*this.speed*s;
    this.spineY+=Math.sin(this.baseAngle)*this.speed*s;
    const perp=this.baseAngle+Math.PI/2;
    const offset=Math.sin(this.sinePhase)*28;
    this.x=this.spineX+Math.cos(perp)*offset;
    this.y=this.spineY+Math.sin(perp)*offset;
    const dx=player.x-this.x, dy=player.y-this.y, d=Math.hypot(dx,dy)||1;
    this.baseAngle+=Math.atan2(dy/d,dx/d)*0.025;
    if (this.x<-50||this.x>CONFIG.WIDTH+50||this.y<-50||this.y>CONFIG.HEIGHT+50) this.dead=true;
  }
  draw(ctx) {
    ctx.save(); ctx.translate(this.x,this.y);
    ctx.shadowColor=this.color; ctx.shadowBlur=14;
    const perp=this.baseAngle+Math.PI/2;
    const sc=['#1a5c0a','#237512','#2d9916','#35bb1b',this.color];
    for (let i=4;i>=0;i--){
      const so=Math.sin(this.sinePhase-i*0.55)*28;
      ctx.fillStyle=sc[i];
      ctx.beginPath();
      ctx.arc(Math.cos(perp)*(so-Math.sin(this.sinePhase)*28)+Math.cos(this.baseAngle+Math.PI)*i*9,
              Math.sin(perp)*(so-Math.sin(this.sinePhase)*28)+Math.sin(this.baseAngle+Math.PI)*i*9,
              9-i*0.9,0,Math.PI*2); ctx.fill();
    }
    ctx.shadowBlur=0; ctx.strokeStyle='#FF1111'; ctx.lineWidth=1.2;
    const ta=this.baseAngle,tl=11;
    ctx.beginPath();
    ctx.moveTo(0,0); ctx.lineTo(Math.cos(ta)*tl*0.7,Math.sin(ta)*tl*0.7);
    ctx.moveTo(Math.cos(ta)*tl*0.7,Math.sin(ta)*tl*0.7);
    ctx.lineTo(Math.cos(ta-0.3)*tl,Math.sin(ta-0.3)*tl);
    ctx.moveTo(Math.cos(ta)*tl*0.7,Math.sin(ta)*tl*0.7);
    ctx.lineTo(Math.cos(ta+0.3)*tl,Math.sin(ta+0.3)*tl);
    ctx.stroke(); ctx.restore();
  }
}

// =============================================================================
// Octopus — InfiniteLoop Octopus
// =============================================================================
class Octopus extends Entity {
  constructor(x, y) {
    super(x, y, 16);
    this.hp=4;
    this.orbitAngle=Math.atan2(y-CONFIG.HEIGHT/2,x-CONFIG.WIDTH/2);
    this.orbitRadius=Math.min(CONFIG.WIDTH,CONFIG.HEIGHT)*0.42;
    this.orbitSpeed=0.55+Math.random()*0.25;
    this.chargeTimer=2000+Math.random()*1200;
    this.charging=false; this.chargeVx=0; this.chargeVy=0; this.chargeDuration=0;
    this.tentaclePhase=Math.random()*Math.PI*2; this.color=CONFIG.COLORS.octopus;
  }
  update(dt, player) {
    this.tentaclePhase+=dt*0.004;
    if (this.charging) {
      this.x+=this.chargeVx*dt*0.001; this.y+=this.chargeVy*dt*0.001;
      this.chargeVx+=(player.x-this.x)*0.05; this.chargeVy+=(player.y-this.y)*0.05;
      this.chargeDuration-=dt;
      if (this.chargeDuration<=0){
        this.charging=false; this.chargeTimer=2000+Math.random()*1200;
        this.orbitAngle=Math.atan2(this.y-CONFIG.HEIGHT/2,this.x-CONFIG.WIDTH/2);
      }
    } else {
      this.orbitRadius=Math.min(CONFIG.WIDTH,CONFIG.HEIGHT)*0.42;
      this.orbitAngle+=this.orbitSpeed*dt*0.001;
      this.x=CONFIG.WIDTH/2+Math.cos(this.orbitAngle)*this.orbitRadius;
      this.y=CONFIG.HEIGHT/2+Math.sin(this.orbitAngle)*this.orbitRadius;
      this.chargeTimer-=dt;
      if (this.chargeTimer<=0){
        this.charging=true;
        const dx=player.x-this.x,dy=player.y-this.y,d=Math.hypot(dx,dy)||1;
        this.chargeVx=(dx/d)*340; this.chargeVy=(dy/d)*340; this.chargeDuration=900;
      }
    }
  }
  draw(ctx) {
    ctx.save(); ctx.translate(this.x,this.y);
    ctx.shadowColor=this.color; ctx.shadowBlur=18;
    for (let i=0;i<8;i++){
      const a=(i/8)*Math.PI*2, w=Math.sin(this.tentaclePhase+i*0.78)*9;
      ctx.strokeStyle=this.color; ctx.lineWidth=3.5-i*0.15;
      ctx.beginPath(); ctx.moveTo(0,0);
      ctx.quadraticCurveTo(Math.cos(a+0.4)*20+w,Math.sin(a+0.4)*20,Math.cos(a)*30,Math.sin(a)*30);
      ctx.stroke();
    }
    ctx.fillStyle=this.color; ctx.beginPath(); ctx.arc(0,0,15,0,Math.PI*2); ctx.fill();
    if (this.charging){ctx.shadowBlur=0;ctx.strokeStyle='#FF88FF';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,18,0,Math.PI*2);ctx.stroke();}
    ctx.shadowBlur=0; ctx.fillStyle='#E8D5F5'; ctx.font='11px Courier New';
    ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('∞',0,0);
    ctx.restore();
  }
}

// =============================================================================
// Ghost — MemoryLeak Ghost
// =============================================================================
class Ghost extends Entity {
  constructor(x, y) {
    super(x, y, 14);
    this.hp=3; this.speed=44+Math.random()*16;
    this.floatPhase=Math.random()*Math.PI*2; this.color=CONFIG.COLORS.ghost;
  }
  update(dt, player) {
    const dx=player.x-this.x,dy=player.y-this.y,d=Math.hypot(dx,dy)||1;
    this.vx=(dx/d)*this.speed; this.vy=(dy/d)*this.speed;
    this.x+=this.vx*dt*0.001; this.y+=this.vy*dt*0.001;
    this.floatPhase+=dt*0.003;
    if (this.x<-100||this.x>CONFIG.WIDTH+100||this.y<-100||this.y>CONFIG.HEIGHT+100) this.dead=true;
  }
  draw(ctx) {
    ctx.save(); ctx.translate(this.x,this.y);
    const pulse=0.5+0.5*Math.sin(this.floatPhase*2);
    ctx.globalAlpha=0.55; ctx.shadowColor=this.color; ctx.shadowBlur=12+pulse*14;
    ctx.translate(0,Math.sin(this.floatPhase)*5);
    ctx.fillStyle=this.color; ctx.beginPath(); ctx.arc(0,-5,14,Math.PI,0);
    for (let i=0;i<=6;i++) ctx.lineTo(-14+(i/6)*28,9+Math.sin(i*Math.PI+this.floatPhase*2.5)*4);
    ctx.closePath(); ctx.fill();
    ctx.shadowBlur=0; ctx.globalAlpha=0.8; ctx.fillStyle='#0d1117';
    for (const ex of[-5,5]){ctx.beginPath();ctx.ellipse(ex,-6,3,4,0,0,Math.PI*2);ctx.fill();}
    ctx.globalAlpha=0.35; ctx.fillStyle=this.color; ctx.font='5px Courier New';
    ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('NULL',0,10);
    ctx.restore();
  }
}

// =============================================================================
// WaveManager
// =============================================================================
class WaveManager {
  constructor() {
    this.wave=0; this.state='gap'; this.gapTimer=1500;
    this.spawnQueue=[]; this.enemiesThisWave=0; this.waveCleared=false;
  }
  update(dt, enemies, audio) {
    this.waveCleared=false;
    if (this.state==='gap'){
      this.gapTimer-=dt;
      if (this.gapTimer<=0){ this.wave++; this._buildWave(); this.state='active'; }
      return;
    }
    if (this.spawnQueue.length>0){
      this.spawnQueue[0].timer-=dt;
      if (this.spawnQueue[0].timer<=0) enemies.push(this._spawnEnemy(...Object.values(this.spawnQueue.shift())));
    }
    if (this.spawnQueue.length===0&&enemies.length===0){
      this.state='gap'; this.gapTimer=CONFIG.WAVE_GAP_MS;
      this.waveCleared=true; audio.playWaveClear();
    }
  }
  _buildWave() {
    const w=this.wave, types=[];
    const nSpiders = Math.min(3+w, 10);
    const nSnakes  = Math.max(0, Math.floor((w+1)/2));
    const nOctopi  = Math.max(0, Math.floor((w-2)/2));
    const nGhosts  = Math.max(0, Math.floor((w-3)/3));
    for (let i=0;i<nSpiders;i++) types.push('Spider');
    for (let i=0;i<nSnakes;i++)  types.push('Snake');
    for (let i=0;i<nOctopi;i++)  types.push('Octopus');
    for (let i=0;i<nGhosts;i++)  types.push('Ghost');
    for (let i=types.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[types[i],types[j]]=[types[j],types[i]];}
    this.spawnQueue=types.map((type,i)=>({type,timer:i*250,player:null}));
    this.enemiesThisWave=types.length;
  }
  _spawnEnemy(type, timer, playerRef) {
    const pos=this._edgePosition();
    const p=playerRef||{x:CONFIG.WIDTH/2,y:CONFIG.HEIGHT/2};
    if (type==='Spider')  return new Spider(pos.x,pos.y);
    if (type==='Snake')   return new Snake(pos.x,pos.y,p);
    if (type==='Octopus') return new Octopus(pos.x,pos.y);
    return new Ghost(pos.x,pos.y);
  }
  injectPlayer(player) { for (const e of this.spawnQueue) e.player=player; }
  _edgePosition() {
    const edge=Math.floor(Math.random()*4),W=CONFIG.WIDTH,H=CONFIG.HEIGHT;
    if (edge===0) return {x:Math.random()*W,y:-35};
    if (edge===1) return {x:W+35,y:Math.random()*H};
    if (edge===2) return {x:Math.random()*W,y:H+35};
    return {x:-35,y:Math.random()*H};
  }
}

// =============================================================================
// Game
// =============================================================================
class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx    = this.canvas.getContext('2d');
    this.nameEl = document.getElementById('nameInput');

    // Language
    this.lang = this._detectLang();
    window.__bsLang = this.lang;

    // State
    this.state  = 'LANG_SELECT';
    this.lastTs = 0;
    this.shakeX = 0; this.shakeY = 0;

    // Game objects
    this.player  = null;
    this.enemies = []; this.bullets = [];
    this.ps      = new ParticleSystem();
    this.waves   = new WaveManager();
    this.audio   = new AudioManager();
    this.input   = new InputManager(this.canvas);

    // Score / player
    this.score      = 0;
    this.combo      = 1; this.comboTimer = 0;
    this.highScore  = parseInt(localStorage.getItem(CONFIG.HS_KEY)) || 0;
    this.playerName = '';

    // Leaderboard
    this.leaderboard    = this._loadLocalScores();
    this.scoreSubmitted = false;
    this.submittingScore = false;

    // Lang select cards (hit test)
    this._langCards = [];

    // Name input wiring
    this._wireNameInput();

    this._initCanvas();
    window.addEventListener('resize', () => this._onResize());
    this._startLoop();
  }

  // ---- Language ----

  _detectLang() {
    const saved = localStorage.getItem(CONFIG.LANG_KEY);
    if (saved && STRINGS[saved]) return saved;
    const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return STRINGS[nav] ? nav : 'en';
  }

  _setLang(code) {
    this.lang = code;
    window.__bsLang = code;
    localStorage.setItem(CONFIG.LANG_KEY, code);
  }

  // ---- Name input wiring ----

  _wireNameInput() {
    if (!this.nameEl) return;
    this.nameEl.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const v = this.nameEl.value.trim();
        if (v) { this.playerName = v; this._hideNameInput(); this.toMenu(); }
      }
      if (e.key === 'Escape') { this._hideNameInput(); this.toLangSelect(); }
    });
  }

  _showNameInput() {
    if (!this.nameEl) return;
    this.nameEl.value = this.playerName;
    this.nameEl.placeholder = T('name_ph');
    this.nameEl.classList.add('visible');
    setTimeout(() => this.nameEl.focus(), 50);
  }

  _hideNameInput() {
    if (!this.nameEl) return;
    this.nameEl.classList.remove('visible');
    this.nameEl.blur();
  }

  // ---- Canvas ----

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
    const loop = ts => {
      let dt = ts - this.lastTs; this.lastTs = ts;
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

  toLangSelect() {
    this._hideNameInput();
    this.state = 'LANG_SELECT';
  }

  toNameInput() {
    this._showNameInput();
    this.state = 'NAME_INPUT';
  }

  toMenu() {
    this._hideNameInput();
    this.state = 'MENU';
  }

  toPlaying() {
    this.score = 0; this.combo = 1; this.comboTimer = 0;
    this.enemies = []; this.bullets = [];
    this.ps    = new ParticleSystem();
    this.waves = new WaveManager();
    this.player = new Player(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);
    this.shakeX = 0; this.shakeY = 0;
    this.scoreSubmitted = false;
    this.state = 'PLAYING';
  }

  toPaused()  { this.state = 'PAUSED'; }
  toResumed() { this.state = 'PLAYING'; }

  toGameOver() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem(CONFIG.HS_KEY, this.highScore);
    }
    this._saveLocalScore();
    this._submitScore();
    this.state = 'GAME_OVER';
  }

  // ---- Leaderboard ----

  _loadLocalScores() {
    try {
      const raw = localStorage.getItem(CONFIG.SCORES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch(e) { return []; }
  }

  _saveLocalScore() {
    if (!this.playerName || this.score <= 0) return;
    const entry = { name: this.playerName, score: this.score, wave: this.waves.wave };
    let scores = this._loadLocalScores();
    scores.push(entry);
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 15);
    try { localStorage.setItem(CONFIG.SCORES_KEY, JSON.stringify(scores)); } catch(e) {}
    this.leaderboard = scores;
  }

  async _submitScore() {
    if (!CONFIG.LEADERBOARD_URL || this.scoreSubmitted || !this.playerName || this.score <= 0) return;
    this.submittingScore = true;
    try {
      await fetch(CONFIG.LEADERBOARD_URL + '.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.playerName, score: this.score,
          wave: this.waves.wave, lang: this.lang,
          ts: new Date().toISOString(),
        }),
      });
      this.scoreSubmitted = true;
    } catch(e) { /* offline — local scores used */ }
    this.submittingScore = false;
    await this._fetchLeaderboard();
  }

  async _fetchLeaderboard() {
    if (!CONFIG.LEADERBOARD_URL) return;
    try {
      const r = await fetch(CONFIG.LEADERBOARD_URL + '.json?orderBy="score"&limitToLast=15');
      const data = await r.json();
      if (data && typeof data === 'object') {
        this.leaderboard = Object.values(data)
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
      }
    } catch(e) { /* stay with local */ }
  }

  // ---- Update ----

  _update(dt, ts) {
    if (this.input.consumePause()) { this.toPaused(); return; }
    this.waves.injectPlayer(this.player);
    if (this.input.isShootingHeld()) {
      const b = this.player.tryShoot(this.audio);
      if (b) this.bullets.push(b);
    }
    this.player.update(dt, this.input);
    for (const b of this.bullets) b.update(dt);
    for (const e of this.enemies) e.update(dt, this.player);
    this.waves.update(dt, this.enemies, this.audio);
    this.ps.update(dt);
    if (this.combo > 1) { this.comboTimer -= dt; if (this.comboTimer <= 0) { this.combo = 1; this.comboTimer = 0; } }
    this.shakeX *= CONFIG.SHAKE_DECAY; this.shakeY *= CONFIG.SHAKE_DECAY;
    if (Math.abs(this.shakeX) < 0.1) this.shakeX = 0;
    if (Math.abs(this.shakeY) < 0.1) this.shakeY = 0;
    this._checkCollisions();
  }

  _checkCollisions() {
    for (const b of this.bullets) {
      if (b.dead) continue;
      for (const e of this.enemies) {
        if (e.dead) continue;
        if (b.collidesWith(e)) {
          b.dead = true; e.hp--;
          if (e.hp <= 0) { e.dead = true; this._onKill(e); }
          break;
        }
      }
    }
    if (this.player.invincibleTimer <= 0) {
      for (const e of this.enemies) {
        if (e.dead) continue;
        if (e.collidesWith(this.player)) {
          this.player.takeDamage(this.audio);
          this.combo = 1; this.comboTimer = 0; this._shake(9);
          if (this.player.hp <= 0) { this.toGameOver(); return; }
          break;
        }
      }
    }
    this.bullets = this.bullets.filter(b => !b.dead);
    this.enemies = this.enemies.filter(e => !e.dead);
  }

  _onKill(enemy) {
    this.combo = Math.min(this.combo + 1, 10);
    this.comboTimer = CONFIG.COMBO_RESET_MS;
    this.score += (CONFIG.BASE_SCORES[enemy.constructor.name] || 10) * this.combo;
    this.ps.emit(enemy.x, enemy.y, enemy.color, 18, { speedMin:60, speedMax:200, lifeMin:300, lifeMax:700, radiusMin:2, radiusMax:6 });
    this.audio.playPop(); this._shake(4);
  }

  _shake(m) {
    this.shakeX = (Math.random()*2-1)*m;
    this.shakeY = (Math.random()*2-1)*m;
  }

  _isTouchDevice() { return 'ontouchstart' in window || navigator.maxTouchPoints > 0; }

  // ---- Draw dispatcher ----

  _draw(ts) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

    if (this.state === 'LANG_SELECT') { this._drawLangSelect(ts); return; }
    if (this.state === 'NAME_INPUT')  { this._drawNameInput(ts);  return; }
    if (this.state === 'MENU')        { this._drawMenu(ts);       return; }
    if (this.state === 'GAME_OVER')   { this._drawGameOver(ts);   return; }

    this._drawGame(ts);

    if (this.state === 'PAUSED') {
      ctx.save();
      ctx.fillStyle = 'rgba(13,17,23,0.6)';
      ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
      ctx.fillStyle = CONFIG.COLORS.hud; ctx.font = 'bold 36px Courier New';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.shadowColor = CONFIG.COLORS.accent; ctx.shadowBlur = 20;
      ctx.fillText(T('paused'), CONFIG.WIDTH/2, CONFIG.HEIGHT/2 - 20);
      ctx.shadowBlur = 0; ctx.font = '14px Courier New'; ctx.fillStyle = CONFIG.COLORS.dim;
      ctx.fillText(this._isTouchDevice() ? T('resume_t') : T('resume'), CONFIG.WIDTH/2, CONFIG.HEIGHT/2 + 20);
      ctx.restore();
      if (this.input.consumePause()) this.toResumed();
      else if (this._isTouchDevice() && this.input.consumeClick()) this.toResumed();
    }
  }

  // ---- LANG_SELECT screen ----

  _drawLangSelect(ts) {
    const ctx = this.ctx;
    ctx.fillStyle = CONFIG.COLORS.bg;
    ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

    // Title
    ctx.save();
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = CONFIG.COLORS.player; ctx.shadowColor = CONFIG.COLORS.player; ctx.shadowBlur = 30;
    ctx.font = 'bold 48px Courier New';
    ctx.fillText('BUG SQUASHER', CONFIG.WIDTH/2, Math.round(CONFIG.HEIGHT * 0.14));
    ctx.shadowBlur = 0;
    ctx.fillStyle = CONFIG.COLORS.dim; ctx.font = '14px Courier New';
    ctx.fillText(T('lang_title'), CONFIG.WIDTH/2, Math.round(CONFIG.HEIGHT * 0.20));
    ctx.restore();

    // Language cards: 2x2 grid centred
    const langs = [
      { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
      { code: 'en', flag: '🇬🇧', name: 'English' },
      { code: 'fr', flag: '🇫🇷', name: 'Français' },
      { code: 'es', flag: '🇪🇸', name: 'Español' },
    ];

    const cardW = Math.min(240, CONFIG.WIDTH * 0.38);
    const cardH = 70;
    const gapX  = Math.min(20, CONFIG.WIDTH * 0.03);
    const gapY  = 16;
    const gridW = cardW * 2 + gapX;
    const startX = CONFIG.WIDTH/2 - gridW/2;
    const startY = Math.round(CONFIG.HEIGHT * 0.30);

    this._langCards = [];
    const mx = this.input.mouse.x, my = this.input.mouse.y;

    langs.forEach((lang, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      const isActive  = this.lang === lang.code;
      const isHovered = mx >= x && mx <= x+cardW && my >= y && my <= y+cardH;
      this._langCards.push({ code: lang.code, x, y, w: cardW, h: cardH });

      ctx.save();
      ctx.fillStyle = isActive ? CONFIG.COLORS.accent : (isHovered ? CONFIG.COLORS.cardHov : CONFIG.COLORS.card);
      if (isActive) { ctx.shadowColor = CONFIG.COLORS.accent; ctx.shadowBlur = 18; }
      // Rounded rect
      const r = 8;
      ctx.beginPath();
      ctx.moveTo(x+r, y); ctx.lineTo(x+cardW-r, y);
      ctx.arcTo(x+cardW, y, x+cardW, y+r, r);
      ctx.lineTo(x+cardW, y+cardH-r);
      ctx.arcTo(x+cardW, y+cardH, x+cardW-r, y+cardH, r);
      ctx.lineTo(x+r, y+cardH);
      ctx.arcTo(x, y+cardH, x, y+cardH-r, r);
      ctx.lineTo(x, y+r);
      ctx.arcTo(x, y, x+r, y, r);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = '28px serif';
      ctx.fillText(lang.flag, x + cardW/2, y + cardH/2 - 8);
      ctx.font = (isActive ? 'bold ' : '') + '14px Courier New';
      ctx.fillStyle = isActive ? '#fff' : CONFIG.COLORS.hud;
      ctx.fillText(lang.name, x + cardW/2, y + cardH/2 + 18);
      ctx.restore();
    });

    // Subtitle
    ctx.save();
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = CONFIG.COLORS.dim; ctx.font = '11px Courier New';
    ctx.fillText(T('lang_sub'), CONFIG.WIDTH/2, startY + 2*(cardH+gapY) + 28);
    ctx.restore();

    this._drawCRT();

    // Hit test on click
    if (this.input.consumeClick()) {
      for (const card of this._langCards) {
        if (mx >= card.x && mx <= card.x+card.w && my >= card.y && my <= card.y+card.h) {
          this._setLang(card.code);
          this.toNameInput();
          return;
        }
      }
    }
  }

  // ---- NAME_INPUT screen ----

  _drawNameInput(ts) {
    const ctx = this.ctx;
    ctx.fillStyle = CONFIG.COLORS.bg;
    ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

    ctx.save();
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';

    ctx.fillStyle = CONFIG.COLORS.player; ctx.shadowColor = CONFIG.COLORS.player; ctx.shadowBlur = 30;
    ctx.font = 'bold 44px Courier New';
    ctx.fillText(T('name_title'), CONFIG.WIDTH/2, Math.round(CONFIG.HEIGHT * 0.32));
    ctx.shadowBlur = 0;

    ctx.fillStyle = CONFIG.COLORS.dim; ctx.font = '14px Courier New';
    ctx.fillText(T('name_sub'), CONFIG.WIDTH/2, Math.round(CONFIG.HEIGHT * 0.40));

    // Input box placeholder drawn on canvas (actual input is DOM)
    ctx.fillStyle = CONFIG.COLORS.dim; ctx.font = '12px Courier New';
    ctx.fillText(this._isTouchDevice() ? T('name_hint_t') : T('name_hint'), CONFIG.WIDTH/2, Math.round(CONFIG.HEIGHT * 0.68));

    ctx.restore();

    // Confirm button (touch-friendly, also works on desktop)
    const btnW = Math.min(200, CONFIG.WIDTH * 0.4);
    const btnH = 46;
    const btnX = CONFIG.WIDTH/2 - btnW/2;
    const btnY = Math.round(CONFIG.HEIGHT * 0.72);
    const mx   = this.input.mouse.x, my = this.input.mouse.y;
    const hov  = mx >= btnX && mx <= btnX+btnW && my >= btnY && my <= btnY+btnH;

    ctx.save();
    ctx.fillStyle = hov ? CONFIG.COLORS.accent : '#1f2937';
    ctx.shadowColor = CONFIG.COLORS.accent; ctx.shadowBlur = hov ? 14 : 0;
    ctx.beginPath();
    const br = 8;
    ctx.moveTo(btnX+br,btnY); ctx.lineTo(btnX+btnW-br,btnY);
    ctx.arcTo(btnX+btnW,btnY,btnX+btnW,btnY+br,br);
    ctx.lineTo(btnX+btnW,btnY+btnH-br);
    ctx.arcTo(btnX+btnW,btnY+btnH,btnX+btnW-br,btnY+btnH,br);
    ctx.lineTo(btnX+br,btnY+btnH);
    ctx.arcTo(btnX,btnY+btnH,btnX,btnY+btnH-br,br);
    ctx.lineTo(btnX,btnY+br);
    ctx.arcTo(btnX,btnY,btnX+br,btnY,br);
    ctx.closePath(); ctx.fill();
    ctx.shadowBlur=0;
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = 'bold 14px Courier New';
    ctx.fillText(T('name_confirm'), CONFIG.WIDTH/2, btnY + btnH/2);
    ctx.restore();

    // Back link
    ctx.save();
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = CONFIG.COLORS.dim; ctx.font = '13px Courier New';
    ctx.fillText(T('name_back'), 24, Math.round(CONFIG.HEIGHT * 0.92));
    ctx.restore();

    this._drawCRT();

    // Confirm button click
    if (this.input.consumeClick()) {
      // Check confirm button
      if (mx >= btnX && mx <= btnX+btnW && my >= btnY && my <= btnY+btnH) {
        const v = this.nameEl ? this.nameEl.value.trim() : '';
        if (v) { this.playerName = v; this._hideNameInput(); this.toMenu(); }
        return;
      }
      // Check back link (rough hit area)
      if (mx < 140 && my > CONFIG.HEIGHT * 0.88) { this._hideNameInput(); this.toLangSelect(); }
    }
  }

  // ---- Game screen ----

  _drawGame(ts) {
    const ctx = this.ctx;
    ctx.save(); ctx.translate(this.shakeX, this.shakeY);

    ctx.fillStyle = CONFIG.COLORS.bg;
    ctx.fillRect(-Math.abs(this.shakeX)-2, -Math.abs(this.shakeY)-2, CONFIG.WIDTH+4, CONFIG.HEIGHT+4);

    // Grid dots
    ctx.fillStyle = '#1a2233';
    for (let gx=40; gx<CONFIG.WIDTH; gx+=40)
      for (let gy=40; gy<CONFIG.HEIGHT; gy+=40) {
        ctx.beginPath(); ctx.arc(gx,gy,1,0,Math.PI*2); ctx.fill();
      }

    this.ps.draw(ctx);
    for (const e of this.enemies) e.draw(ctx);
    for (const b of this.bullets) b.draw(ctx);
    this.player.draw(ctx);
    ctx.restore();

    this._drawHUD(ts);
    this._drawTouchOverlay();
    this._drawCRT();
  }

  _drawHUD(ts) {
    const ctx = this.ctx;
    ctx.save();
    for (let i=0; i<CONFIG.PLAYER_MAX_HP; i++) {
      ctx.fillStyle   = i < this.player.hp ? '#FF4444' : '#2a1a1a';
      ctx.font        = '22px Courier New';
      ctx.textBaseline= 'top'; ctx.textAlign = 'left';
      ctx.shadowColor = i < this.player.hp ? '#FF4444' : 'transparent';
      ctx.shadowBlur  = i < this.player.hp ? 6 : 0;
      ctx.fillText('♥', 14 + i*26, 10);
    }
    ctx.shadowBlur = 0;
    ctx.fillStyle = CONFIG.COLORS.hud; ctx.font = 'bold 22px Courier New';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(this.score, CONFIG.WIDTH/2, 8);
    ctx.fillStyle = CONFIG.COLORS.dim; ctx.font = '11px Courier New';
    ctx.fillText(T('hi_score') + ' ' + this.highScore, CONFIG.WIDTH/2, 33);
    if (this.combo > 1) {
      const pulse = 1 + Math.sin(ts*0.01)*0.06;
      ctx.textAlign = 'right';
      ctx.fillStyle = this.combo >= 5 ? CONFIG.COLORS.player : CONFIG.COLORS.accent;
      ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10;
      ctx.font = 'bold ' + Math.floor((13+this.combo)*pulse) + 'px Courier New';
      ctx.fillText('x' + this.combo + ' ' + T('combo'), CONFIG.WIDTH-12, 10);
      ctx.shadowBlur = 0;
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillStyle = CONFIG.COLORS.dim; ctx.font = '13px Courier New';
    const wt = this.waves.state === 'gap'
      ? (this.waves.wave === 0 ? T('get_ready') : T('wave_in', this.waves.wave+1))
      : T('wave', this.waves.wave);
    ctx.fillText(wt, CONFIG.WIDTH/2, CONFIG.HEIGHT-8);
    ctx.restore();
  }

  _drawCRT() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = '#000'; ctx.globalAlpha = 0.04;
    for (let y=0; y<CONFIG.HEIGHT; y+=3) ctx.fillRect(0, y, CONFIG.WIDTH, 1);
    ctx.globalAlpha = 0.22;
    const g = ctx.createRadialGradient(CONFIG.WIDTH/2,CONFIG.HEIGHT/2,CONFIG.HEIGHT*0.28,CONFIG.WIDTH/2,CONFIG.HEIGHT/2,CONFIG.HEIGHT*0.82);
    g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,0.9)');
    ctx.fillStyle = g; ctx.fillRect(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);
    ctx.restore();
  }

  _drawTouchOverlay() {
    if (!this._isTouchDevice()) return;
    const ctx = this.ctx;
    const j = this.input.touch.joystick, s = this.input.touch.shoot;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(CONFIG.WIDTH/2,0); ctx.lineTo(CONFIG.WIDTH/2,CONFIG.HEIGHT); ctx.stroke();
    ctx.font = '11px Courier New'; ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'center';
    if (!j.active) { ctx.fillStyle = CONFIG.COLORS.dim; ctx.fillText(T('move'),  CONFIG.WIDTH*0.25, CONFIG.HEIGHT-35); }
    if (!s.active) { ctx.fillStyle = CONFIG.COLORS.dim; ctx.fillText(T('shoot'), CONFIG.WIDTH*0.75, CONFIG.HEIGHT-35); }
    if (j.active) {
      const dx=j.curX-j.startX,dy=j.curY-j.startY,dist=Math.hypot(dx,dy),maxR=45;
      const cx=j.startX+(dist>maxR?(dx/dist)*maxR:dx), cy=j.startY+(dist>maxR?(dy/dist)*maxR:dy);
      ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(j.startX,j.startY,maxR,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.35)';
      ctx.beginPath(); ctx.arc(cx,cy,18,0,Math.PI*2); ctx.fill();
    }
    if (s.active) {
      ctx.strokeStyle=CONFIG.COLORS.player; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(s.x,s.y,22,0,Math.PI*2); ctx.stroke();
      ctx.strokeStyle='rgba(255,215,0,0.4)'; ctx.lineWidth=1;
      ctx.beginPath();
      ctx.moveTo(s.x-30,s.y); ctx.lineTo(s.x+30,s.y);
      ctx.moveTo(s.x,s.y-30); ctx.lineTo(s.x,s.y+30);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ---- MENU screen ----

  _drawMenu(ts) {
    const ctx = this.ctx;
    ctx.fillStyle = CONFIG.COLORS.bg;
    ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

    const titleY    = Math.round(CONFIG.HEIGHT * 0.15);
    const subtitleY = Math.round(CONFIG.HEIGHT * 0.22);
    const duckY     = Math.round(CONFIG.HEIGHT * 0.41);
    const ctrlYBase = Math.round(CONFIG.HEIGHT * 0.59);
    const promptY   = Math.round(CONFIG.HEIGHT * 0.77);
    const hsY       = Math.round(CONFIG.HEIGHT * 0.83);

    ctx.save();
    ctx.textAlign = 'center'; ctx.shadowColor = CONFIG.COLORS.player; ctx.shadowBlur = 35;
    ctx.fillStyle = CONFIG.COLORS.player; ctx.font = 'bold 56px Courier New'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('BUG SQUASHER', CONFIG.WIDTH/2, titleY); ctx.shadowBlur = 0;
    ctx.fillStyle = CONFIG.COLORS.accent; ctx.font = '15px Courier New';
    ctx.fillText(T('subtitle'), CONFIG.WIDTH/2, subtitleY);
    ctx.restore();

    this._drawMenuDuck(ctx, CONFIG.WIDTH/2, duckY, ts);

    ctx.save();
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = CONFIG.COLORS.dim; ctx.font = '13px Courier New';
    const lines = this._isTouchDevice()
      ? [T('ctrl_move_t'), T('ctrl_shoot_t'), T('ctrl_both_t')]
      : [T('ctrl_move'),   T('ctrl_shoot'),   T('ctrl_pause')];
    lines.forEach((ln, i) => ctx.fillText(ln, CONFIG.WIDTH/2, ctrlYBase + i*22));
    ctx.restore();

    this._drawEnemyPreviews(ctx);

    if (Math.floor(ts/540) % 2 === 0) {
      ctx.save();
      ctx.fillStyle = CONFIG.COLORS.hud; ctx.font = 'bold 17px Courier New';
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.fillText(this._isTouchDevice() ? T('start_t') : T('start'), CONFIG.WIDTH/2, promptY);
      ctx.restore();
    }

    if (this.highScore > 0) {
      ctx.save();
      ctx.fillStyle = CONFIG.COLORS.accent; ctx.font = '13px Courier New';
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.fillText(T('hi_score') + ': ' + this.highScore, CONFIG.WIDTH/2, hsY);
      ctx.restore();
    }

    // Player name in top-right (to change language, show small link)
    if (this.playerName) {
      ctx.save();
      ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      ctx.fillStyle = CONFIG.COLORS.dim; ctx.font = '11px Courier New';
      ctx.fillText('▶ ' + this.playerName, CONFIG.WIDTH - 12, 10);
      ctx.restore();
    }

    this._drawCRT();
    if (this.input.consumeAction() || this.input.consumeClick()) this.toPlaying();
  }

  _drawMenuDuck(ctx, x, y, ts) {
    ctx.save(); ctx.translate(x,y); ctx.scale(2.2,2.2);
    ctx.rotate(Math.sin(ts*0.0018)*0.18);
    ctx.shadowColor='#FFD700'; ctx.shadowBlur=8;
    ctx.fillStyle=CONFIG.COLORS.player;
    ctx.beginPath(); ctx.ellipse(0,3,17,13,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#CC9900'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(7,-10,10,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#CC9900'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.shadowBlur=0; ctx.fillStyle='#FF8C00';
    ctx.beginPath(); ctx.moveTo(15,-11); ctx.quadraticCurveTo(28,-9,26,-5); ctx.lineTo(15,-6); ctx.closePath(); ctx.fill();
    ctx.translate(10,-13);
    ctx.fillStyle='white'; ctx.beginPath(); ctx.arc(0,0,4,0,Math.PI*2); ctx.fill();
    const ex=Math.cos(ts*0.0012)*1.5, ey=Math.sin(ts*0.0012)*1.5;
    ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(ex,ey,2.2,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  _drawEnemyPreviews(ctx) {
    const previewY = Math.round(CONFIG.HEIGHT * 0.71);
    const items = [
      { key: 'enemy_spider',  color: CONFIG.COLORS.spider  },
      { key: 'enemy_snake',   color: CONFIG.COLORS.snake   },
      { key: 'enemy_octopus', color: CONFIG.COLORS.octopus },
      { key: 'enemy_ghost',   color: CONFIG.COLORS.ghost   },
    ];
    items.forEach((p, i) => {
      ctx.save();
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 8;
      ctx.font = '9px Courier New';
      ctx.fillText(T(p.key), Math.round(CONFIG.WIDTH * (0.18 + i * 0.21)), previewY);
      ctx.restore();
    });
  }

  // ---- GAME OVER screen ----

  _drawGameOver(ts) {
    const ctx = this.ctx;
    this._drawGame(ts);

    ctx.save();
    ctx.fillStyle = 'rgba(13,17,23,0.88)';
    ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';

    ctx.shadowColor='#FF4444'; ctx.shadowBlur=24; ctx.fillStyle='#FF4444';
    ctx.font = 'bold 44px Courier New';
    ctx.fillText(T('seg_fault'), CONFIG.WIDTH/2, Math.round(CONFIG.HEIGHT*0.18));
    ctx.shadowBlur=0; ctx.fillStyle=CONFIG.COLORS.dim; ctx.font='14px Courier New';
    ctx.fillText(T('core_dump'), CONFIG.WIDTH/2, Math.round(CONFIG.HEIGHT*0.23));

    ctx.fillStyle=CONFIG.COLORS.hud; ctx.font='bold 28px Courier New';
    ctx.fillText(T('score_lbl') + ': ' + this.score, CONFIG.WIDTH/2, Math.round(CONFIG.HEIGHT*0.30));

    if (this.score > 0 && this.score >= this.highScore) {
      ctx.fillStyle=CONFIG.COLORS.player; ctx.shadowColor=CONFIG.COLORS.player; ctx.shadowBlur=14;
      ctx.font='bold 17px Courier New';
      ctx.fillText(T('new_hi'), CONFIG.WIDTH/2, Math.round(CONFIG.HEIGHT*0.36));
      ctx.shadowBlur=0;
    } else if (this.highScore > 0) {
      ctx.fillStyle=CONFIG.COLORS.dim; ctx.font='13px Courier New';
      ctx.fillText(T('best')+': '+this.highScore, CONFIG.WIDTH/2, Math.round(CONFIG.HEIGHT*0.36));
    }

    // Leaderboard
    this._drawLeaderboard(ctx, ts);

    if (Math.floor(ts/540) % 2 === 0) {
      ctx.fillStyle=CONFIG.COLORS.hud; ctx.font='bold 15px Courier New';
      ctx.fillText(this._isTouchDevice() ? T('restart_t') : T('restart'), CONFIG.WIDTH/2, Math.round(CONFIG.HEIGHT*0.94));
    }

    this._drawCRT(); ctx.restore();
    if (this.input.consumeAction() || this.input.consumeClick()) this.toPlaying();
  }

  _drawLeaderboard(ctx, ts) {
    const startY = Math.round(CONFIG.HEIGHT * 0.42);
    const lineH  = Math.min(22, CONFIG.HEIGHT * 0.032);
    const maxRows = Math.min(8, Math.floor((CONFIG.HEIGHT * 0.46) / lineH));

    ctx.save();
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = CONFIG.COLORS.accent; ctx.font = 'bold 13px Courier New';
    ctx.shadowColor = CONFIG.COLORS.accent; ctx.shadowBlur = 8;
    ctx.fillText(T('leaderboard'), CONFIG.WIDTH/2, startY);
    ctx.shadowBlur = 0;

    if (this.submittingScore) {
      ctx.fillStyle = CONFIG.COLORS.dim; ctx.font = '11px Courier New';
      ctx.fillText(T('submitting'), CONFIG.WIDTH/2, startY + lineH);
      ctx.restore(); return;
    }

    const scores = this.leaderboard.slice(0, maxRows);
    if (scores.length === 0) {
      ctx.fillStyle = CONFIG.COLORS.dim; ctx.font = '11px Courier New';
      ctx.fillText('—', CONFIG.WIDTH/2, startY + lineH);
      ctx.restore(); return;
    }

    const colW  = Math.min(320, CONFIG.WIDTH * 0.7);
    const lx    = CONFIG.WIDTH/2 - colW/2;

    scores.forEach((entry, i) => {
      const y = startY + (i+1) * lineH + 6;
      const isMe = entry.name === this.playerName && entry.score === this.score;
      ctx.fillStyle = isMe ? CONFIG.COLORS.player : (i === 0 ? CONFIG.COLORS.hud : CONFIG.COLORS.dim);
      ctx.font = (isMe || i === 0 ? 'bold ' : '') + '11px Courier New';
      ctx.textAlign = 'left';
      ctx.fillText(`#${i+1}`, lx, y);
      ctx.fillText(entry.name || '???', lx + 32, y);
      ctx.textAlign = 'right';
      ctx.fillText(entry.score, lx + colW - 50, y);
      ctx.fillText(T('lb_wave') + ' ' + (entry.wave || '?'), lx + colW, y);
    });

    if (!CONFIG.LEADERBOARD_URL) {
      ctx.textAlign = 'center'; ctx.fillStyle = CONFIG.COLORS.dim;
      ctx.font = '9px Courier New';
      ctx.fillText(T('lb_offline'), CONFIG.WIDTH/2, startY + (scores.length+1)*lineH + 10);
    }

    ctx.restore();
  }
}

// =============================================================================
// Bootstrap
// =============================================================================
window.addEventListener('load', () => { window.game = new Game(); });
