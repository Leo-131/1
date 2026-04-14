const fs = require('fs');
let c = fs.readFileSync('outreach-dashboard/public/index.html', 'utf8');

// ===== 1. 修复平台统计 =====
c = c.replace('LinkedIn 60条/天 3/60', 'LinkedIn 60条/天 3/60');
c = c.replace('Instagram 25条/天 1/25', 'Instagram 25条/天 1/25');
c = c.replace('Facebook 15条/天 1/15', 'Facebook 15条/天 1/15');

// ===== 2. 在导出按钮后添加全球时区 + 进度圆环 + 关键词效果 + 下一步行动 =====
const newSections = `

  <!-- 🌍 全球时区状态 -->
  <div class="section-card" style="margin-top:12px;">
    <div class="section-header" onclick="toggleSection(this)">
      <span>🌍 全球时区状态</span>
      <button class="collapse-btn" onclick="event.stopPropagation();toggleSection(this.parentElement.parentElement)">−</button>
      <button class="refresh-btn" onclick="event.stopPropagation();location.reload()">↺</button>
    </div>
    <div class="section-body">
      <div class="tz-grid" id="tz-grid"></div>
    </div>
  </div>

  <style>
    .tz-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;padding:8px 0}
    .tz-card{background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:10px;padding:10px 12px;border-left:3px solid #4a9eff}
    .tz-card.working{border-left-color:#00e676}
    .tz-card.resting{border-left-color:#ff5252}
    .tz-card.soon{border-left-color:#ffab40}
    .tz-flag{font-size:1.2em;margin-right:4px}
    .tz-name{font-size:0.75em;color:#8a9bb8;margin-top:2px}
    .tz-time{font-size:1.1em;font-weight:700;color:#e8eaf6;margin-top:2px}
    .tz-status{font-size:0.7em;padding:1px 6px;border-radius:8px;margin-top:3px;display:inline-block}
    .tz-status.working{background:#1b5e20;color:#00e676}
    .tz-status.resting{background:#b71c1c;color:#ff5252}
    .tz-status.soon{background:#e65100;color:#ffab40}
    .progress-ring-container{display:flex;align-items:center;gap:16px;padding:12px 0;justify-content:center}
    .progress-ring{position:relative;width:100px;height:100px}
    .progress-ring svg{transform:rotate(-90deg)}
    .progress-ring-bg{fill:none;stroke:#2a2a4a;stroke-width:8}
    .progress-ring-fill{fill:none;stroke:#4a9eff;stroke-width:8;stroke-linecap:round;transition:stroke-dashoffset 0.5s}
    .progress-ring-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}
    .progress-ring-pct{font-size:1.3em;font-weight:800;color:#e8eaf6;line-height:1}
    .progress-ring-label{font-size:0.65em;color:#8a9bb8}
    .progress-text{flex:1}
    .progress-text-main{font-size:0.9em;font-weight:700;color:#e8eaf6}
    .progress-text-sub{font-size:0.75em;color:#8a9bb8;margin-top:2px}
    .kw-list{margin-top:6px}
    .kw-item{display:flex;align-items:center;padding:4px 0;border-bottom:1px solid #2a2a4a}
    .kw-item:last-child{border-bottom:none}
    .kw-bar-bg{flex:1;height:6px;background:#2a2a4a;border-radius:3px;margin:0 8px;overflow:hidden}
    .kw-bar-fill{height:100%;background:linear-gradient(90deg,#4a9eff,#00e676);border-radius:3px;transition:width 0.3s}
    .kw-val{font-size:0.8em;color:#4a9eff;min-width:30px;text-align:right;font-weight:600}
    .kw-tag{font-size:0.65em;background:#1a1a2e;color:#8a9bb8;padding:1px 5px;border-radius:4px;margin-right:6px}
    .action-item{display:flex;align-items:center;padding:8px 10px;border-radius:8px;margin:4px 0;cursor:pointer;transition:all 0.2s}
    .action-item:hover{background:#1e2a3a}
    .action-item.continue{border-left:3px solid #4a9eff;background:#0d1520}
    .action-item.done{border-left:3px solid #00e676;background:#0a1f12}
    .action-item.warn{border-left:3px solid #ffab40;background:#1f1508}
    .action-icon{font-size:1.1em;margin-right:8px}
    .action-text{flex:1;font-size:0.8em;color:#e8eaf6}
    .action-badge{padding:1px 8px;border-radius:10px;font-size:0.7em;font-weight:600}
    .action-badge.top{background:#1a3a6e;color:#4a9eff}
    .action-badge.ok{background:#1b5e20;color:#00e676}
    .action-badge.warn{background:#e65100;color:#ffab40}
    .section-card{background:#111827;border-radius:12px;overflow:hidden;border:1px solid #1f2937;margin-top:10px}
    .section-header{display:flex;align-items:center;padding:12px 16px;cursor:pointer;user-select:none;font-size:0.85em;font-weight:600;color:#e8eaf6;border-bottom:1px solid #1f2937}
    .section-header:hover{background:#1a2233}
    .section-header span{flex:1}
    .collapse-btn,.refresh-btn{background:none;border:none;color:#8a9bb8;cursor:pointer;font-size:0.9em;padding:2px 6px;border-radius:4px;margin-left:4px}
    .collapse-btn:hover,.refresh-btn:hover{background:#2a3a4a;color:#e8eaf6}
    .section-body{padding:12px 16px}
    .section-body.collapsed{display:none}
    .keyword-input-wrap{display:flex;gap:6px;margin-bottom:8px}
    .keyword-input{flex:1;background:#1a1a2e;border:1px solid #2a3a4a;border-radius:8px;padding:6px 10px;color:#e8eaf6;font-size:0.8em;outline:none}
    .keyword-input:focus{border-color:#4a9eff}
    .kw-add-btn{background:#4a9eff;color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:0.8em;cursor:pointer;font-weight:600}
    .kw-add-btn:hover{background:#3a8eef}
  </style>

  <script>
    // 时区数据
    const tzData = [
      {zone:'America/New_York',label:'北美东部',flag:'🇺🇸',hours:[9,17]},
      {zone:'America/Chicago',label:'北美中部',flag:'🇺🇸',hours:[9,17]},
      {zone:'America/Los_Angeles',label:'北美西部',flag:'🇺🇸',hours:[9,17]},
      {zone:'Europe/Berlin',label:'欧洲中部',flag:'🇨🇭',hours:[9,18]},
      {zone:'Australia/Sydney',label:'澳洲东部',flag:'🇦🇺',hours:[9,17]},
      {zone:'Asia/Shanghai',label:'中国',flag:'🇨🇳',hours:[9,18]},
      {zone:'Asia/Tokyo',label:'日本',flag:'🇯🇵',hours:[9,17]},
      {zone:'Asia/Singapore',label:'新加坡',flag:'🇸🇬',hours:[9,18]},
    ];
    function updateTZ() {
      const now = new Date();
      const grid = document.getElementById('tz-grid');
      if (!grid) return;
      grid.innerHTML = tzData.map(t => {
        const opts = {timeZone:t.zone,hour:'2-digit',minute:'2-digit',hour12:false};
        const time = now.toLocaleTimeString('en-GB',opts);
        const h = parseInt(time.split(':')[0]);
        const m = parseInt(time.split(':')[1]);
        const workH = h >= t.hours[0] && h < t.hours[1];
        const nearEnd = h === t.hours[1] - 1 && m >= 30;
        let status='休息',cls='resting',badge='休息';
        if(workH){status='工作中';cls='working';badge='工作中'}
        else if(nearEnd){status='即将休息';cls='soon';badge='即将休息'}
        return '<div class="tz-card '+cls+'"><div class="tz-flag">'+t.flag+'</div><div class="tz-name">'+t.label+'</div><div class="tz-time">'+time+' ('+t.hours[0]+':00-'+t.hours[1]+':00)</div><span class="tz-status '+cls+'">'+badge+'</span></div>';
      }).join('');
    }
    updateTZ();
    setInterval(updateTZ,30000);

    // 进度圆环
    function updateProgressRing() {
      const ring = document.getElementById('ring-fill');
      const pct = document.getElementById('ring-pct');
      const sent = 3, target = 100;
      const pctVal = Math.round(sent/target*100);
      const r = 40, circ = 2*Math.PI*r;
      if(ring) { ring.style.strokeDasharray = circ; ring.style.strokeDashoffset = circ*(1-sent/target); }
      if(pct) pct.textContent = sent+'/'+target;
    }
    updateProgressRing();

    // 折叠功能
    function toggleSection(el) {
      const body = el.querySelector('.section-body') || el.nextElementSibling;
      if(body && body.classList.contains('section-body')) {
        body.classList.toggle('collapsed');
      }
    }

    // 关键词效果（固定关键词）
    function initKeywords() {
      const kwSection = document.getElementById('kw-list');
      if(!kwSection) return;
      const kws = [
        {tag:'A',kw:'site:linkedin.com "outdoor gear wholesale"',val:0},
        {tag:'B',kw:'site:linkedin.com "camping gear distributor"',val:0},
        {tag:'C',kw:'site:linkedin.com "tire pump"',val:0},
        {tag:'D',kw:'site:linkedin.com "camping electronics"',val:0},
        {tag:'E',kw:'site:linkedin.com "ultralight outdoor"',val:0},
      ];
      kwSection.innerHTML = kws.map((k,i)=>
        '<div class="kw-item"><span class="kw-tag">"+k.tag+'</span><span style="font-size:0.7em;color:#8a9bb8;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+k.kw.replace('site:linkedin.com ','')+'</span><div class="kw-bar-bg"><div class="kw-bar-fill" id="kw-bar'+i+'" style="width:0%"></div></div><span class="kw-val" id="kw-val'+i+'">0</span></div>'
      ).join('');
    }
    initKeywords();

    // 关键词输入
    function addKeyword() {
      const input = document.getElementById('kw-input');
      if(!input || !input.value.trim()) return;
      const val = parseInt(document.getElementById('kw-val-new')?.value) || 0;
      const tag = String.fromCharCode(65+Math.floor(Math.random()*26));
      const list = document.getElementById('kw-list');
      if(list) {
        const div = document.createElement('div');
        div.className = 'kw-item';
        div.innerHTML = '<span class="kw-tag">'+tag+'</span><span style="font-size:0.7em;color:#8a9bb8;flex:1">'+input.value.trim()+'</span><div class="kw-bar-bg"><div class="kw-bar-fill" style="width:'+Math.min(val*10,100)+'%"></div></div><span class="kw-val">'+val+'</span>';
        list.appendChild(div);
      }
      input.value = '';
    }
  </script>

  <!-- 📊 今日进度（进度圆环） -->
  <div class="section-card">
    <div class="section-header">
      <span>📊 今日进度</span>
      <button class="collapse-btn">−</button>
    </div>
    <div class="section-body">
      <div class="progress-ring-container">
        <div class="progress-ring">
          <svg width="100" height="100">
            <circle class="progress-ring-bg" cx="50" cy="50" r="40"/>
            <circle class="progress-ring-fill" id="ring-fill" cx="50" cy="50" r="40" style="stroke-dasharray:251.2;stroke-dashoffset:239"/>
          </svg>
          <div class="progress-ring-center">
            <div class="progress-ring-pct" id="ring-pct">3/100</div>
            <div class="progress-ring-label">完成</div>
          </div>
        </div>
        <div class="progress-text">
          <div class="progress-text-main">还需发送 97 条</div>
          <div class="progress-text-sub">本周进度 17/500</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 🔍 关键词效果 TOP5 -->
  <div class="section-card">
    <div class="section-header" onclick="toggleSection(this)">
      <span>🔍 关键词效果 TOP5</span>
      <button class="collapse-btn">−</button>
      <button class="refresh-btn">↺</button>
    </div>
    <div class="section-body">
      <div class="keyword-input-wrap">
        <input class="keyword-input" id="kw-input" placeholder="输入关键词..."/>
        <button class="kw-add-btn" onclick="addKeyword()">+ 添加</button>
      </div>
      <div class="kw-list" id="kw-list"></div>
    </div>
  </div>

  <!-- 📋 下一步行动 -->
  <div class="section-card">
    <div class="section-header" onclick="toggleSection(this)">
      <span>📋 下一步行动</span>
      <button class="collapse-btn">−</button>
    </div>
    <div class="section-body">
      <div class="action-item continue" onclick="location.reload()">
        <span class="action-icon">🔗</span>
        <span class="action-text">LinkedIn · 今日还需发送 57 条</span>
        <span class="action-badge top">进行中</span>
      </div>
      <div class="action-item continue">
        <span class="action-icon">📸</span>
        <span class="action-text">Instagram · 今日还需发送 24 条</span>
        <span class="action-badge top">进行中</span>
      </div>
      <div class="action-item continue">
        <span class="action-icon">📘</span>
        <span class="action-text">Facebook · 今日还需发送 14 条</span>
        <span class="action-badge top">进行中</span>
      </div>
      <div class="action-item warn">
        <span class="action-icon">⭐</span>
        <span class="action-text">跟进 KA/连锁客户 11 个</span>
        <span class="action-badge warn">待处理</span>
      </div>
      <div class="action-item done">
        <span class="action-icon">✅</span>
        <span class="action-text">跟进超期未回复客户 1 个</span>
        <span class="action-badge ok">⚠️ 优化</span>
      </div>
    </div>
  </div>
`;

// 找到导出按钮后插入新内容
const exportEnd = c.indexOf('🔄 刷新</button>');
if (exportEnd > 0) {
  const insertAt = c.indexOf('</button>', exportEnd) + 9;
  c = c.slice(0, insertAt) + newSections + c.slice(insertAt);
  console.log('Sections inserted at', insertAt, '| Total size:', c.length);
} else {
  console.log('WARNING: Export button not found!');
}

// 去掉旧的"下一步行动"区域（如果有重复的话）
const oldNextActions = c.indexOf('📋 下一步行动</h3>');
if (oldNextActions > 0) {
  // 找到section开始
  let start = c.lastIndexOf('<div', oldNextActions);
  let end = c.indexOf('</section>', oldNextActions) + 10;
  if (end > 10) {
    c = c.slice(0, start) + c.slice(end);
    console.log('Old next-actions removed');
  }
}

fs.writeFileSync('outreach-dashboard/public/index.html', c);
console.log('Done! File size:', fs.readFileSync('outreach-dashboard/public/index.html', 'utf8').length);
