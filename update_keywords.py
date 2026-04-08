#!/usr/bin/env python3
"""更新看板关键词为真实英文搜索词"""
import re

with open(r'C:\Users\23889\.qclaw\workspace\outreach_dashboard.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 把 keyword-chip 从中文改成真实英文关键词
replacements = [
    ('Amazon vendor', 'site:linkedin.com "Amazon" vendor manager outdoor'),
    ('Bass Pro buyer', 'site:linkedin.com "Bass Pro" buyer category manager'),
    ("Cabela's buyer", 'site:linkedin.com "Cabela\'s" senior buyer camping'),
    ("Dick's outdoor", 'site:linkedin.com "Dick\'s Sporting Goods" buyer outdoor'),
    ('Backcountry', 'site:linkedin.com "Backcountry" head of buying'),
    ('Decathlon', 'site:linkedin.com "Decathlon" USA sourcing manager'),
    ('outdoor dist.', 'site:linkedin.com outdoor distributor regional'),
    ('retail chain', 'site:linkedin.com outdoor retail chain buyer'),
    ('exclusive UK', 'site:linkedin.com UK outdoor exclusive distributor'),
    ('regional dist.', 'site:linkedin.com outdoor distributor USA regional'),
    ('national DE', 'site:linkedin.com Germany outdoor national distributor'),
    ('camping wholesale', 'site:linkedin.com camping wholesale buyer'),
    ('outdoor gear', 'site:linkedin.com outdoor gear consultant buyer'),
    ('wholesale', 'site:linkedin.com outdoor wholesale sales buyer'),
    ('sporting goods', 'site:linkedin.com sporting goods buyer outdoor'),
    ('"Camping World buyer RV accessories"', 'site:linkedin.com "Camping World" buyer RV accessories'),
]

for old_kw, new_kw in replacements:
    old = '<span class="keyword-chip">' + old_kw + '</span>'
    new = '<span class="keyword-chip">' + new_kw + '</span>'
    html = html.replace(old, new)

# 更新版本日志
vlog_old = '<div class="vlog-item"><span class="vn">v3.2</span>'
vlog_new = '''<div class="vlog-item"><span class="vn">v4.0</span> 2026-04-02 — Keywords upgraded to real English search queries</div>
      <div class="vlog-item"><span class="vn">v3.2</span>'''
html = html.replace(vlog_old, vlog_new)

# 更新标题描述
html = html.replace(
    '<p>每小时自动更新 · 4大产品线精准关键词 · 全球渠道覆盖</p>',
    '<p>Online Mode · Real English Keywords · Global Coverage · <b style="color:#34d399">LinkedIn Targeted Search</b></p>'
)

# 更新 header 版本标签
html = html.replace('<span class="pill pill-blue">v3.0</span>', '<span class="pill pill-blue">v4.0</span>')

# 更新在线标签
html = html.replace(
    '<span class="pill pill-green">🟢 运行中</span>',
    '<span class="pill pill-green">🟢 Online</span><span class="pill pill-blue">LinkedIn Keywords</span>'
)

with open(r'C:\Users\23889\.qclaw\workspace\outreach_dashboard.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Done - keywords updated to real LinkedIn search queries')
