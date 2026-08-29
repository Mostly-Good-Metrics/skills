---
name: funnel-doctor
description: Build and diagnose conversion funnels in Mostly Good Metrics — onboarding flows, checkout, activation, any multi-step conversion. Use when the user wants to know where users drop off, why conversion is low, or wants to create or analyze a funnel.
---

# Funnel Doctor

Build conversion funnels from real tracked events, find the leaky step, and suggest fixes ranked by expected impact.

## Building a funnel

1. **Check for an existing funnel first.** Call `list_funnels` — if one matches the flow the user is asking about, use `execute_funnel` on it instead of creating a duplicate.
2. **Choose steps from real events.** Call `list_event_types` and pick 3–6 events that map to the user's flow, in chronological order (e.g. `app_opened` → `signup_started` → `user_signed_up` → `first_project_created`). Confirm the step list with the user if the mapping is ambiguous.
3. **Create and run.** Use `create_funnel` with the steps and a sensible `conversion_window` (default: 7 days; use 1 day for single-session flows like checkout, 30 days for slow B2B activation). Then `execute_funnel` over the last 30 days by default.

## Diagnosing drop-offs

For each step transition, report: users entering, users converting, step conversion rate, and cumulative conversion. Then:

- **Find the worst step** by absolute users lost, not just percentage — fixing a 60% drop on 10,000 users beats fixing an 80% drop on 200.
- **Segment the leak.** Re-run or filter (via `get_filters` dimensions like platform, `$app_version`, country) to see if the drop-off is concentrated — a step that fails only on Android or only on the latest version points to a bug, not a UX problem.
- **Sanity-check instrumentation.** A step converting at ~0% or ~100% usually means a missing/misfired event, not user behavior. Check recent raw events with `list_events` if suspicious.

## Suggesting fixes

Rank suggestions by expected recovered users (step traffic × plausible improvement). Be concrete and tied to the step:

1. Biggest leak first: name the step, users lost per period, and 1–2 specific interventions (shorten the form, defer the permission prompt, add a guest path, fix the platform-specific bug).
2. For each fix, estimate impact: "recovering half of this drop ≈ +N conversions/month."
3. Offer to A/B test the fix with `create_experiment` / `start_experiment` (MGM experiments use deterministic bucketing; the app reads the variant via the SDK's `getVariant()`), so the funnel itself measures the outcome.

Present the funnel as a compact table (step, entered, converted, rate, cumulative) with the leak and the ranked fixes below it. Always state the date range and conversion window.
