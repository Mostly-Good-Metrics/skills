---
name: instrument-my-app
description: Add Mostly Good Metrics analytics to an app — pick the right MGM SDK (Swift, Android, Flutter, JavaScript, React Native, Capacitor), install it, name events well, avoid tracking PII, and wire up experiments. Use when the user wants to add analytics, track events, or integrate MGM into their codebase.
---

# Instrument My App

Wire Mostly Good Metrics into the user's codebase with the right SDK, well-named events, and no PII.

## Access paths

Use MCP for `mgm_list_projects`, `mgm_create_project`, `mgm_create_api_key`,
`mgm_list_event_types`, and `mgm_send_events`. CLI equivalents are `mgm init`,
`mgm projects list|create`, `mgm keys create`, `mgm events types`, and `mgm
events send`. `mgm init --project "<name>" --sdk <sdk>` is the fastest CLI
path because it creates the project, API key, and local `.mgm.json` context.

## Setup

1. **API key.** The SDK needs a project API key. Use `list_projects` to find the project (or `create_project` for a new app), then `create_api_key`. Tell the user to keep it in config, not hardcoded in source.
2. **Pick the SDK from the stack** (detect from the codebase — package.json, Podfile/Package.swift, build.gradle, pubspec.yaml):

| Stack | SDK | Install |
|---|---|---|
| iOS / macOS / tvOS / watchOS (Swift) | swift-sdk | SPM: `.package(url: "https://github.com/Mostly-Good-Metrics/mostly-good-metrics-swift-sdk", from: "latest")` — product `MostlyGoodMetrics` |
| Android (Kotlin/Java) | android-sdk | Gradle: `implementation("com.mostlygoodmetrics:sdk:<latest>")` |
| Flutter | flutter-sdk | `flutter pub add mostly_good_metrics_flutter` |
| Web / Node (JS/TS) | javascript | `npm install @mostly-good-metrics/javascript` |
| React Native | react-native | `npm install @mostly-good-metrics/react-native` |
| Capacitor | capacitor | `npm install @mostly-good-metrics/capacitor` |

3. **Minimal init + track** (JS shown; the other SDKs mirror the same `configure`/`track` shape):

```ts
import { MostlyGoodMetrics } from "@mostly-good-metrics/javascript";

MostlyGoodMetrics.configure({ apiKey: MGM_API_KEY });
MostlyGoodMetrics.track("project_created", { template: "blank", source: "onboarding" });
```

Keep the integration minimal: initialize once at app start, track at the few moments that matter. Don't scatter tracking calls through every function.

## Event naming

- **snake_case, verb-based, past tense:** `user_signed_up`, `checkout_completed`, `report_exported`. Not `SignUp`, not `click_button_3`.
- One event per meaningful action; put variation in **properties**, not in the event name (`plan: "pro"` on `subscription_started`, not `subscription_started_pro`).
- Don't use a `$` prefix for your own properties — `$`-prefixed properties (device, OS, app version, locale) are auto-collected by the SDK.
- Before inventing names, check `list_event_types` on the project and reuse the existing conventions.

## What NOT to track

Never put PII in event properties: no emails, names, phone numbers, addresses, free-text user input, tokens, or payment details. Use opaque user IDs. If a property could identify a person, drop it or hash it. When in doubt, leave it out — you can always add a property later; you can't untrack it.

## Privacy knobs

Mention these to the user:

- `optOut()` / `optIn()` — disable/re-enable all tracking for a user (consent flows, GDPR); the choice is persisted and events are dropped client-side while opted out.
- `collectDeviceProperties` (configure option, default true) — set to false to stop auto-collecting `$`-prefixed device/app properties (model, locale, timezone, etc.).

## Experiments

If the user wants A/B tests: create the experiment with `create_experiment` and launch with `start_experiment` (MGM buckets users deterministically), then read the assignment in code:

```ts
const variant = MostlyGoodMetrics.getVariant("onboarding_copy_test", "control");
if (variant === "variant_b") { /* new copy */ }
```

Track the outcome event normally — MGM ties conversions to variants automatically.

After instrumenting, suggest verifying with `list_events` (raw recent events) that the new events arrive with the expected properties. Full docs: https://docs.mostlygoodmetrics.com
