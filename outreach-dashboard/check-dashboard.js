const fs = require('fs');

const html = fs.readFileSync('outreach-dashboard.html', 'utf8');
const scripts = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1]);
const handleKpiCard = html.match(/function handleKpiCard\(key\)\{([\s\S]*?)\n\}/);

for (const script of scripts) {
  new Function(script);
}

if (!html.includes('function openKpiDetailPage(key)')) {
  throw new Error('KPI cards must open their details in a new page');
}

if (!html.includes("new URLSearchParams(window.location.search).get('kpi')")) {
  throw new Error('KPI detail pages must restore the selected card from the URL');
}

if (!handleKpiCard || !handleKpiCard[1].includes('openKpiDetailPage(key)')) {
  throw new Error('KPI card click is not routed to the new-page handler');
}

if (handleKpiCard[1].includes('startAutomation(') || handleKpiCard[1].includes('openActionPanel(')) {
  throw new Error('KPI card click still replaces the current dashboard with an in-page panel');
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
