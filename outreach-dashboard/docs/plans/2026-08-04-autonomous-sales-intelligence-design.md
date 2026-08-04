# Autonomous Sales Intelligence Control Plane

## Decision

Build an incremental control plane over the existing discovery, execution, ledger, Runtime, Dashboard, and Git artifacts. Existing executors remain responsible for browser interaction; the intelligence layer owns company identity, suppression, evidence quality, portfolio planning, learning, and owner reporting. This preserves the current data foundation and production safety contract.

## Phase 1: truth and irreversible-action safety

`outreach-intelligence.js` merges company aliases, task IDs, domains, email domains, and channel variants into stable company IDs. Confirmed sends, confirmed submissions, uncertain sends with customer interaction, and populated preserved composers create permanent cross-channel suppression records. A filesystem transaction acquired with exclusive creation prevents concurrent processes from performing the same irreversible company action. The executor still re-reads the latest result ledger immediately before sending.

## Phase 2: evidence and portfolio planning

Every channel receives an evidence score. Automatic action requires a first-party URL whose domain matches the company website, contact route, or email domain. Search pages and status labels without matching evidence score zero. The portfolio planner chooses at most one first-touch channel per company, follows channel priority, preserves bounded channel quotas, and reports capacity gaps instead of inventing targets.

## Phase 3: learning and owner control

Learning uses only observed confirmed sends, replies, opportunities, meetings, and wins. It reports sample size, observed rates, and confidence; it never converts recommendations into facts. The generated intelligence artifact contains owner KPIs, safe planned actions, blocking exceptions, suppression coverage, and bounded experiment recommendations. Dashboard rendering exposes this artifact without changing safety gates.

## Verification

Unit tests cover entity merging, suppression, evidence rejection, quota planning, transaction exclusivity, and observed-rate learning. Full project checks validate backward compatibility. Production verification remains `discover:daily` -> `daily:execute` -> `sync:github`, with root/public mirror and Git hash parity checks.
