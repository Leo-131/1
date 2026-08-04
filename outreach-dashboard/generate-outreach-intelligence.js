const fs = require('fs');
const path = require('path');
const vm = require('vm');
const intelligence = require('./outreach-intelligence');
const ROOT = __dirname;
function json(file, fallback) { try { return JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8')); } catch { return fallback; } }
function scriptArray(file, name) { try { const box = { window: {} }; vm.createContext(box); vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), box); return box.window[name] || []; } catch { return []; } }
const daily = json('daily-automation-latest.json', {});
const discovery = json('google-lead-discovery-latest.json', {});
const verifiedExternal = json('verified-external-candidates.json', []);
const results = scriptArray('autonomous-outreach-results.js', 'AUTONOMOUS_OUTREACH_RESULTS');
const leads = [...(daily.dailyPotentialPool || []), ...(daily.dailyQueue || []), ...(discovery.leads || []), ...(Array.isArray(verifiedExternal) ? verifiedExternal : [])];
const companies = intelligence.buildCompanyTruth({ leads, results });
const suppressions = intelligence.buildSuppressionLedger(companies);
const portfolio = intelligence.planPortfolio(companies, suppressions);
const learning = intelligence.buildLearning(companies);
const artifact = { schemaVersion: 1, generatedAt: new Date().toISOString(), companies, suppressions, portfolio, learning };
artifact.ownerSummary = intelligence.buildOwnerSummary({ companies, suppressions, portfolio, learning, generatedAt: artifact.generatedAt });
const text = JSON.stringify(artifact, null, 2);
fs.writeFileSync(path.join(ROOT, 'outreach-intelligence-latest.json'), text);
fs.writeFileSync(path.join(ROOT, 'outreach-intelligence-latest.js'), `window.OUTREACH_INTELLIGENCE_LATEST = ${text};\n`);
fs.mkdirSync(path.join(ROOT, 'public'), { recursive: true });
fs.copyFileSync(path.join(ROOT, 'outreach-intelligence-latest.json'), path.join(ROOT, 'public', 'outreach-intelligence-latest.json'));
fs.copyFileSync(path.join(ROOT, 'outreach-intelligence-latest.js'), path.join(ROOT, 'public', 'outreach-intelligence-latest.js'));
console.log(JSON.stringify(artifact.ownerSummary, null, 2));
