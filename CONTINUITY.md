# Codex and Qclaw Continuity

GitHub is the only shared source of truth. Do not use either agent's private memory as the authoritative project state.

## Start or Resume Work

From the repository root:

```powershell
git status --short
git pull --ff-only
node tools/agent-handoff.js status
node tools/agent-handoff.js claim codex "Describe the task"
```

Use `qclaw` instead of `codex` when Qclaw takes the task. Commit and push the claim before starting on another computer so the cooperative lock is visible there.

```powershell
git add AGENT_HANDOFF.json
git commit -m "chore: claim task for codex"
git push
```

If the worktree is dirty, do not pull or switch agents until the current changes are committed, stashed intentionally, or otherwise reconciled.

## Hand Work to the Other Agent

Record what changed, the exact next action, and the most useful verification result:

```powershell
node tools/agent-handoff.js checkpoint codex "Implemented the shared state command" "Run the dashboard check" "handoff tests passed"
git add -A
git commit -m "Add shared agent handoff"
git push
```

The next agent must pull before claiming the task.

## Complete Work

```powershell
node tools/agent-handoff.js complete codex "Fixed and deployed the dashboard" "npm run check passed"
git add -A
git commit -m "Complete dashboard task"
git push
```

## Recovery

An active claim from the other agent is not overwritten automatically. First confirm that agent is no longer running and that its latest work has been pushed. Only then use:

```powershell
node tools/agent-handoff.js claim codex "Recovered task" --force
```

## Rules

- Keep `AGENT_HANDOFF.json` in every code commit that changes the recorded task state.
- Never store passwords, tokens, cookies, credentials, or private customer exports in the handoff.
- Resolve Git conflicts before changing ownership.
- Use ISO timestamps and preserve verification evidence.
- Do not edit generated deployment files independently of their source.
