# Template: Coherence for Claude

This is the template directory. Copy its contents into your project to adopt the guardrails system.

## Quick Start

```bash
# Copy into your project root
cp -r template/.claude /path/to/your/project/
cp template/CLAUDE.md /path/to/your/project/
mkdir -p /path/to/your/project/docs
cp template/docs/*.md /path/to/your/project/docs/
```

## Customization Checklist

### 1. CLAUDE.md (5 min)

Replace all `{{PLACEHOLDER}}` markers with your project's values:
- `{{PROJECT_NAME}}` — Your project name
- `{{RUNTIME}}` — e.g., Node.js, Cloudflare Workers, Deno, Python
- `{{FRAMEWORK}}` — e.g., Express, Hono, Next.js, FastAPI
- `{{DEPLOYMENT}}` — e.g., AWS Lambda, Vercel, Cloudflare, Docker
- Architectural principles — Edit the 4 principle categories to match your project's boundaries and conventions

### 2. Hook (2 min)

The single hook has a `// === CONFIGURATION ===` block at the top. Edit these constants:

| Hook | What to Configure |
|------|-------------------|
| `spec-drift-nudge.cjs` | `EDITS_THRESHOLD` — Number of edits before nudging (default: 50). `DAYS_THRESHOLD` — Days before nudging (default: 7). `THROTTLE_MS` — Minimum time between nudges (default: 30 min). |

### 3. Agents (2 min)

The 5 agents are project-agnostic. They reference your CLAUDE.md principles and SPEC documents.

Optional: Add domain-specific agents for your project's unique needs.

### 4. SPEC Documents (10 min per spec)

Copy `docs/SPEC-TEMPLATE.md` for each architectural surface you want to track:
- `SPEC-API-SURFACE.md` — All endpoints
- `SPEC-DATA-MODELS.md` — All models/schemas
- `SPEC-FRONTEND.md` — All stores/state

Fill in actual components. Run `/coherence` to verify.

## What's Included

```
.claude/
├── settings.local.json           # Hook registration
├── hooks/
│   ├── README.md                 # Hook protocol documentation
│   ├── spec-drift-nudge.cjs      # Nudge after 50 edits or 7 days (informational)
│   └── _journal.cjs              # JSONL activity logging utility
├── agents/
│   ├── README.md                 # Agent definition format
│   ├── drift-detector.md         # Compare SPEC docs vs codebase
│   ├── spec-reviewer.md          # Review plans against SPEC constraints
│   ├── code-reviewer.md          # Code quality and security review
│   ├── consistency-reviewer.md   # Content consistency (terminology, voice)
│   └── security-auditor.md       # OWASP-focused vulnerability detection
└── skills/
    ├── README.md                 # Skill format docs
    └── coherence/SKILL.md        # Single /coherence skill, auto-detecting
```
