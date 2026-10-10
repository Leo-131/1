import test from 'node:test';
import assert from 'node:assert/strict';
import {planRound,identityKeys} from '../scripts/plan-outreach-round.mjs';

test('legacy company and domain aliases share permanent history',()=>{
  const result=planRound({candidates:[{company:'Retail Brand'},{company:'Translated',domain:'shop.test'}],
    history:[{company:'Legal Operator',aliases:['Retail Brand','https://shop.test'],status:'sent_confirmed'}]});
  assert.equal(result.rows.length,0);assert.equal(result.counts.historical,2);
  assert.ok(!identityKeys({aliases:['https://facebook.com/brand']}).includes('domain:facebook.com'));
  assert.ok(!identityKeys({aliases:[{company:'Ignore'}]}).includes('entity:[object object]'));
});

test('explicit no-retry parks legacy failures without silently restarting searches',()=>{
  const previous={company:'A',status:'official_contact_unavailable',retryWithoutNewEvidence:false,
    evidenceRevision:'v1',evidenceSources:['https://a.test/contact']};
  for(const candidate of [{company:'A'},
    {company:'A',evidenceRevision:'v2',evidenceSources:['https://a.test/contact']}]) {
    const result=planRound({candidates:[candidate],research:[previous]});
    assert.equal(result.rows.length,0);assert.equal(result.counts.parked,1);
  }
  const fresh=planRound({candidates:[{company:'A',evidenceRevision:'v2',evidenceSources:['https://a.test/new']}],research:[previous]});
  assert.equal(fresh.rows.length,1);assert.equal(fresh.requiresLiveVerification,true);
  assert.equal(fresh.sendPerformed,false);
});

test('state/result receipts dominate fresh evidence and explicit no-retry',()=>{
  for(const field of ['state','result']) {
    const result=planRound({candidates:[{company:'A',evidenceRevision:'v2',evidenceSources:['https://a.test/new']}],
      research:[{company:'A',[field]:' SEND_UNCONFIRMED ',retryWithoutNewEvidence:false}]});
    assert.equal(result.rows.length,0);assert.equal(result.counts.historical,1);
  }
});
