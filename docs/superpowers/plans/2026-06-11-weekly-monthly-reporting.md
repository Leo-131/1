# Weekly and Monthly Reporting Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add natural-week and natural-month performance reports to the v18.5 command center without changing customer scoring or automation execution behavior.

**Architecture:** Extend `outreach-analytics.js` with pure period and aggregation functions, then render those derived results from a new `reports` command-center view. Existing task and audit records remain read-only inputs; CSV and print output are generated in the browser.

**Tech Stack:** Vanilla JavaScript UMD modules, Node.js built-in test runner, static HTML/CSS, Vercel static deployment.

---

## File Map

- Modify `outreach-dashboard/outreach-analytics.js`: natural period bounds, event counting, conversion rates, grouped breakdowns, data-quality summary.
- Modify `tests/outreach-analytics.test.js`: period, timezone, confirmed-send, missing timestamp, and empty-state tests.
- Modify `outreach-dashboard/command-center.js`: reporting navigation, report rendering, period controls, CSV export, and print action.
- Modify `outreach-dashboard/command-center.css`: compact report layout, responsive states, and print-only rules.
- Modify `tests/command-center.test.js`: static integration checks for report controls and navigation.
- Regenerate `outreach-dashboard/public/*`: production assets through the existing Vercel build script.

### Task 1: Period Analytics

- [ ] **Step 1: Write failing tests**

Add tests that call:

```js
getNaturalPeriod('weekly', '2026-06-11T12:00:00+08:00')
getNaturalPeriod('monthly', '2026-06-11T12:00:00+08:00')
buildPeriodReport(records, { type: 'weekly', anchor: '2026-06-11' })
```

Assert Monday/Sunday and month boundaries, `sent_confirmed` accounting, rate denominators, invalid timestamp exclusion, and zero-data output.

- [ ] **Step 2: Verify RED**

Run:

```powershell
node --test tests/outreach-analytics.test.js
```

Expected: failure because `getNaturalPeriod` and `buildPeriodReport` are not exported.

- [ ] **Step 3: Implement the pure analytics API**

Add:

```js
function getNaturalPeriod(type, anchor) { /* Asia/Shanghai UTC+8 boundaries */ }
function buildPeriodReport(records, options) { /* event counts and breakdowns */ }
```

Return `{ period, metrics, rates, breakdowns, dataQuality, hasData }`. Only confirmed sends may contribute to send or downstream conversion metrics.

- [ ] **Step 4: Verify GREEN**

Run:

```powershell
node --test tests/outreach-analytics.test.js
```

Expected: all analytics tests pass.

### Task 2: Reporting Center UI

- [ ] **Step 1: Write failing integration checks**

Assert `command-center.js` contains:

```js
['reports', '汇报中心']
analytics.buildPeriodReport
exportCurrentReportCsv
window.print()
```

- [ ] **Step 2: Verify RED**

Run:

```powershell
node --test tests/command-center.test.js
```

Expected: reporting assertions fail.

- [ ] **Step 3: Implement the reports view**

Add weekly/monthly tabs, date selector, previous/next period controls, KPI strip, funnel, five breakdown tables, data-quality notice, CSV export, and print/PDF button. Keep all controls inside the existing command-center shell.

- [ ] **Step 4: Add responsive and print styling**

Add stable report grids, compact table layouts, mobile stacking, and `@media print` rules that hide navigation and controls.

- [ ] **Step 5: Verify GREEN**

Run:

```powershell
node --test tests/command-center.test.js
```

Expected: all command-center tests pass.

### Task 3: Production Build and Verification

- [ ] **Step 1: Run complete checks**

```powershell
cd outreach-dashboard
npm run check
```

Expected: domain, handoff, syntax, and dashboard checks pass.

- [ ] **Step 2: Regenerate production assets**

```powershell
npm run vercel-build
```

Expected: `outreach-dashboard/public` contains the updated reporting assets.

- [ ] **Step 3: Browser verification**

Open the local command center with `?view=reports`, switch weekly/monthly, change the date, inspect KPI and breakdown rendering, trigger CSV export, and inspect print layout on desktop and mobile widths. Confirm no relevant console errors.

- [ ] **Step 4: Commit and publish**

```powershell
git add AGENT_HANDOFF.json docs/superpowers/plans/2026-06-11-weekly-monthly-reporting.md outreach-dashboard tests
git commit -m "Add weekly and monthly reporting center"
git push origin HEAD:main
```

- [ ] **Step 5: Perform one guarded production deployment**

Run the existing deploy dry-run first. Deploy only if content changed and quota/cooldown checks pass, then verify `https://outreach-dashboard-woad-three.vercel.app/?view=reports`.
