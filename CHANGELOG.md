# Changelog

All notable changes to **BUG-SQUASHER** are listed here.

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

