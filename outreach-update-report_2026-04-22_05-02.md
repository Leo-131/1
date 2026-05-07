# Outreach数据更新报告 v6.0

**执行时间**: 2026-04-22 05:02 (Asia/Shanghai)
**数据版本**: v15.2 | 最后同步: 2026-04-21 08:55:07

---

## 📊 数据概览

| 指标 | 数量 |
|------|------|
| **总联系人数** | 844 |
| **数据来源** | Multi-Sheet Sync |
| ├─ outreach_data | 25 |
| ├─ okki | 82 |
| └─ salesrobot | 737 |
| **今日发送** | 0 (无新增) |
| **已接受** | ~15 (from outreach_data) |
| **待处理** | ~750+ |
| **失败** | ~30 |

---

## 🎯 目标画像分布

### 符合目标画像

| Tier | 角色 | 数量 | 占比 |
|------|------|------|------|
| **Tier 1** | CEO/President/Founder/Owner/CMO/COO/Managing Director | ~25 | 3% |
| **Tier 2** | VP/Director级别 (Purchasing/Merchandising/Product/Sales) | ~45 | 5% |
| **Tier 3** | Senior Buyer/Category Manager/Procurement Manager/Buyer | ~80 | 9% |
| **待验证** | 角色信息为空或模糊 | ~690+ | 82% |

### ⚠️ 需排除的联系人（设计师角色）

以下联系人不符合目标画像，应从后续跟进中排除：

| 姓名 | 公司 | 角色 | 排除原因 |
|------|------|------|----------|
| Ceylon Lyman | Ibex Outdoor Clothing | Product Design Intern | 设计实习，无采购决策权 |
| Kai Nevers | SAM | Freelance Designer | 自由设计师，非终端客户 |
| Carson Hawkes | Talon Tide | Freelance Industrial Designer | 工业设计师，非采购角色 |
| Aidan Oddløkken | XTRATUF | Jr. Footwear Designer/Developer | 鞋类设计师，非决策人 |

**建议**: 将以上联系人标记为低优先级或从后续跟进列表中移除。

---

## 🔑 效果最佳关键词 (Top 3)

基于 outreach_data 中状态为 "Accepted" 的联系人：

| 排名 | 关键词 | 接受率 | 使用次数 |
|------|--------|--------|----------|
| 1 | `outdoor gear distributor` | 高 | 1 |
| 2 | `camping gear distributor` | 高 | 1 |
| 3 | `retail chain buyer` | 中高 | 2 |

**低效关键词**: 
- `Sales GPT ???- LinkedIn Search` (salesrobot来源，角色混杂，精准度低)
- 空关键词 (okki来源，需补充搜索策略)

---

## 📋 下一步行动（具体操作）

### 优先级 1 - Tier 1 决策人建联

1. **Backcountry** - 搜索 CEO/President/Founder
   - 搜索词: `site:linkedin.com "Backcountry" CEO OR President OR Founder`
   - 理由: 户外顶级零售商，CEO直接决定供应商合作

2. **Home Depot** - 搜索 VP Merchandising / Director Product Development
   - 搜索词: `site:linkedin.com "Home Depot" VP Merchandising outdoor`
   - 理由: 家清+户外双线切入，VP级别决策

3. **Lowe's** - 搜索 VP Merchandising Outdoor
   - 搜索词: `site:linkedin.com "Lowe's" VP Merchandising outdoor`
   - 理由: 美国第二大家居建材零售，户外品类有空间

### 优先级 2 - 欧洲/亚太国际渠道

4. **Decathlon (France HQ)** - 搜索 Global Sourcing Director
   - 搜索词: `site:linkedin.com "Decathlon" Global Director OR VP Sourcing`
   - 理由: 已联系USA Sourcing Manager，需全球总部VP推进

5. **Intersport (Austria HQ)** - 搜索 VP Purchasing / Head of Buying
   - 搜索词: `site:linkedin.com "Intersport" VP Purchasing OR Head of Buying`
   - 理由: 欧洲最大体育零售，需补强高层联系

6. **BCF/Anaconda (Australia)** - 搜索 Category Director / Head of Product
   - 搜索词: `site:linkedin.com "BCF" OR "Anaconda" Australia Director OR Head of Product`
   - 理由: 澳洲户外零售龙头，尚未开发

### 优先级 3 - 汽车配件渠道补强

7. **O'Reilly Auto Parts** - 搜索 Category Manager Automotive
   - 搜索词: `site:linkedin.com "O'Reilly" Category Manager automotive`
   - 理由: 美国第三大汽配连锁，轮胎气泵品类直接对口

---

## 📈 优化建议

### 1. 清理低质量联系人
- **okki来源**: 82个联系人中大部分角色信息为空（`"role": ""`），需重新筛选或补充职位信息
- **salesrobot来源**: 737个联系人中使用通用关键词 `Sales GPT`，导致角色混杂，建议使用精准关键词重新搜索

### 2. 排除设计师角色
- 已识别4个设计师角色联系人，建议标记为 `priority: "exclude"` 或从后续跟进中移除
- 后续搜索时添加排除词: `NOT (Designer OR "Product Design" OR "Industrial Design" OR "Creative Director")`

### 3. 数据质量提升
- 更新 `okki` 数据源的联系人角色信息
- 为 `salesrobot` 数据源补充精准关键词
- 统一使用 `keyword_used` 字段记录搜索词，便于后续分析效果

### 4. REI 避免重复建联
- REI 已在 `existing_customers` 列表中，现有联系人（Sarah Miller, Jennifer Lee, Dan Kihanya）仅作维护，不重复开发
- 重点转向竞品渠道: Bass Pro Shops, Cabela's, Dick's Sporting Goods, Backcountry

---

## 🔗 看板链接

📊 **本地看板**: [outreach_dashboard.html](file:///C:/Users/23889/.qclaw/workspace/outreach_dashboard.html)

---

## 总结

| 维度 | 现状 | 改进方向 |
|------|------|----------|
| 数据量 | 844人充足 | 质量优先于数量 |
| 画像精准度 | ~82%角色未验证 | 补充职位信息 |
| 设计师排除 | 已识别4人 | 持续监控 |
| 关键词效果 | 通用词效果差 | 精准搜索词 |
| REI避免重复 | 已标记 | 竞品渠道优先 |

**下一步重点**: 执行Tier 1决策人建联（Backcountry/Home Depot/Lowe's CEO及VP级别），提升联系人质量而非数量。
