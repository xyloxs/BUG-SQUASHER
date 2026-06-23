/**
 * BUG SQUASHER
 * Rubber duck debugging — taken literally.
 * Vanilla HTML5 Canvas + Web Audio API. Zero dependencies. Zero build step.
 * @author GSE Developer <github@gse.events>
 * @see https://github.com/xyloxs/BUG-SQUASHER
 */
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
  // Difficulty multipliers — set by player on DIFFICULTY screen
  DIFF: { enemySpeed: 1.0, enemyHp: 1.0, waveGap: 1200, shootCooldown: 200, shootCooldownMobile: 340 },
  HS_KEY:          'bugSquasher_hs',
  LANG_KEY:        'bugSquasher_lang',
  SCORES_KEY:      'bugSquasher_scores',
  LEADERBOARD_URL: 'https://gse.events/test/api.php',
  // Firebase path for GSE footer-link click tracking
  CLICK_COUNTER_URL: 'https://gse.events/test/api.php?action=click',
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
    textSec:  '#AEAEB2',   // was #8E8E93 — WCAG AA compliant on dark bg
    textDim:  '#8E8E93',   // was #48484A — improved contrast ratio
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
    diff_title:    'How hard do you want it?',
    diff_easy:     'Easy',     diff_easy_sub:   'Slow start, relaxed pace',
    diff_normal:   'Normal',   diff_normal_sub: 'The intended experience',
    diff_hard:     'Hard',     diff_hard_sub:   'No mercy',
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
    enemy_spider:  'Grandpa with Walker',
    enemy_snake:   'Grandma on Scooter',
    enemy_octopus: 'Grumpy Grandpa',
    enemy_ghost:   'Sleepwalking Granny',
    combo:         'BONUS',
    new_hi:        'New High Score!',
    best:          'Best',
    restart_t:     'Tap to play again',
    restart:       'Click or Space to play again',
    goal_text:     'Defeat all enemies to advance!',
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
    diff_title:    'Wie schwer soll es sein?',
    diff_easy:     'Einfach',  diff_easy_sub:   'Entspannter Einstieg',
    diff_normal:   'Normal',   diff_normal_sub: 'Das volle Erlebnis',
    diff_hard:     'Schwer',   diff_hard_sub:   'Kein Erbarmen',
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
    enemy_spider:  'Opa mit Rollator',
    enemy_snake:   'Oma auf Scooter',
    enemy_octopus: 'Grummeliger Opa',
    enemy_ghost:   'Schlafwandel-Oma',
    combo:         'BONUS',
    goal_text:     'Besiege alle Feinde, um voranzukommen!',
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
    diff_title:    'Quelle difficulté?',
    diff_easy:     'Facile',   diff_easy_sub:   'Début tranquille',
    diff_normal:   'Normal',   diff_normal_sub: "L'expérience complète",
    diff_hard:     'Difficile',diff_hard_sub:   'Sans pitié',
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
    enemy_spider:  'Papi avec déambulateur',
    enemy_snake:   'Mamie en scooter',
    enemy_octopus: 'Papy grincheux',
    enemy_ghost:   'Mamie somnambule',
    combo:         'BONUS',
    goal_text:     'Défaite tous les ennemis pour avancer !',
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
    diff_title:    '¿Qué dificultad?',
    diff_easy:     'Fácil',    diff_easy_sub:   'Inicio relajado',
    diff_normal:   'Normal',   diff_normal_sub: 'La experiencia completa',
    diff_hard:     'Difícil',  diff_hard_sub:   'Sin piedad',
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
    enemy_spider:  'Abuelo con andador',
    enemy_snake:   'Abuela en scooter',
    enemy_octopus: 'Abuelo gruñón',
    enemy_ghost:   'Abuela sonámbula',
    combo:         'BONUS',
    goal_text:     '¡Derrota a todos los enemigos para avanzar!',
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
    diff_title:    'ما مستوى الصعوبة؟',
    diff_easy:     'سهل',      diff_easy_sub:   'بداية هادئة',
    diff_normal:   'عادي',     diff_normal_sub: 'التجربة الكاملة',
    diff_hard:     'صعب',      diff_hard_sub:   'بلا رحمة',
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
    enemy_spider:  'جد بمشاية',
    enemy_snake:   'جدة على سكوتر',
    enemy_octopus: 'جد غاضب',
    enemy_ghost:   'جدة سائرة بالنوم',
    combo:         'BONUS',
    goal_text:     'هزم جميع الأعداء للمضي قدماً!',
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
// Character helpers — Option A (Cartoon Vector with gradients)
// _lighten, _darken, _hexToRgb already defined below — just add new helpers
// =============================================================================
function blendRed(hex,amount){
  const[r,g,b]=_hexToRgb(hex);
  return`rgb(${Math.min(255,Math.round(r+(255-r)*amount*0.8))},${Math.max(0,Math.round(g*(1-amount*0.35)))},${Math.max(0,Math.round(b*(1-amount*0.35)))})`;
}
function _drawWheel(ctx,cx,cy,r){
  ctx.fillStyle='#37474F';ctx.strokeStyle='#546E7A';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='#90A4AE';ctx.beginPath();ctx.arc(cx,cy,r*0.32,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(180,210,220,0.5)';ctx.lineWidth=0.6;
  ctx.beginPath();ctx.moveTo(cx,cy-r*0.55);ctx.lineTo(cx,cy+r*0.55);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-r*0.55,cy);ctx.lineTo(cx+r*0.55,cy);ctx.stroke();
}
function drawDuck_A(ctx,facing,time,squished,moving){
  ctx.save();
  if(squished)ctx.scale(1.0,0.72);
  ctx.shadowColor='rgba(0,0,0,0.35)';ctx.shadowBlur=6;ctx.shadowOffsetX=1;ctx.shadowOffsetY=3;
  // Body
  const bg=ctx.createRadialGradient(-2,-1,2,-2,4,18);
  bg.addColorStop(0,'#FFE84D');bg.addColorStop(0.5,'#FFD60A');bg.addColorStop(1,'#C8860A');
  ctx.fillStyle=bg;ctx.strokeStyle='#B87200';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.ellipse(0,4,14,10,0,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;ctx.stroke();
  // Wings
  ctx.strokeStyle='#B87200';ctx.lineWidth=1.8;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-10,2);ctx.quadraticCurveTo(-16,4,-12,9);ctx.stroke();
  ctx.beginPath();ctx.moveTo(10,2);ctx.quadraticCurveTo(16,4,12,9);ctx.stroke();
  ctx.lineCap='butt';
  // Feet
  if(!squished){
    const wob=Math.sin(time*8)*3;ctx.save();ctx.globalAlpha=0.85;
    ctx.fillStyle='#E65100';ctx.strokeStyle='#7A3000';ctx.lineWidth=0.7;
    for(const[fx,fy]of[[-6,13+Math.abs(wob)*0.4],[4,13-Math.abs(wob)*0.4]]){
      ctx.save();ctx.translate(fx,fy);
      ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-5,4);ctx.quadraticCurveTo(-7,7,-3,6);ctx.lineTo(0,3);ctx.lineTo(3,6);ctx.quadraticCurveTo(7,7,5,4);ctx.lineTo(0,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    }
    ctx.restore();
  }
  // Head
  const hg=ctx.createRadialGradient(5,-11,1,5,-9,11);
  hg.addColorStop(0,'#FFE84D');hg.addColorStop(0.5,'#FFD60A');hg.addColorStop(1,'#C8860A');
  ctx.fillStyle=hg;ctx.strokeStyle='#B87200';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.arc(5,-9,10,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.42)';ctx.beginPath();ctx.arc(1,-14,2.8,0,Math.PI*2);ctx.fill();
  // Bill
  const billg=ctx.createLinearGradient(14,-13,26,-4);
  billg.addColorStop(0,'#FF9500');billg.addColorStop(1,'#C05000');
  ctx.fillStyle=billg;
  ctx.beginPath();ctx.moveTo(12,-11);ctx.quadraticCurveTo(22,-9.5,21,-6);ctx.lineTo(12,-7);ctx.closePath();ctx.fill();
  ctx.fillStyle='#C05000';ctx.beginPath();ctx.moveTo(12,-7);ctx.lineTo(21,-6);ctx.quadraticCurveTo(19,-3,12,-4);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#7A3000';ctx.lineWidth=0.9;
  ctx.beginPath();ctx.moveTo(12,-11);ctx.quadraticCurveTo(22,-9.5,21,-6);ctx.lineTo(12,-4);ctx.stroke();
  // Eye
  ctx.save();ctx.translate(8,-12);
  ctx.fillStyle='#FFFFFF';ctx.shadowColor='rgba(0,0,0,0.2)';ctx.shadowBlur=2;
  ctx.beginPath();ctx.arc(0,0,4.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  const ig=ctx.createRadialGradient(0.3,-0.3,0.5,0,0,4);
  ig.addColorStop(0,'#2979FF');ig.addColorStop(1,'#0D47A1');
  ctx.fillStyle=ig;ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.fill();
  const px=Math.cos(facing-Math.PI*0.05)*1.2,py=Math.sin(facing-Math.PI*0.05)*1.2;
  ctx.fillStyle='#111111';ctx.beginPath();ctx.arc(px,py,1.8,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.9)';ctx.beginPath();ctx.arc(px-0.9,py-0.9,0.75,0,Math.PI*2);ctx.fill();
  ctx.restore();
  ctx.restore();
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
// Color Helpers
// =============================================================================
function _hexToRgb(h){const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return[r,g,b];}
function _lighten(h,f){const[r,g,b]=_hexToRgb(h);return`rgb(${Math.min(255,Math.round(r+f*255))},${Math.min(255,Math.round(g+f*255))},${Math.min(255,Math.round(b+f*255))})`;}
function _darken(h,f){const[r,g,b]=_hexToRgb(h);return`rgb(${Math.max(0,Math.round(r-f*255))},${Math.max(0,Math.round(g-f*255))},${Math.max(0,Math.round(b-f*255))})`;}

// =============================================================================
// Entity
// =============================================================================
const SKIN_TONES=['#FDDBB4','#F1C27D','#E0AC69','#C68642','#8D5524','#4A2912'];
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
    const angle=Math.atan2(this.vy,this.vx);
    ctx.save();
    // Water droplet trail
    for(let i=0;i<this.trail.length;i++){
      const t=i/this.trail.length;
      ctx.globalAlpha=t*0.5;
      ctx.fillStyle=`hsl(${200+i*3},85%,${60+i*3}%)`;
      ctx.beginPath();
      ctx.arc(this.trail[i].x,this.trail[i].y,this.radius*t*0.8,0,Math.PI*2);
      ctx.fill();
    }
    // Main water droplet
    ctx.globalAlpha=1;
    ctx.save();
    ctx.translate(this.x,this.y);
    ctx.rotate(angle);
    // Teardrop shape: elongated in travel direction
    ctx.shadowColor='#4FC3F7';ctx.shadowBlur=10;
    ctx.fillStyle='#29B6F6';
    ctx.beginPath();
    ctx.ellipse(0,0,this.radius*1.4,this.radius*0.8,0,0,Math.PI*2);
    ctx.fill();
    // Highlight
    ctx.shadowBlur=0;
    ctx.fillStyle='rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.ellipse(-1,-1,this.radius*0.5,this.radius*0.3,Math.PI*0.3,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
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
    this.score=0;this.waveNumber=0;
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
    this.shootTimer=window.__isMobile?CONFIG.DIFF.shootCooldownMobile:CONFIG.DIFF.shootCooldown;
    this.squishTimer=100;
    audio.playShoot();
    if(window.__powerUpDoubleShot){
      return[new Bullet(this.x,this.y,this.facing-0.14),new Bullet(this.x,this.y,this.facing+0.14)];
    }
    return new Bullet(this.x,this.y,this.facing);
  }
  takeDamage(audio){
    if(this.invincibleTimer>0)return;
    // Shield absorbs hits
    if(window.__powerUpShield&&window.__powerUpShield.hitsLeft>0){
      window.__powerUpShield.hitsLeft--;
      if(window.__powerUpShield.hitsLeft<=0&&window.__game)delete window.__game.activePowerUps.SHIELD;
      this.invincibleTimer=CONFIG.PLAYER_INVINCIBLE_MS;
      audio.playHurt();return;
    }
    this.hp--;this.invincibleTimer=CONFIG.PLAYER_INVINCIBLE_MS;audio.playHurt();
  }
  draw(ctx){
    if(this.invincibleTimer>0&&Math.floor(this.invincibleTimer/100)%2===0)return;
    ctx.save();ctx.translate(this.x,this.y);
    // Shield ring
    if(window.__powerUpShield&&window.__powerUpShield.hitsLeft>0){
      const p=0.55+0.45*Math.abs(Math.sin(Date.now()*0.004));
      ctx.save();ctx.globalAlpha=p*0.85;
      ctx.strokeStyle='#30D158';ctx.shadowColor='#30D158';ctx.shadowBlur=14;ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(0,0,CONFIG.PLAYER_RADIUS+10,0,Math.PI*2);ctx.stroke();
      if(window.__powerUpShield.hitsLeft>=2){ctx.globalAlpha=p*0.4;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,CONFIG.PLAYER_RADIUS+18,0,Math.PI*2);ctx.stroke();}
      ctx.shadowBlur=0;ctx.restore();
    }
    ctx.translate(0,this.moving?Math.sin(this.time*8)*3:Math.sin(this.time*1.5)*4);
    ctx.rotate(Math.sin(this.time*3)*0.15);
    drawDuck_A(ctx,this.facing,this.time,this.squishTimer>0,this.moving);
    this._drawAccessories(ctx,this.accessoryLevel);
    ctx.restore();
  }
  get accessoryLevel(){
    const s=this.score||0,w=this.waveNumber||0;
    if(s>=1500&&w>=8)return 5;
    if(s>=800 &&w>=6)return 4;
    if(s>=400 &&w>=4)return 3;
    if(s>=150 &&w>=2)return 2;
    return 1;
  }
  _drawAccessories(ctx,level){
    if(level<2)return;
    const _hb=()=>{
      ctx.save();
      const bx=-2,by=-19,bw=20,bh=5;
      ctx.fillStyle='#FF3B30';ctx.shadowColor='#FF3B30';ctx.shadowBlur=5;
      ctx.beginPath();ctx.rect(bx,by,bw,bh);ctx.fill();ctx.shadowBlur=0;
      ctx.fillStyle='rgba(255,255,255,0.25)';ctx.fillRect(bx,by,bw,1.5);
      ctx.fillStyle='rgba(0,0,0,0.22)';ctx.fillRect(bx,by+bh-1.5,bw,1.5);
      ctx.strokeStyle='#FF3B30';ctx.lineWidth=2.5;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(bx,by+1);ctx.quadraticCurveTo(-11,-21,-15,-13);ctx.stroke();
      ctx.beginPath();ctx.moveTo(bx,by+bh-1);ctx.quadraticCurveTo(-10,-16,-14,-9);ctx.stroke();
      ctx.restore();
    };
    const _vest=()=>{
      ctx.save();ctx.globalAlpha=0.48;ctx.fillStyle='#556B2F';
      ctx.beginPath();ctx.moveTo(-3,-5);ctx.lineTo(-14,1);ctx.lineTo(-15,9);ctx.lineTo(-10,15);
      ctx.lineTo(10,15);ctx.lineTo(15,9);ctx.lineTo(14,1);ctx.lineTo(7,-5);
      ctx.quadraticCurveTo(2,-7,-3,-5);ctx.closePath();ctx.fill();
      ctx.globalAlpha=0.6;ctx.strokeStyle='#3A4E1A';ctx.lineWidth=1;ctx.stroke();
      ctx.globalAlpha=0.55;ctx.fillStyle='#445820';ctx.strokeStyle='#2A3A10';ctx.lineWidth=0.8;
      ctx.beginPath();ctx.rect(-12,0,8,5);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.rect(4,1,7,4.5);ctx.fill();ctx.stroke();
      ctx.globalAlpha=1;ctx.restore();
    };
    const _bandolier=()=>{
      ctx.save();
      ctx.strokeStyle='#5C3317';ctx.lineWidth=2.2;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(-7,-3);ctx.lineTo(13,9);ctx.stroke();
      const casings=[[-5.5,-1.5],[-1.5,1],[2,3.5],[5.5,5.5],[9,7.2],[12,8.5]];
      for(const[bx,by]of casings){
        ctx.fillStyle='#FFD700';ctx.shadowColor='#D4AF00';ctx.shadowBlur=3;
        ctx.beginPath();ctx.arc(bx,by,2.2,0,Math.PI*2);ctx.fill();
        ctx.shadowBlur=0;ctx.fillStyle='#A67C00';
        ctx.beginPath();ctx.arc(bx-0.8,by-0.8,1.1,0,Math.PI*2);ctx.fill();
      }
      ctx.shadowBlur=0;ctx.restore();
    };
    const _rambo=()=>{
      ctx.save();
      ctx.strokeStyle='#1A0800';ctx.lineWidth=3;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(5,-17);ctx.quadraticCurveTo(9.5,-21.5,16,-17.5);ctx.stroke();
      ctx.lineWidth=1.4;ctx.globalAlpha=0.5;
      ctx.beginPath();ctx.moveTo(7.5,-16);ctx.quadraticCurveTo(10,-18.5,13,-16.5);ctx.stroke();
      ctx.globalAlpha=1;
      ctx.translate(10,-13);
      ctx.fillStyle='white';ctx.beginPath();ctx.ellipse(0,0.6,3.6,2.6,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(30,10,0,0.25)';ctx.beginPath();ctx.ellipse(0,-0.5,3.6,1.8,0,Math.PI,Math.PI*2);ctx.fill();
      const px=Math.cos(this.facing)*1.0,py=Math.sin(this.facing)*1.0;
      ctx.fillStyle='#080808';ctx.beginPath();ctx.arc(px,py+0.6,2.7,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.65)';ctx.beginPath();ctx.arc(px-0.8,py-0.2,0.9,0,Math.PI*2);ctx.fill();
      ctx.restore();
      // dog tag
      ctx.save();ctx.globalAlpha=0.72;ctx.strokeStyle='#C8C8C8';ctx.lineWidth=0.9;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(3,-4);ctx.quadraticCurveTo(1,0,4,2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(4,2);ctx.quadraticCurveTo(7,4,5,6);ctx.stroke();
      ctx.fillStyle='#D4D4D4';ctx.strokeStyle='#A0A0A0';ctx.lineWidth=0.7;ctx.shadowColor='#888';ctx.shadowBlur=2;
      ctx.beginPath();ctx.roundRect(3,6,5.5,3.5,0.8);ctx.fill();ctx.shadowBlur=0;ctx.stroke();
      ctx.globalAlpha=1;ctx.restore();
    };
    _hb();
    if(level>=4)_vest();
    if(level>=3)_bandolier();
    if(level>=5)_rambo();
  }
}

// =============================================================================
// Spider — Grandpa with Walker
// =============================================================================
class Spider extends Entity {
  constructor(x,y,speed){
    super(x,y,14);
    this.hp=3;this.speed=speed!==undefined?speed:(110+Math.random()*40);
    this.legPhase=Math.random()*Math.PI*2;this.color=CONFIG.COLORS.spider;
    this.skinTone=SKIN_TONES[Math.floor(Math.random()*SKIN_TONES.length)];
  }
  update(dt,player){
    const dx=player.x-this.x,dy=player.y-this.y,d=Math.hypot(dx,dy)||1;
    this.vx=(dx/d)*this.speed;this.vy=(dy/d)*this.speed;
    this.x+=this.vx*dt*0.001;this.y+=this.vy*dt*0.001;this.legPhase+=dt*0.008;
    if(this.x<-100||this.x>CONFIG.WIDTH+100||this.y<-100||this.y>CONFIG.HEIGHT+100)this.dead=true;
  }
  draw(ctx){
    ctx.save();ctx.translate(this.x,this.y);
    ctx.scale(1.8,1.8); // larger for readability
    const fa=Math.atan2(this.vy,this.vx);
    const bounce=Math.sin(this.legPhase*2)*1.2;
    const skin=this.skinTone;
    const fwdX=Math.cos(fa),fwdY=Math.sin(fa);
    const perpX=Math.cos(fa+Math.PI/2),perpY=Math.sin(fa+Math.PI/2);

    // Body — solid cardigan
    ctx.fillStyle='#8B7355';ctx.strokeStyle='#1A1A1A';ctx.lineWidth=1.2;
    ctx.beginPath();ctx.ellipse(0,4+bounce,9,7,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    // Cardigan button line
    ctx.strokeStyle='#5A4025';ctx.lineWidth=0.8;
    ctx.beginPath();ctx.moveTo(0,0+bounce);ctx.lineTo(0,10+bounce);ctx.stroke();

    // Head — solid skin tone, big enough to read
    ctx.fillStyle=skin;ctx.strokeStyle='#1A1A1A';ctx.lineWidth=1.2;
    ctx.beginPath();ctx.arc(0,-6+bounce,8,0,Math.PI*2);ctx.fill();ctx.stroke();
    // Highlight dot
    ctx.fillStyle='rgba(255,255,255,0.4)';ctx.beginPath();ctx.arc(-3,-10+bounce,2,0,Math.PI*2);ctx.fill();

    // White hair wisps
    ctx.strokeStyle='#E0E0E0';ctx.lineWidth=2.5;ctx.lineCap='round';
    for(let i=-1;i<=1;i++){ctx.beginPath();ctx.arc(i*4,-14+bounce,4,Math.PI*1.05,Math.PI*1.95);ctx.stroke();}
    ctx.lineCap='butt';

    // Glasses — thick dark frames for readability
    ctx.strokeStyle='#222';ctx.lineWidth=1.4;
    ctx.beginPath();ctx.arc(-3,-6+bounce,2.5,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.arc(3,-6+bounce,2.5,0,Math.PI*2);ctx.stroke();
    ctx.lineWidth=0.9;ctx.beginPath();ctx.moveTo(-0.5,-6+bounce);ctx.lineTo(0.5,-6+bounce);ctx.stroke();
    ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-3,-6+bounce,1.2,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(3,-6+bounce,1.2,0,Math.PI*2);ctx.fill();

    // Eyebrows
    ctx.strokeStyle='#888';ctx.lineWidth=1.4;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(-5.5,-9.5+bounce);ctx.lineTo(-0.5,-8+bounce);ctx.stroke();
    ctx.beginPath();ctx.moveTo(5.5,-9.5+bounce);ctx.lineTo(0.5,-8+bounce);ctx.stroke();
    ctx.lineCap='butt';

    // Arms
    ctx.strokeStyle=skin;ctx.lineWidth=2.5;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(perpX*8,perpY*8+bounce);ctx.lineTo(perpX*8+fwdX*7,perpY*8+fwdY*7+bounce*0.5);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-perpX*8,-perpY*8+bounce);ctx.lineTo(-perpX*8+fwdX*7,-perpY*8+fwdY*7+bounce*0.5);ctx.stroke();
    ctx.lineCap='butt';

    // Walker — solid silver, no gradients
    ctx.save();ctx.translate(fwdX*12,fwdY*12+bounce*0.4);ctx.rotate(fa-Math.PI/2);
    ctx.strokeStyle='#A0B8C0';ctx.lineWidth=2;ctx.lineCap='round';ctx.lineJoin='round';
    const wW=9,wH=8;
    ctx.beginPath();ctx.moveTo(-wW,-wH);ctx.lineTo(-wW,2);ctx.arc(0,2,wW,Math.PI,0);ctx.lineTo(wW,-wH);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-wW,-wH);ctx.lineTo(wW,-wH);ctx.stroke();
    ctx.lineWidth=1.4;
    const ll=3.5+Math.abs(Math.sin(this.legPhase))*1.8;
    for(const lx of[-wW,wW]){ctx.beginPath();ctx.moveTo(lx,2);ctx.lineTo(lx,2+ll);ctx.stroke();}
    ctx.restore();
    ctx.restore();
  }
}

// =============================================================================
// Snake — Grandma on Mobility Scooter
// =============================================================================
class Snake extends Entity {
  constructor(x,y,player,speed){
    super(x,y,10);
    this.hp=1;this.speed=speed!==undefined?speed:(290+Math.random()*80);
    this.sinePhase=0;this.baseAngle=Math.atan2(player.y-y,player.x-x);
    this.color=CONFIG.COLORS.snake;this.spineX=x;this.spineY=y;
    this.skinTone=SKIN_TONES[Math.floor(Math.random()*SKIN_TONES.length)];
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
    ctx.rotate(this.baseAngle);
    ctx.rotate(Math.sin(this.sinePhase)*0.2);
    ctx.scale(1.8,1.8); // larger for readability
    const skin=this.skinTone;
    const speed=Math.abs(Math.cos(this.sinePhase));

    // Speed lines
    if(speed>0.55){
      ctx.save();ctx.lineCap='round';
      for(let i=0;i<3;i++){ctx.globalAlpha=0.15+i*0.08;ctx.strokeStyle='#FFF';ctx.lineWidth=0.9;ctx.beginPath();ctx.moveTo(-10-i*3,(i-1)*3.5);ctx.lineTo(-16-i*3,(i-1)*3.5);ctx.stroke();}
      ctx.restore();
    }

    // Wheels
    _drawWheel(ctx,-8,5,4);_drawWheel(ctx,8,5,4);

    // Scooter body — solid pink
    ctx.fillStyle='#F48FB1';ctx.strokeStyle='#1A1A1A';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(-7,0);ctx.lineTo(7,0);ctx.arcTo(10,0,10,3,3);ctx.lineTo(10,4);ctx.arcTo(10,7,7,7,3);ctx.lineTo(-7,7);ctx.arcTo(-10,7,-10,4,3);ctx.lineTo(-10,3);ctx.arcTo(-10,0,-7,0,3);ctx.closePath();ctx.fill();ctx.stroke();
    // Handlebar
    ctx.strokeStyle='#9E9E9E';ctx.lineWidth=1.3;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(6,-1);ctx.lineTo(6,-5.5);ctx.stroke();
    ctx.beginPath();ctx.moveTo(3.5,-5.5);ctx.lineTo(8.5,-5.5);ctx.stroke();
    ctx.lineCap='butt';

    // Body — solid purple
    ctx.fillStyle='#7B1FA2';ctx.strokeStyle='#1A1A1A';ctx.lineWidth=1;
    ctx.beginPath();ctx.ellipse(-1,-4,5,6,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    // Arms
    ctx.strokeStyle=skin;ctx.lineWidth=1.4;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(2,-4);ctx.quadraticCurveTo(5,-4,6,-5.5);ctx.stroke();
    ctx.lineCap='butt';

    // Head — solid skin
    ctx.fillStyle=skin;ctx.strokeStyle='#1A1A1A';ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(-1,-12,5,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.35)';ctx.beginPath();ctx.arc(-2.5,-14,1.5,0,Math.PI*2);ctx.fill();

    // Hair bun — solid white
    ctx.fillStyle='#EEEEEE';ctx.strokeStyle='#888';ctx.lineWidth=0.8;
    ctx.beginPath();ctx.arc(-3.5,-16.5,3,0,Math.PI*2);ctx.fill();ctx.stroke();

    // Gold glasses
    ctx.strokeStyle='#FFC107';ctx.lineWidth=1;ctx.lineCap='round';
    ctx.beginPath();ctx.arc(-3,-12,2,Math.PI*0.8,Math.PI*2.2);ctx.stroke();
    ctx.beginPath();ctx.arc(0.5,-12,2,Math.PI*0.8,Math.PI*2.2);ctx.stroke();
    ctx.lineCap='butt';
    ctx.fillStyle='#222';ctx.beginPath();ctx.arc(-3,-12,0.9,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(0.5,-12,0.9,0,Math.PI*2);ctx.fill();

    ctx.restore();
  }
}

// =============================================================================
// Octopus — Grumpy Grandpa with Cane
// =============================================================================
class Octopus extends Entity {
  constructor(x,y){
    super(x,y,16);
    this.hp=5;this.orbitAngle=Math.atan2(y-CONFIG.HEIGHT/2,x-CONFIG.WIDTH/2);
    this.orbitRadius=Math.min(CONFIG.WIDTH,CONFIG.HEIGHT)*0.42;
    this.orbitSpeed=0.65+Math.random()*0.3;
    this.chargeTimer=1400+Math.random()*800;
    this.charging=false;this.chargeVx=0;this.chargeVy=0;this.chargeDuration=0;
    this.tentaclePhase=Math.random()*Math.PI*2;this.color=CONFIG.COLORS.octopus;
    this.skinTone=SKIN_TONES[Math.floor(Math.random()*SKIN_TONES.length)];
  }
  update(dt,player){
    this.tentaclePhase+=dt*0.004;
    if(this.charging){
      this.x+=this.chargeVx*dt*0.001;this.y+=this.chargeVy*dt*0.001;
      this.chargeVx+=(player.x-this.x)*0.05;this.chargeVy+=(player.y-this.y)*0.05;
      this.chargeDuration-=dt;
      if(this.chargeDuration<=0){this.charging=false;this.chargeTimer=1400+Math.random()*800;this.orbitAngle=Math.atan2(this.y-CONFIG.HEIGHT/2,this.x-CONFIG.WIDTH/2);}
    } else {
      this.orbitRadius=Math.min(CONFIG.WIDTH,CONFIG.HEIGHT)*0.42;
      this.orbitAngle+=this.orbitSpeed*dt*0.001;
      this.x=CONFIG.WIDTH/2+Math.cos(this.orbitAngle)*this.orbitRadius;
      this.y=CONFIG.HEIGHT/2+Math.sin(this.orbitAngle)*this.orbitRadius;
      this.chargeTimer-=dt;
      if(this.chargeTimer<=0){this.charging=true;const dx=player.x-this.x,dy=player.y-this.y,d=Math.hypot(dx,dy)||1;this.chargeVx=(dx/d)*340;this.chargeVy=(dy/d)*340;this.chargeDuration=900;}
    }
  }
  draw(ctx){
    ctx.save();ctx.translate(this.x,this.y);
    ctx.scale(1.8,1.8); // larger for readability
    const skin=this.skinTone;
    const activeSkin=this.charging?blendRed(skin,0.28):skin;
    const amp=this.charging?15:9;

    // 6 flailing arms — no gradients
    ctx.lineCap='round';
    for(let i=0;i<6;i++){
      const a=(i/6)*Math.PI*2;
      const w=Math.sin(this.tentaclePhase+i*1.05)*amp;
      ctx.strokeStyle=activeSkin;ctx.lineWidth=3.5-i*0.2;
      ctx.beginPath();ctx.moveTo(0,4);
      ctx.quadraticCurveTo(Math.cos(a+0.5)*16+w,Math.sin(a+0.5)*16,Math.cos(a)*24,Math.sin(a)*24);ctx.stroke();
    }
    ctx.lineCap='butt';

    // Cane
    const cA=(1/6)*Math.PI*2,cX=Math.cos(cA)*22,cY=Math.sin(cA)*22;
    ctx.strokeStyle='#6D4C41';ctx.lineWidth=2.8;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(cX,cY);ctx.lineTo(cX+3,cY+14);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cX,cY);ctx.quadraticCurveTo(cX+8,cY-7,cX+5,cY);ctx.stroke();
    ctx.lineCap='butt';

    // Body — solid skin
    ctx.fillStyle=activeSkin;ctx.strokeStyle='#1A1A1A';ctx.lineWidth=1.2;
    ctx.beginPath();ctx.arc(0,4,13,0,Math.PI*2);ctx.fill();ctx.stroke();

    // Vest — solid brown
    ctx.fillStyle='#5D4037';ctx.beginPath();ctx.ellipse(0,6,9,11,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#4E342E';
    ctx.beginPath();ctx.moveTo(-2,-1);ctx.lineTo(-8,6);ctx.lineTo(0,5);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(2,-1);ctx.lineTo(8,6);ctx.lineTo(0,5);ctx.closePath();ctx.fill();

    // Head — solid skin
    ctx.fillStyle=activeSkin;ctx.strokeStyle='#1A1A1A';ctx.lineWidth=1.2;
    ctx.beginPath();ctx.arc(0,-13,9,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.35)';ctx.beginPath();ctx.arc(-3,-17,2.5,0,Math.PI*2);ctx.fill();

    // White wisps
    ctx.strokeStyle='#E0E0E0';ctx.lineWidth=2.2;ctx.lineCap='round';
    ctx.beginPath();ctx.arc(-8,-14,4,Math.PI*1.1,Math.PI*1.75);ctx.stroke();
    ctx.beginPath();ctx.arc(8,-14,4,Math.PI*1.25,Math.PI*1.9);ctx.stroke();
    ctx.lineCap='butt';

    // Eyes + brows
    ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-3,-13,1.8,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(3,-13,1.8,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=this.charging?'#FF1111':'#5D4037';ctx.lineWidth=2;ctx.lineCap='round';
    if(this.charging){
      ctx.beginPath();ctx.moveTo(-6,-17);ctx.lineTo(-2,-15);ctx.stroke();
      ctx.beginPath();ctx.moveTo(6,-17);ctx.lineTo(2,-15);ctx.stroke();
    } else {
      ctx.beginPath();ctx.moveTo(-6,-16.5);ctx.lineTo(-1.5,-16.5);ctx.stroke();
      ctx.beginPath();ctx.moveTo(6,-16.5);ctx.lineTo(1.5,-16.5);ctx.stroke();
    }
    ctx.lineCap='butt';
    ctx.strokeStyle='#5D4037';ctx.lineWidth=1.6;
    ctx.beginPath();ctx.arc(0,-9.5,3,0,Math.PI,false);ctx.stroke();

    if(this.charging){
      ctx.save();ctx.globalAlpha=0.5;ctx.strokeStyle='#FF6B35';ctx.lineWidth=2.5;
      ctx.beginPath();ctx.arc(0,0,17,0,Math.PI*2);ctx.stroke();ctx.restore();
    }
    ctx.restore();
  }
}

// =============================================================================
// Ghost — Grandma Ghost in Nightgown
// =============================================================================
class Ghost extends Entity {
  constructor(x,y){
    super(x,y,14);
    this.hp=3;this.speed=65+Math.random()*25;
    this.floatPhase=Math.random()*Math.PI*2;this.color=CONFIG.COLORS.ghost;
    this.skinTone=SKIN_TONES[Math.floor(Math.random()*SKIN_TONES.length)];
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
    ctx.scale(1.8,1.8); // larger for readability
    const pulse=0.5+0.5*Math.sin(this.floatPhase*2);
    const bob=Math.sin(this.floatPhase)*5;
    ctx.translate(0,bob);
    ctx.globalAlpha=0.65;
    ctx.shadowColor='#FAFAFA';ctx.shadowBlur=10+pulse*8;

    // Nightgown silhouette — solid cream
    ctx.fillStyle='#FAFAFA';ctx.strokeStyle='rgba(180,200,240,0.6)';ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(0,-4,13,Math.PI,0);
    for(let i=0;i<=6;i++)ctx.lineTo(-13+(i/6)*26,9+Math.sin(i*Math.PI+this.floatPhase*2.5)*4);
    ctx.closePath();ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;

    // Arms
    ctx.strokeStyle='#EEEEEE';ctx.lineWidth=2.5;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(-12,-1);ctx.quadraticCurveTo(-20,-7,-23,-3);ctx.stroke();
    ctx.beginPath();ctx.moveTo(12,-1);ctx.quadraticCurveTo(20,-7,23,-3);ctx.stroke();

    // Head — solid skin
    ctx.shadowColor='#FAFAFA';ctx.shadowBlur=8;
    ctx.fillStyle=this.skinTone;ctx.strokeStyle='rgba(0,0,0,0.1)';ctx.lineWidth=0.7;
    ctx.beginPath();ctx.arc(0,-18,9,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;

    // Pink curlers — 4 circles
    ctx.fillStyle='#FF9FC0';ctx.strokeStyle='#E0608A';ctx.lineWidth=0.8;
    for(const cx of[-7.5,-2.5,2.5,7.5]){ctx.beginPath();ctx.arc(cx,-26,2.5,0,Math.PI*2);ctx.fill();ctx.stroke();}

    // Eyes — big hollow ovals
    ctx.globalAlpha=0.85;ctx.fillStyle='#1A1A2E';
    ctx.beginPath();ctx.ellipse(-3.5,-18,3,4,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(3.5,-18,3,4,0,0,Math.PI*2);ctx.fill();

    // Surprised O mouth
    ctx.beginPath();ctx.ellipse(0,-13,2.5,3,0,0,Math.PI*2);ctx.fill();

    ctx.globalAlpha=1;ctx.restore();
  }
}

// =============================================================================
// Power-Up System
// =============================================================================
const POWERUP_TYPES={DOUBLE_SHOT:'DOUBLE_SHOT',WATER_HOSE:'WATER_HOSE',SHIELD:'SHIELD',TIME_SLOW:'TIME_SLOW'};
const POWERUP_COLORS={
  DOUBLE_SHOT:{primary:'#29B6F6',secondary:'#E1F5FE',glow:'#29B6F6'},
  WATER_HOSE: {primary:'#00BCD4',secondary:'#80DEEA',glow:'#00E5FF'},
  SHIELD:     {primary:'#30D158',secondary:'#CCFF90',glow:'#30D158'},
  TIME_SLOW:  {primary:'#64D2FF',secondary:'#B3E5FC',glow:'#40C4FF'},
};
class PowerUp {
  constructor(x,y,type){
    this.x=x;this.y=y;this.type=type;
    this.radius=20;this.angle=Math.random()*Math.PI*2;
    this.spinSpeed=1.4+Math.random()*0.6;this.bobPhase=Math.random()*Math.PI*2;
    this.pulsePhase=0;this.lifeTimer=12000;this.dead=false;
  }
  update(dt){
    if(this.dead)return;
    const s=dt*0.001;
    this.angle+=this.spinSpeed*s;this.bobPhase+=s*2.4;this.pulsePhase+=s*3.2;
    this.lifeTimer-=dt;if(this.lifeTimer<=0)this.dead=true;
  }
  draw(ctx){
    if(this.dead)return;
    const col=POWERUP_COLORS[this.type];
    const bob=Math.sin(this.bobPhase)*4;
    const pulse=0.7+0.3*Math.abs(Math.sin(this.pulsePhase));
    if(this.lifeTimer<2000&&Math.floor(this.lifeTimer/200)%2===0)return;
    ctx.save();ctx.translate(this.x,this.y+bob);
    // Outer glow ring
    ctx.globalAlpha=pulse*0.35;ctx.shadowColor=col.glow;ctx.shadowBlur=18;
    ctx.strokeStyle=col.glow;ctx.lineWidth=2.5;
    ctx.beginPath();ctx.arc(0,0,this.radius+6,0,Math.PI*2);ctx.stroke();
    ctx.shadowBlur=0;ctx.globalAlpha=1;
    // Type-specific spinning shape
    ctx.save();ctx.rotate(this.angle);
    if(this.type===POWERUP_TYPES.DOUBLE_SHOT){
      ctx.shadowColor=col.glow;ctx.shadowBlur=10;
      for(const ox of[-7,7]){
        ctx.save();ctx.translate(ox,0);
        ctx.fillStyle=col.primary;ctx.beginPath();ctx.ellipse(0,6,5,10,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=col.secondary;ctx.beginPath();ctx.ellipse(-1.5,2,2,3.5,-0.4,0,Math.PI*2);ctx.fill();
        ctx.restore();
      }
      ctx.shadowBlur=0;
    } else if(this.type===POWERUP_TYPES.WATER_HOSE){
      ctx.shadowColor=col.glow;ctx.shadowBlur=12;
      ctx.strokeStyle=col.primary;ctx.lineWidth=2.2;ctx.lineCap='round';
      for(const a of[-0.5,-0.25,0,0.25,0.5]){
        ctx.beginPath();ctx.moveTo(0,4);ctx.quadraticCurveTo(Math.cos(a)*8,-(Math.sin(a)*8)-3,Math.cos(a)*17,-Math.sin(a)*17);ctx.stroke();
      }
      ctx.fillStyle=col.secondary;ctx.shadowBlur=6;ctx.beginPath();ctx.arc(0,4,4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    } else if(this.type===POWERUP_TYPES.SHIELD){
      ctx.shadowColor=col.glow;ctx.shadowBlur=10;
      ctx.strokeStyle=col.primary;ctx.lineWidth=2.5;ctx.fillStyle='rgba(48,209,88,0.18)';
      ctx.beginPath();
      for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2-Math.PI/6;i===0?ctx.moveTo(Math.cos(a)*16,Math.sin(a)*16):ctx.lineTo(Math.cos(a)*16,Math.sin(a)*16);}
      ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle=col.secondary;ctx.lineWidth=1.5;ctx.globalAlpha=0.6;
      ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(0,8);ctx.stroke();
      ctx.beginPath();ctx.moveTo(-8,0);ctx.lineTo(8,0);ctx.stroke();
      ctx.globalAlpha=1;ctx.shadowBlur=0;
    } else if(this.type===POWERUP_TYPES.TIME_SLOW){
      ctx.shadowColor=col.glow;ctx.shadowBlur=12;
      ctx.strokeStyle=col.primary;ctx.lineWidth=2;ctx.fillStyle='rgba(100,210,255,0.12)';
      ctx.beginPath();ctx.arc(0,0,16,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.strokeStyle=col.secondary;ctx.lineWidth=2;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(4,-10);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-7,-8);ctx.stroke();
      ctx.fillStyle=col.primary;ctx.beginPath();ctx.arc(0,0,2.5,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;ctx.lineCap='butt';
    }
    ctx.restore();
    // Label
    ctx.fillStyle='#FFFFFF';ctx.font=`bold 9px ${SYS}`;ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.globalAlpha=0.9;
    ctx.fillText({DOUBLE_SHOT:'2×',WATER_HOSE:'≋',SHIELD:'◈',TIME_SLOW:'⧖'}[this.type],0,0);
    ctx.globalAlpha=1;ctx.restore();
  }
  isCollected(px,py){return Math.hypot(this.x-px,this.y-py)<this.radius+CONFIG.PLAYER_RADIUS;}
}
// =============================================================================
class WaveManager {
  constructor(){this.wave=0;this.state='gap';this.gapTimer=CONFIG.DIFF.waveGap||1500;this.spawnQueue=[];this.enemiesThisWave=0;this.waveCleared=false;}
  update(dt,enemies,audio){
    this.waveCleared=false;
    if(this.state==='gap'){this.gapTimer-=dt;if(this.gapTimer<=0){this.wave++;this._buildWave();this.state='active';}return;}
    if(this.spawnQueue.length>0){
      this.spawnQueue[0].timer-=dt;
      if(this.spawnQueue[0].timer<=0){const e=this.spawnQueue.shift();enemies.push(this._spawnEnemy(e.type,e.player,e.wave));}
    }
    if(this.spawnQueue.length===0&&enemies.length===0){this.state='gap';this.gapTimer=CONFIG.DIFF.waveGap;this.waveCleared=true;audio.playWaveClear();}
  }
  _buildWave(){
    const w=this.wave,types=[];
    const mob=window.__isMobile?1.4:1.0; // 40% more enemies on mobile

    // Wave 1: only 2 Spiders. Snakes from wave 3.
    const nSp = w===1 ? Math.round(2*mob) : Math.min(Math.round((2+w)*mob),14);
    const nSn = w < 3  ? 0 : Math.max(0,Math.round((w-2)*mob));
    const nOc=Math.max(0,Math.round(Math.floor((w-1)/2)*mob));
    const nGh=Math.max(0,Math.round(Math.floor((w-2)/3)*mob));
    for(let i=0;i<nSp;i++)types.push('Spider');
    for(let i=0;i<nSn;i++)types.push('Snake');
    for(let i=0;i<nOc;i++)types.push('Octopus');
    for(let i=0;i<nGh;i++)types.push('Ghost');
    for(let i=types.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[types[i],types[j]]=[types[j],types[i]];}
    // Include wave number so progressive speed is applied at spawn time
    this.spawnQueue=types.map((type,i)=>({type,timer:i*160,player:null,wave:w}));
    this.enemiesThisWave=types.length;
  }
  _spawnEnemy(type,playerRef,waveNum){
    const pos=this._edgePosition(),p=playerRef||{x:CONFIG.WIDTH/2,y:CONFIG.HEIGHT/2};
    const w=waveNum||1;
    // Progressive speed: baseSpeed * (1 + (wave-1) * 0.15)
    // Wave 1=base(80 Spider / 160 Snake), wave 5=1.6x, wave 10=2.35x
    const scaleFactor=1+(w-1)*0.15;
    let e;
    if(type==='Spider'){
      e=new Spider(pos.x,pos.y,80*scaleFactor);
    } else if(type==='Snake'){
      e=new Snake(pos.x,pos.y,p,160*scaleFactor);
    } else if(type==='Octopus'){
      e=new Octopus(pos.x,pos.y);
    } else {
      e=new Ghost(pos.x,pos.y);
    }
    // Apply difficulty + mobile scaling
    e.hp = Math.ceil(e.hp * CONFIG.DIFF.enemyHp * (window.__isMobile ? 1.4 : 1.0));
    if(e.speed !== undefined) e.speed *= CONFIG.DIFF.enemySpeed;
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
    // First visit: must confirm language. Return visitor: skip LANG_SELECT.
    this.state=this._hasConfirmedLang()?'INTRO':'LANG_SELECT';
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
    this._langCards=[];this._newPlayerLinkBounds=null;this._diffCards=[];this._selectedDiff='normal';
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
  _hasConfirmedLang(){ return !!localStorage.getItem(CONFIG.LANG_KEY); }
  _setLang(code){this.lang=code;window.__bsLang=code;localStorage.setItem(CONFIG.LANG_KEY,code);}

  // ---- Name input ----
  _wireNameInput(){
    if(!this.nameEl)return;
    this.nameEl.addEventListener('keydown',e=>{
      if(e.key==='Enter'){e.preventDefault();const v=this.nameEl.value.trim();if(v){this.playerName=v;this._hideNameInput();this.toMenu();}}
      if(e.key==='Escape'){this._hideNameInput();this.toDifficulty();}
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
  toIntro()       {this.state='INTRO';this._introTs=0;}
  toLangSelect()  {this._hideNameInput();this.state='LANG_SELECT';}
  toDifficulty()  {this.state='DIFFICULTY';this._diffCards=[];}
  toNameInput()   {this._showNameInput();this.state='NAME_INPUT';}
  toMenu()      {this._hideNameInput();this.state='MENU';}
  toPlaying(){
    this.score=0;this.combo=1;this.comboTimer=0;
    this.enemies=[];this.bullets=[];this.ps=new ParticleSystem();this.waves=new WaveManager();
    this.player=new Player(CONFIG.WIDTH/2,CONFIG.HEIGHT/2);
    this.lives=3;
    this.shakeX=0;this.shakeY=0;this.scoreSubmitted=false;
    this._shootHint={active:true,timer:0};
    this._hasKilled=false;
    // Tutorial overlay — shown once per install
    this._tutDone=!!localStorage.getItem('bugSquasher_tutDone');
    this._tutTimer=0;  // ms elapsed since wave 1 became active
    this._goalShown=false;
    this._goalTimer=0;
    this._comboFloaters=[];this._waveAnnounce=null;this._prevWaveState='gap';
    this._bonusPopup=null;
    this._activePowerup=null;
    this.powerUps=[];
    this.activePowerUps={};
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
  // Called when player HP hits 0. Costs 1 life; if lives remain, respawn with full HP + 2s invincibility.
  _loseLife(){
    this.lives=Math.max(0,this.lives-1);
    if(this.lives<=0){this.toGameOver();return;}
    this.player.hp=CONFIG.PLAYER_MAX_HP;
    this.activePowerUps={};
    this.player.invincibleTimer=2000; // 2s respawn invincibility
    this.player.x=CONFIG.WIDTH/2;
    this.player.y=CONFIG.HEIGHT/2;
    this._shake(12);
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
      // Works with both PHP api.php and Firebase .json endpoints
      const url=CONFIG.LEADERBOARD_URL.endsWith('.json')?CONFIG.LEADERBOARD_URL:CONFIG.LEADERBOARD_URL;
      const endpoint=CONFIG.LEADERBOARD_URL.includes('firebaseio')?url+'.json':url;
      await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:this.playerName,score:this.score,wave:this.waves.wave,
          lang:this.lang,touch:this._isTouchDevice()})});
      this.scoreSubmitted=true;
    }catch(e){}
    this.submittingScore=false;await this._fetchLeaderboard();
  }
  async _fetchLeaderboard(){
    if(!CONFIG.LEADERBOARD_URL)return;
    try{
      const isFirebase=CONFIG.LEADERBOARD_URL.includes('firebaseio');
      const url=isFirebase
        ?CONFIG.LEADERBOARD_URL+'.json?orderBy="score"&limitToLast=20'
        :CONFIG.LEADERBOARD_URL+'?limit=20';
      const r=await fetch(url);
      const data=await r.json();
      if(data&&Array.isArray(data)){
        // PHP returns array directly
        this.leaderboard=data.sort((a,b)=>b.score-a.score).slice(0,20);
      } else if(data&&typeof data==='object'){
        // Firebase returns object
        this.leaderboard=Object.values(data).sort((a,b)=>b.score-a.score).slice(0,20);
      }
    }catch(e){}
  }

  // ---- Update ----
  _update(dt){
    if(this.input.consumePause()){this.toPaused();return;}
    this.waves.injectPlayer(this.player);
    // Power-up flags for Player methods
    window.__powerUpDoubleShot = !!this.activePowerUps.DOUBLE_SHOT;
    window.__powerUpShield     = this.activePowerUps.SHIELD || null;
    window.__game              = this;

    // Shoot — Water Hose forces continuous fire at 35ms cooldown
    if(this.activePowerUps.WATER_HOSE){
      this.player.shootTimer=Math.min(this.player.shootTimer,35);
      if(this.player.shootTimer<=0){
        const res=this.player.tryShoot(this.audio);
        if(res){const arr=Array.isArray(res)?res:[res];for(const b of arr)this.bullets.push(b);}
      }
    } else if(this.input.isShootingHeld()){
      const res=this.player.tryShoot(this.audio);
      if(res){const arr=Array.isArray(res)?res:[res];for(const b of arr)this.bullets.push(b);}
    }
    this.player.update(dt,this.input);
    this.player.score=this.score;
    this.player.waveNumber=this.waves.wave;

    // Auto-aim on touch: find nearest enemy each frame, set angle on input.
    // Always call setAutoAim when on touch — duck faces nearest enemy even when not shooting.
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
    } else if(!this._isTouchDevice()){
      this.input.clearAutoAim();
      this._autoAimTarget=null;
    }
    for(const b of this.bullets)b.update(dt);
    // Time Slow: enemies move at 30% speed
    const effectiveDt=this.activePowerUps.TIME_SLOW?dt*0.3:dt;
    for(const e of this.enemies)e.update(effectiveDt,this.player);
    this.waves.update(dt,this.enemies,this.audio);
    // Spawn power-ups after each wave clear
    if(this.waves.waveCleared){this._spawnWavePowerUps();this._autoAimTarget=null;}
    this._updatePowerUps(dt);
    // Wave announcement trigger
    if(this._prevWaveState==='gap'&&this.waves.state==='active'){
      this._waveAnnounce={text:T('wave',this.waves.wave),timer:1600,maxTimer:1600};
    }
    this._prevWaveState=this.waves.state;
    if(this._waveAnnounce){this._waveAnnounce.timer-=dt;if(this._waveAnnounce.timer<=0)this._waveAnnounce=null;}

    // Tutorial timer — count up while wave 1 is active and tutorial not done
    if(!this._tutDone&&this.waves.wave===1&&this.waves.state==='active'){
      this._tutTimer+=dt;
      if(this._tutTimer>=8000){this._tutDone=true;localStorage.setItem('bugSquasher_tutDone','1');}
    }

    // Goal text — show once when wave 1 first becomes active
    if(!this._goalShown&&this.waves.wave===1&&this.waves.state==='active'){
      this._goalShown=true;
      this._goalTimer=3500; // ms to display
    }
    if(this._goalTimer>0){this._goalTimer-=dt;if(this._goalTimer<0)this._goalTimer=0;}
    this.ps.update(dt);
    if(this.combo>1){this.comboTimer-=dt;if(this.comboTimer<=0){this.combo=1;this.comboTimer=0;}}
    // Combo floaters
    if(this._comboFloaters){const s=dt*0.001;this._comboFloaters.forEach(f=>{f.y+=f.vy*s;f.alpha-=s*1.2;});this._comboFloaters=this._comboFloaters.filter(f=>f.alpha>0);}
    // Bonus popup fade
    if(this._bonusPopup){this._bonusPopup.timer-=dt;this._bonusPopup.alpha=Math.max(0,this._bonusPopup.timer/this._bonusPopup.maxTimer);if(this._bonusPopup.timer<=0)this._bonusPopup=null;}
    // Active powerup timer
    if(this._activePowerup){this._activePowerup.timer-=dt;if(this._activePowerup.timer<=0)this._activePowerup=null;}
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
          if(this.player.hp<=0){this._loseLife();return;}break;
        }
      }
    }
    this.bullets=this.bullets.filter(b=>!b.dead);this.enemies=this.enemies.filter(e=>!e.dead);
  }
  _onKill(enemy){
    this.combo=Math.min(this.combo+1,10);this.comboTimer=CONFIG.COMBO_RESET_MS;
    this.score+=(CONFIG.BASE_SCORES[enemy.constructor.name]||10)*this.combo;
    if(!this._hasKilled){
      this._hasKilled=true;
      if(this._shootHint)this._shootHint.active=false;
      // First kill marks tutorial complete
      if(!this._tutDone){this._tutDone=true;localStorage.setItem('bugSquasher_tutDone','1');}
    }
    if(this.combo>1){
      this._comboFloaters.push({text:'×'+this.combo,x:enemy.x,y:enemy.y-10,alpha:1,vy:-55});
      // Large centered bonus popup — replaces persistent stack as the "wow" moment
      this._bonusPopup={text:'×'+this.combo+' BONUS!',alpha:1,timer:1200,maxTimer:1200};
    }
    this.ps.emit(enemy.x,enemy.y,enemy.color,20,{speedMin:60,speedMax:200,lifeMin:300,lifeMax:700,radiusMin:2,radiusMax:6});
    this.ps.emit(enemy.x,enemy.y,'#FFFFFF',3,{speedMin:120,speedMax:280,lifeMin:150,lifeMax:340,radiusMin:1,radiusMax:3});
    this.ps.emit(enemy.x,enemy.y,CONFIG.COLORS.gold,2,{speedMin:80,speedMax:180,lifeMin:200,lifeMax:450,radiusMin:1,radiusMax:2});
    this.audio.playPop();this._shake(4);
  }
  _spawnWavePowerUps(){
    const margin=60,pool=Object.values(POWERUP_TYPES);
    const count=Math.random()<0.45?2:1;
    for(let i=0;i<count;i++){
      const type=pool[Math.floor(Math.random()*pool.length)];
      const x=margin+Math.random()*(CONFIG.WIDTH-margin*2);
      const y=margin+Math.random()*(CONFIG.HEIGHT-margin*2);
      this.powerUps.push(new PowerUp(x,y,type));
    }
  }
  _updatePowerUps(dt){
    for(const pu of this.powerUps)pu.update(dt);
    this.powerUps=this.powerUps.filter(pu=>!pu.dead);
    // Collect
    for(const pu of this.powerUps){
      if(!pu.dead&&pu.isCollected(this.player.x,this.player.y)){
        pu.dead=true;this._activatePowerUp(pu.type);
        this.ps.emit(pu.x,pu.y,POWERUP_COLORS[pu.type].glow,18,{speedMin:80,speedMax:220,lifeMin:250,lifeMax:600,radiusMin:2,radiusMax:5});
      }
    }
    // Tick active durations
    const ap=this.activePowerUps;
    if(ap.DOUBLE_SHOT){ap.DOUBLE_SHOT.timer-=dt;if(ap.DOUBLE_SHOT.timer<=0)delete ap.DOUBLE_SHOT;}
    if(ap.WATER_HOSE) {ap.WATER_HOSE.timer -=dt;if(ap.WATER_HOSE.timer <=0)delete ap.WATER_HOSE;}
    if(ap.TIME_SLOW)  {ap.TIME_SLOW.timer  -=dt;if(ap.TIME_SLOW.timer  <=0)delete ap.TIME_SLOW;}
  }
  _activatePowerUp(type){
    switch(type){
      case POWERUP_TYPES.DOUBLE_SHOT: this.activePowerUps.DOUBLE_SHOT={timer:8000};break;
      case POWERUP_TYPES.WATER_HOSE:  this.activePowerUps.WATER_HOSE ={timer:6000};break;
      case POWERUP_TYPES.SHIELD:      this.activePowerUps.SHIELD={hitsLeft:2};break;
      case POWERUP_TYPES.TIME_SLOW:   this.activePowerUps.TIME_SLOW={timer:5000};break;
    }
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
    fillTextFit(ctx,T('hint_shoot'),CONFIG.WIDTH/2,CONFIG.HEIGHT/2+60,CONFIG.WIDTH-80,16,'bold');
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

    // Send to backend if configured (works with PHP api.php or Firebase)
    if (CONFIG.CLICK_COUNTER_URL) {
      try {
        const isFirebase = CONFIG.CLICK_COUNTER_URL.includes('firebaseio');
        const url = isFirebase ? CONFIG.CLICK_COUNTER_URL + '.json' : CONFIG.CLICK_COUNTER_URL;
        await fetch(url, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({source:'footer', lang: this.lang}),
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
      ctx.fillStyle=CONFIG.COLORS.textPri;ctx.font=F(24,'bold');
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
      ctx.font=F(24,'bold');
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
      ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(16);
      ctx.fillText(T('intro_cta'),cx,cy+106);
      // Subtitle tagline — the conceptual hook, visible on intro
      ctx.globalAlpha=ctaAlpha*0.65;
      ctx.fillStyle=CONFIG.COLORS.gold;ctx.font=F(14);
      ctx.fillText(T('subtitle'),cx,cy+126);
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
    if(this.state==='DIFFICULTY')  {this._drawDifficulty(ts);  this._drawFooter(ts);return;}
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
      ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(16);
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
    ctx.shadowBlur=0;ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(16);
    ctx.fillText(T('lang_title'),CONFIG.WIDTH/2,Math.round(CONFIG.HEIGHT*0.14)+26);
    ctx.restore();

    // Language data — no emoji flags (unreliable on Android/old iOS)
    // Each lang has a color badge drawn with canvas shapes
    const langs=[
      {code:'de',colors:['#000','#FF0000','#FFCE00'],name:'Deutsch'},    // DE: black/red/gold
      {code:'en',colors:['#012169','#FFFFFF','#C8102E'],name:'English'},  // UK: navy/white/red
      {code:'fr',colors:['#002395','#FFFFFF','#ED2939'],name:'Français'}, // FR: blue/white/red
      {code:'es',colors:['#AA151B','#F1BF00','#AA151B'],name:'Español'},  // ES: red/yellow/red
      {code:'ar',colors:['#006C35','#FFFFFF','#006C35'],name:'العربية'},  // SA: green/white/green
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

      // Canvas-drawn flag badge (3 horizontal stripes, 28×20px, rounded)
      const bW=28,bH=20,bX=x+cardW/2-bW/2,bY=y+cardH/2-22;
      ctx.save();
      ctx.beginPath();this._rr(ctx,bX,bY,bW,bH,3);ctx.clip();
      const [c1,c2,c3]=lang.colors;
      const sh=bH/3;
      ctx.fillStyle=c1;ctx.fillRect(bX,bY,bW,sh+1);
      ctx.fillStyle=c2;ctx.fillRect(bX,bY+sh,bW,sh+1);
      ctx.fillStyle=c3;ctx.fillRect(bX,bY+sh*2,bW,sh+1);
      ctx.restore();
      // Badge border
      ctx.strokeStyle='rgba(255,255,255,0.18)';ctx.lineWidth=0.5;
      ctx.beginPath();this._rr(ctx,bX,bY,bW,bH,3);ctx.stroke();

      // Language name
      const nf=lang.code==='ar'?`${isActive?'bold ':''} 12px ${SYS_AR}`:(isActive?F(12,'bold'):F(12));
      ctx.font=nf;ctx.fillStyle=isActive?'#fff':CONFIG.COLORS.textPri;
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(lang.name,x+cardW/2,y+cardH/2+12);
      ctx.restore();
    });

    ctx.save();ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(16);
    fillTextFit(ctx,T('lang_sub'),CONFIG.WIDTH/2,startY+rows*(cardH+gapY)+20,CONFIG.WIDTH-60,11);
    ctx.restore();
    this._vignette(ctx);

    if(this.input.consumeClick()){
      for(const card of this._langCards){
        if(mx>=card.x&&mx<=card.x+card.w&&my>=card.y&&my<=card.y+card.h){
          this._setLang(card.code);this.toDifficulty();return;
        }
      }
    }
  }

  // ---- DIFFICULTY ----
  _drawDifficulty(ts){
    const ctx=this.ctx;
    this._drawBg(ctx);
    ctx.direction=isRTL()?'rtl':'ltr';
    const cx=CONFIG.WIDTH/2;

    // Title
    ctx.save();ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillStyle=CONFIG.COLORS.player;ctx.shadowColor=CONFIG.COLORS.player;ctx.shadowBlur=16;
    ctx.font=F(40,'bold');ctx.fillText('BUG SQUASHER',cx,Math.round(CONFIG.HEIGHT*0.14));
    ctx.shadowBlur=0;ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(16);
    ctx.fillText(T('diff_title'),cx,Math.round(CONFIG.HEIGHT*0.14)+26);
    ctx.restore();

    const difficulties=[
      {key:'easy',  label:T('diff_easy'),  sub:T('diff_easy_sub'),
       color:'#30D158', icon:'🐢',
       mult:{enemySpeed:0.7, enemyHp:0.7, waveGap:2200, shootCooldown:160, shootCooldownMobile:280}},
      {key:'normal',label:T('diff_normal'),sub:T('diff_normal_sub'),
       color:CONFIG.COLORS.accent, icon:'⚡',
       mult:{enemySpeed:1.0, enemyHp:1.0, waveGap:1200, shootCooldown:200, shootCooldownMobile:340}},
      {key:'hard',  label:T('diff_hard'),  sub:T('diff_hard_sub'),
       color:CONFIG.COLORS.error, icon:'💀',
       mult:{enemySpeed:1.35,enemyHp:1.5, waveGap:800,  shootCooldown:250, shootCooldownMobile:400}},
    ];

    const cardW=Math.min(200,CONFIG.WIDTH*0.28),cardH=110,gapX=Math.min(20,CONFIG.WIDTH*0.03);
    const gridW=cardW*3+gapX*2,startX=cx-gridW/2;
    const startY=Math.round(CONFIG.HEIGHT*0.32);
    this._diffCards=[];
    const mx=this.input.mouse.x,my=this.input.mouse.y;

    difficulties.forEach((d,i)=>{
      const x=startX+i*(cardW+gapX),y=startY;
      const isActive=this._selectedDiff===d.key;
      const isHov=mx>=x&&mx<=x+cardW&&my>=y&&my<=y+cardH;
      this._diffCards.push({key:d.key,mult:d.mult,x,y,w:cardW,h:cardH});

      ctx.save();
      if(isActive){
        ctx.shadowColor=d.color;ctx.shadowBlur=16;
        this._card(ctx,x,y,cardW,cardH,14,d.color+'33','transparent');
        ctx.strokeStyle=d.color;ctx.lineWidth=2;this._rr(ctx,x,y,cardW,cardH,14);ctx.stroke();
      } else {
        this._card(ctx,x,y,cardW,cardH,14);
        if(isHov){this._rr(ctx,x,y,cardW,cardH,14);ctx.fillStyle='rgba(255,255,255,0.04)';ctx.fill();}
      }
      ctx.shadowBlur=0;

      // Icon
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.font='36px serif';ctx.fillText(d.icon,x+cardW/2,y+36);

      // Label
      ctx.fillStyle=isActive?d.color:CONFIG.COLORS.textPri;
      ctx.font=F(16,'bold');ctx.fillText(d.label,x+cardW/2,y+68);

      // Sub
      ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(13);
      fillTextFit(ctx,d.sub,x+cardW/2,y+87,cardW-16,10);
      ctx.restore();
    });

    // Hint
    const hintY=startY+cardH+28;
    const readyToContinue=this._selectedDiff;
    if(readyToContinue&&Math.floor(ts/600)%2===0){
      ctx.save();ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textPri;ctx.font=F(13);
      ctx.fillText(this._isTouchDevice()?T('start_t'):T('start'),cx,hintY);
      ctx.restore();
    } else if(!readyToContinue){
      ctx.save();ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(16);
      ctx.fillText(this._isTouchDevice()?T('start_t'):T('start'),cx,hintY);
      ctx.restore();
    }

    this._vignette(ctx);

    if(this.input.consumeClick()){
      for(const card of this._diffCards){
        if(mx>=card.x&&mx<=card.x+card.w&&my>=card.y&&my<=card.y+card.h){
          this._selectedDiff=card.key;
          Object.assign(CONFIG.DIFF,card.mult);
          this.toNameInput();return;
        }
      }
      // Tap anywhere after selection = confirm
      if(this._selectedDiff){
        this.toNameInput();
      }
    }
    // Keyboard: 1/2/3 or Enter after mouse hover
    if(this.input.consumeAction()&&this._selectedDiff){
      this.toNameInput();
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
    ctx.font=F(24,'bold');
    fillTextFit(ctx,T('name_title'),cx,Math.round(CONFIG.HEIGHT*0.28),CONFIG.WIDTH-80,32,'bold');
    ctx.shadowBlur=0;ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(16);
    fillTextFit(ctx,T('name_sub'),cx,Math.round(CONFIG.HEIGHT*0.28)+26,CONFIG.WIDTH-80,14);
    ctx.restore();

    const hintY=Math.round(CONFIG.HEIGHT*0.64);
    ctx.save();ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(16);
    fillTextFit(ctx,this._isTouchDevice()?T('name_hint_t'):T('name_hint'),cx,hintY,CONFIG.WIDTH-80,12);
    ctx.restore();

    const btnW=Math.min(220,CONFIG.WIDTH*0.5),btnH=48,btnX=cx-btnW/2,btnY=Math.round(CONFIG.HEIGHT*0.70);
    const mx=this.input.mouse.x,my=this.input.mouse.y;
    const hov=mx>=btnX&&mx<=btnX+btnW&&my>=btnY&&my<=btnY+btnH;
    ctx.save();
    this._rr(ctx,btnX,btnY,btnW,btnH,12);
    ctx.fillStyle=hov?'#2196FF':CONFIG.COLORS.accent;ctx.fill();
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle='#fff';ctx.font=F(16,'bold');
    fillTextFit(ctx,T('name_confirm'),cx,btnY+btnH/2,btnW-20,16,'bold');
    ctx.restore();

    ctx.save();ctx.textBaseline='alphabetic';ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(16);
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
    ctx.shadowBlur=0;ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(16);
    fillTextFit(ctx,T('subtitle'),cx,Math.round(CONFIG.HEIGHT*0.14)+24,CONFIG.WIDTH-60,14);
    ctx.restore();

    // Duck — moved lower for tighter layout
    this._drawMenuDuck(ctx,cx,Math.round(CONFIG.HEIGHT*0.43),ts);

    // Controls card — "How to Play" header + instructions
    const ctrlLines=this._isTouchDevice()?[T('ctrl_move_t'),T('ctrl_shoot_t')]:[T('ctrl_move'),T('ctrl_shoot'),T('ctrl_pause')];
    const titleLine=T('ctrl_title');
    const ctrlH=26+ctrlLines.length*20+14; // title row 26 + lines + padding
    const ctrlW=Math.min(380,CONFIG.WIDTH*0.78);
    const ctrlX=cx-ctrlW/2,ctrlY=Math.round(CONFIG.HEIGHT*0.60);
    this._card(ctx,ctrlX,ctrlY,ctrlW,ctrlH,12);
    ctx.save();
    // Title row
    ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillStyle=CONFIG.COLORS.textPri;ctx.font=F(16,'bold');
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
      ctx.save();ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textPri;ctx.font=F(16);
      ctx.fillText(this._isTouchDevice()?T('start_t'):T('start'),cx,Math.round(CONFIG.HEIGHT*0.84));
      ctx.restore();
    }

    if(this.highScore>0){
      ctx.save();ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(16);
      ctx.fillText(T('hi_score')+': '+this.highScore,cx,Math.round(CONFIG.HEIGHT*0.87));
      ctx.restore();
    }

    if(this.playerName){
      ctx.save();ctx.textBaseline='top';ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(16);
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
      fillTextFit(ctx,T(key),(i+0.5)*colW,y,colW-8,16,'bold');
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
    // Power-up pickups
    if(this.powerUps)for(const pu of this.powerUps)pu.draw(ctx);
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
    // Tutorial overlay (touch, first-time only)
    if(this._isTouchDevice()&&!this._tutDone)this._drawTutorialOverlay(ts);
    // Goal text (one-time, wave 1 start)
    this._drawGoalText(ts);
    // Time Slow: blue edge tint
    if(this.activePowerUps&&this.activePowerUps.TIME_SLOW){
      const frac=this.activePowerUps.TIME_SLOW.timer/5000;
      const alpha=0.18*Math.min(1,frac*5);
      const ctx=this.ctx;
      const g=ctx.createRadialGradient(CONFIG.WIDTH/2,CONFIG.HEIGHT/2,CONFIG.HEIGHT*0.25,CONFIG.WIDTH/2,CONFIG.HEIGHT/2,CONFIG.HEIGHT*0.85);
      g.addColorStop(0,'rgba(0,120,255,0)');g.addColorStop(1,`rgba(0,120,255,${alpha})`);
      ctx.save();ctx.fillStyle=g;ctx.fillRect(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);ctx.restore();
    }
    this._vignette(ctx);
  }

  _drawHUD(ts){
    const ctx=this.ctx;
    ctx.save();ctx.direction=isRTL()?'rtl':'ltr';

    // ================================================================
    // 1. HEALTH BAR — horizontal, color-coded, with duck silhouette
    // ================================================================
    const barW=120,barH=10,barX=12,barY=12,barR=5;
    const hp=this.player?this.player.hp:CONFIG.PLAYER_MAX_HP;
    const hpRatio=hp/CONFIG.PLAYER_MAX_HP;
    // Pick bar fill color based on HP %
    let barColor;
    if(hpRatio>0.6)       barColor='#30D158'; // green
    else if(hpRatio>0.3)  barColor='#FFD60A'; // yellow
    else                  barColor='#FF453A'; // red

    // Dark backing track
    ctx.save();
    this._rr(ctx,barX,barY,barW,barH,barR);
    ctx.fillStyle='rgba(0,0,0,0.55)';ctx.fill();
    // Thin border
    ctx.strokeStyle='rgba(255,255,255,0.12)';ctx.lineWidth=0.8;ctx.stroke();
    ctx.restore();

    // Filled portion (clipped to pill)
    if(hpRatio>0){
      const fillW=Math.max(barR*2,barW*hpRatio);
      ctx.save();
      this._rr(ctx,barX,barY,barW,barH,barR);
      ctx.clip();
      ctx.fillStyle=barColor;
      ctx.shadowColor=barColor;ctx.shadowBlur=6;
      ctx.fillRect(barX,barY,fillW,barH);
      // Subtle highlight stripe
      ctx.shadowBlur=0;
      ctx.fillStyle='rgba(255,255,255,0.18)';
      ctx.fillRect(barX,barY,fillW,barH*0.4);
      ctx.restore();
    }

    // Duck silhouette icon — 5 circles: body + head + bill (left of bar)
    // Drawn at (barX-26, barY+barH/2) so it sits centred on the bar
    const dix=barX-26,diy=barY+barH/2;
    ctx.save();ctx.translate(dix,diy);ctx.scale(0.55,0.55);
    ctx.fillStyle='#FFD60A';ctx.strokeStyle='#CC9900';ctx.lineWidth=1.5;
    // body ellipse
    ctx.beginPath();ctx.ellipse(0,3,17,13,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    // head
    ctx.beginPath();ctx.arc(7,-10,10,0,Math.PI*2);ctx.fill();ctx.stroke();
    // bill
    ctx.fillStyle='#FF8C00';ctx.beginPath();ctx.moveTo(15,-11);ctx.quadraticCurveTo(28,-9,26,-5);ctx.lineTo(15,-6);ctx.closePath();ctx.fill();
    // eye
    ctx.translate(10,-13);ctx.fillStyle='white';ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#111';ctx.beginPath();ctx.arc(0,0,2.2,0,Math.PI*2);ctx.fill();
    ctx.restore();

    // ================================================================
    // 2. LIVES — 3 duck outlines to the right of the health bar
    // ================================================================
    const livesX=barX+barW+10;
    const livesY=barY+barH/2;
    const lifeSize=10; // radius of each life icon
    const lifeGap=24;
    const totalLives=3;
    for(let i=0;i<totalLives;i++){
      const lx=livesX+i*lifeGap+lifeSize;
      const alive=(this.lives||0)>i;
      ctx.save();ctx.translate(lx,livesY);ctx.scale(0.38,0.38);
      if(alive){
        // Filled yellow duck
        ctx.fillStyle='#FFD60A';ctx.strokeStyle='#CC9900';ctx.lineWidth=1.8;ctx.shadowColor='#FFD60A';ctx.shadowBlur=6;
        ctx.beginPath();ctx.ellipse(0,3,17,13,0,0,Math.PI*2);ctx.fill();ctx.stroke();
        ctx.beginPath();ctx.arc(7,-10,10,0,Math.PI*2);ctx.fill();ctx.stroke();
        ctx.shadowBlur=0;ctx.fillStyle='#FF8C00';
        ctx.beginPath();ctx.moveTo(15,-11);ctx.quadraticCurveTo(28,-9,26,-5);ctx.lineTo(15,-6);ctx.closePath();ctx.fill();
      } else {
        // Dim outline only
        ctx.globalAlpha=0.22;
        ctx.strokeStyle='#FFD60A';ctx.lineWidth=2.2;ctx.fillStyle='transparent';
        ctx.beginPath();ctx.ellipse(0,3,17,13,0,0,Math.PI*2);ctx.stroke();
        ctx.beginPath();ctx.arc(7,-10,10,0,Math.PI*2);ctx.stroke();
      }
      ctx.restore();
    }

    // ================================================================
    // 3. SCORE — centered top, bold white; best below in dim text
    // ================================================================
    ctx.fillStyle=CONFIG.COLORS.textPri;ctx.font=F(32,'bold');
    ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText(this.score,CONFIG.WIDTH/2,8);
    ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(16);
    ctx.fillText(T('hi_score')+' '+this.highScore,CONFIG.WIDTH/2,32);

    // ================================================================
    // 4. WAVE BADGE — pill top-right
    // ================================================================
    const wbW=80,wbH=26,wbX=CONFIG.WIDTH-90,wbY=12,wbR=13;
    ctx.save();
    // Dark pill background
    this._rr(ctx,wbX,wbY,wbW,wbH,wbR);
    ctx.fillStyle='rgba(0,0,0,0.62)';ctx.fill();
    // Accent border
    ctx.strokeStyle=CONFIG.COLORS.accent;ctx.lineWidth=1.2;ctx.stroke();
    // Wave text
    const waveLabel=this.waves.state==='gap'
      ?(this.waves.wave===0?T('get_ready'):T('wave_in',this.waves.wave+1))
      :T('wave',this.waves.wave);
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=CONFIG.COLORS.textPri;ctx.font=F(16,'bold');
    fillTextFit(ctx,waveLabel,wbX+wbW/2,wbY+wbH/2,wbW-12,16,'bold');
    ctx.restore();

    // ================================================================
    // 5. BONUS POPUP — large centered screen text, fades 1.2s
    // ================================================================
    if(this._bonusPopup&&this._bonusPopup.alpha>0){
      const bp=this._bonusPopup;
      ctx.save();
      ctx.globalAlpha=bp.alpha;
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.font=F(40,'bold');
      ctx.shadowColor=CONFIG.COLORS.gold;ctx.shadowBlur=28;
      ctx.fillStyle=CONFIG.COLORS.gold;
      ctx.fillText(bp.text,CONFIG.WIDTH/2,CONFIG.HEIGHT/2-60);
      ctx.shadowBlur=0;
      ctx.restore();
    }

    // ================================================================
    // 6. ACTIVE POWERUP INDICATORS — stacked pills top-left below HP bar
    // ================================================================
    if(this.activePowerUps){
      const ap=this.activePowerUps;
      const entries=[];
      if(ap.DOUBLE_SHOT)entries.push({type:'DOUBLE_SHOT',label:'2× SHOT', timer:ap.DOUBLE_SHOT.timer,maxTimer:8000});
      if(ap.WATER_HOSE) entries.push({type:'WATER_HOSE', label:'HOSE ≋',  timer:ap.WATER_HOSE.timer, maxTimer:6000});
      if(ap.SHIELD)     entries.push({type:'SHIELD',     label:'SHIELD ◈',timer:null,hitsLeft:ap.SHIELD.hitsLeft});
      if(ap.TIME_SLOW)  entries.push({type:'TIME_SLOW',  label:'SLOW ⧖',  timer:ap.TIME_SLOW.timer,  maxTimer:5000});
      let slotY=50;
      for(const entry of entries){
        const col=POWERUP_COLORS[entry.type];
        const slotW=90,slotH=20,slotX=12,slotR=5;
        const pulse=0.75+0.25*Math.abs(Math.sin(ts*0.004));
        ctx.save();
        this._rr(ctx,slotX,slotY,slotW,slotH,slotR);
        ctx.fillStyle='rgba(0,0,0,0.55)';ctx.fill();
        ctx.strokeStyle=col.primary;ctx.lineWidth=1.2;ctx.globalAlpha=pulse;ctx.stroke();ctx.globalAlpha=1;
        if(entry.timer!==null&&entry.maxTimer){
          const frac=Math.max(0,entry.timer/entry.maxTimer);
          this._rr(ctx,slotX+1,slotY+slotH-4,(slotW-2)*frac,3,2);
          ctx.fillStyle=col.primary;ctx.globalAlpha=0.28;ctx.fill();ctx.globalAlpha=1;
        }
        ctx.fillStyle=col.secondary;ctx.shadowColor=col.glow;ctx.shadowBlur=6;
        ctx.font=F(13,'bold');ctx.textAlign='left';ctx.textBaseline='middle';
        ctx.fillText(entry.label,slotX+7,slotY+slotH/2-1);
        ctx.shadowBlur=0;
        if(entry.type==='SHIELD'&&entry.hitsLeft){
          for(let i=0;i<2;i++){
            ctx.fillStyle=i<entry.hitsLeft?col.primary:'rgba(255,255,255,0.15)';
            ctx.beginPath();ctx.arc(slotX+slotW-10-i*10,slotY+slotH/2,3.5,0,Math.PI*2);ctx.fill();
          }
        }
        ctx.restore();
        slotY+=slotH+4;
      }
    }

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
    ctx.font=F(16,'bold');ctx.textBaseline='middle';
    ctx.fillText(T('shoot'),btnX,btnY+btnR-14);

    ctx.restore();
  }

  _drawTutorialOverlay(ts){
    if(this._tutDone)return;
    const t=this._tutTimer;       // ms elapsed in wave 1
    const ctx=this.ctx;
    const cx=CONFIG.WIDTH/2,cy=CONFIG.HEIGHT/2;

    // Which step: 0-3s step1, 3-6s step2, 6-8s step3
    let stepIdx=0,stepAlpha=1;
    if(t<3000){
      stepIdx=0;
      stepAlpha=Math.min(1,t/300)*(t>2700?Math.max(0,(3000-t)/300):1);
    } else if(t<6000){
      const trel=t-3000;
      stepIdx=1;
      stepAlpha=Math.min(1,trel/300)*(trel>2700?Math.max(0,(3000-trel)/300):1);
    } else {
      const trel=t-6000;
      stepIdx=2;
      stepAlpha=Math.min(1,trel/300);
    }
    if(stepAlpha<=0)return;

    const steps=[
      {icon:'👈',text:'Joystick — move',arrowDir:'left'},
      {icon:'👉',text:'Button — shoot',arrowDir:'right'},
      {icon:'',text:'Defeat all enemies!',arrowDir:null},
    ];
    const step=steps[stepIdx];

    // Semi-transparent dark pill
    const pillW=Math.min(260,CONFIG.WIDTH*0.7),pillH=72,pillX=cx-pillW/2;
    const pillY=cy-pillH/2-60; // above center, above joystick
    ctx.save();
    ctx.globalAlpha=0.82*stepAlpha;
    this._rr(ctx,pillX,pillY,pillW,pillH,20);
    ctx.fillStyle='rgba(10,15,28,0.92)';ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.14)';ctx.lineWidth=1;ctx.stroke();

    // Icon + text
    ctx.globalAlpha=stepAlpha;
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font='28px serif';
    if(step.icon)ctx.fillText(step.icon,cx,pillY+28);
    ctx.fillStyle=CONFIG.COLORS.textPri;ctx.font=F(15,'bold');
    ctx.shadowColor=CONFIG.COLORS.gold;ctx.shadowBlur=8;
    ctx.fillText(step.text,cx,pillY+(step.icon?52:36));
    ctx.shadowBlur=0;

    // Animated arrow pointing toward the relevant control
    if(step.arrowDir){
      const arrowAnim=0.5+0.5*Math.sin(ts*0.005); // 0..1 bounce
      const aY=pillY+pillH+16+arrowAnim*8;
      const aX=step.arrowDir==='left'
        ? Math.min(cx-40, 100)    // points left toward joystick
        : Math.max(cx+40, CONFIG.WIDTH-100); // points right toward shoot btn
      ctx.fillStyle=CONFIG.COLORS.gold;
      ctx.shadowColor=CONFIG.COLORS.gold;ctx.shadowBlur=12;
      // Arrow triangle
      const sz=14;
      ctx.beginPath();
      if(step.arrowDir==='left'){
        ctx.moveTo(aX,      aY);
        ctx.lineTo(aX+sz*2, aY-sz);
        ctx.lineTo(aX+sz*2, aY+sz);
      } else {
        ctx.moveTo(aX,      aY);
        ctx.lineTo(aX-sz*2, aY-sz);
        ctx.lineTo(aX-sz*2, aY+sz);
      }
      ctx.closePath();ctx.fill();
      ctx.shadowBlur=0;
    }

    ctx.restore();
  }

  _drawGoalText(ts){
    if(!this._goalShown||this._goalTimer<=0)return;
    const ctx=this.ctx;
    const cx=CONFIG.WIDTH/2;
    // Fade in first 400ms, solid, then fade out last 600ms
    let alpha=1;
    if(this._goalTimer>3100)alpha=(3500-this._goalTimer)/400;
    else if(this._goalTimer<600)alpha=this._goalTimer/600;
    alpha=Math.max(0,Math.min(1,alpha));
    if(alpha<=0)return;

    ctx.save();
    ctx.globalAlpha=alpha;
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=CONFIG.COLORS.gold;
    ctx.shadowColor=CONFIG.COLORS.gold;ctx.shadowBlur=18;
    ctx.font=F(18,'bold');
    fillTextFit(ctx,T('goal_text'),cx,CONFIG.HEIGHT*0.38,CONFIG.WIDTH-60,18,'bold');
    ctx.shadowBlur=0;
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
    ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(16);
    ctx.fillText(T('core_dump'),cx,Math.round(CONFIG.HEIGHT*0.23));

    // Score card
    const scW=Math.min(240,CONFIG.WIDTH*0.55),scH=60,scX=cx-scW/2,scY=Math.round(CONFIG.HEIGHT*0.26);
    this._card(ctx,scX,scY,scW,scH,14);
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(16);
    ctx.fillText(T('score_lbl').toUpperCase(),cx,scY+14);
    ctx.fillStyle=CONFIG.COLORS.textPri;ctx.font=F(24,'bold');
    ctx.fillText(this.score,cx,scY+40);

    // Best
    const bestY=Math.round(CONFIG.HEIGHT*0.38);
    ctx.textBaseline='alphabetic';
    if(this.score>0&&this.score>=this.highScore){
      ctx.fillStyle=CONFIG.COLORS.gold;ctx.font=F(16,'bold');
      fillTextFit(ctx,T('new_hi'),cx,bestY,CONFIG.WIDTH-80,16,'bold');
    } else if(this.highScore>0){
      ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(16);
      ctx.fillText(T('best')+': '+this.highScore,cx,bestY);
    }

    this._drawLeaderboard(ctx);

    const guardElapsed = performance.now() - this._gameOverTs > 600;

    // Restart prompt (flashing)
    if(guardElapsed && Math.floor(ts/600)%2===0){
      ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(16);
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
          this.toDifficulty();
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
    const panelW=Math.min(440,CONFIG.WIDTH*0.88),panelX=CONFIG.WIDTH/2-panelW/2,panelY=Math.round(CONFIG.HEIGHT*0.42);

    this._card(ctx,panelX,panelY,panelW,panelH,14);
    const rtl=isRTL();
    const r1=rtl?(panelX+panelW-panelPad-16):(panelX+panelPad+16);
    const r2=rtl?(panelX+panelW-panelPad-40):(panelX+panelPad+40);
    const r3=rtl?(panelX+panelPad+55)        :(panelX+panelW-panelPad-55);
    const r4=rtl?(panelX+panelPad)            :(panelX+panelW-panelPad);
    const inner=panelW-panelPad*2;

    ctx.save();
    ctx.textBaseline='alphabetic';ctx.textAlign='center';
    ctx.fillStyle=CONFIG.COLORS.accent;ctx.font=F(16,'bold');
    ctx.fillText(T('leaderboard').toUpperCase(),CONFIG.WIDTH/2,panelY+headerH-4);
    ctx.strokeStyle=CONFIG.COLORS.border;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(panelX+panelPad,panelY+headerH);ctx.lineTo(panelX+panelW-panelPad,panelY+headerH);ctx.stroke();

    if(this.submittingScore){
      ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textSec;ctx.font=F(16);
      ctx.fillText(T('submitting'),CONFIG.WIDTH/2,panelY+headerH+lineH);
      ctx.restore();return;
    }
    if(topEntries.length===0){
      ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(16);
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
        ctx.textAlign=rtlAlign('left');ctx.fillStyle='rgba(255,214,10,0.5)';ctx.font=F(16);
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
      ctx.textAlign=rtlAlign('right');ctx.fillStyle=CONFIG.COLORS.gold;ctx.font=F(16,'bold');ctx.fillText('#'+(myIdx+1),r1,textY);
      ctx.textAlign=rtlAlign('left');ctx.fillStyle=CONFIG.COLORS.gold;ctx.font=F(16,'bold');fillTextFit(ctx,own.name||'???',r2,textY,panelW*0.38,16,'bold');
      ctx.textAlign=rtlAlign('right');ctx.fillStyle=CONFIG.COLORS.gold;ctx.font=`bold 13px ${MONO}`;ctx.fillText(own.score,r3,textY);
      ctx.textAlign=rtlAlign('right');ctx.fillStyle='rgba(255,214,10,0.6)';ctx.font=F(16);ctx.fillText(T('lb_wave')+' '+(own.wave||'?'),r4,textY);
    }

    if(!CONFIG.LEADERBOARD_URL){
      ctx.textAlign='center';ctx.fillStyle=CONFIG.COLORS.textDim;ctx.font=F(16);
      ctx.fillText(T('lb_offline'),CONFIG.WIDTH/2,panelY+panelH-4);
    }
    ctx.restore();
  }
}

// =============================================================================
// Bootstrap
// =============================================================================
window.addEventListener('load', () => { window.game = new Game(); });
