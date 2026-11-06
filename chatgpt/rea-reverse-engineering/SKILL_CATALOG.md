# Original REA skill catalog

This catalog maps the five original skills to their preserved source locations and intended use. The source files are authoritative and are bundled verbatim by `scripts/build-chatgpt-knowledge.mjs`.

| Original skill | Preserved source | Use it for |
|---|---|---|
| Reverse Engineer Anything | `.agents/skills/reverse-engineer-anything/` | Select and execute the appropriate evidence-driven reverse-engineering workflow across native, managed, packaged, browser, firmware, Android, and runtime targets. Includes the skill's reference library. |
| REA Analysis Optimization | `.agents/skills/rea-analysis-optimization/` | Optimize analysis latency, CPU, memory, context, caching, reuse, and projection while preserving correctness and Evidence. Includes its Kuna case-study reference. |
| REA Changelog Update | `.agents/skills/rea-changelog-update/` | Prepare release changelogs, verify contributor attribution from pinned history, and synchronize release notes with Release Please. Does not authorize publishing or merging. |
| REA CI Tests Audit | `.agents/skills/rea-ci-tests-audit/` | Audit CI/test coverage, fixture drift, false passes, failure gates, and measured suite efficiency. Includes measurement and CI reference material. |
| REA Tool Design | `.agents/skills/rea-tool-design/` | Design or change investigation tools, CLI/MCP contracts, provider capabilities, and Evidence semantics. |

## Additional ChatGPT-facing workflow

`ANDROID_NATIVE_SOFTWARE_ANALYSIS.md` adds a focused workflow for Android packages, native binaries/shared libraries, and software behavior analysis. It supplements the original five and does not replace them.

## Preservation and limitations

- No original skill file is rewritten by this package.
- The bundle builder recursively includes text files under each skill directory, including reference documents and agent metadata.
- Technical REA docs are included when present in the checkout; missing optional paths are reported and skipped rather than fabricated.
- Generated Knowledge files are snapshots. Re-run the builder after updating the repository.
- This catalog and the generated Knowledge files do not create a live REA MCP connection inside ChatGPT.
