# Weekly and Monthly Reporting Design

## Goal

Add a Reporting Center to the v18.5 command center without changing the existing scoring, approval, cooldown, exact-target, or QClaw execution rules.

## Reporting Periods

- Weekly report: Monday 00:00 through Sunday 23:59 in Asia/Shanghai.
- Monthly report: first calendar day through the final calendar day in Asia/Shanghai.
- The current period is selected by default. Previous periods can be selected without modifying source data.

## Metrics

Each report shows:

- Prospects discovered
- Profiles scored
- Tasks approved
- Confirmed sends
- Replies
- Contact details captured
- Opportunities created
- Automatically skipped tasks
- Reply, contact-capture, and opportunity conversion rates

Only `sent_confirmed` records count as sends or as denominators for downstream conversion rates. Missing timestamps and unavailable trend data are displayed as unavailable rather than inferred.

## Breakdowns

Reports group results by:

- Platform
- Country/market
- Keyword
- Message template
- ICP tier

Tables are sorted by confirmed sends, then replies, then contact captures.

## Interface

Add a `汇报中心` navigation item with two tabs:

- `周报`
- `月报`

The page contains a period selector, KPI strip, conversion funnel, breakdown tables, data-quality notices, and an activity summary. It uses the existing command-center layout and compact operational styling.

## Export

- CSV exports the selected period's metrics and breakdown rows.
- Print uses a report-only layout suitable for browser PDF export.
- Exported filenames include report type and period.

## Data Flow

`AUTONOMOUS_OUTREACH_DATA.tasks` and its audit records remain the source of truth. New pure analytics functions filter records by period and build summary metrics. The reporting UI only renders those derived results and never mutates tasks.

## Error Handling

- Empty periods show a clear zero-data state.
- Invalid dates fall back to the current natural period.
- Records without valid timestamps are counted in a separate data-quality notice and excluded from period totals.
- Export is disabled when the selected period has no report rows.

## Verification

- Unit tests cover natural week/month boundaries, Asia/Shanghai date handling, confirmed-send accounting, conversion rates, missing timestamps, and empty reports.
- Command-center tests verify navigation, weekly/monthly controls, CSV export, and print controls.
- Browser QA verifies desktop and mobile rendering, tab switching, period changes, and no relevant console errors.

