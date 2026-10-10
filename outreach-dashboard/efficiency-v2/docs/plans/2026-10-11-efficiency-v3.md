# Efficiency v3: fewer redundant requests, shared identity preflight

User authorized autonomous optimization, code update and cloud publication, with no extra questions. Retain IAB, marketing template 2, strict ICP >70, genuine public contact and daily region checks, serial sends and immediate permanent receipts.

Observed issues: server-side identical concurrent model requests returned 409 although the browser already merged requests within one page. Offline preflight matched names/IDs only, missing domain and exact-recipient matches across differently named rows.

Chosen bounded approach: share the existing in-flight model operation per authenticated user/model/task/exact facts. Return fresh response bodies, report model usage once, sanitize failures and release failed locks. Keep existing paid-call limits and timeout. Share identity key extraction between web preflight and offline CLI, adding explicit domain/website and exact email fields. Do not infer parent groups, collapse subdomains, merge free-mail providers, or merge social/shared storefront hosts. All live eligibility checks remain mandatory.

Alternatives rejected: increasing paid concurrency would increase spend; bypassing browser/mailbox confirmation would weaken safety. No automatic paid fallback or additional model call is made by tests.

Verification: concurrent request merging, cross-user isolation, failure recovery, domain/recipient conflicts, shared-host exclusions, full regression suite and production build. This is a reduction in redundant work, not a measured end-to-end customer-development speedup. Hosted website still has no direct IAB email executor connection.
