# Expiring Discovery Cooldown Design

## Goal

Ensure Codex Chrome Extension receives eligible high-ICP leads again after the configured seven-day cooldown, without weakening exact-target, partner, duplicate-DM, credential, or browser-confirmation protections.

## Design

The discovery history index will distinguish active cooldown touches from historical touches. Ordinary touch statuses block a company across channels only while `daysSince(timestamp) < cooldownDays`. Same-day development remains blocked. A confirmed sent DM remains protected by the existing no-duplicate-DM policy.

The queue generator will consume the active-cooldown index for both executable and cooldown queues. This keeps expired ordinary touches out of `cooldownQueue` and allows them into `dailyQueue`, where the existing Electron/Codex Chrome Extension execution path handles browser development.

## Verification

A regression test will use a touch older than seven days and assert it is no longer active. It will also assert that a recent touch remains active and that a confirmed DM remains protected. The focused automation tests, syntax checks, and a dry-run artifact generation will then verify behavior.
