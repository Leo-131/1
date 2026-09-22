const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const source = fs.readFileSync(
  path.join(__dirname, '..', 'outreach-dashboard', 'smart-deploy.js'),
  'utf8',
);

test('deploy digest includes command-center reporting assets', () => {
  for (const file of [
    'outreach-analytics.js',
    'autonomous-outreach-data.js',
    'command-center.css',
    'command-center.js',
    'contact-discovery.js',
    'customer-projection.js',
    'workspace-sync-browser.js',
    'i18n.js',
  ]) {
    assert.ok(source.includes(`"${file}"`), file);
  }
});

test('production deploy uses bounded compressed upload and records the attempt first', () => {
  assert.ok(source.includes('"--archive=tgz"'));
  assert.match(source, /timeout:\s*DEPLOY_TIMEOUT_MS/);
  assert.match(source, /state\.deployments\[day\]\s*=\s*todaysCount \+ 1[\s\S]*saveState\(state\)[\s\S]*run\("vercel"/);
});

 test('service worker never intercepts private state APIs or external requests',()=>{
 const vm=require('node:vm'),handlers={};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../outreach-dashboard/service-worker.js'),'utf8'),{URL,self:{location:{origin:'http://localhost:4174'},addEventListener:(name,fn)=>handlers[name]=fn}});
 for(const url of ['http://localhost:4174/api/workspace-state','http://localhost:4174/api/progress','https://example.org/file']){let intercepted=false;handlers.fetch({request:{url,method:'GET'},respondWith(){intercepted=true;}});assert.equal(intercepted,false,url);}
 });
