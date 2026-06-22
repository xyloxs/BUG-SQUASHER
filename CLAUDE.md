# CLAUDE.md — BUG-SQUASHER

Project-level instructions for Claude Code. These rules apply to every session.

---

## Project Overview

Browser-based minigame built for a Building Challenge. Stack: **Vanilla HTML + CSS + JavaScript** (no framework, no build step).

Repo root: `~/claude_universe/private/BUG-SQUASHER/`

---

## Session Start (MANDATORY)

At the beginning of every session:
1. `git log --oneline -10` — understand current state
2. `git status` — check for uncommitted changes
3. Read `CHANGELOG.md` to orient on current version
4. Then continue building without asking for confirmation

---

## Git & Release Workflow

### Git Identity
- user.name: GSE Developer
- user.email: github@gse.events
- Remote: `https://github.com/xyloxs/BUG-SQUASHER.git` — never change

### Commit after every completed step
```
git add -A
git commit -m "<type>: <short description>"
git push
```

### Commit conventions (Conventional Commits)
```
feat:     new user-visible feature
fix:      bug fix
perf:     performance improvement
refactor: code change without behaviour change
style:    CSS/UI only
docs:     CHANGELOG, README, comments
chore:    build, deps, config
```

Single-line subject, max 72 chars. No period at end.

### Push target
Always push to `origin` (`https://github.com/xyloxs/BUG-SQUASHER.git`). Verify with `git remote -v` if unsure. Never push anywhere else.

### CHANGELOG format
```md
## vX.Y.Z — YYYY-MM-DD

### New Features
| Feature | Description |
|---|---|

### Fixes & Improvements
| Fix | Detail |
|---|---|
```

---

## Feature Development Process

1. For anything touching > 2 files: use Plan Mode first, confirm before coding
2. After every completed unit: commit + push immediately
3. Update `CHANGELOG.md` with each meaningful change

---

## Code Style

- Vanilla JS — no frameworks, no build tools unless challenge requires it
- No comments explaining WHAT the code does — only WHY if non-obvious
- Clean, minimal, challenge-compliant
