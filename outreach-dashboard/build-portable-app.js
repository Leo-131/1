#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = __dirname;
const electronDist = path.join(root, "node_modules", "electron", "dist");
const outRoot = path.join(root, "dist");
const appName = "Customer-Development-System";
const appDir = path.join(outRoot, appName);
const resourcesApp = path.join(appDir, "resources", "app");
const zipPath = path.join(outRoot, `${appName}-Portable.zip`);

const appFiles = [
  "main.js",
  "package.json",
  "outreach-dashboard.html",
  "index.html",
  "manifest.webmanifest",
  "service-worker.js",
  "icon.svg",
  "enhancements.css",
];

function assertInside(parent, target) {
  const relative = path.relative(parent, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside ${parent}: ${target}`);
  }
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.copyFileSync(src, dest);
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function createZipWithRetry() {
  let lastError;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      execFileSync(
        "powershell.exe",
        [
          "-NoProfile",
          "-Command",
          `Compress-Archive -LiteralPath '${appDir.replace(/'/g, "''")}' -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force`,
        ],
        { stdio: "inherit" },
      );
      return;
    } catch (error) {
      lastError = error;
      if (attempt < 5) {
        console.log(`Zip attempt ${attempt} failed; retrying after Windows releases copied files...`);
        sleep(1000);
      }
    }
  }
  throw lastError;
}

if (!fs.existsSync(path.join(electronDist, "electron.exe"))) {
  throw new Error("Electron runtime is missing. Run npm install first.");
}

fs.mkdirSync(outRoot, { recursive: true });
assertInside(outRoot, appDir);
if (fs.existsSync(appDir)) fs.rmSync(appDir, { recursive: true, force: true });
if (fs.existsSync(zipPath)) fs.rmSync(zipPath, { force: true });

copyRecursive(electronDist, appDir);
fs.renameSync(path.join(appDir, "electron.exe"), path.join(appDir, `${appName}.exe`));

fs.mkdirSync(resourcesApp, { recursive: true });
for (const file of appFiles) {
  const src = path.join(root, file);
  if (!fs.existsSync(src)) throw new Error(`Required app file is missing: ${file}`);
  copyRecursive(src, path.join(resourcesApp, file));
}

const appPackage = {
  name: "customer-development-system",
  version: "18.1.1",
  main: "main.js",
};
fs.writeFileSync(path.join(resourcesApp, "package.json"), `${JSON.stringify(appPackage, null, 2)}\n`);

createZipWithRetry();

console.log(`Portable app folder: ${appDir}`);
console.log(`Portable app zip: ${zipPath}`);
