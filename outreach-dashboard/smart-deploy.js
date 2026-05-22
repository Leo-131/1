#!/usr/bin/env node
/**
 * smart-deploy.js - Intelligent deployment checker for Outreach Dashboard
 * Only triggers Vercel deployment when actual file content changes are detected
 * 
 * Usage: node smart-deploy.js [--force] [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const DASHBOARD_DIR = __dirname;
const HASH_FILE = path.join(process.env.HOME || process.env.USERPROFILE, '.qclaw', 'workspace', 'deploy_hashes.json');
const FILES_TO_WATCH = ['index.html', 'enhancements.css', 'service-worker.js', 'manifest.webmanifest'];

function getFileHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

function loadHashes() {
  if (fs.existsSync(HASH_FILE)) {
    return JSON.parse(fs.readFileSync(HASH_FILE, 'utf8'));
  }
  return {};
}

function saveHashes(hashes) {
  const dir = path.dirname(HASH_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(HASH_FILE, JSON.stringify(hashes, null, 2));
}

function checkChanges() {
  const previous = loadHashes();
  const current = {};
  const changes = [];

  for (const file of FILES_TO_WATCH) {
    const fullPath = path.join(DASHBOARD_DIR, file);
    const hash = getFileHash(fullPath);
    current[file] = hash;
    
    if (!previous[file]) {
      changes.push({ file, type: 'NEW' });
    } else if (previous[file] !== hash) {
      changes.push({ file, type: 'MODIFIED' });
    }
  }

  return { previous, current, changes };
}

function deploy() {
  try {
    console.log('🚀 Starting deployment...');
    execSync('git add -A', { cwd: DASHBOARD_DIR, stdio: 'inherit' });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    execSync(`git commit -m "deploy: ${timestamp}"`, { cwd: DASHBOARD_DIR, stdio: 'inherit' });
    execSync('git push', { cwd: DASHBOARD_DIR, stdio: 'inherit' });
    console.log('✅ Deployment complete!');
    return true;
  } catch (e) {
    console.error('❌ Deployment failed:', e.message);
    return false;
  }
}

// Main
const args = process.argv.slice(2);
const force = args.includes('--force');
const dryRun = args.includes('--dry-run');

console.log('=== Smart Deploy v1.0 ===');
console.log(`Dashboard dir: ${DASHBOARD_DIR}`);

const { current, changes } = checkChanges();

if (changes.length === 0 && !force) {
  console.log('✅ No file changes detected. Skipping deployment.');
  console.log('Use --force to deploy anyway.');
  process.exit(0);
}

if (changes.length > 0) {
  console.log('📋 Changes detected:');
  changes.forEach(c => console.log(`  ${c.type}: ${c.file}`));
}

if (dryRun) {
  console.log('🏃 Dry run - would deploy but not actually pushing.');
  process.exit(0);
}

if (force) {
  console.log('⚡ Force mode enabled.');
}

const success = deploy();
if (success) {
  saveHashes(current);
  console.log('💾 Hashes saved.');
}
