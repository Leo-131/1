const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT_JSON = path.join(ROOT, 'google-lead-discovery-latest.json');
const OUT_JS = path.join(ROOT, 'google-lead-discovery-latest.js');
const OUT_CSV = path.join(ROOT, 'google-lead-discovery-latest.csv');

const MARKETS = [
  { country: 'United States', marketStatus: 'open', zone: 'America/New_York', score: 5.2 },
  { country: 'Canada', marketStatus: 'open', zone: 'America/Toronto', score: 5.2 },
  { country: 'United Kingdom', marketStatus: 'open', zone: 'Europe/London', score: 4.5 },
  { country: 'Australia', marketStatus: 'open', zone: 'Australia/Sydney', score: 4.8 },
  { country: 'New Zealand', marketStatus: 'open', zone: 'Pacific/Auckland', score: 4.4 },
  { country: 'Germany', marketStatus: 'open', zone: 'Europe/Berlin', score: 4.6 },
  { country: 'France', marketStatus: 'open', zone: 'Europe/Paris', score: 4.4 },
  { country: 'Netherlands', marketStatus: 'open', zone: 'Europe/Amsterdam', score: 4.3 },
];

const SEGMENTS = [
  { name: 'outdoor retail chain buyer', intent: 98, query: '"outdoor retailer" "buyer" "camping gear"' },
  { name: 'camping gear distributor', intent: 94, query: '"camping gear distributor" "wholesale"' },
  { name: 'RV accessories distributor', intent: 90, query: '"RV accessories distributor" "outdoor power"' },
  { name: 'sporting goods wholesale buyer', intent: 88, query: '"sporting goods" "wholesale buyer" outdoor' },
  { name: 'outdoor equipment importer', intent: 86, query: '"outdoor equipment importer" "camping"' },
];

function csvCell(value) {
  return `"${String(value == null ? '' : value).replace(/"/g, '""')}"`;
}

function googleUrl(query) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function buildLeads(limit = 40) {
  const leads = [];
  for (const market of MARKETS) {
    for (const segment of SEGMENTS) {
      const query = `${segment.query} "${market.country}" -jobs -hiring -amazon -temu -aliexpress`;
      const id = `google-${market.country}-${segment.name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const fitScore = Math.min(100, Math.round(segment.intent + market.score));
      leads.push({
        id,
        name: `${market.country} ${segment.name}`,
        company: `${market.country} ${segment.name}`,
        platform: 'google',
        country: market.country,
        countryEn: market.country,
        fitScore,
        fitTier: fitScore >= 90 ? 'A+' : 'A',
        marketScore: market.score,
        marketStatus: market.marketStatus,
        agencyState: 'open',
        keyword: segment.name,
        query,
        url: googleUrl(query),
        action: 'discover_and_develop',
        reason: 'new_google_search_icp_high_intent',
        source: 'google_search_discovery',
        identityStatus: 'search_required',
        workingTime: {
          dueNow: true,
          timeZone: market.zone,
          localTime: new Date().toLocaleString('en-US', { timeZone: market.zone, weekday: 'short', hour: '2-digit', minute: '2-digit' }),
          nextBest: 'open search results, verify decision-maker or official social profile, then start compliant outreach',
        },
      });
    }
  }
  return leads.sort((left, right) => right.fitScore - left.fitScore).slice(0, limit);
}

function main() {
  const limitArg = process.argv.find(arg => /^--limit=/.test(arg));
  const limit = limitArg ? Number(limitArg.split('=')[1]) : 40;
  const run = {
    generatedAt: new Date().toISOString(),
    mode: 'google-new-lead-discovery',
    objective: 'discover new high-ICP major customers from Google, then verify and develop',
    leads: buildLeads(limit),
  };
  fs.writeFileSync(OUT_JSON, JSON.stringify(run, null, 2));
  fs.writeFileSync(OUT_JS, `window.GOOGLE_LEAD_DISCOVERY_LATEST = ${JSON.stringify(run, null, 2)};\n`);
  const columns = ['rank', 'id', 'country', 'fitScore', 'keyword', 'query', 'url', 'action'];
  const rows = run.leads.map((lead, index) => ({ rank: index + 1, ...lead }));
  fs.writeFileSync(OUT_CSV, [columns.join(','), ...rows.map(row => columns.map(column => csvCell(row[column])).join(','))].join('\n'));
  console.log(JSON.stringify({ count: run.leads.length, json: OUT_JSON, csv: OUT_CSV }, null, 2));
}

if (require.main === module) main();

module.exports = { buildLeads };
