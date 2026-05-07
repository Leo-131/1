# -*- coding: utf-8 -*-
import json

with open(r'C:\Users\23889\.qclaw\workspace\outreach_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

contacts = data['contacts']

# 状态统计
accepted = len([c for c in contacts if c.get('status') == 'Accepted'])
pending = len([c for c in contacts if c.get('status') == 'Pending'])
failed = len([c for c in contacts if c.get('status') == 'Failed'])
other = len(contacts) - accepted - pending - failed

print("=== 状态统计 ===")
print(f"Accepted: {accepted}")
print(f"Pending: {pending}")
print(f"Failed: {failed}")
print(f"Other: {other}")
print(f"Total: {len(contacts)}")
print()

# 设计师检测
designer_keywords = ['designer', 'graphic', 'industrial', 'creative director', 'art director', 'visual', 'photographer']
designers = []
for c in contacts:
    role = c.get('role', '').lower()
    for kw in designer_keywords:
        if kw in role:
            designers.append(c)
            break

print("=== 需排除的设计师角色 ===")
for d in designers:
    name = d.get('name', '')
    company = d.get('company', '')
    role = d.get('role', '')
    status = d.get('status', '')
    print(f"{name} | {company} | {role} | {status}")
print(f"总计需排除: {len(designers)} 人")
print()

# Tier分类
tier1_roles = ['ceo', 'president', 'founder', 'owner', 'cmo', 'coo', 'managing director', 'co-founder', 'chief']
tier2_roles = ['vp', 'vice president', 'director']
tier3_roles = ['senior buyer', 'category manager', 'procurement manager', 'purchasing manager', 'product manager', 'merchandising manager', 'buyer', 'head of buying', 'sourcing manager']

tier1, tier2, tier3, non_target = [], [], [], []
for c in contacts:
    role_lower = c.get('role', '').lower()
    if not role_lower:
        non_target.append(c)
        continue
    
    is_designer = any(kw in role_lower for kw in designer_keywords)
    if is_designer:
        continue
    
    is_t1 = any(t in role_lower for t in tier1_roles)
    is_t2 = any(t in role_lower for t in tier2_roles) and not is_t1
    is_t3 = any(t in role_lower for t in tier3_roles) and not is_t1 and not is_t2
    
    if is_t1:
        tier1.append(c)
    elif is_t2:
        tier2.append(c)
    elif is_t3:
        tier3.append(c)
    else:
        non_target.append(c)

print("=== 目标画像Tier分布 ===")
print(f"Tier 1 (CEO/Founder/CMO等): {len(tier1)} 人")
print(f"Tier 2 (VP/Director级): {len(tier2)} 人")
print(f"Tier 3 (Buyer/Category Manager级): {len(tier3)} 人")
print(f"非目标画像: {len(non_target)} 人")
print()

# 关键词效果
keyword_stats = {}
for c in contacts:
    kw = c.get('keyword_used', '')
    if kw and len(kw) > 2:
        if kw not in keyword_stats:
            keyword_stats[kw] = {'total': 0, 'accepted': 0}
        keyword_stats[kw]['total'] += 1
        if c.get('status') == 'Accepted':
            keyword_stats[kw]['accepted'] += 1

for kw in keyword_stats:
    t = keyword_stats[kw]['total']
    a = keyword_stats[kw]['accepted']
    keyword_stats[kw]['rate'] = (a/t*100) if t > 0 else 0

top_kw = sorted(keyword_stats.items(), key=lambda x: (x[1]['rate'], x[1]['total']), reverse=True)[:5]
print("=== 效果最佳关键词 Top 5 ===")
for kw, st in top_kw:
    a = st['accepted']
    t = st['total']
    r = st['rate']
    print(f"{kw}: {a}/{t} ({r:.0f}%)")
print()

# 推荐行动目标
print("=== 下一步推荐行动目标 ===")
pending_high = [c for c in contacts if c.get('status') in ['Pending', '0 out of 6', '2 out of 6'] 
                and c.get('company', '').upper() not in ['REI', 'REI CO-OP']]
for i, c in enumerate(pending_high[:10], 1):
    company = c.get('company', '')
    role = c.get('role', '')
    name = c.get('name', '')
    status = c.get('status', '')
    print(f"{i}. {company} | {role} | {name} | {status}")
