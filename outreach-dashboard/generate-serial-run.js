const fs = require('fs');

const input = process.argv[2] || 'daily-outreach-fb-ins-2026-06-03.json';
const date = process.argv[3] || new Date().toISOString().slice(0, 10);
const plan = JSON.parse(fs.readFileSync(input, 'utf8'));

function instagramHandle(task) {
  const raw = String(task.name || '').trim().replace(/^@/, '');
  return /^[a-zA-Z0-9._]{2,30}$/.test(raw) ? raw : '';
}

function cleanSearch(task) {
  return [task.company, task.name]
    .map(value => String(value || '')
      .replace(/\([^)]*\)/g, '')
      .replace(/\b(US|UK|AU|NZ|Canada|United States|United Kingdom)\b/gi, '')
      .trim())
    .filter(Boolean)
    .join(' ');
}

function priorityScore(task) {
  let score = (task.fitScore || 0) + Math.round((task.marketScore || 0) * 10);
  const status = String(task.originalStatus || task.status || '').toLowerCase();
  const text = String(task.company || '').toLowerCase() + ' ' + String(task.role || '').toLowerCase();

  if (status.includes('replied')) score += 45;
  if (status.includes('accepted')) score += 35;
  if (status.includes('sent')) score += 18;
  if (/buyer|buying|category|procurement|sourcing|merchandis|owner|founder|ceo|director|vp|head/.test(text)) score += 24;
  if (/retail|store|shop|outdoor|camping|rv|caravan|distributor|wholesale|supplier|gear/.test(text)) score += 22;
  if (String(task.platform).toLowerCase().includes('instagram') && instagramHandle(task)) score += 12;
  if (String(task.platform).toLowerCase().includes('facebook')) score += 6;
  if (String(task.country || '') === 'Unknown') score -= 16;

  return score;
}

function targetUrl(task) {
  const platform = String(task.platform).toLowerCase().includes('facebook') ? 'fb' : 'ins';
  const query = encodeURIComponent(cleanSearch(task));
  const handle = instagramHandle(task);
  if (platform === 'ins' && handle) return `https://www.instagram.com/${encodeURIComponent(handle)}/`;
  return `https://www.facebook.com/search/top/?q=${query}`;
}

function draftMessage(task) {
  const channel = String(task.platform).toLowerCase().includes('facebook') ? 'Facebook page/group' : 'Instagram account';
  const followup = task.followupMode || ['Replied', 'Sent'].includes(task.originalStatus);
  if (followup) {
    return [
      `Hi ${task.name || task.company},`,
      '',
      `Following up from our previous touchpoint on your verified ${channel}. Flextail / Vollyc builds compact outdoor power and camping gear for retailers, distributors, and RV/outdoor customers.`,
      '',
      'Could you share the best buyer or partnership contact so I can send the product and margin summary to the right person? WhatsApp, WeChat, or email is perfect.',
      '',
      'Thanks, David'
    ].join('\n');
  }
  return [
    `Hi ${task.name || task.company},`,
    '',
    `I found your ${channel} while mapping outdoor retail and camping gear partners. Flextail / Vollyc builds compact outdoor power and camping gear for retailers, distributors, and RV/outdoor customers.`,
    '',
    'Would you be open to sharing the best buyer or partnership contact? WhatsApp, WeChat, or email is perfect. I can also send a short product and margin summary first.',
    '',
    'Thanks, David'
  ].join('\n');
}

function csvEscape(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

const rows = plan.tasks
  .map(task => ({
    rank: 0,
    platform: String(task.platform).toLowerCase().includes('facebook') ? 'fb' : 'ins',
    name: task.name,
    company: task.company,
    country: task.country,
    countryEn: task.countryEn,
    marketScore: task.marketScore,
    marketTier: task.marketTier,
    fitScore: task.fitScore,
    fitTier: task.fitTier,
    originalPriority: task.priority,
    priorityScore: priorityScore(task),
    url: targetUrl(task),
    draftMessage: draftMessage(task),
    state: 'pending_manual_development'
  }))
  .sort((a, b) => b.priorityScore - a.priorityScore || a.originalPriority - b.originalPriority || String(a.company).localeCompare(String(b.company)))
  .map((row, index) => ({
    ...row,
    rank: index + 1,
    state: index === 0 ? 'opened_in_chrome' : row.state
  }));

const result = {
  generatedAt: new Date().toISOString(),
  mode: 'serial-one-chrome-window-at-a-time',
  openedFirst: rows[0] || null,
  total: rows.length,
  rows
};

fs.writeFileSync(`today-automation-run-${date}.json`, JSON.stringify(result, null, 2));

const csvColumns = ['rank', 'platform', 'name', 'company', 'country', 'countryEn', 'marketScore', 'marketTier', 'fitScore', 'fitTier', 'originalPriority', 'priorityScore', 'url', 'state'];
fs.writeFileSync(
  `today-automation-run-${date}.csv`,
  [csvColumns.join(','), ...rows.map(row => csvColumns.map(column => csvEscape(row[column])).join(','))].join('\n')
);

console.log(JSON.stringify({ total: rows.length, openedFirst: rows[0] || null }, null, 2));
