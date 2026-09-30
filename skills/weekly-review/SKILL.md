---
name: weekly-review
description: Produce a compact weekly product report from Mostly Good Metrics — WAU, signups, top-event deltas vs. the prior week, goal pace when a goal exists, notable movers, and one suggested action.
---

# Weekly Review

Produce a compact weekly report. Keep the whole output under ~30 lines. Numbers, not narrative.

## Access paths

Use MCP (`mgm_get_dashboard`, `mgm_list_event_types`, `query_metrics`,
`mgm_list_funnels`, `mgm_execute_funnel`, `mgm_list_goals`) when it is connected.
Otherwise use `mgm dashboard --range 7d --json`, `mgm events types --range 7d --json`,
`mgm queries execute ... --json`, `mgm funnels ... --json`, and
`mgm goals list --json`. Keep the two seven-day windows equal and state which
path supplied the data.

## Gather (last 7 days vs. the 7 days before)

1. `whoami` / `list_projects` if the project isn't already known; if multiple, ask once.
2. `get_dashboard` for the team's headline widgets.
3. `mgm_list_event_types`, then one `query_metrics` call for completed seven-day periods:
   - **WAU** — an ungrouped unique-users query with `compare: previous_period`.
   - **Signups** — an ungrouped count for the signup event (match the closest event name, e.g. `user_signed_up`) with `compare: previous_period`.
   - **Top events** — two `group_by: event_name` queries without `compare`, using explicit custom date ranges for the completed current and prior weeks; join the groups by event name to compute deltas.
   - Use the returned current/previous start and end dates in the report rather than inferring them from the nominal range.
4. Optionally `list_funnels` / `execute_funnel` for the primary conversion funnel if one exists — include its end-to-end rate and week-over-week change.
5. If `list_goals` / `mgm goals list` returns any goals, include each one's source, target, percent complete, and `pace_line_text`. Do not create a goal from this report.

## Report format

```
# Weekly Review — <project> (<date range>)

WAU:      1,234  (+5.2% WoW)
Signups:    210  (−3.1% WoW)
Funnel:   12.4%  onboarding end-to-end (+0.8pt WoW)   ← only if a funnel exists
Goals:    unique users → 1,000 by Oct 31   42%   12% behind — need +40/day   ← only if a goal exists

Top events (WoW):
  event_name        12,340   +8%
  ...top 5...

Notable movers:
- <event/segment with the biggest surprising change, with numbers and a one-line hypothesis>
- <second one if warranted>

Suggested action:
- <ONE concrete, specific next step derived from the data above>
```

## Rules

- Compare strictly equal 7-day windows; show deltas as % (or points for rates). Mark anything with tiny sample sizes instead of hyping a "+300%" on 4 events.
- "Notable movers" means surprising: new events appearing, a top event dropping, a platform diverging — not the same growth already shown in the headline numbers.
- Exactly one suggested action, and it must follow from a number in the report (e.g. "signups fell 12% while opens grew — run funnel-doctor on the signup flow").
- If a metric can't be computed (event not tracked), say so in one line rather than omitting silently.
