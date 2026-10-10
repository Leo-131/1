import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {planWorkspace} from '../scripts/plan-workspace-round.mjs';
import {planRound} from '../scripts/plan-outreach-round.mjs';
import '../web/outreach-efficiency.js';

test('cached leads are verified first, never promoted by ICP scores or conflicts',()=>{
 const candidates=[{company:'Outdoor retailer'},{company:'Evidence shop'},
   {company:'Conflict shop'},{company:'Score only'}];
 const research=[{company:'Evidence shop',sources:['https://shop.test/contact'],email:'biz@shop.test',icp:60},
   {company:'Conflict shop',sources:['https://conflict.test'],email:'a@conflict.test'},
   {company:'Conflict shop',email:'b@conflict.test'}, {company:'Score only',icp:100}];
 const plan=planRound({candidates,research});
 assert.deepEqual(plan.rows.map(row=>row.company),['Evidence shop','Outdoor retailer','Conflict shop','Score only']);
 assert.equal(plan.rows[0].cachedResearch.eligibleToSend,false);
 assert.equal(plan.sendPerformed,false);assert.equal(plan.modelCalls,0);
 assert.equal(plan.requiresLiveVerification,true);
 assert.deepEqual(candidates.map(row=>row.cachedResearch),[undefined,undefined,undefined,undefined]);
});

test('cached leads outside first 100 seeds are not delayed by uncached seeds',()=>{
 const candidates=Array.from({length:120},(_,i)=>({company:'Retail '+i}));
 const plan=planRound({candidates,research:[{company:'Retail 119',sources:['https://shop.test/contact'],email:'biz@shop.test'}]});
 assert.equal(plan.rows.length,100);assert.equal(plan.rows[0].company,'Retail 119');
 const blocked=planRound({candidates,research:[{company:'Retail 119',sources:['https://shop.test/contact'],email:'biz@shop.test'}],history:[{company:'Retail 119',status:'send_unconfirmed'}]});
 assert.ok(!blocked.rows.some(row=>row.company==='Retail 119'));
 assert.equal(blocked.counts.historical,1);
});

test('pooled discovery reads union history once and retains cross-source group locks',t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'pooled-preflight-'));
 t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const files={'autonomous-outreach-results.js':'AUTONOMOUS_OUTREACH_RESULTS',
  'linkedin-connection-results-latest.js':'LINKEDIN_CONNECTION_RESULTS_LATEST',
  'daily-automation-execution-latest.js':'DAILY_AUTOMATION_EXECUTION_LATEST',
  'google-lead-discovery-latest.js':'GOOGLE_LEAD_DISCOVERY_LATEST'};
 for(const [file,name] of Object.entries(files))fs.writeFileSync(path.join(dir,file),`window.${name}=[];`);
 fs.writeFileSync(path.join(dir,'research-test.json'),'[]');
 const a=path.join(dir,'a.json'),b=path.join(dir,'b.json');
 fs.writeFileSync(a,JSON.stringify([{company:'A',group:'Group'},{company:'Old'}]));
 fs.writeFileSync(b,JSON.stringify({organizations:[{name:'B',parentCompany:'Group'},{name:'New',primary_domain:'new.test'}]}));
 const options={candidateFiles:[a,b],researchDir:dir,historyDir:dir};
 const first=planWorkspace(options);
 assert.equal(first.inputs.candidateFiles,2);assert.equal(first.inputs.filesRead,7);
 assert.equal(first.inputs.candidateRows,4);assert.equal(first.counts.duplicate,1);
 assert.deepEqual(first.rows.map(row=>row.company),['A','Old','New']);
 fs.writeFileSync(path.join(dir,'autonomous-outreach-results.js'),'window.AUTONOMOUS_OUTREACH_RESULTS=[{"company":"New","status":"sent_confirmed"}];');
 const next=planWorkspace(options);
 assert.notEqual(next.inputs.snapshotDigest,first.inputs.snapshotDigest);
 assert.ok(!next.rows.some(row=>row.company==='New'));
 assert.throws(()=>planWorkspace({...options,candidateFiles:[a,a]}),/Duplicate input/);
});
