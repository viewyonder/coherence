#!/usr/bin/env node

/**
 * Shared JSONL journaling utility for Coherence hooks and skills.
 *
 * Appends structured entries to .claude/coherence.jsonl.
 * Always on — no sentinel file needed.
 *
 * Usage in hooks/skills:
 *   const { journal } = require('./_journal.cjs');
 *   journal('log-drift-check', 'skill', '3 drifted, 1 undocumented', {
 *     files: ['docs/SPEC-API.md'],
 *     details: { drifted: 3, undocumented: 1, current: 12 }
 *   });
 *
 * Action values: scaffold, log-drift-check, plan-review, setup, nudge, fix
 * Source values: skill, hook, agent
 */

const fs = require('fs');
const path = require('path');

const HOOKS_DIR = __dirname;
const CLAUDE_DIR = path.dirname(HOOKS_DIR);
const JOURNAL_FILE = path.join(CLAUDE_DIR, 'coherence.jsonl');
const MAX_SIZE = 100 * 1024; // 100KB triggers rotation
const KEEP_ENTRIES = 500;

/**
 * Append a structured entry to the JSONL journal.
 *
 * @param {string} action - One of: scaffold, log-drift-check, plan-review, setup, nudge, fix
 * @param {string} source - One of: skill, hook, agent
 * @param {string} summary - One-line human-readable summary
 * @param {object} [opts] - Optional fields
 * @param {string[]} [opts.files] - Files involved
 * @param {object} [opts.details] - Action-specific data
 */
function journal(action, source, summary, opts) {
  try {
    const entry = {
      ts: new Date().toISOString(),
      action,
      source,
      summary,
    };

    if (opts?.files) entry.files = opts.files;
    if (opts?.details) entry.details = opts.details;

    fs.appendFileSync(JOURNAL_FILE, JSON.stringify(entry) + '\n');

    // Rotate if needed
    try {
      const stat = fs.statSync(JOURNAL_FILE);
      if (stat.size > MAX_SIZE) {
        const content = fs.readFileSync(JOURNAL_FILE, 'utf8');
        const lines = content.split('\n').filter(Boolean);
        const trimmed = lines.slice(-KEEP_ENTRIES).join('\n') + '\n';
        fs.writeFileSync(JOURNAL_FILE, trimmed);
      }
    } catch (_) { /* rotation failure is non-fatal */ }
  } catch (_) { /* journaling never breaks a hook */ }
}

module.exports = { journal };
