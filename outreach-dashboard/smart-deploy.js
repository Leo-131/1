#!/usr/bin/env node
/**
 * Minimal production deploy guard for the customer development system.
 *
 * Default behavior:
 * - Deploys only the latest online app files.
 * - Skips deployment when app file content is unchanged.
 * - Allows only 1 production deployment per local day unless --force is used.
 *
 * Usage:
 *   node smart-deploy.js --dry-run
 *   node smart-deploy.js
 *   node smart-deploy.js --force
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const ROOT = __dirname;
const STATE_FILE = path.join(ROOT, ".deploy-state.json");
const DAILY_LIMIT = Number(process.env.DAILY_DEPLOY_LIMIT || 1);
const APP_FILES = [
  "outreach-dashboard.html",
  "index.html",
  "manifest.webmanifest",
  "service-worker.js",
  "icon.svg",
  "vercel.json",
  ".vercelignore",
  "netlify.toml",
];

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const force = args.has("--force");

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function hashFile(file) {
  const fullPath = path.join(ROOT, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Required app file is missing: ${file}`);
  }
  return crypto.createHash("sha256").update(fs.readFileSync(fullPath)).digest("hex");
}

function hashApp() {
  const hashes = {};
  for (const file of APP_FILES) hashes[file] = hashFile(file);
  const combined = APP_FILES.map((file) => `${file}:${hashes[file]}`).join("\n");
  return {
    digest: crypto.createHash("sha256").update(combined).digest("hex"),
    files: hashes,
  };
}

function loadState() {
  if (!fs.existsSync(STATE_FILE)) {
    return { deployments: {}, lastDigest: "", lastFiles: {} };
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`);
}

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    cwd: ROOT,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    throw new Error(`${command} ${commandArgs.join(" ")} failed with exit ${result.status}`);
  }
}

function changedFiles(previousFiles, currentFiles) {
  return APP_FILES.filter((file) => previousFiles[file] !== currentFiles[file]);
}

console.log("=== Minimal Online App Deploy ===");
console.log(`Mode: ${dryRun ? "dry-run" : "production"}${force ? " + force" : ""}`);
console.log(`Daily deploy limit: ${DAILY_LIMIT}`);

const state = loadState();
const current = hashApp();
const day = todayKey();
const todaysCount = state.deployments[day] || 0;
const changes = changedFiles(state.lastFiles || {}, current.files);

console.log(`Current app digest: ${current.digest.slice(0, 12)}`);
console.log(`Deployments today: ${todaysCount}/${DAILY_LIMIT}`);

if (changes.length === 0 && state.lastDigest === current.digest && !force) {
  console.log("No app changes detected. Deployment skipped.");
  process.exit(0);
}

if (changes.length > 0) {
  console.log("Changed app files:");
  for (const file of changes) console.log(`- ${file}`);
}

if (todaysCount >= DAILY_LIMIT && !force) {
  console.log("Daily deployment limit reached locally. Deployment skipped.");
  console.log("Use --force only when you intentionally want to spend another Vercel deployment.");
  process.exit(0);
}

if (dryRun) {
  console.log("Dry run complete. No Vercel deployment was created.");
  process.exit(0);
}

run("vercel", ["deploy", "--prod", "--yes"]);

state.lastDigest = current.digest;
state.lastFiles = current.files;
state.deployments[day] = todaysCount + 1;
state.lastDeploymentAt = new Date().toISOString();
saveState(state);

console.log("Production deploy finished and local deploy state was updated.");
