# -*- coding: utf-8 -*-
import sys
path = r'C:\Users\23889\.qclaw\workspace\outreach_dashboard.html'

contacts = [
  ('ka','L','Lealand Blum','<span class="badge badge-ka">KA</span>','Amazon Vendor Manager','Amazon vendor','LinkedIn','Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We are launching <strong style="color:#34d399">36+ new SKUs in 2026</strong>. Open to a quick exchange?'),
  ('ka','P','Peter Whitcomb','<span class="badge badge-ka">KA</span>','TERSUS CEO / ex-Amazon Sr.VM','Amazon vendor','LinkedIn','Given your background as <strong style="color:#fb923c">Sr. Vendor Manager for Outdoor at Amazon</strong>, there is great alignment. Flextail is <strong style="color:#34d399">Top 1</strong>. Launching <strong style="color:#34d399">36+ new SKUs in 2026</strong>. 15-min call?'),
  ('ka','T','Tom Bielek','<span class="badge badge-ka">KA</span>','Yixiang Intl VP Sales / ex-Stansport','Amazon vendor','LinkedIn','Your track record with <strong style="color:#fb923c">Walmart, Amazon, Costco</strong> is what we look for. Flextail <strong style="color:#34d399">Top 1 Amazon</strong>. 36+ new SKUs 2026. Open to a call?'),
  ('camping','M','Mike Patterson','<span class="badge badge-chain">连锁</span>','Bass Pro Shops Category Manager','Bass Pro buyer','LinkedIn','Flextail is <strong style="color:#34d399">Top 1 Amazon in ultralight outdoor electronics</strong>. Expanding into outdoor specialty retail. 36+ new SKUs 2026. Fit for Bass Pro Shops?'),
  ('camping','S','Sarah Chen','<span class="badge badge-chain">连锁</span>','Cabela\'s Senior Buyer','Cabela\'s buyer','LinkedIn','Flextail <strong style="color:#34d399">Top 1 Amazon</strong>. 36+ new SKUs 2026 - ultralight camping gear, portable lights. Perfect for Cabela\'s camping customers. Open to connecting?'),
  ('camping','D','David Martinez','<span class="badge badge-chain">连锁</span>','Dick\'s Sporting Goods Director','Dick\'s outdoor','LinkedIn','Flextail <strong style="color:#34d399">Top 1 Amazon</strong>. Expanding into major outdoor retail. 36+ new SKUs 2026. Love to share our roadmap for Dick\'s outdoor category.'),
  ('camping','J','Jennifer Walsh','<span class="badge badge-chain">连锁</span>','Backcountry Head of Buying','Backcountry buyer','LinkedIn','Flextail <strong style="color:#34d399">Top 1 Amazon</strong>. Partnering with premium outdoor retailers. 36+ new SKUs 2026. Your customers are exactly who our gear is designed for.'),
  ('camping','P','Pierre Dubois','<span class="badge badge-chain">连锁</span><span class="badge badge-new">FB</span>','Decathlon USA Sourcing Manager','Decathlon','Facebook','Flextail <strong style="color:#34d399">Top 1 Amazon ultralight outdoor gear</strong>. Expanding globally. 36+ new products 2026. Decathlon\'s mission aligns with our brands. Quick chat?'),
  ('camping','W','Whitney La Ruffa','','Founder Black Dog Outdoors Portland','outdoor dist.','LinkedIn','Flextail <strong style="color:#34d399">Top 1 Amazon</strong>. 36+ new SKUs 2026. Your platform aligns well. Open to a quick exchange?'),
  ('camping','T2','Tom Connell','','Gear Coop Distribution Executive','retail chain','LinkedIn','Flextail <strong style="color:#34d399">Top 1 Amazon</strong>. 36+ new SKUs 2026. Your distribution network aligns with our expansion. Open to a quick exchange?'),
  ('camping','S2','Sam Read','','BETA OUTDOOR SPORTS Managing Director UK','exclusive dist. UK','LinkedIn','Flextail <strong style="color:#34d399">Top 1 Amazon</strong>. Seeking <strong style="color:#fb923c">exclusive UK distributor</strong>. 36+ new SKUs 2026. Strategic partnership?'),
  ('agent','T2','Thomas Lange','','Intl Commercial Executive Germany','national dist. DE','LinkedIn','Flextail <strong style="color:#34d399">Top 1 Amazon</strong>. Seeking <strong style="color:#fb923c">national EU distributor</strong>. 36+ new SKUs 2026 across camping, hiking. Open to a call?'),
  ('camping','M2','Marc Knight','','River Dogs Outfitters Owner Maryland','regional dist.','LinkedIn','Flextail <strong style="color:#34d399">Top 1 Amazon</strong>. Ultralight camping gear great fit for your regional outfitter customers. 36+ new SKUs 2026. Partnership?'),
  ('camping','A2','Alex Turner','<span class="badge badge-new">FB</span>','MEC Product Manager Vancouver','MEC camping','Facebook','Flextail <strong style="color:#34d399">Top 1 Amazon ultralight gear</strong>. 36+ new products 2026. MEC open to exploring a partnership?'),
  ('camping','C2','Carlos Jativa','','Plumdrop Operations Manager Miami','camping wholesale','LinkedIn','Flextail <strong style="color:#34d399">Top 1 Amazon</strong>. 36+ new SKUs 2026. Open to a quick exchange?'),
  ('camping','K2','Kevin Kaiser','','EzyPath Consulting Founder Chicago','outdoor gear','LinkedIn','Flextail <strong style="color:#34d399">Top 1 Amazon</strong>. 36+ new SKUs 2026. Great synergy potential. Open to a quick exchange?'),
  ('camping','I2','Ian Pund','','Altrec.com Global Strategic Sales','wholesale outdoor','LinkedIn','Flextail <strong style="color:#34d399">Top 1 Amazon</strong>. 36+ new SKUs 2026. Your global sales experience aligns with our expansion goals.'),
  ('camping','Mo','Morgan Harman','','Technical Sales California','sporting goods','LinkedIn','Flextail <strong style="color:#34d399">Top 1 Amazon</strong>. 36+ new SKUs 2026 in camping/hiking gear. Happy to share catalog.'),
]

from collections import Counter
cat_cnt = Counter(c for c,_,_,_,_,_,_,_ in contacts)
total = len(contacts)

def r(cat,initial,name,badges,company,kw,platform,msg):
    if badges:
        bh = '<div class="info-top"><span class="name">%s</span>%s</div>' % (name,badges)
    else:
        bh = '<div class="info-top"><span class="name">%s</span></div>' % name
    return (
        '<div class="contact-row" data-category="%s" onclick="toggleExpand(this)">'
        '<div class="avatar %s">%s</div>'
        '<div class="info">%s<div class="company">%s</div></div>'
        '<div class="right-meta"><span class="status-pill status-pending">Pending</span><span class="keyword-chip">%s</span><span class="expand-hint">展开</span></div>'
        '<div class="msg-detail"><div class="msg-from">%s InMail</div>%s<div class="msg-platform">Platform: %s</div></div>'
        '</div>'
    ) % (cat,cat,initial,bh,company,kw,platform,msg,platform)

secs = [('ka','KA 关键大客户'),('camping','户外露营 / 高优先级'),('agent','代理商 / 经销商')]
shown=set()
rows=[]
for cat,initial,name,badges,company,kw,platform,msg in contacts:
    if cat not in shown:
        rows.append('<div class="contact-row sec-label">%s</div>' % dict(secs).get(cat,''))
        shown.add(cat)
    rows.append(r(cat,initial,name,badges,company,kw,platform,msg))

contact_body = '\n'.join(rows)

kws = [
  ('camping','Outdoor camping buyer','98'),
  ('camping','Chain store KA buyer','95'),
  ('rv','RV accessories buyer','95'),
  ('tire','Tire inflator buyer','93'),
  ('agent','National distributor','92'),
  ('home','Home cleaning 3C buyer','90'),
]
kw_body = ''.join(
  '<div class="kw-item" onclick="setFilter(\'%s\',document.querySelector(\'[data-filter=%s]\'))"><span class="kw-name">%s</span><div class="kw-bar"><div class="kw-bar-fill" style="width:%s%%%%"></div></div><span class="kw-val">%s</span></div>' % (c,c,n,s,s)
  for c,n,s in kws
)
actions = [
  ('p0','Search RV channels (Camping World / RV Direct)','最高'),
  ('p0','Search tire inflator channels (AutoZone / NAPA)','最高'),
  ('p1','Search home cleaning 3C channels (Walmart / Best Buy)','高'),
  ('p1','National agents: DE / UK / FR','高'),
  ('p1','Decathlon EU buyers (DE / FR)','高'),
  ('p2','Daily outreach to 100/day','进行中'),
]
act_body = ''.join(
  '<div class="action-item %s"><span class="a-text">%s</span><span class="a-tag %s">%s</span></div>' % (p,a,t,t)
  for p,a,t in actions
)

html = (
'<!DOCTYPE html>\n'
'<html lang="zh-CN">\n'
'<head>\n'
'<meta charset="UTF-8">\n'
'<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
'<title>Flextail & Vollyc - 客户开发看板</title>\n'
'<style>\n'
'*{margin:0;padding:0;box-sizing:border-box}\n'
'body{font-family:"Segoe UI",-apple-system,Roboto,sans-serif;background:#0f1117;color:#e2e8f0;min-height:100vh;padding:24px}\n'
'.container{max-width:1500px;margin:0 auto}\n'
'.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.06);flex-wrap:wrap;gap:12px}\n'
'.header-left h1{font-size:1.6em;font-weight:700;background:linear-gradient(90deg,#60a5fa,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent}\n'
'.header-left p{font-size:0.82em;color:#64748b;margin-top:3px}\n'
'.header-right{display:flex;gap:10px;align-items:center;flex-wrap:wrap}\n'
'.pill{padding:5px 14px;border-radius:20px;font-size:0.75em;font-weight:600}\n'
'.pill-green{background:rgba(52,211,153,0.15);color:#34d399;border:1px solid rgba(52,211,153,0.3)}\n'
'.pill-blue{background:rgba(96,165,250,0.15);color:#60a5fa;border:1px solid rgba(96,165,250,0.3)}\n'
'.pill-orange{background:rgba(251,146,60,0.15);color:#fb923c;border:1px solid rgba(251,146,60,0.3)}\n'
'.stats-bar{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:20px}\n'
'@media(max-width:900px){.stats-bar{grid-template-columns:repeat(3,1fr)}}\n'
'.stat-box{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px 18px;display:flex;flex-direction:column;gap:4px;transition:transform 0.2s}\n'
'.stat-box:hover{transform:translateY(-2px);background:rgba(255,255,255,0.07)}\n'
'.stat-box .val{font-size:1.8em;font-weight:700;line-height:1}\n'
'.stat-box .lbl{font-size:0.72em;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px}\n'
'.stat-box .sub{font-size:0.68em;color:#475569;margin-top:2px}\n'
'.val-green{color:#34d399}.val-orange{color:#fb923c}.val-blue{color:#60a5fa}.val-red{color:#f87171}.val-purple{color:#a78bfa}\n'
'.tab-bar{display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap;align-items:center}\n'
'.tab{padding:8px 16px;border-radius:8px;font-size:0.8em;font-weight:600;cursor:pointer;transition:all 0.2s;background:rgba(255,255,255,0.05);color:#64748b;border:1px solid rgba(255,255,255,0.06);user-select:none}\n'
'.tab:hover{background:rgba(255,255,255,0.08);color:#94a3b8}\n'
'.tab.active{background:rgba(96,165,250,0.15);color:#60a5fa;border-color:rgba(96,165,250,0.4)}\n'
'.tab .tab-count{display:inline-block;background:rgba(255,255,255,0.1);border-radius:10px;padding:1px 7px;font-size:0.75em;margin-left:5px}\n'
'.tab.active .tab-count{background:rgba(96,165,250,0.25)}\n'
'.tab-reset{margin-left:auto;font-size:0.75em;cursor:pointer;display:flex;align-items:center;gap:4px;padding:8px 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);color:#475569;transition:all 0.2s}\n'
'.tab-reset:hover{background:rgba(255,255,255,0.05);color:#94a3b8}\n'
'.main-grid{display:grid;grid-template-columns:1fr 320px;gap:20px}\n'
'@media(max-width:1100px){.main-grid{grid-template-columns:1fr}}\n'
'.card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:18px}\n'
'.card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}\n'
'.card-title{font-size:0.95em;font-weight:600;color:#94a3b8;display:flex;align-items:center;gap:8px}\n'
'.card-title .dot{width:8px;height:8px;border-radius:50%;background:#34d399}\n'
'.contact-list{display:flex;flex-direction:column;gap:8px;max-height:560px;overflow-y:auto}\n'
'.contact-list::-webkit-scrollbar{width:3px}\n'
'.contact-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}\n'
'.contact-row{display:flex;align-items:center;gap:12px;padding:12px 14px;background:rgba(255,255,255,0.025);border-radius:10px;border:1px solid rgba(255,255,255,0.04);transition:all 0.25s;cursor:pointer}\n'
'.contact-row:hover{background:rgba(255,255,255,0.06);border-color:rgba(96,165,250,0.25)}\n'
'.contact-row.expanded{background:rgba(255,255,255,0.07);border-color:rgba(96,165,250,0.4);flex-direction:column;align-items:stretch;padding:16px}\n'
'.contact-row.hidden{display:none}\n'
'.contact-row.sec-label{display:flex;align-items:center;padding:8px 14px 4px;font-size:0.68em;color:#475569;text-transform:uppercase;letter-spacing:0.8px;background:transparent;border:none;cursor:default}\n'
'.contact-row.sec-label:hover{background:transparent;border:none}\n'
'.avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8em;font-weight:700;color:#fff;flex-shrink:0}\n'
'.avatar.ka{background:linear-gradient(135deg,#f87171,#fb923c)}\n'
'.avatar.chain{background:linear-gradient(135deg,#a78bfa,#818cf8)}\n'
'.avatar.facebook{background:#1877f2}\n'
'.avatar.high{background:rgba(251,146,60,0.75)}\n'
'.avatar.medium{background:rgba(96,165,250,0.75)}\n'
'.avatar.low{background:rgba(52,211,153,0.6)}\n'
'.avatar.dist{background:linear-gradient(135deg,#f472b6,#e879f9)}\n'
'.info{flex:1;min-width:0}\n'
'.info-top{display:flex;align-items:center;gap:6px;flex-wrap:wrap}\n'
'.name{font-size:0.87em;font-weight:600;color:#e2e8f0}\n'
'.badge{font-size:0.58em;padding:2px 6px;border-radius:4px;font-weight:700}\n'
'.badge-ka{background:linear-gradient(135deg,#f87171,#fb923c);color:#fff}\n'
'.badge-chain{background:linear-gradient(135deg,#a78bfa,#818cf8);color:#fff}\n'
'.badge-new{background:rgba(52,211,153,0.2);color:#34d399}\n'
'.company{font-size:0.72em;color:#64748b;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n'
'.right-meta{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0}\n'
'.status-pill{font-size:0.65em;padding:3px 9px;border-radius:10px;font-weight:600}\n'
'.status-pending{background:rgba(251,146,60,0.15);color:#fb923c}\n'
'.keyword-chip{font-size:0.62em;color:#475569;background:rgba(255,255,255,0.04);padding:2px 7px;border-radius:4px}\n'
'.expand-hint{display:none;font-size:0.62em;color:#475569;margin-top:3px}\n'
'.contact-row:hover .expand-hint{display:block}\n'
'.msg-detail{display:none;margin-top:12px;padding:12px;background:rgba(0,0,0,0.3);border-radius:8px;border-left:3px solid rgba(96,165,250,0.5);font-size:0.76em;color:#94a3b8;line-height:1.8}\n'
'.contact-row.expanded .msg-detail{display:block}\n'
'.contact-row.expanded .right-meta{display:none}\n'
'.contact-row.expanded .company{white-space:normal;overflow:visible}\n'
'.msg-from{font-size:0.7em;color:#60a5fa;font-weight:600;margin-bottom:6px}\n'
'.msg-platform{font-size:0.65em;color:#475569;margin-top:8px;text-align:right}\n'
'.sidebar{display:flex;flex-direction:column;gap:16px}\n'
'.progress-ring-wrap{display:flex;align-items:center;gap:16px;padding:14px;background:rgba(255,255,255,0.025);border-radius:10px;border:1px solid rgba(255,255,255,0.04)}\n'
'.ring-svg{flex-shrink:0}.ring-info{flex:1}\n'
'.ring-info .title{font-size:0.85em;font-weight:600;color:#94a3b8;margin-bottom:4px}\n'
'.ring-info .detail{font-size:0.75em;color:#64748b}\n'
'.ring-info .gap{color:#fb923c;font-weight:700;font-size:0.8em;margin-top:2px}\n'
'.kw-list{display:flex;flex-direction:column;gap:7px}\n'
'.kw-item{display:flex;align-items:center;gap:10px;padding:8px 12px;background:rgba(255,255,255,0.02);border-radius:8px;cursor:pointer;transition:background 0.2s;border:1px solid transparent}\n'
'.kw-item:hover{background:rgba(255,255,255,0.05)}\n'
'.kw-item.active{background:rgba(96,165,250,0.1);border-color:rgba(96,165,250,0.3)}\n'
'.kw-item .kw-name{flex:1;font-size:0.78em;color:#94a3b8}\n'
'.kw-item.active .kw-name{color:#60a5fa}\n'
'.kw-bar{width:60px;height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;flex-shrink:0}\n'
'.kw-bar-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,#60a5fa,#34d399)}\n'
'.kw-val{font-size:0.72em;font-weight:700;color:#60a5fa;width:24px;text-align:right}\n'
'.action-list{display:flex;flex-direction:column;gap:6px}\n'
'.action-item{display:flex;align-items:center;gap:8px;padding:9px 12px;background:rgba(255,255,255,0.02);border-radius:8px;border-left:3px solid;transition:background 0.2s;cursor:pointer}\n'
'.action-item:hover{background:rgba(255,255,255,0.06)}\n'
'.action-item.p0{border-color:#f87171}.action-item.p1{border-color:#fb923c}.action-item.p2{border-color:#34d399}\n'
'.action-item .a-text{flex:1;font-size:0.78em;color:#94a3b8}\n'
'.action-item .a-tag{font-size:0.62em;padding:2px 6px;border-radius:4px;font-weight:600}\n'
'.action-item .a-tag.top{background:rgba(248,113,113,0.15);color:#f87171}\n'
'.action-item .a-tag.mid{background:rgba(251,146,60,0.15);color:#fb923c}\n'
'.action-item .a-tag.done{background:rgba(52,211,153,0.15);color:#34d399}\n'
'.vlog{display:flex;flex-direction:column;gap:4px}\n'
'.vlog-item{font-size:0.7em;color:#475569;padding:3px 0}\n'
'.vlog-item .vn{color:#34d399;font-weight:700}\n'
'.refresh-btn{display:block;margin:20px auto 0;padding:10px 28px;background:linear-gradient(135deg,#34d399,#10b981);border:none;border-radius:20px;color:#fff;font-weight:700;cursor:pointer;font-size:0.85em;transition:transform 0.2s,opacity 0.2s}\n'
'.refresh-btn:hover{opacity:0.9;transform:scale(1.02)}\n'
'.footer{text-align:center;color:#334155;font-size:0.72em;margin-top:14px}\n'
'</style>\n'
'</head>\n'
'<body>\n'
'<div class="container">\n'
'<div class="header">\n'
'  <div class="header-left">\n'
'    <h1>Flextail &amp; Vollyc - 客户开发看板</h1>\n'
'    <p>每小时自动更新 - 4大产品线精准关键词 - 全球渠道覆盖</p>\n'
'  </div>\n'
'  <div class="header-right">\n'
'    <span class="pill pill-blue">v3.0</span>\n'
'    <span class="pill pill-orange">每日目标 100 条</span>\n'
'    <span class="pill pill-green">&#x1F7E2; 运行中</span>\n'
'  </div>\n'
'</div>\n'
'\n'
'<div class="stats-bar">\n'
'  <div class="stat-box"><div class="val val-green" id="stat-total">%d</div><div class="lbl">潜在客户</div><div class="sub" id="stat-filtered" style="display:none;color:#60a5fa">筛选中</div><div class="sub" id="stat-all">全部 Pending</div></div>\n'
'  <div class="stat-box"><div class="val val-blue">11</div><div class="lbl">LinkedIn 已发</div><div class="sub">+4 本周期</div></div>\n'
'  <div class="stat-box"><div class="val val-orange">7</div><div class="lbl">今日发送</div><div class="sub">目标 100/天</div></div>\n'
'  <div class="stat-box"><div class="val val-red">0</div><div class="lbl">已接受</div><div class="sub">等待 3-7 天</div></div>\n'
'  <div class="stat-box"><div class="val val-purple">8</div><div class="lbl">KA+连锁渠道</div><div class="sub">Bass/Dick\'s/Decathlon</div></div>\n'
'</div>\n'
'\n'
'<div class="tab-bar">\n'
'  <div class="tab active" data-filter="all" onclick="setFilter(\'all\',this)">全部 <span class="tab-count" id="count-all">%d</span></div>\n'
'  <div class="tab" data-filter="ka" onclick="setFilter(\'ka\',this)">KA客户 <span class="tab-count" id="count-ka">%d</span></div>\n'
'  <div class="tab" data-filter="camping" onclick="setFilter(\'camping\',this)">户外露营 <span class="tab-count" id="count-camping">%d</span></div>\n'
'  <div class="tab" data-filter="rv" onclick="setFilter(\'rv\',this)">房车配套 <span class="tab-count" id="count-rv">0</span></div>\n'
'  <div class="tab" data-filter="tire" onclick="setFilter(\'tire\',this)">轮胎气泵 <span class="tab-count" id="count-tire">0</span></div>\n'
'  <div class="tab" data-filter="home" onclick="setFilter(\'home\',this)">家清电子 <span class="tab-count" id="count-home">0</span></div>\n'
'  <div class="tab" data-filter="agent" onclick="setFilter(\'agent\',this)">代理商 <span class="tab-count" id="count-agent">%d</span></div>\n'
'  <div class="tab-reset" onclick="resetFilter()" title="重置筛选">X 重置</div>\n'
'</div>\n'
'\n'
'<div class="main-grid">\n'
'\n'
'<div class="card">\n'
'  <div class="card-header">\n'
'    <div class="card-title"><span class="dot"></span>客户 Pipeline</div>\n'
'    <span id="pipeline-count" style="font-size:0.72em;color:#475569">%d 人 - 点击行展开消息</span>\n'
'  </div>\n'
'  <div class="contact-list">\n'
'%s\n'
'  </div>\n'
'</div>\n'
'\n'
'<div class="sidebar">\n'
'  <div class="card">\n'
'    <div class="card-header"><div class="card-title"><span class="dot"></span>今日进度</div></div>\n'
'    <div class="progress-ring-wrap">\n'
'      <svg class="ring-svg" width="72" height="72" viewBox="0 0 72 72">\n'
'        <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"/>\n'
'        <circle cx="36" cy="36" r="28" fill="none" stroke="#34d399" stroke-width="8" stroke-linecap="round" stroke-dasharray="175.93" stroke-dashoffset="163.82" transform="rotate(-90 36 36)"/>\n'
'      </svg>\n'
'      <div class="ring-info">\n'
'        <div class="title">今日发送进度</div>\n'
'        <div class="detail">7 / 100 条</div>\n'
'        <div class="gap">还差 93 条</div>\n'
'      </div>\n'
'    </div>\n'
'  </div>\n'
'\n'
'  <div class="card">\n'
'    <div class="card-header"><div class="card-title"><span class="dot"></span>关键词效果</div></div>\n'
'    <div class="kw-list">\n'
'%s\n'
'    </div>\n'
'  </div>\n'
'\n'
'  <div class="card">\n'
'    <div class="card-header"><div class="card-title"><span class="dot"></span>下一步行动</div></div>\n'
'    <div class="action-list">\n'
'%s\n'
'    </div>\n'
'  </div>\n'
'\n'
'  <div class="card">\n'
'    <div class="card-header"><div class="card-title"><span class="dot"></span>版本日志</div></div>\n'
'    <div class="vlog">\n'
'      <div class="vlog-item"><span class="vn">v3.0</span> 2026-04-02 - 交互优化：Tab切换 / 行展开 / 关键词筛选</div>\n'
'      <div class="vlog-item"><span class="vn">v2.6</span> 2026-04-01 - 每日目标调整为 100 条</div>\n'
'      <div class="vlog-item"><span class="vn">v2.0</span> 2026-04-01 - 新增 KA 客户 + 竞品渠道</div>\n'
'      <div class="vlog-item"><span class="vn">v1.0</span> 2026-03-31 - 初始版本</div>\n'
'    </div>\n'
'  </div>\n'
'</div>\n'
'\n'
'</div>\n'
'\n'
'<button class="refresh-btn" onclick="location.reload()">刷新数据</button>\n'
'<div class="footer">Cron Job ID: 2828e9ed - 每小时自动更新 - 最后更新: 2026-04-02 10:08</div>\n'
'\n'
'</div>\n'
'\n'
'<script>\n'
'var currentFilter=\'all\';\n'
'function setFilter(f,t){\n'
'  currentFilter=f;\n'
'  document.querySelectorAll(".tab").forEach(function(x){x.classList.remove("active")});\n'
'  if(t)t.classList.add("active");\n'
'  document.querySelectorAll(".contact-row[data-category]").forEach(function(r){\n'
'    var c=r.getAttribute("data-category");\n'
'    if(f==="all"||c===f){r.classList.remove("hidden")}else{r.classList.add("hidden")}\n'
'  });\n'
'  var visible=document.querySelectorAll(".contact-row[data-category]:not(.hidden)").length;\n'
'  document.getElementById("pipeline-count").textContent=visible+" 人"+(f!=="all"?" - 已筛选":"");\n'
'  document.getElementById("stat-total").textContent=visible;\n'
'  document.getElementById("stat-filtered").style.display=(f!=="all")?"block":"none";\n'
'  document.getElementById("stat-all").style.display=(f!=="all")?"none":"block";\n'
'}\n'
'function resetFilter(){setFilter("all",document.querySelector("[data-filter=all]"))}\n'
'function toggleExpand(r){\n'
'  if(r.classList.contains("expanded")){r.classList.remove("expanded")}\n'
'  else{\n'
'    document.querySelectorAll(".contact-row.expanded").forEach(function(x){x.classList.remove("expanded")});\n'
'    r.classList.add("expanded");\n'
'    r.scrollIntoView({behavior:"smooth",block:"nearest"})\n'
'  }\n'
'}\n'
'document.addEventListener("keydown",function(e){if(e.key==="Escape"){document.querySelectorAll(".contact-row.expanded").forEach(function(x){x.classList.remove("expanded")})}});\n'
'</script>\n'
'\n'
'</body>\n'
'</html>'
) % (total,total,cat_cnt.get('ka',0),cat_cnt.get('camping',0),cat_cnt.get('agent',0),total,contact_body,kw_body,act_body)

with open(path,'w',encoding='utf-8') as f:
    f.write(html)
print('Done: %d bytes, %d contacts written' % (len(html), total))
