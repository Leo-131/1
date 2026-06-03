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
 *   node smart-deploy.js --mark-rate-limited
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
  "country-market-data.js",
  "index.html",
  "manifest.webmanifest",
  "service-worker.js",
  "icon.svg",
  "vercel.json",
  ".vercelignore",
  ".netlifyignore",
  "netlify.toml",
];
const SENSITIVE_BLOCKLIST = [
  "credentials.local.json",
  "credentials.plain.json",
  ".env",
  ".env.local",
  ".env.production",
];
const SCAN_FILES = [
  "outreach-dashboard.html",
  "country-market-data.js",
  "index.html",
  "main.js",
  "preload.js",
  "smart-deploy.js",
  "build-portable-app.js",
  "credentials.vault.json",
];

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const force = args.has("--force");
const markRateLimited = args.has("--mark-rate-limited");
const RATE_LIMIT_COOLDOWN_HOURS = Number(process.env.RATE_LIMIT_COOLDOWN_HOURS || 24);

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
    return { deployments: {}, lastDigest: "", lastFiles: {}, rateLimitedUntil: "" };
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
    const output = `${result.stdout || ""}\n${result.stderr || ""}`;
    const error = new Error(`${command} ${commandArgs.join(" ")} failed with exit ${result.status}`);
    error.output = output;
    throw error;
  }
}

function markRateLimitCooldown(state, reason = "Vercel deployment rate limit") {
  const until = new Date(Date.now() + RATE_LIMIT_COOLDOWN_HOURS * 60 * 60 * 1000).toISOString();
  state.rateLimitedUntil = until;
  state.rateLimitedReason = reason;
  state.rateLimitedAt = new Date().toISOString();
  saveState(state);
  return until;
}

function isRateLimitError(error) {
  const output = String(error && (error.output || error.message || ""));
  return (
    output.includes("429") ||
    output.includes("Too Many Requests") ||
    output.includes("api-deployments-free-per-day") ||
    output.includes("Resource is limited")
  );
}

function changedFiles(previousFiles, currentFiles) {
  return APP_FILES.filter((file) => previousFiles[file] !== currentFiles[file]);
}

function scanForSensitiveData() {
  const findings = [];
  for (const file of SENSITIVE_BLOCKLIST) {
    if (fs.existsSync(path.join(ROOT, file))) {
      findings.push(`Blocked plaintext credential file exists: ${file}`);
    }
  }
  const suspicious = [
    /['"](?:password|pass|pwd)['"]\s*:\s*['"][^'"]{6,}['"]/i,
    /\b(?:password|pass|pwd)\s*=\s*['"][^'"]{6,}['"]/i,
    /\b(?:access_token|secret|api_key)\s*=\s*['"][^'"]{12,}['"]/i,
  ];
  for (const file of SCAN_FILES) {
    const fullPath = path.join(ROOT, file);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, "utf8");
    if (file === "credentials.vault.json") {
      const vault = JSON.parse(content || "{}");
      if (vault.username || vault.password || vault.li || vault.fb || vault.ins) {
        findings.push("credentials.vault.json contains plaintext-shaped credential fields.");
      }
      continue;
    }
    for (const pattern of suspicious) {
      if (pattern.test(content)) findings.push(`Suspicious secret-like content in ${file}: ${pattern}`);
    }
  }
  return findings;
}

console.log("=== Minimal Online App Deploy ===");
console.log(`Mode: ${dryRun ? "dry-run" : "production"}${force ? " + force" : ""}`);
console.log(`Daily deploy limit: ${DAILY_LIMIT}`);

const state = loadState();
const current = hashApp();
const day = todayKey();
const todaysCount = state.deployments[day] || 0;
const changes = changedFiles(state.lastFiles || {}, current.files);
const rateLimitedUntil = state.rateLimitedUntil ? new Date(state.rateLimitedUntil) : null;

console.log(`Current app digest: ${current.digest.slice(0, 12)}`);
console.log(`Deployments today: ${todaysCount}/${DAILY_LIMIT}`);

if (markRateLimited) {
  const until = markRateLimitCooldown(state, "Manual 429 cooldown marker");
  console.log(`Rate-limit cooldown recorded until ${until}. No Vercel request was made.`);
  process.exit(0);
}

if (rateLimitedUntil && rateLimitedUntil > new Date() && !force) {
  console.log(`Remote rate-limit cooldown is active until ${state.rateLimitedUntil}. Deployment skipped.`);
  console.log("Use --force only when you intentionally want to test whether the Vercel limit has reset.");
  process.exit(0);
}

if (changes.length === 0 && state.lastDigest === current.digest && !force) {
  console.log("No app changes detected. Deployment skipped.");
  process.exit(0);
}

if (changes.length > 0) {
  console.log("Changed app files:");
  for (const file of changes) console.log(`- ${file}`);
}

const sensitiveFindings = scanForSensitiveData();
if (sensitiveFindings.length > 0) {
  console.log("Sensitive information scan failed:");
  for (const finding of sensitiveFindings) console.log(`- ${finding}`);
  process.exit(1);
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

try {
  run("vercel", ["deploy", "--prod", "--yes"]);
} catch (error) {
  if (isRateLimitError(error)) {
    const until = markRateLimitCooldown(state, "Vercel 429 / deployments per day limit");
    console.log(`Remote rate limit detected. Cooldown recorded until ${until}.`);
    console.log("Deployment skipped for future runs during the cooldown window.");
    process.exit(0);
  }
  throw error;
}

state.lastDigest = current.digest;
state.lastFiles = current.files;
state.deployments[day] = todaysCount + 1;
state.lastDeploymentAt = new Date().toISOString();
state.rateLimitedUntil = "";
state.rateLimitedReason = "";
saveState(state);

console.log("Production deploy finished and local deploy state was updated.");
