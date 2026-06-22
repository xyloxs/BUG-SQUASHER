// =============================================================================
// BUG SQUASHER v1.5.0
// =============================================================================

const SYS    = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";
const SYS_AR = "'Geeza Pro', 'Arabic Typesetting', 'Noto Sans Arabic', Arial, sans-serif";
const MONO   = "'SF Mono', 'Fira Code', 'Courier New', monospace";

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
  PLAYER_INVINCIBLE_MS: 700,
  BULLET_SPEED:         520,
  BULLET_RADIUS:        5,
  SHOOT_COOLDOWN:       200,   // desktop; mobile uses SHOOT_COOLDOWN_MOBILE
  SHOOT_COOLDOWN_MOBILE: 340,  // mobile ~40% slower fire rate than desktop

  COMBO_RESET_MS:  3000,
  SHAKE_DECAY:     0.82,
  WAVE_GAP_MS:     1200,   // was 1800 — shorter breather between waves

  BASE_SCORES: { Spider: 10, Snake: 15, Octopus: 20, Ghost: 25 },
  MASTER_VOLUME:   0.28,
  HS_KEY:          'bugSquasher_hs',
  LANG_KEY:        'bugSquasher_lang',
  SCORES_KEY:      'bugSquasher_scores',
  LEADERBOARD_URL: '',
  // Firebase path for GSE footer-link click tracking, e.g.:
  // 'https://your-project-default-rtdb.firebaseio.com/clicks/bugsquasher'
  CLICK_COUNTER_URL: '',
  GSE_URL:         'https://gse.events',

  COLORS: {
    bg:       '#0f1724',
    bgCard:   '#17202e',
    player:   '#FFD60A',
    bullet:   '#FFE566',
    spider:   '#FF453A',
    snake:    '#30D158',
    octopus:  '#BF5AF2',
    ghost:    '#64D2FF',
    textPri:  '#FFFFFF',
    textSec:  '#8E8E93',
    textDim:  '#48484A',
    accent:   '#0A84FF',
    gold:     '#FFD60A',
    error:    '#FF453A',
    success:  '#30D158',
    surface:  'rgba(255,255,255,0.05)',
    border:   'rgba(255,255,255,0.09)',
    overlay:  'rgba(15,23,36,0.88)',
  }
};

// =============================================================================
// STRINGS — DE / EN / FR / ES / AR
// All 5 languages must have identical keys. EN is the canonical fallback.
// =============================================================================
const STRINGS = {
  en: {
    subtitle:      'Rubber duck debugging - taken literally',
    ctrl_title:    'How to Play',
    ctrl_move_t:   'Joystick (left side) - move the duck',
    ctrl_shoot_t:  'Shoot button (right) - fire',
    ctrl_move:     'WASD or Arrow keys - move the duck',
    ctrl_shoot:    'Mouse left-click or Space - shoot',
    ctrl_pause:    'P - pause',
    start_t:       'Tap to start',
    start:         'Click or press Space to start',
    hi_score:      'Best',
    paused:        'Paused',
    resume_t:      'Tap to resume',
    resume:        'Press P to resume',
    get_ready:     'Get ready…',
    wave_in:       'Wave {n} incoming',
    wave:          'Wave {n}',
    move:          'Move',
    shoot:         'SHOOT',
    hint_shoot:    'Click / Space / Tap to SHOOT!',
    seg_fault:     'The bugs got you!',
    core_dump:     'Better luck next time',
    intro_line1:   'The bugs have gone sentient.',
    intro_line2:   'Only one duck can stop them.',
    intro_cta:     'Tap or press any key',
    score_lbl:     'Score',
    lang_sub:      'Your browser language was pre-selected',
    name_title:    "What's your name?",
    name_sub:      'Shown on the leaderboard',
    name_hint:     'Press Enter to confirm',
    name_hint_t:   'Tap Confirm to continue',
    name_back:     'Back',
    name_confirm:  'Continue',
    leaderboard:   'Leaderboard',
    submitting:    'Saving…',
    lb_rank:       '#',
    lb_name:       'Name',
    lb_score:      'Score',
    lb_wave:       'Wave',
    lb_offline:    'Saved locally',
    lb_empty:      'No scores yet',
    lb_you:        'You',
    new_player:    'Play as a different player',
    enemy_spider:  'Null Pointer Spider',
    enemy_snake:   'Segfault Snake',
    enemy_octopus: 'Infinite Loop ∞',
    enemy_ghost:   'Memory Leak Ghost',
    combo:         'BONUS',
  },
  de: {
    subtitle:      'Rubber-Duck-Debugging - wörtlich genommen',
    ctrl_title:    'Steuerung',
    ctrl_move_t:   'Joystick (links) - Ente bewegen',
    ctrl_shoot_t:  'Schuss-Button (rechts) - schießen',
    ctrl_move:     'WASD oder Pfeiltasten - Ente bewegen',
    ctrl_shoot:    'Maus-Linksklick oder Leertaste - schießen',
    ctrl_pause:    'P - Pause',
    start_t:       'Tippen zum Starten',
    start:         'Klicken oder Leertaste',
    hi_score:      'Beste',
    paused:        'Pause',
    resume_t:      'Tippen zum Fortfahren',
    resume:        'P drücken zum Fortfahren',
    get_ready:     'Bereit machen…',
    wave_in:       'Welle {n} kommt',
    wave:          'Welle {n}',
    move:          'Bewegen',
    shoot:         'SCHIESSEN',
    hint_shoot:    'Klick / Leertaste / Tippen zum SCHIESSEN!',
    seg_fault:     'Du wurdest geschnappt!',
    core_dump:     'Die Bugs haben gewonnen',
    intro_line1:   'Die Bugs sind lebendig geworden.',
    intro_line2:   'Nur eine Ente kann sie stoppen.',
    intro_cta:     'Tippen oder eine Taste drücken',
    score_lbl:     'Punkte',
    new_hi:        'Neuer Highscore!',
    best:          'Beste',
    restart_t:     'Tippen zum Neustart',
    restart:       'Klick oder Leertaste',
    lang_title:    'Sprache wählen',
    lang_sub:      'Browser-Sprache wurde vorausgewählt',
    name_title:    'Wie heißt du?',
    name_sub:      'Erscheint in der Bestenliste',
    name_hint:     'Enter drücken zum Bestätigen',
    name_hint_t:   'Bestätigen tippen',
    name_back:     'Zurück',
    name_confirm:  'Weiter',
    leaderboard:   'Bestenliste',
    submitting:    'Speichern…',
    lb_rank:       '#',
    lb_name:       'Name',
    lb_score:      'Punkte',
    lb_wave:       'Welle',
    lb_offline:    'Lokal gespeichert',
    lb_empty:      'Noch keine Einträge',
    lb_you:        'Du',
    new_player:    'Als anderer Spieler starten',
    enemy_spider:  'Null-Pointer-Spinne',
    enemy_snake:   'Segfault-Schlange',
    enemy_octopus: 'Endlosschleife ∞',
    enemy_ghost:   'Speicherleck-Geist',
    combo:         'BONUS',
  },
  fr: {
    subtitle:      'Débogage par canard - pris au pied de la lettre',
    ctrl_title:    'Comment jouer',
    ctrl_move_t:   'Joystick (gauche) - déplacer le canard',
    ctrl_shoot_t:  'Bouton tir (droite) - tirer',
    ctrl_move:     'WASD ou Flèches - déplacer le canard',
    ctrl_shoot:    'Clic gauche ou Espace - tirer',
    ctrl_pause:    'P - pause',
    start_t:       'Toucher pour commencer',
    start:         'Clic ou Espace pour commencer',
    hi_score:      'Meilleur',
    paused:        'Pause',
    resume_t:      'Toucher pour reprendre',
    resume:        'Appuyer P pour reprendre',
    get_ready:     'Préparez-vous…',
    wave_in:       'Vague {n} en approche',
    wave:          'Vague {n}',
    move:          'Déplacer',
    shoot:         'TIRER',
    hint_shoot:    'Clic / Espace / Tap pour TIRER !',
    seg_fault:     'Les bugs ont gagné !',
    core_dump:     'Mieux vaut réessayer',
    intro_line1:   'Les bugs sont devenus vivants.',
    intro_line2:   'Seul un canard peut les arrêter.',
    intro_cta:     'Toucher ou appuyer sur une touche',
    score_lbl:     'Score',
    new_hi:        'Nouveau record !',
    best:          'Meilleur',
    restart_t:     'Toucher pour rejouer',
    restart:       'Clic ou Espace pour rejouer',
    lang_title:    'Choisir la langue',
    lang_sub:      'Langue du navigateur présélectionnée',
    name_title:    'Quel est votre nom ?',
    name_sub:      'Apparaîtra dans le classement',
    name_hint:     'Entrée pour confirmer',
    name_hint_t:   'Appuyer sur Confirmer',
    name_back:     'Retour',
    name_confirm:  'Continuer',
    leaderboard:   'Classement',
    submitting:    'Enregistrement…',
    lb_rank:       '#',
    lb_name:       'Nom',
    lb_score:      'Score',
    lb_wave:       'Vague',
    lb_offline:    'Enregistré localement',
    lb_empty:      'Pas encore de scores',
    lb_you:        'Vous',
    new_player:    'Jouer avec un autre profil',
    enemy_spider:  'Araignée Null Pointer',
    enemy_snake:   'Serpent Segfault',
    enemy_octopus: 'Boucle infinie ∞',
    enemy_ghost:   'Fantôme fuite mémoire',
    combo:         'BONUS',
  },
  es: {
    subtitle:      'Depuración con pato - tomada literalmente',
    ctrl_title:    'Cómo jugar',
    ctrl_move_t:   'Joystick (izquierda) - mover el pato',
    ctrl_shoot_t:  'Botón disparo (derecha) - disparar',
    ctrl_move:     'WASD o Flechas - mover el pato',
    ctrl_shoot:    'Clic izquierdo o Espacio - disparar',
    ctrl_pause:    'P - pausa',
    start_t:       'Toca para comenzar',
    start:         'Clic o Espacio para comenzar',
    hi_score:      'Mejor',
    paused:        'Pausa',
    resume_t:      'Toca para continuar',
    resume:        'Presiona P para continuar',
    get_ready:     'Prepárate…',
    wave_in:       'Ola {n} en camino',
    wave:          'Ola {n}',
    move:          'Mover',
    shoot:         'DISPARAR',
    hint_shoot:    'Clic / Espacio / Toca para DISPARAR!',
    seg_fault:     '¡Los bugs ganaron!',
    core_dump:     'Mejor suerte la próxima vez',
    intro_line1:   'Los bugs han cobrado vida.',
    intro_line2:   'Solo un pato puede detenerlos.',
    intro_cta:     'Toca o pulsa cualquier tecla',
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
    name_confirm:  'Continuar',
    leaderboard:   'Clasificación',
    submitting:    'Guardando…',
    lb_rank:       '#',
    lb_name:       'Nombre',
    lb_score:      'Puntos',
    lb_wave:       'Ola',
    lb_offline:    'Guardado localmente',
    lb_empty:      'Sin puntuaciones aún',
    lb_you:        'Tú',
    new_player:    'Jugar con otro jugador',
    enemy_spider:  'Araña Null Pointer',
    enemy_snake:   'Serpiente Segfault',
    enemy_octopus: 'Bucle infinito ∞',
    enemy_ghost:   'Fantasma fuga de mem.',
    combo:         'BONUS',
  },
  ar: {
    subtitle:      'تنقيح البط المطاطي - حرفياً',
    ctrl_title:    'كيف تلعب',
    ctrl_move_t:   'عصا التحكم (يسار) - حرك البطة',
    ctrl_shoot_t:  'زر الإطلاق (يمين) - أطلق',
    ctrl_move:     'WASD أو الأسهم - حرك البطة',
    ctrl_shoot:    'نقر أيسر أو مسافة - أطلق',
    ctrl_pause:    'P - إيقاف مؤقت',
    start_t:       'انقر للبدء',
    start:         'انقر أو اضغط المسافة للبدء',
    hi_score:      'الأفضل',
    paused:        'متوقف',
    resume_t:      'انقر للمتابعة',
    resume:        'اضغط P للمتابعة',
    get_ready:     'استعد…',
    wave_in:       'الموجة {n} قادمة',
    wave:          'الموجة {n}',
    move:          'تحرك',
    shoot:         'أطلق',
    hint_shoot:    'انقر أو المسافة للإطلاق!',
    seg_fault:     'انتهت اللعبة!',
    core_dump:     'الحشرات انتصرت',
    intro_line1:   'الحشرات أصبحت حية.',
    intro_line2:   'بطة واحدة فقط تستطيع إيقافها.',
    intro_cta:     'انقر أو اضغط أي مفتاح',
    score_lbl:     'النقاط',
    new_hi:        'رقم شخصي جديد!',
    best:          'الأفضل',
    restart_t:     'انقر للعب مجدداً',
    restart:       'انقر أو المسافة للعب مجدداً',
    lang_title:    'اختر اللغة',
    lang_sub:      'لغة المتصفح محددة مسبقاً',
    name_title:    'ما اسمك؟',
    name_sub:      'سيظهر في لوحة المتصدرين',
    name_hint:     'اضغط Enter للتأكيد',
    name_hint_t:   'انقر تأكيد للمتابعة',
    name_back:     'رجوع',
    name_confirm:  'متابعة',
    leaderboard:   'لوحة المتصدرين',
    submitting:    'جاري الحفظ…',
    lb_rank:       '#',
    lb_name:       'الاسم',
    lb_score:      'النقاط',
    lb_wave:       'الموجة',
    lb_offline:    'محفوظ محلياً',
    lb_empty:      'لا توجد نتائج بعد',
    lb_you:        'أنت',
    new_player:    'اللعب باسم مختلف',
    enemy_spider:  'عنكبوت Null Pointer',
    enemy_snake:   'ثعبان Segfault',
    enemy_octopus: 'حلقة لا نهاية لها ∞',
    enemy_ghost:   'شبح تسرب الذاكرة',
    combo:         'BONUS',
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

function F(size, weight) {
  const family = isRTL() ? SYS_AR : SYS;
  return weight ? `${weight} ${size}px ${family}` : `${size}px ${family}`;
}

// Fit text into maxWidth, reducing font size if needed
function fillTextFit(ctx, text, x, y, maxWidth, baseSize, weight) {
  let size = baseSize;
  ctx.font = F(size, weight);
  while (ctx.measureText(text).width > maxWidth && size > 8) {
    size -= 1;
    ctx.font = F(size, weight);
  }
  ctx.fillText(text, x, y);
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
  playShoot()     { this._tone(880,  'sine',     0.08, 0.4, 0.003); }
  playPop()       { this._sweep(440, 110, 'triangle', 0.18, 0.5); }
  playHurt()      { this._tone(120,  'sawtooth', 0.35, 0.6, 0.002); }
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
    this._lastMoveAngle  = 0;
    this._spaceHeld      = false;
    this._scale          = 1;
    this._touchEverUsed  = false;
    this._autoAimAngle   = null;
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
      return { x: (cx - r.left) / this._scale, y: (cy - r.top) / this._scale };
    };
    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      this._touchEverUsed = true;
      window.__isMobile = true;  // permanent flag — affects cooldown, enemy HP
      for (const t of e.changedTouches) {
        const p = toLogical(t.clientX, t.clientY);
        this.mouse.x = p.x; this.mouse.y = p.y;
        this._clickConsumed = true; this._actionConsumed = true;
        const inShootBtn = p.x > CONFIG.WIDTH * 0.65 && p.y > CONFIG.HEIGHT * 0.60 && p.y < CONFIG.HEIGHT - 26;
        if (inShootBtn) {
          this.touch.shoot = { active: true, id: t.identifier, x: p.x, y: p.y };
        } else {
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
      // Use fixed joystick center (outerR=52, margin=28) so stick tracks from visual center
      const footerH = 22, outerR = 52;
      const jbX = outerR + 28;
      const jbY = CONFIG.HEIGHT - footerH - outerR - 14;
      const jdx = this.touch.joystick.curX - jbX;
      const jdy = this.touch.joystick.curY - jbY;
      const jl  = Math.hypot(jdx, jdy);
      if (jl > 8) { dx = jdx / jl; dy = jdy / jl; }
    }
    const len = Math.hypot(dx, dy);
    if (len > 0) { this._lastMoveAngle = Math.atan2(dy, dx); return { x: dx/len, y: dy/len }; }
    return { x: 0, y: 0 };
  }
  getAimAngle(px, py) {
    // Touch: auto-aim at nearest enemy (set by Game each frame)
    if ((this.touch.shoot.active || this._spaceHeld) && this._autoAimAngle !== null) {
      return this._autoAimAngle;
    }
    if (this.touch.shoot.active) return this._lastMoveAngle;
    const d = Math.hypot(this.mouse.x - px, this.mouse.y - py);
    if (d > 5) return Math.atan2(this.mouse.y - py, this.mouse.x - px);
    return this._lastMoveAngle;
  }
  setAutoAim(angle) { this._autoAimAngle = angle; }
  clearAutoAim()    { this._autoAimAngle = null; }
  isShootingHeld() { return this.mouse.down || this.touch.shoot.active || this._spaceHeld; }
  consumePause()   { const v = this._pauseConsumed;  this._pauseConsumed  = false; return v; }
  consumeAction()  { const v = this._actionConsumed; this._actionConsumed = false; return v; }
  consumeClick()   { const v = this._clickConsumed;  this._clickConsumed  = false; return v; }
  clearAll() {
    this._pauseConsumed = false; this._actionConsumed = false;
    this._clickConsumed = false; this._spaceHeld = false;
    this.mouse.down = false;
    this.touch.shoot.active = false; this.touch.joystick.active = false;
  }
}

// =============================================================================
// Particle / ParticleSystem
// =============================================================================
class Particle {
  constructor(x, y, vx, vy, color, radius, life) {
    this.x=x; this.y=y; this.vx=vx; this.vy=vy;
    this.color=color; this.radius=radius; this.life=life; this.maxLife=life;
  }
  update(dt) { this.x+=this.vx*dt*0.001; this.y+=this.vy*dt*0.001; this.vx*=0.96; this.vy*=0.96; this.life-=dt; }
  draw(ctx) {
    const a=Math.max(0,this.life/this.maxLife);
    ctx.save(); ctx.globalAlpha=a; ctx.fillStyle=this.color;
    ctx.shadowColor=this.color; ctx.shadowBlur=4;
    ctx.beginPath(); ctx.arc(this.x,this.y,this.radius*a,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0; ctx.restore();
  }
  get isDead() { return this.life <= 0; }
}
class ParticleSystem {
  constructor() { this.particles=[]; }
  emit(x, y, color, count, o) {
    o=o||{};
    const sMin=o.speedMin||60,sMax=o.speedMax||200,lMin=o.lifeMin||300,lMax=o.lifeMax||700,rMin=o.radiusMin||2,rMax=o.radiusMax||6;
    for (let i=0;i<count;i++) {
      const a=Math.random()*Math.PI*2,sp=sMin+Math.random()*(sMax-sMin);
      this.particles.push(new Particle(x,y,Math.cos(a)*sp,Math.sin(a)*sp,color,rMin+Math.random()*(rMax-rMin),lMin+Math.random()*(lMax-lMin)));
    }
  }
  update(dt) { for(const p of this.particles)p.update(dt); this.particles=this.particles.filter(p=>!p.isDead); }
  draw(ctx)  { for(const p of this.particles)p.draw(ctx); }
}

// =============================================================================
// Entity
// =============================================================================
class Entity {
  constructor(x,y,radius){this.x=x;this.y=y;this.radius=radius;this.vx=0;this.vy=0;this.dead=false;}
  collidesWith(o){return Math.hypot(this.x-o.x,this.y-o.y)<this.radius+o.radius;}
  update(){}draw(){}
}

// =============================================================================
// Bullet
// =============================================================================
class Bullet extends Entity {
  constructor(x,y,angle){
    super(x,y,CONFIG.BULLET_RADIUS);
    this.vx=Math.cos(angle)*CONFIG.BULLET_SPEED; this.vy=Math.sin(angle)*CONFIG.BULLET_SPEED;
    this.trail=[];
  }
  update(dt){
    this.trail.push({x:this.x,y:this.y});
    if(this.trail.length>5)this.trail.shift();
    this.x+=this.vx*dt*0.001; this.y+=this.vy*dt*0.001;
    if(this.x<-20||this.x>CONFIG.WIDTH+20||this.y<-20||this.y>CONFIG.HEIGHT+20)this.dead=true;
  }
  draw(ctx){
    ctx.save();
    for(let i=0;i<this.trail.length;i++){
      ctx.globalAlpha=(i/this.trail.length)*0.4; ctx.fillStyle=CONFIG.COLORS.bullet;
      ctx.beginPath();ctx.arc(this.trail[i].x,this.trail[i].y,this.radius*(i/this.trail.length)*0.7,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;ctx.shadowColor=CONFIG.COLORS.bullet;ctx.shadowBlur=10;
    ctx.fillStyle=CONFIG.COLORS.bullet;ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;ctx.restore();
  }
}

// =============================================================================
// Player
// =============================================================================
class Player extends Entity {
  constructor(x,y){
    super(x,y,CONFIG.PLAYER_RADIUS);
    this.hp=CONFIG.PLAYER_MAX_HP;this.shootTimer=0;this.invincibleTimer=0;
    this.squishTimer=0;this.time=0;this.facing=0;this.moving=false;
  }
  update(dt,input){
    this.time+=dt*0.001;
    this.shootTimer=Math.max(0,this.shootTimer-dt);
    this.invincibleTimer=Math.max(0,this.invincibleTimer-dt);
    this.squishTimer=Math.max(0,this.squishTimer-dt);
    const mv=input.getMoveVector();
    this.vx=mv.x*CONFIG.PLAYER_SPEED; this.vy=mv.y*CONFIG.PLAYER_SPEED;
    this.moving=mv.x!==0||mv.y!==0;
    this.x=Math.max(this.radius,Math.min(CONFIG.WIDTH-this.radius,this.x+this.vx*dt*0.001));
    this.y=Math.max(this.radius,Math.min(CONFIG.HEIGHT-this.radius,this.y+this.vy*dt*0.001));
    this.facing=input.getAimAngle(this.x,this.y);
  }
  tryShoot(audio){
    if(this.shootTimer>0)return null;
    this.shootTimer = window.__isMobile ? CONFIG.SHOOT_COOLDOWN_MOBILE : CONFIG.SHOOT_COOLDOWN;
    this.squishTimer=100;
    audio.playShoot();return new Bullet(this.x,this.y,this.facing);
  }
  takeDamage(audio){
    if(this.invincibleTimer>0)return;
    this.hp--;this.invincibleTimer=CONFIG.PLAYER_INVINCIBLE_MS;audio.playHurt();
  }
  draw(ctx){
    if(this.invincibleTimer>0&&Math.floor(this.invincibleTimer/100)%2===0)return;
    ctx.save();ctx.translate(this.x,this.y);
    ctx.translate(0,this.moving?Math.sin(this.time*8)*3:Math.sin(this.time*1.5)*4);
    ctx.rotate(Math.sin(this.time*3)*0.15);
    if(this.squishTimer>0)ctx.scale(1.0,0.72);
    this._drawBody(ctx);this._drawHead(ctx);this._drawBill(ctx);this._drawEye(ctx);
    ctx.restore();
  }
  _drawBody(ctx){
    ctx.save();ctx.shadowColor='#FFD60A';ctx.shadowBlur=8;ctx.fillStyle=CONFIG.COLORS.player;
    ctx.beginPath();ctx.ellipse(0,3,17,13,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#CC9900';ctx.lineWidth=1.5;ctx.stroke();ctx.shadowBlur=0;ctx.restore();
  }
  _drawHead(ctx){
    ctx.save();ctx.fillStyle=CONFIG.COLORS.player;
    ctx.beginPath();ctx.arc(7,-10,10,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#CC9900';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
  }
  _drawBill(ctx){
    ctx.save();ctx.fillStyle='#FF8C00';
    ctx.beginPath();ctx.moveTo(15,-11);ctx.quadraticCurveTo(28,-9,26,-5);ctx.lineTo(15,-6);ctx.closePath();ctx.fill();ctx.restore();
  }
  _drawEye(ctx){
    ctx.save();ctx.translate(10,-13);
    ctx.fillStyle='white';ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.fill();
    const px=Math.cos(this.facing)*1.5,py=Math.sin(this.facing)*1.5;
    ctx.fillStyle='#111';ctx.beginPath();ctx.arc(px,py,2.2,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
}

// =============================================================================
// Spider
// =============================================================================
class Spider extends Entity {
  constructor(x,y){
    super(x,y,14);
    this.hp=3;this.speed=155+Math.random()*55;  // was hp=2, speed=110-150
    this.legPhase=Math.random()*Math.PI*2;this.color=CONFIG.COLORS.spider;
  }
  update(dt,player){
    const dx=player.x-this.x,dy=player.y-this.y,d=Math.hypot(dx,dy)||1;
    this.vx=(dx/d)*this.speed;this.vy=(dy/d)*this.speed;
    this.x+=this.vx*dt*0.001;this.y+=this.vy*dt*0.001;this.legPhase+=dt*0.008;
    if(this.x<-100||this.x>CONFIG.WIDTH+100||this.y<-100||this.y>CONFIG.HEIGHT+100)this.dead=true;
  }
  draw(ctx){
    ctx.save();ctx.translate(this.x,this.y);
    const fa=Math.atan2(this.vy,this.vx);
    ctx.strokeStyle=this.color;ctx.lineWidth=1.5;
    for(const side of[-1,1])for(let i=0;i<4;i++){
      const a=fa+side*(Math.PI*0.55+[-0.9,-0.45,0.45,0.9][i]),len=13+Math.sin(this.legPhase+i*0.7)*3;
      ctx.beginPath();ctx.moveTo(0,0);
      ctx.quadraticCurveTo(Math.cos(a)*len*0.55,Math.sin(a)*len*0.55,Math.cos(a+side*0.25)*len,Math.sin(a+side*0.25)*len);ctx.stroke();
    }
    ctx.shadowColor=this.color;ctx.shadowBlur=12;ctx.fillStyle=this.color;
    ctx.beginPath();ctx.ellipse(0,0,11,9,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle='#FF453A';
    for(const ex of[-3.5,3.5]){ctx.beginPath();ctx.arc(ex,-4,2.2,0,Math.PI*2);ctx.fill();}
    ctx.restore();
  }
}

// =============================================================================
// Snake
// =============================================================================
class Snake extends Entity {
  constructor(x,y,player){
    super(x,y,10);
    this.hp=1;this.speed=290+Math.random()*80;  // was 210-270
    this.sinePhase=0;this.baseAngle=Math.atan2(player.y-y,player.x-x);
    this.color=CONFIG.COLORS.snake;this.spineX=x;this.spineY=y;
  }
  update(dt,player){
    const s=dt*0.001;
    this.sinePhase+=dt*0.005;
    this.spineX+=Math.cos(this.baseAngle)*this.speed*s;
    this.spineY+=Math.sin(this.baseAngle)*this.speed*s;
    const perp=this.baseAngle+Math.PI/2;
    this.x=this.spineX+Math.cos(perp)*Math.sin(this.sinePhase)*28;
    this.y=this.spineY+Math.sin(perp)*Math.sin(this.sinePhase)*28;
    const dx=player.x-this.x,dy=player.y-this.y,d=Math.hypot(dx,dy)||1;
    this.baseAngle+=Math.atan2(dy/d,dx/d)*0.025;
    if(this.x<-50||this.x>CONFIG.WIDTH+50||this.y<-50||this.y>CONFIG.HEIGHT+50)this.dead=true;
  }
  draw(ctx){
    ctx.save();ctx.translate(this.x,this.y);
    ctx.shadowColor=this.color;ctx.shadowBlur=14;
    const perp=this.baseAngle+Math.PI/2;
    const sc=['#0d4a1f','#155c29','#1e7a36','#279645',this.color];
    for(let i=4;i>=0;i--){
      const so=Math.sin(this.sinePhase-i*0.55)*28;
      ctx.fillStyle=sc[i];
      ctx.beginPath();
      ctx.arc(Math.cos(perp)*(so-Math.sin(this.sinePhase)*28)+Math.cos(this.baseAngle+Math.PI)*i*9,
              Math.sin(perp)*(so-Math.sin(this.sinePhase)*28)+Math.sin(this.baseAngle+Math.PI)*i*9,
              9-i*0.9,0,Math.PI*2);ctx.fill();
    }
    ctx.shadowBlur=0;ctx.strokeStyle='#FF453A';ctx.lineWidth=1.2;
    const ta=this.baseAngle,tl=11;
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(ta)*tl*0.7,Math.sin(ta)*tl*0.7);
    ctx.moveTo(Math.cos(ta)*tl*0.7,Math.sin(ta)*tl*0.7);ctx.lineTo(Math.cos(ta-0.3)*tl,Math.sin(ta-0.3)*tl);
    ctx.moveTo(Math.cos(ta)*tl*0.7,Math.sin(ta)*tl*0.7);ctx.lineTo(Math.cos(ta+0.3)*tl,Math.sin(ta+0.3)*tl);
    ctx.stroke();ctx.restore();
  }
}

// =============================================================================
// Octopus
// =============================================================================
class Octopus extends Entity {
  constructor(x,y){
    super(x,y,16);
    this.hp=5;this.orbitAngle=Math.atan2(y-CONFIG.HEIGHT/2,x-CONFIG.WIDTH/2);   // was hp=4
    this.orbitRadius=Math.min(CONFIG.WIDTH,CONFIG.HEIGHT)*0.42;
    this.orbitSpeed=0.65+Math.random()*0.3;   // was 0.55-0.80
    this.chargeTimer=1400+Math.random()*800;  // was 2000-3200
    this.charging=false;this.chargeVx=0;this.chargeVy=0;this.chargeDuration=0;
    this.tentaclePhase=Math.random()*Math.PI*2;this.color=CONFIG.COLORS.octopus;
  }
  update(dt,player){
    this.tentaclePhase+=dt*0.004;
    if(this.charging){
      this.x+=this.chargeVx*dt*0.001;this.y+=this.chargeVy*dt*0.001;
      this.chargeVx+=(player.x-this.x)*0.05;this.chargeVy+=(player.y-this.y)*0.05;
      this.chargeDuration-=dt;
      if(this.chargeDuration<=0){this.charging=false;this.chargeTimer=1400+Math.random()*800;this.orbitAngle=Math.atan2(this.y-CONFIG.HEIGHT/2,this.x-CONFIG.WIDTH/2);}  // was 2000-3200
    } else {
      this.orbitRadius=Math.min(CONFIG.WIDTH,CONFIG.HEIGHT)*0.42;
      this.orbitAngle+=this.orbitSpeed*dt*0.001;
      this.x=CONFIG.WIDTH/2+Math.cos(this.orbitAngle)*this.orbitRadius;
      this.y=CONFIG.HEIGHT/2+Math.sin(this.orbitAngle)*this.orbitRadius;
      this.chargeTimer-=dt;
      if(this.chargeTimer<=0){
        this.charging=true;
        const dx=player.x-this.x,dy=player.y-this.y,d=Math.hypot(dx,dy)||1;
        this.chargeVx=(dx/d)*340;this.chargeVy=(dy/d)*340;this.chargeDuration=900;
      }
    }
  }
  draw(ctx){
    ctx.save();ctx.translate(this.x,this.y);
    ctx.shadowColor=this.color;ctx.shadowBlur=18;
    for(let i=0;i<8;i++){
      const a=(i/8)*Math.PI*2,w=Math.sin(this.tentaclePhase+i*0.78)*9;
      ctx.strokeStyle=this.color;ctx.lineWidth=3.5-i*0.15;
      ctx.beginPath();ctx.moveTo(0,0);
      ctx.quadraticCurveTo(Math.cos(a+0.4)*20+w,Math.sin(a+0.4)*20,Math.cos(a)*30,Math.sin(a)*30);ctx.stroke();
    }
    ctx.fillStyle=this.color;ctx.beginPath();ctx.arc(0,0,15,0,Math.PI*2);ctx.fill();
    if(this.charging){ctx.shadowBlur=0;ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,18,0,Math.PI*2);ctx.stroke();}
    ctx.shadowBlur=0;ctx.fillStyle='rgba(255,255,255,0.8)';ctx.font=`11px ${MONO}`;
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('∞',0,0);
    ctx.restore();
  }
}

// =============================================================================
// Ghost
// =============================================================================
class Ghost extends Entity {
  constructor(x,y){
    super(x,y,14);
    this.hp=3;this.speed=65+Math.random()*25;  // was 44-60 — noticeably faster
    this.floatPhase=Math.random()*Math.PI*2;this.color=CONFIG.COLORS.ghost;
  }
  update(dt,player){
    const dx=player.x-this.x,dy=player.y-this.y,d=Math.hypot(dx,dy)||1;
    this.vx=(dx/d)*this.speed;this.vy=(dy/d)*this.speed;
    this.x+=this.vx*dt*0.001;this.y+=this.vy*dt*0.001;
    this.floatPhase+=dt*0.003;
    if(this.x<-100||this.x>CONFIG.WIDTH+100||this.y<-100||this.y>CONFIG.HEIGHT+100)this.dead=true;
  }
  draw(ctx){
    ctx.save();ctx.translate(this.x,this.y);
    const pulse=0.5+0.5*Math.sin(this.floatPhase*2);
    ctx.globalAlpha=0.55;ctx.shadowColor=this.color;ctx.shadowBlur=12+pulse*14;
    ctx.translate(0,Math.sin(this.floatPhase)*5);
    ctx.fillStyle=this.color;ctx.beginPath();ctx.arc(0,-5,14,Math.PI,0);
    for(let i=0;i<=6;i++)ctx.lineTo(-14+(i/6)*28,9+Math.sin(i*Math.PI+this.floatPhase*2.5)*4);
    ctx.closePath();ctx.fill();
    ctx.shadowBlur=0;ctx.globalAlpha=0.8;ctx.fillStyle=CONFIG.COLORS.bg;
    for(const ex of[-5,5]){ctx.beginPath();ctx.ellipse(ex,-6,3,4,0,0,Math.PI*2);ctx.fill();}
    ctx.restore();
  }
}

// =============================================================================
// WaveManager
// =============================================================================
class WaveManager {
  constructor(){this.wave=0;this.state='gap';this.gapTimer=1500;this.spawnQueue=[];this.enemiesThisWave=0;this.waveCleared=false;}
  update(dt,enemies,audio){
    this.waveCleared=false;
    if(this.state==='gap'){this.gapTimer-=dt;if(this.gapTimer<=0){this.wave++;this._buildWave();this.state='active';}return;}
    if(this.spawnQueue.length>0){
      this.spawnQueue[0].timer-=dt;
      if(this.spawnQueue[0].timer<=0){const e=this.spawnQueue.shift();enemies.push(this._spawnEnemy(e.type,e.player));}
    }
    if(this.spawnQueue.length===0&&enemies.length===0){this.state='gap';this.gapTimer=CONFIG.WAVE_GAP_MS;this.waveCleared=true;audio.playWaveClear();}
  }
  _buildWave(){
    const w=this.wave,types=[];
    const mob=window.__isMobile?1.4:1.0; // 40% more enemies on mobile
    const nSp=Math.min(Math.round((2+w)*mob),14);
    const nSn=Math.max(0,Math.round(w*mob));
    const nOc=Math.max(0,Math.round(Math.floor((w-1)/2)*mob));
    const nGh=Math.max(0,Math.round(Math.floor((w-2)/3)*mob));
    for(let i=0;i<nSp;i++)types.push('Spider');
    for(let i=0;i<nSn;i++)types.push('Snake');
    for(let i=0;i<nOc;i++)types.push('Octopus');
    for(let i=0;i<nGh;i++)types.push('Ghost');
    for(let i=types.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[types[i],types[j]]=[types[j],types[i]];}
    this.spawnQueue=types.map((type,i)=>({type,timer:i*160,player:null}));
    this.enemiesThisWave=types.length;
  }
  _spawnEnemy(type,playerRef){
    const pos=this._edgePosition(),p=playerRef||{x:CONFIG.WIDTH/2,y:CONFIG.HEIGHT/2};
    let e;
    if(type==='Spider')  e=new Spider(pos.x,pos.y);
    else if(type==='Snake')   e=new Snake(pos.x,pos.y,p);
    else if(type==='Octopus') e=new Octopus(pos.x,pos.y);
    else e=new Ghost(pos.x,pos.y);
    // Mobile: enemies take significantly more hits
    if(window.__isMobile) e.hp=Math.ceil(e.hp*2.0);
    return e;
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
  constructor(){
    this.canvas=document.getElementById('gameCanvas');
    this.ctx=this.canvas.getContext('2d');
    this.nameEl=document.getElementById('nameInput');
    this.lang=this._detectLang();
    window.__bsLang=this.lang;
    this.state='INTRO';
    this._introTs=0;
    this.lastTs=0;this.shakeX=0;this.shakeY=0;this._gameOverTs=0;
    this.player=null;this.enemies=[];this.bullets=[];
    this.ps=new ParticleSystem();this.waves=new WaveManager();
    this.audio=new AudioManager();this.input=new InputManager(this.canvas);
    this.score=0;this.combo=1;this.comboTimer=0;
    this.highScore=parseInt(localStorage.getItem(CONFIG.HS_KEY))||0;
    this.playerName='';
    this.leaderboard=this._loadLocalScores();
    this.scoreSubmitted=false;this.submittingScore=false;
    this._langCards=[];this._newPlayerLinkBounds=null;
    this._autoAimTarget=null;
    this._wireNameInput();
    this._initCanvas();
    window.addEventListener('resize',()=>this._initCanvas());
    this._registerAdminConsole();
    this._startLoop();
  }

  // ---- Language ----
  _detectLang(){
    const saved=localStorage.getItem(CONFIG.LANG_KEY);
    if(saved&&STRINGS[saved])return saved;
    const nav=(navigator.language||'en').slice(0,2).toLowerCase();
    return STRINGS[nav]?nav:'en';
  }
  _setLang(code){this.lang=code;window.__bsLang=code;localStorage.setItem(CONFIG.LANG_KEY,code);}

  // ---- Name input ----
  _wireNameInput(){
    if(!this.nameEl)return;
    this.nameEl.addEventListener('keydown',e=>{
      if(e.key==='Enter'){e.preventDefault();const v=this.nameEl.value.trim();if(v){this.playerName=v;this._hideNameInput();this.toMenu();}}
      if(e.key==='Escape'){this._hideNameInput();this.toLangSelect();}
    });
  }
  _showNameInput(){
    if(!this.nameEl)return;
    this.nameEl.value=this.playerName;this.nameEl.placeholder=T('name_hint');
    this.nameEl.dir=isRTL()?'rtl':'ltr';
    this.nameEl.classList.add('visible');setTimeout(()=>this.nameEl.focus(),50);
  }
  _hideNameInput(){if(!this.nameEl)return;this.nameEl.classList.remove('visible');this.nameEl.blur();}

  // ---- Canvas ----
  _initCanvas(){
    const dpr=window.devicePixelRatio||1;
    // True fullscreen on all devices — no padding, no letterbox
    CONFIG.WIDTH  = window.innerWidth;
    CONFIG.HEIGHT = window.innerHeight;
    this._scale   = 1; // logical px == CSS px, no scaling
    this.canvas.width  = Math.round(CONFIG.WIDTH  * dpr);
    this.canvas.height = Math.round(CONFIG.HEIGHT * dpr);
    this.canvas.style.width  = CONFIG.WIDTH  + 'px';
    this.canvas.style.height = CONFIG.HEIGHT + 'px';
    this.canvas.style.position = 'fixed';
    this.canvas.style.left = '0';
    this.canvas.style.top  = '0';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if(this.input) this.input.setScale(1);
    // Clamp player inside new bounds if already playing
    if(this.player){
      this.player.x = Math.max(this.player.radius, Math.min(CONFIG.WIDTH  - this.player.radius, this.player.x));
      this.player.y = Math.max(this.player.radius, Math.min(CONFIG.HEIGHT - this.player.radius, this.player.y));
    }
  }

  // ---- Loop ----
  _startLoop(){
    const loop=ts=>{
      let dt=ts-this.lastTs;this.lastTs=ts;
      if(dt>CONFIG.MAX_DT)dt=CONFIG.MAX_DT;if(dt<0)dt=0;
      this._loop(dt,ts);requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
  _loop(dt,ts){
    if(this.state==='INTRO'&&this._introTs===0)this._introTs=ts;
    if(this.state==='PLAYING')this._update(dt);
    this._draw(ts);
  }

  // ---- State Transitions ----
  toIntro()      {this.state='INTRO';this._introTs=0;}
  toLangSelect(){this._hideNameInput();this.state='LANG_SELECT';}
  toNameInput() {this._showNameInput();this.state='NAME_INPUT';}
  toMenu()      {this._hideNameInput();this.state='MENU';}
  toPlaying(){
    this.score=0;this.combo=1;this.comboTimer=0;
    this.enemies=[];this.bullets=[];this.ps=new ParticleSystem();this.waves=new WaveManager();
    this.player=new Player(CONFIG.WIDTH/2,CONFIG.HEIGHT/2);
    this.shakeX=0;this.shakeY=0;this.scoreSubmitted=false;
    this._shootHint={active:true,timer:0};
    this._hasKilled=false;
    this._comboFloaters=[];this._waveAnnounce=null;this._prevWaveState='gap';
    this._driftChars=Array.from({length:20},()=>({
      ch:['{}','()','[]','<>','//','&&','||','!=','==','++'][Math.floor(Math.random()*10)],
      x:Math.random()*CONFIG.WIDTH,
      y:Math.random()*CONFIG.HEIGHT,
      speed:14+Math.random()*12,
    }));
    this.state='PLAYING';
  }
  toPaused() {this.state='PAUSED';}
  toResumed(){this.state='PLAYING';}
  toGameOver(){
    if(this.score>this.highScore){this.highScore=this.score;localStorage.setItem(CONFIG.HS_KEY,this.highScore);}
    this._saveLocalScore();this._submitScore();
    this.state='GAME_OVER';this._gameOverTs=performance.now();
    this.input.clearAll();
  }

  // ---- Leaderboard ----
  _loadLocalScores(){try{const r=localStorage.getItem(CONFIG.SCORES_KEY);return r?JSON.parse(r):[]}catch(e){return[];}}
  _saveLocalScore(){
    if(!this.playerName||this.score<=0)return;
    let s=this._loadLocalScores();
    s.push({name:this.playerName,score:this.score,wave:this.waves.wave});
    s.sort((a,b)=>b.score-a.score);s=s.slice(0,20);
    try{localStorage.setItem(CONFIG.SCORES_KEY,JSON.stringify(s));}catch(e){}
    this.leaderboard=s;
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

    // Auto-aim on touch: find nearest enemy each frame, set angle on input
    if(this._isTouchDevice()&&this.enemies.length>0){
      let nearest=null,minDist=Infinity;
      for(const e of this.enemies){
        if(e.dead)continue;
        const d=Math.hypot(e.x-this.player.x,e.y-this.player.y);
        if(d<minDist){minDist=d;nearest=e;}
      }
      if(nearest){
        this.input.setAutoAim(Math.atan2(nearest.y-this.player.y,nearest.x-this.player.x));
        this._autoAimTarget=nearest;
      }
    } else {
      this.input.clearAutoAim();
      this._autoAimTarget=null;
    }
    for(const b of this.bullets)b.update(dt);
    for(const e of this.enemies)e.update(dt,this.player);
    this.waves.update(dt,this.enemies,this.audio);
    // Wave announcement trigger
    if(this._prevWaveState==='gap'&&this.waves.state==='active'){
      this._waveAnnounce={text:T('wave',this.waves.wave),timer:1600,maxTimer:1600};
    }
    this._prevWaveState=this.waves.state;
    if(this._waveAnnounce){this._waveAnnounce.timer-=dt;if(this._waveAnnounce.timer<=0)this._waveAnnounce=null;}
    this.ps.update(dt);
    if(this.combo>1){this.comboTimer-=dt;if(this.comboTimer<=0){this.combo=1;this.comboTimer=0;}}
    // Combo floaters
    if(this._comboFloaters){const s=dt*0.001;this._comboFloaters.forEach(f=>{f.y+=f.vy*s;f.alpha-=s*1.2;});this._comboFloaters=this._comboFloaters.filter(f=>f.alpha>0);}
    // Drift chars
    if(this._driftChars){const s=dt*0.001;const syms=['{}','()','[]','<>','//','&&','||','!=','==','++'];for(const c of this._driftChars){c.y+=c.speed*s;if(c.y>CONFIG.HEIGHT+20){c.y=-20;c.x=Math.random()*CONFIG.WIDTH;c.ch=syms[Math.floor(Math.random()*syms.length)];}}}
    if(this._shootHint&&this._shootHint.active&&this.waves.state==='active'&&this.waves.wave===1){
      this._shootHint.timer+=dt;
      if(this._shootHint.timer>5000)this._shootHint.active=false;
    }
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
    if(!this._hasKilled){this._hasKilled=true;if(this._shootHint)this._shootHint.active=false;}
    if(this.combo>1)this._comboFloaters.push({text:'×'+this.combo,x:enemy.x,y:enemy.y-10,alpha:1,vy:-55});
    this.ps.emit(enemy.x,enemy.y,enemy.color,20,{speedMin:60,speedMax:200,lifeMin:300,lifeMax:700,radiusMin:2,radiusMax:6});
    this.ps.emit(enemy.x,enemy.y,'#FFFFFF',3,{speedMin:120,speedMax:280,lifeMin:150,lifeMax:340,radiusMin:1,radiusMax:3});
    this.ps.emit(enemy.x,enemy.y,CONFIG.COLORS.gold,2,{speedMin:80,speedMax:180,lifeMin:200,lifeMax:450,radiusMin:1,radiusMax:2});
    this.audio.playPop();this._shake(4);
  }
  _drawAimBeam(ctx, target){
    const px=this.player.x, py=this.player.y;
    const tx=target.x, ty=target.y;
    const angle=Math.atan2(ty-py,tx-px);
    const dist=Math.hypot(tx-px,ty-py);
    // Stop beam just before the enemy edge
    const beamEnd=Math.max(0,dist-target.radius-4);

    ctx.save();
    ctx.globalAlpha=0.55;

    // Dashed beam line
    ctx.strokeStyle=CONFIG.COLORS.player;
    ctx.lineWidth=1.2;
    ctx.setLineDash([6,5]);
    ctx.lineDashOffset=-(Date.now()*0.04)%11; // animated march
    ctx.beginPath();
    ctx.moveTo(px+Math.cos(angle)*(this.player.radius+4),
               py+Math.sin(angle)*(this.player.radius+4));
    ctx.lineTo(px+Math.cos(angle)*beamEnd,
               py+Math.sin(angle)*beamEnd);
    ctx.stroke();
    ctx.setLineDash([]);

    // Pulsing target ring on enemy
    const pulse=0.55+0.45*Math.abs(Math.sin(Date.now()*0.004));
    ctx.globalAlpha=pulse*0.7;
    ctx.strokeStyle=CONFIG.COLORS.player;
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.arc(tx,ty,target.radius+6,0,Math.PI*2);
    ctx.stroke();

    // Small arrow head near target
    ctx.globalAlpha=0.7;
    ctx.fillStyle=CONFIG.COLORS.player;
    const ax=px+Math.cos(angle)*(beamEnd-2);
    const ay=py+Math.sin(angle)*(beamEnd-2);
    const aw=5,al=8;
    ctx.beginPath();
    ctx.moveTo(ax+Math.cos(angle)*al, ay+Math.sin(angle)*al);
    ctx.lineTo(ax+Math.cos(angle+Math.PI*0.7)*aw, ay+Math.sin(angle+Math.PI*0.7)*aw);
    ctx.lineTo(ax+Math.cos(angle-Math.PI*0.7)*aw, ay+Math.sin(angle-Math.PI*0.7)*aw);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  _drawShootHint(ts){
    if(!this._shootHint||!this._shootHint.active)return;
    if(this.waves.wave>1)return;
    const ctx=this.ctx;
    const pulse=0.6+0.4*Math.abs(Math.sin(ts*0.003));
    ctx.save();
    ctx.globalAlpha=pulse;
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=CONFIG.COLORS.gold;
    ctx.shadowColor=CONFIG.COLORS.gold;ctx.shadowBlur=20;
    ctx.font=F(18,'bold');
    fillTextFit(ctx,T('hint_shoot'),CONFIG.WIDTH/2,CONFIG.HEIGHT/2+60,CONFIG.WIDTH-80,12,'bold');
    ctx.shadowBlur=0;ctx.globalAlpha=1;
    ctx.restore();
  }

  _shake(m){this.shakeX=(Math.random()*2-1)*m;this.shakeY=(Math.random()*2-1)*m;}

  async _trackClick(){
    const ts = new Date().toISOString();
    const entry = {
      ts,
      // Language & locale
      lang:      this.lang,
      locale:    navigator.language || 'unknown',
      // Device & screen
      screen:    `${screen.width}x${screen.height}`,
      viewport:  `${window.innerWidth}x${window.innerHeight}`,
      dpr:       window.devicePixelRatio || 1,
      touch:     this._isTouchDevice(),
      platform:  navigator.platform || 'unknown',
      ua:        navigator.userAgent,
      // Game context at click time
      state:     this.state,
      score:     this.score,
      highScore: this.highScore,
      wave:      this.waves ? this.waves.wave : 0,
      playerName: this.playerName || '',
      // Referrer
      referrer:  document.referrer || 'direct',
      url:       window.location.href,
    };

    // Persist locally (keep last 100 entries)
    try {
      const stored = JSON.parse(localStorage.getItem('bugSquasher_gseLog') || '[]');
      stored.push(entry);
      if (stored.length > 100) stored.splice(0, stored.length - 100);
      localStorage.setItem('bugSquasher_gseLog', JSON.stringify(stored));
      // Total count separate for quick read
      const n = parseInt(localStorage.getItem('bugSquasher_gseClicks') || '0') + 1;
      localStorage.setItem('bugSquasher_gseClicks', n);
    } catch(e) {}

    // Send to Firebase if configured (fire-and-forget)
    if (CONFIG.CLICK_COUNTER_URL) {
      try {
        await fetch(CONFIG.CLICK_COUNTER_URL + '.json', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(entry),
        });
      } catch(e) { /* offline — already saved locally */ }
    }
  }

  // Admin console helper — type gseAdmin() in browser DevTools
  _registerAdminConsole(){
    window.gseAdmin = () => {
      const log   = JSON.parse(localStorage.getItem('bugSquasher_gseLog') || '[]');
      const total = parseInt(localStorage.getItem('bugSquasher_gseClicks') || '0');
      console.group('%c🦆 GSE Link Analytics', 'font-size:16px;font-weight:bold;color:#FFD60A');
      console.log(`%cTotal clicks: ${total}`, 'font-size:14px;color:#30D158;font-weight:bold');
      if (log.length === 0) { console.log('No click data yet.'); console.groupEnd(); return; }
      // Summary by language
      const byLang = {};
      log.forEach(e => { byLang[e.lang] = (byLang[e.lang]||0)+1; });
      console.log('%cBy language:', 'font-weight:bold;color:#64D2FF');
      console.table(Object.entries(byLang).map(([lang,n])=>({lang,clicks:n})));
      // Summary by device type
      const mobile = log.filter(e=>e.touch).length;
      console.log(`%cMobile: ${mobile}  Desktop: ${log.length-mobile}`, 'color:#BF5AF2');
      // Summary by game state at click
      const byState = {};
      log.forEach(e => { byState[e.state] = (byState[e.state]||0)+1; });
      console.log('%cClicked from state:', 'font-weight:bold;color:#64D2FF');
      console.table(Object.entries(byState).map(([state,n])=>({state,clicks:n})));
      // Score distribution
      const scores = log.filter(e=>e.score>0).map(e=>e.score);
      if (scores.length) {
        const avg = Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
        const max = Math.max(...scores);
        console.log(`%cScore at click — avg: ${avg}  max: ${max}`, 'color:#FFD60A');
      }
      // Referrers
      const byRef = {};
      log.forEach(e => { const r=e.referrer||'direct'; byRef[r]=(byRef[r]||0)+1; });
      console.log('%cReferrers:', 'font-weight:bold;color:#64D2FF');
      console.table(Object.entries(byRef).map(([referrer,n])=>({referrer,clicks:n})));
      // Full log
      console.log('%cFull event log:', 'font-weight:bold;color:#64D2FF');
      console.table(log.map(e=>({
        time:   e.ts.replace('T',' ').slice(0,19),
        lang:   e.lang,
        device: e.touch?'📱 mobile':'🖥️ desktop',
        screen: e.screen,
        state:  e.state,
        score:  e.score,
        wave:   e.wave,
        player: e.playerName,
        ref:    (e.referrer||'direct').slice(0,40),
      })));
      console.groupEnd();
    };
    console.log('%c🦆 BUG SQUASHER — type gseAdmin() for link analytics', 'color:#FFD60A');
  }

  _drawFooter(ts){
    const ctx = this.ctx;
    const fh  = 22; // footer height in logical px
    const fy  = CONFIG.HEIGHT - fh;
    const cx  = CONFIG.WIDTH / 2;
    const mx  = this.input.mouse.x, my = this.input.mouse.y;
    const hov = my >= fy && my <= CONFIG.HEIGHT;

    ctx.save();
    // Background strip
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, fy, CONFIG.WIDTH, fh);
    // Hairline separator
    ctx.strokeStyle = CONFIG.COLORS.border;
    ctx.lineWidth   = 0.5;
    ctx.beginPath(); ctx.moveTo(0, fy); ctx.lineTo(CONFIG.WIDTH, fy); ctx.stroke();

    // Text: "Made with 🦆 by GSE" · gse.events
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    const midY = fy + fh / 2;

    ctx.fillStyle = CONFIG.COLORS.textDim;
    ctx.font      = `11px ${SYS}`;
    ctx.fillText('Made with 🦆 by', cx - 48, midY);

    // Clickable "gse.events" link
    const linkHov = hov && mx > cx - 12 && mx < cx + 74;
    ctx.fillStyle = linkHov ? '#FFFFFF' : CONFIG.COLORS.textSec;
    ctx.font      = linkHov ? `bold 11px ${SYS}` : `11px ${SYS}`;
    ctx.fillText('gse.events', cx + 28, midY);

    // Underline for link
    const lw = 56;
    ctx.strokeStyle  = linkHov ? '#FFFFFF' : CONFIG.COLORS.textDim;
    ctx.lineWidth    = 0.5;
    ctx.globalAlpha  = linkHov ? 0.8 : 0.35;
    ctx.beginPath(); ctx.moveTo(cx, midY + 6); ctx.lineTo(cx + lw, midY + 6); ctx.stroke();
    ctx.globalAlpha  = 1;

    ctx.restore();

    // Hit detection
    if(linkHov && this.input.consumeClick()){
      this._trackClick();
      window.open(CONFIG.GSE_URL, '_blank', 'noopener,noreferrer');
    }
  }
  _isTouchDevice(){return this.input._touchEverUsed||navigator.maxTouchPoints>0||('ontouchstart' in window);}

  // ---- Draw helpers ----
  _rr(ctx,x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
    ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
    ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);
    ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath();
  }
  _card(ctx,x,y,w,h,r,fill,stroke){
    ctx.save();this._rr(ctx,x,y,w,h,r||16);
    ctx.fillStyle=fill||CONFIG.COLORS.surface;ctx.fill();
    ctx.strokeStyle=stroke||CONFIG.COLORS.border;ctx.lineWidth=1;ctx.stroke();
    ctx.restore();
  }
  _drawBg(ctx){
    // Warm dark gradient instead of flat black
    const g=ctx.createLinearGradient(0,0,0,CONFIG.HEIGHT);
    g.addColorStop(0,'#0f1724');g.addColorStop(1,'#0a0f1a');
    ctx.fillStyle=g;ctx.fillRect(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);
  }
  _vignette(ctx){
    ctx.save();ctx.globalAlpha=0.35;
    const g=ctx.createRadialGradient(CONFIG.WIDTH/2,CONFIG.HEIGHT/2,CONFIG.HEIGHT*0.2,CONFIG.WIDTH/2,CONFIG.HEIGHT/2,CONFIG.HEIGHT*0.9);
    g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,0.7)');
    ctx.fillStyle=g;ctx.fillRect(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);
    ctx.restore();
  }

  // ---- INTRO ----
  _drawIntro(ts){
    if(this._introTs===0)this._introTs=ts;
    const elapsed=(ts-this._introTs)/1000; // seconds
    const ctx=this.ctx;
    const cx=CONFIG.WIDTH/2,cy=CONFIG.HEIGHT/2;

    // Background — deep dark with subtle radial
    ctx.fillStyle='#090d15';
    ctx.fillRect(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);
    ctx.save();ctx.globalAlpha=0.18;
    const rg=ctx.createRadialGradient(cx,cy,40,cx,cy,CONFIG.HEIGHT*0.7);
    rg.addColorStop(0,'#1a2540');rg.addColorStop(1,'#090d15');
    ctx.fillStyle=rg;ctx.fillRect(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);
    ctx.restore();

    // Animated duck — bounces in from below, settles at center-top area
    const duckArrival=Math.min(1,elapsed/0.7);        // 0→1 in first 0.7s
    const duckY=cy-80+Math.pow(1-duckArrival,2)*200  // drops in with ease
              +Math.sin(elapsed*2.2)*6*(duckArrival); // gentle bob after landing
    const duckAlpha=Math.min(1,elapsed/0.4);

    ctx.save();ctx.globalAlpha=duckAlpha;
    ctx.translate(cx,duckY);
    ctx.scale(3,3);
    ctx.rotate(Math.sin(elapsed*1.6)*0.12);
    // Duck body
    ctx.shadowColor='#FFD60A';ctx.shadowBlur=16;
    ctx.fillStyle=CONFIG.COLORS.player;
    ctx.beginPath();ctx.ellipse(0,3,17,13,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#CC9900';ctx.lineWidth=1.5;ctx.stroke();
    // Head
    ctx.beginPath();ctx.arc(7,-10,10,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#CC9900';ctx.lineWidth=1.5;ctx.stroke();
    // Bill
    ctx.shadowBlur=0;ctx.fillStyle='#FF8C00';
    ctx.beginPath();ctx.moveTo(15,-11);ctx.quadraticCurveTo(28,-9,26,-5);ctx.lineTo(15,-6);ctx.closePath();ctx.fill();
    // Eye
    ctx.translate(10,-13);
    ctx.fillStyle='white';ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#111';
    const ep=Math.cos(elapsed*1.2)*1.5,eq=Math.sin(elapsed*0.9)*1.5;
    ctx.beginPath();ctx.arc(ep,eq,2.2,0,Math.PI*2);ctx.fill();
    ctx.restore();

    // Line 1 — fades in at 0.5s
    const l1alpha=Math.max(0,Math.min(1,(elapsed-0.5)/0.4));
    if(l1alpha>0){
      ctx.save();ctx.globalAlpha=l1alpha;
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillStyle=CONFIG.COLORS.textPri;ctx.font=F(20,'bold');
      // Typewriter effect: show progressively more chars
      const l1full=T('intro_line1');
      const l1chars=Math.floor(((elapsed-0.5)/0.8)*l1full.length);
      ctx.fillText(l1full.slice(0,Math.min(l1chars,l1full.length)),cx,cy+30);
      ctx.restore();
    }

    // Line 2 — fades in at 1.4s
    const l2alpha=Math.max(0,Math.min(1,(elapsed-1.4)/0.4));
    if(l2alpha>0){
      ctx.save();ctx.globalAlpha=l2alpha;
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillStyle=CONFIG.COLORS.gold;ctx.shadowColor=CONFIG.COLORS.gold;ctx.shadowBlur=10;
      ctx.font=F(20,'bold');
      const l2full=T('intro_line2');
      const l2chars=Math.floor(((elapsed-1.4)/0.7)*l2full.length);
      ctx.fillText(l2full.slice(0,Math.min(l2chars,l2full.length)),cx,cy+62);
      ctx.shadowBlur=0;ctx.restore();
    }

    // CTA — flashes in at 2.5s
    const ctaAlpha=elapsed>2.5?Math.max(0,Math.min(1,(elapsed-2.5)/0.3))*(Math.floor(ts/550)%2===0?1:0.35):0;
    if(ctaAlpha>0){
      ctx.save();ctx.globalAlpha=ctaAlpha;
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(12);
      ctx.fillText(T('intro_cta'),cx,cy+106);
      ctx.restore();
    }

    this._vignette(ctx);

    // Skip on any input (or auto-advance after 6s)
    if(elapsed>2.8&&(this.input.consumeAction()||this.input.consumeClick()))this.toLangSelect();
    if(elapsed>6)this.toLangSelect();
  }

  // ---- Draw dispatcher ----
  _draw(ts){
    const ctx=this.ctx;
    ctx.clearRect(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);
    if(this.state==='INTRO')       {this._drawIntro(ts);       this._drawFooter(ts);return;}
    if(this.state==='LANG_SELECT') {this._drawLangSelect(ts);  this._drawFooter(ts);return;}
    if(this.state==='NAME_INPUT')  {this._drawNameInput(ts);   this._drawFooter(ts);return;}
    if(this.state==='MENU')        {this._drawMenu(ts);        this._drawFooter(ts);return;}
    if(this.state==='GAME_OVER')   {this._drawGameOver(ts);    this._drawFooter(ts);return;}
    this._drawGame(ts);
    if(this.state==='PAUSED'){
      ctx.save();ctx.direction=isRTL()?'rtl':'ltr';
      ctx.fillStyle=CONFIG.COLORS.overlay;ctx.fillRect(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);
      const cw=Math.min(300,CONFIG.WIDTH*0.65),ch=100,cx=(CONFIG.WIDTH-cw)/2,cy=CONFIG.HEIGHT/2-ch/2;
      this._card(ctx,cx,cy,cw,ch,20);
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillStyle=CONFIG.COLORS.textPri;ctx.font=F(24,'bold');
      ctx.fillText(T('paused'),CONFIG.WIDTH/2,cy+32);
      ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(12);
      fillTextFit(ctx,this._isTouchDevice()?T('resume_t'):T('resume'),CONFIG.WIDTH/2,cy+62,cw-24,13);
      ctx.restore();
      if(this.input.consumePause())this.toResumed();
      else if(this._isTouchDevice()&&this.input.consumeClick())this.toResumed();
    }
    this._drawFooter(ts);
  }

  // ---- LANG_SELECT ----
  _drawLangSelect(ts){
    const ctx=this.ctx;
    this._drawBg(ctx);
    ctx.direction='ltr';
    // Title
    ctx.save();
    ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillStyle=CONFIG.COLORS.player;ctx.shadowColor=CONFIG.COLORS.player;ctx.shadowBlur=16;
    ctx.font=F(40,'bold');ctx.fillText('BUG SQUASHER',CONFIG.WIDTH/2,Math.round(CONFIG.HEIGHT*0.14));
    ctx.shadowBlur=0;ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(12);
    ctx.fillText(T('lang_title'),CONFIG.WIDTH/2,Math.round(CONFIG.HEIGHT*0.14)+26);
    ctx.restore();

    const langs=[
      {code:'de',flag:'🇩🇪',name:'Deutsch'},
      {code:'en',flag:'🇬🇧',name:'English'},
      {code:'fr',flag:'🇫🇷',name:'Français'},
      {code:'es',flag:'🇪🇸',name:'Español'},
      {code:'ar',flag:'🇸🇦',name:'العربية'},
    ];
    const cols=2,cardW=Math.min(210,CONFIG.WIDTH*0.4),cardH=80,gapX=16,gapY=12;
    const gridW=cols*(cardW+gapX)-gapX,startX=CONFIG.WIDTH/2-gridW/2;
    const rows=Math.ceil(langs.length/cols);
    const gridH=rows*(cardH+gapY)-gapY;
    const startY=CONFIG.HEIGHT/2-gridH/2+10;
    this._langCards=[];
    const mx=this.input.mouse.x,my=this.input.mouse.y;

    langs.forEach((lang,i)=>{
      const isLast=i===langs.length-1&&langs.length%2!==0;
      const col=isLast?0.5:i%cols,row=Math.floor(i/cols);
      const x=startX+col*(cardW+gapX),y=startY+row*(cardH+gapY);
      const isActive=this.lang===lang.code,isHov=mx>=x&&mx<=x+cardW&&my>=y&&my<=y+cardH;
      this._langCards.push({code:lang.code,x,y,w:cardW,h:cardH});
      ctx.save();
      if(isActive){
        this._card(ctx,x,y,cardW,cardH,14,CONFIG.COLORS.accent,'transparent');
      } else {
        this._card(ctx,x,y,cardW,cardH,14);
        if(isHov){this._rr(ctx,x,y,cardW,cardH,14);ctx.fillStyle='rgba(255,255,255,0.04)';ctx.fill();}
      }
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.font='28px serif';ctx.fillText(lang.flag,x+cardW/2,y+cardH/2-10);
      const nf=lang.code==='ar'?`${isActive?'bold ':''} 13px ${SYS_AR}`:(isActive?F(13,'bold'):F(13));
      ctx.font=nf;ctx.fillStyle=isActive?'#fff':CONFIG.COLORS.textPri;
      ctx.fillText(lang.name,x+cardW/2,y+cardH/2+17);
      ctx.restore();
    });

    ctx.save();ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(12);
    fillTextFit(ctx,T('lang_sub'),CONFIG.WIDTH/2,startY+rows*(cardH+gapY)+20,CONFIG.WIDTH-60,11);
    ctx.restore();
    this._vignette(ctx);

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
    const cx=CONFIG.WIDTH/2,pad=32;

    ctx.save();ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillStyle=CONFIG.COLORS.textPri;ctx.shadowColor=CONFIG.COLORS.player;ctx.shadowBlur=12;
    ctx.font=F(20,'bold');
    fillTextFit(ctx,T('name_title'),cx,Math.round(CONFIG.HEIGHT*0.28),CONFIG.WIDTH-80,32,'bold');
    ctx.shadowBlur=0;ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(12);
    fillTextFit(ctx,T('name_sub'),cx,Math.round(CONFIG.HEIGHT*0.28)+26,CONFIG.WIDTH-80,14);
    ctx.restore();

    const hintY=Math.round(CONFIG.HEIGHT*0.64);
    ctx.save();ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(12);
    fillTextFit(ctx,this._isTouchDevice()?T('name_hint_t'):T('name_hint'),cx,hintY,CONFIG.WIDTH-80,12);
    ctx.restore();

    const btnW=Math.min(220,CONFIG.WIDTH*0.5),btnH=48,btnX=cx-btnW/2,btnY=Math.round(CONFIG.HEIGHT*0.70);
    const mx=this.input.mouse.x,my=this.input.mouse.y;
    const hov=mx>=btnX&&mx<=btnX+btnW&&my>=btnY&&my<=btnY+btnH;
    ctx.save();
    this._rr(ctx,btnX,btnY,btnW,btnH,12);
    ctx.fillStyle=hov?'#2196FF':CONFIG.COLORS.accent;ctx.fill();
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle='#fff';ctx.font=F(12,'bold');
    fillTextFit(ctx,T('name_confirm'),cx,btnY+btnH/2,btnW-20,12,'bold');
    ctx.restore();

    ctx.save();ctx.textBaseline='alphabetic';ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(12);
    if(isRTL()){ctx.textAlign='right';ctx.fillText(T('name_back')+' →',CONFIG.WIDTH-pad,Math.round(CONFIG.HEIGHT*0.88));}
    else{ctx.textAlign='left';ctx.fillText('← '+T('name_back'),pad,Math.round(CONFIG.HEIGHT*0.88));}
    ctx.restore();

    this._vignette(ctx);

    if(this.input.consumeClick()){
      if(mx>=btnX&&mx<=btnX+btnW&&my>=btnY&&my<=btnY+btnH){
        const v=this.nameEl?this.nameEl.value.trim():'';
        if(v){this.playerName=v;this._hideNameInput();this.toMenu();}return;
      }
      const backHit=isRTL()?(mx>CONFIG.WIDTH-180):(mx<180);
      if(backHit&&my>CONFIG.HEIGHT*0.86){this._hideNameInput();this.toLangSelect();}
    }
  }

  // ---- MENU ----
  _drawMenu(ts){
    const ctx=this.ctx;
    this._drawBg(ctx);
    ctx.direction=isRTL()?'rtl':'ltr';
    const cx=CONFIG.WIDTH/2;

    // Title
    ctx.save();ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillStyle=CONFIG.COLORS.player;ctx.shadowColor=CONFIG.COLORS.player;ctx.shadowBlur=18;
    ctx.font=F(48,'bold');ctx.fillText('BUG SQUASHER',cx,Math.round(CONFIG.HEIGHT*0.14));
    ctx.shadowBlur=0;ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(12);
    fillTextFit(ctx,T('subtitle'),cx,Math.round(CONFIG.HEIGHT*0.14)+24,CONFIG.WIDTH-60,14);
    ctx.restore();

    // Duck
    this._drawMenuDuck(ctx,cx,Math.round(CONFIG.HEIGHT*0.37),ts);

    // Controls card — "How to Play" header + instructions
    const ctrlLines=this._isTouchDevice()?[T('ctrl_move_t'),T('ctrl_shoot_t')]:[T('ctrl_move'),T('ctrl_shoot'),T('ctrl_pause')];
    const titleLine=T('ctrl_title');
    const ctrlH=26+ctrlLines.length*20+14; // title row 26 + lines + padding
    const ctrlW=Math.min(380,CONFIG.WIDTH*0.78);
    const ctrlX=cx-ctrlW/2,ctrlY=Math.round(CONFIG.HEIGHT*0.54);
    this._card(ctx,ctrlX,ctrlY,ctrlW,ctrlH,12);
    ctx.save();
    // Title row
    ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillStyle=CONFIG.COLORS.textPri;ctx.font=F(12,'bold');
    ctx.fillText(titleLine,cx,ctrlY+17);
    // Hairline under title
    ctx.strokeStyle=CONFIG.COLORS.border;ctx.lineWidth=0.5;
    ctx.beginPath();ctx.moveTo(ctrlX+16,ctrlY+22);ctx.lineTo(ctrlX+ctrlW-16,ctrlY+22);ctx.stroke();
    // Instruction lines — shoot row highlighted in gold
    ctrlLines.forEach((ln,i)=>{
      const isShoot = i===1; // shoot is always second line on both touch and desktop
      ctx.fillStyle = isShoot ? CONFIG.COLORS.gold : CONFIG.COLORS.textSec;
      ctx.shadowColor = isShoot ? CONFIG.COLORS.gold : 'transparent';
      ctx.shadowBlur  = isShoot ? 6 : 0;
      ctx.font = F(isShoot ? 12 : 11, isShoot ? 'bold' : undefined);
      fillTextFit(ctx,ln,cx,ctrlY+36+i*20,ctrlW-28,isShoot?12:11,isShoot?'bold':undefined);
    });
    ctx.shadowBlur=0;
    ctx.restore();

    // Enemy previews — placed below controls with safe gap
    this._drawEnemyPreviews(ctx,ctrlY+ctrlH+18);

    // Start prompt
    if(Math.floor(ts/600)%2===0){
      ctx.save();ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textPri;ctx.font=F(12);
      ctx.fillText(this._isTouchDevice()?T('start_t'):T('start'),cx,Math.round(CONFIG.HEIGHT*0.84));
      ctx.restore();
    }

    if(this.highScore>0){
      ctx.save();ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(12);
      ctx.fillText(T('hi_score')+': '+this.highScore,cx,Math.round(CONFIG.HEIGHT*0.87));
      ctx.restore();
    }

    if(this.playerName){
      ctx.save();ctx.textBaseline='top';ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(12);
      if(isRTL()){ctx.textAlign='left';ctx.fillText(this.playerName+' ◀',14,10);}
      else{ctx.textAlign='right';ctx.fillText('▶ '+this.playerName,CONFIG.WIDTH-14,10);}
      ctx.restore();
    }

    this._vignette(ctx);
    if(this.input.consumeAction()||this.input.consumeClick())this.toPlaying();
  }

  _drawMenuDuck(ctx,x,y,ts){
    ctx.save();ctx.translate(x,y);ctx.scale(2.2,2.2);
    ctx.rotate(Math.sin(ts*0.0018)*0.18);
    ctx.shadowColor='#FFD60A';ctx.shadowBlur=8;
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

  _drawEnemyPreviews(ctx,y){
    y=y||Math.round(CONFIG.HEIGHT*0.71);
    const keys=['enemy_spider','enemy_snake','enemy_octopus','enemy_ghost'];
    const colors=[CONFIG.COLORS.spider,CONFIG.COLORS.snake,CONFIG.COLORS.octopus,CONFIG.COLORS.ghost];
    const colW=CONFIG.WIDTH/4;
    keys.forEach((key,i)=>{
      ctx.save();
      ctx.textAlign='center';ctx.textBaseline='alphabetic';
      ctx.fillStyle=colors[i];ctx.shadowColor=colors[i];ctx.shadowBlur=5;
      ctx.font=isRTL()?`bold 9px ${SYS_AR}`:`bold 9px ${SYS}`;
      fillTextFit(ctx,T(key),(i+0.5)*colW,y,colW-8,12,'bold');
      ctx.restore();
    });
  }

  // ---- GAME screen ----
  _drawGame(ts){
    const ctx=this.ctx;
    ctx.save();ctx.translate(this.shakeX,this.shakeY);
    this._drawBg(ctx);
    // Subtle dot grid
    ctx.fillStyle='rgba(255,255,255,0.03)';
    for(let gx=40;gx<CONFIG.WIDTH;gx+=40)
      for(let gy=40;gy<CONFIG.HEIGHT;gy+=40){ctx.beginPath();ctx.arc(gx,gy,1,0,Math.PI*2);ctx.fill();}
    // Drifting code characters
    if(this._driftChars){ctx.save();ctx.font=`10px ${MONO}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='rgba(255,255,255,0.045)';for(const c of this._driftChars)ctx.fillText(c.ch,c.x,c.y);ctx.restore();}
    this.ps.draw(ctx);
    for(const e of this.enemies)e.draw(ctx);
    for(const b of this.bullets)b.draw(ctx);
    // Auto-aim target beam (touch only, drawn above enemies but below player)
    if(this._isTouchDevice()&&this._autoAimTarget&&!this._autoAimTarget.dead){
      this._drawAimBeam(ctx,this._autoAimTarget);
    }
    this.player.draw(ctx);
    // Shoot hint — only wave 1, before first kill
    this._drawShootHint(ts);
    // Combo floaters (inside shake layer so they feel attached to the action)
    if(this._comboFloaters&&this._comboFloaters.length){
      ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
      for(const f of this._comboFloaters){
        ctx.globalAlpha=Math.max(0,f.alpha);
        ctx.fillStyle=CONFIG.COLORS.gold;ctx.shadowColor=CONFIG.COLORS.gold;ctx.shadowBlur=12;
        ctx.font=F(18,'bold');ctx.fillText(f.text,f.x,f.y);
      }
      ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.restore();
    }
    ctx.restore();
    // Wave announcement (outside shake — stable screen position)
    if(this._waveAnnounce&&this._waveAnnounce.timer>0){
      const wa=this._waveAnnounce,p=wa.timer/wa.maxTimer;
      const fadeIn=Math.min(1,(1-p)*10);
      const fadeOut=Math.min(1,p*1.4);
      const alpha=Math.max(0,Math.min(fadeIn,fadeOut))*0.5; // 50% transparent
      const scale=1+(1-Math.min(1,(1-p)*6))*0.55;
      ctx.save();ctx.globalAlpha=alpha;
      ctx.translate(CONFIG.WIDTH/2,CONFIG.HEIGHT/2);ctx.scale(scale,scale);
      ctx.textAlign='center';ctx.textBaseline='middle';
      // Thin black stroke (outline) around letters
      ctx.strokeStyle='rgba(0,0,0,0.9)';
      ctx.lineWidth=3;
      ctx.lineJoin='round';
      ctx.font=F(104,'bold'); // double size (was 52)
      ctx.strokeText(wa.text,0,0);
      // Fill on top
      ctx.fillStyle=CONFIG.COLORS.gold;
      ctx.fillText(wa.text,0,0);
      ctx.restore();
    }
    this._drawHUD(ts);
    this._drawTouchOverlay();
    this._vignette(ctx);
  }

  _drawHUD(ts){
    const ctx=this.ctx;
    ctx.save();ctx.direction=isRTL()?'rtl':'ltr';

    // ---- HP Bar (segmented) ----
    const segW=18,segH=8,segGap=4,segR=3;
    const barY=14;
    const totalW=CONFIG.PLAYER_MAX_HP*segW+(CONFIG.PLAYER_MAX_HP-1)*segGap;
    const barX=isRTL()?(CONFIG.WIDTH-12-totalW):12;
    for(let i=0;i<CONFIG.PLAYER_MAX_HP;i++){
      const sx=isRTL()?(barX+totalW-(i+1)*(segW+segGap)+segGap):(barX+i*(segW+segGap));
      const full=i<this.player.hp;
      ctx.save();
      this._rr(ctx,sx,barY,segW,segH,segR);
      ctx.fillStyle=full?CONFIG.COLORS.error:'rgba(255,69,58,0.12)';
      if(full){ctx.shadowColor=CONFIG.COLORS.error;ctx.shadowBlur=5;}
      ctx.fill();
      ctx.shadowBlur=0;
      ctx.restore();
    }

    // ---- Score (HEAD — 20px bold, centered) ----
    ctx.fillStyle=CONFIG.COLORS.textPri;ctx.font=F(20,'bold');
    ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText(this.score,CONFIG.WIDTH/2,8);
    ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(12);
    ctx.fillText(T('hi_score')+' '+this.highScore,CONFIG.WIDTH/2,32);

    // ---- BONUS stack (top-right) ----
    if(this.combo>1){
      const pulse=0.72+0.28*Math.abs(Math.sin(ts*0.004));
      const bx=isRTL()?12:(CONFIG.WIDTH-12);
      const align=rtlAlign('right');
      // Multiplier — HEAD size
      ctx.globalAlpha=pulse;
      ctx.textAlign=align;
      ctx.fillStyle=CONFIG.COLORS.gold;ctx.shadowColor=CONFIG.COLORS.gold;ctx.shadowBlur=10;
      ctx.font=F(20,'bold');
      ctx.fillText('×'+this.combo,bx,8);
      // BONUS label — BODY size, below
      ctx.shadowBlur=0;
      ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(12,'bold');
      ctx.fillText(T('combo'),bx,32);
      ctx.globalAlpha=1;ctx.shadowBlur=0;
    }

    // ---- Wave label (bottom-center — BODY) ----
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(12);
    const wt=this.waves.state==='gap'?(this.waves.wave===0?T('get_ready'):T('wave_in',this.waves.wave+1)):T('wave',this.waves.wave);
    fillTextFit(ctx,wt,CONFIG.WIDTH/2,CONFIG.HEIGHT-30,CONFIG.WIDTH-120,12);
    ctx.restore();
  }

  _drawTouchOverlay(){
    if(!this._isTouchDevice())return;
    const ctx=this.ctx;
    const j=this.input.touch.joystick,s=this.input.touch.shoot;

    ctx.save();

    // ---- Permanent joystick (always visible, bottom-left) ----
    const footerH=22;
    const outerR=52;
    const innerR=22;
    const jbX=outerR+28;                          // fixed center X
    const jbY=CONFIG.HEIGHT-footerH-outerR-14;    // fixed center Y

    // Compute stick position
    let stickX=jbX,stickY=jbY;
    if(j.active){
      const dx=j.curX-j.startX,dy=j.curY-j.startY;
      const dist=Math.hypot(dx,dy);
      const maxR=outerR-innerR;
      const clamp=Math.min(1,maxR/(dist||1));
      stickX=jbX+dx*clamp;
      stickY=jbY+dy*clamp;
    }

    // Outer ring
    ctx.strokeStyle='rgba(255,255,255,0.22)';
    ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(jbX,jbY,outerR,0,Math.PI*2);ctx.stroke();

    // Inner base fill (subtle)
    ctx.fillStyle='rgba(255,255,255,0.04)';
    ctx.beginPath();ctx.arc(jbX,jbY,outerR,0,Math.PI*2);ctx.fill();

    // Cardinal dot guides
    ctx.fillStyle='rgba(255,255,255,0.12)';
    for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0]]){
      ctx.beginPath();ctx.arc(jbX+dx*(outerR-10),jbY+dy*(outerR-10),2,0,Math.PI*2);ctx.fill();
    }

    // Stick knob
    const active=j.active;
    ctx.fillStyle=active?'rgba(255,255,255,0.55)':'rgba(255,255,255,0.28)';
    ctx.shadowColor=active?'rgba(255,255,255,0.4)':'transparent';
    ctx.shadowBlur=active?12:0;
    ctx.beginPath();ctx.arc(stickX,stickY,innerR,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;

    // Stroke on knob
    ctx.strokeStyle=active?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.3)';
    ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(stickX,stickY,innerR,0,Math.PI*2);ctx.stroke();

    // ---- Shoot button (always visible, bottom-right) ----
    const btnR=44,btnX=CONFIG.WIDTH-btnR-24,btnY=CONFIG.HEIGHT-footerH-btnR-14,pressed=s.active;
    ctx.strokeStyle=pressed?CONFIG.COLORS.player:'rgba(255,255,255,0.3)';
    ctx.lineWidth=2.5;
    ctx.beginPath();ctx.arc(btnX,btnY,btnR,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle=pressed?CONFIG.COLORS.player:'rgba(255,255,255,0.08)';
    ctx.shadowColor=pressed?CONFIG.COLORS.player:'transparent';
    ctx.shadowBlur=pressed?20:0;
    ctx.beginPath();ctx.arc(btnX,btnY,btnR,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
    ctx.fillStyle=pressed?CONFIG.COLORS.bg:'rgba(255,255,255,0.8)';
    ctx.font='26px serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('🦆',btnX,btnY-4);
    // "SHOOT" label
    ctx.fillStyle=pressed?CONFIG.COLORS.bg:'rgba(255,255,255,0.6)';
    ctx.font=F(12,'bold');ctx.textBaseline='middle';
    ctx.fillText(T('shoot'),btnX,btnY+btnR-14);

    ctx.restore();
  }

  // ---- GAME OVER ----
  _drawGameOver(ts){
    const ctx=this.ctx;
    this._drawGame(ts);
    ctx.save();ctx.direction=isRTL()?'rtl':'ltr';
    ctx.fillStyle=CONFIG.COLORS.overlay;ctx.fillRect(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);
    const cx=CONFIG.WIDTH/2;

    // Title — playful per language, auto-fits width
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=CONFIG.COLORS.error;ctx.shadowColor=CONFIG.COLORS.error;ctx.shadowBlur=20;
    ctx.font=F(40,'bold');
    const titleY=Math.round(CONFIG.HEIGHT*0.16);
    fillTextFit(ctx,T('seg_fault'),cx,titleY,CONFIG.WIDTH-48,40,'bold');
    ctx.shadowBlur=0;
    ctx.textBaseline='alphabetic';
    ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(12);
    ctx.fillText(T('core_dump'),cx,Math.round(CONFIG.HEIGHT*0.23));

    // Score card
    const scW=Math.min(240,CONFIG.WIDTH*0.55),scH=60,scX=cx-scW/2,scY=Math.round(CONFIG.HEIGHT*0.26);
    this._card(ctx,scX,scY,scW,scH,14);
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(12);
    ctx.fillText(T('score_lbl').toUpperCase(),cx,scY+14);
    ctx.fillStyle=CONFIG.COLORS.textPri;ctx.font=F(20,'bold');
    ctx.fillText(this.score,cx,scY+40);

    // Best
    const bestY=Math.round(CONFIG.HEIGHT*0.38);
    ctx.textBaseline='alphabetic';
    if(this.score>0&&this.score>=this.highScore){
      ctx.fillStyle=CONFIG.COLORS.gold;ctx.font=F(12,'bold');
      fillTextFit(ctx,T('new_hi'),cx,bestY,CONFIG.WIDTH-80,12,'bold');
    } else if(this.highScore>0){
      ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(12);
      ctx.fillText(T('best')+': '+this.highScore,cx,bestY);
    }

    this._drawLeaderboard(ctx);

    const guardElapsed = performance.now() - this._gameOverTs > 600;

    // Restart prompt (flashing)
    if(guardElapsed && Math.floor(ts/600)%2===0){
      ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(12);
      fillTextFit(ctx,this._isTouchDevice()?T('restart_t'):T('restart'),cx,Math.round(CONFIG.HEIGHT*0.88),CONFIG.WIDTH-80,13);
    }

    // "Play as different player" link — always visible after guard
    if(guardElapsed){
      const linkY = Math.round(CONFIG.HEIGHT*0.925);
      const linkText = T('new_player');
      ctx.font = F(11);
      const linkW = Math.min(ctx.measureText(linkText).width + 24, CONFIG.WIDTH - 60);
      const linkX = cx - linkW/2;
      const mx = this.input.mouse.x, my = this.input.mouse.y;
      const linkHov = mx >= linkX && mx <= linkX+linkW && my >= linkY-14 && my <= linkY+4;

      ctx.save();
      ctx.textAlign='center'; ctx.textBaseline='alphabetic';
      ctx.fillStyle = linkHov ? CONFIG.COLORS.textPri : CONFIG.COLORS.textDim;
      ctx.font = F(11);
      fillTextFit(ctx, linkText, cx, linkY, CONFIG.WIDTH-60, 11);
      // Underline
      const tw = Math.min(ctx.measureText(linkText).width, CONFIG.WIDTH-60);
      ctx.strokeStyle = linkHov ? CONFIG.COLORS.textPri : CONFIG.COLORS.textDim;
      ctx.lineWidth = 0.5; ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.moveTo(cx - tw/2, linkY+2); ctx.lineTo(cx + tw/2, linkY+2); ctx.stroke();
      ctx.restore();

      // Hit test — separate from main restart click
      this._newPlayerLinkBounds = { x: linkX, y: linkY-16, w: linkW, h: 20 };
    } else {
      this._newPlayerLinkBounds = null;
    }

    this._vignette(ctx);
    // Credit line
    ctx.save();ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=`10px ${MONO}`;ctx.globalAlpha=0.45;
    ctx.fillText('🦆 Rubber Duck Debugging — a real technique since the 1990s',CONFIG.WIDTH/2,Math.round(CONFIG.HEIGHT*0.945));
    ctx.globalAlpha=1;ctx.restore();
    ctx.restore();

    if(guardElapsed){
      if(this.input.consumeClick()){
        const mx=this.input.mouse.x, my=this.input.mouse.y;
        const b=this._newPlayerLinkBounds;
        if(b && mx>=b.x && mx<=b.x+b.w && my>=b.y && my<=b.y+b.h){
          // New player: clear name, go to name input
          this.playerName='';
          this.input.clearAll();
          this.toNameInput();
        } else {
          this.toPlaying();
        }
      } else if(this.input.consumeAction()){
        this.toPlaying();
      }
    }
  }

  _drawLeaderboard(ctx){
    const TOP_N=10,panelPad=12;
    const lineH=18,myLineH=26;
    const maxVis=Math.min(TOP_N,Math.floor((CONFIG.HEIGHT*0.42)/lineH));
    const myIdx=this.leaderboard.findIndex(e=>e.name===this.playerName&&e.score===this.score);
    const topEntries=this.leaderboard.slice(0,maxVis);
    const showOwnBelow=myIdx>=maxVis;

    const bodyH=topEntries.reduce((s,_,i)=>s+(i===myIdx?myLineH:lineH),0)+(showOwnBelow?lineH+myLineH+8:0)+(this.submittingScore?lineH:0);
    const headerH=26,panelH=headerH+bodyH+panelPad*2;
    const panelW=Math.min(380,CONFIG.WIDTH*0.8),panelX=CONFIG.WIDTH/2-panelW/2,panelY=Math.round(CONFIG.HEIGHT*0.42);

    this._card(ctx,panelX,panelY,panelW,panelH,14);
    const rtl=isRTL();
    const r1=rtl?(panelX+panelW-panelPad-16):(panelX+panelPad+16);
    const r2=rtl?(panelX+panelW-panelPad-40):(panelX+panelPad+40);
    const r3=rtl?(panelX+panelPad+55)        :(panelX+panelW-panelPad-55);
    const r4=rtl?(panelX+panelPad)            :(panelX+panelW-panelPad);
    const inner=panelW-panelPad*2;

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

    let yOff=panelY+headerH+panelPad;
    topEntries.forEach((entry,i)=>{
      const isMe=i===myIdx,rowH=isMe?myLineH:lineH,textY=yOff+rowH*0.72;
      if(isMe){
        ctx.save();this._rr(ctx,panelX+4,yOff,panelW-8,rowH,7);
        ctx.fillStyle='rgba(255,214,10,0.07)';ctx.fill();
        ctx.strokeStyle='rgba(255,214,10,0.2)';ctx.lineWidth=1;ctx.stroke();
        ctx.restore();
      }
      const fs=isMe?13:11;
      ctx.textBaseline='alphabetic';
      ctx.textAlign=rtlAlign('right');ctx.fillStyle=isMe?CONFIG.COLORS.gold:CONFIG.COLORS.textDim;ctx.font=isMe?F(fs,'bold'):F(fs);
      ctx.fillText('#'+(i+1),r1,textY);
      ctx.textAlign=rtlAlign('left');ctx.fillStyle=isMe?CONFIG.COLORS.gold:(i===0?CONFIG.COLORS.textPri:CONFIG.COLORS.textSec);ctx.font=isMe||i===0?F(fs,'bold'):F(fs);
      fillTextFit(ctx,entry.name||'???',r2,textY,panelW*0.38,fs,isMe||i===0?'bold':undefined);
      if(isMe){
        const nw=ctx.measureText(entry.name||'???').width;
        const tx=rtl?(r2-Math.min(nw,panelW*0.38)-5):(r2+Math.min(nw,panelW*0.38)+5);
        ctx.textAlign=rtlAlign('left');ctx.fillStyle='rgba(255,214,10,0.5)';ctx.font=F(12);
        ctx.fillText(T('lb_you'),tx,textY);
      }
      ctx.textAlign=rtlAlign('right');ctx.fillStyle=isMe?CONFIG.COLORS.gold:CONFIG.COLORS.textSec;
      ctx.font=`${isMe?'bold ':''} ${fs}px ${MONO}`;ctx.fillText(entry.score,r3,textY);
      ctx.textAlign=rtlAlign('right');ctx.fillStyle=isMe?'rgba(255,214,10,0.6)':CONFIG.COLORS.textDim;ctx.font=F(isMe?10:9);
      ctx.fillText(T('lb_wave')+' '+(entry.wave||'?'),r4,textY);
      yOff+=rowH;
    });

    if(showOwnBelow){
      const sepY=yOff+4;
      ctx.strokeStyle=CONFIG.COLORS.border;ctx.lineWidth=1;ctx.setLineDash([3,3]);
      ctx.beginPath();ctx.moveTo(panelX+panelPad,sepY);ctx.lineTo(panelX+panelW-panelPad,sepY);ctx.stroke();
      ctx.setLineDash([]);yOff=sepY+4;
      const own=this.leaderboard[myIdx],rowH=myLineH,textY=yOff+rowH*0.72;
      ctx.save();this._rr(ctx,panelX+4,yOff,panelW-8,rowH,7);
      ctx.fillStyle='rgba(255,214,10,0.07)';ctx.fill();
      ctx.strokeStyle='rgba(255,214,10,0.2)';ctx.lineWidth=1;ctx.stroke();ctx.restore();
      ctx.textBaseline='alphabetic';
      ctx.textAlign=rtlAlign('right');ctx.fillStyle=CONFIG.COLORS.gold;ctx.font=F(12,'bold');ctx.fillText('#'+(myIdx+1),r1,textY);
      ctx.textAlign=rtlAlign('left');ctx.fillStyle=CONFIG.COLORS.gold;ctx.font=F(12,'bold');fillTextFit(ctx,own.name||'???',r2,textY,panelW*0.38,12,'bold');
      ctx.textAlign=rtlAlign('right');ctx.fillStyle=CONFIG.COLORS.gold;ctx.font=`bold 13px ${MONO}`;ctx.fillText(own.score,r3,textY);
      ctx.textAlign=rtlAlign('right');ctx.fillStyle='rgba(255,214,10,0.6)';ctx.font=F(12);ctx.fillText(T('lb_wave')+' '+(own.wave||'?'),r4,textY);
    }

    if(!CONFIG.LEADERBOARD_URL){
      ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(12);
      ctx.fillText(T('lb_offline'),CONFIG.WIDTH/2,panelY+panelH-4);
    }
    ctx.restore();
  }
}

// =============================================================================
// Bootstrap
// =============================================================================
window.addEventListener('load', () => { window.game = new Game(); });
