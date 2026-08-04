# Outreach Execution Policy

Policy version: 2026-07-30

- Process only ICP >= 70, identity-verified, non-customer, non-exclusive-market, non-cooldown companies not contacted on the current Shanghai day.
- Allow one first-touch action per company per Shanghai calendar day.
- Rank candidate sources as customer attachments, local database, then Google discovery.
- Rank executable channels as verified business/procurement email, official procurement or supplier form, LinkedIn, Facebook, then Instagram.
- Use lower-priority channels only when no higher-priority channel is safely executable.
- A verified email route must never terminate the company workflow on a pre-send verification, configuration, authentication, compose-availability, or bounded technical failure. If no send click/customer interaction occurred, immediately continue in the same customer execution through first-party-verified LinkedIn, Facebook, then Instagram routes. A `send_unconfirmed` result or any evidence of a send click/customer interaction permanently stops cross-channel fallback and locks the company against replay.
- Count only `sent_confirmed` and `submitted_confirmed`. Drafts, opens, likes, follows, connection requests, failures, bounces, and unconfirmed sends never count.
- Email requires sender `Leo@flextailgear.com`, a verified public business/procurement recipient, Alibaba Mail send success, and matching Sent-folder evidence.
- Website forms require visible submission confirmation. Social messages require persistent visible outgoing-message evidence.
- The daily maximum is 100 distinct confirmed companies. The default bounded run selects up to 25 companies, may be explicitly raised to at most 50, and always stops at 45 minutes.
- Missing, stale, or contradictory evidence must fail closed.
