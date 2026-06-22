# BUG SQUASHER

You are a rubber duck — the legendary debugging tool — and the bugs have become sentient. Waves of coding errors brought to life (NullPointerException Spiders, SegFault Snakes, InfiniteLoop Octopi, MemoryLeak Ghosts) attack from all sides, and only your rubber bullets can squash them. This is rubber duck debugging, taken literally.

**Rubber duck debugging** is a real software engineering technique: a developer explains their code line by line to an inanimate rubber duck, and the act of verbalising the problem forces the clarity that reveals the bug. No duck was harmed in the making of this game.

## How to Play

| Input | Action |
|---|---|
| **WASD / Arrow keys** | Move the duck |
| **Mouse aim + click** | Aim and shoot |
| **Hold click** | Auto-fire |
| **P** | Pause |
| **Touch left half** | Virtual joystick (mobile) |
| **Touch right half** | Aim and shoot (mobile) |

Survive waves of bugs. Build combos by killing enemies rapidly (up to x10). High score is saved locally.

## Enemy Types

| Enemy | Behavior |
|---|---|
| NullPointerException Spider | Walks straight toward you, 2 HP |
| SegFault Snake | Fast sine-wave movement, 1 HP |
| InfiniteLoop Octopus | Orbits the arena, charges every 3.5s, 4 HP |
| MemoryLeak Ghost | Slow, semi-transparent, phases through other enemies, 3 HP |

## Tech Stack

Pure vanilla HTML5 Canvas + ES6+ JavaScript + CSS. No frameworks, no build step, no external dependencies. All audio synthesized via Web Audio API.

## Development

Open `index.html` directly in a browser. No server required.

## License

Private — Building Challenge submission
