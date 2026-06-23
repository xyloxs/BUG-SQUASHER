# BUG SQUASHER

You are a rubber duck - the legendary debugging tool - and the bugs have become sentient. Waves of coding errors brought to life attack from all sides, and only your rubber bullets can squash them. This is rubber duck debugging, taken literally.

**Rubber duck debugging** is a real software engineering technique: a developer explains their code line by line to an inanimate rubber duck, and the act of verbalising the problem forces the clarity that reveals the bug. No duck was harmed in the making of this game.

---

## Play it

**Live:** https://bug-squasher-theta.vercel.app

---

## How to Play

| Input | Action |
|---|---|
| WASD / Arrow keys | Move the duck |
| Mouse aim + click | Aim and shoot |
| Space | Shoot |
| P | Pause |
| Virtual joystick (bottom-left) | Move on mobile |
| Shoot button - bottom-right | Fire on mobile |

Survive waves of enemies. Build combos by killing rapidly (up to x10). Collect power-ups after each wave.

---

## Enemy Types

| Enemy | Who | Behaviour |
|---|---|---|
| Opa mit Rollator | Grandpa with Walker | Walks straight toward you, 3 HP |
| Oma auf Scooter | Grandma on Scooter | Fast sine-wave movement, 1 HP |
| Grummeliger Opa | Grumpy Grandpa | Orbits the arena, charges every few seconds, 5 HP |
| Schlafwandel-Oma | Sleepwalking Granny | Slow, semi-transparent, phases through enemies, 3 HP |

---

## Power-Ups (spawn after each wave clear)

| Icon | Name | Effect |
|---|---|---|
| 2x | Double Shot | Two bullets simultaneously for 8s |
| Water Hose | Hose | Auto-fire at 35ms rate for 6s |
| Shield | Shield | Absorbs 2 hits |
| Slow | Time Slow | Enemies at 30% speed for 5s |

---

## Features

- **3 Difficulty levels** - Easy, Normal, Hard
- **3 Lives** with respawn and invincibility frames
- **Rambo Duck progression** - earns headband, bullet bandolier, tactical vest as score increases
- **5 Languages** - DE, EN, FR, ES, AR (with full RTL support for Arabic)
- **Global leaderboard** - scores saved online via PHP/MySQL backend
- **GTA-inspired HUD** - health bar, lives, combo multiplier, wave announcements
- **Auto-aim on mobile** with animated target beam
- Works on every device - desktop, tablet, mobile, Mac, Windows, Android, iOS

---

## Tech Stack

Vanilla HTML5 Canvas + ES6+ JavaScript + CSS. No frameworks, no build step, no external dependencies. All audio synthesized via Web Audio API. Global leaderboard via PHP/MySQL (backend deployed separately, see `api.php`).

---

## Leaderboard Backend

The file `api.php` contains the PHP/MySQL leaderboard backend. It is excluded from git (`.gitignore`) as it contains database credentials. Deploy it manually to your server alongside `index.html`. See inline documentation in `api.php` for setup instructions.

---

## Development

Open `index.html` directly in a browser. No server required for local play.

---

## License

Copyright (c) 2026 GSE — All rights reserved.

This game was created by GSE as an original work for the SKAILE Academy Building Challenge.

Copying, redistribution, or use of any part of this code or concept without prior written consent is not permitted. For licensing inquiries or collaboration, contact us at [gse.events](https://gse.events).
