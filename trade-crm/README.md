# TradePilot CRM

TradePilot CRM 是一个面向外贸 B2B 团队的可运行 CRM V1 原型，覆盖客户池、商机漏斗、跟进任务、沟通记录、订单交付和经营洞察。

## 功能

- 客户资产管理：客户分级、标签、负责人、国家、联系人、下一步动作
- 商机流程：线索、确认需求、寄样/方案、报价、谈判阶段推进
- 跟进中心：新增任务、标记完成、逾期提醒
- 沟通记录：邮件、WhatsApp、电话、会议记录时间线
- 订单概览：订单号、金额、交付状态、交期、毛利
- 经营看板：客户数、商机金额、加权预测、逾期跟进
- 本地持久化：浏览器 localStorage 自动保存演示数据
- 数据导出：一键导出 JSON

## 本地运行

最快方式：直接双击打开：

```text
trade-crm/standalone.html
```

这个文件是完整单页版，CSS、数据和交互都在同一个 HTML 文件里，不需要安装依赖，也不需要启动服务。

如果要运行模块化版本，在仓库根目录启动静态服务：

```powershell
node .\trade-crm\dev-server.mjs 5173
```

然后打开：

```text
http://localhost:5173/trade-crm/
```

如果没有 Python，也可以用任意静态文件服务器托管 `trade-crm/` 目录。

## 测试

```powershell
node --test .\trade-crm\tests\crm-core.test.mjs
```

## 下一阶段

- 用户登录、角色权限、组织架构
- 后端 API 与数据库
- 邮件/WhatsApp/阿里国际站线索接入
- 批量导入、重复客户合并、公海规则
- 报价单、样品、订单、收款、出货完整流程
- AI 客户画像、邮件回复建议、经营问数
