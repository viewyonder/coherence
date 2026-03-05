---
name: hook
description: List all installed Coherence hooks with their enforcement levels, tool matchers, and file status.
user_invocable: true
---

# /coherence:hook

List all installed Coherence hooks with their enforcement levels, tool matchers, and file status.

### Usage

```
/coherence:hook
```

### Instructions

#### Step 1: Read Settings

Read `settings.local.json` in the current repo's `.claude/` directory.

- If no `.claude/settings.local.json` exists: report "No settings.local.json found. Run `/coherence:init` to set up." and stop.

#### Step 2: Parse Hook Entries

Parse all `hooks.PreToolUse` and `hooks.PostToolUse` entries from the settings file.

- If no hooks are registered (no `PreToolUse` or `PostToolUse` entries, or all arrays empty): report "No hooks registered." and stop.

For each matcher entry, collect:
- The matcher name(s) (e.g., "Edit", "Write", "Bash")
- Each hook command in the matcher's `hooks` array

#### Step 3: Check Hook Files

For each hook command found, extract the `.cjs`/`.js` file path from the command string. Check if the file exists on disk.

#### Step 4: Read Hook Metadata

For each hook file that exists, read the first comment block (JSDoc header or leading comments) to extract:
- **Enforcement level**: Look for keywords "block"/"blocking", "warn"/"warning", or "info"/"informational" in the description or `@enforcement` tag
- **One-line purpose**: The first sentence of the description

If the file is missing, mark it as such. If no enforcement level can be determined from the header, infer from the hook's position: PreToolUse hooks that output `"decision": "block"` are BLOCK, those that output `"message"` are WARN. PostToolUse hooks are INFO.

#### Step 5: Present Report

Group hooks by PreToolUse vs PostToolUse, then by matcher. Use this format:

```
Coherence Hooks
================

PreToolUse (N hooks):
  Edit, Write:
    ● forbidden-imports.cjs    BLOCK   Block runtime-inappropriate APIs
    ● boundary-guard.cjs       BLOCK   Enforce module boundaries
    ● data-isolation.cjs       WARN    Warn on unfiltered DB queries
    ...
  Bash:
    ● test-gate.cjs            BLOCK   Block commits without tests

PostToolUse (N hooks):
  Edit, Write:
    ○ test-suggest.cjs         INFO    Suggest running related tests
    ○ change-suggest.cjs       INFO    Suggest related follow-up actions

To add a hook:  Create a .cjs file in .claude/hooks/ and register it in .claude/settings.local.json
To remove a hook:  Delete its entry from settings.local.json (optionally delete the .cjs file)
To change which tools a hook runs on:  Edit the "matcher" entries in settings.local.json
```

Formatting rules:
- Use `●` for PreToolUse hooks, `○` for PostToolUse hooks
- Enforcement level is one of: `BLOCK`, `WARN`, `INFO`
- If a hook file is missing from disk, use `✗` instead of `●`/`○` and append `FILE MISSING`
- Group matchers that share the same hook set (e.g., "Edit, Write:" when both have identical hooks)
- Count N as the total number of unique hook files (not counting duplicates across matchers)
