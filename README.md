# Mostly Good Metrics Skills

Official portable agent skills for Mostly Good Metrics. They work with Codex, Claude Code, and other agents supported by the standard [`skills`](https://skills.sh) installer.

The skills are also published as [`@mostly-good-metrics/skills`](https://www.npmjs.com/package/@mostly-good-metrics/skills), so projects can keep them in `node_modules` and sync them with supporting skill tooling.

## Install

```bash
# Choose skills and agent targets interactively.
npx skills add Mostly-Good-Metrics/skills

# Preview the available skills.
npx skills add Mostly-Good-Metrics/skills --list

# Install every skill globally for Codex.
npx skills add Mostly-Good-Metrics/skills --agent codex --global --yes

# Install every skill globally for Claude Code.
npx skills add Mostly-Good-Metrics/skills --agent claude-code --global --yes

# Install one skill for Codex without prompts.
npx skills add Mostly-Good-Metrics/skills --skill instrument-my-app --agent codex --global --yes
```

Skills teach an agent how to use MGM; they do not install or authenticate the
MGM MCP server. Connect `https://app.mostlygoodmetrics.com/mcp` in the client,
then complete browser OAuth on the first tool call. The skills can also use the
`mgm` CLI when MCP is unavailable or local scripting is a better fit.

After installation, restart the client if it was already running. Ask it to
list MGM skills or invoke one by name (for example, `instrument-my-app`) to
verify discovery before starting customer work.

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

Every skill states its MCP tools and CLI equivalents. Both surfaces support the
complete product-analytics workflow: event catalog, queries, funnels, retention,
experiments, and dashboard widgets. Skills use the connected MCP for interactive
work and the CLI for local scripting or when it is the user's preferred path.

The Claude Code plugin lives separately at [`Mostly-Good-Metrics/claude-plugin`](https://github.com/Mostly-Good-Metrics/claude-plugin). This repository contains only cross-agent portable skills.

## Source of truth

This repository is canonical for MGM skill instructions. The Claude Code plugin
mirrors these files so its one-command install includes MCP configuration and
skills together. Make skill behavior changes here first, then sync the plugin.

Repository-specific `AGENTS.md` or `CLAUDE.md` instructions still take
precedence for codebase conventions. These skills describe MGM product
workflows and should not duplicate a consuming repository's build or review
rules.

## Contributing

- Keep each skill in `skills/<name>/SKILL.md` with matching frontmatter `name`.
- Keep descriptions specific enough for reliable automatic discovery.
- Describe both MCP and CLI routes when both support the workflow.
- Keep private Support MCP and admin-only operations out of public skills.
- Update tool names and semantics in the same change that updates MGM.
- Run `npm test` before publishing or syncing the Claude plugin.
