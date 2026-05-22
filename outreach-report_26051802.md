# Outreach数据更新报告 v26051802
**时间**: 2026-05-18 18:00 (Asia/Shanghai)  
**版本**: 26051801 → 26051802

---

## 📊 数据概览
| 指标 | 数值 |
|------|------|
| 总联系人 | 844 |
| Accepted | 7 |
| Pending | 77 |
| Failed | 23 |
| SalesRobot活跃(>0) | 70 |
| SalesRobot未开始(0/N) | 667 |

## 🎯 Tier分布
| Tier | 数量 | 说明 |
|------|------|------|
| Tier 1 | 125 | CEO/Founder/Owner/CMO |
| Tier 2 | 12 | VP/Director采购层 |
| Tier 3 | 32 | Buyer/Category Manager |
| 未分类 | 675 | 角色为空或非目标岗位 |

## 🚫 需排除联系人 (20人设计师角色)
- Ceylon Lyman (Ibex Outdoor Clothing) - Product Design Intern
- Kai Nevers (SAM) - Freelance Designer
- Aidan Oddløkken (XTRATUF) - Jr. Footwear Designer/Developer
- Carson Hawkes (Talon Tide) - Freelance Industrial Designer
- Sandra Salvas - Photographer & Creative Director
- Jane Wallace-Bradley - Principal Brand Designer & Founder
- Michelle Maben - Global Creative Director
- Juliana Moskow - Interior Designer
- Deborah Norman - Freelance Creative Director
- Jennifer Scruton (Vans) - Creative Director
- Kiryn Clay - Creative Director
- Paul Butterfield - Creative Director
- Mark Windsor (FULL WINDSOR) - Founder / Industrial Designer
- Kathryn Scott (HiContrast) - Strategic Designer & Founder
- MARS OUTDOOR - Founder/Creative director
- Ethan Engemann (Hyperlite Mountain Gear) - Product Designer
- Rachael Kranick - Senior Apparel Designer
- Paige Smith (686) - Creative Director
- Tiffany Lam (Riot Games) - Principal Creative Director
- Jeff Boster (Vans) - Global Footwear Designer

## 🚫 非目标角色 (22人, 如HR/摄影师/顾问等)
- Ashley Jackson - Human Resources Manager
- Elizabeth Wigle - Talent Acquisition Manager
- Phil Kaplan - Retired
- Karson Chugg - Flooring Installer
- Bernice Li - MBA Leadership Development Program Manager
- 等17人

## 📦 部署状态
- **已跳过** - dashboard文件无实际变化(combined hash匹配),无需重新部署Vercel
- Hash: 60d8cde455520c685e9b4043fbf75a3a (未变)

## ⚡ 关键发现
1. **SalesRobot 89%联系人未激活** (667/737 status=0), 建议加速campaign
2. **Tier分布严重偏斜**: 675人无角色信息(80%), 需补充role数据
3. **设计师排除**: 20人需标记排除, 另22人非采购决策角色
4. **okki渠道质量低**: 82人中23人Failed(28%失败率), 多为无关行业

## 🔜 下一步行动
1. 给20个设计师+22个非目标联系人标记 `[需排除]`
2. 给675个空角色SalesRobot联系人补充role信息
3. 加速SalesRobot未激活campaign (667人)
4. 重点跟进Tier1中status>0的联系人(约35人)
