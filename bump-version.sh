#!/usr/bin/env bash
set -euo pipefail

# bump-version.sh — Update version across all locations
#
# Usage: ./bump-version.sh 1.14.0
# Source of truth: marketplace.json

VERSION="${1:-}"

if [[ -z "$VERSION" ]]; then
  # Read current version from marketplace.json
  CURRENT=$(node -e "console.log(JSON.parse(require('fs').readFileSync('marketplace.json','utf8')).plugins[0].version)")
  echo "Current version: $CURRENT"
  echo "Usage: ./bump-version.sh <new-version>"
  exit 1
fi

# Validate semver format (loose)
if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Error: Version must be semver (e.g. 1.14.0)"
  exit 1
fi

CURRENT=$(node -e "console.log(JSON.parse(require('fs').readFileSync('marketplace.json','utf8')).plugins[0].version)")
echo "Bumping: $CURRENT → $VERSION"

# 1. marketplace.json (source of truth)
node -e "
  const f = 'marketplace.json';
  const j = JSON.parse(require('fs').readFileSync(f,'utf8'));
  j.plugins[0].version = '$VERSION';
  require('fs').writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
"
echo "  ✓ marketplace.json"

# 2. plugin.json
node -e "
  const f = 'plugins/coherence-plugin/.claude-plugin/plugin.json';
  const j = JSON.parse(require('fs').readFileSync(f,'utf8'));
  j.version = '$VERSION';
  require('fs').writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
"
echo "  ✓ plugin.json"

# 3. .claude-plugin/marketplace.json
node -e "
  const f = '.claude-plugin/marketplace.json';
  const j = JSON.parse(require('fs').readFileSync(f,'utf8'));
  j.plugins[0].version = '$VERSION';
  require('fs').writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
"
echo "  ✓ .claude-plugin/marketplace.json"

# 4. Footer.astro
sed -i '' "s/v${CURRENT}/v${VERSION}/g" site/src/components/Footer.astro
echo "  ✓ Footer.astro"

echo ""
echo "Done. Remember to:"
echo "  1. Update site/src/data/changelog.ts with release notes"
echo "  2. Commit and tag: git tag v$VERSION"
