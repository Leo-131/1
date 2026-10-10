import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {planWorkspace,compactPlan,extractRows} from '../scripts/plan-workspace-round.mjs';
function fixture(t) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'outreach-preflight-'));
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const candidateFile=path.join(dir,'provider.json');
  const sources={'autonomous-outreach-results.js':'AUTONOMOUS_OUTREACH_RESULTS',
    'linkedin-connection-results-latest.js':'LINKEDIN_CONNECTION_RESULTS_LATEST',
    'daily-automation-execution-latest.js':'DAILY_AUTOMATION_EXECUTION_LATEST',
    'google-lead-discovery-latest.js':'GOOGLE_LEAD_DISCOVERY_LATEST'};
  for(const [file,global] of Object.entries(sources))fs.writeFileSync(path.join(dir,file),'window.'+global+'=[];');
  fs.writeFileSync(candidateFile,JSON.stringify({candidates:[{company:'Old'},{company:'Failed'},{company:'Outdoor retailer',domain:'new.test',rawHugeField:'ignore'}]}));
  fs.writeFileSync(path.join(dir,'autonomous-outreach-results.js'),'window.AUTONOMOUS_OUTREACH_RESULTS=[{"company":"Old","status":"sent_confirmed"}];');
  fs.writeFileSync(path.join(dir,'research-failed.json'),JSON.stringify({company:'Failed',retryWithoutNewEvidence:false,status:'source_failed'}));
  return {candidateFile,researchDir:dir,historyDir:dir};
}
test('one-command preflight reads union history and single-company cache, without generated plans',t=>{
  const input=fixture(t);
  fs.writeFileSync(path.join(input.researchDir,'research-provider-preflight-test.json'),JSON.stringify({rows:[{company:'Outdoor retailer',status:'sent_confirmed'}]}));
  const plan=planWorkspace(input);
  assert.deepEqual(plan.rows.map(r=>r.company),['Outdoor retailer']);
  assert.deepEqual(plan.counts,{historical:1,duplicate:0,parked:1});
  assert.equal(plan.inputs.filesRead,6);assert.equal(plan.modelCalls,0);
  assert.equal(plan.sendPerformed,false);assert.equal(plan.requiresLiveVerification,true);
  assert.equal(plan.transport,'iab');assert.equal(plan.batchWaitMs,0);
  assert.equal(compactPlan(plan).rows[0].rawHugeField,undefined);
});
test('missing or malformed history/cache fails closed rather than returning new prospects',t=>{
  const input=fixture(t);
  fs.writeFileSync(path.join(input.historyDir,'linkedin-connection-results-latest.js'),'window.WRONG=[];');
  assert.throws(()=>planWorkspace(input),/Missing history global/);
  fs.writeFileSync(path.join(input.historyDir,'linkedin-connection-results-latest.js'),'window.LINKEDIN_CONNECTION_RESULTS_LATEST=[];');
  fs.writeFileSync(path.join(input.researchDir,'research-failed.json'),'{broken');
  assert.throws(()=>planWorkspace(input),SyntaxError);
});
test('every invocation sees new permanent receipts and snapshot digest changes',t=>{
  const input=fixture(t),first=planWorkspace(input);
  fs.writeFileSync(path.join(input.historyDir,'autonomous-outreach-results.js'),'window.AUTONOMOUS_OUTREACH_RESULTS=[{"company":"Outdoor retailer","status":"send_unconfirmed"}];');
  const next=planWorkspace(input);
  assert.notEqual(next.inputs.snapshotDigest,first.inputs.snapshotDigest);
  assert.ok(!next.rows.some(r=>r.company==='Outdoor retailer'));
  assert.equal(next.sendPerformed,false);
});
test('row extraction accepts arrays and known envelopes but never turns a summary into evidence',()=>{
  for(const value of [[{company:'A'}],{records:[{company:'A'}]},{candidates:[{company:'A'}]},{rows:[{company:'A'}]},{company:'A'}])assert.equal(extractRows(value)[0].company,'A');
  assert.throws(()=>extractRows({confirmed:100}),/No supported/);
});
