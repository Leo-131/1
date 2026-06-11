const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'outreach-dashboard');
const html = fs.readFileSync(path.join(root, 'outreach-dashboard.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'command-center.js'), 'utf8');

test('dashboard loads autonomous command center assets', () => {
  for (const asset of [
    'outreach-engine.js',
    'outreach-analytics.js',
    'autonomous-outreach-results.js',
    'autonomous-outreach-data.js',
    'command-center.css',
    'command-center.js',
  ]) {
    assert.match(html, new RegExp(asset.replace('.', '\\.')));
  }
});

test('command center exposes weekly and monthly reporting controls', () => {
  assert.ok(js.includes("['reports', '汇报中心']"));
  assert.ok(js.includes('analytics.buildPeriodReport'));
  assert.ok(js.includes('data-report-type="weekly"'));
  assert.ok(js.includes('data-report-type="monthly"'));
  assert.ok(js.includes('report-period'));
});

test('reporting center supports CSV export and browser print', () => {
  assert.ok(js.includes('exportCurrentReportCsv'));
  assert.ok(js.includes('text/csv;charset=utf-8'));
  assert.ok(js.includes('window.print()'));
});

test('command center contains separated operational views', () => {
  for (const label of ['开发工作台', '今日队列', '客户附表', 'SEO 趋势', '模板实验', '自动化审计', '系统设置']) {
    assert.ok(js.includes(label), label);
  }
});

test('customer detail opens in a new tab without replacing the shell', () => {
  assert.match(js, /target="_blank"/);
  assert.match(js, /urlFor\('customer'/);
  assert.ok(js.includes('command-center-shell'));
});

test('trend unavailability is visible and not presented as a guessed number', () => {
  assert.ok(js.includes('data_unavailable'));
  assert.ok(js.includes('不显示猜测值'));
});
