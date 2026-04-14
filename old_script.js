
// Clock
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setInterval(updateClock, 1000);
updateClock();

// Timezones
const timezones = [
  { name: '北美东部', flag: '🇺🇸', tz: 'America/New_York', work: [9, 17] },
  { name: '北美中部', flag: '🇺🇸', tz: 'America/Chicago', work: [9, 17] },
  { name: '北美西部', flag: '🇺🇸', tz: 'America/Los_Angeles', work: [9, 17] },
  { name: '欧洲中部', flag: '🇨🇭', tz: 'Europe/Zurich', work: [9, 18] },
  { name: '澳洲东部', flag: '🇦🇺', tz: 'Australia/Sydney', work: [9, 17] }
];

function updateTimezones() {
  const container = document.getElementById('tzBar');
  const now = new Date();
  container.innerHTML = timezones.map(tz => {
    const local = new Date(now.toLocaleString('en-US', { timeZone: tz.tz }));
    const hour = local.getHours();
    const isWorking = hour >= tz.work[0] && hour < tz.work[1];
    const timeStr = local.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    return `<div class="tz-item">
      <div class="flag">${tz.flag}</div>
      <div><div class="name">${tz.name}</div><div class="time">${timeStr} (${tz.work[0]}:00-${tz.work[1]}:00)</div></div>
      <div class="status ${isWorking ? 'working' : 'off'}">${isWorking ? '🟢 工作中' : '⚫ 休息'}</div>
    </div>`;
  }).join('');
}
setInterval(updateTimezones, 60000);
updateTimezones();

// Today Progress Ring
function updateTodayProgress(sent, total) {
  const percent = Math.round(sent / total * 100);
  const circumference = 2 * Math.PI * 24;
  const offset = circumference * (1 - sent / total);
  document.getElementById('todayRing').style.strokeDashoffset = offset;
  document.getElementById('todayPercent').textContent = percent + '%';
}
updateTodayProgress(0, 100);

// Panel collapse
function collapsePanel(btn) {
  const panel = btn.closest('.panel');
  panel.classList.toggle('collapsed');
  btn.textContent = panel.classList.contains('collapsed') ? '+' : '−';
}

// Reset panel
function resetPanel(btn) {
  const panel = btn.closest('.panel');
  panel.style.width = '';
  panel.style.height = '';
  showToast('面板已重置');
}

// Version toggle
function toggleVersion(header) {
  const item = header.closest('.version-item');
  item.classList.toggle('expanded');
}

// Toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show success';
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// Drag & Drop
let draggedPanel = null;
document.querySelectorAll('.panel-header').forEach(header => {
  header.addEventListener('mousedown', e => {
    if (e.target.tagName === 'BUTTON') return;
    draggedPanel = header.closest('.panel');
    draggedPanel.classList.add('dragging');
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
  });
});

function onDrag(e) {
  if (!draggedPanel) return;
  // Simple drag logic placeholder
}

function stopDrag() {
  if (draggedPanel) {
    draggedPanel.classList.remove('dragging');
    draggedPanel = null;
  }
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
}

// Resize
document.querySelectorAll('.resize-handle').forEach(handle => {
  let isResizing = false;
  let startX, startY, startW, startH;
  
  handle.addEventListener('mousedown', e => {
    isResizing = true;
    const panel = handle.closest('.panel');
    startX = e.clientX;
    startY = e.clientY;
    startW = panel.offsetWidth;
    startH = panel.offsetHeight;
    panel.classList.add('resizing');
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  });
  
  function resize(e) {
    if (!isResizing) return;
    const panel = handle.closest('.panel');
    panel.style.width = (startW + e.clientX - startX) + 'px';
    panel.style.minHeight = (startH + e.clientY - startY) + 'px';
  }
  
  function stopResize() {
    isResizing = false;
    handle.closest('.panel').classList.remove('resizing');
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
    showToast('尺寸已调整');
  }
});

// Toggle version log
document.querySelector('.vlog-header').addEventListener('click', function(e) {
  if (e.target === this) {
    const body = document.getElementById('vlogBody');
    body.style.display = body.style.display === 'none' ? 'block' : 'none';
  }
});

// Drag version log
let vlogDragging = false, vlogX, vlogY;
function startDragVLog(e) {
  const vlog = document.getElementById('versionLog');
  vlogDragging = true;
  vlogX = e.clientX - vlog.offsetLeft;
  vlogY = e.clientY - vlog.offsetTop;
  document.addEventListener('mousemove', dragVLog);
  document.addEventListener('mouseup', stopDragVLog);
}
function dragVLog(e) {
  if (!vlogDragging) return;
  const vlog = document.getElementById('versionLog');
  vlog.style.left = (e.clientX - vlogX) + 'px';
  vlog.style.top = (e.clientY - vlogY) + 'px';
  vlog.style.right = 'auto';
  vlog.style.bottom = 'auto';
}
function stopDragVLog() {
  vlogDragging = false;
  document.removeEventListener('mousemove', dragVLog);
  document.removeEventListener('mouseup', stopDragVLog);
}

console.log('✅ v0.3.0 loaded - 完整37人客户数据');
