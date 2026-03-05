---
name: check-principles
description: Architecture compliance review against CLAUDE.md principles — checks staged changes, specific paths, or the entire codebase.
user_invocable: true
arguments: "[path | --all]"
---

# /coherence:check-principles

Runs an architecture compliance check against the principles documented in CLAUDE.md.

### Usage

```
/coherence:check-principles              # Check staged changes
/coherence:check-principles src/api/     # Check specific path
/coherence:check-principles --all        # Check entire codebase
```

### Instructions

Use the `architecture-reviewer` agent to perform a systematic review.

#### Scope Resolution

1. If no argument: check staged changes (`git diff --cached --name-only`)
2. If path argument: check all files under that path
3. If `--all`: check the entire `src/` directory

#### What It Checks

**Security Principles** — Input validation, data isolation, audit trails
**Boundary Principles** — Handler delegation, module separation
**Performance Principles** — Hot path awareness, runtime constraints
**Propagation Principles** — State flow direction, explicit side effects

### Output

A structured compliance report with per-principle status and any violations with fix recommendations. See the `architecture-reviewer` agent for the full output format.

### Logging

After producing the report, if `.claude/coherence-log-enabled` exists, append a SKILL log line to `.claude/coherence.log`:
```
<timestamp>  SKILL  check-principles          —                         N violations found
```
