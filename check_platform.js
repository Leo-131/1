const fs = require('fs');
let c = fs.readFileSync('outreach-dashboard/public/index.html').toString('utf8');

// Find the LinkedIn platform card structure
const platCard = c.indexOf('platform-card');
console.log('platform-card at:', platCard);
if (platCard >= 0) console.log('Platform card:', JSON.stringify(c.substring(platCard, platCard + 400)));

// Find dt-nums
const dtNums = c.indexOf('dt-nums');
if (dtNums >= 0) console.log('dt-nums:', JSON.stringify(c.substring(dtNums - 50, dtNums + 100)));

// Search for actual numbers
const allNums = [...c.matchAll(/>(\d+)\/(\d+)</g)].slice(0, 5);
console.log('All X/Y numbers:', allNums);

// Find the specific pattern: "class=\"name\">LinkedIn"
const liName = c.indexOf('class="name">LinkedIn');
console.log('\nLinkedIn name:', JSON.stringify(c.substring(liName, liName + 300)));

// The numbers we need to change are likely in:
const numsArea = c.indexOf('class="nums"');
if (numsArea >= 0) console.log('\nNums area:', JSON.stringify(c.substring(numsArea - 30, numsArea + 100)));

// Now do the actual fix - look for the class="nums" or dt-nums pattern
// The LinkedIn sent count is in the first platform card
c = c.replace(/class="nums">(\d+)\/60<\/div>/, 'class="nums">3\/60<\/div>');
c = c.replace(/class="dt-nums">(\d+)\/25<\/div>/, 'class="dt-nums">1\/25<\/div>');
c = c.replace(/class="dt-nums">(\d+)\/15<\/div>/, 'class="dt-nums">1\/15<\/div>');

// Also check for data attributes
const dataNum = c.indexOf('data-num');
if (dataNum >= 0) console.log('\ndata-num:', JSON.stringify(c.substring(dataNum, dataNum + 100)));

// Check for any span/dt structure
const dtSpan = c.indexOf('dt-nums');
console.log('\ndt-nums count:', (c.match(/dt-nums/g)||[]).length);
const dtNumsArea = c.indexOf('dt-nums"');
if (dtNumsArea >= 0) console.log('dt-nums context:', JSON.stringify(c.substring(dtNumsArea - 20, dtNumsArea + 80)));

// Find the remaining counts in 下一步行动
const next = c.indexOf('今日还需');
const nextAll = [...c.matchAll(/今日还需发送 (\d+)/g)];
console.log('\n今日还需 matches:', nextAll.map(m => m[0]).slice(0, 5));

// Fix those
c = c.replace(/今日还需发送 (\d+)/g, function(m, n) {
  return '今日还需发送 ' + n; // keep as is - they show remaining
});

// Check if platform cards have numbers in a different format
// Search for the pattern that includes the number 0
const zero60 = c.indexOf('0/60');
const zero25 = c.indexOf('0/25');
const zero15 = c.indexOf('0/15');
console.log('\n0/60 at:', zero60, zero60 >= 0 ? JSON.stringify(c.substring(zero60 - 30, zero60 + 30)) : '');
console.log('0/25 at:', zero25, zero25 >= 0 ? JSON.stringify(c.substring(zero25 - 30, zero25 + 30)) : '');
console.log('0/15 at:', zero15, zero15 >= 0 ? JSON.stringify(c.substring(zero15 - 30, zero15 + 30)) : '');

// The platform tab numbers are in: <div class="tab-nums">0/60</div> etc.
const tabNums = c.indexOf('tab-nums');
if (tabNums >= 0) console.log('\ntab-nums:', JSON.stringify(c.substring(tabNums - 50, tabNums + 100)));

// Final fix - search everywhere for the exact patterns
const platformNums = [...c.matchAll(/(?:0|1)\/60/g)];
console.log('\n0/60 or 1/60 matches:', platformNums.slice(0, 3));
const platformNums25 = [...c.matchAll(/(?:0|1)\/25/g)];
console.log('0/25 or 1/25 matches:', platformNums25.slice(0, 3));

fs.writeFileSync('outreach-dashboard/public/index.html', c, 'utf8');
