# Expiring Discovery Cooldown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow ordinary Google discovery touches to become executable after the configured cooldown while preserving critical outreach safety gates.

**Architecture:** Extend the history index with an active-cooldown view derived from timestamps and configured cooldown days. Use that view in discovery queue filtering; keep permanent duplicate-DM protection separate.

**Tech Stack:** Node.js, CommonJS, `node:test`, JSON artifacts.

---

### Task 1: Reproduce expired cooldown blocking

**Files:**
- Modify: `E:\New project\tests\glm-automation.test.js`
- Test: `E:\New project\tests\glm-automation.test.js`

- [ ] Add a test with recent and expired `approval_pending` touches plus an expired `sent_confirmed` result.
- [ ] Run `node --test ..\tests\glm-automation.test.js` and confirm the expired ordinary touch assertion fails.

### Task 2: Implement active cooldown indexing

**Files:**
- Modify: `E:\New project\outreach-dashboard\daily-automation-runner.js`
- Test: `E:\New project\tests\glm-automation.test.js`

- [ ] Add active-cooldown sets/details to `knownTouchIndex`, based on `COOLDOWN_DAYS`.
- [ ] Preserve same-day and confirmed-DM protections independently.
- [ ] Replace permanent ordinary-touch checks in `discoveryQueue` and `discoveryCooldownQueue` with active-cooldown checks.
- [ ] Run the focused test and confirm it passes.

### Task 3: Verify artifacts and execution path

**Files:**
- Verify: `E:\New project\outreach-dashboard\daily-automation-runner.js`
- Verify: `E:\New project\outreach-dashboard\main.js`

- [ ] Run syntax checks and focused automation tests.
- [ ] Run `npm run daily:dry-run` and inspect `dailyQueue`, `cooldownQueue`, and `summary.googleDiscovered`.
- [ ] Confirm `main.js` still identifies Codex Chrome Extension as the browser execution layer.
