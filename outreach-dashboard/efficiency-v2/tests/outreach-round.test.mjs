import test from 'node:test';
import assert from 'node:assert/strict';
import {planRound,identityKeys} from '../scripts/plan-outreach-round.mjs';
test('one preflight merges company-parent aliases and cached failures',()=>{
  const p=planRound({candidates:[{company:'Child',parentCompany:' GROUP '},{company:'Failed'},{company:'New'}],
    history:[{company:'Group',sendStatus:'sent_confirmed'}],research:[{company:'Failed',status:'source_failed'}]});
  assert.deepEqual(p.rows.map(r=>r.company),['New']);
  assert.deepEqual(p.counts,{historical:1,duplicate:0,parked:1});
  assert.equal(p.transport,'iab');assert.equal(p.modelCalls,0);
  assert.equal(p.sendPerformed,false);assert.equal(p.requiresLiveVerification,true);
});
test('unknown parent identifiers do not group unrelated candidates',()=>{
  assert.deepEqual(identityKeys({company:' A ',group:'unknown'}),['entity:a']);
  assert.equal(planRound({candidates:[{company:'A',group:'unknown'},{company:'B',group:'unknown'}]}).rows.length,2);
});

test('different spellings reuse explicit domain and exact recipient history',()=>{
  const p=planRound({candidates:[{company:'Renamed',website:'https://www.example.test/contact'},
    {company:'Other spelling',publicEmail:'INFO@BUSINESS.TEST'},{company:'Fresh'}],
    history:[{company:'Original',domain:'example.test',status:'sent_confirmed'},
      {company:'Before',recipientEmail:'info@business.test',status:'send_unconfirmed'}]});
  assert.deepEqual(p.rows.map(r=>r.company),['Fresh']);assert.equal(p.counts.historical,2);
});

test('domain-based source failures stay parked and shared platforms do not merge firms',()=>{
  const p=planRound({candidates:[{company:'Translated',websiteUrl:'https://shop.test/about'},
    {company:'Firm B',publicEmail:'b@gmail.com',website:'https://facebook.com/b'},
    {company:'New subdomain',domain:'branch.shop.test'}],
    history:[{company:'Firm A',email:'a@gmail.com',website:'https://facebook.com/a',status:'sent_confirmed'}],
    research:[{company:'Original',domain:'shop.test',status:'source_failed'}]});
  assert.equal(p.counts.parked,1);assert.deepEqual(p.rows.map(r=>r.company),['Firm B','New subdomain']);
  assert.ok(!identityKeys({website:'https://user:password@shop.test'}).length);
});
