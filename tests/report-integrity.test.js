const test=require('node:test');
const assert=require('node:assert/strict');
require('../outreach-dashboard/outreach-analytics.js');
require('../outreach-dashboard/report-integrity.js');
const build=rows=>globalThis.OutreachAnalytics.buildPeriodReport(rows,{type:'monthly',anchor:'2026-09-22'});
const send=(company,platform)=>({company,platform,sendStatus:'sent_confirmed',sentAt:'2026-09-02T00:00:00Z'});
test('Email, Instagram, Facebook and LinkedIn standalone replies are counted and deduplicated',()=>{
 const rows=['email','ins','fb','li'].flatMap(platform=>[send('One buyer',platform),{company:'One buyer',platform,status:'replied',timestamp:'2026-09-03T00:00:00Z'}]);
 const r=build([...rows,...rows]);assert.equal(r.metrics.sent,1);assert.equal(r.metrics.replied,1);assert.equal(r.rates.replyRate,1);for(const c of r.channels.filter(c=>c.sent)){assert.equal(c.replied,1);assert.equal(c.rate,1);}
});
test('missing collection is unknown; a checked zero is zero; zero denominator is not a percentage',()=>{
 assert.equal(build([send('A','email')]).rates.replyRate,null);
 assert.equal(build([{...send('A','email'),replyCheckedAt:'2026-10-01T00:00:00Z'}]).rates.replyRate,0);
 assert.equal(build([]).rates.replyRate,null);
 assert.deepEqual(build([send('A','email')]).conversion.underperformingSegments,[]);
});
test('a September reply to an August send does not create a September send',()=>{
 const r=build([{...send('A','fb'),sentAt:'2026-08-01T00:00:00Z'},{company:'A',platform:'fb',repliedAt:'2026-09-04T00:00:00Z'}]);assert.equal(r.metrics.sent,0);assert.equal(r.metrics.replied,1);assert.equal(r.rates.replyRate,null);
});
test('explicit timestamp takes priority and invalid times are excluded; public email is not a reply',()=>{
 const r=build([send('A','email'),{company:'A',email:'buyer@example.org',evidence:'public_email_discovered'},{company:'B',repliedAt:'bad',timestamp:'2026-09-04T00:00:00Z',status:'replied'}]);assert.equal(r.metrics.replied,0);assert.equal(r.metrics.contactCaptured,0);assert.ok(r.dataQuality.invalidTimestamps>0);
});
test('automatic reply is classified separately; aliases share customer identity',()=>{
 const r=build([{...send('A','fb'),taskId:'a'},{task_id:'a',platform:'facebook',timestamp:'2026-09-03T00:00:00Z',evidence:'recipient_auto_reply_received'}]);assert.equal(r.metrics.replied,1);assert.equal(r.replyDiagnostics.automated,1);assert.equal(r.replyDiagnostics.human,0);
});
