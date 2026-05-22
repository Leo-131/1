const data = require('./outreach_data.json');
const contacts = data.contacts;

// Designer keywords
const designerKeywords = ['designer','creative director','art director'];
const designers = contacts.filter(c => {
  const r = (c.role || '').toLowerCase();
  return designerKeywords.some(k => r.includes(k));
});

// Count by source
const bySource = {};
contacts.forEach(c => { bySource[c.source] = (bySource[c.source]||0) + 1; });

// Count by status
const byStatus = {};
contacts.forEach(c => { byStatus[c.status] = (byStatus[c.status]||0) + 1; });

// Tier classification
const tier1R = ['ceo','president','founder','owner','cmo','coo','managing director','co-founder','chief executive','chief marketing'];
const tier2R = ['vp purchasing','vp procurement','vp sales','vp merchandising','vp product','director of purchasing','director of procurement','director of sales','director of merchandising','director of product','vp of operations','vp of marketing','strategic sourcing director','director of partnerships','director of product development','director of marketing','head of buying','head of merchandising'];
const tier3R = ['senior buyer','category manager','procurement manager','purchasing manager','product manager','merchandising manager','sales manager','buyer','sourcing manager','brand manager','product sourcing'];

let t1=0,t2=0,t3=0,nt=0,nr=0;
const ntRoles = {};
contacts.forEach(c => {
  const r = (c.role||'').toLowerCase();
  if(!r){nr++;return;}
  if(tier1R.some(k=>r.includes(k)))t1++;
  else if(tier2R.some(k=>r.includes(k)))t2++;
  else if(tier3R.some(k=>r.includes(k)))t3++;
  else {nt++; ntRoles[c.role]=(ntRoles[c.role]||0)+1;}
});

// Salesrobot active
let srA=0;
contacts.filter(c=>c.source==='salesrobot').forEach(c=>{
  if(c.status&&c.status.includes('out of')&&!c.status.startsWith('0 out of'))srA++;
});

// Accepted/Pending/Failed from non-salesrobot
let accepted=0, pending=0, failed=0;
contacts.filter(c=>c.source!=='salesrobot').forEach(c=>{
  if(c.status==='Accepted')accepted++;
  else if(c.status==='Pending')pending++;
  else if(c.status==='Failed')failed++;
});

console.log('TOTAL:',contacts.length);
console.log('SOURCE:',JSON.stringify(bySource));
console.log('STATUS_NSR: accepted='+accepted+' pending='+pending+' failed='+failed);
console.log('SR_ACTIVE:',srA);
console.log('TIER: T1='+t1+' T2='+t2+' T3='+t3+' NT='+nt+' NoRole='+nr);
console.log('DESIGNERS:',designers.length);
designers.forEach(d=>console.log('  [需排除]',d.name,'|',d.role,'|',d.company));
console.log('TOP_NONTARGET:');
Object.entries(ntRoles).sort((a,b)=>b[1]-a[1]).slice(0,15).forEach(([k,v])=>console.log(' ',v+'x',k));
