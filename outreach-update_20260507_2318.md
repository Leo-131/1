# Outreach 数据同步报告
**执行时间**: 2026-05-07 23:18 (Asia/Shanghai)
**版本**: v15.2 | Cron ID: 2828e9ed

## 数据概览
| 指标 | 数量 |
|------|------|
| 总联系人数 | 844 |
| Accepted（已接受） | 7 |
| Pending（待跟进） | 77 |
| Failed（失败） | 23 |
| 未知/进行中 | 737 |

**数据来源**: outreach_data(25) + okki(82) + salesrobot(737)

## 目标画像分析
### Tier 分布
| 画像 | 说明 |
|------|------|
| Tier 1 | CEO/President/Founder/Owner 等最终决策人 |
| Tier 2 | VP Purchasing/Merchandising/Product 等采购/产品决策层 |
| Tier 3 | Senior Buyer/Category Manager/Sourcing Manager 等采购执行者 |

### 需排除联系人 [需排除] — 设计师角色 (20人)
以下联系人为设计师职位，不符合目标画像，已标记为 [需排除]：
1. Evan BeVier @ Leidos — Distribution Design Engineer
2. Ceylon Lyman @ Ibex Outdoor Clothing — Product Design Intern
3. Kai Nevers @ SAM — Freelance Designer
4. Jackson Drake @ Utah State — Teaching Assistant - Sustainable Design & Operations
5. Aidan Oddlíkken @ XTRATUF — Jr. Footwear Designer/Developer
6. Carson Hawkes @ Talon Tide — Freelance Industrial Designer
7. Monique Wood @ Outdoor Elegance — Hospitality & Design Contract Sales
8. Myles Li Staples @ Patagonia — Design Engineer of Advanced Concepts
9. Jane Wallace-Bradley @ JaneWB Brand Design — Principal Brand Designer & Founder
10. Juliana Moskow @ Stebbins — Interior Designer & 3D Visualization Specialist
11. Rachel Bodily @ Skullcandy — CMF Product Design and Development II
12. Mavrick Robbins @ Gravity Grabber — Product Design Engineer
13. Mark Windsor @ FULL WINDSOR — Founder / Industrial Designer
14. Kathryn Scott @ HiContrast — Strategic Designer | Creative Problem Solver | Founder
15. Ethan Engemann @ Hyperlite Mountain Gear — Product Designer
16. Rachael Kranick @ Rachael Kranick Design — Senior Apparel Designer & Creative Consultant
17. Luke Stenzhorn @ IMAX — Design Director
18. Jeff Boster @ Vans — Global Footwear Designer
19. Danny Brisby @ The Castlewood Group — Design Director
20. Sheena Denmead @ Make It Better — Design Director

## 部署状态
**Git Commit**: ✅ 成功 (4ea3cc5 — 81 files changed)
**Git Push**: ❌ 失败 — 网络连接 GitHub 443 端口超时

**智能部署检查**: smart-deploy.js 首次运行，检测到文件变化，执行了 commit。Push 失败需下次重试。

## 关键数据文件 Hash（当前）
- contacts.json: 9297BA3D2284DED253AF4E7766484CAD
- daily-stats.json: 7A40721D27CD177E16884138A73909E5
- data.json: 2CE9B3589B2E41F1DE5B0801650FA7B0
- outreach_data.json: CA0F583B6C8A799453463DB9381A18A0

## 下一步行动
1. **[网络]** GitHub 443 端口连接失败，git push 被阻断。检查 VPN/代理设置，下次 cron 重试
2. **[数据]** 当前数据版本 v15.2，最后运行 2026-04-22，数据较旧
3. **[清洗]** 建议将 20 个设计师角色标记为 excluded 或降优先级
4. **[Vercel]** Push 成功后 Vercel 会自动部署新版本 dashboard
