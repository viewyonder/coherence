# {{PROJECT_NAME}} - Development Guidelines

## Architecture Overview

This is a **{{RUNTIME}}** application built with {{FRAMEWORK}}. It runs on {{DEPLOYMENT}} and serves as {{PROJECT_DESCRIPTION}}.

**IMPORTANT**: {{RUNTIME_CAVEAT}}

---

## Architectural Principles

### Security

**Every input is hostile.** Validate at system boundaries.
**Audit everything.** Every significant operation produces a traceable record.
**{{ISOLATION_PRINCIPLE}}.**

### Boundaries

**{{BOUNDARY_RULE_1}}.**
**{{BOUNDARY_RULE_2}}.**
**API handlers validate and delegate.** Business logic belongs in `{{CORE_PATH}}`, not `{{API_PATH}}`.

### Performance

**{{HOT_PATH_DESCRIPTION}}.** The `{{HOT_PATH_PATTERN}}` endpoints are latency-critical.
**{{RUNTIME_CONSTRAINTS_PRINCIPLE}}.**

### Change Propagation

**{{STATE_FLOW_PRINCIPLE}}.**
**Side effects are explicit.** They happen in {{SIDE_EFFECT_LOCATIONS}}, not scattered throughout the codebase.

---

## Core Concepts

### {{CONCEPT_1_NAME}}

### {{CONCEPT_2_NAME}}

---

## Local Development

```bash
cp {{ENV_TEMPLATE}} {{ENV_FILE}}        # Copy environment template
{{DEV_COMMAND}}                          # Start dev server
{{BUILD_COMMAND}}                        # Build for production
{{TEST_COMMAND}}                         # Run tests
```

| Service | Port | Notes |
|---------|------|-------|
| {{SERVICE_1}} | {{PORT_1}} | {{NOTES_1}} |
| {{SERVICE_2}} | {{PORT_2}} | {{NOTES_2}} |

---

## Adding New Features

### Routes / Endpoints

1. Create source files: `{{ROUTE_FILE_PATTERN}}`
2. {{BUILD_STEP_IF_NEEDED}}
3. Create route config: `{{ROUTE_CONFIG_PATTERN}}`
4. Register in {{ROUTE_REGISTRY}}

### {{DOMAIN_COMPONENT}}

1. Create file: `{{COMPONENT_PATH}}/my-component.{{EXT}}`
2. Register in `{{COMPONENT_REGISTRY}}`
3. Add tests
4. Update SPEC document

---

## Build Pipeline

```bash
{{BUILD_STAGE_1}}    # {{BUILD_STAGE_1_DESC}}
{{BUILD_STAGE_2}}    # {{BUILD_STAGE_2_DESC}}
{{BUILD_STAGE_3}}    # {{BUILD_STAGE_3_DESC}}
```

**Generated files (DO NOT edit):** {{GENERATED_FILES}}

---

## Runtime Constraints

**DO**: {{DO_1}} · {{DO_2}} · {{DO_3}} · Use env vars via `{{ENV_ACCESS_PATTERN}}`

**DON'T**: {{DONT_1}} · {{DONT_2}} · {{DONT_3}} · Assume persistent state between requests

---

## Testing

```bash
{{TEST_COMMAND}}              # Run all tests
{{TEST_SPECIFIC_COMMAND}}     # Run specific tests
```

---

## Specification Documents (Ground Truth)

SPEC docs are the **authoritative source of truth**. They take precedence over other docs when conflicts arise.

| Spec | Purpose |
|------|---------|
| SPEC-PRINCIPLES.md | Architectural principles — checked by `/coherence` |
| SPEC-{{SPEC_1}}.md | {{SPEC_1_PURPOSE}} |
| SPEC-{{SPEC_2}}.md | {{SPEC_2_PURPOSE}} |

**Drift policy**: If code contradicts a SPEC, update the SPEC and note it in the PR. Run `/coherence` periodically to detect drift.

---

## Documentation Index

| Doc | Purpose |
|-----|---------|
| GETTING-STARTED.md | Quickstart guide |
| ENVIRONMENT.md | All environment variables |
| ARCHITECTURE.md | System design |
| TESTING.md | Test strategy |
| DEPLOYMENT.md | Build and deploy |
