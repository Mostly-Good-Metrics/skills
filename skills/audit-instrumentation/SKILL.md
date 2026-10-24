---
name: audit-instrumentation
description: Audit Mostly Good Metrics event quality and diagnose missing, duplicate, or misleading analytics. Use when metrics look wrong, events are absent, a funnel is impossible to build, or an SDK rollout needs verification.
---

# Audit Instrumentation

Establish whether the data is trustworthy before drawing a product conclusion.

## Tool routing

Use MCP `list_event_types`, `list_events`, `define_event`, and `get_filters`;
use CLI `mgm events
types|list|send|define` and `mgm dashboard filters`. Both paths manage the
event catalog without sending a fake analytics event.

## Workflow

1. State the expected contract: event name, when it fires, required safe
   properties, identity behavior, and expected volume.
2. Inspect observed event types and recent raw events. Compare spelling, casing,
   properties, timestamps, environment, and platform to the contract.
3. Define planned but not-yet-observed events with `define_event` or the
   CLI, without sending fake production analytics:

```bash
mgm events define activation_completed --description "User completed the activation checklist"
```

4. Send a clearly labeled test event with `mgm events send` only when
   appropriate, then confirm it appears in recent events. Never add PII to a
   test payload.
5. Diagnose in this order: wrong project/key, SDK not initialized, consent
   opt-out, naming mismatch, event fired before identity/configuration, duplicate
   handlers, then ingestion delay.
6. Finish with a small event contract table and the exact code/product change
   required. Hand off implementation to `instrument-my-app`.
