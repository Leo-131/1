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
