# Codex Chrome Extension 优先设计规范

日期：2026-07-09

## 问题说明

仪表盘将浏览器执行层标记为“Codex Chrome Extension”，但 `main.js`
当前实际查找或启动的是使用 9222-9225 端口的 Chrome DevTools Protocol
（CDP）浏览器。这是另一套传输机制，并且可能使用独立的 Chrome 用户目录。
因此，Codex Chrome Extension 显示 Connected，并不能证明
`npm run daily:execute` 正在使用该插件。

当队列中没有可执行任务时，系统会在启动浏览器前正常停止。该状态必须与插件连接
失败明确区分。

## 目标

当自动化运行在具备 Codex 浏览器能力的环境中时，优先使用已连接的 Codex Chrome
Extension；保留现有 CDP 驱动作为受控降级通道。系统必须报告实际使用的传输方式，
不得在浏览器未打开或客户开发未发生时作出相反表述。

当现有 Daily Queue 为空时，Discovery 必须先补充搜索新的潜在代理商和 KA 客户，
不能直接把空队列当成正常业务终点。只有 ICP 分数严格大于 70、目标身份和官方渠道
已验证、且未触发合作伙伴、重复触达或冷却期保护的候选，才可以进入自动开发队列。

## 约束

- 保留精确目标身份验证、冷却期、已确认消息防重复、凭据校验和发送确认机制。
- 传输层健康检查不得联系真实客户。
- 独立 Electron 进程及定时命令不得假设能够直接访问 Codex 浏览器插件运行时；
  未显式获得该能力时必须安全降级。
- 不得暴露无身份验证的通用本地浏览器控制接口。
- 不得强制推送、部署 Vercel 或修改无关的现有工作区变更。
- “持续补充发现”不能绕过安全门控。如果补充搜索仍未得到已验证且 ICP > 70 的
  新目标，系统必须如实停止，而不是重复联系旧客户或降低 ICP 标准。

## 架构

在现有客户开发执行流程中引入统一的浏览器传输边界。

### 1. `CodexExtensionTransport`

- 仅当 Codex 运行时显式提供经过身份验证的 Extension Bridge 能力时可用。
- 被选中前执行只读健康检查。
- 通过用户当前已连接的 Chrome 用户目录打开并检查精确目标。
- 返回统一格式的打开、检查、交互及确认结果。

### 2. `CdpChromeTransport`

- 封装现有的 9222-9225 端口发现和独立用户目录启动逻辑。
- 作为独立执行 `npm run daily:execute` 时的降级通道。
- 保留现有 DOM 交互及发送确认行为。

### 3. `BrowserTransportSelector`

- 优先选择健康的 Extension Transport。
- 仅当插件传输在任何外部副作用发生前不可用时，允许降级一次到 CDP。
- 发送、评论、点赞或关注一旦开始，禁止切换传输方式，防止重复操作。

传输边界保持最小化，只负责打开精确 URL、检查可见状态、执行已批准操作及返回
证据。队列选择和客户开发安全策略继续位于传输层之外。

## 自动补充发现

Discovery 使用两层候选源：

1. 已验证种子池：包含具备官网、官方联系或 Vendor 路径及明确户外零售/分销能力的
   潜在代理商和 KA 客户。
2. 外部补充数据：允许后续搜索任务将同一结构的已验证候选写入发现输入，避免每次
   修改执行器代码。

每个候选必须包含 `customerType`（`agency` 或 `key_account`）、`fitScore`、
官网、国家/市场、业务背景、采购角色和至少一个官方可执行渠道。发现器为每个候选
生成 Google 背景查询和官网联系查询作为证据入口，但 Google 搜索结果页本身不得
作为发送目标。

Daily Queue 在正常候选过滤后为空时，必须记录已执行补充发现及其结果。新候选仍由
现有 `fitScore > 70`、精确身份、合作伙伴、已确认发送、同日开发和冷却期规则过滤。

## 数据流程

1. Discovery 生成并过滤现有候选。
2. 如果 Daily Queue 为空，先执行代理商/KA 补充发现并重新生成队列。
3. 如果补充后仍不存在满足 ICP 和安全规则的目标，则如实停止，不初始化传输层。
4. 如果存在可执行任务，Selector 检查 Extension 能力。
5. Extension Bridge 健康时，通过它打开经过验证的精确目标 URL。
6. 如果 Bridge 在交互开始前不可用，则选择 CDP。
7. 被选中的传输层将统一证据返回现有结果记录器和 Artifact 刷新流程。

## 状态与证据

Execution Artifact 必须明确记录：

- `browserTransportRequested`：`codex-extension-first`
- `browserTransportUsed`：`codex-extension`、`cdp` 或 `none`
- `browserTransportFallbackReason`：空值或稳定的原因代码
- `chromeOpened`：仅在目标标签页已验证打开后为 `true`
- `customerDevelopmentPerformed`：仅在已批准的客户操作得到确认后为 `true`
- `discoveryRefillAttempted`：空队列后是否执行过补充发现
- `discoveryRefillQualified`：补充发现中通过 ICP 和身份检查的候选数量

仪表盘必须展示实际使用的传输方式，不得将 CDP 执行标记成 Codex Extension 执行。

## 失败处理

- 初始队列为空：先执行补充发现，不立即结束。
- 补充发现后仍无合格目标：`no_executable_tasks`，传输方式为 `none`，并记录补充
  发现证据。
- Extension 在交互前不可用：记录原因并降级到 CDP。
- Extension 在交互开始后断开：停止执行并要求人工检查，禁止自动降级。
- 精确目标不匹配：停止执行，不进行交互。
- 两种传输均不可用：`browser_transport_unavailable`，不开展客户开发。
- 发送或操作未确认：保留现有未确认或人工检查状态，不得通过另一传输方式重试。

## 测试方案

所有生产代码变更前必须先编写失败测试，覆盖以下行为：

1. Extension 能力健康时优先于 CDP。
2. Extension 能力不存在时选择 CDP。
3. Extension 在副作用发生前失败时，只降级一次到 CDP。
4. Extension 在副作用发生后失败时，不允许降级。
5. 队列为空时，两种传输均不得初始化。
6. Artifact 必须报告实际传输方式，并保持 `chromeOpened` 和
   `customerDevelopmentPerformed` 的真实性。
7. 现有精确目标、防重复消息、冷却期及发送确认测试全部保持通过。
8. 初始候选耗尽时会补充代理商和 KA 候选。
9. ICP 等于 70 或低于 70 的补充候选不得进入自动开发队列。
10. 已验证且 ICP 大于 70 的新候选可以进入队列。

真实环境验证首先采用只读方式：列出已连接的 Chrome 标签页，并打开无副作用的
本地仪表盘目标。真实客户交互不属于传输层验证范围，仍须通过正常执行安全门控。

## 验收标准

- 经过身份验证的 Extension 运行时能力可用时，系统优先使用 Extension。
- 独立执行仍可通过 CDP 降级正常工作。
- 传输降级不得产生任何重复操作。
- Execution Artifact 和仪表盘清晰展示实际传输方式。
- 初始空队列会触发补充发现，不得直接错误报告插件故障。
- 补充发现只允许 ICP 严格大于 70 的代理商和 KA 客户进入自动开发。
- 补充后仍无安全目标时保持真实停止，不允许重复开发或降低质量门槛。
