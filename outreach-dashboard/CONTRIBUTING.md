# Contributing

This repository is used for fast iteration on the customer development dashboard and the desktop-assisted outreach workflow.

## Branch Workflow

1. Create a feature branch from `codex/trade-crm-v1` or `main`.
2. Keep changes focused on one feature or fix.
3. Run the local checks before pushing.
4. Open a pull request and describe the user-facing impact.

```powershell
npm ci
npm run check
node smart-deploy.js --dry-run --force
```

## Credential Rules

Never commit plaintext platform accounts, passwords, session cookies, API tokens, or `.env` files.

Allowed files:

- `credentials.example.json` with placeholder values only.
- `credentials.vault.json` only when it contains encrypted vault data.

Ignored or blocked files:

- `credentials.local.json`
- `credentials.plain.json`
- `.env`
- `.env.*`

Desktop credential storage must go through the Electron encrypted cache or the encrypted portable vault. If a new feature needs credentials, add it to the secure credential flow instead of hardcoding secrets.

## Deployment Rules

- Run the dry-run deploy check before production deployment.
- Keep production deployments to one per day unless the team explicitly approves an urgent fix.
- If Vercel reports a daily deployment quota error, wait for the recorded cooldown instead of retrying repeatedly.
- Only promote a `Ready` deployment to production.

## Outreach Data Rules

- Country-market data should stay public business metadata.
- Do not add private customer credentials, personal passwords, or raw exported inbox/session data.
- Preserve the daily target split unless the team changes the strategy: LinkedIn 30, Facebook 30, Instagram 30.
