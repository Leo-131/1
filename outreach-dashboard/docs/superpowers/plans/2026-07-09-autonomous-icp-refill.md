# 自动补充高 ICP 客户实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 当现有候选耗尽时补充搜索已验证的潜在代理商与 KA 客户，并只允许 `fitScore > 70` 的目标进入自动开发队列。

**Architecture:** 扩展现有 Google Discovery 候选模型，加入客户类型及已验证的新代理商/KA 种子，并保持官网渠道作为唯一执行目标。Daily Runner 继续作为安全过滤层，严格应用 ICP、合作伙伴、已发送、同日触达和冷却期规则；Discovery Artifact 增加补充发现元数据，避免将空队列误判为插件故障。

**Tech Stack:** Node.js CommonJS、`node:test`、JSON/JS Artifacts、Electron 执行层。

---

### Task 1: 扩展 Discovery 候选模型

**Files:**
- Modify: `google-lead-discovery-runner.js`
- Test: `../tests/glm-automation.test.js`

- [ ] **Step 1: 编写失败测试**

增加测试，要求 `buildLeads(120)` 至少生成一个 `customerType === 'agency'`
和一个 `customerType === 'key_account'` 的新候选；所有可开发候选必须
`fitScore > 70`，且包含官网及官方联系目标。

- [ ] **Step 2: 验证测试按预期失败**

Run: `node --test ../tests/glm-automation.test.js`

Expected: FAIL，因为当前 Lead 不包含 `customerType`，也没有新增补充候选。

- [ ] **Step 3: 实现最小候选扩展**

在 `CANDIDATES` 中加入已通过官网验证的 Academy Sports + Outdoors、
Sportsman's Warehouse、SCHEELS 和 Camping World。为所有候选补充
`customerType`，并由 `baseLead()` 输出该字段及 `discoveryMode:
'autonomous_refill'`。

- [ ] **Step 4: 验证测试通过**

Run: `node --test ../tests/glm-automation.test.js`

Expected: PASS。

### Task 2: 记录补充发现和 ICP 约束

**Files:**
- Modify: `google-lead-discovery-runner.js`
- Modify: `daily-automation-runner.js`
- Test: `../tests/glm-automation.test.js`

- [ ] **Step 1: 编写失败测试**

增加测试验证 Discovery 输出模型包含 `qualifiedThreshold: 70` 和
`refillCandidateCount`；验证 Daily Runner 对 70 分候选返回
`retain_low_icp`，对 71 分已验证候选返回可开发动作。

- [ ] **Step 2: 验证测试按预期失败**

Run: `node --test ../tests/glm-automation.test.js`

Expected: FAIL，因为发现摘要尚未暴露补充计数。

- [ ] **Step 3: 实现最小元数据**

导出 `buildDiscoveryRun(limit)`，由 CLI 和测试共同调用；在 run 中记录
`discoveryRefillAttempted`、`qualifiedThreshold`、`refillCandidateCount`
及代理商/KA 数量。Daily Artifact 将这些字段镜像到 `discoveryRefill`。

- [ ] **Step 4: 验证测试通过**

Run: `node --test ../tests/glm-automation.test.js`

Expected: PASS。

### Task 3: 运行完整验证与真实工作流

**Files:**
- Verify: `google-lead-discovery-latest.json`
- Verify: `daily-runs/2026-07-09-daily-automation.json`
- Verify: `daily-automation-execution-latest.json`

- [ ] **Step 1: 运行语法和领域测试**

Run: `node -c google-lead-discovery-runner.js`

Run: `node -c daily-automation-runner.js`

Run: `node --test ../tests/glm-automation.test.js ../tests/command-center.test.js`

Expected: 全部通过。

- [ ] **Step 2: 按规定顺序运行工作流**

Run: `npm run discover:daily`

Run: `npm run daily:execute`

Run: `npm run sync:github`

Expected: Discovery 生成新的 `fitScore > 70` 代理商/KA；Execution 仅在安全
门控允许时开发；同步后本地、upstream 和远端 commit 一致。

- [ ] **Step 3: 验证 Artifacts 和可见系统**

核对 Daily Queue 中每个自动开发目标的 `fitScore > 70`，确认
`googleDiscovered` 与队列一致，并检查 `http://127.0.0.1:4174/` 的核心
Artifact 路由与本地文件哈希一致。
