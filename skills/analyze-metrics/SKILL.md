---
name: analyze-metrics
description: Answer "how is X doing" questions about product metrics using Mostly Good Metrics — usage trends, active users, event volumes, signups, feature adoption. Use when the user asks about how their product, feature, or metric is performing, wants numbers over time, or asks to compare periods.
---

# Analyze Metrics

Answer product-metric questions with real numbers from Mostly Good Metrics (MGM), not vibes.

## Access paths

Use the connected MGM MCP when available: `mgm_whoami`, `mgm_list_projects`,
`mgm_get_dashboard`, `mgm_get_filters`, `mgm_list_event_types`, and
`mgm_execute_query`. Use `query_metrics` when two or more aggregate metrics
or a previous-period comparison are needed. With the CLI, use the equivalents: `mgm dashboard`,
`mgm dashboard filters`, `mgm events types`, and `mgm queries execute`.
Prefer MCP for conversational exploration and `mgm ... --json` for reproducible
or scripted work. Never claim a tool returned data that you did not run.

## Workflow

1. **Orient.** If you don't know which project to query, call `whoami` and `list_projects`. If there are multiple projects, ask which one (or pick the obvious match to the user's question and say so).
2. **Check the dashboard first.** For broad "how are things going" questions, call `get_dashboard` — its widgets are the metrics the team already cares about, powered by saved queries. Often this answers the question directly.
3. **Find the right events.** For specific questions, call `list_event_types` to see what's actually tracked. Match the user's language to real event names (e.g. "signups" might be `user_signed_up`). Use `get_filters` to see the project's real values for event names, platforms, environments, countries, and app versions. It does not list custom property names — read a few events with `list_events` / `mgm events list` to find those.
4. **Query.** Use `query_metrics` for multiple aggregate answers or comparisons in one call; give every query a unique ID. Set `compare` to `previous_period` only on ungrouped scalar queries. For grouped comparisons, send two grouped queries with explicit custom date ranges and compare their groups. Use `mgm_execute_query` for a single query or query shapes `query_metrics` does not support. Keep the whole batch within 3,660 day-scans, counting previous-period legs separately. Prefer:
   - **Date range:** last 30 days by default; last 7 days for "this week" questions; honor explicit ranges.
   - **Grouping:** group by the dimension in the question. Built-in dimensions are bare names — `platform`, `app_version`, `os_version`, `country`, `environment`, `event_name` and the rest — and anything else must be `prop:<name>`. Device and app metadata already has a built-in dimension, so use `app_version`, not `prop:$app_version`. A custom property like a plan tier is `prop:plan`.
   - **Comparison:** for an ungrouped "how is X doing" metric, request `previous_period` so MGM returns equal-length completed current and prior periods plus scalar deltas. The current period ends before today to avoid treating a partial day as a drop. Read the returned start/end dates and use them when presenting the result.
5. **Save when asked.** Only call `create_query` if the user wants to keep the metric (it can then power a dashboard widget). Don't save ad-hoc explorations.

## Writing filters

Every query takes the same `filters` object. Dimension keys are `platforms`,
`event_names`, `environments`, `app_versions`, `countries`, `regions`, and
`cities` (the singular spellings mean the same thing). Each takes a string or
an array of strings; values inside one key are OR'd and separate keys are
AND'd.

Custom properties use a `prop:<name>` key:

```json
{
  "platforms": ["iOS"],
  "prop:plan": "pro",
  "prop:revenue": { "op": "gt", "type": "number", "value": 100 }
}
```

A clause takes `op` (default `eq`), `type` (`string` default, `number`,
`boolean`, `datetime`, `enum`), and `value` or `values`. Strings support `eq`,
`neq`, `in`, `not_in`, `contains`, `not_contains`, `starts_with`, `ends_with`;
numbers add `gt`, `gte`, `lt`, `lte`, `between`; datetimes use `before`,
`after`, `on_or_before`, `on_or_after`, `between`; any type supports `is_set`
and `is_not_set`. Set `type` whenever you want a numeric or chronological
comparison — the default compares text. Clauses inside one `prop:` key are
OR'd; different `prop:` keys are AND'd.

A `prop:` filter is answered from raw events rather than daily aggregates, so
it is slower than a dimension filter. Prefer a dimension filter when one
covers what you need.

Unique-user, unique-session, and DAU queries grouped or broken down by a
`prop:` dimension return `{"type": "unavailable"}`, by design. Group by a
built-in dimension or use `count_events` instead.

The MCP tool descriptions carry this same reference, and the full version is
at https://docs.mostlygoodmetrics.com/api/query-definition.

## Presenting results

- Lead with the headline number and the delta: "12,430 sessions in the last 30 days, up 8% vs. the prior 30 days."
- Use a compact table for grouped results; sort by volume; cap at ~10 rows and roll up the tail as "other".
- Call out notable movers (biggest absolute and biggest relative change), and flag low-sample groups instead of over-interpreting them.
- State the date range and any filters you applied.
- If an event the user asked about doesn't exist in `list_event_types`, say so and suggest the closest tracked event — or suggest instrumenting it (the instrument-my-app skill covers that).
