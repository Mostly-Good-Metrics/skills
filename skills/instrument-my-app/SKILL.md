---
name: instrument-my-app
description: Add Mostly Good Metrics analytics to an app — pick the right MGM SDK (Swift, Android, Flutter, JavaScript, React Native, Capacitor), install it, name events well, avoid tracking PII, wire up experiments, and handle per-user export or erasure requests. Use when the user wants to add analytics, track events, integrate MGM into their codebase, or fulfill a user's data access or deletion request.
---

# Instrument My App

Wire Mostly Good Metrics into the user's codebase with the right SDK, well-named events, and no PII.

## Access paths

Use MCP for `list_projects`, `create_project`, `list_api_keys`,
`create_api_key`, `revoke_api_key`, `list_event_types`, and `list_events`. CLI
equivalents are `mgm init`, `mgm projects list|create`,
`mgm keys list|create|revoke`, `mgm events types`, and `mgm events list|send`.
For per-user privacy requests, use MCP `export_user_data` and
`erase_user_data`, or CLI `mgm users export|erase`.
`mgm init --project "<name>" --sdk <sdk> --allow <bundle-id-or-domain>` is the
fastest CLI path because it creates the project, a restricted development API
key, and local `.mgm.json` context. Creating an unrestricted key requires the
explicit `--unrestricted` flag and confirmation.

## Setup

1. **API key.** The SDK needs a project API key. Use `list_projects` to find the
   project (or `create_project` for a new app), then `create_api_key`. Restrict
   it with `allowed_identifiers` by default:
   Apple bundle IDs or Android package names for native apps,
   production/preview domains for web apps, and `localhost` only when local
   development needs it. Set `unrestricted: true` only when the user explicitly
   needs every source. The raw key is returned once. Use a dedicated key per
   client, do not reuse a server/admin credential, and inject it through local
   build configuration when practical. Client SDK keys can be extracted from a
   shipped app, so their allowlist is the real misuse boundary.
2. **Pick the SDK from the stack** (detect from the codebase — package.json, Podfile/Package.swift, build.gradle, pubspec.yaml):

| Stack | SDK | Install |
|---|---|---|
| iOS / macOS / tvOS / watchOS (Swift) | swift-sdk | SPM: `.package(url: "https://github.com/Mostly-Good-Metrics/mostly-good-metrics-swift-sdk", from: "latest")` — product `MostlyGoodMetrics` |
| Android (Kotlin/Java) | android-sdk | Add `https://jitpack.io`, then Gradle: `implementation("com.github.Mostly-Good-Metrics:mostly-good-metrics-android-sdk:0.5.0")` |
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

This includes property values. Daily property aggregates can retain raw values
without a user ID, so per-user erasure cannot safely attribute and remove those
values. Do not put personal data in analytics property values.

## Privacy knobs

Mention these to the user:

- `optOut()` / `optIn()` — disable/re-enable all tracking for a user (consent flows, GDPR); the choice is persisted and events are dropped client-side while opted out.
- `collectDeviceProperties` (configure option, default true) — set to false to stop auto-collecting `$`-prefixed device/app properties (model, locale, timezone, etc.).

## Per-user privacy requests

Only an organization owner or admin can export or erase an end user's project
data. Use the connected MGM OAuth session or the CLI's signed-in user session;
project ingestion keys are rejected.

1. For an access request, call `export_user_data(project_id, user_id, limit?,
   cursor?)` or `mgm users export <user_id> [--out <path>]`. Continue with the
   returned cursor until `has_more` is false. The export includes alias-expanded
   events, profiles, and experiment assignments.
2. If alias expansion finds more than 1,000 linked IDs, stop and report the
   error. MGM does not return a partial identity export or perform a partial
   erasure.
3. Treat erasure as irreversible. Call `erase_user_data(project_id, user_id,
   confirm: true)` or `mgm users erase <user_id>` only after the user explicitly
   confirms the deletion. MCP's `confirm: true` guards against an accidental
   tool call; the signed-in owner's or admin's permissions are the authorization
   boundary. The CLI prompts unless `--yes` is supplied.
4. Erasure deletes alias-expanded events, daily activity, profiles, aliases,
   and experiment assignments from PostgreSQL, then queues ClickHouse event
   cleanup. Pair it with the SDK's "forget me" reset so the device stops sending
   linkable events.

## Experiments

If the user wants A/B tests: create the experiment with `create_experiment` and launch with `start_experiment` (MGM buckets users deterministically), then read the assignment in code:

```ts
const variant = MostlyGoodMetrics.getVariant("onboarding_copy_test", "control");
if (variant === "variant_b") { /* new copy */ }
```

Track the outcome event normally — MGM ties conversions to variants automatically.

After instrumenting, suggest verifying with `list_events` (raw recent events) that the new events arrive with the expected properties. Full docs: https://docs.mostlygoodmetrics.com
