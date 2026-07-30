# Git and System Stability Policy

Policy version: 2026-07-30

- Preserve the required command order: `discover:daily`, `daily:execute`, `sync:github`.
- Verify local HEAD, upstream, and the remote branch hash independently before declaring Git success.
- Never force push, rewrite history, rebase a dirty worktree, delete unrelated changes, or deploy Vercel.
- Automatic fixes may touch only outreach automation, verification, reporting, dedicated Chrome 9224 execution, and Dashboard artifact refresh.
- A sync failure must remain visible with its exact evidence and recovery action.
