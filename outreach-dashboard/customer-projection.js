(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.CustomerProjection=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const fields={sentAt:'Sent',sentTime:'Sent',repliedAt:'Replied',bouncedAt:'Bounced',contactCapturedAt:'Contact captured',buyerRoutedAt:'Buyer routed',meetingBookedAt:'Meeting booked',positiveReplyAt:'Replied',qualifiedAt:'Qualified',opportunityAt:'Opportunity',sampleSentAt:'Sample sent',quotationSentAt:'Quotation sent',wonAt:'Won'};
  const time=v=>typeof v==='string'&&Number.isFinite(Date.parse(v))?v:'';
  const canonical=v=>String(v||'').trim().toLowerCase();
  function keys(r){return [...new Set([r.taskId,r.task_id,r.automationTaskId,r.id].filter(Boolean).map(v=>'id:'+canonical(v)).concat([r.company||r.name].filter(Boolean).map(v=>'company:'+canonical(v))))];}
  function eventTime(r){return Object.keys(fields).map(k=>time(r[k])).filter(Boolean).sort((a,b)=>Date.parse(b)-Date.parse(a))[0]||'';}
  function reconcile(base,operations){
    const rows=(base||[]).map(r=>({...r})),index=new Map();
    const remember=r=>keys(r).forEach(k=>{if(!index.has(k))index.set(k,r);});rows.forEach(remember);
    for(const source of operations||[]){
      const identity=keys(source);if(!identity.length)continue;
      let target=identity.map(k=>index.get(k)).find(Boolean);
      if(!target){target={...source,name:source.name||source.company||source.taskId||source.id,company:source.company||source.name||source.taskId||source.id,platform:source.platform||'unknown',source:source.source||'execution_history'};rows.push(target);}
      for(const [k,v] of Object.entries(source))if((target[k]===undefined||target[k]===null||target[k]==='')&&v!==undefined)target[k]=v;
      for(const k of Object.keys(fields)){const incoming=time(source[k]);if(incoming&&(!time(target[k])||Date.parse(incoming)>Date.parse(target[k])))target[k]=incoming;}
      const latest=eventTime(target);
      if(latest){target.lastTouch=latest;const stage=Object.keys(fields).filter(k=>time(target[k])===latest).pop();target.status=fields[stage];}
      // Keep every explicit event, so multiple sends and later replies remain inspectable.
      const events=new Map((target.customerEvents||[]).map(e=>[e.field+'|'+e.timestamp,e]));
      for(const k of Object.keys(fields))if(time(source[k]))events.set(k+'|'+source[k],{field:k,timestamp:source[k],evidence:source.evidence||source.automationEvidence||'',taskId:source.taskId||source.id||'',channel:source.platform||''});
      target.customerEvents=[...events.values()].sort((a,b)=>Date.parse(a.timestamp)-Date.parse(b.timestamp));
      remember(target);identity.forEach(k=>index.set(k,target));
    }
    return rows;
  }
  function fromSources(tasks, results, audit) {
    const rows=(tasks||[]).map(r=>({...r}));
    for(const item of [...(results||[]),...(audit||[])]){
      const status=item.status||item.result||item.stage;
      const field=({sent_confirmed:'sentAt',submitted_confirmed:'sentAt',replied:'repliedAt',bounced:'bouncedAt',meeting_booked:'meetingBookedAt'})[status];
      if(!field||!time(item.timestamp))continue;
      const id=item.task_id||item.taskId||item.id;
      const task=rows.find(r=>(r.taskId||r.id)===id)||{};
      rows.push({...task,taskId:id,company:item.company||task.company||item.name||id,name:item.name||task.name||item.company||task.company||id,platform:item.platform||item.channel||task.platform||'unknown',targetUrl:item.target_url||item.targetUrl||task.targetUrl||'',sendStatus:status,evidence:item.evidence||'', [field]:item.timestamp});
    }
    return rows;
  }
  return Object.freeze({reconcile,eventTime,keys,fromSources});
});
