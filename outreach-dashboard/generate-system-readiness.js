'use strict';

const fs = require('node:fs');
const path = require('node:path');
const readiness = require('./system-readiness');

const ROOT = __dirname;
const snapshot = readiness.assess(process.env);
const json = `${JSON.stringify(snapshot, null, 2)}\n`;
const script = `window.SystemReadinessData = ${JSON.stringify(snapshot, null, 2)};\n`;

for (const directory of [ROOT, path.join(ROOT, 'public')]) {
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'system-readiness-latest.json'), json);
  fs.writeFileSync(path.join(directory, 'system-readiness-latest.js'), script);
  if (directory !== ROOT) {
    fs.copyFileSync(path.join(ROOT, 'system-readiness.js'), path.join(directory, 'system-readiness.js'));
    fs.copyFileSync(path.join(ROOT, 'sales-automation-core.js'), path.join(directory, 'sales-automation-core.js'));
  }
}

console.log(JSON.stringify({
  generatedAt: snapshot.generatedAt,
  ready: `${snapshot.readyCount}/${snapshot.totalCount}`,
  score: snapshot.score,
  productionReady: snapshot.productionReady,
}, null, 2));
