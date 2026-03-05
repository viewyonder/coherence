---
name: test-runner
description: Run tests with flexible scope control — all tests, a specific module, or a custom filter pattern.
user_invocable: true
arguments: "[scope | --filter <pattern> | --all]"
---

# /coherence:test-runner

Run tests with flexible scope control.

### Usage

```
/coherence:test-runner                         # Run all tests
/coherence:test-runner api                     # All API tests
/coherence:test-runner core                    # All core system tests
/coherence:test-runner --filter <pattern>      # Run tests matching pattern
/coherence:test-runner --all                   # Run all test suites
```

### Instructions

#### Step 1: Parse Arguments

| Argument | Command | Description |
|----------|---------|-------------|
| _(none)_ | `npm test` | All tests |
| `api` | `npm test -- tests/api/` | API tests |
| `core` | `npm test -- tests/core/` | Core tests |
| `services` | `npm test -- tests/services/` | Service tests |
| `--filter <pattern>` | `npm test -- --filter <pattern>` | Custom filter |
| `--all` | `npm test` | Everything |

Customize the commands above for your test runner (jest, vitest, pytest, etc.).

#### Step 2: Run Tests

Execute the appropriate test command.

#### Step 3: Report Results

1. **If all pass**: Report success with count
2. **If failures**:
   - Show failing test names and files
   - Offer to investigate failures
   - Suggest related code to review

### Test Categories

Customize this table for your project:

| Category | Location | Description |
|----------|----------|-------------|
| **Unit** | `tests/` or `src/**/__tests__/` | Individual function tests |
| **API** | `tests/api/` | API endpoint validation |
| **Integration** | `tests/integration/` | Component interaction |
| **E2E** | `tests/e2e/` | End-to-end tests |

### Logging

After reporting results, if `.claude/coherence-log-enabled` exists, append a SKILL log line to `.claude/coherence.log`:
```
<timestamp>  SKILL  test-runner                —                         N passed, M failed
```
