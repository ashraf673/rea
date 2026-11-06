# REA Reverse Engineering for ChatGPT

This folder prepares a **custom GPT configuration and Knowledge bundle**. It is not a separately installable ChatGPT plugin or an MCP server.

## Five original skills preserved

1. `.agents/skills/reverse-engineer-anything/SKILL.md`
2. `.agents/skills/rea-analysis-optimization/SKILL.md` and references
3. `.agents/skills/rea-changelog-update/SKILL.md`
4. `.agents/skills/rea-ci-tests-audit/SKILL.md` and references
5. `.agents/skills/rea-tool-design/SKILL.md`

The original files are not modified. The bundle builder recursively includes text files and references from each original skill directory.

## Build Knowledge files

From the repository root:

```bash
node scripts/build-chatgpt-knowledge.mjs
```

This creates `dist/chatgpt-knowledge/` with one Markdown file per original skill, selected technical references, the new Android/native/software-analysis guide, and a source manifest with SHA-256 hashes.

## Configure ChatGPT

1. Open **Explore GPTs → Create**.
2. Name the GPT **REA Reverse Engineering**.
3. Paste `GPT_INSTRUCTIONS.md` into the Instructions field.
4. Upload the generated Markdown files from `dist/chatgpt-knowledge/` to Knowledge.
5. Enable only the capabilities you need. Web search can verify public documentation; it does not provide access to your local REA installation.
6. Save and test the GPT using an authorized APK or binary analysis report.

## Capability boundary

A custom GPT's instructions and Knowledge do not automatically install or execute REA, connect to a local MCP server, run JADX/Ghidra/IDA, or access files on your device. Live REA execution requires a separately hosted and authenticated ChatGPT-compatible app/MCP integration. This package prepares an REA-informed custom GPT; it does not claim that a live connector has been deployed.

The original skills and technical documentation remain authoritative. Generated Knowledge files are snapshots; rebuild after source updates.
