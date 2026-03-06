# Coherence Reference Guide

Quick-reference for every file Coherence touches, plus full uninstall instructions.

---

## File Map

### Plugin files (source repo)

These power the Coherence plugin itself. Users don't edit these directly.

| File | Purpose |
|------|---------|
| `.claude-plugin/marketplace.json` | Marketplace listing metadata |
| `plugins/coherence-plugin/.claude-plugin/plugin.json` | Plugin metadata (name, version, description) |
| `plugins/coherence-plugin/skills/init/SKILL.md` | `/coherence:init` — scaffold a project |
| `plugins/coherence-plugin/skills/check-principles/SKILL.md` | `/coherence:check-principles` — validate CLAUDE.md principles |
| `plugins/coherence-plugin/skills/check-drift/SKILL.md` | `/coherence:check-drift` — detect architectural drift |
| `plugins/coherence-plugin/skills/test-runner/SKILL.md` | `/coherence:test-runner` — run tests with compliance checks |
| `plugins/coherence-plugin/skills/hook/SKILL.md` | `/coherence:hook` — manage hooks |
| `plugins/coherence-plugin/skills/spec/SKILL.md` | `/coherence:spec` — manage SPEC documents |
| `plugins/coherence-plugin/skills/config/SKILL.md` | `/coherence:config` — view/edit configuration |
| `plugins/coherence-plugin/skills/history/SKILL.md` | `/coherence:history` — view activity log |
| `plugins/coherence-plugin/skills/status/SKILL.md` | `/coherence:status` — show installation status |
| `plugins/coherence-plugin/skills/help/SKILL.md` | `/coherence:help` — usage reference |

### Template files (copied by `/coherence:init`)

These are the source templates that get copied and customized into user projects.

**Hooks** — `template/.claude/hooks/`

| File | Type | Purpose |
|------|------|---------|
| `_log.cjs` | Utility | Shared logging helper (not a hook itself) |
| `README.md` | Docs | Hook documentation |
| `forbidden-imports.cjs` | Blocking | Prevents use of banned imports/packages |
| `required-prefix.cjs` | Blocking | Enforces file path prefixes for new files |
| `boundary-guard.cjs` | Blocking | Blocks cross-boundary imports between layers |
| `test-gate.cjs` | Blocking | Requires tests before allowing certain changes |
| `data-isolation.cjs` | Warning | Warns on direct DB access outside data layer |
| `delegation-check.js` | Warning | Warns when tasks should be delegated to agents |
| `style-guard.cjs` | Warning | Warns on style/convention violations |
| `terminology-check.cjs` | Warning | Warns on use of non-standard terminology |
| `test-suggest.cjs` | Informational | Suggests tests for changed code |
| `change-suggest.cjs` | Informational | Suggests related changes |
| `state-flow.cjs` | Informational | Reports state transition information |

**Agents** — `template/.claude/agents/`

| File | Purpose |
|------|---------|
| `README.md` | Agent documentation |
| `code-reviewer.md` | General code review |
| `consistency-reviewer.md` | Cross-file consistency checks |
| `security-auditor.md` | Security vulnerability scanning |
| `architecture-reviewer.md` | Architecture compliance review |
| `drift-detector.md` | Detects drift from SPEC documents |

**Skills** — `template/.claude/skills/`

| File | Purpose |
|------|---------|
| `README.md` | Skills documentation |
| `coherence/SKILL.md` | Monolithic dispatcher (`/coherence <sub-command>`) |

**Other template files**

| File | Purpose |
|------|---------|
| `template/CLAUDE.md` | Project instructions template with `{{PLACEHOLDER}}` markers |
| `template/.claude/.gitignore` | Gitignore for `.claude/` directory |
| `template/docs/SPEC-TEMPLATE.md` | Blank SPEC document template |
| `template/docs/MEMORY.md` | Memory document template |

### Per-project files (generated in user's repo)

Created by `/coherence:init` (or `/coherence init`). These live in the user's project repository.

| File/Directory | Purpose |
|----------------|---------|
| `.claude/settings.local.json` | Hook registrations (PreToolUse/PostToolUse matchers) |
| `.claude/hooks/` | Selected hooks, customized with project-specific configuration |
| `.claude/agents/` | Agent definitions |
| `.claude/skills/coherence/SKILL.md` | Monolithic dispatcher skill |
| `.claude/.gitignore` | Keeps generated files out of version control |
| `CLAUDE.md` | Filled-in project instructions (placeholders replaced) |
| `docs/SPEC-*.md` | Optional SPEC documents defining architectural constraints |

### Global files (user-wide)

These affect all repos and Claude Code sessions. Stored outside any project.

| File/Directory | Purpose |
|----------------|---------|
| `~/.claude/settings.json` | Contains `enabledPlugins` and `extraKnownMarketplaces` entries for Coherence |
| `~/.claude/coherence/repos.json` | Registry of all repos where Coherence is installed |
| `~/.claude/coherence-log-enabled` | Marker file that enables activity logging |
| `~/.claude/plugins/cache/viewyonder-coherence/` | Cached plugin files |

---

## Uninstall Guide

Coherence touches both global (user-wide) and per-project files. Follow all steps for a complete removal.

> **Warning:** Steps 1-4 affect all repos and Claude Code sessions, not just the current project.

### Step 1: Disable the plugin

In Claude Code:

```
/plugin disable coherence
```

This stops the plugin from running but does not remove its files.

### Step 2: Uninstall the plugin

In Claude Code:

```
/plugin uninstall coherence
```

Alternatively, use the plugin management UI in Claude Code settings.

### Step 3: Remove the marketplace entry

Edit `~/.claude/settings.json` and remove the Coherence entry from `extraKnownMarketplaces` (if present). Also remove it from `enabledPlugins` if the uninstall step didn't already.

### Step 4: Clean global files

Delete the following:

```bash
# Coherence registry (list of repos where it's installed — read this first if
# you need to know which projects to clean up in Step 5)
rm -rf ~/.claude/coherence/

# Activity logging marker
rm -f ~/.claude/coherence-log-enabled

# Cached plugin files
rm -rf ~/.claude/plugins/cache/viewyonder-coherence/
```

### Step 5: Clean per-project files

Repeat for each repo that had Coherence installed (check `repos.json` from Step 4 before deleting it).

**Safe to delete** (generated by Coherence, no user content):

```bash
rm -f .claude/settings.local.json
rm -rf .claude/hooks/
rm -rf .claude/agents/
rm -rf .claude/skills/coherence/
rm -f .claude/.gitignore
```

If `.claude/settings.local.json` contains non-Coherence settings, edit it manually to remove only the Coherence hook entries instead of deleting the file.

If `.claude/.gitignore` contains non-Coherence entries, edit it instead of deleting it.

**May contain user content** (review before deleting):

```bash
# These files may have been customized with project-specific content.
# Review before removing.
rm -f CLAUDE.md
rm -f docs/SPEC-*.md
rm -f docs/MEMORY.md
```

After cleanup, remove the empty `.claude/` directory if nothing else remains in it:

```bash
rmdir .claude 2>/dev/null
```
