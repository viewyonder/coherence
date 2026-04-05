# SPEC-{{COMPONENT}}: {{Component Name}}

> **Last verified**: {{YYYY-MM-DD}}
> **Verified by**: {{person or agent}}
> **Verification method**: {{manual review | /coherence | automated}}

## Overview

{{Brief description of what this specification covers.}}

## Components

| Name | File | Description | Status |
|------|------|-------------|--------|
| {{ComponentA}} | `src/path/to/a.ts` | {{What it does}} | Active |
| {{ComponentB}} | `src/path/to/b.ts` | {{What it does}} | Active |

## Configuration

{{If components have configurable options, document them here.}}

| Component | Config Key | Type | Default | Description |
|-----------|-----------|------|---------|-------------|
| {{ComponentA}} | `option1` | `string` | `"default"` | {{What it controls}} |

## Relationships

{{How components relate to each other. Which depends on which?}}

```
ComponentA -> ComponentB -> ComponentC
```

## Constraints

{{Rules that must hold true. Each constraint should be falsifiable — you can check whether it's true by examining the code.}}

1. **{{Constraint name}}**: {{Description}}. Verified by: {{how to check}}.
2. **{{Constraint name}}**: {{Description}}. Verified by: {{how to check}}.

## Change Log

| Date | Change | Author |
|------|--------|--------|
| {{YYYY-MM-DD}} | Initial specification | {{name}} |

---

*This is a SPEC document. It describes what the code **does**, not what it should do. If the code contradicts this document, either the code has drifted or this document needs updating. Run `/coherence` to detect discrepancies.*
