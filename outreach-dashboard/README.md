# Customer Automated Development System

Flextail / Vollyc customer development dashboard for prioritized outreach, country-market scoring, and desktop-assisted LinkedIn / Facebook / Instagram acquisition workflows.

## What This App Does

- Shows 849 embedded customer-development contacts.
- Ranks prospects by role tier, engagement status, industry, and country-market potential.
- Uses `country-market-data.js`, generated from `E:\国家划分对照表_2026.xlsx`, to add country, market score, strategic tier, and agency status.
- Starts platform-specific acquisition queues: LinkedIn 30, Facebook 30, Instagram 30.
- Desktop mode can save encrypted platform credentials locally and use an encrypted portable vault.
- Vercel deployment is guarded by `smart-deploy.js` to avoid repeated daily deployment-limit hits.

## Run Locally

```powershell
npm install
npm start
```

For a browser-only preview, open:

```text
outreach-dashboard.html
```

Desktop credential features require Electron (`npm start`). Static browser mode can view and filter data but cannot securely access local encrypted credentials.

## Checks

```powershell
npm run check
npm run deploy:dry-run
```

`npm run check` validates JavaScript syntax, dashboard inline scripts, and country-market data loading.

`npm run deploy:dry-run` runs deployment gating without publishing to Vercel.

## Build Portable App

```powershell
npm run build:portable-folder
```

Output:

```text
dist/Customer-Development-System
dist/Customer-Development-System-Portable.zip
```

Build artifacts are ignored by Git.

## Credential Safety

Do not commit plaintext credentials.

Allowed:

- `credentials.example.json` with placeholders only.
- `credentials.vault.json` encrypted vault only.
- Local OS-encrypted credential cache managed by Electron.

Ignored and blocked:

- `credentials.local.json`
- `credentials.plain.json`
- `.env*`

Before deployment, `smart-deploy.js` scans for plaintext credential files and suspicious hardcoded secrets.

## GitHub Collaboration Workflow

1. Create a branch from `codex/trade-crm-v1` or `main`.
2. Make changes.
3. Run `npm run check`.
4. Run `npm run deploy:dry-run` for deploy-impact checks.
5. Push the branch and open a pull request.

GitHub Actions runs the same checks on pushes and pull requests.

## Private Sites workspace (2026-09-21)

Progress destination: https://flextail-customer-workspace.leo13111.chatgpt.site/

- Set `OUTREACH_WORKSPACE_TOKEN` only in the local process environment (never in Git, frontend code or a command history). On macOS the bridge also reads the `flextail-workspace-sync` / `outreach` Keychain item. It reuses the existing Sites credential; no public access is enabled.
- Run `npm run sync:workspace` to watch local data continuously, or use the desktop app / `npm run serve`, which start synchronization when configured. The computer must remain awake and online. Each computer that generates records needs the bridge configured.
- Allowed data files upload only when their content changes. The website rejects older snapshots and protects concurrent writes. Status/activity changes in the desktop UI and private website synchronize in both directions. Operational execution queues and credentials are never imported as commands.
- `.workspace-sync/` contains private local sync status and the latest cloud overlay and is excluded from Git. The current website has newer baseline data than this public repository; those newer records must not be overwritten by the older checkout or copied to public GitHub.
- No LLM is used for synchronization, filtering or reporting. Lead analysis sends bounded relevant fields, caps output at 600 tokens by default, coalesces identical concurrent calls, and caches successful decisions for five minutes (128 entries maximum). Changed lead context causes a new request; execution itself is never cached. Response usage is reported separately and cache hits do not double-count token usage.

Validation: the full domain and handoff checks pass. UI assertions verify the current Codex Chrome action; private APIs bypass the offline cache. Desktop upload still requires end-to-end access validation.

Live connection test on 2026-09-21: Sites v3 published successfully, but direct desktop HTTP requests were rejected upstream with Cloudflare HTTP 403. No background uploader is claimed as active. Resolve the platform/network client access restriction before enabling the Mac or Windows service.

Customer appendix repair (2026-09-22): `customer-projection.js` reconciles execution-only customers and explicit event history, handles replay and out-of-order replies, and preserves contact metadata. The desktop command center uses shared task/result/audit sources for reports and the appendix. The newer private Site uses this same projection module with its existing operational adapters; private customer snapshots are not copied to this repository. Regression coverage runs in `check:domain`.

## Contact discovery
Execution records retain original email, country, score, and contact provenance in the shared projection. The appendix shows email and exact LinkedIn/Instagram/Facebook profiles independently; no-email does not imply no contact channel. Per-company Google/Bing/official-site/LinkedIn/social searches are user-operated research links, not an unattended crawler. Candidate links require identity review. No inferred addresses or sends are generated. Private customer enrichment stays outside the public repository.

## Report integrity contract
Period reports count explicit timestamped events independently across Email, Instagram, Facebook and LinkedIn. A later reply cannot create a send, approval or discovery event in its month. Company identities are deduplicated across aliases. Automatic replies remain separately classified. Reply rate uses the period send cohort; until reply observations cover every sent customer, the rate is unknown, not zero. Public email discovery is not a customer-provided contact event. Missing denominators are not percentages. Segment rankings require complete observation coverage. Run the report-integrity regression suite before publishing. Reply fields (repliedAt/replyAt, replyType, replyEvidence) and per-channel replyCheckedAt must come from actual inbox observations. This change does not connect inboxes or resolve the upstream desktop-upload 403.

### Weekly/monthly evidence-based review

Period reports derive channel contribution, human/automated/unclassified replies,
observation gaps and next actions from timestamped records without model calls.
Unmatched or earlier-period sends never inflate the current send cohort. Execution
log timestamps are flagged for review; source message dates are not rewritten.
Suggested actions are explicitly not completed changes or causal conclusions.

Scheduled maintenance must check the Beijing calendar, review the previous natural
week on Mondays and previous natural month on the first day of each month, reuse
same-day results and skip other dates. Record period completion to avoid replay.
Validate accessible inbox evidence, customer deduplication and data completeness
before diagnosing channel or template performance. Do not bypass access policies.
Fix only evidenced defects; run `npm run check` and PR CI before merging; publish
the matching private Site using its hosting workflow. Retain original evidence,
bilingual UI, safety gates, rollback history and credentials outside source.
Report substantive changes, failures or required user actions; stay quiet otherwise.
Do not send outreach, alter access permissions or claim disconnected sources synced.
The Codex task scheduler owns the recurring execution; opening this dashboard does
not itself run code upgrades. An available authorized host and connections are required.
