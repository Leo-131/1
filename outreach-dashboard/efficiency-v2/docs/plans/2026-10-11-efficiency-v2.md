# Outreach preflight v2

User requested immediate autonomous efficiency upgrades and cloud synchronization.

Keep deterministic rules rather than adding paid model concurrency or weakening eligibility. Retain IAB, template 2, ICP strictly above 70, live daily agency checks, exact-recipient and company/group deduplication, single sends, receipts and immediate permanent writes.

Changes:
- Remove legacy executor's arbitrary 91-second and 2.5-second per-customer waits. Await actual executor completion; honor reported cooldowns. This path is disabled on the hosted website and does not measure Codex IAB execution time.
- Check all cached company/group aliases instead of just the first match. Never erase uncertain sends with later failed-open statuses.
- A changed revision alone does not restart parked research: a new HTTP source must also be supplied. New sources still require live verification and never imply eligibility.
- Add `scripts/plan-outreach-round.mjs` for one-pass offline preflight of local JSON/static window data, with repeatable `--research` and `--history` inputs. It does not control a browser or send emails. It returns at most 100 candidates and outstanding live checks without model tokens.

Example: `node scripts/plan-outreach-round.mjs --candidates private-candidates.json --history private-history.json --research private-research.json`. Output can contain customer identities; keep it local or owner-private. Do not commit runtime input/output to a public repository.

Test alias conflicts, status-field precedence, unknown outcomes, evidence-only retry, and zero artificial waits. Run the entire existing regression suite and build before private publication. No promised end-to-end speedup or new send count is inferred from synthetic benchmarks.
