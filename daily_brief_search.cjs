const cp = require('child_process');
const from = Math.floor(Date.now()/1000) - 86400;
const to = Math.floor(Date.now()/1000);
const script = 'E:\\QCLAW\\resources\\openclaw\\config\\skills\\online-search\\scripts\\prosearch.cjs';

const queries = [
  { keyword: 'AI 今日热点 大模型 最新进展', industry: 'news' },
  { keyword: 'OpenAI Anthropic Google AI news today', industry: 'news' },
  { keyword: '国际新闻 今日热点', industry: 'news' },
  { keyword: 'international news today headlines', industry: 'news' },
  { keyword: '国际贸易 关税 贸易政策 最新', industry: 'news' },
  { keyword: 'trade war tariff supply chain today', industry: 'news' },
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
