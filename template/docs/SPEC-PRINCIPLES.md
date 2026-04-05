# SPEC-PRINCIPLES: Architectural Principles

> **Last verified**: {{YYYY-MM-DD}}
> **Verified by**: {{person or agent}}
> **Verification method**: {{manual review | /coherence | automated}}

## Overview

This document defines the architectural principles that guide development decisions. Unlike other SPEC documents that describe what exists in code, this document defines what **should** hold true. The drift detector and `/coherence` skill check code against these principles.

## Principles

Each principle is a falsifiable statement. For each one, define what "violation" looks like so it can be checked mechanically.

### {{Category 1: e.g., Security}}

| # | Principle | Violation Looks Like | Check Method |
|---|-----------|---------------------|--------------|
| 1 | {{Every input is hostile}} | {{Raw user input used without validation}} | {{Grep for req.body/req.params usage without adjacent validation}} |
| 2 | {{Audit everything}} | {{State-changing operation with no log/event}} | {{Grep for DB writes not preceded by audit call}} |

### {{Category 2: e.g., Boundaries}}

| # | Principle | Violation Looks Like | Check Method |
|---|-----------|---------------------|--------------|
| 3 | {{Handlers validate and delegate}} | {{Business logic in route handler files}} | {{Check handler files for DB queries or complex conditionals}} |
| 4 | {{Module boundaries are explicit}} | {{Cross-layer imports}} | {{Grep for imports crossing defined boundaries}} |

### {{Category 3: e.g., Performance}}

| # | Principle | Violation Looks Like | Check Method |
|---|-----------|---------------------|--------------|
| 5 | {{Hot paths stay fast}} | {{Sync I/O or deep clones in latency-critical paths}} | {{Check hot path files for fs.readFileSync, JSON.parse(JSON.stringify)}} |

### {{Category 4: e.g., Change Propagation}}

| # | Principle | Violation Looks Like | Check Method |
|---|-----------|---------------------|--------------|
| 6 | {{State flows in one direction}} | {{Child component mutating parent state}} | {{Check for direct store mutation outside designated files}} |
| 7 | {{Side effects are explicit}} | {{DB writes or API calls in unexpected locations}} | {{Grep for fetch/axios/db calls outside service layer}} |

## Constraints

1. **Principles are falsifiable**: Every principle row has a non-empty "Violation Looks Like" and "Check Method" column. Verified by: manual inspection of this document.
2. **Principles are checked**: The drift-detector agent reads this document and verifies each principle's check method against the codebase. Verified by: running `/coherence`.

## Change Log

| Date | Change | Author |
|------|--------|--------|
| {{YYYY-MM-DD}} | Initial principles | {{name}} |

---

*This is a SPEC document. It defines principles the codebase should follow. The drift detector checks code against these principles. If a principle no longer applies, update this document rather than silently ignoring it.*
