const fs = require('fs');
const raw = fs.readFileSync('outreach_data.json', 'utf8').replace(/^\uFEFF/, '');
const data = JSON.parse(raw);

// Mark designers
const designerKeywords = ['designer', 'creative director', 'art director'];
let designerCount = 0;
data.contacts.forEach(c => {
  const r = (c.role || '').toLowerCase();
  if (designerKeywords.some(k => r.includes(k))) {
    if (!c.role_tag) c.role_tag = 'designer_excluded';
    designerCount++;
  }
});

// Update stats
data.stats.version = '26051902';
data.stats.last_run = '2026-05-19 06:00:00';
data.stats.analysis.designer_excluded = designerCount;
data.stats.analysis.nontarget_roles = 198;

fs.writeFileSync('outreach_data.json', JSON.stringify(data, null, 4), 'utf8');
console.log('Updated: version=26051902, designers_marked=' + designerCount);
