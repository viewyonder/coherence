---
name: status
description: Show global Coherence install state — plugin config, registered repos, and stale entries.
user_invocable: true
arguments: "[--prune]"
---

# /coherence:status

Show the current Coherence install state — global plugin config, registered repos, and stale entries.

## Constants

| Name | Value | Description |
|------|-------|-------------|
| `REGISTRY_DIR` | `~/.claude/coherence` | Directory for Coherence global state |
| `REGISTRY_FILE` | `~/.claude/coherence/repos.json` | Tracks repos where Coherence is installed |
| `REGISTRY_VERSION` | `1` | Schema version for the registry file |
| `PLUGIN_NAME` | `coherence` | Plugin name used in `enabledPlugins` and MCP entries |
| `MARKETPLACE_PATTERN` | `viewyonder/coherence` or `viewyonder-coherence` | Patterns to match in `enabledPlugins` and `extraKnownMarketplaces` |

### Usage

```
/coherence:status              # Show install state
/coherence:status --prune      # Remove stale registry entries
```

### Instructions

#### Step 1: Read Global State

Check for Coherence presence in global Claude Code configuration:

1. **Plugin registration** — Read `~/.claude/settings.json`. Look for `MARKETPLACE_PATTERN` in `enabledPlugins` array and `extraKnownMarketplaces` array. Report whether each is present.
2. **MCP servers** — Read `~/.claude.json`. Look for any MCP server entries containing `PLUGIN_NAME`. Report whether present.

If neither file exists, report "No global Coherence configuration found."

#### Step 2: Read Registry

1. Read `REGISTRY_FILE` (`~/.claude/coherence/repos.json`)
2. If missing: report "No registry file found. Run `/coherence:init` in a repo to create one."
3. For each entry in `repos[]`:
   - Check if the path still exists on disk (directory exists)
   - Check if `.claude/` exists at that path
   - Mark entries where the path no longer exists as **stale**

#### Step 3: Prune (if `--prune`)

If the `--prune` flag is passed:
1. Remove all stale entries (paths that don't exist on disk) from `repos[]`
2. Write the updated registry back to `REGISTRY_FILE`
3. Report how many entries were removed

#### Step 4: Report

Present a structured report:

```
Coherence Status Report
========================

Global Install:
  Plugin enabled:       yes/no
  Marketplace listed:   yes/no
  MCP servers:          N entries

Registered Repos (N total, M stale):
  ✓ /path/to/repo-1         registered 2026-01-15   last seen 2026-03-01
  ✓ /path/to/repo-2         registered 2026-02-20   last seen 2026-03-03
  ✗ /path/to/old-repo       registered 2026-01-01   STALE (path not found)

Current repo: /path/to/current
  Registered: yes/no
  Hooks in settings.local.json: N entries
```

If stale entries exist and `--prune` was not passed, suggest: "Run `/coherence:status --prune` to clean up stale entries."
