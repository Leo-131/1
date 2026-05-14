import {
  CRM_STAGES,
  addActivity,
  addTask,
  calculateDashboard,
  filterAccounts,
  moveOpportunity,
  rankAccounts,
} from "./src/crm-core.mjs";
import { seedState } from "./src/sample-data.mjs";

const STORAGE_KEY = "tradepilot-crm-state-v1";
const TODAY = "2026-05-14";
const activeStages = ["lead", "qualified", "sample", "quote", "negotiation"];

let state = loadState();
let activeAccountId = state.accounts[0]?.id;
let filters = {
  query: "",
  status: "all",
};

const elements = {
  search: document.querySelector("#account-search"),
  statusFilter: document.querySelector("#status-filter"),
  accountList: document.querySelector("#account-list"),
  accountDetail: document.querySelector("#account-detail"),
  pipelineBoard: document.querySelector("#pipeline-board"),
  pipelineSummary: document.querySelector("#pipeline-summary"),
  taskForm: document.querySelector("#task-form"),
  taskList: document.querySelector("#task-list"),
  activityForm: document.querySelector("#activity-form"),
  activityList: document.querySelector("#activity-list"),
  orderTable: document.querySelector("#order-table"),
  insightList: document.querySelector("#insight-list"),
  exportJson: document.querySelector("#export-json"),
  resetData: document.querySelector("#reset-data"),
  metricAccounts: document.querySelector("#metric-accounts"),
  metricTopTier: document.querySelector("#metric-top-tier"),
  metricPipeline: document.querySelector("#metric-pipeline"),
  metricForecast: document.querySelector("#metric-forecast"),
  metricOverdue: document.querySelector("#metric-overdue"),
  metricOpenTasks: document.querySelector("#metric-open-tasks"),
};

render();

elements.search.addEventListener("input", (event) => {
  filters = { ...filters, query: event.target.value };
  render();
});

elements.statusFilter.addEventListener("change", (event) => {
  filters = { ...filters, status: event.target.value };
  render();
});

elements.accountList.addEventListener("click", (event) => {
  const row = event.target.closest("[data-account-id]");
  if (!row) {
    return;
  }

  activeAccountId = row.dataset.accountId;
  render();
});

elements.pipelineBoard.addEventListener("click", (event) => {
  const button = event.target.closest("[data-move-opportunity]");
  if (!button) {
    return;
  }

  const { opportunityId, nextStage } = button.dataset;
  state = moveOpportunity(state, opportunityId, nextStage);
  persist();
  render();
});

elements.taskList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-complete-task]");
  if (!button) {
    return;
  }

  state = {
    ...state,
    tasks: state.tasks.map((task) =>
      task.id === button.dataset.completeTask ? { ...task, status: "done" } : task,
    ),
  };
  persist();
  render();
});

elements.taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const activeAccount = getActiveAccount();

  state = addTask(state, {
    accountId: activeAccount.id,
    title: form.get("title"),
    dueAt: form.get("dueAt"),
    priority: form.get("priority"),
    owner: activeAccount.owner,
  });

  event.currentTarget.reset();
  event.currentTarget.elements.dueAt.value = "2026-05-15";
  event.currentTarget.elements.priority.value = "medium";
  persist();
  render();
});

elements.activityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);

  state = addActivity(state, {
    accountId: getActiveAccount().id,
    type: form.get("type"),
    title: form.get("title"),
    createdAt: new Date().toISOString(),
  });

  event.currentTarget.reset();
  persist();
  render();
});

elements.exportJson.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tradepilot-crm-${TODAY}.json`;
  link.click();
  URL.revokeObjectURL(url);
});

elements.resetData.addEventListener("click", () => {
  state = structuredClone(seedState);
  activeAccountId = state.accounts[0]?.id;
  persist();
  render();
});

function render() {
  const rankedAccounts = rankAccounts(state.accounts, TODAY);
  const visibleAccounts = filterAccounts(rankedAccounts, { query: filters.query }).filter(
    (account) => filters.status === "all" || account.status === filters.status,
  );

  if (!visibleAccounts.some((account) => account.id === activeAccountId)) {
    activeAccountId = visibleAccounts[0]?.id ?? rankedAccounts[0]?.id;
  }

  renderMetrics(rankedAccounts);
  renderAccounts(visibleAccounts);
  renderAccountDetail();
  renderPipeline();
  renderTasks();
  renderActivities();
  renderOrders();
  renderInsights(rankedAccounts);
}

function renderMetrics(rankedAccounts) {
  const metrics = calculateDashboard(state, TODAY);
  const topTierCount = rankedAccounts.filter((account) => account.tier === "A").length;

  elements.metricAccounts.textContent = metrics.accountCount;
  elements.metricTopTier.textContent = `A 类客户 ${topTierCount} 个`;
  elements.metricPipeline.textContent = money(metrics.pipelineValue);
  elements.metricForecast.textContent = money(metrics.weightedForecast);
  elements.metricOverdue.textContent = metrics.overdueTaskCount;
  elements.metricOpenTasks.textContent = `待办 ${metrics.openTaskCount} 项`;
}

function renderAccounts(accounts) {
  elements.accountList.innerHTML = accounts
    .map((account) => {
      const activeClass = account.id === activeAccountId ? " active" : "";
      const statusClass = account.status === "active" ? "green" : "amber";

      return `
        <button class="account-row${activeClass}" type="button" data-account-id="${account.id}">
          <span class="row-main">
            <strong>${escapeHtml(account.name)}</strong>
            <span class="status-pill ${statusClass}">${escapeHtml(account.lifecycle)}</span>
          </span>
          <span class="row-meta">
            <span>${escapeHtml(account.country)} · ${escapeHtml(account.owner)}</span>
            <strong>${money(account.annualValue)}</strong>
          </span>
          <span class="tag-row">
            ${account.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
          </span>
        </button>
      `;
    })
    .join("");
}

function renderAccountDetail() {
  const account = getActiveAccount();
  if (!account) {
    elements.accountDetail.innerHTML = "";
    return;
  }

  const accountOpportunity = state.opportunities.find(
    (opportunity) => opportunity.accountId === account.id,
  );
  const contact = account.contacts[0];
  const riskClass = account.risk === "高" ? "red" : account.risk === "中" ? "amber" : "green";

  elements.accountDetail.innerHTML = `
    <div class="detail-hero">
      <div class="detail-title">
        <div>
          <p class="section-kicker">Selected account</p>
          <h2>${escapeHtml(account.name)}</h2>
          <p>${escapeHtml(account.city)}, ${escapeHtml(account.country)} · ${escapeHtml(account.industry)}</p>
        </div>
        <span class="status-pill ${riskClass}">风险 ${escapeHtml(account.risk)}</span>
      </div>
      <div class="detail-grid">
        <div class="detail-stat">
          <span>客户评分</span>
          <strong>${rankAccounts([account], TODAY)[0].score}</strong>
        </div>
        <div class="detail-stat">
          <span>年潜力</span>
          <strong>${money(account.annualValue)}</strong>
        </div>
        <div class="detail-stat">
          <span>最近联系</span>
          <strong>${escapeHtml(account.lastContactAt)}</strong>
        </div>
      </div>
      <div class="contact-card">
        <strong>${escapeHtml(contact.name)}</strong>
        <p>${escapeHtml(contact.title)} · ${escapeHtml(contact.email)} · ${escapeHtml(contact.phone)}</p>
      </div>
      <div>
        <p class="section-kicker">Next best action</p>
        <h3>${escapeHtml(account.nextAction)}</h3>
        <p class="muted-copy">${escapeHtml(account.note)}</p>
      </div>
      ${
        accountOpportunity
          ? `<div class="contact-card">
              <strong>${escapeHtml(accountOpportunity.title)}</strong>
              <p>${CRM_STAGES[accountOpportunity.stage].label} · ${money(accountOpportunity.value)} · ${accountOpportunity.probability}% 可能性</p>
            </div>`
          : ""
      }
    </div>
  `;
}

function renderPipeline() {
  const openOpportunities = state.opportunities.filter(
    (opportunity) => !["won", "lost"].includes(opportunity.stage),
  );
  elements.pipelineSummary.textContent = `${openOpportunities.length} 个进行中商机`;
  elements.pipelineBoard.innerHTML = activeStages
    .map((stage) => {
      const opportunities = state.opportunities.filter((opportunity) => opportunity.stage === stage);
      const total = opportunities.reduce((sum, opportunity) => sum + opportunity.value, 0);

      return `
        <div class="stage-column">
          <div class="stage-head">
            <h3>${CRM_STAGES[stage].label}</h3>
            <span>${opportunities.length} · ${money(total)}</span>
          </div>
          ${opportunities.map(renderOpportunityCard).join("")}
        </div>
      `;
    })
    .join("");
}

function renderOpportunityCard(opportunity) {
  const account = state.accounts.find((item) => item.id === opportunity.accountId);
  const nextStage = getNextStage(opportunity.stage);

  return `
    <article class="opportunity-card">
      <div>
        <h3>${escapeHtml(opportunity.title)}</h3>
        <p>${escapeHtml(account?.name ?? "未知客户")} · ${escapeHtml(opportunity.product)}</p>
      </div>
      <div class="value-line">
        <span>${money(opportunity.value)}</span>
        <span>${opportunity.probability}%</span>
      </div>
      <div class="probability" aria-hidden="true">
        <span style="width:${opportunity.probability}%"></span>
      </div>
      ${
        nextStage
          ? `<button class="stage-button" type="button" data-move-opportunity data-opportunity-id="${opportunity.id}" data-next-stage="${nextStage}">推进到${CRM_STAGES[nextStage].label}</button>`
          : ""
      }
    </article>
  `;
}

function renderTasks() {
  const sortedTasks = [...state.tasks].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "open" ? -1 : 1;
    }
    return a.dueAt.localeCompare(b.dueAt);
  });

  elements.taskList.innerHTML = sortedTasks
    .map((task) => {
      const account = state.accounts.find((item) => item.id === task.accountId);
      const isDone = task.status === "done";
      const isOverdue = task.status !== "done" && task.dueAt < TODAY;
      const priorityClass = task.priority === "high" ? "red" : task.priority === "medium" ? "amber" : "green";

      return `
        <article class="task-item ${isDone ? "done" : ""}">
          <div>
            <strong>${escapeHtml(task.title)}</strong>
            <p>${escapeHtml(account?.name ?? "未知客户")} · ${escapeHtml(task.owner)} · ${escapeHtml(task.dueAt)}</p>
          </div>
          <span class="status-pill ${isOverdue ? "red" : priorityClass}">${isDone ? "已完成" : isOverdue ? "逾期" : task.priority}</span>
          ${
            isDone
              ? ""
              : `<button class="complete-button" type="button" data-complete-task="${task.id}" title="标记完成" aria-label="标记完成">✓</button>`
          }
        </article>
      `;
    })
    .join("");
}

function renderActivities() {
  const activities = state.activities.slice(0, 8);
  elements.activityList.innerHTML = activities
    .map((activity) => {
      const account = state.accounts.find((item) => item.id === activity.accountId);
      return `
        <article class="timeline-item ${escapeHtml(activity.type)}">
          <strong>${escapeHtml(activity.title)}</strong>
          <p>${escapeHtml(account?.name ?? "未知客户")} · ${escapeHtml(activity.type)} · ${formatDateTime(activity.createdAt)}</p>
        </article>
      `;
    })
    .join("");
}

function renderOrders() {
  elements.orderTable.innerHTML = state.orders
    .map((order) => {
      const account = state.accounts.find((item) => item.id === order.accountId);
      return `
        <tr>
          <td><strong>${escapeHtml(order.code)}</strong></td>
          <td>${escapeHtml(account?.name ?? "未知客户")}</td>
          <td>${money(order.amount)}</td>
          <td><span class="status-pill amber">${escapeHtml(order.status)}</span></td>
          <td>${escapeHtml(order.eta)}</td>
          <td>${order.margin}%</td>
        </tr>
      `;
    })
    .join("");
}

function renderInsights(rankedAccounts) {
  const overdueAccounts = new Set(
    state.tasks.filter((task) => task.status !== "done" && task.dueAt < TODAY).map((task) => task.accountId),
  );
  const insights = rankedAccounts.slice(0, 4).map((account) => {
    const reason = overdueAccounts.has(account.id)
      ? "存在逾期动作，建议今天优先跟进。"
      : account.score > 220
        ? "客户价值高且近期有互动，适合推进复购或框架协议。"
        : "需要补充触达频次和采购背景，避免进入沉默周期。";

    return { account, reason };
  });

  elements.insightList.innerHTML = insights
    .map(
      ({ account, reason }) => `
        <article class="insight-item">
          <div class="row-main">
            <strong>${escapeHtml(account.name)}</strong>
            <span class="insight-score">${account.score}</span>
          </div>
          <p>${escapeHtml(reason)}</p>
        </article>
      `,
    )
    .join("");
}

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return structuredClone(seedState);
  }

  try {
    return JSON.parse(stored);
  } catch {
    return structuredClone(seedState);
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getActiveAccount() {
  return state.accounts.find((account) => account.id === activeAccountId) ?? state.accounts[0];
}

function getNextStage(stage) {
  const index = activeStages.indexOf(stage);
  return activeStages[index + 1];
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
