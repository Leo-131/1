import test from 'node:test';
import assert from 'node:assert/strict';
import '../web/outreach-queue-guard.js';
const guard = globalThis.OutreachQueueGuard;
const keys = row => [row.task_id || row.taskId, row.company].filter(Boolean);

test('all status fields and do-not-resend flag protect uncertain attempts',()=>{
  for(const row of [
    {status:'failed_open',sendStatus:'send_unconfirmed'},
    {status:'send_clicked_outcome_unknown_do_not_resend'},
    {state:'outcome_pending'}, {doNotResend:true}
  ]) {
    const record={company:'A',...row};
    assert.equal(guard.blocked({company:'A'},guard.build([record],keys),keys),true);
    assert.equal(guard.blocked(record,new Map(),keys),true);
  }
});
test('historical uncertain send survives a later failed open and blocks another channel', () => {
  const rows = [{task_id:'old',company:'Agency',status:'send_unconfirmed',timestamp:'2026-07-01'},
    {task_id:'old',company:'Agency',status:'failed_open',timestamp:'2026-09-28'}];
  for (const order of [rows,[...rows].reverse()]) {
    assert.equal(guard.blocked({taskId:'new-instagram',company:'Agency'},guard.build(order,keys),keys),true);
  }
});
test('likes, drafts and failed opens alone are not permanent sends', () => {
  const rows=['post_liked','draft_prepared','failed_open'].map(status=>({company:'Agency',status}));
  assert.equal(guard.blocked({company:'Agency'},guard.build(rows,keys),keys),false);
});
test('confirmed sends and identity mismatches block new outreach; unrelated customers remain eligible', () => {
  const index=guard.build([{company:'Sent',status:'sent_confirmed'},{company:'Wrong',status:'identity_mismatch'}],keys);
  for(const company of ['Sent','Wrong']) assert.equal(guard.blocked({company},index,keys),true);
  assert.equal(guard.blocked({company:'Other'},index,keys),false);
});
