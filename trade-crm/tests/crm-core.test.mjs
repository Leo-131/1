import assert from "node:assert/strict";
import test from "node:test";

import {
  CRM_STAGES,
  addActivity,
  addTask,
  calculateDashboard,
  filterAccounts,
  moveOpportunity,
  rankAccounts,
} from "../src/crm-core.mjs";

const baseState = {
  accounts: [
    {
      id: "a-1",
      name: "Acme Importers",
      owner: "Lina",
      country: "United States",
      tags: ["VIP", "Machinery"],
      status: "active",
      annualValue: 180000,
      lastContactAt: "2026-05-10",
    },
    {
      id: "a-2",
      name: "Boreal Trading",
      owner: "Chen",
      country: "Germany",
      tags: ["New"],
      status: "prospect",
      annualValue: 36000,
      lastContactAt: "2026-04-21",
    },
  ],
  opportunities: [
    {
      id: "o-1",
      accountId: "a-1",
      title: "Packaging line renewal",
      stage: "quote",
      value: 42000,
      probability: 68,
      expectedClose: "2026-06-08",
    },
    {
      id: "o-2",
      accountId: "a-2",
      title: "Trial container",
      stage: "lead",
      value: 12000,
      probability: 28,
      expectedClose: "2026-06-21",
    },
  ],
  tasks: [
    {
      id: "t-1",
      accountId: "a-1",
      title: "Send revised PI",
      owner: "Lina",
      dueAt: "2026-05-13",
      status: "open",
      priority: "high",
    },
  ],
  activities: [],
};

test("filterAccounts searches names, countries, owners, statuses, and tags", () => {
  const result = filterAccounts(baseState.accounts, {
    query: "machinery lina active",
  });

  assert.deepEqual(
    result.map((account) => account.id),
    ["a-1"],
  );
});

test("rankAccounts puts higher value and more recent VIP accounts first", () => {
  const result = rankAccounts(baseState.accounts);

  assert.equal(result[0].id, "a-1");
  assert.ok(result[0].score > result[1].score);
  assert.equal(result[0].tier, "A");
});

test("moveOpportunity advances an opportunity and recalculates probability", () => {
  const next = moveOpportunity(baseState, "o-2", "negotiation");
  const moved = next.opportunities.find((opportunity) => opportunity.id === "o-2");

  assert.equal(moved.stage, "negotiation");
  assert.equal(moved.probability, CRM_STAGES.negotiation.probability);
  assert.notEqual(next, baseState);
});

test("addTask creates a dated follow-up without mutating existing state", () => {
  const next = addTask(baseState, {
    accountId: "a-2",
    title: "Confirm product specs",
    owner: "Chen",
    dueAt: "2026-05-15",
    priority: "medium",
  });

  assert.equal(next.tasks.length, 2);
  assert.equal(baseState.tasks.length, 1);
  assert.match(next.tasks[1].id, /^task-/);
  assert.equal(next.tasks[1].status, "open");
});

test("addActivity records timeline events newest first", () => {
  const next = addActivity(baseState, {
    accountId: "a-1",
    type: "email",
    title: "Customer asked for Incoterms update",
    createdAt: "2026-05-14T10:00:00.000Z",
  });

  assert.equal(next.activities[0].title, "Customer asked for Incoterms update");
  assert.equal(next.activities[0].type, "email");
});

test("calculateDashboard returns pipeline, overdue tasks, and weighted forecast", () => {
  const metrics = calculateDashboard(baseState, "2026-05-14");

  assert.equal(metrics.accountCount, 2);
  assert.equal(metrics.openTaskCount, 1);
  assert.equal(metrics.overdueTaskCount, 1);
  assert.equal(metrics.pipelineValue, 54000);
  assert.equal(metrics.weightedForecast, 31920);
  assert.deepEqual(metrics.stageTotals.lead, { count: 1, value: 12000 });
  assert.deepEqual(metrics.stageTotals.quote, { count: 1, value: 42000 });
});
