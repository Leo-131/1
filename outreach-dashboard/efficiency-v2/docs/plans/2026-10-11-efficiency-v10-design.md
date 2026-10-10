# Bounded fresh research packets

Local preflight already takes about 0.17 seconds; this is not the end-to-end
bottleneck. Returning 87 pending rows repeatedly adds unnecessary output/token
consumption. Keep the full up-to-100 candidate preflight, but emit a bounded next
research packet with totals and the input content digest.

Run the existing CLI with `--packet-size 10`. It performs exactly the same fresh
history/cache reads and safety filtering as before. After saving research outcomes
or permanent send receipts, regenerate the packet; do not use a stale offset.
Packets are not send-qualified: all live agency, contact, product, ICP, CRM and
mailbox checks remain mandatory. No model calls, concurrency changes or browser
side effects are added. Already-ready recipients are not held for packet filling.

Test output bounds, counts, source digest, invalid sizes and unchanged safety.
Measure UTF-8 output bytes only; do not claim a measured end-to-end time saving.
Publish code and the existing confirmed missing ledger record to the private site.
Public GitHub receives safe code and anonymous totals only, never packet contents.
