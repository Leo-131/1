# Outreach 数据更新报告 v6.0
**执行时间：** 2026-04-22 11:02 (Asia/Shanghai)
**数据版本：** v15.2 | 最后运行：2026-04-22 01:45:09

---

## 📊 数据概览

| 指标 | 数量 |
|------|------|
| 今日建联总数 | +0（本次为只读分析，未发送新邮件） |
| 现有总联系人数 | **844** |
| Accepted（已接受） | 9 |
| Pending（待回复） | 15 |
| Failed（失败） | 1 |
| 数据来源 | outreach_data: 25 / okki: 82 / salesrobot: 737 |

---

## 🎯 画像分布（已知角色的 25 位联系人）

| Tier | 标准 | 人数 | 占比 |
|------|------|------|------|
| **Tier 1（最高）** | CEO, President, Founder, Owner, Managing Director | 4 | 16% |
| **Tier 2（高）** | VP Merchandising/Purchasing/Sales, Director 级别 | 8 | 32% |
| **Tier 3（重要）** | Senior Buyer, Category Manager, Buyer, Sourcing Manager | 13 | 52% |
| **非目标画像** | 不符合采购决策人标准 | 0 | 0% |

> ⚠️ **重要：** salesrobot 的 737 位联系人中，绝大多数缺失 `role` 字段（无职位信息），无法进行 Tier 画像校验，需人工逐批核查补充职位信息。

---

## ⚠️ 需排除的联系人（设计师/创意类角色）

以下 2 位确认不符合目标画像，已标注 **[排除]**：

| # | 姓名 | 公司 | 角色 | 排除原因 |
|---|------|------|------|----------|
| 1 | Aidan Oddløkken | XTRATUF | Jr. Footwear Designer/Developer | 设计师岗，非采购决策人 |
| 2 | Carson Hawkes | Talon Tide | Freelance Industrial Designer | 设计师岗，排除 |
| 3 | Leeda D. | URBAN ARMOR GEAR | Director of Brand & Creative Operations | 创意运营，非采购决策人（降级处理）|
| 4 | Kai Nevers | SAM | Freelance Designer | 设计师岗，排除 |
| 5 | Rachel Schmitt | Hydro Flask | Social Media Specialist | 非采购岗，排除 |

---

## ⚠️ 特殊标记：需人工确认

| # | 姓名 | 公司 | 角色 | 备注 |
|---|------|------|------|------|
| 1 | Sylvia Ni | Flextail Gear | Channel Sales Manager | ⚠️ **内部门员工，不应出现在外联数据库中** |
| 2 | Fanni Zhang | Flextail Gear | Sales Representative | ⚠️ **内部门员工，应移除** |
| 3 | Kevin Zhang | Global Electronics Distribution | Managing Director | ✅ Tier 1，但"Johnjnr@viresco-uk.com"出现在 okki 数据，需确认重复 |
| 4 | Laura Forman | The Forethought Group | CEO + Founder | ✅ Tier 1，但公司非零售/分销行业 |
| 5 | Lauren Boonzaier | MOBIZ | （无职位）| 多条重复记录（3条），需合并清理 |

---

## 🔑 最佳关键词（基于 Accepted 状态分析）

根据现有Accepted联系人的 `keyword_used` 字段分析：

| 排名 | 关键词 | 命中数 | 效果 |
|------|--------|--------|------|
| 🥇 | `retail chain buyer` | 2 (Emma Wilson/Bass Pro + Nicole Adams/Walgreens) | 命中率最高 |
| 🥈 | `camping gear distributor` | 1 (Sarah Miller/REI) | 精准户外 |
| 🥉 | `Walmart buyer electronics` | 1 (Rachel Green/Walmart) | 精准KA |
| — | `outdoor gear distributor` | 1 (James Chen/Bass Pro) | 户外关键词有效 |
| — | `commercial manager retail` | 1 (Jessica Wong/Costco Canada) | Costco精准 |

> **结论：** `retail chain buyer` + 具体公司名组合关键词效果最佳（2/2 Accepted）。

---

## 📈 关键洞察

1. **REI 已是现有客户** — Sarah Miller、Jennifer Lee 已 Accepted，应重点开发同类竞品（Dick's, Bass Pro, Backcountry）
2. **销售机器人的 737 位联系人质量低** — 绝大多数缺失 role/company 字段，无法自动校验画像，建议优先清理
3. **okki 数据 82 位** — 大量重复（Lauren Boonzaier/MOBIZ 出现 3 次，Erik Bordin/LINDAB 出现 4 次），需去重
4. **Accepted 率** — 在有角色信息的 25 人中，9 Accepted = 36%接受率，表现良好
5. **Pending 转化潜力** — 15 位 Pending，其中 Michael Torres/Camping World (VP Merchandising)、Ryan Cooper/Airstream (Director of Product Development) 最值得优先跟进

---

## 📋 下一步行动（具体操作）

### 🔴 立即执行
1. **跟进 Camping World - VP of Merchandising（Michael Torres）**
   - 公司：Camping World
   - 职位：VP of Merchandising
   - 搜索词：`"Camping World" VP Merchandising`
   - 行动：发送 Follow-up，强调 RV 电源+露营双品类合作方案，附 Amazon 销售数据

2. **跟进 Airstream - Director of Product Development（Ryan Cooper）**
   - 公司：Airstream
   - 职位：Director of Product Development
   - 搜索词：`"Airstream" Director Product Development`
   - 行动：发送 Follow-up，强调 OEM/RV 电源定制合作

3. **跟进 Thor Industries - Strategic Sourcing Director（Jason Park）**
   - 公司：Thor Industries
   - 职位：Strategic Sourcing Director
   - 搜索词：`"Thor Industries" Strategic Sourcing Director`
   - 行动：发送 Follow-up，RV OEM 合作方案

### 🟡 本周优先
4. **清理 salesrobot 数据**
   - 行动：筛选出缺失 `role` 的 737 条记录，补充职位信息后再进行画像匹配
   - 目标：清理后有效联系人库提升至 200+

5. **去重 okki 数据**
   - 重复项：Lauren Boonzaier/MOBIZ（3条）、Erik Bordin/LINDAB（4条）、Melissa Boonzaier/MOBIZ（3条）
   - 行动：合并去重，保留最新状态记录

---

## 🔗 看板链接

[📊 Outreach 看板](file:///C:/Users/23889/.qclaw/workspace/outreach_dashboard.html)

---

*报告生成时间：2026-04-22 11:02 | 数据来源：outreach_data.json v15.2*
