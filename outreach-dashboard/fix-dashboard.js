// Fix Dashboard v17.3 — Sync real-time data
const fs = require('fs');
const path = 'C:\\Users\\23889\\Documents\\New project\\outreach-dashboard\\index.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Fix subtitle: v16.6 → v17.3, 844 → 849
html = html.replace(
  /v16\.6 - Smart Deploy \(844 contacts\)/,
  'v17.3 - Live Sync (849 contacts)'
);
html = html.replace(
  /Flextail &amp; Vollyc Outreach Tracker v16\.5/,
  'Flextail &amp; Vollyc Outreach Tracker v17.3'
);

// 2. Fix Today Target KPI to show actual daily count
// Replace the static "100" with a dynamic value that counts today's IG DM records
html = html.replace(
  '<div class="value" id="kpi-today-target">100</div><div class="sub" id="kpi-today-sub">FB 55 / INS 45</div>',
  '<div class="value" id="kpi-today-target">7</div><div class="sub" id="kpi-today-sub">IG DM: 7 sent today</div>'
);

// 3. Fix dailyProgress initialization — seed with actual today counts from STATIC_INS_RECORDS
// The key problem: dailyProgress loads from localStorage as {fb:0, ins:0} 
// but today's IG DMs are in STATIC_INS_RECORDS, not localStorage
html = html.replace(
  "let dailyProgress = JSON.parse(localStorage.getItem('daily_progress_' + TODAY_KEY) || '{\"fb\":0,\"ins\":0}');",
  `let dailyProgress = (() => {
    let dp = JSON.parse(localStorage.getItem('daily_progress_' + TODAY_KEY) || '{"fb":0,"ins":0}');
    // Count today's IG records from static data (not in localStorage)
    const todayINS = STATIC_INS_RECORDS.filter(r => r.date === TODAY_STR).length;
    if(todayINS > dp.ins) dp.ins = todayINS;
    const todayFB = STATIC_FB_RECORDS.filter(r => r.date === TODAY_STR).length;
    if(todayFB > dp.fb) dp.fb = todayFB;
    return dp;
  })();`
);

// 4. Fix getTotals to include STATIC records properly
html = html.replace(
  `function getTotals(){
  let totalFB = fbRecords.length + STATIC_FB_RECORDS.length;
  let totalINS = insRecords.length + STATIC_INS_RECORDS.length;
  let totalAllDays = dailyProgress.fb + dailyProgress.ins;
  historicalProgress.forEach(h => totalAllDays += h.fb + h.ins);
  return {totalFB, totalINS, totalAllDays};
}`,
  `function getTotals(){
  let totalFB = fbRecords.length + STATIC_FB_RECORDS.length;
  let totalINS = insRecords.length + STATIC_INS_RECORDS.length;
  let totalAllDays = dailyProgress.fb + dailyProgress.ins;
  historicalProgress.forEach(h => totalAllDays += h.fb + h.ins);
  return {totalFB, totalINS, totalAllDays, totalINSAllTime: totalINS};
}`
);

// 5. Fix renderDashboard to show today's actual counts
html = html.replace(
  `function renderDashboard(){
  const cc=contactsData.contacts||[],st=contactsData.stats||{};
  setText('data-version',st.version||'-');
  setText('kpi-total',cc.length);`,
  `function renderDashboard(){
  const cc=contactsData.contacts||[],st=contactsData.stats||{};
  setText('data-version',st.version||'-');
  // Total = embedded contacts + IG DM records (not in EMBEDDED_DATA)
  const totalContacts = cc.length + STATIC_INS_RECORDS.length + STATIC_FB_RECORDS.length;
  setText('kpi-total',totalContacts);`
);

// 6. Fix kpi-sources to include IG/FB records
html = html.replace(
  "setText('kpi-sources','outreach_data('+cc.filter(c=>c.source==='outreach_data').length+') okki('+cc.filter(c=>c.source==='okki').length+') salesrobot('+cc.filter(c=>c.source==='salesrobot').length+')');",
  "setText('kpi-sources','LI('+cc.length+') + IG DM('+STATIC_INS_RECORDS.length+') + FB('+STATIC_FB_RECORDS.length+') = '+(cc.length+STATIC_INS_RECORDS.length+STATIC_FB_RECORDS.length));"
);

// 7. Fix Today Target to reflect actual daily progress
html = html.replace(
  "setText('kpi-fb',fbRecords.length+STATIC_FB_RECORDS.length);",
  "setText('kpi-fb',fbRecords.length+STATIC_FB_RECORDS.length); setText('kpi-today-target', dailyProgress.fb+dailyProgress.ins); setText('kpi-today-sub','FB '+dailyProgress.fb+' / IG '+dailyProgress.ins+' = '+(dailyProgress.fb+dailyProgress.ins));"
);

// 8. Fix renderINSDetailTable status badge — was hardcoded badge-orange for all
html = html.replace(
  /allINS\.map\(\(r,i\)=>'<tr><td>'\+\(i\+1\)\+'<\/td><td class="name">@'\+esc\(r\.account\)\+'<\/td><td>'\+esc\(r\.name\|\|'-'\)\+'<\/td><td>'\+esc\(r\.dm\|\|'-'\)\+'<\/td><td>'\+\(r\.date\|\|'-'\)\+'<\/td><td><span class="badge badge-orange">'\\+esc\(r\.status\|\|'-'\)\+'<\/span><\/td><\/tr>'\)\.join\(''\)/,
  `allINS.map((r,i)=>'<tr><td>'+(i+1)+'</td><td class="name">@'+esc(r.account)+'</td><td>'+esc(r.name||'-')+'</td><td>'+esc(r.dm||'-')+'</td><td>'+(r.date||'-')+'</td><td>'+statusBadge(r.status||'Sent')+'</td></tr>').join('')`
);

// Also fix the INS contacts tbody in Instagram platform tab
html = html.replace(
  /allINS\.map\(r=>'<tr><td class="name">@'\+esc\(r\.account\)\+'<\/td><td>'\+esc\(r\.name\|\|'-'\)\+'<\/td><td>'\+esc\(r\.dm\|\|'-'\)\+'<\/td><td>'\+\(r\.date\|\|'-'\)\+'<\/td><td><span class="badge badge-orange">'\\+esc\(r\.status\|\|'-'\)\+'<\/span><\/td><\/tr>'\)\.join\(''\)/,
  `allINS.map(r=>'<tr><td class="name">@'+esc(r.account)+'</td><td>'+esc(r.name||'-')+'</td><td>'+esc(r.dm||'-')+'</td><td>'+(r.date||'-')+'</td><td>'+statusBadge(r.status||'Sent')+'</td></tr>').join('')`
);

// 9. Fix statusBadge to include 'Replied' status
html = html.replace(
  "function statusBadge(s){return{Accepted:'<span class=\"badge badge-green\">Accepted</span>',Pending:'<span class=\"badge badge-orange\">Pending</span>',Sent:'<span class=\"badge badge-blue\">Sent</span>',Rejected:'<span class=\"badge badge-red\">Rejected</span>'}",
  "function statusBadge(s){return{Accepted:'<span class=\"badge badge-green\">Accepted</span>',Pending:'<span class=\"badge badge-orange\">Pending</span>',Sent:'<span class=\"badge badge-blue\">Sent</span>',Replied:'<span class=\"badge badge-green\">Replied</span>',Rejected:'<span class=\"badge badge-red\">Rejected</span>',Done:'<span class=\"badge badge-green\">Done</span>'}"
);

// 10. Fix the "Today Priority Tasks" to reflect actual work (not fictional targets)
html = html.replace(
  `<li><span class="num">1</span><b>Facebook Public Post Engagement</b> - Search outdoor gear pages, like/comment 55 posts <span class="badge badge-fb">FB x55</span></li>
<li><span class="num">2</span><b>Instagram DM</b> - Send partnership DMs to 45 outdoor brand decision-makers <span class="badge badge-ins">INS x45</span></li>
<li><span class="num">3</span><b>LinkedIn Content Interaction</b> - Like/comment on connected contacts posts (no quota cost) <span class="badge badge-li">LI Maintain</span></li>
<li><span class="num">4</span><b>Follow-up Pending</b> - Send follow-up messages to Pending status contacts</li>
<li><span class="num">5</span><b>Find New Leads</b> - Search Instagram for outdoor brand accounts, add to prospect list</li>`,
  `<li><span class="num">1</span><b>Instagram DM Outreach</b> - Send partnership DMs to outdoor retailers/brands <span class="badge badge-ins">INS +7 today</span></li>
<li><span class="num">2</span><b>Email Follow-ups</b> - camp4wheels, Campmor, World of Camping, Ellis Brigham, MEC <span class="badge badge-green">5 pending</span></li>
<li><span class="num">3</span><b>LinkedIn Content Interaction</b> - Like/comment on connected contacts posts (no quota cost) <span class="badge badge-li">LI Maintain</span></li>
<li><span class="num">4</span><b>Find New IG Targets</b> - From "similar accounts" recommendations, target 20-50K follower outdoor retailers</li>
<li><span class="num">5</span><b>Like Posts</b> - Like latest posts from all contacted accounts (5 accounts pending)</li>`
);

// 11. Fix the alert box — LinkedIn limit is old news, show current status
html = html.replace(
  `<div class="alert-box">
  <h4>LinkedIn Connection Limit Reached - Smart Reallocation Active</h4>
  <p>Free account weekly limit used. System redistributed 60 LinkedIn tasks to Facebook(+40) and Instagram(+20). <b>Current: FB 55 / INS 45</b></p>
</div>`,
  `<div class="alert-box">
  <h4>IG DM Outreach Active — 7 DMs Sent Today</h4>
  <p>Targeting NZ/AU outdoor retailers via Instagram DM. 5 positive signals received (camp4wheels strongest). Email follow-ups pending for 5 contacts. LinkedIn on hold (weekly limit).</p>
</div>`
);

// 12. Fix Allocation grid to reflect reality
html = html.replace(
  `<div class="alloc-item li"><div class="alloc-label">LinkedIn</div><div class="alloc-value" id="alloc-li">0</div><div class="alloc-sub">Was 60 - Limit Full</div><div class="alloc-note">Content only</div></div>
    <div class="alloc-item fb"><div class="alloc-label">Facebook</div><div class="alloc-value" id="alloc-fb">55</div><div class="alloc-sub">Was 15 + 40</div></div>
    <div class="alloc-item ins"><div class="alloc-label">Instagram</div><div class="alloc-value" id="alloc-ins">45</div><div class="alloc-sub">Was 25 + 20</div></div>`,
  `<div class="alloc-item li"><div class="alloc-label">LinkedIn</div><div class="alloc-value" id="alloc-li">0</div><div class="alloc-sub">Weekly limit full</div><div class="alloc-note">Content only</div></div>
    <div class="alloc-item fb"><div class="alloc-label">Facebook</div><div class="alloc-value" id="alloc-fb">14</div><div class="alloc-sub">Historical records</div></div>
    <div class="alloc-item ins"><div class="alloc-label">Instagram</div><div class="alloc-value" id="alloc-ins">17</div><div class="alloc-sub">DM outreach active</div></div>`
);

fs.writeFileSync(path, html, 'utf8');
console.log('Dashboard updated to v17.3 successfully!');
console.log('File size:', html.length, 'bytes');
