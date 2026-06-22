// =============================================================================
// BUG SQUASHER — Rubber Duck Debugging: The Game  v1.4.0
// =============================================================================
// Architecture:
//   CONFIG / STRINGS / T() / isRTL() / rtlAlign() / F()
//   AudioManager, InputManager, Particle/ParticleSystem
//   Entity → Bullet, Player, Spider, Snake, Octopus, Ghost
//   WaveManager, Game
//
// State machine:  LANG_SELECT → NAME_INPUT → MENU → PLAYING → PAUSED → GAME_OVER
// =============================================================================

const SYS    = "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif";
const SYS_AR = "'Geeza Pro', 'Arabic Typesetting', 'Segoe UI', 'Noto Sans Arabic', Arial, sans-serif";
const MONO   = "'Courier New', Courier, monospace";

// =============================================================================
// CONFIG
// =============================================================================
const CONFIG = {
  // Fixed logical resolution — consistent gameplay on all screen sizes
  WIDTH:  800,
  HEIGHT: 600,
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
  LEADERBOARD_URL: '',

  COLORS: {
    bg:      '#0a0e17',
    player:  '#FFD700',
    bullet:  '#FFE066',
    spider:  '#cc2200',
    snake:   '#39FF14',
    octopus: '#9B59B6',
    ghost:   '#00FFFF',
    textPri: '#F1F5F9',
    textSec: '#64748B',
    textDim: '#334155',
    accent:  '#3B82F6',
    gold:    '#FFD700',
    error:   '#EF4444',
    success: '#10B981',
    surface: 'rgba(255,255,255,0.04)',
    border:  'rgba(255,255,255,0.08)',
    overlay: 'rgba(10,14,23,0.82)',
  }
};

// =============================================================================
// STRINGS  (i18n — DE / EN / FR / ES / AR)
// =============================================================================
const STRINGS = {
  en: {
    subtitle:      'rubber duck debugging, taken literally',
    ctrl_move_t:   'Left joystick — move',
    ctrl_shoot_t:  'Shoot button — fire',
    ctrl_both_t:   'Joystick sets aim direction',
    ctrl_move:     'WASD / Arrows — move',
    ctrl_shoot:    'Mouse aim + Click / Space — shoot',
    ctrl_pause:    'P — pause',
    start_t:       'Tap anywhere to start',
    start:         'Click or press Space to start',
    hi_score:      'Best',
    paused:        'PAUSED',
    resume_t:      'Tap anywhere to resume',
    resume:        'Press P to resume',
    get_ready:     'Get ready…',
    wave_in:       'WAVE {n} incoming',
    wave:          'WAVE {n}',
    move:          'MOVE',
    shoot:         'SHOOT',
    seg_fault:     'SEGMENTATION FAULT',
    core_dump:     '(core dumped)',
    score_lbl:     'Score',
    new_hi:        'New personal best!',
    best:          'Best',
    restart_t:     'Tap to play again',
    restart:       'Click or Space to play again',
    lang_title:    'Choose your language',
    lang_sub:      'Your browser language was pre-selected',
    name_title:    "What's your name?",
    name_sub:      'Appears on the leaderboard',
    name_hint:     'Press Enter to confirm',
    name_hint_t:   'Tap Confirm to continue',
    name_back:     'Back',
    name_confirm:  'Confirm',
    leaderboard:   'Leaderboard',
    submitting:    'Saving…',
    lb_rank:       '#',
    lb_name:       'Name',
    lb_score:      'Score',
    lb_wave:       'Wave',
    lb_offline:    'Scores saved locally',
    lb_empty:      'No scores yet',
    lb_you:        'You',
    enemy_spider:  'NULL PTR SPIDER',
    enemy_snake:   'SEGFAULT SNAKE',
    enemy_octopus: 'INFINITE LOOP ∞',
    enemy_ghost:   'MEMORY LEAK',
    combo:         'COMBO',
  },
  de: {
    subtitle:      'Rubber-Duck-Debugging, wörtlich genommen',
    ctrl_move_t:   'Joystick links — bewegen',
    ctrl_shoot_t:  'Button rechts — schießen',
    ctrl_both_t:   'Joystick steuert Richtung',
    ctrl_move:     'WASD / Pfeile — bewegen',
    ctrl_shoot:    'Maus zielen + Klick / Space — schießen',
    ctrl_pause:    'P — Pause',
    start_t:       'Tippen um zu starten',
    start:         'Klicken oder Leertaste',
    hi_score:      'Bestzeit',
    paused:        'PAUSE',
    resume_t:      'Tippen um fortzufahren',
    resume:        'P drücken um fortzufahren',
    get_ready:     'Bereit machen…',
    wave_in:       'WELLE {n} kommt',
    wave:          'WELLE {n}',
    move:          'BEWEGEN',
    shoot:         'SCHIESSEN',
    seg_fault:     'SEGMENTATION FAULT',
    core_dump:     '(core dumped)',
    score_lbl:     'Punkte',
    new_hi:        'Neuer Highscore!',
    best:          'Beste',
    restart_t:     'Tippen zum Neustart',
    restart:       'Klick oder Leertaste',
    lang_title:    'Sprache wählen',
    lang_sub:      'Deine Browser-Sprache wurde vorausgewählt',
    name_title:    'Wie heißt du?',
    name_sub:      'Erscheint in der Bestenliste',
    name_hint:     'Enter drücken zum Bestätigen',
    name_hint_t:   'Bestätigen tippen',
    name_back:     'Zurück',
    name_confirm:  'Bestätigen',
    leaderboard:   'Bestenliste',
    submitting:    'Speichern…',
    lb_rank:       '#',
    lb_name:       'Name',
    lb_score:      'Punkte',
    lb_wave:       'Welle',
    lb_offline:    'Lokal gespeichert',
    lb_empty:      'Noch keine Einträge',
    lb_you:        'Du',
    enemy_spider:  'NULL-PTR-SPINNE',
    enemy_snake:   'SEGFAULT-SCHLANGE',
    enemy_octopus: 'ENDLOSSCHLEIFE ∞',
    enemy_ghost:   'SPEICHERLECK',
    combo:         'KOMBO',
  },
  fr: {
    subtitle:      'débogage par canard en caoutchouc, au pied de la lettre',
    ctrl_move_t:   'Joystick gauche — déplacer',
    ctrl_shoot_t:  'Bouton droit — tirer',
    ctrl_both_t:   'Le joystick oriente la direction',
    ctrl_move:     'WASD / FLÈCHES — déplacer',
    ctrl_shoot:    'Souris viser + Clic / Espace — tirer',
    ctrl_pause:    'P — pause',
    start_t:       'Toucher pour commencer',
    start:         'Clic ou Espace pour commencer',
    hi_score:      'Meilleur',
    paused:        'PAUSE',
    resume_t:      'Toucher pour reprendre',
    resume:        'Appuyer P pour reprendre',
    get_ready:     'Préparez-vous…',
    wave_in:       'VAGUE {n} en approche',
    wave:          'VAGUE {n}',
    move:          'DÉPLACER',
    shoot:         'TIRER',
    seg_fault:     'SEGMENTATION FAULT',
    core_dump:     '(core dumped)',
    score_lbl:     'Score',
    new_hi:        'Nouveau record!',
    best:          'Meilleur',
    restart_t:     'Toucher pour rejouer',
    restart:       'Clic ou Espace pour rejouer',
    lang_title:    'Choisir la langue',
    lang_sub:      'Langue du navigateur présélectionnée',
    name_title:    'Quel est votre nom?',
    name_sub:      'Apparaîtra dans le classement',
    name_hint:     'Entrée pour confirmer',
    name_hint_t:   'Appuyer sur Confirmer',
    name_back:     'Retour',
    name_confirm:  'Confirmer',
    leaderboard:   'Classement',
    submitting:    'Enregistrement…',
    lb_rank:       '#',
    lb_name:       'Nom',
    lb_score:      'Score',
    lb_wave:       'Vague',
    lb_offline:    'Enregistré localement',
    lb_empty:      'Pas encore de scores',
    lb_you:        'Vous',
    enemy_spider:  'ARAIGNÉE NULL PTR',
    enemy_snake:   'SERPENT SEGFAULT',
    enemy_octopus: 'PIEUVRE BOUCLE ∞',
    enemy_ghost:   'FANTÔME FUITE MÉM.',
    combo:         'COMBO',
  },
  es: {
    subtitle:      'depuración con pato de goma, tomada literalmente',
    ctrl_move_t:   'Joystick izquierdo — mover',
    ctrl_shoot_t:  'Botón derecho — disparar',
    ctrl_both_t:   'El joystick controla la dirección',
    ctrl_move:     'WASD / FLECHAS — mover',
    ctrl_shoot:    'Ratón apuntar + Clic / Espacio — disparar',
    ctrl_pause:    'P — pausa',
    start_t:       'Toca para comenzar',
    start:         'Clic o Espacio para comenzar',
    hi_score:      'Mejor',
    paused:        'PAUSA',
    resume_t:      'Toca para continuar',
    resume:        'Presiona P para continuar',
    get_ready:     'Prepárate…',
    wave_in:       'OLA {n} en camino',
    wave:          'OLA {n}',
    move:          'MOVER',
    shoot:         'DISPARAR',
    seg_fault:     'SEGMENTATION FAULT',
    core_dump:     '(core dumped)',
    score_lbl:     'Puntos',
    new_hi:        '¡Nuevo récord!',
    best:          'Mejor',
    restart_t:     'Toca para jugar de nuevo',
    restart:       'Clic o Espacio para jugar de nuevo',
    lang_title:    'Seleccionar idioma',
    lang_sub:      'Idioma del navegador preseleccionado',
    name_title:    '¿Cómo te llamas?',
    name_sub:      'Aparecerá en la clasificación',
    name_hint:     'Enter para confirmar',
    name_hint_t:   'Toca Confirmar',
    name_back:     'Atrás',
    name_confirm:  'Confirmar',
    leaderboard:   'Clasificación',
    submitting:    'Guardando…',
    lb_rank:       '#',
    lb_name:       'Nombre',
    lb_score:      'Puntos',
    lb_wave:       'Ola',
    lb_offline:    'Guardado localmente',
    lb_empty:      'Sin puntuaciones aún',
    lb_you:        'Tú',
    enemy_spider:  'ARAÑA NULL PTR',
    enemy_snake:   'SERPIENTE SEGFAULT',
    enemy_octopus: 'PULPO BUCLE ∞',
    enemy_ghost:   'FANTASMA FUGA MEM.',
    combo:         'COMBO',
  },
  ar: {
    subtitle:      'تنقيح البط المطاطي، بالمعنى الحرفي',
    ctrl_move_t:   'عصا التحكم — تحرك',
    ctrl_shoot_t:  'زر الإطلاق — أطلق',
    ctrl_both_t:   'عصا التحكم تحدد الاتجاه',
    ctrl_move:     'WASD / الأسهم — تحرك',
    ctrl_shoot:    'الفأرة للتصويب + نقر / مسافة — أطلق',
    ctrl_pause:    'P — إيقاف مؤقت',
    start_t:       'انقر في أي مكان للبدء',
    start:         'انقر أو اضغط المسافة للبدء',
    hi_score:      'الأفضل',
    paused:        'متوقف',
    resume_t:      'انقر في أي مكان للمتابعة',
    resume:        'اضغط P للمتابعة',
    get_ready:     'استعد…',
    wave_in:       'الموجة {n} قادمة',
    wave:          'موجة {n}',
    move:          'تحرك',
    shoot:         'أطلق',
    seg_fault:     'SEGMENTATION FAULT',
    core_dump:     '(core dumped)',
    score_lbl:     'النقاط',
    new_hi:        'رقم شخصي جديد!',
    best:          'الأفضل',
    restart_t:     'انقر للعب مجدداً',
    restart:       'انقر أو المسافة للعب مجدداً',
    lang_title:    'اختر لغتك',
    lang_sub:      'تم اختيار لغة المتصفح مسبقاً',
    name_title:    'ما اسمك؟',
    name_sub:      'سيظهر في لوحة المتصدرين',
    name_hint:     'اضغط Enter للتأكيد',
    name_hint_t:   'انقر تأكيد للمتابعة',
    name_back:     'رجوع',
    name_confirm:  'تأكيد',
    leaderboard:   'لوحة المتصدرين',
    submitting:    'جاري الحفظ…',
    lb_rank:       '#',
    lb_name:       'الاسم',
    lb_score:      'النقاط',
    lb_wave:       'الموجة',
    lb_offline:    'النتائج محفوظة محلياً',
    lb_empty:      'لا توجد نتائج بعد',
    lb_you:        'أنت',
    enemy_spider:  'عنكبوت NULL PTR',
    enemy_snake:   'ثعبان SEGFAULT',
    enemy_octopus: 'أخطبوط الحلقة اللانهائية ∞',
    enemy_ghost:   'شبح تسرب الذاكرة',
    combo:         'combo',
  },
};

function T(key, n) {
  const lang = window.__bsLang || 'en';
  const dict = STRINGS[lang] || STRINGS.en;
  let s = dict[key] !== undefined ? dict[key] : (STRINGS.en[key] || key);
  if (n !== undefined) s = s.replace('{n}', n);
  return s;
}

function isRTL() { return window.__bsLang === 'ar'; }

function rtlAlign(normal) {
  if (!isRTL()) return normal;
  if (normal === 'left')  return 'right';
  if (normal === 'right') return 'left';
  return normal;
}

// Font helper — injects Arabic font stack when RTL
function F(size, weight) {
  const family = isRTL() ? SYS_AR : SYS;
  return weight ? `${weight} ${size}px ${family}` : `${size}px ${family}`;
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
    const osc = this.actx.createOscillator(), g = this.actx.createGain();
    osc.connect(g); g.connect(this.actx.destination);
    osc.type = type; osc.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(volume * CONFIG.MASTER_VOLUME, now + (attack || 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.start(now); osc.stop(now + duration + 0.02);
  }
  _sweep(f0, f1, type, duration, volume) {
    this._ensure();
    const now = this.actx.currentTime;
    const osc = this.actx.createOscillator(), g = this.actx.createGain();
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
      const osc = this.actx.createOscillator(), g = this.actx.createGain();
      osc.connect(g); g.connect(this.actx.destination);
      osc.type = 'sine'; osc.frequency.setValueAtTime(freq, now);
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
    this.mouse = { x: CONFIG.WIDTH / 2, y: CONFIG.HEIGHT / 2, down: false };
    this.touch = {
      joystick: { active: false, id: -1, startX: 0, startY: 0, curX: 0, curY: 0 },
      shoot:    { active: false, id: -1, x: 0, y: 0 },
    };
    this._pauseConsumed  = false;
    this._actionConsumed = false;
    this._clickConsumed  = false;
    // Last known move direction for keyboard-only shooting
    this._lastMoveAngle  = 0;
    this._spaceHeld      = false;
    this._scale          = 1; // updated by Game._initCanvas via setScale()
    this._bindKeyboard();
    this._bindMouse(canvas);
    this._bindTouch(canvas);
  }
  setScale(scale) { this._scale = scale; }
  _bindKeyboard() {
    window.addEventListener('keydown', e => {
      this.keys[e.code] = true;
      if (e.code === 'KeyP') this._pauseConsumed = true;
      if (e.code === 'Space') { this._actionConsumed = true; this._spaceHeld = true; e.preventDefault(); }
      if (e.code === 'Enter') { this._actionConsumed = true; e.preventDefault(); }
    });
    window.addEventListener('keyup', e => {
      this.keys[e.code] = false;
      if (e.code === 'Space') this._spaceHeld = false;
    });
  }
  _bindMouse(canvas) {
    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      this.mouse.x = (e.clientX - r.left) / this._scale;
      this.mouse.y = (e.clientY - r.top)  / this._scale;
    });
    canvas.addEventListener('mousedown', e => {
      this.mouse.down = true; this._clickConsumed = true;
      if (e.target.tagName === 'CANVAS') e.preventDefault();
    });
    canvas.addEventListener('mouseup', () => { this.mouse.down = false; });
  }
  _bindTouch(canvas) {
    const toLogical = (cx, cy) => {
      const r = canvas.getBoundingClientRect();
      return {
        x: (cx - r.left) / this._scale,
        y: (cy - r.top)  / this._scale,
      };
    };
    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        const p = toLogical(t.clientX, t.clientY);
        // Always mirror into mouse for menu hit-tests
        this.mouse.x = p.x;
        this.mouse.y = p.y;
        this._clickConsumed = true;
        this._actionConsumed = true;

        // Shoot button: bottom-right corner (right 35% × bottom 22%)
        const inShootBtn = p.x > CONFIG.WIDTH * 0.65 && p.y > CONFIG.HEIGHT * 0.78;
        if (inShootBtn) {
          this.touch.shoot = { active: true, id: t.identifier, x: p.x, y: p.y };
        } else {
          // Joystick: anywhere else (preferably left half, but full screen for comfort)
          if (!this.touch.joystick.active) {
            this.touch.joystick = { active: true, id: t.identifier, startX: p.x, startY: p.y, curX: p.x, curY: p.y };
          }
        }
      }
    }, { passive: false });
    canvas.addEventListener('touchmove', e => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        const p = toLogical(t.clientX, t.clientY);
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
    if (len > 0) {
      this._lastMoveAngle = Math.atan2(dy, dx);
      return { x: dx / len, y: dy / len };
    }
    return { x: 0, y: 0 };
  }
  getAimAngle(px, py) {
    // Touch shoot: aim in joystick direction (or last move direction if joystick idle)
    if (this.touch.shoot.active) return this._lastMoveAngle;
    // Mouse: aim toward cursor (only if cursor is meaningfully away from player)
    const mouseDist = Math.hypot(this.mouse.x - px, this.mouse.y - py);
    if (mouseDist > 5) return Math.atan2(this.mouse.y - py, this.mouse.x - px);
    // Keyboard-only: aim in last move direction
    return this._lastMoveAngle;
  }
  isShootingHeld() { return this.mouse.down || this.touch.shoot.active || this._spaceHeld; }
  consumePause()   { const v = this._pauseConsumed;  this._pauseConsumed  = false; return v; }
  consumeAction()  { const v = this._actionConsumed; this._actionConsumed = false; return v; }
  consumeClick()   { const v = this._clickConsumed;  this._clickConsumed  = false; return v; }
  clearAll()       { this._pauseConsumed = false; this._actionConsumed = false; this._clickConsumed = false; }
}

// =============================================================================
// Particle / ParticleSystem
// =============================================================================
class Particle {
  constructor(x, y, vx, vy, color, radius, life) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.color = color; this.radius = radius; this.life = life; this.maxLife = life;
  }
  update(dt) { this.x += this.vx*dt*0.001; this.y += this.vy*dt*0.001; this.vx *= 0.96; this.vy *= 0.96; this.life -= dt; }
  draw(ctx) {
    const a = Math.max(0, this.life / this.maxLife);
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = this.color;
    ctx.shadowColor = this.color; ctx.shadowBlur = 4;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.radius * a, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0; ctx.restore();
  }
  get isDead() { return this.life <= 0; }
}
class ParticleSystem {
  constructor() { this.particles = []; }
  emit(x, y, color, count, o) {
    o = o || {};
    const sMin=o.speedMin||60, sMax=o.speedMax||200, lMin=o.lifeMin||300, lMax=o.lifeMax||700, rMin=o.radiusMin||2, rMax=o.radiusMax||6;
    for (let i=0; i<count; i++) {
      const a=Math.random()*Math.PI*2, sp=sMin+Math.random()*(sMax-sMin);
      this.particles.push(new Particle(x, y, Math.cos(a)*sp, Math.sin(a)*sp, color, rMin+Math.random()*(rMax-rMin), lMin+Math.random()*(lMax-lMin)));
    }
  }
  update(dt) { for (const p of this.particles) p.update(dt); this.particles = this.particles.filter(p => !p.isDead); }
  draw(ctx)  { for (const p of this.particles) p.draw(ctx); }
}

// =============================================================================
// Entity (base)
// =============================================================================
class Entity {
  constructor(x, y, radius) { this.x=x; this.y=y; this.radius=radius; this.vx=0; this.vy=0; this.dead=false; }
  collidesWith(o) { return Math.hypot(this.x-o.x, this.y-o.y) < this.radius+o.radius; }
  update() {} draw() {}
}

// =============================================================================
// Bullet
// =============================================================================
class Bullet extends Entity {
  constructor(x, y, angle) {
    super(x, y, CONFIG.BULLET_RADIUS);
    this.vx = Math.cos(angle)*CONFIG.BULLET_SPEED; this.vy = Math.sin(angle)*CONFIG.BULLET_SPEED;
    this.trail = [];
  }
  update(dt) {
    this.trail.push({x:this.x, y:this.y});
    if (this.trail.length > 5) this.trail.shift();
    this.x += this.vx*dt*0.001; this.y += this.vy*dt*0.001;
    if (this.x<-20||this.x>CONFIG.WIDTH+20||this.y<-20||this.y>CONFIG.HEIGHT+20) this.dead=true;
  }
  draw(ctx) {
    ctx.save();
    for (let i=0; i<this.trail.length; i++) {
      ctx.globalAlpha=(i/this.trail.length)*0.4; ctx.fillStyle=CONFIG.COLORS.bullet;
      ctx.beginPath(); ctx.arc(this.trail[i].x, this.trail[i].y, this.radius*(i/this.trail.length)*0.7, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha=1; ctx.shadowColor=CONFIG.COLORS.bullet; ctx.shadowBlur=8;
    ctx.fillStyle=CONFIG.COLORS.bullet; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur=0; ctx.restore();
  }
}

// =============================================================================
// Player (Rubber Duck)
// =============================================================================
class Player extends Entity {
  constructor(x, y) {
    super(x, y, CONFIG.PLAYER_RADIUS);
    this.hp=CONFIG.PLAYER_MAX_HP; this.shootTimer=0; this.invincibleTimer=0;
    this.squishTimer=0; this.time=0; this.facing=0; this.moving=false;
  }
  update(dt, input) {
    this.time+=dt*0.001;
    this.shootTimer=Math.max(0,this.shootTimer-dt);
    this.invincibleTimer=Math.max(0,this.invincibleTimer-dt);
    this.squishTimer=Math.max(0,this.squishTimer-dt);
    const mv=input.getMoveVector();
    this.vx=mv.x*CONFIG.PLAYER_SPEED; this.vy=mv.y*CONFIG.PLAYER_SPEED;
    this.moving=mv.x!==0||mv.y!==0;
    this.x=Math.max(this.radius, Math.min(CONFIG.WIDTH -this.radius, this.x+this.vx*dt*0.001));
    this.y=Math.max(this.radius, Math.min(CONFIG.HEIGHT-this.radius, this.y+this.vy*dt*0.001));
    this.facing=input.getAimAngle(this.x, this.y);
  }
  tryShoot(audio) {
    if (this.shootTimer>0) return null;
    this.shootTimer=CONFIG.SHOOT_COOLDOWN; this.squishTimer=100;
    audio.playShoot(); return new Bullet(this.x, this.y, this.facing);
  }
  takeDamage(audio) {
    if (this.invincibleTimer>0) return;
    this.hp--; this.invincibleTimer=CONFIG.PLAYER_INVINCIBLE_MS; audio.playHurt();
  }
  draw(ctx) {
    if (this.invincibleTimer>0 && Math.floor(this.invincibleTimer/100)%2===0) return;
    ctx.save(); ctx.translate(this.x, this.y);
    ctx.translate(0, this.moving ? Math.sin(this.time*8)*3 : 0);
    ctx.rotate(Math.sin(this.time*3)*0.15);
    if (this.squishTimer>0) ctx.scale(1.2, 0.82);
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
    this.hp=2; this.speed=110+Math.random()*40;
    this.legPhase=Math.random()*Math.PI*2; this.color=CONFIG.COLORS.spider;
  }
  update(dt, player) {
    const dx=player.x-this.x,dy=player.y-this.y,d=Math.hypot(dx,dy)||1;
    this.vx=(dx/d)*this.speed; this.vy=(dy/d)*this.speed;
    this.x+=this.vx*dt*0.001; this.y+=this.vy*dt*0.001; this.legPhase+=dt*0.008;
    if (this.x<-100||this.x>CONFIG.WIDTH+100||this.y<-100||this.y>CONFIG.HEIGHT+100) this.dead=true;
  }
  draw(ctx) {
    ctx.save(); ctx.translate(this.x, this.y);
    const fa=Math.atan2(this.vy, this.vx);
    ctx.strokeStyle=this.color; ctx.lineWidth=1.5;
    for (const side of [-1,1]) for (let i=0;i<4;i++) {
      const a=fa+side*(Math.PI*0.55+[-0.9,-0.45,0.45,0.9][i]), len=13+Math.sin(this.legPhase+i*0.7)*3;
      ctx.beginPath(); ctx.moveTo(0,0);
      ctx.quadraticCurveTo(Math.cos(a)*len*0.55,Math.sin(a)*len*0.55,Math.cos(a+side*0.25)*len,Math.sin(a+side*0.25)*len); ctx.stroke();
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
    this.x=this.spineX+Math.cos(perp)*Math.sin(this.sinePhase)*28;
    this.y=this.spineY+Math.sin(perp)*Math.sin(this.sinePhase)*28;
    const dx=player.x-this.x,dy=player.y-this.y,d=Math.hypot(dx,dy)||1;
    this.baseAngle+=Math.atan2(dy/d,dx/d)*0.025;
    if (this.x<-50||this.x>CONFIG.WIDTH+50||this.y<-50||this.y>CONFIG.HEIGHT+50) this.dead=true;
  }
  draw(ctx) {
    ctx.save(); ctx.translate(this.x, this.y);
    ctx.shadowColor=this.color; ctx.shadowBlur=14;
    const perp=this.baseAngle+Math.PI/2;
    const sc=['#1a5c0a','#237512','#2d9916','#35bb1b',this.color];
    for (let i=4;i>=0;i--) {
      const so=Math.sin(this.sinePhase-i*0.55)*28;
      ctx.fillStyle=sc[i];
      ctx.beginPath();
      ctx.arc(Math.cos(perp)*(so-Math.sin(this.sinePhase)*28)+Math.cos(this.baseAngle+Math.PI)*i*9,
              Math.sin(perp)*(so-Math.sin(this.sinePhase)*28)+Math.sin(this.baseAngle+Math.PI)*i*9,
              9-i*0.9,0,Math.PI*2); ctx.fill();
    }
    ctx.shadowBlur=0; ctx.strokeStyle='#FF1111'; ctx.lineWidth=1.2;
    const ta=this.baseAngle,tl=11;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(Math.cos(ta)*tl*0.7,Math.sin(ta)*tl*0.7);
    ctx.moveTo(Math.cos(ta)*tl*0.7,Math.sin(ta)*tl*0.7); ctx.lineTo(Math.cos(ta-0.3)*tl,Math.sin(ta-0.3)*tl);
    ctx.moveTo(Math.cos(ta)*tl*0.7,Math.sin(ta)*tl*0.7); ctx.lineTo(Math.cos(ta+0.3)*tl,Math.sin(ta+0.3)*tl);
    ctx.stroke(); ctx.restore();
  }
}

// =============================================================================
// Octopus — InfiniteLoop Octopus
// =============================================================================
class Octopus extends Entity {
  constructor(x, y) {
    super(x, y, 16);
    this.hp=4; this.orbitAngle=Math.atan2(y-CONFIG.HEIGHT/2,x-CONFIG.WIDTH/2);
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
      if (this.chargeDuration<=0){this.charging=false;this.chargeTimer=2000+Math.random()*1200;this.orbitAngle=Math.atan2(this.y-CONFIG.HEIGHT/2,this.x-CONFIG.WIDTH/2);}
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
    for (let i=0;i<8;i++) {
      const a=(i/8)*Math.PI*2,w=Math.sin(this.tentaclePhase+i*0.78)*9;
      ctx.strokeStyle=this.color; ctx.lineWidth=3.5-i*0.15;
      ctx.beginPath(); ctx.moveTo(0,0);
      ctx.quadraticCurveTo(Math.cos(a+0.4)*20+w,Math.sin(a+0.4)*20,Math.cos(a)*30,Math.sin(a)*30); ctx.stroke();
    }
    ctx.fillStyle=this.color; ctx.beginPath(); ctx.arc(0,0,15,0,Math.PI*2); ctx.fill();
    if(this.charging){ctx.shadowBlur=0;ctx.strokeStyle='#FF88FF';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,18,0,Math.PI*2);ctx.stroke();}
    ctx.shadowBlur=0; ctx.fillStyle='#E8D5F5'; ctx.font=`11px ${MONO}`;
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
    ctx.shadowBlur=0; ctx.globalAlpha=0.8; ctx.fillStyle='#0a0e17';
    for (const ex of[-5,5]){ctx.beginPath();ctx.ellipse(ex,-6,3,4,0,0,Math.PI*2);ctx.fill();}
    ctx.globalAlpha=0.35; ctx.fillStyle=this.color; ctx.font=`5px ${MONO}`;
    ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('NULL',0,10);
    ctx.restore();
  }
}

// =============================================================================
// WaveManager
// =============================================================================
class WaveManager {
  constructor() { this.wave=0; this.state='gap'; this.gapTimer=1500; this.spawnQueue=[]; this.enemiesThisWave=0; this.waveCleared=false; }
  update(dt, enemies, audio) {
    this.waveCleared=false;
    if (this.state==='gap'){this.gapTimer-=dt;if(this.gapTimer<=0){this.wave++;this._buildWave();this.state='active';}return;}
    if (this.spawnQueue.length>0){
      this.spawnQueue[0].timer-=dt;
      if(this.spawnQueue[0].timer<=0){const e=this.spawnQueue.shift();enemies.push(this._spawnEnemy(e.type,e.player));}
    }
    if(this.spawnQueue.length===0&&enemies.length===0){this.state='gap';this.gapTimer=CONFIG.WAVE_GAP_MS;this.waveCleared=true;audio.playWaveClear();}
  }
  _buildWave() {
    const w=this.wave,types=[];
    const nSp=Math.min(3+w,10),nSn=Math.max(0,Math.floor((w+1)/2)),nOc=Math.max(0,Math.floor((w-2)/2)),nGh=Math.max(0,Math.floor((w-3)/3));
    for(let i=0;i<nSp;i++)types.push('Spider');
    for(let i=0;i<nSn;i++)types.push('Snake');
    for(let i=0;i<nOc;i++)types.push('Octopus');
    for(let i=0;i<nGh;i++)types.push('Ghost');
    for(let i=types.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[types[i],types[j]]=[types[j],types[i]];}
    this.spawnQueue=types.map((type,i)=>({type,timer:i*250,player:null}));
    this.enemiesThisWave=types.length;
  }
  _spawnEnemy(type,playerRef) {
    const pos=this._edgePosition(),p=playerRef||{x:CONFIG.WIDTH/2,y:CONFIG.HEIGHT/2};
    if(type==='Spider')  return new Spider(pos.x,pos.y);
    if(type==='Snake')   return new Snake(pos.x,pos.y,p);
    if(type==='Octopus') return new Octopus(pos.x,pos.y);
    return new Ghost(pos.x,pos.y);
  }
  injectPlayer(player){for(const e of this.spawnQueue)e.player=player;}
  _edgePosition(){
    const edge=Math.floor(Math.random()*4),W=CONFIG.WIDTH,H=CONFIG.HEIGHT;
    if(edge===0)return{x:Math.random()*W,y:-35};
    if(edge===1)return{x:W+35,y:Math.random()*H};
    if(edge===2)return{x:Math.random()*W,y:H+35};
    return{x:-35,y:Math.random()*H};
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

    this.lang = this._detectLang();
    window.__bsLang = this.lang;

    this.state  = 'LANG_SELECT';
    this.lastTs = 0; this.shakeX=0; this.shakeY=0;
    this._gameOverTs = 0;

    this.player=null; this.enemies=[]; this.bullets=[];
    this.ps=new ParticleSystem(); this.waves=new WaveManager();
    this.audio=new AudioManager(); this.input=new InputManager(this.canvas);

    this.score=0; this.combo=1; this.comboTimer=0;
    this.highScore=parseInt(localStorage.getItem(CONFIG.HS_KEY))||0;
    this.playerName='';

    this.leaderboard=this._loadLocalScores();
    this.scoreSubmitted=false; this.submittingScore=false;

    this._langCards=[];
    this._wireNameInput();
    this._initCanvas();
    window.addEventListener('resize', () => this._onResize());
    this._startLoop();
  }

  _detectLang() {
    const saved=localStorage.getItem(CONFIG.LANG_KEY);
    if (saved&&STRINGS[saved]) return saved;
    const nav=(navigator.language||'en').slice(0,2).toLowerCase();
    return STRINGS[nav]?nav:'en';
  }
  _setLang(code) { this.lang=code; window.__bsLang=code; localStorage.setItem(CONFIG.LANG_KEY,code); }

  _wireNameInput() {
    if (!this.nameEl) return;
    this.nameEl.addEventListener('keydown', e => {
      if (e.key==='Enter'){e.preventDefault();const v=this.nameEl.value.trim();if(v){this.playerName=v;this._hideNameInput();this.toMenu();}}
      if (e.key==='Escape'){this._hideNameInput();this.toLangSelect();}
    });
  }
  _showNameInput() {
    if (!this.nameEl) return;
    this.nameEl.value=this.playerName; this.nameEl.placeholder=T('name_hint');
    this.nameEl.dir=isRTL()?'rtl':'ltr';
    this.nameEl.classList.add('visible'); setTimeout(()=>this.nameEl.focus(),50);
  }
  _hideNameInput() { if (!this.nameEl) return; this.nameEl.classList.remove('visible'); this.nameEl.blur(); }

  _initCanvas() {
    const dpr    = window.devicePixelRatio || 1;
    const scaleX = window.innerWidth  / CONFIG.WIDTH;
    const scaleY = window.innerHeight / CONFIG.HEIGHT;
    // Fill screen: scale up to fit (cover, not letterbox — crops slightly if aspect differs)
    const scale  = Math.max(scaleX, scaleY);
    this._scale  = scale;

    // Canvas physical pixels
    this.canvas.width  = Math.round(CONFIG.WIDTH  * scale * dpr);
    this.canvas.height = Math.round(CONFIG.HEIGHT * scale * dpr);

    // CSS size — fills viewport
    this.canvas.style.width  = Math.round(CONFIG.WIDTH  * scale) + 'px';
    this.canvas.style.height = Math.round(CONFIG.HEIGHT * scale) + 'px';

    // Center canvas if one dimension overflows (cover mode)
    const offX = (window.innerWidth  - CONFIG.WIDTH  * scale) / 2;
    const offY = (window.innerHeight - CONFIG.HEIGHT * scale) / 2;
    this.canvas.style.position = 'fixed';
    this.canvas.style.left     = Math.round(offX) + 'px';
    this.canvas.style.top      = Math.round(offY) + 'px';

    // Transform: scale * dpr maps logical px → physical px
    this.ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);

    // Tell InputManager the current scale for coordinate mapping
    if (this.input) this.input.setScale(scale);
  }
  _onResize() {
    this._initCanvas();
    // Player stays within logical bounds — no clamping needed since bounds are fixed
  }
  _startLoop() {
    const loop=ts=>{
      let dt=ts-this.lastTs; this.lastTs=ts;
      if(dt>CONFIG.MAX_DT)dt=CONFIG.MAX_DT; if(dt<0)dt=0;
      this._loop(dt,ts); requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
  _loop(dt,ts){if(this.state==='PLAYING')this._update(dt,ts);this._draw(ts);}

  // ---- State Transitions ----

  toLangSelect() { this._hideNameInput(); this.state='LANG_SELECT'; }
  toNameInput()  { this._showNameInput(); this.state='NAME_INPUT'; }
  toMenu()       { this._hideNameInput(); this.state='MENU'; }
  toPlaying() {
    this.score=0;this.combo=1;this.comboTimer=0;
    this.enemies=[];this.bullets=[];this.ps=new ParticleSystem();this.waves=new WaveManager();
    this.player=new Player(CONFIG.WIDTH/2,CONFIG.HEIGHT/2);
    this.shakeX=0;this.shakeY=0;this.scoreSubmitted=false;
    this.state='PLAYING';
  }
  toPaused()  { this.state='PAUSED'; }
  toResumed() { this.state='PLAYING'; }
  toGameOver() {
    if(this.score>this.highScore){this.highScore=this.score;localStorage.setItem(CONFIG.HS_KEY,this.highScore);}
    this._saveLocalScore(); this._submitScore();
    this.state='GAME_OVER'; this._gameOverTs=performance.now();
    this.input.clearAll();
  }

  // ---- Leaderboard ----

  _loadLocalScores(){try{const r=localStorage.getItem(CONFIG.SCORES_KEY);return r?JSON.parse(r):[];}catch(e){return[];}}
  _saveLocalScore(){
    if(!this.playerName||this.score<=0)return;
    let scores=this._loadLocalScores();
    scores.push({name:this.playerName,score:this.score,wave:this.waves.wave});
    scores.sort((a,b)=>b.score-a.score);scores=scores.slice(0,20);
    try{localStorage.setItem(CONFIG.SCORES_KEY,JSON.stringify(scores));}catch(e){}
    this.leaderboard=scores;
  }
  async _submitScore(){
    if(!CONFIG.LEADERBOARD_URL||this.scoreSubmitted||!this.playerName||this.score<=0)return;
    this.submittingScore=true;
    try{
      await fetch(CONFIG.LEADERBOARD_URL+'.json',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:this.playerName,score:this.score,wave:this.waves.wave,lang:this.lang,ts:new Date().toISOString()})});
      this.scoreSubmitted=true;
    }catch(e){}
    this.submittingScore=false;await this._fetchLeaderboard();
  }
  async _fetchLeaderboard(){
    if(!CONFIG.LEADERBOARD_URL)return;
    try{
      const r=await fetch(CONFIG.LEADERBOARD_URL+'.json?orderBy="score"&limitToLast=20');
      const data=await r.json();
      if(data&&typeof data==='object')this.leaderboard=Object.values(data).sort((a,b)=>b.score-a.score).slice(0,20);
    }catch(e){}
  }

  // ---- Update ----

  _update(dt){
    if(this.input.consumePause()){this.toPaused();return;}
    this.waves.injectPlayer(this.player);
    if(this.input.isShootingHeld()){const b=this.player.tryShoot(this.audio);if(b)this.bullets.push(b);}
    this.player.update(dt,this.input);
    for(const b of this.bullets)b.update(dt);
    for(const e of this.enemies)e.update(dt,this.player);
    this.waves.update(dt,this.enemies,this.audio);
    this.ps.update(dt);
    if(this.combo>1){this.comboTimer-=dt;if(this.comboTimer<=0){this.combo=1;this.comboTimer=0;}}
    this.shakeX*=CONFIG.SHAKE_DECAY;this.shakeY*=CONFIG.SHAKE_DECAY;
    if(Math.abs(this.shakeX)<0.1)this.shakeX=0;if(Math.abs(this.shakeY)<0.1)this.shakeY=0;
    this._checkCollisions();
  }
  _checkCollisions(){
    for(const b of this.bullets){
      if(b.dead)continue;
      for(const e of this.enemies){
        if(e.dead)continue;
        if(b.collidesWith(e)){b.dead=true;e.hp--;if(e.hp<=0){e.dead=true;this._onKill(e);}break;}
      }
    }
    if(this.player.invincibleTimer<=0){
      for(const e of this.enemies){
        if(e.dead)continue;
        if(e.collidesWith(this.player)){
          this.player.takeDamage(this.audio);this.combo=1;this.comboTimer=0;this._shake(9);
          if(this.player.hp<=0){this.toGameOver();return;}break;
        }
      }
    }
    this.bullets=this.bullets.filter(b=>!b.dead);this.enemies=this.enemies.filter(e=>!e.dead);
  }
  _onKill(enemy){
    this.combo=Math.min(this.combo+1,10);this.comboTimer=CONFIG.COMBO_RESET_MS;
    this.score+=(CONFIG.BASE_SCORES[enemy.constructor.name]||10)*this.combo;
    this.ps.emit(enemy.x,enemy.y,enemy.color,18,{speedMin:60,speedMax:200,lifeMin:300,lifeMax:700,radiusMin:2,radiusMax:6});
    this.audio.playPop();this._shake(4);
  }
  _shake(m){this.shakeX=(Math.random()*2-1)*m;this.shakeY=(Math.random()*2-1)*m;}
  _isTouchDevice(){return 'ontouchstart' in window||navigator.maxTouchPoints>0;}

  // ---- Draw helpers ----

  _roundRect(ctx,x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
    ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
    ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);
    ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath();
  }
  _glassPanel(ctx,x,y,w,h,r){
    ctx.save();this._roundRect(ctx,x,y,w,h,r||16);
    ctx.fillStyle=CONFIG.COLORS.surface;ctx.fill();
    ctx.strokeStyle=CONFIG.COLORS.border;ctx.lineWidth=1;ctx.stroke();
    ctx.restore();
  }
  _drawBg(ctx){ctx.fillStyle=CONFIG.COLORS.bg;ctx.fillRect(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);}
  _drawCRT(){
    const ctx=this.ctx;ctx.save();
    ctx.fillStyle='#000';ctx.globalAlpha=0.035;
    for(let y=0;y<CONFIG.HEIGHT;y+=3)ctx.fillRect(0,y,CONFIG.WIDTH,1);
    ctx.globalAlpha=0.18;
    const g=ctx.createRadialGradient(CONFIG.WIDTH/2,CONFIG.HEIGHT/2,CONFIG.HEIGHT*0.25,CONFIG.WIDTH/2,CONFIG.HEIGHT/2,CONFIG.HEIGHT*0.85);
    g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,0.85)');
    ctx.fillStyle=g;ctx.fillRect(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);
    ctx.restore();
  }

  // ---- Draw dispatcher ----

  _draw(ts){
    const ctx=this.ctx;
    ctx.clearRect(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);
    if(this.state==='LANG_SELECT'){this._drawLangSelect(ts);return;}
    if(this.state==='NAME_INPUT') {this._drawNameInput(ts); return;}
    if(this.state==='MENU')       {this._drawMenu(ts);      return;}
    if(this.state==='GAME_OVER')  {this._drawGameOver(ts);  return;}

    this._drawGame(ts);

    if(this.state==='PAUSED'){
      ctx.save();
      ctx.direction=isRTL()?'rtl':'ltr';
      ctx.fillStyle=CONFIG.COLORS.overlay;ctx.fillRect(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);
      const cw=Math.min(320,CONFIG.WIDTH*0.7),ch=120,cx=(CONFIG.WIDTH-cw)/2,cy=CONFIG.HEIGHT/2-ch/2;
      this._glassPanel(ctx,cx,cy,cw,ch,20);
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillStyle=CONFIG.COLORS.textPri;ctx.font=F(28,'bold');
      ctx.fillText(T('paused'),CONFIG.WIDTH/2,cy+38);
      ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(15);
      ctx.fillText(this._isTouchDevice()?T('resume_t'):T('resume'),CONFIG.WIDTH/2,cy+72);
      ctx.restore();
      if(this.input.consumePause())this.toResumed();
      else if(this._isTouchDevice()&&this.input.consumeClick())this.toResumed();
    }
  }

  // ---- LANG_SELECT ----

  _drawLangSelect(ts){
    const ctx=this.ctx;
    this._drawBg(ctx);
    ctx.direction='ltr'; // Lang select always LTR — user hasn't chosen yet

    const titleY=Math.round(CONFIG.HEIGHT*0.13);
    ctx.save();
    ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillStyle=CONFIG.COLORS.player;ctx.shadowColor=CONFIG.COLORS.player;ctx.shadowBlur=20;
    ctx.font=F(46,'bold');ctx.fillText('BUG SQUASHER',CONFIG.WIDTH/2,titleY);ctx.shadowBlur=0;
    ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(16);
    ctx.fillText(T('lang_title'),CONFIG.WIDTH/2,titleY+30);
    ctx.restore();

    const langs=[
      {code:'de',flag:'🇩🇪',name:'Deutsch'},
      {code:'en',flag:'🇬🇧',name:'English'},
      {code:'fr',flag:'🇫🇷',name:'Français'},
      {code:'es',flag:'🇪🇸',name:'Español'},
      {code:'ar',flag:'🇸🇦',name:'العربية'},
    ];
    const cardW=Math.min(220,CONFIG.WIDTH*0.38),cardH=84,gapX=Math.min(18,CONFIG.WIDTH*0.03),gapY=14;
    const gridW=cardW*2+gapX,startX=CONFIG.WIDTH/2-gridW/2,startY=Math.round(CONFIG.HEIGHT*0.28);
    this._langCards=[];
    const mx=this.input.mouse.x,my=this.input.mouse.y;

    langs.forEach((lang,i)=>{
      const isLastOdd=(langs.length%2!==0)&&(i===langs.length-1);
      const col=isLastOdd?0.5:i%2,row=Math.floor(i/2);
      const x=startX+col*(cardW+gapX),y=startY+row*(cardH+gapY);
      const isActive=this.lang===lang.code,isHov=mx>=x&&mx<=x+cardW&&my>=y&&my<=y+cardH;
      this._langCards.push({code:lang.code,x,y,w:cardW,h:cardH});
      ctx.save();
      if(isActive){
        ctx.fillStyle=CONFIG.COLORS.accent;this._roundRect(ctx,x,y,cardW,cardH,16);ctx.fill();
      } else {
        this._glassPanel(ctx,x,y,cardW,cardH,16);
        if(isHov){this._roundRect(ctx,x,y,cardW,cardH,16);ctx.fillStyle='rgba(255,255,255,0.04)';ctx.fill();}
      }
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.font='32px serif';ctx.fillText(lang.flag,x+cardW/2,y+cardH/2-10);
      // Arabic card: use SYS_AR for the Arabic label
      const cardFont=lang.code==='ar'?`${isActive?'bold ':''} 14px ${SYS_AR}`:(isActive?F(14,'bold'):F(14));
      ctx.font=cardFont;
      ctx.fillStyle=isActive?'#fff':CONFIG.COLORS.textPri;
      ctx.fillText(lang.name,x+cardW/2,y+cardH/2+20);
      ctx.restore();
    });

    const subY=startY+Math.ceil(langs.length/2)*(cardH+gapY)+24;
    ctx.save();
    ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(12);
    ctx.fillText(T('lang_sub'),CONFIG.WIDTH/2,subY);
    ctx.restore();

    this._drawCRT();

    if(this.input.consumeClick()){
      for(const card of this._langCards){
        if(mx>=card.x&&mx<=card.x+card.w&&my>=card.y&&my<=card.y+card.h){
          this._setLang(card.code);this.toNameInput();return;
        }
      }
    }
  }

  // ---- NAME_INPUT ----

  _drawNameInput(ts){
    const ctx=this.ctx;
    this._drawBg(ctx);
    ctx.direction=isRTL()?'rtl':'ltr';

    const titleY=Math.round(CONFIG.HEIGHT*0.30);
    ctx.save();
    ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillStyle=CONFIG.COLORS.player;ctx.shadowColor=CONFIG.COLORS.player;ctx.shadowBlur=18;
    ctx.font=F(40,'bold');ctx.fillText(T('name_title'),CONFIG.WIDTH/2,titleY);ctx.shadowBlur=0;
    ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(15);
    ctx.fillText(T('name_sub'),CONFIG.WIDTH/2,titleY+28);
    ctx.restore();

    const hintY=Math.round(CONFIG.HEIGHT*0.64);
    ctx.save();
    ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(13);
    ctx.fillText(this._isTouchDevice()?T('name_hint_t'):T('name_hint'),CONFIG.WIDTH/2,hintY);
    ctx.restore();

    const btnW=Math.min(200,CONFIG.WIDTH*0.42),btnH=50,btnX=CONFIG.WIDTH/2-btnW/2,btnY=Math.round(CONFIG.HEIGHT*0.69);
    const mx=this.input.mouse.x,my=this.input.mouse.y;
    const hov=mx>=btnX&&mx<=btnX+btnW&&my>=btnY&&my<=btnY+btnH;
    ctx.save();
    this._roundRect(ctx,btnX,btnY,btnW,btnH,14);
    ctx.fillStyle=hov?CONFIG.COLORS.accent:'rgba(59,130,246,0.5)';ctx.fill();
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle='#fff';ctx.font=F(15,'bold');
    ctx.fillText(T('name_confirm'),CONFIG.WIDTH/2,btnY+btnH/2);
    ctx.restore();

    // Back link — RTL-aware
    ctx.save();
    ctx.textBaseline='alphabetic';ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(14);
    if(isRTL()){
      ctx.textAlign='right';
      ctx.fillText(T('name_back')+' →',CONFIG.WIDTH-20,Math.round(CONFIG.HEIGHT*0.92));
    } else {
      ctx.textAlign='left';
      ctx.fillText('← '+T('name_back'),20,Math.round(CONFIG.HEIGHT*0.92));
    }
    ctx.restore();

    this._drawCRT();

    if(this.input.consumeClick()){
      if(mx>=btnX&&mx<=btnX+btnW&&my>=btnY&&my<=btnY+btnH){
        const v=this.nameEl?this.nameEl.value.trim():'';
        if(v){this.playerName=v;this._hideNameInput();this.toMenu();}return;
      }
      const backHit=isRTL()?(mx>CONFIG.WIDTH-140):(mx<140);
      if(backHit&&my>CONFIG.HEIGHT*0.88){this._hideNameInput();this.toLangSelect();}
    }
  }

  // ---- MENU ----

  _drawMenu(ts){
    const ctx=this.ctx;
    this._drawBg(ctx);
    ctx.direction=isRTL()?'rtl':'ltr';

    const titleY=Math.round(CONFIG.HEIGHT*0.14);
    ctx.save();
    ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillStyle=CONFIG.COLORS.player;ctx.shadowColor=CONFIG.COLORS.player;ctx.shadowBlur=22;
    ctx.font=F(58,'bold');ctx.fillText('BUG SQUASHER',CONFIG.WIDTH/2,titleY);ctx.shadowBlur=0;
    ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(16);
    ctx.fillText(T('subtitle'),CONFIG.WIDTH/2,titleY+26);
    ctx.restore();

    this._drawMenuDuck(ctx,CONFIG.WIDTH/2,Math.round(CONFIG.HEIGHT*0.40),ts);

    const ctrlW=Math.min(340,CONFIG.WIDTH*0.7),ctrlH=this._isTouchDevice()?60:82,ctrlX=CONFIG.WIDTH/2-ctrlW/2,ctrlY=Math.round(CONFIG.HEIGHT*0.57);
    this._glassPanel(ctx,ctrlX,ctrlY,ctrlW,ctrlH,14);
    ctx.save();
    ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(13);
    const lines=this._isTouchDevice()
      ?[T('ctrl_move_t'),T('ctrl_shoot_t')]
      :[T('ctrl_move'),T('ctrl_shoot'),T('ctrl_pause')];
    lines.forEach((ln,i)=>ctx.fillText(ln,CONFIG.WIDTH/2,ctrlY+22+i*22));
    ctx.restore();

    this._drawEnemyPreviews(ctx);

    const promptY=Math.round(CONFIG.HEIGHT*0.80);
    if(Math.floor(ts/600)%2===0){
      ctx.save();
      ctx.textAlign='center';ctx.textBaseline='alphabetic';
      ctx.fillStyle=CONFIG.COLORS.textPri;ctx.font=F(15);
      ctx.fillText(this._isTouchDevice()?T('start_t'):T('start'),CONFIG.WIDTH/2,promptY);
      ctx.restore();
    }

    if(this.highScore>0){
      ctx.save();
      ctx.textAlign='center';ctx.textBaseline='alphabetic';
      ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(13);
      ctx.fillText(T('hi_score')+': '+this.highScore,CONFIG.WIDTH/2,Math.round(CONFIG.HEIGHT*0.86));
      ctx.restore();
    }

    // Player name badge — RTL-aware
    if(this.playerName){
      ctx.save();
      ctx.textBaseline='top';ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(12);
      if(isRTL()){ctx.textAlign='left';ctx.fillText(this.playerName+' ◀',14,12);}
      else{ctx.textAlign='right';ctx.fillText('▶ '+this.playerName,CONFIG.WIDTH-14,12);}
      ctx.restore();
    }

    this._drawCRT();
    if(this.input.consumeAction()||this.input.consumeClick())this.toPlaying();
  }

  _drawMenuDuck(ctx,x,y,ts){
    ctx.save();ctx.translate(x,y);ctx.scale(2.2,2.2);
    ctx.rotate(Math.sin(ts*0.0018)*0.18);
    ctx.shadowColor='#FFD700';ctx.shadowBlur=8;
    ctx.fillStyle=CONFIG.COLORS.player;
    ctx.beginPath();ctx.ellipse(0,3,17,13,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#CC9900';ctx.lineWidth=1.5;ctx.stroke();
    ctx.beginPath();ctx.arc(7,-10,10,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#CC9900';ctx.lineWidth=1.5;ctx.stroke();
    ctx.shadowBlur=0;ctx.fillStyle='#FF8C00';
    ctx.beginPath();ctx.moveTo(15,-11);ctx.quadraticCurveTo(28,-9,26,-5);ctx.lineTo(15,-6);ctx.closePath();ctx.fill();
    ctx.translate(10,-13);
    ctx.fillStyle='white';ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.fill();
    const ex=Math.cos(ts*0.0012)*1.5,ey=Math.sin(ts*0.0012)*1.5;
    ctx.fillStyle='#111';ctx.beginPath();ctx.arc(ex,ey,2.2,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

  _drawEnemyPreviews(ctx){
    const y=Math.round(CONFIG.HEIGHT*0.72);
    [{key:'enemy_spider',c:CONFIG.COLORS.spider},{key:'enemy_snake',c:CONFIG.COLORS.snake},{key:'enemy_octopus',c:CONFIG.COLORS.octopus},{key:'enemy_ghost',c:CONFIG.COLORS.ghost}]
    .forEach((p,i)=>{
      ctx.save();
      ctx.textAlign='center';ctx.textBaseline='alphabetic';
      ctx.fillStyle=p.c;ctx.shadowColor=p.c;ctx.shadowBlur=6;
      // Arabic enemy names contain Arabic script — use SYS_AR instead of MONO
      ctx.font=isRTL()?`bold 9px ${SYS_AR}`:`bold 9px ${MONO}`;
      ctx.fillText(T(p.key),Math.round(CONFIG.WIDTH*(0.17+i*0.22)),y);
      ctx.restore();
    });
  }

  // ---- GAME screen ----

  _drawGame(ts){
    const ctx=this.ctx;
    ctx.save();ctx.translate(this.shakeX,this.shakeY);
    ctx.fillStyle=CONFIG.COLORS.bg;
    ctx.fillRect(-Math.abs(this.shakeX)-2,-Math.abs(this.shakeY)-2,CONFIG.WIDTH+4,CONFIG.HEIGHT+4);
    ctx.fillStyle='rgba(255,255,255,0.04)';
    for(let gx=40;gx<CONFIG.WIDTH;gx+=40)
      for(let gy=40;gy<CONFIG.HEIGHT;gy+=40){ctx.beginPath();ctx.arc(gx,gy,1,0,Math.PI*2);ctx.fill();}
    this.ps.draw(ctx);
    for(const e of this.enemies)e.draw(ctx);
    for(const b of this.bullets)b.draw(ctx);
    this.player.draw(ctx);
    ctx.restore();
    this._drawHUD(ts);
    this._drawTouchOverlay();
    this._drawCRT();
  }

  _drawHUD(ts){
    const ctx=this.ctx;
    ctx.save();
    ctx.direction=isRTL()?'rtl':'ltr';

    // Hearts — anchor from right edge in RTL
    for(let i=0;i<CONFIG.PLAYER_MAX_HP;i++){
      ctx.fillStyle=i<this.player.hp?CONFIG.COLORS.error:'rgba(239,68,68,0.15)';
      ctx.font=F(22);ctx.textBaseline='top';ctx.textAlign=rtlAlign('left');
      ctx.shadowColor=i<this.player.hp?CONFIG.COLORS.error:'transparent';
      ctx.shadowBlur=i<this.player.hp?5:0;
      const heartX=isRTL()?(CONFIG.WIDTH-14-i*28):(14+i*28);
      ctx.fillText('♥',heartX,10);
    }
    ctx.shadowBlur=0;

    // Score
    ctx.fillStyle=CONFIG.COLORS.textPri;ctx.font=F(26,'bold');
    ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText(this.score,CONFIG.WIDTH/2,6);
    ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(11);
    ctx.fillText(T('hi_score')+' '+this.highScore,CONFIG.WIDTH/2,35);

    // Combo — anchor from left in RTL
    if(this.combo>1){
      const pulse=1+Math.sin(ts*0.01)*0.06;
      ctx.textAlign=rtlAlign('right');
      ctx.fillStyle=this.combo>=5?CONFIG.COLORS.gold:CONFIG.COLORS.accent;
      ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=8;
      ctx.font=`bold ${Math.floor((13+this.combo)*pulse)}px ${MONO}`;
      const comboX=isRTL()?12:(CONFIG.WIDTH-12);
      const comboTxt=isRTL()?(T('combo')+' x'+this.combo):('x'+this.combo+' '+T('combo'));
      ctx.fillText(comboTxt,comboX,10);
      ctx.shadowBlur=0;
    }

    // Wave label
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(12);
    const wt=this.waves.state==='gap'?(this.waves.wave===0?T('get_ready'):T('wave_in',this.waves.wave+1)):T('wave',this.waves.wave);
    ctx.fillText(wt,CONFIG.WIDTH/2,CONFIG.HEIGHT-8);
    ctx.restore();
  }

  _drawTouchOverlay(){
    if(!this._isTouchDevice())return;
    const ctx=this.ctx;
    const j=this.input.touch.joystick;
    const s=this.input.touch.shoot;

    ctx.save();

    // Joystick visual
    if(j.active){
      const dx=j.curX-j.startX,dy=j.curY-j.startY,dist=Math.hypot(dx,dy),maxR=48;
      const cx=j.startX+(dist>maxR?(dx/dist)*maxR:dx),cy=j.startY+(dist>maxR?(dy/dist)*maxR:dy);
      ctx.strokeStyle='rgba(255,255,255,0.14)';ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(j.startX,j.startY,maxR,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.28)';
      ctx.beginPath();ctx.arc(cx,cy,22,0,Math.PI*2);ctx.fill();
    }

    // Shoot button — fixed bottom-right
    const btnR  = Math.min(52, CONFIG.WIDTH * 0.09);
    const btnX  = CONFIG.WIDTH  - btnR - 28;
    const btnY  = CONFIG.HEIGHT - btnR - 28;
    const pressed = s.active;

    ctx.shadowColor = pressed ? CONFIG.COLORS.player : 'rgba(255,255,255,0.3)';
    ctx.shadowBlur  = pressed ? 18 : 6;
    ctx.fillStyle   = pressed ? CONFIG.COLORS.player : 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.arc(btnX, btnY, btnR, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = pressed ? CONFIG.COLORS.player : 'rgba(255,255,255,0.25)';
    ctx.lineWidth   = 2;
    ctx.beginPath(); ctx.arc(btnX, btnY, btnR, 0, Math.PI*2); ctx.stroke();
    ctx.shadowBlur  = 0;

    // Duck icon on button
    ctx.fillStyle = pressed ? '#0a0e17' : CONFIG.COLORS.textPri;
    ctx.font      = `${Math.round(btnR * 0.72)}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🦆', btnX, btnY);

    ctx.restore();
  }

  // ---- GAME OVER ----

  _drawGameOver(ts){
    const ctx=this.ctx;
    this._drawGame(ts);
    ctx.save();
    ctx.direction=isRTL()?'rtl':'ltr';
    ctx.fillStyle=CONFIG.COLORS.overlay;ctx.fillRect(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);

    // Error title stays MONO (code humour)
    ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillStyle=CONFIG.COLORS.error;ctx.font=`bold 40px ${MONO}`;
    ctx.fillText(T('seg_fault'),CONFIG.WIDTH/2,Math.round(CONFIG.HEIGHT*0.17));
    ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=`13px ${MONO}`;
    ctx.fillText(T('core_dump'),CONFIG.WIDTH/2,Math.round(CONFIG.HEIGHT*0.22));

    const scW=Math.min(280,CONFIG.WIDTH*0.6),scH=64,scX=CONFIG.WIDTH/2-scW/2,scY=Math.round(CONFIG.HEIGHT*0.26);
    this._glassPanel(ctx,scX,scY,scW,scH,16);
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(12);
    ctx.fillText(T('score_lbl').toUpperCase(),CONFIG.WIDTH/2,scY+16);
    ctx.fillStyle=CONFIG.COLORS.textPri;ctx.font=F(30,'bold');
    ctx.fillText(this.score,CONFIG.WIDTH/2,scY+42);

    const bestY=Math.round(CONFIG.HEIGHT*0.38);
    ctx.textBaseline='alphabetic';
    if(this.score>0&&this.score>=this.highScore){
      ctx.fillStyle=CONFIG.COLORS.gold;ctx.font=F(15,'bold');
      ctx.fillText(T('new_hi'),CONFIG.WIDTH/2,bestY);
    } else if(this.highScore>0){
      ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(13);
      ctx.fillText(T('best')+': '+this.highScore,CONFIG.WIDTH/2,bestY);
    }

    this._drawLeaderboard(ctx);

    if(performance.now()-this._gameOverTs>600&&Math.floor(ts/600)%2===0){
      ctx.textAlign='center';ctx.textBaseline='alphabetic';
      ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(14);
      ctx.fillText(this._isTouchDevice()?T('restart_t'):T('restart'),CONFIG.WIDTH/2,Math.round(CONFIG.HEIGHT*0.95));
    }

    this._drawCRT();ctx.restore();
    if(performance.now()-this._gameOverTs>600){
      if(this.input.consumeAction()||this.input.consumeClick())this.toPlaying();
    }
  }

  _drawLeaderboard(ctx){
    const TOP_N=10;
    const panelPad=14,lineH=Math.min(20,CONFIG.HEIGHT*0.028);
    const maxVisible=Math.min(TOP_N,Math.floor((CONFIG.HEIGHT*0.44)/lineH));
    const myIdx=this.leaderboard.findIndex(e=>e.name===this.playerName&&e.score===this.score);
    const topEntries=this.leaderboard.slice(0,maxVisible);
    const showOwnBelow=myIdx>=maxVisible;

    const rowCount=topEntries.length+(showOwnBelow?2:0);
    const headerH=28,panelH=headerH+rowCount*lineH+panelPad*2+(this.submittingScore?lineH:0);
    const panelW=Math.min(400,CONFIG.WIDTH*0.82),panelX=CONFIG.WIDTH/2-panelW/2,panelY=Math.round(CONFIG.HEIGHT*0.41);

    this._glassPanel(ctx,panelX,panelY,panelW,panelH,16);

    const rtl=isRTL();
    const colRank  = rtl?(panelX+panelW-panelPad-18):(panelX+panelPad+18);
    const colName  = rtl?(panelX+panelW-panelPad-44):(panelX+panelPad+44);
    const colScore = rtl?(panelX+panelPad+60)        :(panelX+panelW-panelPad-60);
    const colWave  = rtl?(panelX+panelPad)            :(panelX+panelW-panelPad);

    ctx.save();
    ctx.textBaseline='alphabetic';ctx.textAlign='center';
    ctx.fillStyle=CONFIG.COLORS.accent;ctx.font=F(12,'bold');
    ctx.fillText(T('leaderboard').toUpperCase(),CONFIG.WIDTH/2,panelY+headerH-4);
    ctx.strokeStyle=CONFIG.COLORS.border;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(panelX+panelPad,panelY+headerH);ctx.lineTo(panelX+panelW-panelPad,panelY+headerH);ctx.stroke();

    if(this.submittingScore){
      ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(12);
      ctx.fillText(T('submitting'),CONFIG.WIDTH/2,panelY+headerH+lineH);
      ctx.restore();return;
    }
    if(topEntries.length===0){
      ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(12);
      ctx.fillText(T('lb_empty'),CONFIG.WIDTH/2,panelY+headerH+lineH);
      ctx.restore();return;
    }

    topEntries.forEach((entry,i)=>{
      const y=panelY+headerH+(i+1)*lineH+2;
      const isMe=i===myIdx;
      ctx.textBaseline='alphabetic';
      // Rank
      ctx.textAlign=rtlAlign('right');ctx.fillStyle=isMe?CONFIG.COLORS.gold:CONFIG.COLORS.textDim;
      ctx.font=isMe?F(11,'bold'):F(11);ctx.fillText('#'+(i+1),colRank,y);
      // Name
      ctx.textAlign=rtlAlign('left');ctx.fillStyle=isMe?CONFIG.COLORS.gold:(i===0?CONFIG.COLORS.textPri:CONFIG.COLORS.textSec);
      ctx.font=isMe||i===0?F(11,'bold'):F(11);ctx.fillText(entry.name||'???',colName,y);
      // You tag
      if(isMe){
        const nameW=ctx.measureText(entry.name||'???').width;
        const tagX=rtl?(colName-nameW-6):(colName+nameW+6);
        ctx.textAlign=rtlAlign('left');ctx.fillStyle='rgba(255,215,0,0.5)';ctx.font=F(10);
        ctx.fillText(T('lb_you'),tagX,y);
      }
      // Score
      ctx.textAlign=rtlAlign('right');ctx.fillStyle=isMe?CONFIG.COLORS.gold:CONFIG.COLORS.textSec;
      ctx.font=isMe?`bold 11px ${MONO}`:`11px ${MONO}`;ctx.fillText(entry.score,colScore,y);
      // Wave
      ctx.textAlign=rtlAlign('right');ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(10);
      ctx.fillText(T('lb_wave')+' '+(entry.wave||'?'),colWave,y);
    });

    if(showOwnBelow){
      const sepY=panelY+headerH+(topEntries.length+0.7)*lineH+4;
      ctx.strokeStyle=CONFIG.COLORS.border;ctx.lineWidth=1;ctx.setLineDash([4,4]);
      ctx.beginPath();ctx.moveTo(panelX+panelPad,sepY);ctx.lineTo(panelX+panelW-panelPad,sepY);ctx.stroke();
      ctx.setLineDash([]);
      const own=this.leaderboard[myIdx],ownY=sepY+lineH;
      ctx.textBaseline='alphabetic';
      ctx.textAlign=rtlAlign('right');ctx.fillStyle=CONFIG.COLORS.gold;ctx.font=F(11,'bold');ctx.fillText('#'+(myIdx+1),colRank,ownY);
      ctx.textAlign=rtlAlign('left');ctx.fillStyle=CONFIG.COLORS.gold;ctx.font=F(11,'bold');ctx.fillText(own.name||'???',colName,ownY);
      ctx.textAlign=rtlAlign('right');ctx.fillStyle=CONFIG.COLORS.gold;ctx.font=`bold 11px ${MONO}`;ctx.fillText(own.score,colScore,ownY);
      ctx.textAlign=rtlAlign('right');ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(10);ctx.fillText(T('lb_wave')+' '+(own.wave||'?'),colWave,ownY);
    }

    if(!CONFIG.LEADERBOARD_URL){
      ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(9);
      ctx.fillText(T('lb_offline'),CONFIG.WIDTH/2,panelY+panelH-5);
    }
    ctx.restore();
  }
}

// =============================================================================
// Bootstrap
// =============================================================================
window.addEventListener('load', () => { window.game = new Game(); });
