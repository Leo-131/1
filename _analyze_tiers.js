const d = require('./outreach_data.json');
const c = d.contacts;
let t1=0, t2=0, t3=0, unt=0;
const t1k = ['ceo','president','founder','owner','cmo','coo','managing director','co-founder'];
const t2k = ['vp purchasing','vp procurement','vp sales','vp merchandis','vp product','director of purchas','director of procurement','director of sales','director of merchandis','director of product','strategic sourcing','vp of'];
const t3k = ['senior buyer','category manager','procurement manager','purchasing manager','product manager','merchandis manager','sales manager','buyer','head of buying','sourcing manager'];

c.forEach(x => {
  if (x.excluded) { unt++; return; }
  const r = (x.role || '').toLowerCase();
  if (!r || r.trim() === '') { unt++; return; }
  if (t1k.some(k => r.includes(k))) t1++;
  else if (t2k.some(k => r.includes(k))) t2++;
  else if (t3k.some(k => r.includes(k))) t3++;
  else unt++;
});

console.log('Tier1:', t1);
console.log('Tier2:', t2);
console.log('Tier3:', t3);
console.log('NonTarget:', unt);

// Check new designers not yet excluded
const dk = ['designer','creative director','art director','ux design','ui design','graphic design','product design','industrial design','visual design','photographer'];
const newDesigners = c.filter(x => !x.excluded && dk.some(k => (x.role || '').toLowerCase().includes(k)));
console.log('\nNew designers to exclude:', newDesigners.length);
newDesigners.forEach(x => console.log('  [需排除]', x.name, '-', x.role, '@', x.company));

// Count unmarked non-target roles
const allTarget = [...t1k, ...t2k, ...t3k];
const nontargetNamed = c.filter(x => !x.excluded && x.role && x.role.trim() && !allTarget.some(k => (x.role||'').toLowerCase().includes(k)));
console.log('\nNon-target named roles (sample 20):');
const uniqueRoles = [...new Set(nontargetNamed.map(x => x.role))].slice(0, 30);
uniqueRoles.forEach(r => {
  const cnt = nontargetNamed.filter(x => x.role === r).length;
  console.log('  ' + r + ' (' + cnt + ')');
});
