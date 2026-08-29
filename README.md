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

The Claude Code plugin lives separately at [`Mostly-Good-Metrics/claude-plugin`](https://github.com/Mostly-Good-Metrics/claude-plugin). This repository contains only cross-agent portable skills.
