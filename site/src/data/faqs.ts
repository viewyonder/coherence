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
    answer: `The <code>/coherence</code> wizard detects existing <code>.claude/</code> directories and asks whether to <strong>overwrite</strong>, <strong>merge</strong>, or <strong>abort</strong>. Your existing settings and hooks are never silently replaced. Use <code>/coherence --reset</code> to skip the prompt and do a clean overwrite.`,
    tags: ["general"],
  },
  {
    question: "Can I use Coherence without the plugin?",
    answer: `Yes. You can clone the repository and copy the <code>template/</code> directory into your project manually. The plugin just automates the setup — the underlying hooks, agents, and skills work the same either way. See the <a href="/getting-started">Getting Started</a> guide for both paths.`,
    tags: ["general", "plugins"],
  },
  {
    question: "Which hooks does my project type get?",
    answer: `It depends on your project archetype. Web apps get <code>forbidden-imports</code>, <code>boundary-guard</code>, <code>state-flow</code>, and more. APIs get <code>data-isolation</code> and <code>required-prefix</code>. Writing projects get <code>terminology-check</code> and <code>style-guard</code>. The <code>/coherence</code> wizard selects the right set based on your stack.`,
    tags: ["hooks"],
  },
  {
    question: "Are hooks blocking or advisory?",
    answer: `Both. Hooks use three enforcement levels: <strong>blocking</strong> (prevents the edit entirely), <strong>warning</strong> (edit proceeds but Claude sees a warning), and <strong>informational</strong> (suggestions that don't interrupt workflow). You control the level for each hook in the <code>// === CONFIGURATION ===</code> block.`,
    tags: ["hooks"],
  },
  {
    question: "How do I update the plugin?",
    answer: `Run <code>/plugin marketplace update</code> to update all plugins, or <code>/plugin update coherence</code> for just Coherence. Version bumps in the marketplace manifest are picked up automatically. Your customized hook configurations are preserved during updates.`,
    tags: ["plugins"],
  },
  {
    question: "Can I create custom hooks?",
    answer: `Yes. Hooks are standalone Node.js scripts (<code>.cjs</code>) that read JSON from stdin and output a decision. Create a new <code>.cjs</code> file in <code>.claude/hooks/</code>, add a <code>// === CONFIGURATION ===</code> block at the top, and register it in <code>settings.local.json</code>. No external dependencies needed.`,
    tags: ["hooks"],
  },
  {
    question: "Does /coherence overwrite my existing CLAUDE.md?",
    answer: `No — the wizard checks for an existing <code>CLAUDE.md</code> and asks before making changes. If you choose to proceed, it merges Coherence sections into your existing file rather than replacing it. You can always review the diff before committing.`,
    tags: ["general"],
  },
];
