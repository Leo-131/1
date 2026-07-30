# Dedicated Browser Policy

Policy version: 2026-07-30

- Customer development may use only dedicated Chrome/CDP port 9224 with its independent user-data directory.
- Never probe, attach to, debug, switch, or reuse the user's primary Chrome or port 9222.
- Label the transport truthfully as `dedicated Chrome/CDP`; never claim it is the Codex Chrome Extension.
- Validate login, expected account identity, session health, CAPTCHA absence, and platform safety before sending.
- Login loss, identity mismatch, CAPTCHA, rate limit, account restriction, duplicate uncertainty, or missing confirmation stops the affected channel.
- Never retry indefinitely. Preserve uncertain-delivery locks and close only tabs created by the automation.
