---
name: run-experiment
description: Plan, launch, monitor, and conclude a Mostly Good Metrics A/B experiment. Use when the user wants to test a product change, configure variants, choose a goal metric, or interpret experiment results.
---

# Run Experiment

Run a bounded experiment with a measurable outcome—not a variant switch with a
hopeful dashboard.

## Tool routing

MCP supports the complete lifecycle: `mgm_list_experiments`,
`mgm_create_experiment`, `mgm_get_experiment`, `mgm_update_experiment`,
`mgm_start_experiment`, `mgm_stop_experiment`, and `mgm_delete_experiment`.
`mgm_get_experiment` includes results and statistics. CLI equivalents are `mgm
experiments list|create|show|update|start|results|stop|delete`.

## Workflow

1. Define one hypothesis, target population, primary goal event, guardrail, and
   minimum observation window. The goal must be an event already tracked; check
   with `mgm_list_event_types` or `mgm events types`.
2. Create clear variants. Keep `control`; use descriptive names such as
   `short_onboarding`, not `v2`.
3. Create the experiment, then wire the app to read its deterministic assignment
   with the SDK's `getVariant(experimentName, "control")`. Track the goal event
   normally. Do not launch before the assignment and goal event are verified.
4. Start it only after the user confirms scope:

```bash
mgm experiments create --name "onboarding_copy" --variants "control,short_copy" --goal "activation_completed"
mgm experiments start <experiment-id>
```

5. Monitor with `mgm_get_experiment` or `mgm experiments results <id>`. Report
   sample sizes, conversion rate per variant,
   date window, and uncertainty; do not declare a winner from tiny samples.
6. Stop only with explicit approval, then state the decision: ship, iterate, or
   keep collecting.

## Guardrails

- One primary outcome per experiment; treat secondary metrics as diagnostic.
- Avoid mid-test variant or goal changes.
- A missing goal event is an instrumentation problem, not a negative result.
- Never promise statistical significance unless MGM returned the calculation.
