const {test}=require('node:test');
const assert=require('node:assert/strict');
require('../outreach-dashboard/contact-discovery.js');
require('../outreach-dashboard/customer-projection.js');
const C=globalThis.ContactDiscovery,P=globalThis.CustomerProjection;
test('recorded contacts survive execution adapter and unknown country projection',()=>{
 const result={task_id:'one',company:'Test Co',email:'buyer@example.org',country:'Austria',icpScore:82,source:'https://example.org/contact',status:'sent_confirmed',timestamp:'2026-09-14T01:00:00Z'};
 const r=P.reconcile([{taskId:'one',country:'Global / Unspecified'}],P.fromSources([], [result],[]))[0];
 assert.equal(C.points(r)[0].value,result.email);assert.equal(r.country,'Austria');assert.equal(r.icpScore,82);assert.equal(r.sentAt,result.timestamp);
});
test('email absence is not evidence of completed search',()=>{assert.equal(C.emailState({}),'not_searched');assert.equal(C.emailState({contactSearch:{checkedAt:'2026-09-22',status:'failed'}}),'lookup_failed');});
test('social channels remain usable without email; unsafe and irrelevant links rejected',()=>{
 const points=C.points({instagram_url:'https://instagram.com/example',facebook_url:'https://facebook.com/example',linkedin_url:'https://linkedin.com/company/example'});
 assert.deepEqual(points.map(p=>p.type).sort(),['facebook','instagram','linkedin']);
 for(const value of ['https://facebook.com/profile.php?id=1','https://instagram.com/p/a','https://linkedin.com.evil.org/company/x','javascript:alert(1)'])assert.equal(C.social(value),null);
 assert.equal(C.email('leo@flextailgear.com'),'');assert.equal(C.email('unknown'),'');
});
test('public research retains evidence and never fabricates email',()=>{const r={company:'Example',website:'https://example.org',contactPoints:[{type:'email',value:'sales@example.org',status:'published',sourceUrl:'https://example.org/contact'}]};assert.equal(C.points(r)[0].sourceUrl,r.contactPoints[0].sourceUrl);assert.ok(C.searchPlan(r).some(x=>x.url.includes('bing.com')));assert.equal(C.points({company:'Example',website:'https://example.org'}).filter(x=>x.type==='email').length,0);});
