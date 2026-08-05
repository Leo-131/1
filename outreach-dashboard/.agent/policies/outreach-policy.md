# Outreach Execution Policy

Policy version: 2026-07-30

- Process only ICP >= 70, identity-verified, non-customer, non-exclusive-market, non-cooldown companies not contacted on the current Shanghai day.
- Allow one first-touch action per company per Shanghai calendar day.
- Rank candidate sources as customer attachments, local database, then Google discovery.
- Rank executable channels as verified business/procurement email, official procurement or supplier form, LinkedIn, Facebook, then Instagram.
- Use lower-priority channels only when no higher-priority channel is safely executable.
- A verified email route must never terminate the company workflow on a pre-send verification, configuration, authentication, compose-availability, or bounded technical failure. If no send click/customer interaction occurred, immediately continue in the same customer execution through first-party-verified LinkedIn, Facebook, then Instagram routes. A `send_unconfirmed` result or any evidence of a send click/customer interaction permanently stops cross-channel fallback and locks the company against replay.
- A website/contact-form route that fails during inspection or preparation before any submit interaction must continue immediately to an official social URL extracted from that first-party page. The queue's one-company selection is not a reason to suppress this same-task fallback. `submitted_confirmed`, submit uncertainty, or evidence of an irreversible submit interaction must stop fallback and lock replay.
- Prior read-only or pre-send website technical failures must not block a later read-only first-party reinspection whose sole purpose is validating an advertised official social route. All final company dedupe, identity, and uncertain-interaction gates still apply before any outreach action.
- In-task fallback and cross-run retry are different. During one bounded customer execution, verified alternate channels may be tried before a terminal result is recorded. Once that execution records `failed_open`, retire the entire company from every later queue selection for the rest of the current Shanghai day, regardless of the route or fallback platform, record `same_day_retry_circuit_open`, close the automation-owned tab, and immediately advance to the next safe company. Do not reopen the company in a later batch or full rerun that day.
- Count only `sent_confirmed` and `submitted_confirmed`. Drafts, opens, likes, follows, connection requests, failures, bounces, and unconfirmed sends never count.
- Email requires sender `Leo@flextailgear.com`, a verified public business/procurement recipient, Alibaba Mail send success, and matching Sent-folder evidence.
- Website forms require visible submission confirmation. Social messages require persistent visible outgoing-message evidence.
- The daily maximum is 100 distinct confirmed companies. The default bounded run selects up to 25 companies, may be explicitly raised to at most 50, and always stops at 45 minutes.
- Missing, stale, or contradictory evidence must fail closed.
- Discovery and execution must share one `executionReadiness` decision. A URL alone is not an executable channel: website routes require first-party-verified supplier/form capability, email requires an official public business recipient, and social requires a first-party-cross-verified exact profile. Evidence-incomplete rows belong in the enrichment backlog and must not open Chrome or inflate executable-company counts.
- Email is a preferred route, never a batch-wide dependency. Authentication or pre-send failure affects only that email route: continue through the same company's verified website/social routes, then immediately advance to other safe companies and continue first-party enrichment. Never stop the batch merely because email is unavailable.
- Every production optimization or incident repair must be made durable in executable code, a regression test, this policy when the contract changes, and the production Prompt. A commentary-only workaround or one-run manual instruction is incomplete.
