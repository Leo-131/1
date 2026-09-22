const test=require('node:test'),assert=require('node:assert/strict');
const {requestGlm,compactLead,leadMessages}=require('../outreach-dashboard/glm-service');
const {parseData,createSync}=require('../outreach-dashboard/workspace-sync');
test('lead context excludes bulky payloads and secrets while preserving decision constraints',()=>{
 const lead={company:'Example',sendStatus:'send_unconfirmed',doNotContact:true,evidence:'verified url',apiKey:'secret',rawHtml:'x'.repeat(100000),queue:Array(1000).fill('big')};
 const compact=compactLead(lead);assert.equal(compact.sendStatus,lead.sendStatus);assert.equal(compact.doNotContact,true);assert.ok(!('apiKey' in compact));assert.ok(JSON.stringify(leadMessages(lead)).length<1500);
});
test('identical concurrent decisions share one request; changed history requires a new request',async()=>{
 let calls=0;const fetchImpl=async(_url,opts)=>{calls++;const body=JSON.parse(opts.body);assert.equal(body.max_tokens,600);await new Promise(r=>setTimeout(r,15));return {ok:true,json:async()=>({choices:[{message:{content:'{"verdict":"develop","fitScore":88,"draft":"Hello"}'}}],usage:{total_tokens:110}})};};
 const options={apiKey:'efficiency-test',lead:{company:'Example',status:'new'},fetchImpl};
 const results=await Promise.all([requestGlm(options),requestGlm(options)]);assert.equal(calls,1);assert.equal(results.filter(r=>r.cached).length,1);
 assert.equal((await requestGlm(options)).cached,true);assert.equal(calls,1);
 await requestGlm({...options,lead:{...options.lead,status:'replied'}});assert.equal(calls,2);
});
test('truncated and invalid responses are not cached',async()=>{
 let calls=0;const options={apiKey:'invalid-test',lead:{company:'Invalid'},fetchImpl:async()=>{calls++;return {ok:true,json:async()=>({choices:[{finish_reason:'length',message:{content:'{"verdict":"develop"}'}}]})};}};
 await assert.rejects(requestGlm(options),/truncated/);await assert.rejects(requestGlm(options),/truncated/);assert.equal(calls,2);
});
test('progress parser rejects executable scripts',()=>{
 assert.deepEqual(parseData('window.DATA={"n":1};','DATA'),{n:1});assert.throws(()=>parseData('window.DATA={};fetch("https://evil.test")','DATA'));
});
test('state sync stays on private site and authenticates without sending secrets in payload',async()=>{
 let req;const sync=createSync({credential:()=> 'test-secret',fetchImpl:async(url,opts)=>{req={url,opts};return {ok:true,json:async()=>({ok:true,revision:1,values:{}})};}});
 await sync.state([]);assert.match(req.url,/^https:\/\/flextail-customer-workspace\.leo13111\.chatgpt\.site\/api\/state$/);assert.equal(req.opts.redirect,'error');assert.ok(!req.opts.body.includes('test-secret'));
});
