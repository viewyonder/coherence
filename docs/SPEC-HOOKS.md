# SPEC-HOOKS: Hook System

> **Last verified**: 2026-02-25
> **Verified by**: manual review
> **Verification method**: file listing + source inspection

## Overview

Hooks are small Node.js programs that run before or after Claude Code executes a tool. They enforce architectural constraints, warn about potential issues, and suggest follow-up actions. All hooks live in `template/.claude/hooks/`.

## Components

There are 11 hooks across three enforcement levels.

### Blocking Hooks (PreToolUse)

| Hook | File | Matcher | Purpose |
|------|------|---------|---------|
| forbidden-imports | `template/.claude/hooks/forbidden-imports.cjs` | Edit, Write | Block runtime-inappropriate APIs |
| required-prefix | `template/.claude/hooks/required-prefix.cjs` | Edit, Write | Enforce route path prefix |
| boundary-guard | `template/.claude/hooks/boundary-guard.cjs` | Edit, Write | Enforce module boundaries |
| test-gate | `template/.claude/hooks/test-gate.cjs` | Bash | Block commits without tests |

### Warning Hooks (PreToolUse)

| Hook | File | Matcher | Purpose |
|------|------|---------|---------|
| data-isolation | `template/.claude/hooks/data-isolation.cjs` | Edit, Write | Warn on unfiltered DB queries |
| delegation-check | `template/.claude/hooks/delegation-check.js` | Edit, Write | Warn on inline business logic |
| style-guard | `template/.claude/hooks/style-guard.cjs` | Edit, Write | Enforce prose style and formatting rules |
| terminology-check | `template/.claude/hooks/terminology-check.cjs` | Edit, Write | Enforce consistent terminology |

### Mixed Hooks (PreToolUse)

| Hook | File | Matcher | Purpose |
|------|------|---------|---------|
| state-flow | `template/.claude/hooks/state-flow.cjs` | Edit, Write | Enforce unidirectional state (blocking for violations, warning for suggestions) |

### Informational Hooks (PostToolUse)

| Hook | File | Matcher | Purpose |
|------|------|---------|---------|
| test-suggest | `template/.claude/hooks/test-suggest.cjs` | Edit, Write | Suggest running related tests |
| change-suggest | `template/.claude/hooks/change-suggest.cjs` | Edit, Write | Suggest related actions |

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
- `Bash` tools: `tool_input` contains `command`

### Output

| Decision | JSON | Effect |
|----------|------|--------|
| **Allow** | *(no output, exit 0)* | Tool proceeds normally |
| **Block** | `{ "decision": "block", "reason": "..." }` | Tool prevented from executing |
| **Warn** | `{ "message": "..." }` | Tool proceeds, agent sees warning |
| **Error** | `{ "error": "..." }` | Tool blocked, shown as error |

### Exit Codes

- `exit(0)` — Hook ran successfully (check stdout for decision)
- `exit(1)` — Hook failed (treated as a block)

## Configuration Pattern

Every hook has a `// === CONFIGURATION ===` block at the top with project-specific constants. Adopters edit these constants for their project. No external config files are needed — hooks are fully self-contained.

```javascript
// === CONFIGURATION ===
const FORBIDDEN_PATTERNS = [
  // project-specific patterns here
];
const SKIP_PATHS = ['/node_modules/', '/dist/'];
// === END CONFIGURATION ===
```

## Matcher Assignments

Hooks are registered in `settings.local.json` under `PreToolUse` or `PostToolUse` sections:

| Matcher | Fires on | Hooks using it |
|---------|----------|----------------|
| `Edit` | Edit tool (modify existing file) | forbidden-imports, required-prefix, boundary-guard, data-isolation, delegation-check, style-guard, terminology-check, state-flow, test-suggest, change-suggest |
| `Write` | Write tool (create/overwrite file) | forbidden-imports, required-prefix, boundary-guard, data-isolation, delegation-check, style-guard, terminology-check, state-flow, test-suggest, change-suggest |
| `Bash` | Bash tool (run commands) | test-gate |

## Constraints

These constraints are falsifiable — each can be verified mechanically.

1. **Self-contained**: Every hook is a single file with no external imports beyond Node.js built-ins (`fs`, `path`). Verified by: `grep -L "require('fs')" template/.claude/hooks/*.cjs` should only return hooks that don't need fs.
2. **Configuration block present**: Every hook has a `// === CONFIGURATION ===` comment. Verified by: `grep -l "CONFIGURATION" template/.claude/hooks/*.cjs template/.claude/hooks/*.js` should return 11 files.
3. **Clean exit**: Every hook calls `process.exit(0)` at the end. Verified by: `grep -l "process.exit(0)" template/.claude/hooks/*.cjs template/.claude/hooks/*.js` should return 11 files.
4. **Valid syntax**: Every hook passes `node -c`. Verified by: `for f in template/.claude/hooks/*.cjs template/.claude/hooks/*.js; do node -c "$f"; done` should produce no errors.
5. **Hook count**: There are exactly 11 hook files. Verified by: `ls template/.claude/hooks/*.cjs template/.claude/hooks/*.js | wc -l` should return 11.

---

*This is a SPEC document. It describes what the code **does**, not what it should do. If the code contradicts this document, either the code has drifted or this document needs updating. Run `/coherence check-drift` to detect discrepancies.*
