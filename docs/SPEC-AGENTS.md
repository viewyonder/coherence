# SPEC-AGENTS: Agent System

> **Last verified**: 2026-04-05
> **Verified by**: manual review
> **Verification method**: file listing + source inspection

## Overview

Agents are specialized personas that Claude Code can invoke for focused tasks. Each agent has a defined role, constrained tool access, and a structured output format. All agents live in `template/.claude/agents/`.

## Components

There are 5 agents. All are read-only (no Write or Edit access).

| Agent | File | Model | Invoked By |
|-------|------|-------|------------|
| drift-detector | `template/.claude/agents/drift-detector.md` | sonnet | `/coherence` (drift mode) |
| spec-reviewer | `template/.claude/agents/spec-reviewer.md` | sonnet | `/coherence plan` |
| code-reviewer | `template/.claude/agents/code-reviewer.md` | sonnet | Automatic (significant code changes) |
| consistency-reviewer | `template/.claude/agents/consistency-reviewer.md` | sonnet | Manual invocation / content review |
| security-auditor | `template/.claude/agents/security-auditor.md` | sonnet | Manual invocation (security-critical code) |

## Agent Protocol

Agent definitions are markdown files with YAML front matter:

```yaml
---
name: agent-name
description: When to use this agent.
tools: Read, Grep, Glob, Bash
model: sonnet
---
```

### Front Matter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier (kebab-case) |
| `description` | Yes | When Claude Code should invoke this agent |
| `tools` | Yes | Comma-separated list of allowed tools |
| `model` | No | Model to use (`sonnet`, `opus`, `haiku`) |

## Role Summaries

### drift-detector
Compares SPEC documents — including SPEC-PRINCIPLES.md — against the actual codebase to detect architectural drift. Reads every SPEC document, verifies falsifiable claims and principle check methods against code, and produces a CURRENT/DRIFTED/UNDOCUMENTED report. Used by `/coherence` in drift mode.

### spec-reviewer
Reviews plans against SPEC constraints and architectural principles. Reads all SPEC documents, extracts constraints, compares against the current plan file, and classifies each constraint as ALIGNED/AT_RISK/VIOLATED. Used by `/coherence plan`.

### code-reviewer
Expert code review specialist. Reviews for quality, security vulnerabilities, and best practices. Use proactively after significant code changes.

### consistency-reviewer
Reviews content files for terminology, style, voice, and structural consistency. Checks product naming, tone/formality, heading hierarchy, cross-references, and factual accuracy across documents. Designed for writing, documentation, marketing, and research projects.

### security-auditor
Security specialist focused on OWASP vulnerabilities, injection attacks, and unsafe coding practices. Use when reviewing security-critical code.

## Constraints

These constraints are falsifiable — each can be verified mechanically.

1. **All read-only**: Every agent's `tools` field contains only `Read, Grep, Glob, Bash` — no `Write` or `Edit`. Verified by: `grep "^tools:" template/.claude/agents/*.md` should show no Write or Edit.
2. **Structured output**: Every agent includes an `## Output Format` section defining its report structure. Verified by: `grep -l "Output Format" template/.claude/agents/*.md` should return 5 files.
3. **Model specified**: Every agent specifies `model: sonnet` in front matter. Verified by: `grep "^model:" template/.claude/agents/*.md` should return 5 results.
4. **Agent count**: There are exactly 5 agent files (excluding README.md). Verified by: `ls template/.claude/agents/*.md | grep -v README | wc -l` should return 5.

---

*This is a SPEC document. It describes what the code **does**, not what it should do. If the code contradicts this document, either the code has drifted or this document needs updating. Run `/coherence` to detect discrepancies.*
