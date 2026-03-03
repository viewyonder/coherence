# Claude Code Skills

Skills are named workflows that users invoke with a slash command (e.g., `/check-drift`). Each skill defines a multi-step process that Claude Code executes.

## How Skills Work

Skill definitions live in `skills/<name>/SKILL.md` with YAML front matter:

```markdown
---
name: my-skill
description: What this skill does.
user_invocable: true
arguments: "[optional arguments description]"
---

# /my-skill

Instructions for Claude Code to follow when this skill is invoked.
```

### Front Matter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Slash command name (e.g., `check-drift` -> `/check-drift`) |
| `description` | Yes | What the skill does |
| `user_invocable` | Yes | Set to `true` for user-facing skills |
| `arguments` | No | Description of accepted arguments |

## Skills in This Template

All functionality is unified under a single `/coherence` command with sub-commands:

| Command | What It Does |
|---------|--------------|
| `/coherence init [--reset]` | Interactive setup wizard |
| `/coherence check-drift [scope]` | Compare SPEC docs against codebase |
| `/coherence check-principles [path]` | Compliance check against CLAUDE.md |
| `/coherence test-runner [scope]` | Run tests with flexible scope |
| `/coherence config` | Show local project configuration |
| `/coherence help` | Show available sub-commands |

## Creating Your Own Skill

1. Create `skills/<name>/SKILL.md`
2. Add front matter with name, description, user_invocable: true
3. Write instructions for Claude Code to follow
4. Reference agents if the skill delegates to one

Skills can:
- Invoke agents (e.g., `/check-drift` invokes `drift-detector`)
- Run commands directly
- Combine multiple steps into a workflow
- Accept arguments to control scope
