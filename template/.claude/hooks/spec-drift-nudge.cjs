#!/usr/bin/env node

/**
 * PostToolUse:Edit+Write hook — nudges the user to run /coherence
 * when enough edits have accumulated since the last drift check.
 *
 * ENFORCEMENT: informational (non-blocking)
 *
 * Reads .claude/coherence-state.json, increments editsSinceDrift,
 * and nudges after 50 edits or 7 days since last drift check.
 * Throttled: at most once per 30 minutes.
 */

// === CONFIGURATION ===
const EDITS_THRESHOLD = 50;      // Nudge after this many edits
const DAYS_THRESHOLD = 7;        // Nudge after this many days
const THROTTLE_MS = 30 * 60 * 1000; // 30 minutes between nudges
// === END CONFIGURATION ===

const fs = require('fs');
const path = require('path');

const HOOKS_DIR = __dirname;
const CLAUDE_DIR = path.dirname(HOOKS_DIR);
const STATE_FILE = path.join(CLAUDE_DIR, 'coherence-state.json');

let { journal } = { journal: () => {} };
try { ({ journal } = require('./_journal.cjs')); } catch (_) {}

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch (_) {
    return { editsSinceDrift: 0, lastDriftCheck: null, lastNudge: null };
  }
}

function writeState(state) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n');
  } catch (_) { /* state write failure is non-fatal */ }
}

const input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
const filePath = input.tool_input?.file_path || '';

// Only count source file edits (skip config, node_modules, etc.)
if (!filePath || filePath.includes('/node_modules/') || filePath.includes('/.claude/')) {
  process.exit(0);
}

const state = readState();
state.editsSinceDrift = (state.editsSinceDrift || 0) + 1;

const now = Date.now();
let shouldNudge = false;

// Check edit count threshold
if (state.editsSinceDrift >= EDITS_THRESHOLD) {
  shouldNudge = true;
}

// Check days threshold
if (state.lastDriftCheck) {
  const daysSince = (now - new Date(state.lastDriftCheck).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince >= DAYS_THRESHOLD) {
    shouldNudge = true;
  }
}

// Check throttle
if (shouldNudge && state.lastNudge) {
  const msSinceNudge = now - new Date(state.lastNudge).getTime();
  if (msSinceNudge < THROTTLE_MS) {
    shouldNudge = false;
  }
}

writeState(state);

if (shouldNudge) {
  state.lastNudge = new Date().toISOString();
  writeState(state);

  journal('nudge', 'hook', `${state.editsSinceDrift} edits since last drift check`, {
    details: {
      editsSinceDrift: state.editsSinceDrift,
      daysSinceDrift: state.lastDriftCheck
        ? Math.floor((now - new Date(state.lastDriftCheck).getTime()) / (1000 * 60 * 60 * 24))
        : null,
    },
  });

  const reason = state.editsSinceDrift >= EDITS_THRESHOLD
    ? `${state.editsSinceDrift} edits since last drift check`
    : `${DAYS_THRESHOLD}+ days since last drift check`;

  process.stdout.write(JSON.stringify({
    message: `Coherence nudge: ${reason}. Consider running /coherence to check for spec drift.`,
  }));
}

process.exit(0);
