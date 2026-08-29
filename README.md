# Mostly Good Metrics Skills

Official portable agent skills for Mostly Good Metrics. They work with Codex, Claude Code, and other agents supported by the standard [`skills`](https://skills.sh) installer.

The skills are also published as [`@mostly-good-metrics/skills`](https://www.npmjs.com/package/@mostly-good-metrics/skills), so projects can keep them in `node_modules` and sync them with supporting skill tooling.

## Install

```bash
# Choose skills and agent targets interactively.
npx skills add Mostly-Good-Metrics/skills

# Preview the available skills.
npx skills add Mostly-Good-Metrics/skills --list

# Install one skill for Codex without prompts.
npx skills add Mostly-Good-Metrics/skills --skill instrument-my-app --agent codex --global --yes
```

## Included skills

- `instrument-my-app` — instrument an app with MGM safely.
- `analyze-metrics` — investigate product metrics with real MGM data.
- `funnel-doctor` — build and diagnose conversion funnels.
- `weekly-review` — produce a focused weekly product report.
- `build-dashboard` — create saved queries and dashboard widgets that answer decisions.
- `run-experiment` — plan, launch, monitor, and conclude A/B experiments.
- `retention-cohorts` — create and interpret cohort retention analyses.
- `audit-instrumentation` — validate event contracts and debug bad analytics data.

## MCP and CLI coverage

Every skill states its MCP tools and CLI equivalents. The CLI currently has the
broader management surface: dashboard widget CRUD and the complete experiment
lifecycle are CLI-only fallbacks when those MCP tools are not connected. Skills
use MCP for interactive analysis where possible and the CLI for any operation
MCP does not expose.

The Claude Code plugin lives separately at [`Mostly-Good-Metrics/claude-plugin`](https://github.com/Mostly-Good-Metrics/claude-plugin). This repository contains only cross-agent portable skills.
