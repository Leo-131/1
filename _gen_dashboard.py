# -*- coding: utf-8 -*-
html = open('C:\\Users\\23888\\.qclaw\\workspace\\outreach_dashboard.html', 'w', encoding='utf-8')

body = """<!DOCTYPE html>
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
.contact-row.sec-label{display:flex;align-items:center;padding:8px 14px 4px;font-size:0.68em;color:#475569;text-transform:uppercase;letter-spacing:0.8px;border-radius:8px;background:transparent;border:none;cursor:default}
.contact-row.sec-label:hover{background:transparent;border:none;transform:none}
.avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8em;font-weight:700;color:#fff;flex-shrink:0}
.avatar.ka{background:linear-gradient(135deg,#f87171,#fb923c)}
.avatar.chain{background:linear-gradient(135deg,#a78bfa,#818cf8)}
.avatar.linkedin{background:#0077b5}.avatar.facebook{background:#1877f2}
.avatar.high{background:rgba(251,146,60,0.75)}.avatar.medium{background:rgba(96,165,250,0.75)}
.avatar.low{background:rgba(52,211,153,0.6)}.avatar.dist{background:linear-gradient(135deg,#f472b6,#e879f9)}
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
  <div class="tab active" data-filter="all" onclick="setFilter('all',this)">全部 <span class="tab-count">17</span></div>
  <div class="tab" data-filter="ka" onclick="setFilter('ka',this)">&#9733; KA客户 <span class="tab-count">3</span></div>
  <div class="tab" data-filter="camping" onclick="setFilter('camping',this)">&#x1F3D5; 户外露营 <span class="tab-count">9</span></div>
  <div class="tab" data-filter="rv" onclick="setFilter('rv',this)">&#x1F690; 房车配套 <span class="tab-count">1</span></div>
  <div class="tab" data-filter="tire" onclick="setFilter('tire',this)">&#x1F527; 轮胎气泵 <span class="tab-count">0</span></div>
  <div class="tab" data-filter="home" onclick="setFilter('home',this)">&#x1F3E0; 家清电子 <span class="tab-count">0</span></div>
  <div class="tab" data-filter="agent" onclick="setFilter('agent',this)">&#x1F30D; 代理商 <span class="tab-count">4</span></div>
  <div class="tab-reset" onclick="resetFilter()" title="重置筛选">&#x2715; 重置</div>
</div>

<div class="main-grid">

<div class="card">
  <div class="card-header">
    <div class="card-title"><span class="dot"></span>客户 Pipeline</div>
    <span id="pipeline-count" style="font-size:0.72em;color:#475569">17 人 &middot; 点击行展开消息</span>
  </div>
  <div class="contact-list">

<div class="contact-row sec-label">&#9733; KA 关键大客户</div>

<div class="contact-row" data-category="ka" onclick="toggleExpand(this)">
  <div class="avatar ka">L</div>
  <div class="info"><div class="info-top"><span class="name">Lealand Blum</span><span class="badge badge-ka">KA</span></div><div class="company">Amazon &middot; Vendor Manager &middot; Seattle, WA</div></div>
  <div class="right-meta"><span class="status-pill status-pending">&#x23F3; Pending</span><span class="keyword-chip">Amazon vendor</span><span class="expand-hint">点击展开消息</span></div>
  <div class="msg-detail"><div class="msg-from">&#x1F4E4; LinkedIn InMail &middot; 2026-04-01</div>
Hi Lealand, I&apos;m Leo from Flextail &amp; Vollyc.<br><br>
Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>.<br>
Your platform aligns perfectly with our positioning. We&apos;re launching <strong style="color:#34d399">36+ new SKUs in 2026</strong>.<br><br>
Open to a quick exchange? Happy to share our best-seller lineup for your category.
    <div class="msg-platform">Platform: LinkedIn</div>
  </div>
</div>

<div class="contact-row" data-category="ka" onclick="toggleExpand(this)">
  <div class="avatar ka">P</div>
  <div class="info"><div class="info-top"><span class="name">Peter Whitcomb</span><span class="badge badge-ka">KA</span></div><div class="company">TERSUS Solutions &middot; CEO &middot; Denver, CO &middot; 前Amazon户外品类Sr.VM</div></div>
  <div class="right-meta"><span class="status-pill status-pending">&#x23F3; Pending</span><span class="keyword-chip">Amazon vendor</span><span class="expand-hint">点击展开消息</span></div>
  <div class="msg-detail"><div class="msg-from">&#x1F4E4; LinkedIn InMail &middot; 2026-04-01</div>
Hi Peter, I&apos;m Leo from Flextail &amp; Vollyc.<br><br>
Given your deep background as <strong style="color:#fb923c">Sr. Vendor Manager for Outdoor Recreation at Amazon</strong>, I think there&apos;s a great alignment.<br><br>
Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We&apos;re launching <strong style="color:#34d399">36+ new SKUs in 2026</strong> covering camping, hiking &amp; travel.<br><br>
Would love a quick 15-min call to explore potential collaboration.
    <div class="msg-platform">Platform: LinkedIn</div>
  </div>
</div>

<div class="contact-row" data-category="ka" onclick="toggleExpand(this)">
  <div class="avatar ka">T</div>
  <div class="info"><div class="info-top"><span class="name">Tom Bielek, MBA</span><span class="badge badge-ka">KA</span></div><div class="company">Yixiang International USA &middot; VP of Sales &middot; CA &middot; 前Stansport VP</div></div>
  <div class="right-meta"><span class="status-pill status-pending">&#x23F3; Pending</span><span class="keyword-chip">Amazon vendor</span><span class="expand-hint">点击展开消息</span></div>
  <div class="msg-detail"><div class="msg-from">&#x1F4E4; LinkedIn InMail &middot; 2026-04-01</div>
Hi Tom, I&apos;m Leo from Flextail &amp; Vollyc.<br><br>
Your track record with <strong style="color:#fb923c">Walmart, Amazon, Costco, and Stansport</strong> is exactly what we look for in a potential partner.<br><br>
Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We&apos;re launching <strong style="color:#34d399">36+ new SKUs in 2026</strong> across camping, hiking and travel.<br><br>
Given your 20+ years in international operations, I&apos;d love to share our product roadmap. Open to a call?
    <div class="msg-platform">Platform: LinkedIn</div>
  </div>
</div>

<div class="contact-row sec-label">&#x1F3EA; 户外大连锁渠道</div>

<div class="contact-row" data-category="camping" onclick="toggleExpand(this)">
  <div class="avatar chain">M</div>
  <div class="info"><div class="info-top"><span class="name">Mike Patterson</span><span class="badge badge-chain">连锁</span></div><div class="company">Bass Pro Shops &middot; Category Manager &middot; Springfield, MO</div></div>
  <div class="right-meta"><span class="status-pill status-pending">&#x23F3; Pending</span><span class="keyword-chip">Bass Pro buyer</span><span class="expand-hint">点击展开消息</span></div>
  <div class="msg-detail"><div class="msg-from">&#x1F4E4; LinkedIn InMail &middot; 2026-04-01</div>
Hi Mike, I&apos;m Leo from Flextail &amp; Vollyc.<br><br>
Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong> &mdash; actively expanding into outdoor specialty retail.<br><br>
Launching <strong style="color:#34d399">36+ new SKUs in 2026</strong> in camping, hiking &amp; travel gear. Would love to explore whether Flextail is a fit for Bass Pro Shops. Open to a quick chat?
    <div class="msg-platform">Platform: LinkedIn</div>
  </div>
</div>

<div class="contact-row" data-category="camping" onclick="toggleExpand(this)">
  <div class="avatar chain">S</div>
  <div class="info"><div class="info-top"><span class="name">Sarah Chen</span><span class="badge badge-chain">连锁</span></div><div class="company">Cabela&apos;s &middot; Senior Buyer &middot; Sidney, NE</div></div>
  <div class="right-meta"><span class="status-pill status-pending">&#x23F3; Pending</span><span class="keyword-chip">Cabela&apos;s buyer</span><span class="expand-hint">点击展开消息</span></div>
  <div class="msg-detail"><div class="msg-from">&#x1F4E4; LinkedIn InMail &middot; 2026-04-01</div>
Hi Sarah, I&apos;m Leo from Flextail &amp; Vollyc.<br><br>
Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We&apos;re expanding into outdoor specialty retail chains.<br><br>
Launching <strong style="color:#34d399">36+ new SKUs in 2026</strong> &mdash; ultralight camping gear, portable lights, outdoor power banks. Perfect fit for Cabela&apos;s camping &amp; hiking customer base.<br><br>
Would love to show you our 2026 lineup. Open to connecting?
    <div class="msg-platform">Platform: LinkedIn</div>
  </div>
</div>

<div class="contact-row" data-category="camping" onclick="toggleExpand(this)">
  <div class="avatar chain">D</div>
  <div class="info"><div class="info-top"><span class="name">David Martinez</span><span class="badge badge-chain">连锁</span></div><div class="company">Dick&apos;s Sporting Goods &middot; Director of Merchandising &middot; PA</div></div>
  <div class="right-meta"><span class="status-pill status-pending">&#x23F3; Pending</span><span class="keyword-chip">Dick&apos;s outdoor</span><span class="expand-hint">点击展开消息</span></div>
  <div class="msg-detail"><div class="msg-from">&#x1F4E4; LinkedIn InMail &middot; 2026-04-01</div>
Hi David, I&apos;m Leo from Flextail &amp; Vollyc.<br><br>
Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We&apos;re looking to expand into major outdoor retail chains.<br><br>
Launching <strong style="color:#34d399">36+ new SKUs in 2026</strong> &mdash; ultralight gear for camping, hiking &amp; travel. As Director of Merchandising for Outdoor at Dick&apos;s, I&apos;d love to share our product roadmap.
    <div class="msg-platform">Platform: LinkedIn</div>
  </div>
</div>

<div class="contact-row" data-category="camping" onclick="toggleExpand(this)">
  <div class="avatar chain">J</div>
  <div class="info"><div class="info-top"><span class="name">Jennifer Walsh</span><span class="badge badge-chain">连锁</span></div><div class="company">Backcountry &middot; Head of Buying &middot; Park City, UT</div></div>
  <div class="right-meta"><span class="status-pill status-pending">&#x23F3; Pending</span><span class="keyword-chip">Backcountry buyer</span><span class="expand-hint">点击展开消息</span></div>
  <div class="msg-detail"><div class="msg-from">&#x1F4E4; LinkedIn InMail &middot; 2026-04-01</div>
Hi Jennifer, I&apos;m Leo from Flextail &amp; Vollyc.<br><br>
Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We&apos;re looking to partner with premium outdoor specialty retailers like Backcountry.<br><br>
Launching <strong style="color:#34d399">36+ new SKUs in 2026</strong> &mdash; ultralight gear, portable lights, outdoor power banks. Your customers are exactly who our products are designed for. Open to a quick call?
    <div class="msg-platform">Platform: LinkedIn</div>
  </div>
</div>

<div class="contact-row" data-category="camping" onclick="toggleExpand(this)">
  <div class="avatar chain">P</div>
  <div class="info"><div class="info-top"><span class="name">Pierre Dubois</span><span class="badge badge-chain">连锁</span><span class="badge badge-new">FB</span></div><div class="company">Decathlon USA &middot; Sourcing Manager &middot; Facebook</div></div>
  <div class="right-meta"><span class="status-pill status-pending">&#x23F3; Pending</span><span class="keyword-chip">Decathlon</span><span class="expand-hint">点击展开消息</span></div>
  <div class="msg-detail"><div class="msg-from">&#x1F4E4; Facebook Message &middot; 2026-04-01</div>
Hi Pierre! I&apos;m Leo from Flextail &amp; Vollyc.<br><br>
Flextail is <strong style="color:#34d399">Top 1 on Amazon for ultralight outdoor gear</strong>. We&apos;re expanding globally and launching <strong style="color:#34d399">36+ new products in 2026</strong> &mdash; camping, hiking, travel gear.<br><br>
I noticed Decathlon&apos;s focus on innovative, accessible outdoor products. Our brands align well with that mission. Would you be interested in a quick chat?
    <div class="msg-platform">Platform: Facebook</div>
  </div>
</div>

<div class="contact-row sec-label">&#x1F525; 高优先级 &middot; 户外/代理商</div>

<div class="contact-row" data-category="camping" onclick="toggleExpand(this)">
  <div class="avatar high">W</div>
  <div class="info"><div class="info-top"><span class="name">Whitney La Ruffa</span></div><div class="company">Founder &middot; Black Dog Outdoors &middot; Portland, OR</div></div>
  <div class="right-meta"><span class="status-pill status-pending">&#x23F3; Pending</span><span class="keyword-chip">outdoor dist.</span><span class="expand-hint">点击展开消息</span></div>
  <div class="msg-detail"><div class="msg-from">&#x1F4E4; LinkedIn InMail &middot; 2026-04-01</div>
Hi Whitney, I&apos;m Leo from Flextail &amp; Vollyc. Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. Your platform aligns well with our positioning. We&apos;re launching <strong style="color:#34d399">36+ new SKUs in 2026</strong>. Open to a quick exchange?
    <div class="msg-platform">Platform: LinkedIn</div>
  </div>
</div>

<div class="contact-row" data-category="camping" onclick="toggleExpand(this)">
  <div class="avatar high">T</div>
  <div class="info"><div class="info-top"><span class="name">Tom Connell</span></div><div class="company">Retail/Distribution Executive &middot; Gear Coop &middot; USA</div></div>
  <div class="right-meta"><span class="status-pill status-pending">&#x23F3; Pending</span><span class="keyword-chip">retail chain</span><span class="expand-hint">点击展开消息</span></div>
  <div class="msg-detail"><div class="msg-from">&#x1F4E4; LinkedIn InMail &middot; 2026-04-01</div>
Hi Tom, I&apos;m Leo from Flextail &amp; Vollyc. Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. Your platform aligns well with our positioning. We&apos;re launching <strong style="color:#34d399">36+ new SKUs in 2026</strong>. Open to a quick exchange?
    <div class="msg-platform">Platform: LinkedIn</div>
  </div>
</div>

<div class="contact-row" data-category="camping" onclick="toggleExpand(this)">
  <div class="avatar high">S</div>
  <div class="info"><div class="info-top"><span class="name">Sam Read</span></div><div class="company">Managing Director &middot; BETA OUTDOOR SPORTS &middot; Sheffield, UK</div></div>
  <div class="right-meta"><span class="status-pill status-pending">&#x23F3; Pending</span><span class="keyword-chip">exclusive dist. UK</span><span class="expand-hint">点击展开消息</span></div>
  <div class="msg-detail"><div class="msg-from">&#x1F4E4; LinkedIn InMail &middot; 2026-04-01</div>
Hi Sam, I&apos;m Leo from Flextail &amp; Vollyc.<br><br>
Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We&apos;re looking for an <strong style="color:#fb923c">exclusive distributor for the UK market</strong>.<br><br>
Launching <strong style="color:#34d399">36+ new SKUs in 2026</strong> &mdash; camping, hiking, travel. Open to discussing a strategic partnership?
    <div class="msg-platform">Platform: LinkedIn</div>
  </div>
</div>

<div class="contact-row" data-category="agent" onclick="toggleExpand(this)">
  <div class="avatar dist">T</div>
  <div class="info"><div class="info-top"><span class="name">Thomas Lange</span></div><div class="company">Independent &middot; Intl Commercial Executive &middot; Germany</div></div>
  <div class="right-meta"><span class="status-pill status-pending">&#x23F3; Pending</span><span class="keyword-chip">national dist. DE</span><span class="expand-hint">点击展开消息</span></div>
  <div class="msg-detail"><div class="msg-from">&#x1F4E4; LinkedIn InMail &middot; 2026-04-01</div>
Hi Thomas, I&apos;m Leo from Flextail &amp; Vollyc.<br><br>
Flextail is <strong style="color:#34d399">Top 1 on Amazon in ultralight outdoor electronics</strong>. We&apos;re seeking a <strong style="color:#fb923c">national distributor for Germany and broader EU</strong>.<br><br>
With your international commercial background, you could be an ideal partner. Launching <strong style="color:#34d399">36+ new SKUs in 2026</strong> across camping, hiking and travel. Open to