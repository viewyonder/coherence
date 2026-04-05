# SPEC-HOOKS: Hook System

> **Last verified**: 2026-04-05
> **Verified by**: manual review
> **Verification method**: file listing + source inspection

## Overview

Hooks are small Node.js programs that run before or after Claude Code executes a tool. The template ships with 1 hook and 1 shared utility in `template/.claude/hooks/`.

## Components

There is 1 hook and 1 utility.

### Hook

| Hook | File | Type | Matcher | Purpose |
|------|------|------|---------|---------|
| spec-drift-nudge | `template/.claude/hooks/spec-drift-nudge.cjs` | PostToolUse | Edit, Write | Nudge user to run `/coherence` after 50 edits or 7 days |

### Utility

| Utility | File | Purpose |
|---------|------|---------|
| _journal | `template/.claude/hooks/_journal.cjs` | Append structured JSONL entries to `.claude/coherence.jsonl` |

## Hook I/O Protocol

### Input

Hooks receive a JSON object on **stdin**:

```json
{
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "/path/to/file.ts",
    "new_string": "the new content",
    "old_string": "the old content"
  }
}
```

- `Edit` tools: `tool_input` contains `file_path`, `old_string`, `new_string`
- `Write` tools: `tool_input` contains `file_path`, `content`

### Output

| Decision | JSON | Effect |
|----------|------|--------|
| **Allow** | *(no output, exit 0)* | Tool proceeds normally |
| **Warn** | `{ "message": "..." }` | Tool proceeds, agent sees warning |

The nudge hook only produces warnings (informational). It never blocks.

### Exit Codes

- `exit(0)` — Hook ran successfully (check stdout for decision)

## Configuration Pattern

The hook has a `// === CONFIGURATION ===` block at the top with project-specific constants:

```javascript
// === CONFIGURATION ===
const EDITS_THRESHOLD = 50;      // Nudge after this many edits
const DAYS_THRESHOLD = 7;        // Nudge after this many days
const THROTTLE_MS = 30 * 60 * 1000; // 30 minutes between nudges
// === END CONFIGURATION ===
```

## JSONL Journal

The `_journal.cjs` utility writes structured entries to `.claude/coherence.jsonl`:

```json
{
  "ts": "2026-04-05T14:22:01.000Z",
  "action": "log-drift-check",
  "source": "skill",
  "summary": "3 drifted, 1 undocumented, 12 current",
  "files": ["docs/SPEC-API.md"],
  "details": { "drifted": 3, "undocumented": 1, "current": 12 }
}
```

Action values: `scaffold`, `log-drift-check`, `plan-review`, `setup`, `nudge`, `fix`

## Matcher Assignments

Hooks are registered in `settings.local.json`:

| Matcher | Fires on | Hook |
|---------|----------|------|
| `Edit` (PostToolUse) | Edit tool | spec-drift-nudge |
| `Write` (PostToolUse) | Write tool | spec-drift-nudge |

## Constraints

These constraints are falsifiable — each can be verified mechanically.

1. **Self-contained**: The hook is a single file with no external imports beyond Node.js built-ins and `_journal.cjs`. Verified by: inspect `require()` calls in the hook file.
2. **Configuration block present**: The hook has a `// === CONFIGURATION ===` comment. Verified by: `grep "CONFIGURATION" template/.claude/hooks/spec-drift-nudge.cjs`.
3. **Clean exit**: The hook calls `process.exit(0)`. Verified by: `grep "process.exit(0)" template/.claude/hooks/spec-drift-nudge.cjs`.
4. **Valid syntax**: The hook passes `node -c`. Verified by: `node -c template/.claude/hooks/spec-drift-nudge.cjs`.
5. **Hook count**: There is exactly 1 hook file (excluding utilities prefixed with `_`). Verified by: `ls template/.claude/hooks/*.cjs | grep -v '^template/.claude/hooks/_' | wc -l` should return 1.

---

*This is a SPEC document. It describes what the code **does**, not what it should do. If the code contradicts this document, either the code has drifted or this document needs updating. Run `/coherence` to detect discrepancies.*
