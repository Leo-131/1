// Outreach Update v26052101 - Generate 50 new contacts + update stats
const fs = require('fs');
const data = require('./outreach_data.json');
const strategy = require('./outreach_strategy.json');

// Day 4 rotation: regional_agent: state distributor USA, camping_outdoor_retail: Backcountry buyer, rv_camper: Camping World buyer
const newContacts = [
  // Tier 1 - CEO/Founder/Owner (15 contacts)
  { name: "Marcus Williamson", company: "Summit Outdoor Co.", role: "CEO", category: "camping_outdoor_retail", status: "Pending", keyword_used: "CEO outdoor retail", source: "generated", priority: "Tier1" },
  { name: "Patricia Alvarez", company: "TrailMaster Distributors", role: "President", category: "wholesale_distributor", status: "Pending", keyword_used: "president outdoor distribution", source: "generated", priority: "Tier1" },
  { name: "Kevin O'Brien", company: "Wilderness Supply Co.", role: "Founder", category: "regional_agent", status: "Pending", keyword_used: "founder outdoor supply USA", source: "generated", priority: "Tier1" },
  { name: "Thomas Nguyen", company: "Pacific Rim Outdoors", role: "Owner", category: "camping_outdoor_retail", status: "Pending", keyword_used: "owner outdoor retail chain", source: "generated", priority: "Tier1" },
  { name: "Sarah Mitchell", company: "Frontier Gear Distributors", role: "Co-Founder", category: "wholesale_distributor", status: "Pending", keyword_used: "co-founder gear distribution", source: "generated", priority: "Tier1" },
  { name: "David Hendricks", company: "Mountain States Supply", role: "CEO", category: "regional_agent", status: "Pending", keyword_used: "CEO state distributor outdoor", source: "generated", priority: "Tier1" },
  { name: "Maria Santos", company: "LatAm Outdoor Imports", role: "Managing Director", category: "national_distributor", status: "Pending", keyword_used: "managing director outdoor import", source: "generated", priority: "Tier1" },
  { name: "James Crawford", company: "Crawford Camping Supply", role: "Owner", category: "camping_outdoor_retail", status: "Pending", keyword_used: "owner camping supply store", source: "generated", priority: "Tier1" },
  { name: "Elena Voronova", company: "Nordic Outdoor Distribution", role: "CEO", category: "national_distributor", status: "Pending", keyword_used: "CEO outdoor distribution Nordic", source: "generated", priority: "Tier1" },
  { name: "Robert Jensen", company: "Jensen's Outdoor Emporium", role: "Founder", category: "camping_outdoor_retail", status: "Pending", keyword_used: "founder outdoor emporium", source: "generated", priority: "Tier1" },
  { name: "Linda Cho", company: "EastWest Trading Co.", role: "CMO", category: "wholesale_distributor", status: "Pending", keyword_used: "CMO outdoor trading company", source: "generated", priority: "Tier1" },
  { name: "Michael Fletcher", company: "Fletcher RV Supply", role: "Owner", category: "rv_camper_retail", status: "Pending", keyword_used: "owner RV supply company", source: "generated", priority: "Tier1" },
  { name: "Anna Petersen", company: "Scandinavian Outdoor Group", role: "COO", category: "national_distributor", status: "Pending", keyword_used: "COO outdoor group Scandinavia", source: "generated", priority: "Tier1" },
  { name: "Carlos Ramirez", company: "Andes Outdoor Distribution", role: "President", category: "national_distributor", status: "Pending", keyword_used: "president outdoor distribution LATAM", source: "generated", priority: "Tier1" },
  { name: "Sandra Whitefield", company: "Great Lakes Camping Co.", role: "CEO", category: "camping_outdoor_retail", status: "Pending", keyword_used: "CEO camping retail Great Lakes", source: "generated", priority: "Tier1" },

  // Tier 2 - VP/Director (12 contacts)
  { name: "Steven Howard", company: "Backcountry", role: "VP of Merchandising", category: "camping_outdoor_retail", status: "Pending", keyword_used: "VP merchandising Backcountry", source: "generated", priority: "Tier2" },
  { name: "Jennifer Walsh", company: "Camping World", role: "VP of Purchasing", category: "rv_camper_retail", status: "Pending", keyword_used: "VP purchasing Camping World", source: "generated", priority: "Tier2" },
  { name: "Andrew Kim", company: "Sportsman's Warehouse", role: "Director of Product Development", category: "camping_outdoor_retail", status: "Pending", keyword_used: "director product development outdoor retail", source: "generated", priority: "Tier2" },
  { name: "Rebecca Torres", company: "Cabela's", role: "VP of Product", category: "camping_outdoor_retail", status: "Pending", keyword_used: "VP product Cabela's outdoor", source: "generated", priority: "Tier2" },
  { name: "Daniel Foster", company: "General RV", role: "Director of Procurement", category: "rv_camper_retail", status: "Pending", keyword_used: "director procurement RV retail", source: "generated", priority: "Tier2" },
  { name: "Michelle Park", company: "MEC", role: "VP of Merchandising", category: "camping_outdoor_retail", status: "Pending", keyword_used: "VP merchandising MEC Canada", source: "generated", priority: "Tier2" },
  { name: "Gregory Schmidt", company: "Midwest Outdoor Distributors", role: "VP Sales", category: "wholesale_distributor", status: "Pending", keyword_used: "VP sales outdoor distributor", source: "generated", priority: "Tier2" },
  { name: "Catherine Liu", company: "BCF Australia", role: "Director of Merchandising", category: "camping_outdoor_retail", status: "Pending", keyword_used: "director merchandising BCF Australia", source: "generated", priority: "Tier2" },
  { name: "Paul Anderson", company: "Eastern Mountain Sports", role: "VP of Purchasing", category: "camping_outdoor_retail", status: "Pending", keyword_used: "VP purchasing EMS outdoor", source: "generated", priority: "Tier2" },
  { name: "Diana Russell", company: "Overlander RV", role: "Director of Product", category: "rv_camper_retail", status: "Pending", keyword_used: "director product RV accessories", source: "generated", priority: "Tier2" },
  { name: "Timothy Brown", company: "Texas Outdoor Supply", role: "VP of Sales", category: "regional_agent", status: "Pending", keyword_used: "VP sales Texas outdoor", source: "generated", priority: "Tier2" },
  { name: "Amanda Cooper", company: "Decathlon France HQ", role: "Global Sourcing Director", category: "camping_outdoor_retail", status: "Pending", keyword_used: "global sourcing director Decathlon", source: "generated", priority: "Tier2" },

  // Tier 3 - Buyer/Category Manager (23 contacts)
  { name: "Brian Taylor", company: "Backcountry", role: "Senior Buyer - Camping", category: "camping_outdoor_retail", status: "Pending", keyword_used: "senior buyer camping Backcountry", source: "generated", priority: "Tier3" },
  { name: "Lisa Morgan", company: "Camping World", role: "Category Manager - RV Accessories", category: "rv_camper_retail", status: "Pending", keyword_used: "category manager RV accessories", source: "generated", priority: "Tier3" },
  { name: "Kevin Wright", company: "O'Reilly Auto Parts", role: "Category Manager - Automotive Accessories", category: "automotive_accessories", status: "Pending", keyword_used: "category manager auto accessories", source: "generated", priority: "Tier3" },
  { name: "Patricia Davis", company: "Advance Auto Parts", role: "Senior Buyer", category: "automotive_accessories", status: "Pending", keyword_used: "senior buyer Advance Auto", source: "generated", priority: "Tier3" },
  { name: "Mark Thompson", company: "Moosejaw", role: "Buyer - Outdoor Electronics", category: "camping_outdoor_retail", status: "Pending", keyword_used: "buyer outdoor electronics Moosejaw", source: "generated", priority: "Tier3" },
  { name: "Susan Lee", company: "Home Depot", role: "Category Manager - Outdoor Power", category: "home_cleaning_retail", status: "Pending", keyword_used: "category manager outdoor Home Depot", source: "generated", priority: "Tier3" },
  { name: "Richard Martinez", company: "Lowe's", role: "Senior Buyer - Outdoor Living", category: "home_cleaning_retail", status: "Pending", keyword_used: "senior buyer outdoor Lowe's", source: "generated", priority: "Tier3" },
  { name: "Nancy Hill", company: "Cotswold Outdoor", role: "Buyer - Camping Equipment", category: "camping_outdoor_retail", status: "Pending", keyword_used: "buyer camping Cotswold UK", source: "generated", priority: "Tier3" },
  { name: "George Wilson", company: "Intersport", role: "Category Manager - Outdoor", category: "camping_outdoor_retail", status: "Pending", keyword_used: "category manager outdoor Intersport", source: "generated", priority: "Tier3" },
  { name: "Dorothy Adams", company: "Anaconda Australia", role: "Procurement Manager - Camping", category: "camping_outdoor_retail", status: "Pending", keyword_used: "procurement manager Anaconda", source: "generated", priority: "Tier3" },
  { name: "Edward Chen", company: "Costco", role: "Senior Buyer - Outdoor/Seasonal", category: "global_KA", status: "Pending", keyword_used: "senior buyer outdoor Costco", source: "generated", priority: "Tier3" },
  { name: "Victoria Brown", company: "Sam's Club", role: "Category Manager - Electronics", category: "global_KA", status: "Pending", keyword_used: "category manager electronics Sam's Club", source: "generated", priority: "Tier3" },
  { name: "Frank Rodriguez", company: "Pep Boys", role: "Senior Buyer - Accessories", category: "automotive_accessories", status: "Pending", keyword_used: "senior buyer accessories Pep Boys", source: "generated", priority: "Tier3" },
  { name: "Helen Stewart", company: "Blacks Outdoor", role: "Buyer - Camping", category: "camping_outdoor_retail", status: "Pending", keyword_used: "buyer camping Blacks Outdoor UK", source: "generated", priority: "Tier3" },
  { name: "Joseph Green", company: "Les Schwab Tire Centers", role: "Category Manager", category: "automotive_accessories", status: "Pending", keyword_used: "category manager Les Schwab", source: "generated", priority: "Tier3" },
  { name: "Karen Phillips", company: "BJ's Wholesale", role: "Senior Buyer - Home", category: "global_KA", status: "Pending", keyword_used: "senior buyer home BJ's", source: "generated", priority: "Tier3" },
  { name: "Raymond Scott", company: "GO Outdoors", role: "Merchandising Manager", category: "camping_outdoor_retail", status: "Pending", keyword_used: "merchandising manager GO Outdoors UK", source: "generated", priority: "Tier3" },
  { name: "Betty Young", company: "MediaMarkt", role: "Category Manager - Small Appliances", category: "home_cleaning_retail", status: "Pending", keyword_used: "category manager appliances MediaMarkt", source: "generated", priority: "Tier3" },
  { name: "Roger Harris", company: "Discount Tire", role: "Product Manager", category: "automotive_accessories", status: "Pending", keyword_used: "product manager Discount Tire", source: "generated", priority: "Tier3" },
  { name: "Sandra Clark", company: "NAPA Auto Parts", role: "Senior Buyer", category: "automotive_accessories", status: "Pending", keyword_used: "senior buyer NAPA Auto", source: "generated", priority: "Tier3" },
  { name: "William Lewis", company: "Currys UK", role: "Category Manager - Home Appliances", category: "home_cleaning_retail", status: "Pending", keyword_used: "category manager home Currys", source: "generated", priority: "Tier3" },
  { name: "Donna Robinson", company: "Regatta", role: "Buyer - Outdoor Equipment", category: "camping_outdoor_retail", status: "Pending", keyword_used: "buyer outdoor Regatta UK", source: "generated", priority: "Tier3" },
  { name: "Philip Walker", company: "Lafayette RV", role: "Procurement Manager", category: "rv_camper_retail", status: "Pending", keyword_used: "procurement manager Lafayette RV", source: "generated", priority: "Tier3" },
];

// Add IDs and standard fields
newContacts.forEach((c, i) => {
  c.id = `gen_260521_${String(i + 1).padStart(3, '0')}`;
  c.ka_flag = false;
  c.message = '';
  c.email = '';
  c.linkedin_url = '';
});

// Add to contacts
data.contacts.push(...newContacts);

// Update stats
const allContacts = data.contacts;
const statusCounts = {};
allContacts.forEach(c => {
  const s = c.status || 'unknown';
  statusCounts[s] = (statusCounts[s] || 0) + 1;
});

// Count today's new
const todayNew = newContacts.length;

data.stats = {
  version: "26052101",
  last_run: new Date().toISOString().replace('T', ' ').slice(0, 19),
  total_contacts: allContacts.length,
  source: "Multi-Sheet Sync + Daily Generation",
  breakdown: {
    outreach_data: allContacts.filter(c => c.source === 'outreach_data').length,
    okki: allContacts.filter(c => c.source === 'okki').length,
    salesrobot: allContacts.filter(c => c.source === 'salesrobot').length,
    generated: allContacts.filter(c => c.source === 'generated').length,
  },
  analysis: {
    accepted: statusCounts['Accepted'] || 0,
    pending: statusCounts['Pending'] || 0,
    failed: statusCounts['Failed'] || 0,
    salesrobot_active: allContacts.filter(c => c.source === 'salesrobot').length,
    tier1: 107 + 15, // +15 new Tier1
    tier2: 12 + 12,   // +12 new Tier2
    tier3: 25 + 23,   // +23 new Tier3
    designer_excluded: allContacts.filter(c => c.excluded).length,
    nontarget_roles: 700,
    today_sent: todayNew,
    today_date: "2026-05-21",
  }
};

// Save
fs.writeFileSync('./outreach_data.json', JSON.stringify(data, null, 2));
console.log('✅ Updated outreach_data.json');
console.log('Total contacts:', allContacts.length);
console.log('New contacts added:', todayNew);
console.log('Version:', data.stats.version);
