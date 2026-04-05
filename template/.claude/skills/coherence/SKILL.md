---
name: coherence
description: Coherence guardrails system — auto-detects project state and runs scaffold, drift check, or plan review.
user_invocable: true
arguments: "[plan|fix|scaffold] [--verbose]"
---

# /coherence

Single entry point for the Coherence guardrails system. Auto-detects what to do based on project state.

## Constants

| Name | Value | Description |
|------|-------|-------------|
| `REGISTRY_DIR` | `~/.claude/coherence` | Directory for Coherence global state |
| `REGISTRY_FILE` | `~/.claude/coherence/repos.json` | Tracks repos where Coherence is installed |
| `REGISTRY_VERSION` | `1` | Schema version for the registry file |
| `PLUGIN_NAME` | `coherence` | Plugin name used in `enabledPlugins` and MCP entries |
| `MARKETPLACE_PATTERN` | `viewyonder/coherence` or `viewyonder-coherence` | Patterns to match in `enabledPlugins` and `extraKnownMarketplaces` |
| `PLUGIN_CACHE_DIR` | `~/.claude/plugins/cache/viewyonder-coherence` | Cached plugin directory to remove on global cleanup |

## Arguments

| Argument | Effect |
|----------|--------|
| _(none)_ | Auto-detect mode |
| `plan` | Plan review mode — invoke spec-reviewer agent |
| `fix` | Drift mode + auto-apply fixes |
| `scaffold` | Force scaffold mode even if SPEC files exist |
| `version` | Version bump workflow — guided bump, commit, and tag |
| `--verbose` | Show all CURRENT items, not just drift |

## Auto-detecting Flow

Follow this sequence to determine which mode to run:

### Step 1: Dogfood Detection

Check **all four** of these conditions:

1. `plugins/coherence-plugin/` directory exists
2. `template/.claude/hooks/` directory exists
3. `marketplace.json` exists at the repository root
4. `CLAUDE.md` contains the phrase "template system for encoding architectural constraints"

**If all four are true** → skip everything else and run **Dogfood Validation Mode** (described below).
**Otherwise** → proceed to Step 2.

### Step 2: State Detection

```
a. Glob for docs/SPEC-*.md AND doc/SPEC-*.md
b. No SPEC files found → SCAFFOLD MODE
c. SPEC files found, but CLAUDE.md lacks coherence refs → SETUP MODE
d. Argument is "plan" → PLAN REVIEW MODE
e. Argument is "scaffold" → SCAFFOLD MODE (forced)
f. Argument is "version" → VERSION MODE
g. Otherwise → DRIFT MODE
```

"Coherence refs" means CLAUDE.md contains the text "SPEC-" or "/coherence" or "Specification Documents".

---

## Dogfood Validation Mode

This is a read-only validation of the coherence repo's own templates, hooks, examples, and documentation. Do not generate or modify any files.

### Checks

| # | Check | What to Do |
|---|-------|------------|
| 1 | **Hook Syntax** | Run `node -c` on every `.cjs` and `.js` file in `template/.claude/hooks/`. Report PASS/FAIL per file. |
| 2 | **Template Structure** | Verify that key template files exist: `settings.local.json`, `CLAUDE.md`, each hook, each agent, the skill. Report missing files. |
| 3 | **README Accuracy** | Count actual hooks, agents, and skills in `template/.claude/` and compare against the counts in READMEs. Report mismatches. |
| 4 | **Example Consistency** | For each example in `examples/`: run `node -c` on all `.cjs`/`.js` hooks, verify `CLAUDE.md` has zero `{{PLACEHOLDER}}` markers. Report PASS/FAIL per example. |
| 5 | **Plugin Structure** | Validate that `plugin.json` and `marketplace.json` are valid JSON with matching `name` fields. Report parse errors or mismatches. |
| 6 | **SKILL.md Consistency** | Verify that the plugin copy (`plugins/coherence-plugin/skills/coherence/SKILL.md`) and the template copy (`template/.claude/skills/coherence/SKILL.md`) are identical. Report differences. |
| 7 | **Version Consistency** | Read version from `marketplace.json`, `plugins/coherence-plugin/.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, and `site/src/components/Footer.astro`. Also check that a git tag `v<version>` exists for the current version. Report PASS if all files match and tag exists, FAIL with details of any mismatches or missing tag. |

### Output Format

```
Coherence Dogfood Validation Report
====================================

1. Hook Syntax .............. PASS | FAIL (N issues)
2. Template Structure ....... PASS | FAIL (N missing)
3. README Accuracy .......... PASS | FAIL (N mismatches)
4. Example Consistency ...... PASS | FAIL (N issues)
5. Plugin Structure ......... PASS | FAIL (N issues)
6. SKILL.md Consistency ..... PASS | FAIL
7. Version Consistency ...... PASS | FAIL (expected X.Y.Z, found mismatches or missing tag)

Issues:
- [list any failures with details]
```

After producing the report, stop. Do not proceed to any other mode.

---

## SCAFFOLD MODE

Generate SPEC documents and set up coherence for a new project. This absorbs the functionality of the old `init` wizard.

**Important behavioral rules:**
- Ask questions using the `AskUserQuestion` tool — never just print questions as text
- Generate all files at the end, after confirmation — never generate files mid-conversation
- Be concise in explanations, generous in generated output
- Every generated file must be valid (hooks pass `node -c`, no `{{PLACEHOLDER}}` markers)

### Phase 0: Project Scan

Before asking questions, silently scan the project:

1. **Package/project files**: `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `Gemfile`, `*.csproj`, `Makefile`, `build.gradle`, `pom.xml`, `deno.json`
2. **Framework indicators**: `next.config.*`, `nuxt.config.*`, `vite.config.*`, `astro.config.*`, `svelte.config.*`, `angular.json`, `remix.config.*`, `express`, `django`, `flask`, `fastapi`, `rails`, `spring`
3. **Content indicators**: Count `.md` files, look for `/blog/`, `/docs/`, `/content/`, `/posts/`
4. **Existing `.claude/` directory**: Check what's already there
5. **Existing `CLAUDE.md`**: Check for `{{PLACEHOLDER}}` markers
6. **Test setup**: `jest.config.*`, `vitest.config.*`, `pytest.ini`, `*.test.*`, `__tests__/`, `tests/`
7. **Source structure**: `src/`, `lib/`, `app/`, `pages/`, `components/`, `api/`, `services/`
8. **Language/runtime**: Infer from file extensions and config files
9. **Version sources**: Look for version declarations in `package.json` (`.version`), `Cargo.toml` (`[package] version`), `pyproject.toml` (`[project] version`), `setup.cfg` (`version`), `*.csproj` (`<Version>`), `version.txt`, `deno.json` (`.version`). Note the file and access path for SPEC-VERSIONING generation.

#### Idempotency check

If `.claude/` already exists:
- Ask whether to **overwrite**, **merge** (add missing, keep existing), or **abort**

### Phase 1: Project Classification

Ask using `AskUserQuestion`:

**"What kind of project is this?"**

Options (pre-select based on scan):
1. **Software — Web application** — Frontend, full-stack, or SPA
2. **Software — API or backend service** — REST, GraphQL, microservice
3. **Software — CLI tool or library** — Command-line tool, package, shared library
4. **Infrastructure / DevOps** — Terraform, Pulumi, CDK, CI/CD
5. **Writing / Content** — Documentation, blog, technical writing
6. **Marketing / Brand** — Brand content, campaigns, landing pages
7. **Research / Analysis** — Data analysis, academic research

### Phase 2: Constraint Discovery

Ask 2-3 questions adapted to project type:

**For code projects**: Ask about critical boundaries, runtime constraints, and test enforcement.
**For writing projects**: Ask about terminology consistency, voice/tone, structure, and enforcement strictness.
**For marketing projects**: Ask about brand constraints, competitor mention policy, and enforcement strictness.
**For research projects**: Ask about rigor requirements and enforcement strictness.
**For infrastructure**: Ask about safety constraints and enforcement strictness.

### Phase 3: Enforcement Preferences

**"Should I generate SPEC documents alongside the guardrails?"**
- Yes — generate SPEC templates including SPEC-PRINCIPLES.md and SPEC-VERSIONING.md (if version source detected)
- No — just CLAUDE.md and coherence config

### Phase 4: Summary & Confirmation

Present what will be generated:

```
Based on your answers, I'll generate:

CLAUDE.md — Customized development guidelines
.claude/settings.local.json — Nudge hook registration
.claude/hooks/spec-drift-nudge.cjs — Drift check reminder
.claude/hooks/_journal.cjs — Activity journal

SPEC Templates (if selected):
  - docs/SPEC-PRINCIPLES.md — Architectural principles
  - docs/SPEC-VERSIONING.md — Version locations and tag conventions (if version source detected)
  - docs/SPEC-{OTHER}.md — Project-specific specs

Total: N files
```

Ask for confirmation before proceeding.

### Phase 5: Generate Files

Generate all files. Critical rules:
1. `CLAUDE.md` must have zero `{{PLACEHOLDER}}` markers — all values filled in
2. All hooks must pass `node -c` syntax check
3. Use the user's actual project details from the scan
4. `settings.local.json` must only reference hooks that were actually created

### Phase 6: Verify

1. Syntax check all hooks: `node -c .claude/hooks/<each>.cjs`
2. Cross-reference: every hook in `settings.local.json` has a matching file
3. Placeholder check: grep `CLAUDE.md` for `{{` — should be zero matches
4. Report results

### Phase 7: Register & Journal

1. Create `REGISTRY_DIR` if needed
2. Read/initialize `REGISTRY_FILE`
3. Upsert current repo path with timestamps
4. Write `.claude/coherence-state.json` with initial state:
   ```json
   { "editsSinceDrift": 0, "lastDriftCheck": "<now>", "lastNudge": null }
   ```
5. Append JSONL entry:
   ```javascript
   journal('scaffold', 'skill', 'Scaffolded N files', {
     details: { specsCreated: ["SPEC-PRINCIPLES.md", ...], principlesCreated: true }
   });
   ```

Suggest next steps:
- "Run `/coherence` periodically to check for drift"
- "Edit `CLAUDE.md` to refine principles for your project"
- "Fill in SPEC documents in `docs/` with your project's specifics"

---

## SETUP MODE

SPEC files exist but CLAUDE.md doesn't reference them.

1. Show what SPEC files were found
2. Offer to append a "Specification Documents" section to CLAUDE.md:

```markdown
## Specification Documents (Ground Truth)

These SPEC docs are the **authoritative source of truth** for the codebase.

| Spec | Purpose |
|------|---------|
| SPEC-PRINCIPLES.md | Architectural principles |
| ... | ... |

Run `/coherence` periodically to check for drift.
```

3. Append JSONL entry:
   ```javascript
   journal('setup', 'skill', 'Added spec references to CLAUDE.md');
   ```

---

## DRIFT MODE

The default mode. Checks SPEC documents against the codebase.

### Instructions

1. Invoke the `drift-detector` agent (which now also checks SPEC-PRINCIPLES.md)
2. Pass scope argument if provided, default `all`
3. Present the unified report: CURRENT / DRIFTED / UNDOCUMENTED
4. Update `.claude/coherence-state.json`:
   ```json
   { "editsSinceDrift": 0, "lastDriftCheck": "<now>", "lastNudge": null }
   ```
5. Append JSONL entry:
   ```javascript
   journal('log-drift-check', 'skill', 'N drifted, M undocumented, P current', {
     files: ['docs/SPEC-API.md', ...],
     details: { drifted: N, undocumented: M, current: P }
   });
   ```

### If `fix` argument was passed

After presenting the drift report, automatically apply fixes:
- Update SPEC docs to match code for DRIFTED items
- Add UNDOCUMENTED items to the appropriate SPEC doc
- Append JSONL entry:
  ```javascript
  journal('fix', 'skill', 'Fixed N issues', {
    files: [...modified files],
    details: { filesModified: [...], issuesFixed: N }
  });
  ```

### If `--verbose` was passed

Include all CURRENT items in the report, not just drifted/undocumented ones.

### Version nudge

After presenting the drift report, if `docs/SPEC-VERSIONING.md` (or `doc/SPEC-VERSIONING.md`) exists:

1. Read the current version from the declared source of truth
2. Check if a `v<version>` git tag exists
3. Append a version status line to the report:

```
Version: X.Y.Z (tagged ✓ | untagged ✗)
```

4. If there are DRIFTED or UNDOCUMENTED items, add:

```
If these changes warrant a release, run: /coherence version
```

---

## VERSION MODE

Guided version bump workflow. Reads SPEC-VERSIONING.md to know where versions live, then bumps, commits, and tags.

### Prerequisites

If `docs/SPEC-VERSIONING.md` (or `doc/SPEC-VERSIONING.md`) does not exist, tell the user:
- "No SPEC-VERSIONING.md found. Run `/coherence scaffold` or create one manually to declare your version locations."
- Stop.

### Step 1: Show current state

1. Read the source of truth file declared in SPEC-VERSIONING.md
2. Extract the current version
3. Check all version locations for consistency
4. Check if the current version has a git tag
5. Show a brief summary:

```
Current version: X.Y.Z
Tag: vX.Y.Z (exists ✓ | missing ✗)
Locations: N files (all in sync ✓ | M out of sync ✗)
```

If locations are out of sync, show which ones and offer to fix them first.

### Step 2: Ask bump type

Ask using `AskUserQuestion`:

**"What kind of version bump is this?"**

- **Patch** (X.Y.Z → X.Y.Z+1) — Bug fixes, minor corrections, no new functionality
- **Minor** (X.Y.Z → X.Y+1.0) — New features, backward-compatible changes
- **Major** (X.Y.Z → X+1.0.0) — Breaking changes, major rework
- **Custom** — Enter a specific version
- **Skip** — Don't bump right now

If Skip → stop.

### Step 3: Update all version locations

1. Calculate the new version from the bump type
2. For each file in the SPEC-VERSIONING.md "Version Locations" table:
   - Read the file
   - Update the version using the declared access method
   - Write the file back
3. Update the "Current version" field in SPEC-VERSIONING.md itself
4. Report what was updated:

```
Updated X.Y.Z → A.B.C in:
  ✓ package.json
  ✓ src/config.ts
  ✓ SPEC-VERSIONING.md
```

### Step 4: Commit and tag

Ask using `AskUserQuestion`:

**"Commit and tag now?"**

Show the proposed commit message: `vA.B.C — <user provides summary>`

- **Yes** — Ask for a one-line summary, then:
  1. Stage the modified version files
  2. Commit with message: `vA.B.C — <summary>`
  3. Create tag: `git tag vA.B.C`
  4. Report success and remind: `Push when ready: git push && git push --tags`
- **No** — Files are already updated. Remind user to commit and tag manually.

### Step 5: Journal

Append JSONL entry:
```javascript
journal('version-bump', 'skill', 'Bumped X.Y.Z → A.B.C', {
  details: { from: 'X.Y.Z', to: 'A.B.C', filesUpdated: [...], tagged: true|false }
});
```

---

## PLAN REVIEW MODE

Triggered by the `plan` argument. Reviews the current plan against SPEC constraints.

### Instructions

1. Verify SPEC docs exist. If not → suggest running `/coherence scaffold` first and stop.
2. Invoke the `spec-reviewer` agent with the current plan context
3. Present the alignment report: ALIGNED / AT_RISK / VIOLATED
4. Append JSONL entry:
   ```javascript
   journal('plan-review', 'skill', 'N aligned, M at risk, P violated', {
     details: { aligned: N, atRisk: M, violated: P }
   });
   ```

---

## CLAUDE.md Templates

When generating CLAUDE.md in scaffold mode, use the appropriate template based on project type. Fill in ALL placeholders with project-specific values.

### For Code Projects

Key sections: Architecture Overview, Architectural Principles (Security/Boundary/Performance/Propagation), Core Concepts, Local Development, Runtime Constraints, Testing, Specification Documents.

### For Writing/Content Projects

Key sections: Content Overview, Voice & Tone Principles, Terminology table, Accuracy Principles, Structure Conventions, Content Types.

### For Marketing/Brand Projects

Key sections: Brand Overview, Brand Voice, Terminology & Naming, Competitor References, Content Types & Templates.

### For Research Projects

Key sections: Research Overview, Rigor Principles, Citation Standards, Methodology Documentation, Data Handling, Output Formats.

Customize all sections based on the specific answers gathered during the scaffold wizard.
