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
