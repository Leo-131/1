# Non-zero daily execution repair

## Problem

The daily queue contains high-ICP website and social targets, but the executor can collapse the entire queue to zero. Historical `website_contact_ready` and `website_contact_unreachable_skip` outcomes were treated as permanent blockers. A website form prepared on an earlier day therefore could never be inspected again, even though the same-day duplicate gate already prevents unsafe repeat submission. The code default also processed only four companies despite the operating contract specifying a bounded batch of thirteen.

## Design

Keep permanent protection for confirmed sends, send clicks without confirmation, invalid profiles, missing message controls, cooldowns, existing customers, exclusive markets, and same-day company duplication. Reclassify only the two non-terminal website outcomes as daily locks: they block another attempt during the same Asia/Shanghai day, then become eligible for a fresh official-path inspection on a later business day. Restore the default bounded batch to thirteen.

The batch watchdog uses the operating contract's 45-minute ceiling. The former five-minute default could not finish thirteen serial targets after contact-path verification expanded beyond a homepage, so it deterministically timed out mid-batch. Individual browser and path checks remain bounded, and the global watchdog still terminates the run at 45 minutes.

Real development truth remains evidence-based. Only `sent_confirmed` and `submitted_confirmed` contribute to `realDevelopmentCount`; follows and likes are explicitly excluded. Website execution must still detect a verified contact entry, fill required fields, submit, and observe a destination success receipt. Missing confirmation remains `send_unconfirmed` and does not count.

## Verification

Run focused GLM automation regression tests, the full domain and handoff test suite, syntax checks, and the dashboard verification gate. Then rerun the required daily sequence and inspect the final execution artifact, Shanghai-day result aggregation, root/public parity, served routes, and Git hashes.

## Email delivery and verification closure

Verified Email is the first executable channel. A recipient is eligible only when it comes from an official website `mailto:` route, a provider result marked deliverable, or explicit official-public evidence already stored on the lead. Consumer mailbox domains and unverified customer-table addresses fail closed. Hunter is preferred when configured, with ZeroBounce as the supported alternative.

Alibaba Enterprise Mail uses authenticated TLS SMTP for delivery and IMAP for evidence. SMTP acceptance alone becomes `send_unconfirmed`. The system searches the IMAP Sent special-use mailbox by Message-ID, then verifies recipient and exact subject before returning `sent_confirmed`. The first touch is always plain text with no attachment and must satisfy the 90–140 word, sender, 36+ 2026 SKU, procurement CTA, and FLEXTAIL-link policy. SMTP permanent recipient rejection becomes `bounced`.

Before each queue run, a bounded IMAP Inbox scan reconciles recent delivery-status notifications. A confirmed email record matching the DSN Message-ID or recipient is downgraded to `bounced`, retaining the original evidence and adding the bounce diagnostic. Missing credentials never trigger browser imitation or speculative success; they produce recovery actions containing configuration names only.

Website discovery expands only same-origin common contact routes and excludes product, catalog, collection, filter, vendor-product, and sale links. Three failed strategy-v2 website days within 30 days open a circuit breaker so subsequent runs use a verified alternate channel instead of repeating the same low-yield route.
