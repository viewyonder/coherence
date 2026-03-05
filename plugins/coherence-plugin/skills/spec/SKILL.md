---
name: spec
description: List all SPEC documents found in docs/ with their verification metadata and descriptions.
user_invocable: true
---

# /coherence:spec

List all SPEC documents found in `docs/` with their verification metadata and descriptions.

### Usage

```
/coherence:spec
```

### Instructions

#### Step 1: Scan for SPEC Documents

Look for files matching `docs/SPEC-*.md` in the current repo.

- If no `docs/` directory exists: report "No docs/ directory found." and stop.
- If no files match `SPEC-*.md`: report "No SPEC documents found. Copy docs/SPEC-TEMPLATE.md to create one." and stop.

#### Step 2: Read SPEC Metadata

For each SPEC file found (skip `SPEC-TEMPLATE.md` — list it separately as a template if present):

1. Read the file's header block. SPEC files use a blockquote-style header:
   ```
   > **Last verified**: 2026-02-25
   > **Verified by**: manual review / drift-detector agent
   > **Verification method**: file listing + source inspection
   ```
2. Extract:
   - **Last verified date** from the `Last verified` line
   - **Verified by** from the `Verified by` line
   - **Verification method** from the `Verification method` line
3. Read the `## Overview` section (or the first paragraph after the header) to get a one-line description.

#### Step 3: Present Report

```
SPEC Documents
===============

Found N SPEC documents in docs/:

  SPEC-HOOKS.md          verified 2026-02-25   Hook system (11 hooks, 3 tiers)
  SPEC-SKILLS.md         verified 2026-03-03   Skill system (1 skill, 9 sub-commands)
  SPEC-API.md            verified 2026-02-20   API endpoints and routes

  Template: SPEC-TEMPLATE.md

To add a SPEC:     Copy docs/SPEC-TEMPLATE.md to docs/SPEC-{NAME}.md and fill it in
To update a SPEC:  Edit the file directly; update "Last verified" date and Change Log
To check drift:    Run /coherence:check-drift to compare SPECs against code
```

Formatting rules:
- List SPEC documents alphabetically
- Show the verified date from the header (or "unverified" if no date found)
- Show a one-line description extracted from the Overview section
- If `SPEC-TEMPLATE.md` exists, list it separately at the bottom as "Template: SPEC-TEMPLATE.md"
- The count N excludes the template file
