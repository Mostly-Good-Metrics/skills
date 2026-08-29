---
name: retention-cohorts
description: Build and interpret Mostly Good Metrics retention cohorts. Use when the user asks who comes back, whether a release improved retention, or how activation relates to repeat usage.
---

# Retention Cohorts

Measure whether people return after reaching meaningful value.

## Tool routing

MCP: `mgm_list_retentions`, `mgm_create_retention`, `mgm_execute_retention`.
CLI: `mgm retention list|create|execute|update`. Both paths support core cohort
analysis; use CLI `--json` for a saved, reproducible report.

## Workflow

1. Choose the cohort event: first meaningful value, not merely `app_opened`.
   Choose the retention event: repeat value if available, otherwise any event.
2. Validate both event names using `mgm_list_event_types` or `mgm events types`.
3. Create a weekly cohort with days 1, 7, 14, and 30 by default; use daily only
   for high-volume products.

```bash
mgm retention create --name "Activation retention" \
  --cohort-event "activation_completed" \
  --retention-event "core_action_completed" \
  --grain week --days 1,7,14,30 --range 90d
mgm retention execute <retention-id>
```

4. Compare mature cohorts only. Call out whether the newest cohort is incomplete
   rather than treating its missing later periods as churn.
5. Report cohort size, D1/D7/D30 rates, trend across cohorts, and one likely
   product follow-up. Segment only after a material change is visible.

## Rules

- Never mix a signup cohort with a retained-any-event definition without saying
  so.
- Small cohorts are directional, not decisive.
- If the relevant events do not exist, hand off to `instrument-my-app`.
