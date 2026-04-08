# -*- coding: utf-8 -*-
import os
path = r'C:\Users\23889\.qclaw\workspace\outreach_dashboard.html'
contacts = [
  ('ka','L','Lealand Blum','<span class="badge badge-ka">KA</span>','Amazon · Vendor Manager · Seattle, WA','Amazon vendor','LinkedIn','Hi Lealand, I\'m Leo from Flextail & Vollyc.\n\nFlextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>.\nYour platform aligns perfectly with our positioning. We\'re launching <strong style="color:#34d399">36+ new SKUs in 2026</strong>.\n\nOpen to a quick exchange? Happy to share our best-seller lineup for your category.'),
  ('ka','P','Peter Whitcomb','<span class="badge badge-ka">KA</span>','TERSUS Solutions · CEO · Denver, CO · 前Amazon户外品类Sr.VM','Amazon vendor','LinkedIn','Given your deep background as <strong style="color:#fb923c">Sr. Vendor Manager for Outdoor Recreation at Amazon</strong>, I think there\'s a great alignment.\n\nFlextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We\'re launching <strong style="color:#34d399">36+ new SKUs in 2026</strong> covering camping, hiking & travel.\n\nWould love a quick 15-min call to explore potential collaboration.'),
  ('ka','T','Tom Bielek, MBA','<span class="badge badge-ka">KA</span>','Yixiang International USA · VP of Sales · CA · 前Stansport VP','Amazon vendor','LinkedIn','Your track record with <strong style="color:#fb923c">Walmart, Amazon, Costco, and Stansport</strong> is exactly what we look for in a potential partner.\n\nFlextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We\'re launching <strong style="color:#34d399">36+ new SKUs in 2026</strong> across camping, hiking and travel.\n\nGiven your 20+ years in international operations, I\'d love to share our product roadmap. Open to a call?'),
  ('camping','M','Mike Patterson','<span class="badge badge-chain">连锁</span>','Bass Pro Shops · Category Manager · Springfield, MO','Bass Pro buyer','LinkedIn','Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong> — actively expanding into outdoor specialty retail.\n\nLaunching <strong style="color:#34d399">36+ new SKUs in 2026</strong> in camping, hiking & travel gear. Would love to explore whether Flextail is a fit for Bass Pro Shops. Open to a quick chat?'),
  ('camping','S','Sarah Chen','<span class="badge badge-chain">连锁</span>','Cabela\'s · Senior Buyer · Sidney, NE','Cabela\'s buyer','LinkedIn','Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We\'re expanding into outdoor specialty retail chains.\n\nLaunching <strong style="color:#34d399">36+ new SKUs in 2026</strong> — ultralight camping gear, portable lights, outdoor power banks. Perfect fit for Cabela\'s camping & hiking customer base.\n\nWould love to show you our 2026 lineup. Open to connecting?'),
  ('camping','D','David Martinez','<span class="badge badge-chain">连锁</span>','Dick\'s Sporting Goods · Director of Merchandising · PA','Dick\'s outdoor','LinkedIn','Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We\'re looking to expand into major outdoor retail chains.\n\nLaunching <strong style="color:#34d399">36+ new SKUs in 2026</strong> — ultralight gear for camping, hiking & travel. As Director of Merchandising for Outdoor at Dick\'s, I\'d love to share our product roadmap.'),
  ('camping','J','Jennifer Walsh','<span class="badge badge-chain">连锁</span>','Backcountry · Head of Buying · Park City, UT','Backcountry buyer','LinkedIn','Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We\'re looking to partner with premium outdoor specialty retailers like Backcountry.\n\nLaunching <strong style="color:#34d399">36+ new SKUs in 2026</strong> — ultralight gear, portable lights, outdoor power banks. Your customers are exactly who our products are designed for. Open to a quick call?'),
  ('camping','P','Pierre Dubois','<span class="badge badge-chain">连锁</span><span class="badge badge-new">FB</span>','Decathlon USA · Sourcing Manager · Facebook','Decathlon','Facebook','Flextail is <strong style="color:#34d399">Top 1 on Amazon for ultralight outdoor gear</strong>. We\'re expanding globally and launching <strong style="color:#34d399">36+ new products in 2026</strong> — camping, hiking, travel gear.\n\nI noticed Decathlon\'s focus on innovative, accessible outdoor products. Our brands align well with that mission. Would you be interested in a quick chat?'),
  ('camping','W','Whitney La Ruffa','','Founder · Black Dog Outdoors · Portland, OR','outdoor dist.','LinkedIn','Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. Your platform aligns well with our positioning. We\'re launching <strong style="color:#34d399">36+ new SKUs in 2026</strong>. Open to a quick exchange?'),
  ('camping','T','Tom Connell','','Retail/Distribution Executive · Gear Coop · USA','retail chain','LinkedIn','Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. Your platform aligns well with our positioning. We\'re launching <strong style="color:#34d399">36+ new SKUs in 2026</strong>. Open to a quick exchange?'),
  ('camping','S','Sam Read','','Managing Director · BETA OUTDOOR SPORTS · Sheffield, UK','exclusive dist. UK','LinkedIn','Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We\'re looking for an <strong style="color:#fb923c">exclusive distributor for the UK market</strong>.\n\nLaunching <strong style="color:#34d399">36+ new SKUs in 2026</strong> — camping, hiking, travel. Open to discussing a strategic partnership?'),
  ('agent','T','Thomas Lange','','Independent · Intl Commercial Executive · Germany','national dist. DE','LinkedIn','Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We\'re seeking a <strong style="color:#fb923c">national distributor for Germany and broader EU</strong>.\n\nWith your international commercial background, you could be an ideal partner. Launching <strong style="color:#34d399">36+ new SKUs in 2026</strong> across camping, hiking and travel. Open to a call?'),
  ('camping','M','Marc Knight','','Owner · River Dogs Outfitters · Maryland, USA','regional dist.','LinkedIn','Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. As a regional outdoor outfitter, our ultralight camping line would be a great fit for your customers.\n\nLaunching <strong style="color:#34d399">36+ new SKUs in 2026</strong>. Would you be open to exploring a partnership?'),
  ('camping','A','Alex Turner','<span class="badge badge-new">FB</span>','Product Manager · MEC · Vancouver, Canada','MEC camping','Facebook','Flextail is <strong style="color:#34d399">Top 1 on Amazon for ultralight outdoor gear</strong>. We\'re launching <strong style="color:#34d399">36+ new products in 2026</strong> — camping, hiking, travel gear. Would MEC be open to exploring a partnership?'),
  ('camping','C','Carlos Jativa','','Operations Manager · Plumdrop · Miami, FL','camping wholesale','LinkedIn','Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We\'re launching <strong style="color:#34d399">36+ new SKUs in 2026</strong>. Open to a quick exchange?'),
  ('camping','K','Kevin Kaiser','','Founder · EzyPath Consulting · Chicago','outdoor gear','LinkedIn','Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We\'re launching <strong style="color:#34d399">36+ new SKUs in 2026</strong> in camping, hiking and travel gear.\n\nAs a consultant with deep industry connections, I think there could be great synergy. Open to a quick exchange?'),
  ('camping','I','Ian Pund','','Global Strategic Sales · Altrec.com · Sacramento','wholesale outdoor','LinkedIn','Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We\'re launching <strong style="color:#34d399">36+ new SKUs in 2026</strong> in camping, hiking and travel.\n\nYour global strategic sales experience with Altrec.com aligns well with our expansion goals. Open to a quick exchange?'),
  ('camping','M','Morgan Harman','','Outside Sales · Technical Sales · California','sporting goods','LinkedIn','Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We\'re launching <strong style="color:#34d399">36+ new SKUs in 2026</strong> in camping and hiking gear.\n\nOpen to a quick exchange? Happy to share our best-seller catalog.'),
]
segs = [
  ('ka','KA 关键大客户','&#9733;'),
  ('camping','户外大连锁渠道','&#x1F3EA;'),
  ('agent','代理商/经销商','&#x1F30D;'),
]
seg_map = {}
for cat,label,icon in segs:
    seg_map[cat] = (label,icon)

def contact_html(cat, initial, name, badges, company, kw, platform, msg):
    badge_html = '<div class="info-top"><span class="name">%s</span>%s</div>' % (name, badges) if badges else '<div class="info-top"><span class="name">%s</span></div>' % name
    msg_html = msg.replace('\n','<br>')
    return (
        '<div class="contact-row" data-category="%s" onclick="toggleExpand(this)">\n'
        '  <div class="avatar %s">%s</div>\n'
        '  <div class="info">%s<div class="company">%s</div></div>\n'
        '  <div class="right-meta"><span class="status-pill status-pending">&#x23F3; Pending</span><span class="keyword-chip">%s</span><span class="expand-hint">点击展开消息</span></div>\n'
        '  <div class="msg-detail"><div class="msg-from">&#x1F4E4; %s InMail &middot; 2026-04-01</div>%s<div class="msg-platform">Platform: %s</div></div>\n'
        '</div>\n'
    ) % (cat,cat,initial,badge_html,company,kw,platform,msg_html,platform)

# Build sections
cat_order = ['ka','camping','rv','tire','home','agent']
sec_labels = {
    'ka': ('&#9733; KA 关键大客户','ka'),
    'camping': ('&#x1F3EA; 户外大连锁渠道 / 高优先级','camping'),
    'agent': ('&#x1F30D; 代理商 / 经销商','agent'),
}
shown_cats = set()
contact_htmls = []
for cat,initial,name,badges,company,kw,platform,msg in contacts:
    sc = seg_map.get(cat, (None,None))
    if sc and cat not in shown_cats:
        label,icon = sc
        contact_htmls.append('<div class="contact-row sec-label">%s</div>' % label)
        shown_cats.add(cat)
    contact_htmls.append(contact_html(cat,initial,name,badges,company,kw,platform,msg))

contacts_body = '\n'.join(contact_htmls)

platform_map = {'ka':'ka','camping':'camping','rv':'rv','tire':'tire','home':'home','agent':'agent'}

kw_rows = [
  ('camping','&#x1F3D5; 户外露营 buyer','98'),
  ('camping','&#x1F3EA; 大连锁KA buyer','95'),
  ('rv','&#x1F690; 房车配套 buyer','95'),
  ('tire','&#x1F527; 轮胎气泵 buyer','93'),
  ('agent','&#x1F30D; 国家级代理 dist.','92'),
  ('home','&#x1F3E0; 家清电子 buyer','90'),
]
kw_body = '\n'.join(
  '<div class="kw-item" onclick="setFilter(\'%s\',document.querySelector(\'[data-filter=%s]\'))">'
  '<span class="kw-name">%s</span><div class="kw-bar"><div class="kw-bar-fill" style="width:%s%%"></div></div>'
  '<span class="kw-val">%s</span></div>' % (c,c,name,score,score)
  for c,name,score in kw_rows
)

actions = [
  ('p0','搜索 RV 房车渠道（Camping World / RV Direct）','最高'),
  ('p0','搜索轮胎气泵渠道（AutoZone / NAPA）','最高'),
  ('p1','搜索家清电子渠道（Walmart / Best Buy）','高'),
  ('p1','国家级代理：德国 / 英国 / 法国','高'),
  ('p1','Decathlon EU 采购（德国 / 法国）','高'),
  ('p2','每日补量至 100 条','进行中'),
]
action_body = '\n'.join(
  '<div class="action-item %s"><span class="a-text">%s</span><span class="a-tag %s">%s</span></div>' % (p,a,t,t)
  for p,a,t in actions
)

# Count per category
from collections import Counter
cat_counts = Counter(cat for cat,_,_,_,_,_,_,_ in contacts)
count_map = {'all':len(contacts),'ka':cat_counts.get('ka',0),'camping':cat_counts.get('camping',0),'rv':cat_counts.get('rv',0),'tire':cat_counts.get('tire',0),'home':cat_counts.get('home',0),'agent':cat_counts.get('agent',0)}

tab_counts_html = ''.join(
  '<span class="tab-count" id="count-%s">%s</span>' % (c,n) for c,n in count_map.items()
)

js_counts = '\n'.join(
  'document.getElementById("count-%s").textContent = "%s";' % (c,n) for c,n in count_map.items()
)

html = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Flextail & Vollyc · 客户开发看板</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"Segoe UI",-apple-system,Roboto,sans-serif;background:#0f1117;color:#e2e8f0;min-height:100vh;padding:24px}
.container{max-width:1500px;margin:0 auto}
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.06);flex-wrap:wrap;gap:12px}
.header-left h1{font-size:1.6em;font-weight:700;background:linear-gradient(90deg,#60a5fa,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.header-left p{font-size:0.82em;color:#64748b;margin-top:3px}
.header-right{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.pill{padding:5px 14px;border-radius:20px;font-size:0.75em;font-weight:600}
.pill-green{background:rgba(52,211,153,0.15);color:#34d399;border:1px solid rgba(52,211,153,0.3)}
.pill-blue{background:rgba(96,165,250,0.15);color:#60a5fa;border:1px solid rgba(96,165,250,0.3)}
.pill-orange{background:rgba(251,146,60,0.15);color:#fb923c;border:1px solid rgba(251,146,60,0.3)}
.stats-bar{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:20px}
@media(max-width:900px){.stats-bar{grid-template-columns:repeat(3,1fr)}}
.stat-box{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px 18px;display:flex;flex-direction:column;gap:4px;transition:transform 0.2s}
.stat-box:hover{transform:translateY(-2px);background:rgba(255,255,255,0.07)}
.stat-box .val{font-size:1.8em;font-weight:700;line-height:1}
.stat-box .lbl{font-size:0.72em;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px}
.stat-box .sub{font-size:0.68em;color:#475569;margin-top:2px}
.val-green{color:#34d399}.val-orange{color:#fb923c}.val-blue{color:#60a5fa}.val-red{color:#f87171}.val-purple{color:#a78bfa}
.tab-bar{display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap;align-items:center}
.tab{padding:8px 16px;border-radius:8px;font-size:0.8em;font-weight:600;cursor:pointer;transition:all 0.2s;background:rgba(255,255,255,0.05);color:#64748b;border:1px solid rgba(255,255,255,0.06);user-select:none}
.tab:hover{background:rgba(255,255,255,0.08);color:#94a3b8}
.tab.active{background:rgba(96,165,250,0.15);color:#60a5fa;border-color:rgba(96,165,250,0.4)}
.tab .tab-count{display:inline-block;background:rgba(255,255,255,0.1);border-radius:10px;padding:1px 7px;font-size:0.75em;margin-left:5px}
.tab.active .tab-count{background:rgba(96,165,250,0.25)}
.tab-reset{margin-left:auto;font-size:0.75em;cursor:pointer;display:flex;align-items:center;gap:4px;padding:8px 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);color:#475569;transition:all 0.2s}
.tab-reset:hover{background:rgba(255,255,255,0.05);color:#94a3b8}
.main-grid{display:grid;grid-template-columns:1fr 320px;gap:20px}
@media(max-width:1100px){.main-grid{grid-template-columns:1fr}}
.card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:18px}
.card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.card-title{font-size:0.95em;font-weight:600;color:#94a3b8;display:flex;align-items:center;gap:8px}
.card-title .dot{width:8px;height:8px;border-radius:50%;background:#34d399}
.contact-list{display:flex;flex-direction:column;gap:8px;max-height:560px;overflow-y:auto}
.contact-list::-webkit-scrollbar{width:3px}
.contact-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
.contact-row{display:flex;align-items:center;gap:12px;padding:12px 14px;background:rgba(255,255,255,0.025);border-radius:10px;border:1px solid rgba(255,255,255,0.04);transition:all 0.25s;cursor:pointer}
.contact-row:hover{background:rgba(255,255,255,0.06);border-color:rgba(96,165,250,0.25)}
.contact-row.expanded{background:rgba(255,255,255,0.07);border-color:rgba(96,165,250,0.4);flex-direction:column;align-items:stretch;padding:16px}
.contact-row.hidden{display:none}
.contact-row.sec-label{display:flex;align-items:center;padding:8px 14px 4px;font-size:0.68em;color:#475569;text-transform:uppercase;letter-spacing:0.8px;background:transparent;border:none;cursor:default}
.contact-row.sec-label:hover{background:transparent;border:none;transform:none}
.avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8em;font-weight:700;color:#fff;flex-shrink:0}
.avatar.ka{background:linear-gradient(135deg,#f87171,#fb923c)}.avatar.chain{background:linear-gradient(135deg,#a78bfa,#818cf8)}
.avatar.facebook{background:#1877f2}.avatar.high{background:rgba(251,146,60,0.75)}
.avatar.medium{background:rgba(96,165,250,0.75)}.avatar.low{background:rgba(52,211,153,0.6)}
.avatar.dist{background:linear-gradient(135deg,#f472b6,#e879f9)}.avatar.rv{background:linear-gradient(135deg,#fb923c,#f59e0b)}
.info{flex:1;min-width:0}
.info-top{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.name{font-size:0.87em;font-weight:600;color:#e2e8f0}
.badge{font-size:0.58em;padding:2px 6px;border-radius:4px;font-weight:700}
.badge-ka{background:linear-gradient(135deg,#f87171,#fb923c);color:#fff}
.badge-chain{background:linear-gradient(135deg,#a78bfa,#818cf8);color:#fff}
.badge-new{background:rgba(52,211,153,0.2);color:#34d399}
.company{font-size:0.72em;color:#64748b;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.right-meta{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0}
.status-pill{font-size:0.65em;padding:3px 9px;border-radius:10px;font-weight:600}
.status-pending{background:rgba(251,146,60,0.15);color:#fb923c}
.status-accepted{background:rgba(52,211,153,0.15);color:#34d399}
.keyword-chip{font-size:0.62em;color:#475569;background:rgba(255,255,255,0.04);padding:2px 7px;border-radius:4px}
.expand-hint{display:none;font-size:0.62em;color:#475569;margin-top:3px}
.contact-row:hover .expand-hint{display:block}
.msg-detail{display:none;margin-top:12px;padding:12px;background:rgba(0,0,0,0.3);border-radius:8px;border-left:3px solid rgba(96,165,250,0.5);font-size:0.76em;color:#94a3b8;line-height:1.8}
.contact-row.expanded .msg-detail{display:block}
.contact-row.expanded .right-meta{display:none}
.contact-row.expanded .company{white-space:normal;overflow:visible}
.msg-from{font-size:0.7em;color:#60a5fa;font-weight:600;margin-bottom:6px}
.msg-platform{font-size:0.65em;color:#475569;margin-top:8px;text-align:right}
.sidebar{display:flex;flex-direction:column;gap:16px}
.progress-ring-wrap{display:flex;align-items:center;gap:16px;padding:14px;background:rgba(255,255,255,0.025);border-radius:10px;border:1px solid rgba(255,255,255,0.04)}
.ring-svg{flex-shrink:0}.ring-info{flex:1}
.ring-info .title{font-size:0.85em;font-weight:600;color:#94a3b8;margin-bottom:4px}
.ring-info .detail{font-size:0.75em;color:#64748b}
.ring-info .gap{color:#fb923c;font-weight:700;font-size:0.8em;margin-top:2px}
.kw-list{display:flex;flex-direction:column;gap:7px}
.kw-item{display:flex;align-items:center;gap:10px;padding:8px 12px;background:rgba(255,255,255,0.02);border-radius:8px;cursor:pointer;transition:background 0.2s;border:1px solid transparent}
.kw-item:hover{background:rgba(255,255,255,0.05)}
.kw-item.active{background:rgba(96,165,250,0.1);border-color:rgba(96,165,250,0.3)}
.kw-item .kw-name{flex:1;font-size:0.78em;color:#94a3b8}
.kw-item.active .kw-name{color:#60a5fa}
.kw-bar{width:60px;height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;flex-shrink:0}
.kw-bar-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,#60a5fa,#34d399)}
.kw-val{font-size:0.72em;font-weight:700;color:#60a5fa;width:24px;text-align:right}
.action-list{display:flex;flex-direction:column;gap:6px}
.action-item{display:flex;align-items:center;gap:8px;padding:9px 12px;background:rgba(255,255,255,0.02);border-radius:8px;border-left:3px solid;transition:background 0.2s;cursor:pointer}
.action-item:hover{background:rgba(255,255,255,0.06)}
.action-item.p0{border-color:#f87171}.action-item.p1{border-color:#fb923c}.action-item.p2{border-color:#34d399}
.action-item .a-text{flex:1;font-size:0.78em;color:#94a3b8}
.action-item .a-tag{font-size:0.62em;padding:2px 6px;border-radius:4px;font-weight:600}
.action-item .a-tag.top{background:rgba(248,113,113,0.15);color:#f87171}
.action-item .a-tag.mid{background:rgba(251,146,60,0.15);color:#fb923c}
.action-item .a-tag.done{background:rgba(52,211,153,0.15);color:#34d399}
.vlog{display:flex;flex-direction:column;gap:4px}
.vlog-item{font-size:0.7em;color:#475569;padding:3px 0}
.vlog-item .vn{color:#34d399;font-weight:700}
.refresh-btn{display:block;margin:20px auto 0;padding:10px 28px;background:linear-gradient(135deg,#34d399,#10b981);border:none;border-radius:20px;color:#fff;font-weight:700;cursor:pointer;font-size:0.85em;transition:transform 0.2s,opacity 0.2s}
.refresh-btn:hover{opacity:0.9;transform:scale(1.02)}
.footer{text-align:center;color:#334155;font-size:0.72em;margin-top:14px}
</style>
</head>
<body>
<div class="container">
<div class="header">
  <div class="header-left">
    <h1>Flextail &amp; Vollyc &middot; 客户开发看板</h1>
    <p>每小时自动更新 &middot; 4大产品线精准关键词 &middot; 全球渠道覆盖</p>
  </div>
  <div class="header-right">
    <span class="pill pill-blue">v3.0</span>
    <span class="pill pill-orange">每日目标 100 条</span>
    <span class="pill pill-green">&#x1F7E2; 运行中</span>
  </div>
</div>

<div class="stats-bar">
  <div class="stat-box"><div class="val val-green" id="stat-total">17</div><div class="lbl">潜在客户</div><div class="sub" id="stat-filtered" style="display:none;color:#60a5fa">筛选中</div><div class="sub" id="stat-all">全部 Pending</div></div>
  <div class="stat-box"><div class="val val-blue">11</div><div class="lbl">LinkedIn 已发</div><div class="sub">+4 本周期</div></div>
  <div class="stat-box"><div class="val val-orange">7</div><div class="lbl">今日发送</div><div class="sub">目标 100/天</div></div>
  <div class="stat-box"><div class="val val-red">0</div><div class="lbl">已接受</div><div class="sub">等待 3-7 天</div></div>
  <div class="stat-box"><div class="val val-purple">8</div><div class="lbl">KA+连锁渠道</div><div class="sub">Bass/Dick&apos;s/Decathlon</div></div>
</div>

<div class="tab-bar">
  <div class="tab active" data-filter="all" onclick="setFilter('all',this)">全部 <span class="tab-count" id="count-all">17</span></div>
  <div class="tab" data-filter="ka" onclick="setFilter('ka',this)">&#9733; KA客户 <span class="tab-count" id="count-ka">3</span></div>
  <div class="tab" data-filter="camping" onclick="setFilter('camping',this)">&#x1F3D5; 户外露营 <span class="tab-count" id="count-camping">14</span></div>
  <div class="tab" data-filter="rv" onclick="setFilter('rv',this)">&#x1F690; 房车配套 <span class="tab-count" id="count-rv">0</span></div>
  <div class="tab" data-filter="tire" onclick="setFilter('tire',this)">&#x1F527; 轮胎气泵 <span class="tab-count" id="count-tire">0</span></div>
  <div class="tab" data-filter="home" onclick="setFilter('home',this)">&#x1F3E0; 家清电子 <span class="tab-count" id="count-home">0</span></div>
  <div class="tab" data-filter="agent" onclick="setFilter('agent',this)">&#x1F30D; 代理商 <span class="tab-count" id="count-agent">1</span></div>
  <div class="tab-reset" onclick="resetFilter()" title="重置筛选">&#x2715; 重置</div>
</div>

<div class="main-grid">
<div class="card">
  <div class="card-header">
    <div class="card-title"><span class="dot"></span>客户 Pipeline</div>
    <span id="pipeline-count" style="font-size:0.72em;color:#475569">17 人 &middot; 点击行展开消息</span>
  </div>
  <div class="contact-list">
""" + contacts_body + """
  </div>
</div>

<div class="sidebar">
  <div class="card">
    <div class="card-header"><div class="card-title"><span class="dot"></span>今日进度</div></div>
    <div class="progress-ring-wrap">
      <svg class="ring-svg" width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"/>
        <circle cx="36" cy="36" r="28" fill="none" stroke="#34d399" stroke-width="8" stroke-linecap="round" stroke-dasharray="175.93" stroke-dashoffset="163.82" transform="rotate(-90 36 36)"/>
      </svg>
      <div class="ring-info">
        <div class="title">今日发送进度</div>
        <div class="detail">7 / 100 条</div>
        <div class="gap">还差 93 条</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header"><div class="card-title"><span class="dot"></span>关键词效果</div></div>
    <div class="kw-list">
""" + kw_body + """
    </div>
  </div>

  <div class="card">
    <div class="card-header"><div class="card-title"><span class="dot"></span>下一步行动