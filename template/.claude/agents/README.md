# Claude Code Agents

Agents are specialized personas that Claude Code can invoke for focused tasks. Each agent has a defined role, tools, and output format.

## How Agents Work

Agent definitions are markdown files with YAML front matter:

```markdown
---
name: my-agent
description: What the agent does and when to use it.
tools: Read, Grep, Glob, Bash
model: sonnet
---

You are a [role description]. Your job is to...

## Process
1. Step one
2. Step two

## Output Format
...
```

### Front Matter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier (kebab-case) |
| `description` | Yes | When Claude Code should invoke this agent |
| `tools` | Yes | Comma-separated list of allowed tools |
| `model` | No | Model to use (`sonnet`, `opus`, `haiku`) |

### Tool Access

- **Read-only agents** (reviewers, detectors): `Read, Grep, Glob, Bash`
- **Write agents** (generators): `Read, Write, Edit, Grep, Glob, Bash`

Review agents should be read-only. They observe and report; they don't change code.

## Agents in This Template

| Agent | Role | Tools | Use When |
|-------|------|-------|----------|
| `architecture-reviewer` | Compliance check against CLAUDE.md principles | Read-only | After changes, before PRs |
| `drift-detector` | Compare SPEC docs against codebase | Read-only | Periodically, after features |
| `code-reviewer` | Quality, security, best practices | Read-only | After significant changes |
| `consistency-reviewer` | Terminology, voice, and structural consistency | Read-only | Content/documentation review |
| `security-auditor` | OWASP-focused vulnerability detection | Read-only | Security-critical code |

## Creating Your Own Agent

1. Create a `.md` file in this directory
2. Add front matter with name, description, tools
3. Write the system prompt with:
   - Role description
   - What to check/do (reference CLAUDE.md principles)
   - Step-by-step process
   - Output format (structured markdown)
4. Reference key files the agent should consult

The agent becomes available to Claude Code automatically.

## Invoking Agents

Agents are invoked via skills (see `skills/README.md`) or by Claude Code's agent system when the task matches the agent's description.

Example: `/coherence check-drift` invokes the `drift-detector` agent.
