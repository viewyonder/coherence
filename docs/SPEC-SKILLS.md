# SPEC-SKILLS: Skill System

> **Last verified**: 2026-04-05
> **Verified by**: manual review
> **Verification method**: file listing + source inspection

## Overview

All functionality is unified under a single `/coherence` command that auto-detects what to do based on project state. The skill lives in `template/.claude/skills/coherence/SKILL.md` (template) and `plugins/coherence-plugin/skills/coherence/SKILL.md` (plugin copy). Both files must be identical.

## Components

There is 1 skill with auto-detecting flow (no sub-commands).

### Modes

| Mode | Trigger | Description |
|------|---------|-------------|
| Dogfood | Inside coherence repo | Read-only validation of templates, hooks, examples |
| Scaffold | No SPEC files found (or `scaffold` arg) | Interactive wizard — generates CLAUDE.md, SPEC docs, hooks |
| Setup | SPEC files exist but CLAUDE.md lacks refs | Offers to add spec references to CLAUDE.md |
| Drift | Default (SPEC files present) | Invokes drift-detector agent, checks SPEC-PRINCIPLES.md |
| Plan Review | `plan` argument | Invokes spec-reviewer agent against current plan |
| Fix | `fix` argument | Drift mode + auto-apply fixes |

### Arguments

| Argument | Effect |
|----------|--------|
| _(none)_ | Auto-detect mode |
| `plan` | Plan review mode |
| `fix` | Drift mode + auto-fix |
| `scaffold` | Force scaffold mode |
| `--verbose` | Show all CURRENT items |

### File Locations

| Copy | Location |
|------|----------|
| Template | `template/.claude/skills/coherence/SKILL.md` |
| Plugin | `plugins/coherence-plugin/skills/coherence/SKILL.md` |

## Skill Protocol

Skill definitions live in `skills/<name>/SKILL.md` with YAML front matter:

```yaml
---
name: skill-name
description: What this skill does.
user_invocable: true
arguments: "[optional arguments]"
---
```

### Front Matter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Slash command name (`coherence` -> `/coherence`) |
| `description` | Yes | What the skill does |
| `user_invocable` | Yes | Must be `true` for user-facing skills |
| `arguments` | No | Description of accepted arguments |

## Scaffold Mode Phases

The scaffold mode (replaces old `init` wizard) runs through 7 phases:

| Phase | Name | Description |
|-------|------|-------------|
| 0 | Project Scan | Silently detect stack, framework, tests, structure |
| 1 | Project Classification | Ask project type (web, API, CLI, infra, writing, marketing, research) |
| 2 | Constraint Discovery | Ask 2-3 questions adapted to project type |
| 3 | Enforcement Preferences | Ask whether to generate SPEC documents |
| 4 | Summary & Confirmation | Present what will be generated, get approval |
| 5 | Generate Files | Create hooks, CLAUDE.md, settings, SPECs |
| 6 | Verify | Syntax-check hooks, cross-reference settings, placeholder check |
| 7 | Register & Journal | Upsert repo in registry, write coherence-state.json, append JSONL |

## Plugin Distribution

The `/coherence` skill is distributed as a Claude Code plugin:

- Plugin manifest: `plugins/coherence-plugin/.claude-plugin/plugin.json`
- Marketplace listing: `marketplace.json`
- Install command: `claude plugin add --from https://github.com/viewyonder/coherence`
- Homepage: `https://coherence.viewyonder.com`

## Constraints

These constraints are falsifiable — each can be verified mechanically.

1. **User-invocable**: The skill's front matter has `user_invocable: true`. Verified by: `grep "user_invocable:" template/.claude/skills/coherence/SKILL.md` should show `true`.
2. **Agent cross-references valid**: Drift mode references `drift-detector` (exists), plan review mode references `spec-reviewer` (exists). Verified by: `ls template/.claude/agents/drift-detector.md template/.claude/agents/spec-reviewer.md`.
3. **Skill count**: There is 1 skill directory in `template/.claude/skills/` (coherence). Verified by: `ls -d template/.claude/skills/*/SKILL.md | wc -l` should return 1.
4. **Plugin copy matches template**: The plugin copy and template copy are identical. Verified by: `diff template/.claude/skills/coherence/SKILL.md plugins/coherence-plugin/skills/coherence/SKILL.md` should produce no output.
5. **Plugin metadata consistent**: `marketplace.json` and `plugin.json` both reference the same homepage URL. Verified by: `grep "homepage" marketplace.json plugins/coherence-plugin/.claude-plugin/plugin.json`.
6. **Registry schema**: The registry file uses `{ "version": 1, "repos": [...] }`. Verified by: scaffold mode creates this structure.

---

*This is a SPEC document. It describes what the code **does**, not what it should do. If the code contradicts this document, either the code has drifted or this document needs updating. Run `/coherence` to detect discrepancies.*
