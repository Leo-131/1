# Ali Mail Agent Connector

This repository contains a small local connector for Alibaba Mail so future AI agents can safely read, search, and draft/send mail through IMAP/SMTP. It uses only Node.js built-in modules, so no package installation is required.

## Setup

1. Copy `.env.example` to `.env`.
2. Fill `ALI_MAIL_PASSWORD` with an Alibaba Mail third-party client security password, not the normal web login password if your admin has enabled that security mode.
3. Keep `.env` local. It is ignored by Git.

Alibaba Mail accounts use site-specific servers. The default `.env.example` uses the Singapore site. Change the host values if your webmail site is Hong Kong, Germany, US, or your company has configured domain CNAMEs.

| Site | IMAP host | SMTP host | SSL ports |
| --- | --- | --- | --- |
| Singapore | `imap.sg.aliyun.com` | `smtp.sg.aliyun.com` | IMAP `993`, SMTP `465` |
| Hong Kong | `imap.hk.aliyun.com` | `smtp.hk.aliyun.com` | IMAP `993`, SMTP `465` |
| Germany | `imap.de.alibabacloud.com` | `smtp.de.alibabacloud.com` | IMAP `993`, SMTP `465` |
| US | `imap.us.alibabacloud.com` | `smtp.us.alibabacloud.com` | IMAP `993`, SMTP `465` |
| China enterprise domain list | `imap.qiye.aliyun.com` | `smtp.qiye.aliyun.com` | IMAP `993`, SMTP `465` |

## Commands

```powershell
node .\src\ali-mail-agent.mjs doctor
node .\src\ali-mail-agent.mjs folders --connect
node .\src\ali-mail-agent.mjs latest --limit 5
node .\src\ali-mail-agent.mjs search --from someone@example.com --limit 10
node .\src\ali-mail-agent.mjs send --to someone@example.com --subject "Hello" --body "Draft body"
node .\src\ali-mail-agent.mjs send --to someone@example.com --subject "Hello" --body "Real body" --no-dry-run
```

`send` defaults to dry-run. To actually send, set `ALI_MAIL_DRY_RUN=false` or pass `--no-dry-run`.

## Notes For Agents

- Never print `ALI_MAIL_PASSWORD`.
- Prefer `latest` or targeted `search` before broad mailbox scans.
- Keep `send` in dry-run unless the user explicitly asks to send a real email.
- Use full email addresses as usernames for Alibaba Mail enterprise accounts.

## Verify Locally

```powershell
node --test
```
