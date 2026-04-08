#!/usr/bin/env python3
"""更新看板，添加新客户"""
import re

# 读取现有HTML
with open(r'C:\Users\23889\.qclaw\workspace\outreach_dashboard.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 新客户数据
new_customers = '''
    <div class="contact-row" data-category="rv" onclick="toggleExpand(this)">
      <div class="avatar ka">J</div>
      <div class="info"><div class="info-top"><span class="name">Justin Hartwig</span><span class="badge badge-ka">KA</span></div><div class="company">Camping World · Senior Buyer · Lakeville, MN</div></div>
      <div class="right-meta"><span class="status-pill status-pending">⏳ Pending</span><span class="keyword-chip">"Camping World buyer RV accessories"</span><span class="expand-hint">点击展开</span></div>
      <div class="msg-detail">Hi Justin, Flextail is <b style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</b>. Our portable pumps and camping gear are <b style="color:#fb923c">perfect for RV enthusiasts</b>. Launching <b style="color:#34d399">36+ new SKUs in 2026</b>. Would love to discuss placement at Camping World.</div>
    </div>

    <div class="contact-row" data-category="rv" onclick="toggleExpand(this)">
      <div class="avatar chain">J</div>
      <div class="info"><div class="info-top"><span class="name">Johanna Mills Shaughnessy</span><span class="badge badge-chain">连锁</span></div><div class="company">E-Commerce & Retail Merchandising · Minneapolis · 前Camping World Buyer</div></div>
      <div class="right-meta"><span class="status-pill status-pending">⏳ Pending</span><span class="keyword-chip">"Camping World buyer RV accessories"</span><span class="expand-hint">点击展开</span></div>
      <div class="msg-detail">Hi Johanna, your background as <b style="color:#fb923c">Buyer/Product Manager for Camping & RV at Camping World</b> is exactly what we're looking for. Flextail is <b style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</b>. Open to a conversation?</div>
    </div>

    <div class="contact-row" data-category="rv" onclick="toggleExpand(this)">
      <div class="avatar chain">T</div>
      <div class="info"><div class="info-top"><span class="name">Terry Graham</span><span class="badge badge-chain">连锁</span></div><div class="company">Procurement Manager Parts & Service · Bowling Green, KY · 前Camping World Sr Buyer</div></div>
      <div class="right-meta"><span class="status-pill status-pending">⏳ Pending</span><span class="keyword-chip">"Camping World buyer RV accessories"</span><span class="expand-hint">点击展开</span></div>
      <div class="msg-detail">Hi Terry, given your experience as <b style="color:#fb923c">Senior Buyer at Camping World and Good Sam</b>, I think there's great synergy. Flextail is <b style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</b>. Our portable pumps are ideal for RV & camping. Open to a call?</div>
    </div>

    <div class="contact-row" data-category="rv" onclick="toggleExpand(this)">
      <div class="avatar ka">P</div>
      <div class="info"><div class="info-top"><span class="name">Peter Jelinek</span><span class="badge badge-ka">KA</span></div><div class="company">VP Merchandising-Officer · Rogers, AR · 前Camping World SVP</div></div>
      <div class="right-meta"><span class="status-pill status-pending">⏳ Pending</span><span class="keyword-chip">"Camping World buyer RV accessories"</span><span class="expand-hint">点击展开</span></div>
      <div class="msg-detail">Hi Peter, your role as <b style="color:#fb923c">SVP Retail and Strategy at Camping World</b> overseeing Gander Outdoors, Overton's, and Camping World is impressive. Flextail is <b style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</b>. Would love to discuss a strategic partnership.</div>
    </div>

    <div class="contact-row" data-category="rv" onclick="toggleExpand(this)">
      <div class="avatar high">R</div>
      <div class="info"><div class="info-top"><span class="name">RENEE GILLIS</span></div><div class="company">Product Manager / RV Consultant · Granger, IN · 前Thor Motor Coach</div></div>
      <div class="right-meta"><span class="status-pill status-pending">⏳ Pending</span><span class="keyword-chip">"Camping World buyer RV accessories"</span><span class="expand-hint">点击展开</span></div>
      <div class="msg-detail">Hi Renee, as a <b style="color:#fb923c">Product Manager and RV Consultant</b> with experience at Thor Motor Coach, you understand the RV market deeply. Flextail is <b style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</b>. Our portable pumps are perfect for RV applications. Open to exploring collaboration?</div>
    </div>
'''

# 找到最后一个 contact-row (Morgan Harman)
insert_marker = '    <div class="contact-row" data-category="camping" onclick="toggleExpand(this)">\n      <div class="avatar low">M</div>'
insert_point = html.find(insert_marker)
if insert_point > 0:
    # 找到这个 contact-row 的结束位置
    end_marker = '\n  </div>\n</div>\n\n<div class="sidebar">'
    end_point = html.find(end_marker, insert_point)
    if end_point > 0:
        html = html[:end_point] + new_customers + html[end_point:]

# 更新统计数据
html = re.sub(r'<div class="val v-green" id="stat-total">17</div>', '<div class="val v-green" id="stat-total">22</div>', html)
html = re.sub(r'全部 <span class="tab-count">17</span>', '全部 <span class="tab-count">22</span>', html)
html = re.sub(r'🚐 房车 <span class="tab-count">1</span>', '🚐 房车 <span class="tab-count">5</span>', html)

# 更新版本日志
vlog_old = '<div class="vlog-item"><span class="vn">v3.1</span>'
vlog_new = '<div class="vlog-item"><span class="vn">v3.2</span> 2026-04-02 15:45 — 新增 5 位 Camping World RV 渠道客户</div>\n      <div class="vlog-item"><span class="vn">v3.1</span>'
html = html.replace(vlog_old, vlog_new)

# 更新今日发送数
html = re.sub(r'<div class="detail">7 / 100 条</div>', '<div class="detail">12 / 100 条</div>', html)
html = re.sub(r'<div class="gap">还差 93 条</div>', '<div class="gap">还差 88 条</div>', html)
html = re.sub(r'stroke-dashoffset="140.2"', 'stroke-dashoffset="137.4"', html)

# 写回文件
with open(r'C:\Users\23889\.qclaw\workspace\outreach_dashboard.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Dashboard updated: +5 new Camping World RV contacts')
print('Total contacts: 22')
print('RV category: 5')
