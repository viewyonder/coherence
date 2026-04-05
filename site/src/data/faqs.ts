export interface FAQ {
  question: string;
  answer: string;
  tags: string[];
}

export const faqs: FAQ[] = [
  {
    question: "Are plugins device-wide or project-specific?",
    answer: `Plugins can be installed at three scopes: <strong>user</strong> (available in all your projects, stored in <code>~/.claude/plugins/</code>), <strong>project</strong> (shared via git, stored in <code>.claude/plugins/</code>), or <strong>local</strong> (project-specific and gitignored). <strong>For Coherence, use user scope (the default).</strong> Coherence is designed to work across multiple repos — you install the plugin once, then run <code>/coherence</code> in each project. If you install with <code>local</code> scope, the plugin is locked to one project and you'll get an "already installed" error in other repos. Use <code>--scope project</code> only if you want to share the plugin config with your team via git.`,
    tags: ["plugins"],
  },
  {
    question: "What happens if I already have a .claude/ directory?",
    answer: `<code>/coherence</code> detects existing <code>.claude/</code> directories and asks whether to <strong>overwrite</strong>, <strong>merge</strong>, or <strong>abort</strong>. Your existing settings and hooks are never silently replaced. Use <code>/coherence scaffold</code> to force a fresh scaffold.`,
    tags: ["general"],
  },
  {
    question: "Can I use Coherence without the plugin?",
    answer: `Yes. You can clone the repository and copy the <code>template/</code> directory into your project manually. The plugin just automates the setup — the underlying hooks, agents, and skills work the same either way. See the <a href="/getting-started">Getting Started</a> guide for both paths.`,
    tags: ["general", "plugins"],
  },
  {
    question: "What does the hook do?",
    answer: `Coherence ships a single hook: <code>spec-drift-nudge</code>. It tracks how many edits have been made and how long since the last drift check. After 50 edits or 7 days, it nudges you to run <code>/coherence</code>. It's purely informational — it never blocks or warns.`,
    tags: ["hooks"],
  },
  {
    question: "Does Coherence block my edits?",
    answer: `No. The single hook is purely informational — it nudges you to run <code>/coherence</code> when enough edits have accumulated, but it never prevents any edit from proceeding. All enforcement happens through SPEC documents and agents, which you invoke on demand.`,
    tags: ["hooks"],
  },
  {
    question: "How do I update the plugin?",
    answer: `Run <code>/plugin marketplace update</code> to update all plugins, or <code>/plugin update coherence</code> for just Coherence. Version bumps in the marketplace manifest are picked up automatically. Your customized hook configurations are preserved during updates.`,
    tags: ["plugins"],
  },
  {
    question: "Can I create custom hooks?",
    answer: `Yes. Hooks are standalone Node.js scripts (<code>.cjs</code>) that read JSON from stdin and output a decision. Coherence ships one hook (<code>spec-drift-nudge</code>), but you can add your own. Create a <code>.cjs</code> file in <code>.claude/hooks/</code> and register it in <code>settings.local.json</code>. No external dependencies needed.`,
    tags: ["hooks"],
  },
  {
    question: "Does /coherence overwrite my existing CLAUDE.md?",
    answer: `No — the wizard checks for an existing <code>CLAUDE.md</code> and asks before making changes. If you choose to proceed, it merges Coherence sections into your existing file rather than replacing it. You can always review the diff before committing.`,
    tags: ["general"],
  },
];
