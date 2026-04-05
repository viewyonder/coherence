# Claude Code Hooks

Hooks are small Node.js programs that run before or after Claude Code executes a tool. They enforce architectural constraints, warn about potential issues, and suggest follow-up actions.

## How Hooks Work

### Input

Hooks receive a JSON object on **stdin** with this structure:

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

For `Write` tools, `tool_input` contains `file_path` and `content`.

### Output

Hooks communicate decisions via **stdout** as JSON:

| Decision | JSON | Effect |
|----------|------|--------|
| **Allow** | *(no output, exit 0)* | Tool proceeds normally |
| **Block** | `{ "decision": "block", "reason": "..." }` | Tool is prevented from executing |
| **Warn** | `{ "message": "..." }` | Tool proceeds, agent sees warning |

### Exit codes

- `exit(0)` — Hook ran successfully (check stdout for decision)
- `exit(1)` — Hook failed (treated as a block in some configurations)

## Hooks in This Template

| Hook | Type | Enforcement | Purpose |
|------|------|-------------|---------|
| `spec-drift-nudge.cjs` | Post | Informational | Nudge to run `/coherence` after 50 edits or 7 days |

### Utilities

| File | Purpose |
|------|---------|
| `_journal.cjs` | Shared JSONL journaling — appends entries to `.claude/coherence.jsonl` |

## Writing Your Own Hook

1. Create a `.cjs` or `.js` file in this directory
2. Read JSON from stdin
3. Extract `tool_input.file_path` and `tool_input.content` (or `new_string`, `command`)
4. Check your constraint
5. Output JSON to stdout if there's a violation/warning
6. Exit with code 0

```javascript
#!/usr/bin/env node
const fs = require('fs');
const input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
const filePath = input.tool_input?.file_path || '';
const content = input.tool_input?.content || input.tool_input?.new_string || '';

// Your check here
if (filePath.includes('/src/') && content.includes('FORBIDDEN_THING')) {
  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason: 'Cannot use FORBIDDEN_THING in source files. See CLAUDE.md.',
  }));
}

process.exit(0);
```

Register in `settings.local.json`:

```json
{
  "matcher": "Edit",
  "hooks": [{
    "type": "command",
    "command": "node .claude/hooks/my-hook.cjs",
    "statusMessage": "Checking my constraint..."
  }]
}
```

## Testing Hooks

```bash
echo '{"tool_input":{"file_path":"/src/api/test.ts","content":"const x = require(\"fs\")"}}' | node .claude/hooks/spec-drift-nudge.cjs
```

If the hook warns, you'll see JSON output. If it allows, there's no output.

## Configuration Pattern

Each hook has a `// === CONFIGURATION ===` block at the top with constants you customize for your project. This keeps hooks self-contained — no external config files needed.
