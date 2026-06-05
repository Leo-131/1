const fs = require('fs');

const html = fs.readFileSync('outreach-dashboard.html', 'utf8');
const scripts = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1]);

for (const script of scripts) {
  new Function(script);
}

global.window = global;
require('./country-market-data.js');
require('./daily-outreach-tasks.js');

if (COUNTRY_ALIASES.usa !== '美国') {
  throw new Error('country aliases failed');
}

if (!DAILY_OUTREACH_TASKS || DAILY_OUTREACH_TASKS.total < 10) {
  throw new Error('daily outreach tasks failed');
}

if ((DAILY_OUTREACH_TASKS.tasks || []).some(task => task.platform === 'Facebook' && task.facebookStatus === 'not_verified_do_not_use')) {
  throw new Error('unverified facebook task leaked');
}

console.log('checks ok');
