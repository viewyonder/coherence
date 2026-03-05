---
name: check-drift
description: Compare SPEC specification documents against the actual codebase to detect drift — items marked CURRENT, DRIFTED, or UNDOCUMENTED.
user_invocable: true
arguments: "[scope]"
---

# /coherence:check-drift

Compare SPEC specification documents against the actual codebase to detect drift.

### Usage

```
/coherence:check-drift              # Check everything
/coherence:check-drift api          # Check API surface only
/coherence:check-drift models       # Check data models only
/coherence:check-drift stores       # Check frontend stores only
/coherence:check-drift all          # Check everything (same as no args)
```

### Instructions

Use the `drift-detector` agent to perform the comparison. Pass the scope argument (default: `all`).

The agent will:
1. Read the relevant SPEC document(s) from `docs/SPEC-*.md`
2. Scan the actual codebase
3. Compare and produce a drift report

### SPEC Documents

Customize this table for your project:

| Scope | SPEC Document | Codebase Source |
|-------|--------------|-----------------|
| api | `docs/SPEC-API-SURFACE.md` | Route definitions, handler files |
| models | `docs/SPEC-DATA-MODELS.md` | Model/schema files |
| stores | `docs/SPEC-FRONTEND.md` | Store/state files |

### Output

A structured markdown drift report showing:
- Items that match spec (CURRENT)
- Items that have drifted (DRIFTED)
- Items in code but not in spec (UNDOCUMENTED)
- Recommended actions to resolve drift

### Logging

After producing the report, if `.claude/coherence-log-enabled` exists, append a SKILL log line to `.claude/coherence.log`:
```
<timestamp>  SKILL  check-drift               —                         N drift issues found
```
