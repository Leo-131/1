# One-command local preflight

Observed bottleneck: each research round rebuilt ad-hoc scripts to assemble four
permanent history sources and hundreds of research files. Existing v8 filtering
already avoids model calls; changing ICP or sending concurrently is not appropriate.

Use a fixed read-only CLI instead of manual assembly or a persistent stale index.
Read each selected file once, build one union history, reuse the existing v8 planner,
and output compact actionable rows plus a content digest. Every invocation refreshes
history. Missing/malformed history and malformed research fail closed. Generated
provider preflight reports are not evidence. Statistic-only manifests are skipped.

Run from the checkout using Node:

    node scripts/plan-workspace-round.mjs --candidates <provider-json> --research-dir <local-cache-directory> --history-dir <permanent-ledger-directory> --compact

The output is a research queue, not qualified recipients. Continue official product,
public contact, daily agency table, ICP >70, current CRM/mailbox checks, then IAB
serial single-send, Sent-folder proof and immediate permanent recording. Do not delay
already-verified recipients while collecting 100 candidates. Never upload CLI output
or private input data to public GitHub.

Measure actual local runtime and counts; do not call this an end-to-end outreach
speedup or count code work as customer sends. Deploy the tested code and the two
already-confirmed missing cloud ledger rows without resetting the fixed batch.
