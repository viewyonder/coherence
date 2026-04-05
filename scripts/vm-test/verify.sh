#!/bin/bash
# Verification checklist for the plugin lifecycle.
# Run this inside the VM after a full install cycle to check state.
set -e

PASS=0
FAIL=0

check() {
    local description="$1"
    local condition="$2"
    if eval "$condition" 2>/dev/null; then
        echo "  [PASS] $description"
        PASS=$((PASS + 1))
    else
        echo "  [FAIL] $description"
        FAIL=$((FAIL + 1))
    fi
}

echo "=== Coherence Plugin Verification ==="
echo ""

echo "--- User-level state (~/.claude/) ---"
check "settings.json has enabledPlugins for coherence" \
    "grep -q 'coherence' ~/.claude/settings.json"
check "coherence/repos.json exists" \
    "test -f ~/.claude/coherence/repos.json"
check "repos.json has valid JSON" \
    "python3 -c 'import json; json.load(open(\"$HOME/.claude/coherence/repos.json\"))'"
check "Plugin cache exists" \
    "test -d ~/.claude/plugins/cache/viewyonder-coherence/ || test -d ~/.claude/plugins/coherence/"

echo ""
echo "--- Project-level state ($(pwd)) ---"
check ".claude/hooks/ directory exists" \
    "test -d .claude/hooks/"
check ".claude/agents/ directory exists" \
    "test -d .claude/agents/"
check ".claude/skills/coherence/ directory exists" \
    "test -d .claude/skills/coherence/"
check "settings.local.json exists" \
    "test -f .claude/settings.local.json"
check "settings.local.json has hook registrations" \
    "grep -q 'PreToolUse\|PostToolUse' .claude/settings.local.json"

echo ""
echo "--- Hook execution ---"
if test -f .claude/hooks/forbidden-imports.cjs; then
    RESULT=$(echo '{"tool_input":{"file_path":"test.ts","content":"x"}}' | node .claude/hooks/forbidden-imports.cjs 2>&1)
    if [ -z "$RESULT" ]; then
        echo "  [PASS] forbidden-imports.cjs runs (allowed clean input)"
        PASS=$((PASS + 1))
    else
        echo "  [FAIL] forbidden-imports.cjs unexpected output: $RESULT"
        FAIL=$((FAIL + 1))
    fi
else
    echo "  [SKIP] forbidden-imports.cjs not found"
fi

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
if [ "$FAIL" -gt 0 ]; then
    exit 1
fi
