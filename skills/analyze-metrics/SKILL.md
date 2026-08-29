---
name: analyze-metrics
description: Answer "how is X doing" questions about product metrics using Mostly Good Metrics — usage trends, active users, event volumes, signups, feature adoption. Use when the user asks about how their product, feature, or metric is performing, wants numbers over time, or asks to compare periods.
---

# Analyze Metrics

Answer product-metric questions with real numbers from Mostly Good Metrics (MGM), not vibes.

## Access paths

Use the connected MGM MCP when available: `mgm_whoami`, `mgm_list_projects`,
`mgm_get_dashboard`, `mgm_get_filters`, `mgm_list_event_types`, and
`mgm_execute_query`. With the CLI, use the equivalents: `mgm dashboard`,
`mgm dashboard filters`, `mgm events types`, and `mgm queries execute`.
Prefer MCP for conversational exploration and `mgm ... --json` for reproducible
or scripted work. Never claim a tool returned data that you did not run.

## Workflow

1. **Orient.** If you don't know which project to query, call `whoami` and `list_projects`. If there are multiple projects, ask which one (or pick the obvious match to the user's question and say so).
2. **Check the dashboard first.** For broad "how are things going" questions, call `get_dashboard` — its widgets are the metrics the team already cares about, powered by saved queries. Often this answers the question directly.
3. **Find the right events.** For specific questions, call `list_event_types` to see what's actually tracked. Match the user's language to real event names (e.g. "signups" might be `user_signed_up`). Use `get_filters` to discover available properties and values for grouping/filtering.
4. **Query.** Use `execute_query` for ad-hoc questions. Prefer:
   - **Date range:** last 30 days by default; last 7 days for "this week" questions; honor explicit ranges.
   - **Grouping:** group by the dimension in the question (platform, plan, `$app_version`, country, etc.). `$`-prefixed properties are auto-collected (device/app metadata) — good default groupings.
   - **Comparison:** for "how is X doing", also run the same query for the prior equal-length period so you can report deltas.
5. **Save when asked.** Only call `create_query` if the user wants to keep the metric (it can then power a dashboard widget). Don't save ad-hoc explorations.

## Presenting results

- Lead with the headline number and the delta: "12,430 sessions in the last 30 days, up 8% vs. the prior 30 days."
- Use a compact table for grouped results; sort by volume; cap at ~10 rows and roll up the tail as "other".
- Call out notable movers (biggest absolute and biggest relative change), and flag low-sample groups instead of over-interpreting them.
- State the date range and any filters you applied.
- If an event the user asked about doesn't exist in `list_event_types`, say so and suggest the closest tracked event — or suggest instrumenting it (the instrument-my-app skill covers that).
