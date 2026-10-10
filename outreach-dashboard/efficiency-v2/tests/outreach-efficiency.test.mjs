import test from 'node:test';
import assert from 'node:assert/strict';
import '../web/outreach-efficiency.js';
const {researchIndex,researchFor,modelClient}=globalThis.OutreachEfficiency;
test('indexed research preserves original find precedence and ignores missing IDs',()=>{
  const rows=[{taskId:'b',contactPoints:[]},{taskId:'a'},{taskId:'b',newer:true},{taskId:''}];
  const index=researchIndex(rows);
  for(const record of [{taskId:'a',id:'b'},{id:'a'},{},{automationTaskId:'b'}])
    assert.equal(researchFor(record,index),rows.find(r=>r.taskId&&[record.taskId,record.id,record.automationTaskId].includes(r.taskId)));
});
test('indexing performs one source pass, not customers times research scans',()=>{
  let reads=0;
  const rows=Array.from({length:1000},(_,i)=>({get taskId(){reads++;return String(i);}}));
  const index=researchIndex(rows);const initial=reads;
  for(let i=0;i<10000;i++)assert.ok(researchFor({taskId:String(i%1000)},index));
  assert.equal(reads,initial);assert.ok(initial<=3000);
});
const response=()=>new Response(JSON.stringify({ok:true,text:'Verified public facts',requiresReview:true,sendPerformed:false,usage:{total_tokens:12}}),{status:200});
test('concurrent identical model requests merge and sequential reuse costs zero new tokens',async()=>{
  let calls=0;const client=modelClient(async()=>{calls++;await Promise.resolve();return response();});
  const results=await Promise.all(Array.from({length:10},()=>client.generate('summarize','Public facts')));
  assert.equal(calls,1);assert.equal(results.length,10);
  const cached=await client.generate('summarize','Public facts');assert.equal(cached.usage.total_tokens,0);assert.equal(cached.cached,true);
});
test('failed requests release the lock, and cache expires and separates task and facts',async()=>{
  let clock=0,calls=0;const client=modelClient(async()=>{calls++;if(calls===1)throw Error('offline');return response();},()=>clock);
  await assert.rejects(client.generate('summarize','Facts'));
  await client.generate('summarize','Facts');await client.generate('translate','Facts');
  clock=3600001;await client.generate('summarize','Facts');assert.equal(calls,4);
});
test('responses cannot authorize sending and are not cached if invalid',async()=>{
  const client=modelClient(async()=>new Response(JSON.stringify({ok:true,sendPerformed:true})));
  await assert.rejects(client.generate('summarize','Facts'),/Invalid advisory/);
});
test('batch planning caps at 100 and never turns research or unknown outcomes into sends',()=>{
  const rows=Array.from({length:150},(_,i)=>({company:'Company'+i}));
  const plan=globalThis.OutreachEfficiency.researchBatch(rows,{keys:r=>[r.company],blocked:r=>r.company==='Company0',limit:100});
  assert.equal(plan.rows.length,100);assert.equal(plan.counts.historical,1);assert.equal(plan.sendPerformed,false);assert.equal(plan.requiresLiveVerification,true);
});
test('batch removes group duplicates and parks source failures until a new evidence revision',()=>{
  const keys=r=>[r.company,r.group].filter(Boolean);
  const rows=[{company:'Old'},{company:'Failed'},{company:'New evidence',evidenceRevision:'v2',evidenceSources:['https://example.org/new']},{company:'A',group:'Group'},{company:'B',group:'Group'}];
  const research=[{company:'Failed',researchStatus:'source_failed',evidenceRevision:'v1'},{company:'New evidence',researchStatus:'parked',evidenceRevision:'v1'}];
  const p=globalThis.OutreachEfficiency.researchBatch(rows,{keys,blocked:r=>r.company==='Old',research});
  assert.deepEqual(p.rows.map(r=>r.company),['New evidence','A']);assert.deepEqual(p.counts,{historical:1,duplicate:1,parked:1});
});

test('all cached aliases are checked; a clean company row cannot hide group failure',()=>{
  const keys=r=>[r.company,r.group].filter(Boolean);
  for(const research of [
    [{company:'A'},{group:'G',status:'source_failed'}],
    [{group:'G',status:'source_failed'},{company:'A'}]
  ]) {
    const plan=globalThis.OutreachEfficiency.researchBatch([{company:'A',group:'G'}],{keys,blocked:()=>false,research});
    assert.equal(plan.rows.length,0);assert.equal(plan.counts.parked,1);
  }
});

test('changing a revision without a new source does not restart failed research',()=>{
  const keys=r=>[r.company];
  const old={company:'A',status:'source_failed',evidenceRevision:'v1',evidenceSources:['https://example.org/contact']};
  for(const evidenceSources of [[],['https://example.org/contact'],['javascript:alert(1)']]) {
    const plan=globalThis.OutreachEfficiency.researchBatch([{company:'A',evidenceRevision:'v2',evidenceSources}],{keys,blocked:()=>false,research:[old]});
    assert.equal(plan.counts.parked,1);
  }
});

test('cached unknown outcomes always block even with new research evidence',()=>{
  const plan=globalThis.OutreachEfficiency.researchBatch([{company:'A',evidenceRevision:'v2',evidenceSources:['https://example.org/new']}],{
    keys:r=>[r.company],blocked:()=>false,research:[{company:'A',status:'send_clicked_outcome_unknown_do_not_resend'}]});
  assert.equal(plan.rows.length,0);assert.equal(plan.counts.historical,1);
});
