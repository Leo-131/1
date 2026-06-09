# Codex and Qclaw Continuity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a GitHub-backed handoff protocol that preserves task ownership and progress when Codex and Qclaw alternate.

**Architecture:** A dependency-free Node CLI reads and atomically writes one tracked JSON state file. Repository instructions require both agents to pull, inspect, claim, checkpoint, and push the same state alongside code changes.

**Tech Stack:** Node.js, JSON, Git, Node built-in test/assert APIs

---

### Task 1: Define CLI behavior with failing tests

**Files:**
- Create: `tests/agent-handoff.test.js`
- Create later: `tools/agent-handoff.js`

- [x] Write tests that invoke the CLI against a temporary `HANDOFF_STATE_PATH`.
- [x] Verify the tests fail because `tools/agent-handoff.js` does not exist.
- [x] Cover status initialization, claim protection, checkpoint, completion, and forced takeover.

### Task 2: Implement the handoff CLI

**Files:**
- Create: `tools/agent-handoff.js`
- Create: `AGENT_HANDOFF.json`

- [x] Implement strict argument validation and agent names `codex` and `qclaw`.
- [x] Write state atomically through a temporary file and rename.
- [x] Reject cross-agent claim replacement unless `--force` is present.
- [x] Capture branch, commit, and changed files when the directory is a Git worktree.
- [x] Run `node --test tests/agent-handoff.test.js` and verify all cases pass.

### Task 3: Connect repository operating rules

**Files:**
- Create: `CONTINUITY.md`
- Modify: `AGENTS.md`

- [x] Document the exact pull, status, claim, checkpoint, commit, and push commands.
- [x] Require startup readers to inspect `AGENT_HANDOFF.json`.
- [x] Document recovery and secret-handling rules.

### Task 4: Verify the complete repository

**Files:**
- Modify: `outreach-dashboard/package.json`

- [x] Add a `check:handoff` command and include it in the existing `check` chain.
- [x] Run the handoff tests independently.
- [x] Run `npm.cmd run check` in `outreach-dashboard`.
- [x] Run `npm.cmd run vercel-build` and `git diff --check`.
- [x] Update the handoff state with completed work and verification evidence.
