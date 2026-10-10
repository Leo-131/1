import test from 'node:test';
import assert from 'node:assert/strict';
import '../web/outreach-efficiency.js';
import {planRound} from '../scripts/plan-outreach-round.mjs';
import {executionPacket} from '../scripts/plan-workspace-round.mjs';
const context=globalThis.OutreachEfficiency.researchContext;
test('packet carries existing source and contact leads without inventing eligibility',()=>{
 const rows=[{company:'Shop',domain:'shop.test'}];
 const research=[{company:'Old shop spelling',domain:'shop.test',publicEmail:'BIZ@SHOP.TEST',
   sources:['https://shop.test/contact'],icp:74,rawBody:'Do not return full page'}];
 const packet=executionPacket(planRound({candidates:rows,research}),10);
 const facts=packet.rows[0].cachedResearch;
 assert.deepEqual(facts.sourceUrls,['https://shop.test/contact']);
 assert.deepEqual(facts.contactCandidates,['biz@shop.test']);assert.deepEqual(facts.observedScores,[74]);
 assert.equal(facts.eligibleToSend,false);assert.equal(packet.packet.eligibleToSend,false);
 assert.equal(packet.rows[0].icp,undefined);assert.equal(packet.rows[0].publicEmail,undefined);
 assert.equal(packet.rows[0].rawBody,undefined);assert.equal(rows[0].cachedResearch,undefined);
});
test('group-only match cannot transfer another subsidiary contact or score',()=>{
 const facts=context([{company:'New subsidiary',group:'Holding'}],
   [{company:'Other subsidiary',group:'Holding',publicEmail:'other@other.test',icp:95}])[0].cachedResearch;
 assert.equal(facts,undefined);
});
test('conflicting cache facts are explicit and always require live checks',()=>{
 const research=[{company:'Shop',email:'a@shop.test',icp:72},{company:'Shop',email:'b@shop.test',icp:69}];
 const first=context([{company:'Shop'}],research)[0].cachedResearch;
 assert.equal(first.contactConflict,true);assert.equal(first.scoreConflict,true);
 assert.equal(first.matchedRecords,2);assert.equal(first.eligibleToSend,false);
 research.push({company:'Shop',sources:['https://shop.test/new']});
 assert.equal(context([{company:'Shop'}],research)[0].cachedResearch.matchedRecords,3);
});
test('bounds URL/contact output and rejects malformed or credential URLs',()=>{
 const research=Array.from({length:20},(_,i)=>({company:'Shop',email:`biz${i}@shop.test`,sources:[`https://shop.test/${i}`]}));
 research.push({company:'Shop',email:'bad',sources:['javascript:alert(1)','https://user:pass@shop.test/','https://shop.test/?api_key=secret']});
 const facts=context([{company:'Shop'}],research)[0].cachedResearch;
 assert.equal(facts.sourceUrls.length,6);assert.equal(facts.sourceCount,20);assert.equal(facts.contactCandidates.length,3);
});
test('cached contexts do not override history and unknown-send locks',()=>{
 const plan=planRound({candidates:[{company:'Shop',domain:'shop.test'}],
  research:[{company:'Shop',publicEmail:'a@shop.test'}],
  history:[{company:'Shop',status:'send_unconfirmed'}]});
 assert.equal(plan.rows.length,0);assert.equal(plan.counts.historical,1);
});
