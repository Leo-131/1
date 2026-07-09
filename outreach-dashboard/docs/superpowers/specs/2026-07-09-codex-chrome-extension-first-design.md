# Codex Chrome Extension First Design

Date: 2026-07-09

## Problem

The dashboard labels the browser execution layer as "Codex Chrome Extension",
but `main.js` currently discovers or launches a Chrome DevTools Protocol (CDP)
browser on ports 9222-9225. That is a separate transport and may use a separate
Chrome profile. A connected Codex Chrome Extension therefore does not prove
that `npm run daily:execute` is using the extension.

Runs with no executable queue items correctly stop before browser startup. This
must remain distinct from extension connection failures.

## Objective

Use the connected Codex Chrome Extension as the preferred browser transport
when the automation is running under a Codex browser runtime. Retain the
existing CDP driver as a bounded fallback. Report the transport actually used
without implying that Chrome opened or customer development occurred.

## Constraints

- Preserve exact-target identity checks, cooldown rules, confirmed-message
  duplicate protection, credential gates, and send confirmation.
- Do not contact a customer during transport health checks.
- Standalone Electron and scheduled command execution cannot assume access to
  Codex's browser-extension runtime. They must fall back safely when that
  capability is not supplied.
- Do not expose a general unauthenticated local browser-control endpoint.
- Do not force-push, deploy to Vercel, or modify unrelated dirty files.

## Architecture

Introduce a browser transport boundary used by the existing outreach execution
flow:

1. `CodexExtensionTransport`
   - Available only when the Codex runtime explicitly supplies an authenticated
     extension bridge capability.
   - Performs a read-only health check before selection.
   - Opens and inspects the exact target through the user's connected Chrome
     profile.
   - Returns normalized open, inspection, interaction, and confirmation
     results.

2. `CdpChromeTransport`
   - Wraps the existing ports 9222-9225 discovery and managed-profile launch.
   - Remains the fallback for standalone `npm run daily:execute`.
   - Keeps existing DOM interaction and send-confirmation behavior.

3. `BrowserTransportSelector`
   - Selects a healthy extension transport first.
   - Falls back once to CDP only when the extension transport is unavailable
     before any external side effect.
   - Never switches transport after a send, comment, like, or follow attempt,
     preventing duplicate actions.

The transport boundary must be narrow: open exact URL, inspect visible state,
perform an approved action, and return evidence. Queue selection and outreach
safety policy remain outside the transport.

## Data Flow

1. Daily queue generation determines whether an executable task exists.
2. If no executable task exists, execution ends as
   `no_executable_tasks`; no transport health check is required.
3. For an executable task, the selector checks extension capability.
4. A healthy extension bridge is selected and opens the exact verified URL.
5. If the bridge is unavailable before interaction, CDP is selected.
6. The selected transport returns normalized evidence to the existing result
   recorder and artifact refresh flow.

## Status and Evidence

Execution artifacts will distinguish:

- `browserTransportRequested`: `codex-extension-first`
- `browserTransportUsed`: `codex-extension`, `cdp`, or `none`
- `browserTransportFallbackReason`: empty or a stable reason code
- `chromeOpened`: true only after a verified target tab is opened
- `customerDevelopmentPerformed`: true only after an approved customer action
  is confirmed

The UI must display the actual transport. It must not label CDP execution as
Codex Extension execution.

## Failure Handling

- Empty queue: `no_executable_tasks`, transport `none`.
- Extension unavailable before interaction: record reason and fall back to CDP.
- Extension loses connection after interaction begins: stop and require manual
  review; do not fall back automatically.
- Exact target mismatch: stop without interaction.
- Both transports unavailable: `browser_transport_unavailable`, no customer
  development.
- Unconfirmed send/action: preserve existing unconfirmed/manual-review state;
  never retry through the other transport.

## Testing

Tests must be written before production changes and must cover:

1. Healthy extension capability is selected before CDP.
2. Missing extension capability selects CDP.
3. Extension failure before side effects falls back once to CDP.
4. Extension failure after side effects does not fall back.
5. Empty queue does not initialize either transport.
6. Artifacts report the actual transport and retain truthful
   `chromeOpened`/`customerDevelopmentPerformed` values.
7. Existing exact-target, duplicate-message, cooldown, and send-confirmation
   tests remain green.

Live verification is read-only first: enumerate connected Chrome tabs and open
an inert local dashboard target. Real customer interaction is outside transport
verification and requires the normal execution safety gates.

## Acceptance Criteria

- A connected extension is preferred when its authenticated runtime capability
  is available.
- Standalone execution remains functional through CDP fallback.
- No duplicate action can result from transport fallback.
- Execution artifacts and dashboard clearly identify the actual transport.
- Empty-queue runs remain truthful and do not claim a plugin failure.
