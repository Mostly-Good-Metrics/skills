---
name: build-dashboard
description: Build or improve a Mostly Good Metrics dashboard with saved queries and useful widgets. Use when the user wants a dashboard, KPI board, query widgets, or a clearer executive/product view.
---

# Build Dashboard

Build a dashboard that answers decisions, not a wall of charts.

## Tool routing

MCP and CLI both support this workflow. With MCP use `mgm_get_dashboard`,
`mgm_list_queries`, `mgm_create_query`, `mgm_execute_query`,
`mgm_list_widgets`, `mgm_add_widget`, `mgm_remove_widget`, and
`mgm_reset_widgets`. CLI equivalents are `mgm dashboard`, `mgm queries`, and
`mgm widgets list|add|remove|reset`.

## Workflow

1. Inspect before changing anything: use `mgm_get_dashboard` / `mgm dashboard
   --json`, `mgm_list_queries` / `mgm queries list`, and `mgm widgets list`.
2. Pick no more than five decision questions: activity, acquisition, activation,
   retention, and revenue/outcome. Omit a question when no trustworthy event
   exists yet.
3. Verify event names with `mgm_list_event_types` or `mgm events types`. Create
   a saved query only when it is reusable; then execute it once before adding a
   widget.
4. Use a balanced first dashboard:
   - stat: weekly active users or total events;
   - stat: signups or the primary outcome;
   - query: daily active users trend;
   - query: top events or activation by platform;
   - one short text widget explaining the dashboard's decision and date range.
5. Add a widget through the connected MCP or CLI. CLI example:

```bash
mgm queries create --name "Weekly active users" --metric unique_users --group-by date --range 30d --visualization line
mgm widgets add query --query <query-id>
mgm widgets add stat --stat-type unique_users
```

6. Re-list widgets and summarize what each answers. Never reset or remove
   existing widgets without explicit permission.

## Rules

- Name queries by the question they answer, e.g. `Activation by platform`, not
  `Query 3`.
- Use one stable date range per chart and state it.
- Prefer one decision metric over vanity-event volume.
- If events are insufficient, hand off to `instrument-my-app` rather than
  constructing misleading widgets.
