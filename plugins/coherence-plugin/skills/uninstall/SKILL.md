---
name: uninstall
description: Remove Coherence from the current repo — cleans hook registrations, registry entry, and optionally global config and project files.
user_invocable: true
arguments: "[--force] [--purge]"
---

# /coherence:uninstall

Remove Coherence hook registrations from the current repo and optionally clean up global configuration.

## Constants

| Name | Value | Description |
|------|-------|-------------|
| `REGISTRY_DIR` | `~/.claude/coherence` | Directory for Coherence global state |
| `REGISTRY_FILE` | `~/.claude/coherence/repos.json` | Tracks repos where Coherence is installed |
| `PLUGIN_NAME` | `coherence` | Plugin name used in `enabledPlugins` and MCP entries |
| `MARKETPLACE_PATTERN` | `viewyonder/coherence` or `viewyonder-coherence` | Patterns to match in `enabledPlugins` and `extraKnownMarketplaces` |
| `PLUGIN_CACHE_DIR` | `~/.claude/plugins/cache/viewyonder-coherence` | Cached plugin directory to remove on global cleanup |

### Usage

```
/coherence:uninstall                  # Remove from current repo
/coherence:uninstall --force          # Remove from current repo + global cleanup regardless of other repos
/coherence:uninstall --purge          # Remove from current repo + delete all Coherence project files
/coherence:uninstall --force --purge  # Full removal: global cleanup + delete project files
```

### Important

Without `--purge`, uninstall does **NOT** delete `.claude/hooks/`, `.claude/agents/`, `.claude/skills/coherence/`, or Coherence sections in `CLAUDE.md` — those contain user-customized content. It only cleans `settings.local.json` hook registrations and global config entries.

With `--purge`, these project files are also deleted after confirmation.

### Instructions

#### Step 1: Confirm Repo Path

Determine the current repo root using `git rev-parse --show-toplevel` (fall back to `pwd`).
Inform the user: "Uninstalling Coherence from: /path/to/repo"

#### Step 2: Remove from Registry

1. Read `REGISTRY_FILE`. If missing or invalid, skip this step with a note.
2. Remove the entry matching the current repo path from `repos[]`.
3. Write the updated registry back.

#### Step 3: Clean Local settings.local.json

1. Read `.claude/settings.local.json` in the current repo. If missing, skip with a note.
2. Walk through `hooks.PreToolUse[]` and `hooks.PostToolUse[]` matchers.
3. Remove any hook entry where the `command` string contains `.claude/hooks/` (Coherence-generated hooks).
4. If a matcher's `hooks` array becomes empty after removal, remove the entire matcher object.
5. If `PreToolUse` or `PostToolUse` arrays become empty, remove them.
6. If the `hooks` object becomes empty, remove it.
7. If the entire settings object becomes `{}`, delete the file.
8. Otherwise, write the cleaned settings back.

Report what was removed (e.g., "Removed 6 hook entries from settings.local.json").

#### Step 4: Auto-Prune Stale Registry Entries

After removing the current repo, also prune any stale entries (paths that don't exist on disk) from the registry. Report if any were pruned.

#### Step 5: Check Remaining Repos

Count remaining (non-stale) entries in the registry.

- If remaining > 0 and `--force` was **not** passed:
  - Show the remaining repos
  - Inform: "Coherence is still installed in N other repo(s). Global config left intact."
  - Suggest: "Run `/coherence:uninstall --force` to remove global config regardless."
  - **Stop here** — do not proceed to global cleanup.
- If remaining == 0 or `--force` was passed: proceed to Step 6.

#### Step 6: Global Cleanup

Only reached when no repos remain in the registry, or `--force` was passed.

1. **`~/.claude/settings.json`**: Remove any `enabledPlugins` entry matching `MARKETPLACE_PATTERN`. Remove any `extraKnownMarketplaces` entry matching `MARKETPLACE_PATTERN`. If either array becomes empty, remove the key. Write back.
2. **`~/.claude.json`**: Remove any MCP server entries containing `PLUGIN_NAME`. Write back.
3. **Registry**: Delete `REGISTRY_FILE` and `REGISTRY_DIR` (only if directory is empty after file deletion).
4. **Plugin cache**: Remove `PLUGIN_CACHE_DIR` (`~/.claude/plugins/cache/viewyonder-coherence`) if it exists.

Report each action taken.

#### Step 7: Purge Project Files (--purge only)

Only executed when `--purge` is passed. Runs after local cleanup (Step 3) regardless of whether global cleanup (Step 6) was reached.

**Confirmation**: Before deleting anything, list the files/directories that will be removed and ask the user to confirm: "This will permanently delete Coherence project files. Continue? (yes/no)"

If confirmed, delete the following from the current repo root:

1. **`.claude/hooks/`** — All Coherence-generated hook scripts. Delete the entire directory.
2. **`.claude/agents/`** — All Coherence agent definitions. Delete the entire directory.
3. **`.claude/skills/coherence/`** — The Coherence skill directory. Delete the skill subdirectory only, not `.claude/skills/` itself (other skills may exist).
4. **`docs/SPEC-*.md`** — All SPEC documents except `SPEC-TEMPLATE.md`. List each file deleted.
5. **`.claude/coherence.log`** — Activity log file, if present.
6. **`.claude/coherence-log-enabled`** — Logging flag file, if present.

**Do NOT delete**:
- `CLAUDE.md` — may contain non-Coherence content the user added. Instead, inform: "CLAUDE.md was left intact. Remove Coherence sections manually if desired."
- `.claude/settings.local.json` — already handled in Step 3.
- `.claude/` itself — other tools may use it.
- `docs/` itself — may contain non-SPEC documents.

Report each file/directory deleted.

#### Step 8: Summary

Present a structured summary:

```
Coherence Uninstall Summary
=============================

Local (repo: /path/to/repo):
  settings.local.json:  cleaned (N hooks removed) / already clean / not found
  Registry entry:       removed / not found

Global:
  enabledPlugins:       removed / skipped (N repos remain)
  extraKnownMarketplaces: removed / skipped
  MCP servers:          removed / skipped
  Registry:             deleted / skipped
  Plugin cache:         removed / not found / skipped

Purge:
  .claude/hooks/             deleted (N files) / skipped
  .claude/agents/            deleted (N files) / skipped
  .claude/skills/coherence/  deleted / skipped
  docs/SPEC-*.md             deleted (N files) / skipped
  .claude/coherence.log      deleted / not found / skipped
  CLAUDE.md                  left intact (remove Coherence sections manually)
```

If `--purge` was not passed, omit the Purge section and append:

```
Note: .claude/hooks/, .claude/agents/, .claude/skills/, and CLAUDE.md were
left intact — they contain your customized guardrails configuration.
Use --purge to remove these files.
```

#### Edge Cases

- **No `.claude/` directory**: Skip local cleanup, still remove from registry and check global.
- **Missing or corrupt registry**: Proceed with local cleanup. Create a fresh registry if needed for removal tracking, or skip registry steps with a warning.
- **Already-clean entries**: If `settings.local.json` has no Coherence hooks, report "already clean" rather than failing.
- **`--force` with stale warnings**: Show stale entries that were pruned as part of the summary.
- **`--purge` with no project files**: If `.claude/hooks/` etc. don't exist, report "not found" per item rather than failing.
- **`--purge` declined**: If the user declines the confirmation prompt, skip all purge deletions and report "purge cancelled by user" in the summary.
