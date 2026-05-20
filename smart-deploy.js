// Smart Deploy v26051902 - Separate data commits from Vercel deployments
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HASH_FILE = path.join(__dirname, '.deploy-hashes.json');
const VERCEL_FILES = ['index.html'].filter(f => fs.existsSync(path.join(__dirname, f)));
const DATA_FILES = ['outreach_data.json', 'outreach_dashboard_v16.html', 'outreach_strategy.json'].filter(f => fs.existsSync(path.join(__dirname, f)));

function getFileHash(filepath) {
  try {
    const content = fs.readFileSync(filepath);
    return crypto.createHash('md5').update(content).digest('hex');
  } catch { return null; }
}

function loadPreviousHashes() {
  try { return JSON.parse(fs.readFileSync(HASH_FILE, 'utf8')); }
  catch { return {}; }
}

function saveHashes(hashes) {
  fs.writeFileSync(HASH_FILE, JSON.stringify(hashes, null, 2));
}

const prev = loadPreviousHashes();
const current = {};

// Check Vercel deployment files
let vercelChanged = false;
VERCEL_FILES.forEach(f => {
  current[f] = getFileHash(path.join(__dirname, f));
  if (current[f] !== prev[f]) {
    console.log(`[VERCEL CHANGED] ${f}: ${prev[f] || 'new'} → ${current[f]}`);
    vercelChanged = true;
  } else {
    console.log(`[VERCEL OK] ${f}: unchanged`);
  }
});

// Check data files
let dataChanged = false;
DATA_FILES.forEach(f => {
  const key = 'data:' + f;
  current[key] = getFileHash(path.join(__dirname, f));
  if (current[key] !== prev[key]) {
    console.log(`[DATA CHANGED] ${f}: ${prev[key] || 'new'} → ${current[key]}`);
    dataChanged = true;
  } else {
    console.log(`[DATA OK] ${f}: unchanged`);
  }
});

if (dataChanged) {
  console.log('\n=== Data changed, committing ===');
  try {
    execSync('git add outreach_data.json outreach_dashboard_v16.html outreach_strategy.json && git commit -m "data: outreach update v26052003"', {
      cwd: __dirname, stdio: 'inherit', timeout: 30000
    });
    console.log('✅ Data committed');
  } catch (e) {
    console.log('⚠️ Data commit failed or nothing to commit:', e.message?.split('\n')[0]);
  }
}

if (vercelChanged) {
  console.log('\n=== Vercel files changed, deploying ===');
  try {
    execSync('git add -A && git commit -m "deploy: outreach update v26052003" && git push', {
      cwd: __dirname, stdio: 'inherit', timeout: 60000
    });
    saveHashes(current);
    console.log('✅ Vercel deploy complete');
  } catch (e) {
    console.log('⚠️ Deploy failed:', e.message);
  }
} else {
  console.log('\n=== No Vercel changes, skipping deploy ===');
  saveHashes(current);
}
