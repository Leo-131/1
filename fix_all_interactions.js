const fs = require('fs');
let c = fs.readFileSync('outreach-dashboard/public/index.html', 'utf8');

// ===== 1. 找到 </style> 之前，插入完整的拖拽/交互CSS和JS =====
const newInteractionJS = `

    /* ===== 拖拽卡片样式 ===== */
    .drag-card {
      cursor: grab;
      user-select: none;
      transition: box-shadow 0.2s;
    }
    .drag-card:hover {
      box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.4);
    }
    .drag-card.dragging {
      cursor: grabbing;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      z-index: 9999;
      opacity: 0.95;
    }
    .resize-handle {
      position: absolute;
      bottom: 0; right: 0;
      width: 16px; height: 16px;
      cursor: se-resize;
      background: rgba(74,158,255,0.3);
      border-radius: 4px 0 8px 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px;
      color: rgba(255,255,255,0.6);
    }
    .resize-handle:hover { background: rgba(74,158,255,0.6); }
    .drag-header {
      cursor: grab;
      padding: 8px 10px;
      background: linear-gradient(135deg, #1e3a5f, #162447);
      border-radius: 8px 8px 0 0;
      display: flex; align-items: center; gap: 8px;
      font-size: 0.82em; font-weight: 700; color: #e8eaf6;
      border-bottom: 1px solid #2a3a4a;
    }
    .drag-header:active { cursor: grabbing; }
    .drag-header .drag-icon { opacity: 0.4; font-size: 0.75em; }
    .drag-header .drag-title { flex: 1; }
    .drag-header .drag-actions { display: flex; gap: 4px; }
    .drag-action-btn {
      background: none; border: none; color: #8a9bb8;
      cursor: pointer; font-size: 0.85em; padding: 2px 5px;
      border-radius: 4px;
    }
    .drag-action-btn:hover { background: #2a3a4a; color: #e8eaf6; }
    .drag-action-btn.close:hover { background: #b71c1c; color: #ff5252; }
    .module-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
      padding: 12px;
    }
    .module-card {
      background: #111827;
      border-radius: 10px;
      border: 1px solid #1f2937;
      overflow: hidden;
      position: relative;
      min-width: 200px; min-height: 120px;
    }
    .section-body.collapsed { display: none; }
    .collapse-all-bar {
      display: flex; gap: 8px; padding: 8px 12px;
      background: #0d1117; border-bottom: 1px solid #1f2937;
      font-size: 0.75em; flex-wrap: wrap;
    }
    .collapse-all-btn {
      background: #1f2937; border: 1px solid #2a3a4a;
      color: #8a9bb8; border-radius: 6px; padding: 3px 8px;
      cursor: pointer; font-size: 0.75em;
    }
    .collapse-all-btn:hover { background: #2a3a4a; color: #e8eaf6; }
    .module-mini { width: 24px; height: 24px; border-radius: 4px; font-size: 0.6em; display: flex; align-items: center; justify-content: center; color: #8a9bb8; }
    .add-module-btn {
      background: #1a2a3a; border: 2px dashed #2a3a4a; border-radius: 10px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 6px; min-height: 120px; cursor: pointer; color: #4a5568;
      font-size: 0.8em; transition: all 0.2s;
    }
    .add-module-btn:hover { border-color: #4a9eff; color: #4a9eff; background: #0d1520; }
    /* ===== 新增模块弹窗 ===== */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.7);
      display: flex; align-items: center; justify-content: center;
      z-index: 99999; backdrop-filter: blur(4px);
    }
    .modal-overlay.hidden { display: none; }
    .modal-box {
      background: #111827; border: 1px solid #2a3a4a;
      border-radius: 12px; padding: 24px; width: 400px; max-width: 90vw;
    }
    .modal-title { font-size: 1em; font-weight: 700; color: #e8eaf6; margin-bottom: 16px; }
    .modal-close {
      background: #b71c1c; border: none; color: #fff; border-radius: 6px;
      padding: 6px 12px; cursor: pointer; font-size: 0.8em;
    }
    .modal-modules {
      display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 12px 0;
    }
    .modal-module {
      background: #1a2537; border: 1px solid #2a3a4a; border-radius: 8px;
      padding: 10px; cursor: pointer; color: #e8eaf6; font-size: 0.8em;
      text-align: center; transition: all 0.2s;
    }
    .modal-module:hover { background: #1e3a5f; border-color: #4a9eff; }
    .module-type-selector {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 8px; margin: 12px 0;
    }
    .type-option {
      background: #1a2537; border: 1px solid #2a3a4a; border-radius: 8px;
      padding: 10px 12px; cursor: pointer; font-size: 0.8em; color: #8a9bb8;
      text-align: center; transition: all 0.2s;
    }
    .type-option:hover, .type-option.selected {
      background: #1e3a5f; border-color: #4a9eff; color: #4a9eff;
    }
    .btn-primary {
      background: #4a9eff; border: none; color: #fff; border-radius: 8px;
      padding: 8px 16px; cursor: pointer; font-weight: 600; font-size: 0.85em;
    }
    .btn-primary:hover { background: #3a8eef; }
    .btn-secondary {
      background: #2a3a4a; border: none; color: #8a9bb8; border-radius: 8px;
      padding: 8px 16px; cursor: pointer; font-size: 0.85em;
    }
    .btn-secondary:hover { background: #3a4a5a; color: #e8eaf6; }
    .input-field {
      width: 100%; background: #1a2537; border: 1px solid #2a3a4a;
      border-radius: 8px; padding: 8px 12px; color: #e8eaf6;
      font-size: 0.85em; box-sizing: border-box; outline: none;
    }
    .input-field:focus { border-color: #4a9eff; }
    .form-group { margin-bottom: 12px; }
    .form-label { font-size: 0.75em; color: #8a9bb8; margin-bottom: 4px; display: block; }
    .modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
    .color-options { display: flex; gap: 6px; flex-wrap: wrap; }
    .color-opt {
      width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
      border: 2px solid transparent; transition: all 0.2s;
    }
    .color-opt:hover, .color-opt.selected { border-color: #fff; transform: scale(1.2); }
  </style>

  <script>
    // ===== 全局状态管理 =====
    let modules = [];
    let draggedEl = null;
    let dragOffsetX = 0, dragOffsetY = 0;
    let resizingEl = null;
    let startX = 0, startY = 0, startW = 0, startH = 0;

    // ===== 拖拽系统 =====
    function initDragSystem() {
      document.querySelectorAll('.module-card').forEach(card => {
        // 拖拽移动
        const header = card.querySelector('.drag-header');
        if (header) {
          header.onmousedown = (e) => {
            if (e.target.classList.contains('drag-action-btn')) return;
            e.preventDefault();
            draggedEl = card;
            draggedEl.classList.add('dragging');
            const rect = draggedEl.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
          };
        }
        // 调整大小
        let rh = card.querySelector('.resize-handle');
        if (!rh) {
          rh = document.createElement('div');
          rh.className = 'resize-handle';
          rh.innerHTML = '⤡';
          card.style.position = 'relative';
          card.appendChild(rh);
        }
        rh.onmousedown = (e) => {
          e.preventDefault();
          e.stopPropagation();
          resizingEl = card;
          const rect = resizingEl.getBoundingClientRect();
          startX = e.clientX; startY = e.clientY;
          startW = rect.width; startH = rect.height;
        };
      });
    }

    document.onmousemove = (e) => {
      if (draggedEl) {
        const container = draggedEl.parentElement;
        const containerRect = container.getBoundingClientRect();
        const x = e.clientX - containerRect.left - dragOffsetX;
        const y = e.clientY - containerRect.top - dragOffsetY;
        draggedEl.style.position = 'absolute';
        draggedEl.style.left = Math.max(0, x) + 'px';
        draggedEl.style.top = Math.max(0, y) + 'px';
        draggedEl.style.zIndex = '9999';
      }
      if (resizingEl) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const newW = Math.max(200, startW + dx);
        const newH = Math.max(120, startH + dy);
        resizingEl.style.width = newW + 'px';
        resizingEl.style.height = newH + 'px';
      }
    };

    document.onmouseup = () => {
      if (draggedEl) {
        draggedEl.classList.remove('dragging');
        draggedEl.style.zIndex = '';
        saveState();
        draggedEl = null;
      }
      if (resizingEl) {
        resizingEl = null;
        saveState();
      }
    };

    // ===== 折叠功能 =====
    function toggleSection(header) {
      const body = header.nextElementSibling;
      if (!body) return;
      const btn = header.querySelector('.collapse-btn');
      body.classList.toggle('collapsed');
      if (btn) btn.textContent = body.classList.contains('collapsed') ? '+' : '−';
    }

    // 让所有section header可点击
    function initCollapseAll() {
      document.querySelectorAll('[onclick*="toggleSection"]').forEach(el => {
        el.style.cursor = 'pointer';
      });
      document.querySelectorAll('.section-header').forEach(header => {
        if (!header.hasAttribute('data-bound')) {
          header.setAttribute('data-bound', '1');
          header.onclick = (e) => {
            if (e.target.closest('.drag-action-btn')) return;
            toggleSection(header);
          };
        }
      });
    }

    // ===== 状态保存/恢复 =====
    function saveState() {
      const state = {
        collapsed: [],
        widths: {},
        heights: {},
        positions: {}
      };
      document.querySelectorAll('.section-card').forEach((card, i) => {
        const id = card.id || 'card-' + i;
        const body = card.querySelector('.section-body');
        if (body && body.classList.contains('collapsed')) {
          state.collapsed.push(id);
        }
        if (card.style.width) state.widths[id] = card.style.width;
        if (card.style.height) state.heights[id] = card.style.height;
        if (card.style.left) state.positions[id] = { left: card.style.left, top: card.style.top };
      });
      localStorage.setItem('dashboard-state-v3', JSON.stringify(state));
    }

    function loadState() {
      try {
        const state = JSON.parse(localStorage.getItem('dashboard-state-v3') || '{}');
        document.querySelectorAll('.section-card').forEach((card, i) => {
          const id = card.id || 'card-' + i;
          const body = card.querySelector('.section-body');
          const btn = card.querySelector('.collapse-btn');
          if (state.collapsed.includes(id) && body) {
            body.classList.add('collapsed');
            if (btn) btn.textContent = '+';
          }
          if (state.widths[id]) card.style.width = state.widths[id];
          if (state.heights[id]) card.style.height = state.heights[id];
          if (state.positions[id]) {
            card.style.position = 'absolute';
            card.style.left = state.positions[id].left;
            card.style.top = state.positions[id].top;
          }
        });
      } catch(e) {}
    }

    // ===== 关键词搜索 =====
    function filterCustomers() {
      const q = document.getElementById('search-box')?.value.toLowerCase() || '';
      const filter = document.querySelector('.filter-active')?.dataset.filter || 'all';
      document.querySelectorAll('.customer-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        const tag = item.dataset.tag || '';
        let show = text.includes(q);
        if (filter === 'ka') show = show && tag === 'ka';
        if (filter === 'pending') show = show && (text.includes('pending') || text.includes('待'));
        if (filter === 'accepted') show = show && (text.includes('accepted') || text.includes('已接受'));
        item.style.display = show ? '' : 'none';
      });
    }

    // ===== 客户点击交互 =====
    function initCustomerClicks() {
      document.querySelectorAll('.customer-item').forEach(item => {
        if (item.hasAttribute('data-bound')) return;
        item.setAttribute('data-bound', '1');
        item.style.cursor = 'pointer';
        item.onclick = () => {
          const name = item.querySelector('.customer-name')?.textContent || item.textContent.split('\n')[0];
          const status = item.querySelector('.customer-status')?.textContent || '';
          showCustomerDetail(name.trim(), status.trim());
        };
      });
    }

    // ===== 客户详情弹窗 =====
    function showCustomerDetail(name, status) {
      const existing = document.getElementById('customer-detail-modal');
      if (existing) existing.remove();
      const modal = document.createElement('div');
      modal.id = 'customer-detail-modal';
      modal.className = 'modal-overlay';
      modal.innerHTML = '<div class="modal-box" style="width:480px"><div class="modal-title">👤 ' + name + '<span style="font-size:0.7em;color:#8a9bb8;margin-left:8px">' + status + '</span></div><div style="color:#8a9bb8;font-size:0.8em;margin:8px 0">平台：LinkedIn / Email / 电话</div><div style="margin:12px 0"><textarea class="input-field" rows="3" placeholder="添加跟进备注..."></textarea></div><div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0"><span class="collapse-all-btn">📧 发邮件</span><span class="collapse-all-btn">📱 打电话</span><span class="collapse-all-btn">💬 发消息</span><span class="collapse-all-btn">📝 记笔记</span></div><div class="modal-actions"><button class="btn-secondary" onclick="this.closest(\\.modal-overlay\\).remove()">关闭</button><button class="btn-primary" onclick="saveCustomerNote(this)">保存</button></div></div>';
      document.body.appendChild(modal);
      modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }

    function saveCustomerNote(btn) {
      const textarea = btn.closest('.modal-box').querySelector('textarea');
      if (textarea.value.trim()) {
        alert('备注已保存: ' + textarea.value.trim().substring(0, 50));
        btn.closest('.modal-overlay').remove();
      }
    }

    // ===== 搜索框事件绑定 =====
    function initSearch() {
      const sb = document.getElementById('search-box');
      if (sb && !sb.hasAttribute('data-bound')) {
        sb.setAttribute('data-bound', '1');
        sb.oninput = filterCustomers;
        sb.onkeydown = (e) => { if (e.key === 'Escape') { sb.value = ''; filterCustomers(); } };
      }
    }

    // ===== 客户筛选按钮 =====
    function initFilterBtns() {
      document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.hasAttribute('data-bound')) return;
        btn.setAttribute('data-bound', '1');
        btn.onclick = () => {
          document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-active'));
          btn.classList.add('filter-active');
          btn.dataset.filter = btn.textContent.includes('★') ? 'ka' : btn.textContent.includes('待') ? 'pending' : btn.textContent.includes('已接受') ? 'accepted' : 'all';
          filterCustomers();
        };
      });
    }

    // ===== 初始化 =====
    window.onload = () => {
      loadState();
      setTimeout(() => {
        initDragSystem();
        initCollapseAll();
        initCustomerClicks();
        initSearch();
        initFilterBtns();
        filterCustomers();
        console.log('[Dashboard] All interactions initialized');
      }, 100);
    };

    // 如果DOM已加载完但模块还没渲染完，再初始化一次
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        initDragSystem();
        initCollapseAll();
        initCustomerClicks();
        initSearch();
        initFilterBtns();
      }, 500);
    });

    // ===== 快速添加客户 =====
    function showQuickAdd() {
      const existing = document.getElementById('quick-add-modal');
      if (existing) { existing.remove(); return; }
      const modal = document.createElement('div');
      modal.id = 'quick-add-modal';
      modal.className = 'modal-overlay';
      modal.innerHTML = '<div class="modal-box"><div class="modal-title">➕ 快速添加客户</div><div class="form-group"><label class="form-label">姓名</label><input class="input-field" id="qa-name" placeholder="张三"/></div><div class="form-group"><label class="form-label">公司</label><input class="input-field" id="qa-company" placeholder="ABC公司"/></div><div class="form-group"><label class="form-label">职位</label><input class="input-field" id="qa-title" placeholder="销售总监"/></div><div class="form-group"><label class="form-label">标签</label><div style="display:flex;gap:6px;flex-wrap:wrap"><span class="collapse-all-btn selected" onclick="this.classList.toggle(\\'selected\\')">KA</span><span class="collapse-all-btn" onclick="this.classList.toggle(\\'selected\\')">camping</span><span class="collapse-all-btn" onclick="this.classList.toggle(\\'selected\\')">auto</span><span class="collapse-all-btn" onclick="this.classList.toggle(\\'selected\\')">retail</span></div></div><div class="form-group"><label class="form-label">状态</label><select class="input-field" id="qa-status"><option>待联系</option><option>跟进中</option><option>已接受</option><option>已拒绝</option></select></div><div class="modal-actions"><button class="btn-secondary" onclick="this.closest(\\.modal-overlay\\).remove()">取消</button><button class="btn-primary" onclick="doQuickAdd()">添加</button></div></div>';
      document.body.appendChild(modal);
      modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }

    function doQuickAdd() {
      const name = document.getElementById('qa-name')?.value;
      const company = document.getElementById('qa-company')?.value;
      if (!name) return alert('请输入姓名');
      const list = document.querySelector('.customer-list');
      if (!list) return;
      const initial = name[0].toUpperCase();
      const status = document.getElementById('qa-status')?.value || '待联系';
      const div = document.createElement('div');
      div.className = 'customer-item';
      div.innerHTML = '<span class="customer-initial">' + initial + '</span><div class="customer-info"><div class="customer-name">' + name + (document.querySelector('.collapse-all-btn.selected')?.textContent === 'KA' ? 'KA' : '') + '</div><div class="customer-title">' + company + '</div></div><div class="customer-status">⏳' + status + '</div>';
      list.appendChild(div);
      initCustomerClicks();
      document.getElementById('quick-add-modal')?.remove();
    }

    // ===== 导出功能 =====
    function exportCSV() {
      const rows = [['Initial', 'Name', 'Company', 'Status', 'Tag']];
      document.querySelectorAll('.customer-item').forEach(item => {
        const name = item.querySelector('.customer-name')?.textContent || '';
        const title = item.querySelector('.customer-title')?.textContent || '';
        const status = item.querySelector('.customer-status')?.textContent || '';
        rows.push([name[0]||'', name, title, status, '']);
      });
      const csv = rows.map(r => r.join(',')).join('\\n');
      const blob = new Blob([csv], {type:'text/csv'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'flextail_contacts_'+new Date().toISOString().slice(0,10)+'.csv';
      a.click();
    }

    function exportJSON() {
      const contacts = [];
      document.querySelectorAll('.customer-item').forEach(item => {
        contacts.push({
          name: item.querySelector('.customer-name')?.textContent || '',
          company: item.querySelector('.customer-title')?.textContent || '',
          status: item.querySelector('.customer-status')?.textContent || ''
        });
      });
      const blob = new Blob([JSON.stringify(contacts, null, 2)], {type:'application/json'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'flextail_contacts_'+new Date().toISOString().slice(0,10)+'.json';
      a.click();
    }
  </script>
`;

    // 找到 </style> 标签，插入交互代码
    const styleEnd = c.lastIndexOf('</style>');
    if (styleEnd > 0) {
      c = c.slice(0, styleEnd) + newInteractionJS + c.slice(styleEnd);
      console.log('Interaction code inserted at style end, total size:', c.length);
    } else {
      // 如果没有</style>，插到</head>之前
      const headEnd = c.indexOf('</head>');
      if (headEnd > 0) {
        c = c.slice(0, headEnd) + '<style>' + newInteractionJS + '</style>' + c.slice(headEnd);
        console.log('Inserted before </head>, total size:', c.length);
      }
    }

    // ===== 2. 修复搜索框ID =====
    c = c.replace('id="search-box"', 'id="search-box"');
    // 给搜索框加事件绑定
    const searchBoxPattern = 'id="search-box"';
    if (c.includes(searchBoxPattern)) {
      console.log('Search box found');
    }

    // ===== 3. 给客户列表添加 class 和 data 属性 =====
    // 给每个客户item包装div添加class
    c = c.replace(/class="customer-item">/g, 'class="customer-item" data-bound="1">');

    // ===== 4. 给section card加ID方便状态保存 =====
    let cardIndex = 0;
    c = c.replace(/<div class="section-card">/g, () => '<div class="section-card" id="section-card-' + (cardIndex++) + '">');

    // ===== 5. 确保搜索框有oninput =====
    const searchInputPattern = 'id="search-box"';
    const hasSearchBind = c.includes('filterCustomers');
    if (c.includes(searchInputPattern) && !hasSearchBind) {
      c = c.replace(searchInputPattern, 'id="search-box" oninput="filterCustomers()"');
    }

    fs.writeFileSync('outreach-dashboard/public/index.html', c);
    console.log('Done! Final size:', c.length);
`;

write content to file:
<minimax:tool_call>
<invoke name="write">
<parameter name="path">C:\Users\23889\.qclaw\workspace