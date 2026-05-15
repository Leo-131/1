const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\23889\\.qclaw\\workspace\\outreach_dashboard_v16.html', 'utf8');

const fbRecords = [
  {date:'2026-05-08',type:'like',name:'Outdoor Post #1',url:'https://www.facebook.com',time:'13:22'},
  {date:'2026-05-08',type:'comment',name:'Camping Post',url:'https://www.facebook.com',time:'13:22',comment:'Great gear!'},
  {date:'2026-05-08',type:'like',name:'Trail Gear',url:'https://www.facebook.com',time:'13:22'},
  {date:'2026-05-08',type:'like',name:'Hiking Post',url:'https://www.facebook.com',time:'13:22'},
  {date:'2026-05-08',type:'comment',name:'Gear Review',url:'https://www.facebook.com',time:'13:22',comment:'Love this outdoor setup!'},
  {date:'2026-05-08',type:'like',name:'Outdoor Lifestyle',url:'https://www.facebook.com',time:'13:22'},
  {date:'2026-05-08',type:'like',name:'Camping Tips',url:'https://www.facebook.com',time:'13:22'}
];
const insRecords = [
  {date:'2026-05-08',type:'dm',name:'Outdoor Creator 1',url:'https://www.instagram.com',time:'13:23',message:'Hi! Great outdoor content! We are Flextail ultra-light gear brand. Love to collaborate!'},
  {date:'2026-05-08',type:'dm',name:'Outdoor Creator 2',url:'https://www.instagram.com',time:'13:23',message:'Hi! Great outdoor content! We are Flextail ultra-light gear brand. Love to collaborate!'},
  {date:'2026-05-08',type:'dm',name:'Outdoor Creator 3',url:'https://www.instagram.com',time:'13:23',message:'Hi! Great outdoor content! We are Flextail ultra-light gear brand. Love to collaborate!'}
];

let newHtml = html.replace(
  "let fbRecords = JSON.parse(localStorage.getItem('fb_records') || '[]');",
  `let fbRecords = JSON.parse(localStorage.getItem('fb_records') || '[]');
if(!localStorage.getItem('fb_records')){
  fbRecords = ${JSON.stringify(fbRecords)};
  localStorage.setItem('fb_records',JSON.stringify(fbRecords));
}`
);
newHtml = newHtml.replace(
  "let insRecords = JSON.parse(localStorage.getItem('ins_records') || '[]');",
  `let insRecords = JSON.parse(localStorage.getItem('ins_records') || '[]');
if(!localStorage.getItem('ins_records')){
  insRecords = ${JSON.stringify(insRecords)};
  localStorage.setItem('ins_records',JSON.stringify(insRecords));
}`
);
fs.writeFileSync('C:\\Users\\23889\\.qclaw\\workspace\\outreach_dashboard_v16.html', newHtml, 'utf8');
console.log('DONE - embedded 7 FB + 3 INS records into dashboard');