# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A template system for encoding architectural constraints into the Claude Code development loop. It provides hooks, agents, skills, and SPEC document templates that teams copy into their own projects and customize. This is **not an application** — it's a development tooling template.

## Repository Structure

- `template/` — The copyable template: `.claude/` directory (hooks, agents, skills, settings), `CLAUDE.md` template with `{{PLACEHOLDER}}` markers, SPEC and MEMORY doc templates
- `examples/` — Two worked examples showing the template adapted to specific stacks (Express+PostgreSQL, Next.js+Prisma)
- `site/src/content/blog/` — Blog posts including "Entropy at Velocity" explaining the rationale

## The Four-Layer Architecture

| Layer | Directory | Purpose | When It Runs |
|-------|-----------|---------|--------------|
| **Hooks** | `template/.claude/hooks/` | Nudge on drift (informational) | Every file edit/write via `settings.local.json` |
| **Agents** | `template/.claude/agents/` | Review and detect drift (read-only) | On demand via `/coherence` |
| **SPEC Docs** | `template/docs/` | Define "correct" via falsifiable claims | Referenced by agents |
| **Skills** | `template/.claude/skills/` | Auto-detecting workflow | User-invoked (`/coherence` locally or via plugin) |

## Hook Protocol

Hooks are Node.js scripts (`.cjs`/`.js`) that read JSON from stdin and communicate via stdout:
- **Block**: `{ "decision": "block", "reason": "..." }` — prevents the tool from executing
- **Warn**: `{ "message": "..." }` — tool proceeds, agent sees warning
- **Allow**: no output, exit 0

Each hook has a `// === CONFIGURATION ===` block at the top with project-specific constants. Hooks are registered in `settings.local.json` under `PostToolUse`.

The template ships with 1 hook (spec-drift-nudge) and 1 utility (_journal.cjs for JSONL logging).

## Testing Hooks

```bash
echo '{"tool_input":{"file_path":"/src/test.ts","content":"hello"}}' | node template/.claude/hooks/spec-drift-nudge.cjs
```

No output = allowed. JSON output = warned.

## Blog Posts

- **Do not repeat the title or tagline in the body.** The front matter `title` and `subtitle` fields are rendered by the site layout. When importing content from external sources, strip any leading H1 or tagline that duplicates the front matter before publishing.

## Key Conventions

- The `template/CLAUDE.md` uses `{{PLACEHOLDER}}` markers that adopters replace with their project values
- Hooks are self-contained — no external config files, all configuration via constants at the top of each file
- Agents are read-only (Read, Grep, Glob, Bash only — no Write/Edit access)
- SPEC documents make falsifiable claims ("we have 18 inspectors") not opinions ("our API is well-designed")
- There is 1 unified skill (`/coherence`) with auto-detecting flow — both plugin and template copies are identical
- Running `/coherence` inside this repo triggers dogfood mode — a read-only validation of templates, hooks, examples, and documentation accuracy
- **Version bumps**: Run `./bump-version.sh <version>` to update all 4 files, then add changelog entries to `site/src/data/changelog.ts`, commit, and tag with `git tag v<version>`
