// Script to update contacts.js with latest 25 contacts from outreach_data.json
const fs = require('fs');
const path = require('path');

const newContacts = [
  { id:1, name:"James Chen", company:"Bass Pro Shops", role:"Senior Buyer - Outdoor", platform:"linkedin", status:"accepted", priority:"ka", location:"US", timezone:"America/Chicago", score:95 },
  { id:2, name:"Sarah Miller", company:"REI Co-op", role:"Category Manager - Camping", platform:"linkedin", status:"accepted", priority:"high", location:"US", timezone:"America/Los_Angeles", score:88 },
  { id:3, name:"Michael Torres", company:"Camping World", role:"VP of Merchandising", platform:"linkedin", status:"pending", priority:"ka", location:"US", timezone:"America/Chicago", score:90 },
  { id:4, name:"Emma Wilson", company:"Dick's Sporting Goods", role:"Director of Outdoor Products", platform:"linkedin", status:"accepted", priority:"ka", location:"US", timezone:"America/New_York", score:88 },
  { id:5, name:"David Park", company:"Pacific Outdoor Group", role:"CEO", platform:"linkedin", status:"pending", priority:"high", location:"US", timezone:"America/Los_Angeles", score:82 },
  { id:6, name:"Lisa Chang", company:"L.L.Bean", role:"Head of Buying", platform:"linkedin", status:"pending", priority:"ka", location:"US", timezone:"America/New_York", score:87 },
  { id:7, name:"Robert Kim", company:"AutoZone", role:"Category Manager", platform:"linkedin", status:"pending", priority:"medium", location:"US", timezone:"America/Chicago", score:78 },
  { id:8, name:"Jennifer Lee", company:"REI", role:"Product Sourcing Manager", platform:"linkedin", status:"accepted", priority:"high", location:"US", timezone:"America/Los_Angeles", score:85 },
  { id:9, name:"Mark Johnson", company:"Canadian Tire", role:"Senior Buyer - Electronics", platform:"linkedin", status:"pending", priority:"ka", location:"CA", timezone:"America/Toronto", score:90 },
  { id:10, name:"Amanda White", company:"Backcountry.com", role:"Merchandising Manager", platform:"linkedin", status:"pending", priority:"high", location:"US", timezone:"America/Denver", score:83 },
  { id:11, name:"Chris Brown", company:"Best Buy", role:"Regional Buyer", platform:"linkedin", status:"pending", priority:"ka", location:"US", timezone:"America/Chicago", score:88 },
  { id:12, name:"Kevin Zhang", company:"Global Electronics Distribution", role:"Managing Director", platform:"linkedin", status:"accepted", priority:"high", location:"US", timezone:"America/New_York", score:80 },
  { id:13, name:"Nicole Adams", company:"Walgreens", role:"Category Manager", platform:"linkedin", status:"pending", priority:"ka", location:"US", timezone:"America/Chicago", score:85 },
  { id:14, name:"Tom Martinez", company:"Rural King", role:"Owner", platform:"linkedin", status:"pending", priority:"medium", location:"US", timezone:"America/Chicago", score:75 },
  { id:15, name:"Jessica Wong", company:"Costco Canada", role:"Head of Merchandising", platform:"linkedin", status:"accepted", priority:"ka", location:"CA", timezone:"America/Vancouver", score:87 },
  { id:16, name:"Ryan Cooper", company:"Airstream", role:"Director of Product Development", platform:"linkedin", status:"pending", priority:"high", location:"US", timezone:"America/Chicago", score:83 },
  { id:17, name:"Stephanie Liu", company:"Target", role:"Senior Buyer", platform:"linkedin", status:"pending", priority:"ka", location:"US", timezone:"America/Minneapolis", score:88 },
  { id:18, name:"Brian Scott", company:"Winnebago", role:"Procurement Manager", platform:"linkedin", status:"pending", priority:"high", location:"US", timezone:"America/Chicago", score:82 },
  { id:19, name:"Michelle Chen", company:"MEC (Mountain Equipment Co-op)", role:"Buyer - Electronics", platform:"linkedin", status:"pending", priority:"medium", location:"CA", timezone:"America/Vancouver", score:80 },
  { id:20, name:"Daniel Brooks", company:"Harbor Freight", role:"Category Manager", platform:"linkedin", status:"pending", priority:"ka", location:"US", timezone:"America/Chicago", score:85 },
  { id:21, name:"Ashley Morgan", company:"RVDA (RV Dealers Association)", role:"Director of Partnerships", platform:"linkedin", status:"pending", priority:"low", location:"US", timezone:"America/Chicago", score:60, excluded:true },
  { id:22, name:"Jason Park", company:"Thor Industries", role:"Strategic Sourcing Director", platform:"linkedin", status:"pending", priority:"ka", location:"US", timezone:"America/Chicago", score:90 },
  { id:23, name:"Laura Martinez", company:"Ace Hardware", role:"Outdoor Category Manager", platform:"linkedin", status:"pending", priority:"ka", location:"US", timezone:"America/Chicago", score:85 },
  { id:24, name:"Eric Wong", company:"Sportsman's Warehouse", role:"VP of Merchandising", platform:"linkedin", status:"pending", priority:"high", location:"US", timezone:"America/Denver", score:82 },
  { id:25, name:"Rachel Green", company:"Walmart", role:"Senior Buyer - Electronics", platform:"linkedin", status:"accepted", priority:"ka", location:"US", timezone:"America/Chicago", score:92 }
];

const newStats = {
  total: 25,
  linkedin_sent: 937,
  linkedin_accepted: 24,
  linkedin_replied: 6,
  instagram_sent: 0,
  facebook_sent: 0,
  ka_chain_count: 12,
  pending_count: 14,
  today_sent: 0,
  week_sent: 17,
  month_sent: 142,
  daily_target: 100,
  conversion_rate: 2.56,
  platform_stats: {
    linkedin: { sent: 937, accepted: 24, target: 60, weekly: 17 },
    instagram: { sent: 0, target: 25 },
    facebook: { sent: 0, target: 15 }
  }
};

// Read current contacts.js
let content = fs.readFileSync(path.join(__dirname, 'api', 'contacts.js'), 'utf8');

// Find getDefaultContacts function and replace
const funcMatch = content.match(/function getDefaultContacts\(\) \{[\s\S]*?\n\}/);
if (funcMatch) {
  const contactsStr = JSON.stringify(newContacts, null, 2)
    .replace(/^/gm, '    ')
    .replace(/^    \[/, '  [');
  const newFunc = `function getDefaultContacts() {\n  return ${JSON.stringify(newContacts, null, 2).replace(/^/gm, '    ').substring(0)}\n  ];\n}`;
  
  // Simpler approach - just replace the whole array
  const arrStart = content.indexOf('function getDefaultContacts() {\n  return [');
  if (arrStart !== -1) {
    const arrEnd = content.indexOf('];\n}', arrStart);
    const before = content.substring(0, arrStart + 'function getDefaultContacts() {\n  return [\n'.length);
    const after = content.substring(arrEnd + '];\n}'.length);
    const newArr = 'function getDefaultContacts() {\n  return ' + JSON.stringify(newContacts, null, 2) + '\n  ];\n}';
    content = before + JSON.stringify(newContacts, null, 2) + '\n  ];\n}' + after;
  }
}

fs.writeFileSync(path.join(__dirname, 'api', 'contacts.js'), content);
console.log('Updated contacts.js with 25 contacts');

// Now update STATS in index.html
let html = fs.readFileSync('index.html', 'utf8');

// Update the data object in index.html if it has hardcoded stats
// Find updateDashboard function and check stats
const statsMatch = html.match(/linkedin_sent:\s*(\d+)/);
console.log('Current HTML linkedin_sent:', statsMatch ? statsMatch[1] : 'not found');

// Check if updateDashboard uses API or hardcoded data
const apiCallMatch = html.match(/fetch\(['"]([^'"]+)['"]\)/);
console.log('API endpoint:', apiCallMatch ? apiCallMatch[1] : 'not found');

console.log('Done! HTML size:', html.length, 'bytes');
console.log('Contacts.js size:', fs.statSync('api/contacts.js').size, 'bytes');
