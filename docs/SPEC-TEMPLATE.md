# SPEC-TEMPLATE: Template System

> **Last verified**: 2026-02-25
> **Verified by**: manual review
> **Verification method**: file listing + content inspection

## Overview

The `template/` directory contains the copyable template that adopters bring into their own projects. It includes a `.claude/` directory (hooks, agents, skills), a `CLAUDE.md` with placeholder markers, and SPEC/MEMORY document templates.

## Template Directory Structure

```
template/
├── CLAUDE.md                          # Project guidelines template ({{PLACEHOLDER}} markers)
├── .claude/
│   ├── hooks/
│   │   ├── README.md                  # Hook documentation
│   │   ├── forbidden-imports.cjs      # Blocking
│   │   ├── required-prefix.cjs       # Blocking
│   │   ├── boundary-guard.cjs        # Blocking
│   │   ├── test-gate.cjs             # Blocking
│   │   ├── data-isolation.cjs        # Warning
│   │   ├── delegation-check.js       # Warning
│   │   ├── style-guard.cjs           # Warning
│   │   ├── terminology-check.cjs     # Warning
│   │   ├── state-flow.cjs            # Blocking/Warning
│   │   ├── test-suggest.cjs          # Informational
│   │   └── change-suggest.cjs        # Informational
│   ├── agents/
│   │   ├── README.md                  # Agent documentation
│   │   ├── architecture-reviewer.md
│   │   ├── drift-detector.md
│   │   ├── code-reviewer.md
│   │   ├── consistency-reviewer.md
│   │   └── security-auditor.md
│   └── skills/
│       ├── README.md                  # Skill documentation
│       └── coherence/SKILL.md         # Unified: init, check-drift, check-principles, test-runner
├── docs/
│   ├── SPEC-TEMPLATE.md              # Blank SPEC template for adopters
│   └── MEMORY.md                     # Memory document template
```

## Placeholder System

The `template/CLAUDE.md` uses `{{PLACEHOLDER}}` markers that adopters replace with their project's values. Each placeholder appears exactly once (unless it's a repeated structural element).

### Placeholder Inventory

| Placeholder | Purpose |
|-------------|---------|
| `{{PROJECT_NAME}}` | Project name in the title |
| `{{RUNTIME}}` | Production runtime (Node.js, Bun, Deno, Python, etc.) |
| `{{FRAMEWORK}}` | Framework name (Express, Next.js, Django, etc.) |
| `{{DEPLOYMENT}}` | Deployment target (Vercel, AWS, Cloudflare, etc.) |
| `{{PROJECT_DESCRIPTION}}` | One-line project description |
| `{{RUNTIME_CAVEAT}}` | Important runtime clarification |
| `{{ISOLATION_PRINCIPLE}}` | Data isolation rule |
| `{{BOUNDARY_RULE_1}}` | First boundary principle |
| `{{BOUNDARY_RULE_2}}` | Second boundary principle |
| `{{CORE_PATH}}` | Path to business logic |
| `{{API_PATH}}` | Path to API handlers |
| `{{HOT_PATH_DESCRIPTION}}` | Performance-critical path description |
| `{{HOT_PATH_PATTERN}}` | URL patterns that are latency-critical |
| `{{RUNTIME_CONSTRAINTS_PRINCIPLE}}` | Runtime limitation rule |
| `{{STATE_FLOW_PRINCIPLE}}` | State propagation pattern |
| `{{SIDE_EFFECT_LOCATIONS}}` | Where side effects are allowed |
| `{{CONCEPT_1_NAME}}`, `{{CONCEPT_2_NAME}}` | Domain concept names |
| `{{ENV_TEMPLATE}}`, `{{ENV_FILE}}` | Environment file paths |
| `{{DEV_COMMAND}}`, `{{BUILD_COMMAND}}`, `{{TEST_COMMAND}}`, `{{DEPLOY_COMMAND}}` | CLI commands |
| `{{SERVICE_N}}`, `{{PORT_N}}`, `{{NOTES_N}}` | Dev server details |
| `{{ROUTE_FILE_PATTERN}}`, `{{ROUTE_CONFIG_PATTERN}}`, `{{ROUTE_REGISTRY}}` | Routing patterns |
| `{{DOMAIN_COMPONENT}}`, `{{COMPONENT_PATH}}`, `{{COMPONENT_REGISTRY}}`, `{{EXT}}` | Domain component patterns |
| `{{BUILD_STAGE_N}}`, `{{BUILD_STAGE_N_DESC}}` | Build pipeline stages |
| `{{GENERATED_FILES}}` | Files that should not be hand-edited |
| `{{DO_N}}`, `{{DONT_N}}` | Runtime do/don't rules |
| `{{ENV_ACCESS_PATTERN}}` | How to access env vars |
| `{{TEST_SPECIFIC_COMMAND}}` | Command to run specific tests |
| `{{LANG}}`, `{{TEST_EXAMPLE}}` | Test code example |
| `{{SPEC_N}}`, `{{SPEC_N_PURPOSE}}`, `{{SPEC_N_TRIGGER}}` | SPEC document references |

## Example Inventory

Two worked examples show the template adapted to specific stacks:

| Example | Directory | Stack |
|---------|-----------|-------|
| express-api | `examples/express-api/` | Express + PostgreSQL |
| next-app | `examples/next-app/` | Next.js + Prisma |

Each example contains a fully customized `CLAUDE.md` with all placeholders replaced, and adapted hooks with project-specific configuration values.

## Constraints

These constraints are falsifiable — each can be verified mechanically.

1. **No raw placeholders in examples**: Example `CLAUDE.md` files contain zero `{{` markers. Verified by: `grep "{{" examples/*/CLAUDE.md` should return no results.
2. **Template retains placeholders**: `template/CLAUDE.md` contains `{{PLACEHOLDER}}` markers. Verified by: `grep "{{" template/CLAUDE.md | wc -l` should be > 0.
3. **Hook-settings alignment**: Every hook referenced in a generated `settings.local.json` has a corresponding file in `template/.claude/hooks/`. (Adopters verify this after running `/coherence`.)
4. **Template completeness**: The template directory contains all 11 hooks, 5 agents, and 1 skill (with sub-commands) listed in the SPEC documents. Verified by: file counts match SPEC-HOOKS, SPEC-AGENTS, and SPEC-SKILLS.

---

*This is a SPEC document. It describes what the code **does**, not what it should do. If the code contradicts this document, either the code has drifted or this document needs updating. Run `/coherence check-drift` to detect discrepancies.*
