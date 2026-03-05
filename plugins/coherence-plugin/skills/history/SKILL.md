---
name: history
description: View the Coherence activity log and control logging — show recent entries, enable/disable, clear, or open the full log.
user_invocable: true
arguments: "[--on | --off | --clear | --open | --last N]"
---

# /coherence:history

View the Coherence activity log and control logging. Hooks log BLOCK and WARN events; skills log SKILL events. Logging is opt-in via a sentinel file.

### Usage

```
/coherence:history              # Show status + last 20 entries
/coherence:history --on         # Enable logging
/coherence:history --off        # Disable logging
/coherence:history --clear      # Clear the log
/coherence:history --open       # Open log in $EDITOR (or display with Read)
/coherence:history --last 50    # Show last 50 entries
```

### Instructions

#### Step 1: Locate Project Root

Determine the current repo root using `git rev-parse --show-toplevel` (fall back to `pwd`).

- If no `.claude/` directory exists: report "No .claude/ directory found. Run `/coherence:init` to set up." and stop.

#### Step 2: Handle Flags

Check the arguments for flags:

- **`--on`**: Create the sentinel file `.claude/coherence-log-enabled` (empty file). Report "Logging enabled." and stop.
- **`--off`**: Delete `.claude/coherence-log-enabled` if it exists. Report "Logging disabled." and stop.
- **`--clear`**: Delete `.claude/coherence.log` if it exists. Report "Log cleared." and stop.
- **`--open`**: If `.claude/coherence.log` exists, use the Read tool to display its full contents. If it doesn't exist, report "No log file found." Stop after displaying.
- **`--last N`**: Set the display count to N (default: 20).

#### Step 3: Check Logging Status

- Check if `.claude/coherence-log-enabled` exists → logging is "enabled" or "disabled"
- Check if `.claude/coherence.log` exists → get file size and line count

#### Step 4: Read Recent Entries

If the log file exists:
1. Read the file contents
2. Take the last N lines (default 20, or as specified by `--last`)
3. Parse each line to extract timestamp, level, source, file, and detail fields

#### Step 5: Compute Summaries

Count entries by level (BLOCK, WARN, SKILL) for two time ranges:
- **Last 24 hours**: entries where timestamp is within the last 24 hours
- **All time**: all entries in the log

#### Step 6: Present Report

```
Coherence History
==================
Logging:   enabled | disabled
Log file:  .claude/coherence.log (N entries, X.X KB) | not found

Recent Activity (last 20):
Time                 Level  Source                    File                      Detail
───────────────────────────────────────────────────────────────────────────────────────
2026-03-03 14:22:01  BLOCK  forbidden-imports         src/api/handler.ts        Node.js fs not available
2026-03-03 14:22:05  WARN   data-isolation            src/db/queries.ts         Query lacks tenant filter
2026-03-03 14:23:12  SKILL  check-drift               —                         3 drift issues found

Summary (last 24h): N blocks, N warnings, N skill runs
Summary (all time): N blocks, N warnings, N skill runs
```

Formatting rules:
- If logging is disabled, show the status but still display any existing log entries
- If the log file doesn't exist or is empty, show "No activity recorded yet." instead of the table
- The table header uses `───` box-drawing characters for the separator line
- Align columns to match the fixed-width format from the log file
- For summaries, use "0" not "none" for empty counts (e.g., "0 blocks, 3 warnings, 1 skill run")
