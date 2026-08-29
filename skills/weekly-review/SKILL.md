---
name: weekly-review
description: Produce a compact weekly product report from Mostly Good Metrics — WAU, signups, and top-event deltas vs. the prior week, notable movers, and one suggested action.
disable-model-invocation: true
---

# Weekly Review

Produce a compact weekly report. Keep the whole output under ~30 lines. Numbers, not narrative.

## Access paths

Use MCP (`mgm_get_dashboard`, `mgm_list_event_types`, `mgm_execute_query`,
`mgm_list_funnels`, `mgm_execute_funnel`) when it is connected. Otherwise use
`mgm dashboard --range 7d --json`, `mgm events types --range 7d --json`,
`mgm queries execute ... --json`, and `mgm funnels ... --json`. Keep the two
seven-day windows equal and state which path supplied the data.

## Gather (last 7 days vs. the 7 days before)

1. `whoami` / `list_projects` if the project isn't already known; if multiple, ask once.
2. `get_dashboard` for the team's headline widgets.
3. `list_event_types`, then `execute_query` for:
   - **WAU** — unique users active in the last 7 days, and the prior 7 days.
   - **Signups** — the signup event (match the closest event name, e.g. `user_signed_up`), both weeks.
   - **Top events** — event counts for the week, both weeks, to compute deltas.
4. Optionally `list_funnels` / `execute_funnel` for the primary conversion funnel if one exists — include its end-to-end rate and week-over-week change.

## Report format

```
# Weekly Review — <project> (<date range>)

WAU:      1,234  (+5.2% WoW)
Signups:    210  (−3.1% WoW)
Funnel:   12.4%  onboarding end-to-end (+0.8pt WoW)   ← only if a funnel exists

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
