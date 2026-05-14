export const CRM_STAGES = {
  lead: { label: "线索", probability: 20, order: 1 },
  qualified: { label: "已确认需求", probability: 38, order: 2 },
  sample: { label: "寄样/方案", probability: 52, order: 3 },
  quote: { label: "报价", probability: 68, order: 4 },
  negotiation: { label: "谈判", probability: 82, order: 5 },
  won: { label: "赢单", probability: 100, order: 6 },
  lost: { label: "输单", probability: 0, order: 7 },
};

export function filterAccounts(accounts, filters = {}) {
  const terms = normalize(filters.query)
    .split(/\s+/)
    .filter(Boolean);

  if (terms.length === 0) {
    return [...accounts];
  }

  return accounts.filter((account) => {
    const haystack = normalize(
      [
        account.name,
        account.owner,
        account.country,
        account.status,
        ...(account.tags ?? []),
      ].join(" "),
    );

    return terms.every((term) => haystack.includes(term));
  });
}

export function rankAccounts(accounts, today = "2026-05-14") {
  const now = new Date(`${today}T00:00:00.000Z`).getTime();

  return accounts
    .map((account) => {
      const valueScore = Math.min((account.annualValue ?? 0) / 1000, 220);
      const recencyScore = calculateRecencyScore(account.lastContactAt, now);
      const vipScore = account.tags?.includes("VIP") ? 80 : 0;
      const activeScore = account.status === "active" ? 35 : 0;
      const score = Math.round(valueScore + recencyScore + vipScore + activeScore);

      return {
        ...account,
        score,
        tier: score >= 220 ? "A" : score >= 130 ? "B" : "C",
      };
    })
    .sort((a, b) => b.score - a.score || b.annualValue - a.annualValue);
}

export function moveOpportunity(state, opportunityId, nextStage) {
  assertStage(nextStage);

  return {
    ...state,
    opportunities: state.opportunities.map((opportunity) => {
      if (opportunity.id !== opportunityId) {
        return opportunity;
      }

      return {
        ...opportunity,
        stage: nextStage,
        probability: CRM_STAGES[nextStage].probability,
      };
    }),
  };
}

export function addTask(state, task) {
  const nextTask = {
    id: `task-${Date.now()}-${state.tasks.length + 1}`,
    status: "open",
    priority: "medium",
    ...task,
  };

  return {
    ...state,
    tasks: [...state.tasks, nextTask],
  };
}

export function addActivity(state, activity) {
  const nextActivity = {
    id: `activity-${Date.now()}-${state.activities.length + 1}`,
    createdAt: new Date().toISOString(),
    ...activity,
  };

  return {
    ...state,
    activities: [nextActivity, ...state.activities],
  };
}

export function calculateDashboard(state, today = new Date().toISOString().slice(0, 10)) {
  const stageTotals = Object.fromEntries(
    Object.keys(CRM_STAGES).map((stage) => [stage, { count: 0, value: 0 }]),
  );

  let pipelineValue = 0;
  let weightedForecast = 0;

  for (const opportunity of state.opportunities) {
    const value = opportunity.value ?? 0;
    const stage = opportunity.stage;

    if (!stageTotals[stage]) {
      continue;
    }

    stageTotals[stage].count += 1;
    stageTotals[stage].value += value;

    if (stage !== "won" && stage !== "lost") {
      pipelineValue += value;
      weightedForecast += Math.round(value * ((opportunity.probability ?? 0) / 100));
    }
  }

  const openTasks = state.tasks.filter((task) => task.status !== "done");
  const overdueTasks = openTasks.filter((task) => task.dueAt < today);

  return {
    accountCount: state.accounts.length,
    openTaskCount: openTasks.length,
    overdueTaskCount: overdueTasks.length,
    pipelineValue,
    weightedForecast,
    stageTotals,
  };
}

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function calculateRecencyScore(dateText, todayMs) {
  if (!dateText) {
    return 0;
  }

  const elapsedDays = Math.max(
    0,
    Math.floor((todayMs - new Date(`${dateText}T00:00:00.000Z`).getTime()) / 86400000),
  );

  return Math.max(0, 90 - elapsedDays * 3);
}

function assertStage(stage) {
  if (!CRM_STAGES[stage]) {
    throw new Error(`Unknown opportunity stage: ${stage}`);
  }
}
