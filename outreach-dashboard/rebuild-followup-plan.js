const fs = require('fs');

const inputPath = 'daily-outreach-fb-ins-2026-06-03.json';
const jsonPath = 'daily-outreach-fb-ins-2026-06-03.json';
const jsPath = 'daily-outreach-tasks.js';
const csvPath = 'daily-outreach-fb-ins-2026-06-03.csv';

const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const tasks = input.tasks
  .filter(task =>
    task.platform === 'Instagram' &&
    task.source === 'instagram' &&
    task.originalStatus !== 'Rejected'
  )
  .map((task, index) => ({
    ...task,
    priority: index + 1,
    state: task.originalStatus === 'Replied' ? '需跟进' : '待复查',
    action: task.originalStatus === 'Replied'
      ? '已触达客户：仅在 Instagram 正确账号继续跟进，优先获取 WhatsApp/WeChat/邮箱；不要再派生 Facebook 任务'
      : '已发送客户：复查 Instagram 正确账号与最近动态，必要时做轻量跟进；不要再派生 Facebook 任务',
    followupMode: true,
    verifiedPlatform: 'instagram',
    facebookStatus: 'not_verified_do_not_use',
    lastKnownTouch: task.role || task.originalStatus
  }));

const output = {
  generatedAt: new Date().toISOString(),
  strategy: 'Data corrected: Instagram handles are verified Instagram-only follow-up tasks. Facebook tasks are removed unless a verified Facebook page URL exists. Previously touched customers are follow-up/recheck, not new outreach.',
  total: tasks.length,
  tasks
};

function csvEscape(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

const columns = [
  'date',
  'platform',
  'priority',
  'state',
  'name',
  'company',
  'role',
  'tier',
  'country',
  'countryEn',
  'marketScore',
  'marketTier',
  'marketStatus',
  'originalStatus',
  'source',
  'action',
  'fitScore',
  'fitTier',
  'verifiedPlatform',
  'facebookStatus',
  'lastKnownTouch'
];

fs.writeFileSync(jsonPath, JSON.stringify(output, null, 2), 'utf8');
fs.writeFileSync(jsPath, `window.DAILY_OUTREACH_TASKS = ${JSON.stringify(output, null, 2)};\n`, 'utf8');
fs.writeFileSync(csvPath, [
  columns.join(','),
  ...tasks.map(task => columns.map(column => csvEscape(task[column])).join(','))
].join('\n'), 'utf8');

console.log(JSON.stringify({
  total: tasks.length,
  removedFacebookTasks: input.tasks.filter(task => task.platform === 'Facebook').length,
  removedUnverifiedCrmTasks: input.tasks.filter(task => task.source === 'supplement-from-crm').length,
  removedRejectedTasks: input.tasks.filter(task => task.originalStatus === 'Rejected').length,
  first: tasks[0] || null
}, null, 2));
