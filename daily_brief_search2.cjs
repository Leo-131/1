const cp = require('child_process');
const from = Math.floor(Date.now()/1000) - 86400;
const to = Math.floor(Date.now()/1000);
const script = 'E:\\QCLAW\\resources\\openclaw\\config\\skills\\online-search\\scripts\\prosearch.cjs';

const queries = [
  { keyword: '美伊停火 霍尔木兹海峡', industry: 'news' },
  { keyword: '苹果折叠屏手机 2026', industry: 'news' },
  { keyword: '苏州机器人出海峰会', industry: 'news' },
  { keyword: '原油价格暴跌 霍尔木兹', industry: 'news' },
  { keyword: '美伊会谈 巴基斯坦', industry: 'news' },
  { keyword: '跨境贸易 高水平开放 试点', industry: 'news' },
  { keyword: '特朗普关税 对华贸易', industry: 'news' },
  { keyword: '三安光电 林科闯 留置', industry: 'news' },
];

const results = [];
for (const q of queries) {
  const param = JSON.stringify({ ...q, from_time: from, to_time: to });
  try {
    const r = cp.execFileSync('node', [script, param], { encoding: 'utf8', timeout: 15000 });
    results.push({ query: q.keyword, result: JSON.parse(r) });
  } catch (e) {
    results.push({ query: q.keyword, result: { success: false, message: e.message } });
  }
}
console.log(JSON.stringify(results, null, 2));
