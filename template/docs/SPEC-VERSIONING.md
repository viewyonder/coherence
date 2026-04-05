# SPEC-VERSIONING: Version Alignment

> **Last verified**: {{YYYY-MM-DD}}
> **Verified by**: {{person or agent}}
> **Verification method**: {{manual review | /coherence | automated}}

## Overview

This document declares where version numbers live in this project and how they stay aligned. The drift detector uses this spec to verify all locations match on every `/coherence` run.

## Source of Truth

| Property | Value |
|----------|-------|
| Source file | `{{VERSION_SOURCE_FILE}}` |
| Access path | `{{ACCESS_PATH}}` |
| Current version | {{X.Y.Z}} |

## Version Locations

Every location below MUST match the source of truth after a version bump.

| # | File | Access Method | Description |
|---|------|--------------|-------------|
| 1 | `{{VERSION_SOURCE_FILE}}` | `{{ACCESS_METHOD_1}}` | Source of truth |
| 2 | `{{SECOND_VERSION_FILE}}` | `{{ACCESS_METHOD_2}}` | {{What this file is}} |
| 3 | `{{THIRD_VERSION_FILE}}` | `{{ACCESS_METHOD_3}}` | {{What this file is}} |

## Tag Convention

| Property | Value |
|----------|-------|
| Format | `vX.Y.Z` |
| Prefix | `v` (always) |
| Pre-release | `vX.Y.Z-rc.N` (if applicable) |

Release tags are clean semver with `v` prefix — no descriptive suffixes.

## When to Bump

This project follows [Semantic Versioning](https://semver.org/) (SemVer). The version format is **MAJOR.MINOR.PATCH**:

| Change Type | Bump | Examples |
|-------------|------|----------|
| Bug fix, typo, minor correction | **Patch** (0.0.+1) | Fix crash, correct docs, patch dependency |
| New feature, backward-compatible | **Minor** (0.+1.0) | Add endpoint, new option, deprecate old API |
| Breaking change, incompatible API | **Major** (+1.0.0) | Remove/rename API, change data format, drop support |

**Key SemVer rules:**
- Patch releases MUST NOT change public API behavior
- Minor releases MUST be backward-compatible — existing consumers should not break
- Major releases signal that consumers need to adapt
- Pre-1.0.0 versions (0.x.y) are for initial development — anything may change

Further reading: [semver.org](https://semver.org/) | [SemVer FAQ](https://semver.org/#faq)

Run `/coherence version` to bump — it reads this document, updates all locations, commits, and tags.

## Bump Process

If bumping manually (without `/coherence version`):

1. Update the source of truth file
2. Propagate version to all locations listed above
3. Update changelog
4. Commit: `vX.Y.Z — <summary>`
5. Tag: `git tag vX.Y.Z`
6. Push with tags: `git push && git push --tags`

## Constraints

1. **All locations match**: Every file in the Version Locations table shows the same version string. Verified by: reading each file and comparing against the source of truth.
2. **Tags are v-prefixed semver**: Every release tag matches `v\d+\.\d+\.\d+`. Verified by: `git tag -l 'v*' | grep -v '^v[0-9]\+\.[0-9]\+\.[0-9]\+$'` returns nothing unexpected.
3. **HEAD is tagged after release**: After a version bump commit, a matching `vX.Y.Z` tag exists. Verified by: comparing source-of-truth version against `git tag -l "vX.Y.Z"`.

## Change Log

| Date | Change | Author |
|------|--------|--------|
| {{YYYY-MM-DD}} | Initial specification | {{name}} |

---

*This is a SPEC document. It describes what the code **does**, not what it should do. If the code contradicts this document, either the code has drifted or this document needs updating. Run `/coherence` to detect discrepancies.*
