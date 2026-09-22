(function(root){
'use strict';
const valid=v=>typeof v==='string'&&Number.isFinite(Date.parse(v));
const channel=r=>{const p=String(r.platform||r.channel||'').toLowerCase();const alias={ins:'instagram',ig:'instagram',fb:'facebook',li:'linkedin',alibaba:'email'};if(alias[p])return alias[p];if(['email','instagram','facebook','linkedin'].includes(p))return p;const text=[r.targetUrl,r.target_url,r.taskId,r.task_id].join(' ');return /instagram/i.test(text)?'instagram':/facebook/i.test(text)?'facebook':/linkedin/i.test(text)?'linkedin':/email|mailto|website-contact/i.test(text)?'email':p||'unknown';};
function normalize(records){const identities=new Map();for(const r of records||[])if(r&&r.company)for(const id of [r.taskId,r.task_id,r.id,r.automationTaskId].filter(Boolean))identities.set(String(id).toLowerCase(),r.company);return (records||[]).filter(r=>r&&typeof r==='object').map(r=>{
 const out={...r,platform:channel(r)};if(!out.company)out.company=[r.taskId,r.task_id,r.id,r.automationTaskId].map(id=>identities.get(String(id).toLowerCase())).find(Boolean);out.taskId=r.taskId||r.task_id||r.id;const status=String(r.sendStatus||r.status||r.result||'').toLowerCase();
 const evidence=String(r.replyEvidence||r.evidence||'');
 out.repliedAt=r.repliedAt||r.replyAt||r.replyTimestamp||r.positiveReplyAt||'';
 const marker=/recipient_(?:auto_)?reply_received|recipient_replied|inbound_reply_(?:received|visible)|reply_bubble_visible/i.test(evidence);
 if(!out.repliedAt&&(status==='replied'||status==='reply_received'||marker))out.repliedAt=r.timestamp||'';
 if(out.repliedAt)out.replyType=r.replyType||(/auto_reply|automated_reply/i.test(evidence)?'automated':'unclassified');
 const fields={sent_confirmed:'sentAt',submitted_confirmed:'sentAt',contact_captured:'contactCapturedAt',opportunity_created:'opportunityAt'};
 if(fields[status]&&!out[fields[status]])out[fields[status]]=r.timestamp||'';
 if(['sent_confirmed','submitted_confirmed'].includes(status))out.sendStatus='sent_confirmed';
 return out;
});}
function audit(report){
 const entries=report.eventRecords||[];const sent=new Set(entries.filter(e=>e.events.sent).map(e=>e.customerKey));
 const cohort={sent:sent.size,replied:0,contactCaptured:0,opportunity:0};
 for(const metric of ['replied','contactCaptured','opportunity'])cohort[metric]=new Set(entries.filter(e=>sent.has(e.customerKey)&&e.events[metric]).map(e=>e.customerKey)).size;
 const quality={};
 for(const [metric,field] of [['approved','decisionCheckedAt'],['profiled','profileCheckedAt'],['replied','replyCheckedAt'],['contactCaptured','contactCheckedAt'],['opportunity','opportunityCheckedAt']]){
  const known=new Set(entries.filter(e=>e.events[metric]||e.record[field]&&valid(e.record[field])&&Date.parse(e.record[field])>=Date.parse(report.period.endExclusive)).map(e=>e.customerKey));
  const covered=[...sent].filter(k=>known.has(k)).length;
  quality[metric]={observed:report.metrics[metric],checked:covered,total:sent.size,complete:sent.size>0&&covered===sent.size};
 }
 const ratio=(n,d)=>d>0?n/d:null;
 for(const [name,n,d] of [['profileRate','profiled','discovered'],['approvalRate','approved','profiled'],['sendRate','sent','approved']])if(!report.metrics[d]||report.metrics[n]>report.metrics[d])report.rates[name]=null;
 report.observation=quality;report.cohort=cohort;
 report.rates.replyRate=quality.replied.complete?ratio(cohort.replied,cohort.sent):null;
 report.rates.contactCaptureRate=quality.contactCaptured.complete?ratio(cohort.contactCaptured,cohort.sent):null;
 report.rates.opportunityRate=quality.opportunity.complete?ratio(cohort.opportunity,cohort.sent):null;
 report.rates.discoveryToReplyRate=null;
 report.rates.replyToContactRate=quality.contactCaptured.complete?ratio(cohort.contactCaptured,cohort.replied):null;
 report.rates.replyToOpportunityRate=quality.opportunity.complete?ratio(cohort.opportunity,cohort.replied):null;
 const dimensions={platform:r=>r.platform,countryMarket:r=>r.country||r.market,keyword:r=>r.keyword,template:r=>r.templateId,icpTier:r=>r.icpTier||r.tier};
 const segments=[];
 for(const [dimension,rows] of Object.entries(report.breakdowns||{}))for(const row of rows){
  const group=entries.filter(e=>String(dimensions[dimension](e.record)||'unknown').trim().toLowerCase()===row.label);
  const sends=new Set(group.filter(e=>e.events.sent).map(e=>e.customerKey));
  const replies=new Set(group.filter(e=>e.events.replied).map(e=>e.customerKey));
  const checked=new Set(group.filter(e=>e.events.replied||valid(e.record.replyCheckedAt)&&Date.parse(e.record.replyCheckedAt)>=Date.parse(report.period.endExclusive)).map(e=>e.customerKey));
  const complete=sends.size>0&&[...sends].every(k=>checked.has(k));
  const replied=[...sends].filter(k=>replies.has(k)).length;
  row.rates.replyRate=complete?ratio(replied,sends.size):null;row.rates.contactCaptureRate=null;row.rates.opportunityRate=null;
  if(complete)segments.push({dimension,label:row.label,sent:sends.size,replied,rates:row.rates,confidence:sends.size>=10?'observed_sample':'low_sample'});
 }
 report.conversion={topReplySegments:segments.filter(r=>r.replied>0).sort((a,b)=>b.rates.replyRate-a.rates.replyRate).slice(0,8),underperformingSegments:segments.filter(r=>r.sent>=3&&r.rates.replyRate<0.05).slice(0,8)};
 report.channels=['email','instagram','facebook','linkedin',...new Set(entries.map(e=>e.record.platform).filter(Boolean))].filter((p,i,a)=>a.indexOf(p)===i).map(platform=>{
  const rows=entries.filter(e=>e.record.platform===platform);const sends=new Set(rows.filter(e=>e.events.sent).map(e=>e.customerKey));const replies=new Set(rows.filter(e=>e.events.replied).map(e=>e.customerKey));
  const checked=new Set(rows.filter(e=>e.events.replied||valid(e.record.replyCheckedAt)&&Date.parse(e.record.replyCheckedAt)>=Date.parse(report.period.endExclusive)).map(e=>e.customerKey));
  const covered=[...sends].filter(k=>checked.has(k)).length,converted=[...sends].filter(k=>replies.has(k)).length;
  return {platform,sent:sends.size,replied:replies.size,cohortReplies:converted,checked:covered,rate:sends.size&&covered===sends.size?converted/sends.size:null};
 });
 report.consistency={...report.consistency,funnelMonotonic:null,definition:'Independent timestamped events; cross-period replies do not create sends'};
 return report;
}
root.ReportIntegrity={normalize,audit};
const original=root.OutreachAnalytics.buildPeriodReport;
root.OutreachAnalytics.buildPeriodReport=(records,options)=>audit(original(normalize(records),options));
})(typeof globalThis!=='undefined'?globalThis:this);
