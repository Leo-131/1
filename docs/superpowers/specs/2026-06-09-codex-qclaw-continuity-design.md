# Codex and Qclaw Continuity Design

## Goal

Allow Codex and Qclaw, including instances on different computers, to alternate work on this repository without losing the current task, completed work, verification evidence, or next action.

## Source of Truth

GitHub is the only synchronization authority. Local agent memories may provide context, but they must not override the repository state or Git history.

The repository stores the current handoff in `AGENT_HANDOFF.json`. Both agents read it after pulling and update it before pushing.

## Workflow

1. Before taking work, run `git pull --ff-only`.
2. Run the handoff status command and inspect the current owner, commit, summary, and next step.
3. Claim the task. A claim from a different active agent is rejected unless an explicit forced recovery is used.
4. Work normally and run project verification.
5. Checkpoint or complete the task with a summary, next step, and verification result.
6. Commit and push the code and updated handoff file together.

## Components

- `AGENT_HANDOFF.json`: versioned, machine-readable current state.
- `tools/agent-handoff.js`: dependency-free CLI for status, claim, checkpoint, and completion.
- `tests/agent-handoff.test.js`: isolated CLI behavior tests using a temporary state file.
- `CONTINUITY.md`: concise operating instructions for humans and agents.
- `AGENTS.md`: mandatory startup rule so Qclaw and repository-aware Codex sessions load the handoff.

## State Model

The state records schema version, task name, status, active and previous agent, timestamps, summary, next steps, verification evidence, and Git metadata. It must never contain credentials, cookies, tokens, or private exported customer data.

## Conflict Handling

An active claim is a cooperative lock. Another agent must stop and sync instead of overwriting it. Forced takeover is allowed only for recovery after confirming the prior agent is no longer running. Git still provides the final conflict protection.

## Testing

Automated tests cover initial state creation, claim protection, checkpoint continuity, completion, and forced recovery. The existing dashboard checks remain part of final verification.
