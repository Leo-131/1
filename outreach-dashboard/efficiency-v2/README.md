# Safe outreach efficiency source (v3)

This folder retains its v2 path for compatibility but includes the v3 identity preflight and server model coalescing upgrade. It contains reusable code and synthetic tests only, not customer records or credentials. The actual integrated dashboard is deployed separately to the existing owner-private Sites project.

Run `node --test tests/*.test.mjs` from this directory. The CLI reads local candidate, history and research files but performs no network requests, paid model calls or sends. Keep its identity-bearing output local/private. Server `model-router.mjs` remains advisory-only and requires the existing authenticated route wrapper and server-side secret; it must not be exposed as an anonymous endpoint.

No website-to-IAB email executor or measured end-to-end outreach speedup is claimed.
