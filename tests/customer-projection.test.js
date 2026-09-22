const test = require('node:test');
const assert = require('node:assert/strict');
require('../outreach-dashboard/customer-projection.js');
const p=globalThis.CustomerProjection;
test('execution-only customers are retained and replay is idempotent',()=>{
 const op={taskId:'a',company:'Example',sentAt:'2026-09-14T07:42:00Z',evidence:'confirmation'};
 const one=p.reconcile([], [op,op]);assert.equal(one.length,1);assert.equal(one[0].status,'Sent');assert.equal(one[0].customerEvents.length,1);assert.deepEqual(p.reconcile(one,[op]),one);
});
test('new replies win over old sends regardless of arrival order; failed opens are not sends',()=>{
 const base=[{id:'a',company:'Example',email:'buyer@example.test',sentAt:'2026-09-01T00:00:00Z'}];
 const ops=[{taskId:'a',repliedAt:'2026-09-15T00:00:00Z'},{taskId:'a',sentAt:'2026-09-14T00:00:00Z'},{taskId:'a',sendStatus:'failed_open',resultCheckedAt:'2026-09-20T00:00:00Z'}];
 for(const list of [ops,[...ops].reverse()]){const row=p.reconcile(base,list)[0];assert.equal(row.status,'Replied');assert.equal(row.lastTouch,'2026-09-15T00:00:00Z');assert.equal(row.email,'buyer@example.test');assert.equal(row.sentAt,'2026-09-14T00:00:00Z');}
 assert.equal(base[0].sentAt,'2026-09-01T00:00:00Z');
 assert.equal(p.eventTime({sendStatus:'failed_open',lastTouch:'2026-09-20T00:00:00Z'}),'');
});
test('distinct companies sharing a platform are not merged',()=>{
 assert.equal(p.reconcile([], [{company:'A',platform:'facebook'},{company:'B',platform:'facebook'}]).length,2);
});

test('audit-only sends and replies enter the shared source; missing or failed timestamps do not count',()=>{
 const rows=p.fromSources([],[],[{taskId:'a',result:'sent_confirmed',timestamp:'2026-09-14T00:00:00Z'},{taskId:'a',result:'replied',timestamp:'2026-09-15T00:00:00Z'},{taskId:'b',result:'sent_confirmed',timestamp:''},{taskId:'c',result:'failed_open',timestamp:'2026-09-15T00:00:00Z'}]);
 assert.equal(rows.length,2);const projected=p.reconcile([],rows);assert.equal(projected.length,1);assert.equal(projected[0].status,'Replied');assert.equal(projected[0].customerEvents.length,2);
});
