# Autonomous Outreach Command Center Design

## Objective

Build a customer-development system in which Codex is the decision and optimization layer, QClaw is the constrained browser-execution layer, and the dashboard is the sole source of truth for task state, evidence, attribution, and recovery.

The workflow should run without blocking human review. Full automation means every task reaches a safe terminal decision; it does not mean every prospect must receive a message.

## Roles And Ownership

### Codex

- Enriches and scores customer profiles.
- Prioritizes open European markets and relevant buyer roles.
- Selects SEO keywords and message variants.
- Automatically approves, repairs, reroutes, schedules, or skips tasks.
- Learns from replies, contact capture, and conversion outcomes.
- Changes program logic, tests, and scoring rules through Git.

### QClaw

- Executes only tasks approved by Codex.
- Opens only an exact, verified platform profile URL.
- Likes one recent relevant post when available.
- Follows the verified account when appropriate.
- Waits a randomized 30 to 120 seconds.
- Sends only the approved message version.
- Captures action evidence and confirms the message is visible after sending.
- Never searches a person's name and selects the first result.

### Customer Development System

- Owns the canonical task state.
- Stores profile evidence, decision reasons, action evidence, and outcomes.
- Prevents duplicate work across Codex and QClaw.
- Exposes the command-center UI and separate supporting views.

## Automated Workflow

Each task follows this state sequence:

1. `profile_scored`: Codex calculates market, ICP, identity, intent, trend, and history scores.
2. `target_verified`: an exact platform profile URL and company identity are verified.
3. `post_liked`: QClaw likes one recent relevant post, or records a supported skip reason.
4. `account_followed`: QClaw follows the account, or records that it was already followed.
5. `approval_pending`: the task waits 30 to 120 seconds while Codex performs final approval.
6. `approved`: identity, duplication, cooldown, market, and message checks pass.
7. `sent_confirmed`: QClaw sends the approved message and confirms visible delivery evidence.
8. `outcome_pending`: the system waits for reply, contact capture, or follow-up eligibility.

Approval failure enters an automatic recovery ladder:

1. Complete or correct the customer profile.
2. Replace the search-intent keyword or rewrite the message.
3. Reroute to a verified email or website contact channel, or schedule a later retry.
4. Mark `auto_skipped` with evidence, reason, and optional reevaluation date.

Recovery may not lower identity, duplicate-contact, exclusivity, or platform-safety thresholds. No state may remain indefinitely blocked by required human review.

## Approval Policy

A task is approved only when all hard gates pass:

- Exact company and platform profile identity are verified.
- The destination is not a search, reel, watch, generic profile, or other non-company page.
- The prospect is not in an active cooldown period.
- The same platform and target URL have not already been sent the same campaign.
- The market is not marked as occupied by an exclusive distributor.
- The message names no unsupported facts and matches the customer's market and business type.
- The target meets the minimum composite score.

Codex may automatically optimize a failed task up to two times. A third failure produces an automatic reroute, schedule, or skip decision instead of human-blocking review.

## European Profile Scoring

The composite development score is 0 to 100:

- 25 points: market openness and European priority.
- 25 points: ICP fit, including outdoor retailer, distributor, buyer, partnership, or category role.
- 15 points: exact identity, social profile, website, and contact evidence.
- 15 points: SEO search-intent match.
- 10 points: Google Trends regional interest and direction.
- 10 points: interaction history, reply signal, and message-template performance.

Hard exclusions override the score. Examples include exclusive-distributor conflicts, identity mismatch, duplicate outreach, prohibited destinations, and low-confidence social targets.

Trend data must include its source region, period, collection timestamp, relative index, and direction. If current trend data is unavailable, the UI displays `data_unavailable`; the system must not invent a value.

## Keyword And Conversion Attribution

Each prospect records:

- Source keyword and keyword group.
- Search region and language.
- Associated landing source or acquisition channel.
- Google Trends index and trend direction when available.
- Profile-created, approved, sent, replied, contact-captured, and opportunity timestamps.
- Message template and revision identifier.

The system reports conversion rates through the funnel:

`discovered -> profiled -> approved -> sent -> replied -> contact_captured -> opportunity`

Codex may raise the priority of keywords and templates with stronger verified reply and contact-capture rates. Small samples must display their sample size and must not be treated as conclusive.

## Application Information Architecture

The app uses an operational command-center layout inspired by mature export CRM tools, without copying proprietary branding or visual assets.

### Left Navigation

- Development Workspace
- Today's Queue
- Customer Appendix
- SEO Trends
- Template Experiments
- Automation Audit
- Settings

### Development Workspace

The middle column shows:

- Today's queue summary.
- The current customer.
- Current workflow stage.
- Like, follow, approval, send, and recovery progress.
- The approved message and next automatic action.
- A compact queue for upcoming tasks.

The right rail shows:

- Codex score components and approval decision.
- QClaw exact profile, post, follow, and send evidence.
- Recovery attempts and terminal reason.

### Supporting Views

- `Customer Appendix`: the full contact table, filters, export, and bulk inspection.
- `SEO Trends`: keyword funnel conversion and regional trend comparison.
- `Template Experiments`: message variants, sample sizes, replies, and contact-capture rates.
- `Automation Audit`: immutable task decisions, QClaw evidence, errors, and recovery actions.

Clicking a customer opens a dedicated detail view or new page state; it must not replace or visually erase the application shell.

## Data Boundaries

The first implementation should add focused modules instead of extending the existing monolithic HTML indefinitely:

- A scoring and approval module with pure, testable functions.
- A shared task schema and state-transition validator.
- A QClaw execution contract and evidence-result schema.
- Keyword/trend and conversion-attribution data modules.
- Separate UI views routed within the existing application delivery model.

Existing embedded contact data remains readable during migration. New fields must have safe defaults so old records continue to render.

## Error Handling

- Missing profile evidence: enrich twice, then reroute or skip.
- No relevant recent post: record `like_skipped_no_relevant_post` and continue if other gates pass.
- Already followed: record evidence and continue.
- Platform failure: exponential backoff and bounded retry.
- Message not visibly confirmed: stop that task and mark `send_unconfirmed`; never count it as sent.
- Trend provider unavailable: preserve the last timestamped value or show unavailable.
- State conflict: reject stale writes using task version or transition validation.

## Testing And Verification

- Unit tests cover scoring, hard exclusions, approval recovery, state transitions, deduplication, cooldowns, and conversion calculations.
- QClaw tests cover exact-profile matching, recent-post selection, follow detection, randomized delay bounds, approved-message integrity, and visible send confirmation.
- Dashboard checks cover navigation, non-destructive customer detail opening, responsive layout, and rendering of legacy records.
- Browser verification covers the command center, customer appendix, SEO trends, automation audit, and a complete simulated workflow.
- Live sending remains limited to exact verified profiles and uses a canary before any batch.

## Accepted Decisions

- Codex is the primary decision and optimization engine.
- QClaw is a constrained execution engine.
- Approval is automatic, with up to two optimization attempts.
- Unsafe or unresolved tasks are automatically rerouted, scheduled, or skipped.
- Like and follow are immediately followed by a randomized 30 to 120 second wait and final approval.
- Approved messages are sent immediately after that wait.
- The UI uses the command-center layout, with full tables moved to supporting views.
