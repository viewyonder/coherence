# Template: Coherence for Claude

This is the template directory. Copy its contents into your project to adopt the guardrails system.

## Quick Start

```bash
# Copy into your project root
cp -r template/.claude /path/to/your/project/
cp template/CLAUDE.md /path/to/your/project/
mkdir -p /path/to/your/project/docs
cp template/docs/SPEC-TEMPLATE.md /path/to/your/project/docs/
cp template/docs/MEMORY.md /path/to/your/project/docs/
```

## Customization Checklist

### 1. CLAUDE.md (5 min)

Replace all `{{PLACEHOLDER}}` markers with your project's values:
- `{{PROJECT_NAME}}` — Your project name
- `{{RUNTIME}}` — e.g., Node.js, Cloudflare Workers, Deno, Python
- `{{FRAMEWORK}}` — e.g., Express, Hono, Next.js, FastAPI
- `{{DEPLOYMENT}}` — e.g., AWS Lambda, Vercel, Cloudflare, Docker
- Architectural principles — Edit the 4 principle categories to match your project's boundaries and conventions

### 2. Hooks (5 min per hook)

Each hook has a `// === CONFIGURATION ===` block at the top. Edit these constants:

| Hook | What to Configure |
|------|-------------------|
| `forbidden-imports.cjs` | `FORBIDDEN_PATTERNS` — APIs not available in your runtime. `SKIP_PATHS` — Directories exempt from checks. |
| `required-prefix.cjs` | `REQUIRED_PREFIX` — Your route prefix (e.g., `/api/v1`). `ROUTE_FILE_PATTERNS` — Where routes are defined. |
| `boundary-guard.cjs` | `GUARDED_PATHS` — Module boundaries to enforce (paths + forbidden patterns). |
| `data-isolation.cjs` | `DB_CALL_PATTERN` — Your ORM/DB call syntax. `REQUIRED_FILTERS` — Tenant ID field names. |
| `state-flow.cjs` | `STORE_PATHS`, `UI_PATHS` — Where stores and views live. |
| `delegation-check.js` | `HANDLER_PATHS` — Where API handlers live. `DB_PATTERNS` — Your DB access patterns. |
| `test-gate.cjs` | `SOURCE_DIRS` — Directories requiring tests. `TEST_LOCATIONS` — Where tests live. |
| `test-suggest.cjs` | `TEST_LOCATIONS` — Same as test-gate. `TEST_COMMAND` — Your test runner. |
| `change-suggest.cjs` | `WATCH_RULES` — Paths to watch and what to suggest. |

### 3. Agents (2 min)

The 4 agents are project-agnostic. They reference your CLAUDE.md principles.

Optional: Add domain-specific agents (e.g., `inspector-generator.md` for plugin-based architectures).

### 4. SPEC Documents (10 min per spec)

Copy `docs/SPEC-TEMPLATE.md` for each architectural surface you want to track:
- `SPEC-API-SURFACE.md` — All endpoints
- `SPEC-DATA-MODELS.md` — All models/schemas
- `SPEC-FRONTEND.md` — All stores/state

Fill in actual components. Run `/coherence check-drift` to verify.

### 5. Remove Unused Hooks

Not every project needs every hook. Delete hooks that don't apply:
- No frontend stores? Remove `state-flow.cjs`
- No route prefix requirement? Remove `required-prefix.cjs`
- No multi-tenancy? Remove `data-isolation.cjs`

Update `settings.local.json` to remove references to deleted hooks.

## What's Included

```
.claude/
├── settings.local.json        # Hook registrations
├── hooks/
│   ├── README.md              # Hook protocol documentation
│   ├── forbidden-imports.cjs  # Block forbidden APIs (blocking)
│   ├── required-prefix.cjs    # Enforce route prefix (blocking)
│   ├── boundary-guard.cjs     # Enforce module boundaries (blocking)
│   ├── data-isolation.cjs     # Warn on unfiltered queries (warning)
│   ├── state-flow.cjs         # Enforce unidirectional state (blocking/warning)
│   ├── delegation-check.js    # Warn on inline business logic (warning)
│   ├── test-gate.cjs          # Block commits without tests (blocking)
│   ├── test-suggest.cjs       # Suggest running tests (informational)
│   └── change-suggest.cjs     # Suggest related actions (informational)
├── agents/
│   ├── README.md              # Agent definition format
│   ├── architecture-reviewer.md
│   ├── drift-detector.md
│   ├── code-reviewer.md
│   └── security-auditor.md
└── skills/
    ├── README.md              # Skill format docs
    └── coherence/SKILL.md     # Unified: init, check-drift, check-principles, test
```
