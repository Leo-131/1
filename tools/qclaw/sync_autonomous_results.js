const fs = require('fs');
const path = require('path');
const vm = require('vm');

function resultKey(item) {
  return [item.task_id, item.approval_version, item.status, item.timestamp || ''].join('|');
}

function mergeResults(existing, incoming) {
  const merged = [];
  const seen = new Set();
  for (const item of [...(existing || []), ...(incoming || [])]) {
    if (!item || !item.task_id || !item.status) continue;
    const key = resultKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }
  return merged.sort((a, b) => String(a.timestamp || '').localeCompare(String(b.timestamp || '')));
}

function readResultsScript(file) {
  if (!fs.existsSync(file)) return [];
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
  return Array.isArray(sandbox.window.AUTONOMOUS_OUTREACH_RESULTS)
    ? JSON.parse(JSON.stringify(sandbox.window.AUTONOMOUS_OUTREACH_RESULTS))
    : [];
}

function writeResultsScript(file, results) {
  const temporary = `${file}.tmp`;
  fs.writeFileSync(temporary, `window.AUTONOMOUS_OUTREACH_RESULTS = ${JSON.stringify(results, null, 2)};\n`);
  fs.renameSync(temporary, file);
}

function main() {
  const input = process.argv[2];
  const target = process.argv[3] || path.join('outreach-dashboard', 'autonomous-outreach-results.js');
  const dryRun = process.argv.includes('--dry-run');
  if (!input) throw new Error('Usage: node sync_autonomous_results.js RESULTS_JSON [TARGET_JS] [--dry-run]');
  const incoming = JSON.parse(fs.readFileSync(input, 'utf8'));
  const existing = readResultsScript(target);
  const merged = mergeResults(existing, incoming);
  if (!dryRun) writeResultsScript(target, merged);
  console.log(JSON.stringify({ existing: existing.length, incoming: incoming.length, merged: merged.length, dryRun }));
}

if (require.main === module) main();
module.exports = { mergeResults, readResultsScript, writeResultsScript };

