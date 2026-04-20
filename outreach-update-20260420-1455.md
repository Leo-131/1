# Outreach数据更新报告 — v6.0
**执行时间:** 2026-04-20 14:55 (UTC+8)
**数据版本:** v15.2 | 最后一个运行: 2026-04-20 05:45:07

---

## 📊 数据概览

| 指标 | 数值 |
|------|------|
| 今日建联总数 | 25 (outreach_data批次) |
| LinkedIn总发送(累计) | ~937 |
| 接受数(Accepted) | 8 (outreach_data) + 24 (salesrobot) |
| 总联系人数 | 844 |
| 数据来源分布 | outreach_data: 25 / okki: 82 / salesrobot: 737 |

---

## 🎯 画像分布

### outreach_data (25人) — 可完整分析
| Tier | 人数 | 比例 | 接受数 |
|------|------|------|--------|
| **Tier 1** (CEO/President/Founder/Owner/CMO/COO) | 2 | 8% | 0 |
| **Tier 2** (VP/Director级别采购/产品决策层) | 7 | 28% | 4 |
| **Tier 3** (Buyer/Category Manager/Product Manager) | 8 | 32% | 4 |
| **Agent通道** (Pacific Outdoor/REI现有客户) | 4 | 16% | 0 |
| **非目标/无角色** | 4 | 16% | 0 |

**接受率: Tier 1: 0% | Tier 2: 57% | Tier 3: 50% | 整体: 32%**

### salesrobot (737人) — 角色信息缺失严重
- 有明确角色信息: ~80人 (可判断Tier)
- 角色缺失(pending): ~580人
- 角色缺失(failed): ~70人

---

## ⚠️ 需排除联系人

### 设计师角色 (必须排除)
| 姓名 | 公司 | 角色 |
|------|------|------|
| Kai Nevers | SAM | Freelance Designer ❌ |
| Carson Hawkes | Talon Tide | Freelance Industrial Designer ❌ |
| Jane Wallace-Bradley | JaneWB Brand Design | Principal Brand Designer & Founder ❌ |

### 非采购决策人 (降为低优先级)
| 姓名 | 公司 | 角色 | 问题 |
|------|------|------|------|
| Sandra Salvas | Sandra Salvas Photography | Photographer & Creative Director ❌ | 创意/设计角色 |
| Leeda D. | Urban Armor Gear | Director of Brand & Creative Operations ❌ | 品牌创意，非采购 |
| Myles Li Staples | Patagonia | Design Engineer of Advanced Concepts ❌ | 工程设计岗 |

### REI现有客户 (不重复建联)
| 姓名 | 公司 | 角色 | 状态 |
|------|------|------|------|
| Sarah Miller | REI Co-op | Category Manager - Camping | Accepted ✓ |
| Jennifer Lee | REI | Product Sourcing Manager | Accepted ✓ |

---

## 🔑 最佳关键词 (outreach_data分析)

| 排名 | 关键词 | 联系人数 | 接受数 | 接受率 |
|------|--------|----------|--------|--------|
| 🥇 | `outdoor gear distributor` | 3 | 3 | **100%** |
| 🥈 | `retail chain buyer` | 2 | 1 | 50% |
| 🥉 | `RV power solutions distributor` | 1 | 0 | 0% (样本少) |
| 4 | `CEO outdoor brand` | 1 | 0 | 0% (1人pending) |
| 5 | `camping gear distributor` | 1 | 1 | 100% (1人) |

**结论:** `outdoor gear distributor` 接受率最高(100%)，其次是 `retail chain buyer`。CEO/Founder级关键词响应率偏低(0%)，建议降低搜索频次，优先锁定VP/Director级别。

---

## 📋 下一步行动

### 立即执行 (本周)
1. **Bass Pro Shops / Cabela's** → VP Purchasing | 搜索词: `site:linkedin.com "Bass Pro" OR "Cabela" VP Purchasing OR Director Merchandising`
2. **Costco Canada** → Head of Merchandising / Senior Buyer | 搜索词: `site:linkedin.com "Costco Canada" Head of Merchandising outdoor`
3. **Lowe's** → VP Merchandising Outdoor | 搜索词: `site:linkedin.com "Lowe's" VP Merchandising outdoor camping`

### 本周跟进 (Pending催办)
4. **Camping World** → Michael Torres (VP of Merchandising) | 发送follow-up，强调RV电源+露营双线
5. **L.L.Bean** → Lisa Chang (Head of Buying) | 发送follow-up，强调Amazon Top1数据

### 数据净化 (立即清理)
6. 清理salesrobot中**角色缺失**的联系人(~650人)，优先通过邮件验证角色后再纳入活跃池

---

## 📈 优化建议

1. **暂停纯CEO/Founder关键词搜索** — 当前CEO级关键词(`CEO outdoor brand`)接受率0%，响应极低。建议将搜索重心从Tier 1转向**Tier 2 (VP/Director)**，这个层级的接受率高达57%。

2. **Role Enrichment是当务之急** — salesrobot的737人中有**~650人角色信息缺失**，这是最大的数据质量问题。建议通过以下方式快速补充：
   - 批量导出公司+姓名，通过LinkedIn API或Hunter.io补充职位
   - 或在下一次搜索时，同一关键词+`"LinkedIn" AND "buying" OR "merchandising" OR "purchasing"`做过滤

---

## 🔗 看板链接
`file:///C:/Users/23889/.qclaw/workspace/outreach_dashboard.html`

---

*报告生成: Outreach Cron v6.0 | 大神 ⚡ | 2026-04-20 14:55 UTC+8*
