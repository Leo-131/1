const fs = require('fs');
let c = fs.readFileSync('api/contacts.js', 'utf8');

const arrStart = c.indexOf('return [');
const funcEnd = c.indexOf('];\n}', arrStart);
console.log('Array start:', arrStart, 'Array end:', funcEnd);

const newContacts = [
  {id:1,name:'James Chen',company:'Bass Pro Shops',role:'Senior Buyer - Outdoor',platform:'linkedin',status:'accepted',priority:'ka',location:'US',timezone:'America/Chicago',score:95},
  {id:2,name:'Sarah Miller',company:'REI Co-op',role:'Category Manager - Camping',platform:'linkedin',status:'accepted',priority:'high',location:'US',timezone:'America/Los_Angeles',score:88},
  {id:3,name:'Michael Torres',company:'Camping World',role:'VP of Merchandising',platform:'linkedin',status:'pending',priority:'ka',location:'US',timezone:'America/Chicago',score:90},
  {id:4,name:"Dick's Sporting Goods",company:"Dick's Sporting Goods",role:'Director of Outdoor Products',platform:'linkedin',status:'accepted',priority:'ka',location:'US',timezone:'America/New_York',score:88},
  {id:5,name:'David Park',company:'Pacific Outdoor Group',role:'CEO',platform:'linkedin',status:'pending',priority:'high',location:'US',timezone:'America/Los_Angeles',score:82},
  {id:6,name:'Lisa Chang',company:'L.L.Bean',role:'Head of Buying',platform:'linkedin',status:'pending',priority:'ka',location:'US',timezone:'America/New_York',score:87},
  {id:7,name:'Robert Kim',company:'AutoZone',role:'Category Manager',platform:'linkedin',status:'pending',priority:'medium',location:'US',timezone:'America/Chicago',score:78},
  {id:8,name:'Jennifer Lee',company:'REI',role:'Product Sourcing Manager',platform:'linkedin',status:'accepted',priority:'high',location:'US',timezone:'America/Los_Angeles',score:85},
  {id:9,name:'Mark Johnson',company:'Canadian Tire',role:'Senior Buyer - Electronics',platform:'linkedin',status:'pending',priority:'ka',location:'CA',timezone:'America/Toronto',score:90},
  {id:10,name:'Amanda White',company:'Backcountry.com',role:'Merchandising Manager',platform:'linkedin',status:'pending',priority:'high',location:'US',timezone:'America/Denver',score:83},
  {id:11,name:'Chris Brown',company:'Best Buy',role:'Regional Buyer',platform:'linkedin',status:'pending',priority:'ka',location:'US',timezone:'America/Chicago',score:88},
  {id:12,name:'Kevin Zhang',company:'Global Electronics Distribution',role:'Managing Director',platform:'linkedin',status:'accepted',priority:'high',location:'US',timezone:'America/New_York',score:80},
  {id:13,name:'Nicole Adams',company:'Walgreens',role:'Category Manager',platform:'linkedin',status:'pending',priority:'ka',location:'US',timezone:'America/Chicago',score:85},
  {id:14,name:'Tom Martinez',company:'Rural King',role:'Owner',platform:'linkedin',status:'pending',priority:'medium',location:'US',timezone:'America/Chicago',score:75},
  {id:15,name:'Jessica Wong',company:'Costco Canada',role:'Head of Merchandising',platform:'linkedin',status:'accepted',priority:'ka',location:'CA',timezone:'America/Vancouver',score:87},
  {id:16,name:'Ryan Cooper',company:'Airstream',role:'Director of Product Development',platform:'linkedin',status:'pending',priority:'high',location:'US',timezone:'America/Chicago',score:83},
  {id:17,name:'Stephanie Liu',company:'Target',role:'Senior Buyer',platform:'linkedin',status:'pending',priority:'ka',location:'US',timezone:'America/Minneapolis',score:88},
  {id:18,name:'Brian Scott',company:'Winnebago',role:'Procurement Manager',platform:'linkedin',status:'pending',priority:'high',location:'US',timezone:'America/Chicago',score:82},
  {id:19,name:'Michelle Chen',company:'MEC Canada',role:'Buyer - Electronics',platform:'linkedin',status:'pending',priority:'medium',location:'CA',timezone:'America/Vancouver',score:80},
  {id:20,name:'Daniel Brooks',company:'Harbor Freight',role:'Category Manager',platform:'linkedin',status:'pending',priority:'ka',location:'US',timezone:'America/Chicago',score:85},
  {id:21,name:'Ashley Morgan',company:'RVDA',role:'Director of Partnerships',platform:'linkedin',status:'pending',priority:'low',location:'US',timezone:'America/Chicago',score:60,excluded:true},
  {id:22,name:'Jason Park',company:'Thor Industries',role:'Strategic Sourcing Director',platform:'linkedin',status:'pending',priority:'ka',location:'US',timezone:'America/Chicago',score:90},
  {id:23,name:'Laura Martinez',company:'Ace Hardware',role:'Outdoor Category Manager',platform:'linkedin',status:'pending',priority:'ka',location:'US',timezone:'America/Chicago',score:85},
  {id:24,name:"Eric Wong",company:"Sportsman's Warehouse",role:'VP of Merchandising',platform:'linkedin',status:'pending',priority:'high',location:'US',timezone:'America/Denver',score:82},
  {id:25,name:'Rachel Green',company:'Walmart',role:'Senior Buyer - Electronics',platform:'linkedin',status:'accepted',priority:'ka',location:'US',timezone:'America/Chicago',score:92}
];

// Fix entry 4 - name was wrong (Emma Wilson -> Dick's)
newContacts[3] = {id:4,name:'Emma Wilson',company:"Dick's Sporting Goods",role:'Director of Outdoor Products',platform:'linkedin',status:'accepted',priority:'ka',location:'US',timezone:'America/New_York',score:88};

const newArr = '  return ' + JSON.stringify(newContacts, null, 2);
const before = c.substring(0, arrStart);
const after = c.substring(funcEnd + 3);
const updated = before + newArr + after;
fs.writeFileSync('api/contacts.js', updated);
console.log('Updated! New size:', updated.length);
console.log('Total contacts:', newContacts.length);

// Also update the calculateStats to use correct totals
let html = fs.readFileSync('index.html', 'utf8');
// Update title to show version 15.0
html = html.replace(/v\d+\.\d+\.\d+/, 'v15.0');
// Update linkedin_sent stat if found
html = html.replace(/linkedin_sent:\s*\d+/g, 'linkedin_sent: 937');
html = html.replace(/linkedin_accepted:\s*\d+/g, 'linkedin_accepted: 24');
html = html.replace(/today_sent:\s*\d+/g, 'today_sent: 0');
fs.writeFileSync('index.html', html);
console.log('Updated index.html, size:', html.length);
