# Agent instructions

This repository is the canonical source for portable Mostly Good Metrics
skills used by Codex, Claude Code, and other compatible agents.

Before changing a skill, read `README.md` and the target `SKILL.md`. Keep skills
client-neutral: describe MGM decisions and available MCP/CLI routes without
embedding one coding agent's repository conventions. Private Support MCP and
admin-only workflows do not belong here.

When MGM tool names, permissions, or product semantics change, update every
affected skill and the README in the same change. The Claude plugin is a mirror,
not a second source of truth.

Run `npm test` after edits. Keep diffs focused and do not publish the package or
modify external services unless explicitly requested.
