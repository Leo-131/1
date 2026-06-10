# Qclaw Outreach Safety

Qclaw must not assign email or LinkedIn contact names to Instagram or Facebook and then click the first search result.

Only tasks with all of the following may enter a dry run:

- A verified platform-specific profile URL
- Exact Instagram handle/URL agreement, or a non-generic Facebook page URL
- ICP fit score of at least 70
- No duplicate platform and target URL

Generate tasks:

```powershell
E:\Python\python.exe tools\qclaw\prepare_verified_outreach.py
```

Run target checks:

```powershell
E:\Python\python.exe tools\qclaw\safe_outreach_runner.py tools\qclaw\output\verified_tasks_YYYYMMDD.json
```

The runner is intentionally dry-run only. It does not send messages.

## Autonomous like-follow-send workflow

The autonomous runner accepts only `approved` tasks with an exact Instagram
profile URL, a positive approval version, and the exact Codex-approved message.

Dry run:

```powershell
E:\Python\python.exe tools\qclaw\autonomous_instagram_runner.py approved_tasks.json --dry-run --all-approved
```

One controlled canary:

```powershell
E:\Python\python.exe tools\qclaw\autonomous_instagram_runner.py approved_tasks.json --task-id TASK_ID --confirm-live-actions
```

Batch execution is permitted only after a confirmed canary:

```powershell
E:\Python\python.exe tools\qclaw\autonomous_instagram_runner.py approved_tasks.json --all-approved --confirm-live-actions
```

Synchronize append-only evidence into the app:

```powershell
node tools\qclaw\sync_autonomous_results.js autonomous_outreach_results.json outreach-dashboard\autonomous-outreach-results.js
```
