---
name: config
description: Show local project configuration — hooks, agents, skills, SPEC documents, and project files.
user_invocable: true
---

# /coherence:config

Show a unified overview of the local Coherence project configuration — hooks, agents, skills, SPEC documents, and project files.

### Usage

```
/coherence:config
```

### Instructions

#### Step 1: Locate Project Root

Determine the current repo root using `git rev-parse --show-toplevel` (fall back to `pwd`).

- If no `.claude/` directory exists: report "No .claude/ directory found. Run `/coherence:init` to set up." and stop.

#### Step 2: Read Settings

Read `.claude/settings.local.json` in the project root.

- If the file exists: count unique hook commands across all matchers, note whether `PreToolUse` and `PostToolUse` sections are present.
- If the file does not exist: note "not found".

#### Step 3: Inventory Hooks

List all `.cjs` and `.js` files in `.claude/hooks/`. Skip files whose names start with `_` (e.g., `_log.cjs`) — these are shared utilities, not hooks.

For each hook file, determine its status:
- **active**: file exists on disk AND is registered in `settings.local.json` (its filename appears in a hook command)
- **orphaned**: file exists on disk but is NOT registered in `settings.local.json`
- **missing**: registered in `settings.local.json` but file does NOT exist on disk

Sort alphabetically within each status group. Present active hooks first, then orphaned, then missing.

#### Step 4: Inventory Agents

List all `.md` files in `.claude/agents/`. Skip `README.md`.

#### Step 5: Inventory Skills

List subdirectories in `.claude/skills/` that contain a `SKILL.md` file. For each, read the YAML front matter to extract `name` and `description`.

#### Step 6: Inventory SPEC Documents

List files matching `docs/SPEC-*.md`. Count them, excluding `SPEC-TEMPLATE.md`. Note whether the template file is present.

#### Step 7: Check Project Files

- Does `CLAUDE.md` exist at the project root?
- If so, does it contain `{{` (indicating unconfigured placeholders)?
- Does `MEMORY.md` exist at the project root?

#### Step 8: Present Report

```
Coherence Project Config
=========================

Project: /path/to/repo

settings.local.json:  found (N hooks across M matchers)
                      PreToolUse: yes   PostToolUse: yes

Hooks (.claude/hooks/):
  ● forbidden-imports.cjs     active
  ● boundary-guard.cjs        active
  ○ style-guard.cjs           orphaned (not in settings.local.json)
  ✗ test-gate.cjs             missing (registered but file not found)
  N active, M orphaned, P missing

Agents (.claude/agents/):
  architecture-reviewer.md
  drift-detector.md
  N agents

Skills (.claude/skills/):
  coherence       "Coherence guardrails system — init, check..."
  N skills

SPEC Documents (docs/):
  SPEC-API-SURFACE.md
  SPEC-DATA-MODELS.md
  Template: SPEC-TEMPLATE.md
  N specs (+ template)

Project Files:
  CLAUDE.md:    found, configured
  MEMORY.md:    found

For details:  /coherence:hook    (hook enforcement levels and matchers)
              /coherence:spec    (SPEC verification metadata)
              /coherence:status  (global install state and registry)
```

Formatting rules:
- Use `●` for active hooks, `○` for orphaned hooks, `✗` for missing hooks
- Sort alphabetically within each status group: active first, then orphaned, then missing
- For CLAUDE.md status: "found, configured" (no placeholders), "found, has placeholders" (contains `{{`), or "not found"
- For MEMORY.md: "found" or "not found"
- Truncate skill descriptions to ~60 characters if longer
- If a category is empty (e.g., no agents), show "none" instead of an empty list
- The "For details" footer always appears, pointing users to related sub-commands
