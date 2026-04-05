# Getting Started

Three steps to repo guardrails.

## Install

The Coherence plugin adds a single `/coherence` skill to Claude Code. It auto-detects your project state and generates a complete guardrails system — `CLAUDE.md`, SPEC docs, agents, and a nudge hook — customized to your stack.

### 1. Add the marketplace

```
> /plugin marketplace add viewyonder/coherence
```

### 2. Install the plugin

```
> /plugin install coherence
```

> **Use user scope (the default).** When Claude Code prompts you for a scope, choose `user` — or just press Enter to accept the default. Coherence is designed to work across all your projects: you install the plugin once, then run `/coherence` in each repo to generate project-specific guardrails. If you install with `local` scope, the plugin is locked to a single project and you'll get an "already installed" error when you try to install it elsewhere. See [Plugin scopes](https://coherence.viewyonder.com/plugins#installing) for details.

### 3. Run `/coherence`

Open Claude Code in your project and run:

```
> /coherence
```

### 4. Auto-detect in action

Coherence examines your project and picks the right mode automatically.

1. **Detect** *(automatic)* — Scans for existing SPEC files, CLAUDE.md references, language, framework, and project structure. Determines whether to scaffold, set up, or check drift.
2. **Confirm** *(review)* — Shows what it plans to do. Nothing is written until you confirm.
3. **Execute** *(automatic)* — Writes all files — CLAUDE.md, SPEC docs, agents, nudge hook, and settings — customized to your project.

> **Idempotent.** If you already have a `.claude/` directory, Coherence asks whether to overwrite, merge, or abort. Use `/coherence scaffold` to force a fresh scaffold.

## Alternative: Manual Template

Full control — copy the template and customize everything by hand.

### 1. Copy the template

```bash
cd /path/to/your/project

# Clone the repo (or download the template/ directory)
git clone https://github.com/viewyonder/coherence.git /tmp/ccg

# Copy the .claude directory
cp -r /tmp/ccg/template/.claude .

# Copy CLAUDE.md template
cp /tmp/ccg/template/CLAUDE.md .

# Copy SPEC + memory templates
mkdir -p docs
cp /tmp/ccg/template/docs/*.md docs/
```

### 2. Customize CLAUDE.md

Replace every `{{PLACEHOLDER}}` marker with your project's values. The file has HTML comments explaining each one.

### 3. Configure hooks

The hook has a `// === CONFIGURATION ===` block at the top. Edit the constants for your project's thresholds (edit count, days, throttle interval).

### 4. Update settings.local.json

The file lives at `.claude/settings.local.json` — it registers the nudge hook for Edit and Write tools.

### 5. Create your first SPEC

Copy a SPEC template from `docs/`, fill in your actual components, and run `/coherence` to verify.

## What Happens

After setup, your `.claude/` directory makes architectural constraints active during every development session.

```
You (or Claude) edit files
        ↓
Nudge hook tracks edits
  After 50 edits or 7 days, nudges you to check for drift
        ↓
Run /coherence
  Agents scan the full codebase against SPEC docs and principles
        ↓
Fix any drift found
  Or run /coherence fix to auto-apply corrections
```

## What You Get

Regardless of which path you choose, you end up with a `.claude/` directory that makes architectural constraints active during development.

```
your-project/
  CLAUDE.md                          — project guidelines, populated
  .claude/
    settings.local.json              — hook registration
    hooks/
      spec-drift-nudge.cjs           — nudge after 50 edits or 7 days
      _journal.cjs                   — JSONL activity logging utility
    agents/
      drift-detector.md              — compare SPEC vs code
      spec-reviewer.md               — review plans against SPECs
      code-reviewer.md               — code quality and security review
      consistency-reviewer.md        — content consistency (terminology, voice)
      security-auditor.md            — OWASP-focused vulnerability detection
    skills/
      coherence/                     — single /coherence skill, auto-detecting
  docs/
    SPEC-PRINCIPLES.md               — architectural principles
    SPEC-TEMPLATE.md                 — template for project-specific SPECs
```

## Works with Any Project

`/coherence` auto-detects your language, framework, and project structure. It generates SPEC documents and CLAUDE.md content tailored to your stack — whether you're building a web app, API, CLI, infrastructure, or writing content. The same single hook and agents work across all project types.

## Next Steps

- **`/coherence`** — Run any time to check for drift. Coherence compares every SPEC claim against your codebase and reports what's current, drifted, or undocumented.
- **`/coherence plan`** — Before implementing a plan, run this to review it against your SPEC constraints.
- **`/coherence fix`** — Drift detection plus auto-apply — fixes issues it finds without manual intervention.
- **Edit CLAUDE.md** — The generated file is a starting point. Add your domain concepts, refine principles, document your actual architecture.
- **[Plugin reference](https://coherence.viewyonder.com/plugins)** — Learn about plugin scopes, updates, local testing, and creating your own plugins.
- **[Read the blog post](https://coherence.viewyonder.com/blog/entropy-at-velocity)** — Entropy at Velocity explains the thinking behind this system.
