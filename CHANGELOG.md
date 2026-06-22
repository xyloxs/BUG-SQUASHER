# Changelog

All notable changes to **BUG-SQUASHER** are listed here.

---

## v1.4.0 — 2026-06-22

### New Features

| Feature | Description |
|---|---|
| **Arabic language (العربية)** | Full RTL support — all 47 strings translated |
| **RTL layout mirroring** | Hearts HUD, combo, player badge, back link, leaderboard columns all mirror for Arabic |
| **Arabic font stack** | `SYS_AR`: Geeza Pro (iOS/macOS), Arabic Typesetting (Windows), Noto Sans Arabic (Android) |
| **5-language picker** | 🇩🇪 🇬🇧 🇫🇷 🇪🇸 🇸🇦 in a 2×2 grid with Arabic card centered in row 3 |
| **`ctx.direction` RTL** | Set per draw-function for correct Canvas text rendering; lang select stays LTR while language not yet chosen |
| **`isRTL()` / `rtlAlign()` / `F()` helpers** | Clean, reusable helpers; single point of control for language-conditional layout |

---

## v1.3.0 — 2026-06-22

### Fixes

| Fix | Detail |
|---|---|
| **Auto-restart bug** | `toGameOver()` now flushes residual input and sets a 600ms guard; game stays on Game Over screen until intentional input |
| **Missing translations** | `lb_empty` key added to all 4 languages; no more hardcoded `—` in leaderboard |
| **Leaderboard Top 10** | Shows up to 10 entries; if own score is outside top 10, it appears separately below a dashed separator with correct rank |

### Improvements

| Improvement | Detail |
|---|---|
| **Apple-inspired visual redesign** | System font (`-apple-system`) for UI text; Courier New kept only for code-themed elements (scores, wave labels, SEGFAULT, enemy names) |
| **Glass panels** | Cards, controls block, score panel, leaderboard panel use `rgba` glass fill + hairline borders |
| **Cleaner color palette** | Darker bg `#0a0e17`, calmer accent `#3B82F6`, `#EF4444` for error, `#F1F5F9` text — consistent hierarchy |
| **Glow reduction** | Glow only on game entities (gameplay feedback) and main titles; UI text uses weight/size for hierarchy instead |
| **Leaderboard "You" tag** | Own entry always highlighted in gold; `lb_you` label appended |
| **Input field redesign** | Glass-style DOM input with `backdrop-filter`, hairline border, smooth focus transition |

---

## v1.2.0 — 2026-06-22

### New Features

| Feature | Description |
|---|---|
| **i18n — 4 languages** | DE / EN / FR / ES with full translation coverage |
| **LANG_SELECT screen** | Language picker with flag cards before main menu; auto-detects browser language |
| **NAME_INPUT screen** | DOM text input for player name; used in leaderboard; persists across restarts |
| **Local leaderboard** | Top-15 scores stored in localStorage, shown on Game Over screen |
| **Online leaderboard** | Firebase REST API ready (set `LEADERBOARD_URL` in CONFIG to activate) |
| **Platform-aware menus** | All menu/pause/game-over text switches between touch and desktop variants |

### Fixes & Improvements

| Fix | Detail |
|---|---|
| **Faster difficulty** | Player speed 220→260, shoot cooldown 180→130ms, wave gap 3000→1800ms |
| **Enemy speed up** | Spider 80–110→110–150 px/s, Snake 170–210→210–270 px/s |
| **Octopus charges more** | Charge interval 2800–4300→2000–3200ms |
| **Snakes from Wave 1** | Wave formula: `floor((w+1)/2)` — Wave 1 now always has 1 Snake |
| **Spawn stagger** | 380ms→250ms between enemies in same wave |
| **State machine extended** | LANG_SELECT → NAME_INPUT → MENU → PLAYING → PAUSED → GAME_OVER |

---

## v1.1.0 — 2026-06-22

### Fixes & Improvements

| Fix | Detail |
|---|---|
| **Fullscreen canvas** | Canvas fills entire device screen on mobile, tablet, and desktop — no fixed 800x600 |
| **Live CONFIG dimensions** | CONFIG.WIDTH/HEIGHT updated on window resize, all downstream code adapts automatically |
| **DPR-safe init** | `ctx.setTransform` replaces `ctx.scale` to prevent DPR accumulation bug on repeated resize |
| **Resize handler** | `_onResize()` recalculates canvas, clamps player position, Octopus orbit adapts live |
| **Octopus orbit** | `orbitRadius = Math.min(W, H) * 0.42` — always within visible area on any screen |
| **Octopus charge** | 5% per-frame course correction toward current player position |
| **Snake homing** | Homing coefficient 0.01 → 0.025 — snakes no longer escape off canvas |
| **Spider/Ghost despawn** | Off-screen entities (> 100px outside bounds) mark dead — prevents memory accumulation |
| **Wave balance** | Wave 1 now spawns 4 spiders instead of 3, cap raised from 8 to 10 |
| **Touch overlay** | Virtual joystick ring + inner dot drawn when active; shoot crosshair at tap point |
| **Zone labels** | "MOVE" / "SHOOT" labels visible when touch zones are idle |
| **Platform-aware text** | Menu and pause screens show touch instructions on touch devices |
| **Tap-to-resume** | On touch devices, tapping anywhere resumes from PAUSE screen |
| **Proportional layouts** | All menu/game-over Y positions use CONFIG.HEIGHT multipliers — scale to any screen height |
| **Touch start/restart** | "TAP ANYWHERE TO START/RESTART" prompt on mobile |

---

## v1.0.0 — 2026-06-22

### New Features

| Feature | Description |
|---|---|
| **index.html** | Single-canvas entry point with mobile viewport meta |
| **style.css** | Dark background, flexbox centering, crosshair cursor, retina-ready |
| **game.js** | Full 1100-line vanilla JS game — all 8 deliverables in one pass |
| **Rubber duck player** | Yellow canvas-drawn duck with wobble, bounce, shoot squish, and googly eye |
| **Enemy: NullPointerException Spider** | Homing, 8 animated legs, dark red glow |
| **Enemy: SegFault Snake** | Fast sine-wave movement, 5-segment body, toxic green |
| **Enemy: InfiniteLoop Octopus** | Orbits arena, charges player every 3.5s, purple with tentacles |
| **Enemy: MemoryLeak Ghost** | Slow, semi-transparent, phases through other enemies, pulsing cyan |
| **Wave system** | Progressive difficulty, staggered spawns, 3s gap between waves |
| **Score + Combo** | Kill = base score x combo multiplier (up to x10), resets on damage or 3s idle |
| **Particle system** | Color-matched death explosions per enemy type |
| **Screen shake** | On player hit (9px) and enemy kill (4px), exponential decay |
| **Web Audio synth** | Squeak (shoot), pop (kill), hurt buzz, C-E-G wave clear arpeggio — no files |
| **Menu screen** | Animated duck, title, controls legend, high score, blinking start prompt |
| **Game Over screen** | "SEGMENTATION FAULT (core dumped)" title, final score, new high score detection |
| **LocalStorage high score** | Persists across sessions via key `bugSquasher_hs` |
| **Mobile touch support** | Virtual joystick (left half) + tap-to-shoot (right half), dual touch |
| **CRT overlay** | Subtle scanlines + radial vignette for terminal aesthetic |

### Fixes & Improvements

| Fix | Detail |
|---|---|
| **Retina/HiDPI support** | Canvas scaled by devicePixelRatio, all drawing in logical 800x600 |
| **dt capping** | Max 50ms per frame to prevent spiral-of-death on tab focus loss |
| **Bullet OOB culling** | Bullets mark dead at canvas edge to prevent unbounded array growth |
| **Audio unlock** | AudioContext created lazily on first user gesture for browser compatibility |

---

## v0.1.0 — 2026-06-22

### Initial Setup

| Item | Detail |
|---|---|
| **Project scaffold** | Repo created, CLAUDE.md, README, CHANGELOG, .gitignore |

