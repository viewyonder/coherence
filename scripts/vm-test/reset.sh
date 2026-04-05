#!/bin/bash
# Reset the test environment to a clean slate inside the Tart VM.
# Run this inside the VM before each test cycle.
set -e

echo "=== Resetting test environment ==="

# Remove Claude state
rm -rf ~/.claude/
echo "  Cleared ~/.claude/"

# Remove test project
rm -rf ~/test-project
mkdir -p ~/test-project
cd ~/test-project
git init
echo "  Created fresh ~/test-project with git init"

echo ""
echo "Clean slate ready. Run 'claude' to start testing."
