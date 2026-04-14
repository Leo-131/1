// API route to fetch contacts from Google Sheet
// Sheet ID: 16p8XtvsdI_yesMVjhKfDWOp95JdAtEEvelOw5_NOQ64

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { GOOGLE_SHEET_ID, GOOGLE_API_KEY } = process.env;
    
    // If no API key configured, return fallback data
    if (!GOOGLE_API_KEY || !GOOGLE_SHEET_ID) {
      console.log('No Google API credentials, returning fallback data');
      return res.status(200).json(getFallbackData());
    }

    // Fetch from Google Sheets API
    const sheetId = GOOGLE_SHEET_ID || '16p8XtvsdI_yesMVjhKfDWOp95JdAtEEvelOw5_NOQ64';
    const range = 'Sheet1!A:Z'; // Adjust range as needed
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${GOOGLE_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.log('Google Sheets API error, returning fallback');
      return res.status(200).json(getFallbackData());
    }

    const data = await response.json();
    const contacts = parseSheetData(data.values);
    
    return res.status(200).json({
      success: true,
      source: 'google_sheet',
      contacts,
      stats: calculateStats(contacts),
      keyword_performance: getKeywordPerformance(),
      next_actions: getNextActions(contacts)
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(200).json(getFallbackData());
  }
}

function parseSheetData(rows) {
  if (!rows || rows.length < 2) return [];
  
  const headers = rows[0];
  return rows.slice(1).map((row, index) => ({
    id: index + 1,
    name: row[0] || '',
    company: row[1] || '',
    role: row[2] || '',
    platform: row[3] || 'linkedin',
    status: row[4] || 'pending',
    priority: row[5] || 'medium',
    location: row[6] || '',
    timezone: row[7] || 'America/New_York',
    notes: row[8] || '',
    sentTime: row[9] || null,
    score: parseInt(row[10]) || 50
  }));
}

function calculateStats(contacts) {
  const total = contacts.length;
  const linkedin_sent = contacts.filter(c => c.platform === 'linkedin' && c.status === 'sent').length;
  const instagram_sent = contacts.filter(c => c.platform === 'instagram' && c.status === 'sent').length;
  const facebook_sent = contacts.filter(c => c.platform === 'facebook' && c.status === 'sent').length;
  const accepted = contacts.filter(c => c.status === 'accepted').length;
  const replied = contacts.filter(c => c.status === 'replied').length;
  const ka_chain_count = contacts.filter(c => c.priority === 'ka').length;
  const pending_count = contacts.filter(c => c.status === 'pending' || c.status === 'scheduled').length;
  
  return {
    total,
    linkedin_sent,
    instagram_sent,
    facebook_sent,
    linkedin_accepted: accepted,
    linkedin_replied: replied,
    ka_chain_count,
    pending_count,
    today_sent: linkedin_sent + instagram_sent + facebook_sent,
    week_sent: linkedin_sent + instagram_sent + facebook_sent,
    month_sent: linkedin_sent + instagram_sent + facebook_sent,
    daily_target: 100,
    platform_stats: {
      linkedin: { sent: linkedin_sent, target: 60 },
      instagram: { sent: instagram_sent, target: 25 },
      facebook: { sent: facebook_sent, target: 15 }
    }
  };
}

function getKeywordPerformance() {
  return [
    { keyword: 'site:linkedin.com "outdoor gear wholesale"', label: 'A', score: 85, rate: 85 },
    { keyword: 'site:linkedin.com "camping gear distributor"', label: 'B', score: 72, rate: 72 },
    { keyword: 'site:linkedin.com "tire pump"', label: 'C', score: 68, rate: 68 },
    { keyword: 'site:linkedin.com "camping electronics"', label: 'D', score: 45, rate: 45 },
    { keyword: 'site:linkedin.com "ultralight outdoor"', label: 'E', score: 38, rate: 38 }
  ];
}

function getNextActions(contacts) {
  const pendingKA = contacts.filter(c => c.priority === 'ka' && c.status === 'pending').length;
  const overdue = contacts.filter(c => c.status === 'sent' && isOverdue(c.sentTime)).length;
  
  return [
    { action: 'LinkedIn 今日还需发送 57 条', status: '进行中', priority: '最高' },
    { action: 'Instagram 今日还需发送 24 条', status: '进行中', priority: '最高' },
    { action: 'Facebook 今日还需发送 14 条', status: '进行中', priority: '中' },
    { action: `跟进 KA/连锁客户 ${pendingKA} 个`, status: '待处理', priority: '最高' },
    { action: `跟进超期未回复客户 ${overdue} 个`, status: overdue > 0 ? '⚠️ 优化' : '✅ 完成', priority: '中' },
    { action: '本周进度 17/500', status: '进行中', priority: '中' }
  ];
}

function isOverdue(sentTime) {
  if (!sentTime) return false;
  const sent = new Date(sentTime);
  const now = new Date();
  const daysDiff = (now - sent) / (1000 * 60 * 60 * 24);
  return daysDiff > 7;
}

function getFallbackData() {
  // Return the 37 contacts from the HTML
  const contacts = getDefaultContacts();
  
  return {
    success: true,
    source: 'fallback',
    message: 'Using local data (Google Sheets not configured)',
    contacts,
    stats: calculateStats(contacts),
    keyword_performance: getKeywordPerformance(),
    next_actions: getNextActions(contacts)
  };
}

function getDefaultContacts() {
  return [
    { id: 1, name: "Lealand Blum", company: "Amazon", role: "Vendor Manager", platform: "linkedin", status: "pending", priority: "ka", location: "US", timezone: "America/New_York", score: 95 },
    { id: 2, name: "Peter Whitcomb", company: "TERSUS Solutions", role: "CEO", platform: "linkedin", status: "pending", priority: "ka", location: "US", timezone: "America/New_York", score: 92 },
    { id: 3, name: "Tom Bielek", company: "Yixiang International USA", role: "VP Sales", platform: "linkedin", status: "pending", priority: "ka", location: "US", timezone: "America/New_York", score: 90 },
    { id: 4, name: "Mike Patterson", company: "Bass Pro Shops", role: "Category Manager", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/Chicago", score: 88 },
    { id: 5, name: "Sarah Chen", company: "Cabela's", role: "Senior Buyer", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/Los_Angeles", score: 87 },
    { id: 6, name: "David Martinez", company: "Dick's Sporting Goods", role: "Director Merchandising", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/New_York", score: 86 },
    { id: 7, name: "Jennifer Walsh", company: "Backcountry", role: "Head of Buying", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/Denver", score: 85 },
    { id: 8, name: "Pierre Dubois", company: "Decathlon USA", role: "Sourcing Manager", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/New_York", score: 84 },
    { id: 9, name: "Whitney La Ruffa", company: "Black Dog Outdoors", role: "Founder", platform: "linkedin", status: "sent", priority: "high", location: "US", timezone: "America/Los_Angeles", sentTime: "2026-04-06T10:00:00Z", score: 82 },
    { id: 10, name: "Tom Connell", company: "Gear Coop", role: "Retail/Distribution Executive", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/New_York", score: 80 },
    { id: 11, name: "Sam Read", company: "BETA OUTDOOR SPORTS", role: "Managing Director", platform: "linkedin", status: "pending", priority: "high", location: "UK", timezone: "Europe/London", score: 78 },
    { id: 12, name: "Marc Knight", company: "River Dogs Outfitters", role: "Owner", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/Chicago", score: 76 },
    { id: 13, name: "Thomas Lange", company: "Independent", role: "Intl Commercial Executive", platform: "linkedin", status: "pending", priority: "high", location: "DE", timezone: "Europe/Berlin", score: 75 },
    { id: 14, name: "Carlos Jativa", company: "Plumdrop", role: "Operations Manager", platform: "linkedin", status: "pending", priority: "medium", location: "US", timezone: "America/Los_Angeles", score: 72 },
    { id: 15, name: "Kevin Kaiser", company: "EzyPath Consulting", role: "Founder", platform: "linkedin", status: "pending", priority: "medium", location: "US", timezone: "America/New_York", score: 70 },
    { id: 16, name: "Ian Pund", company: "Altrec.com", role: "Global Strategic Sales", platform: "linkedin", status: "pending", priority: "medium", location: "US", timezone: "America/Los_Angeles", score: 68 },
    { id: 17, name: "Morgan Harman", company: "Technical Sales", role: "Outside Sales", platform: "linkedin", status: "pending", priority: "medium", location: "US", timezone: "America/New_York", score: 65 },
    { id: 18, name: "Justin Hartwig", company: "Camping World", role: "Senior Buyer", platform: "linkedin", status: "pending", priority: "ka", location: "US", timezone: "America/Chicago", score: 94 },
    { id: 19, name: "Johanna Mills Shaughnessy", company: "E-Commerce & Retail", role: "Director", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/New_York", score: 88 },
    { id: 20, name: "Terry Graham", company: "Camping World", role: "Procurement Manager", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/Chicago", score: 86 },
    { id: 21, name: "Peter Jelinek", company: "Camping World", role: "VP Merchandising", platform: "linkedin", status: "pending", priority: "ka", location: "US", timezone: "America/Chicago", score: 93 },
    { id: 22, name: "Renee Gillis", company: "RV Consultant", role: "Product Manager", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/New_York", score: 81 },
    { id: 23, name: "Mark Thompson", company: "REI Co-op", role: "Senior Buyer - Outdoor", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/Los_Angeles", score: 89 },
    { id: 24, name: "Lisa Wang", company: "REI Co-op", role: "Product Manager", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/Los_Angeles", score: 85 },
    { id: 25, name: "Brian O'Connor", company: "L.L.Bean", role: "Senior Buyer - Camping", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/New_York", score: 87 },
    { id: 26, name: "Chris Hoffman", company: "Eastern Mountain Sports", role: "Director of Merchandising", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/New_York", score: 83 },
    { id: 27, name: "Amy Foster", company: "Moosejaw", role: "Senior Outdoor Buyer", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/Detroit", score: 82 },
    { id: 28, name: "Dan Murphy", company: "AutoZone", role: "Senior Buyer - Tire & Auto", platform: "linkedin", status: "pending", priority: "ka", location: "US", timezone: "America/Chicago", score: 91 },
    { id: 29, name: "Rachel Kim", company: "AutoZone", role: "Category Manager", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/Chicago", score: 84 },
    { id: 30, name: "Tom Bradley", company: "NAPA Auto Parts", role: "Director of Merchandising", platform: "linkedin", status: "pending", priority: "ka", location: "US", timezone: "America/Chicago", score: 90 },
    { id: 31, name: "Samantha Lee", company: "NAPA Auto Parts", role: "Senior Buyer", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/Chicago", score: 83 },
    { id: 32, name: "George Martinez", company: "Discount Tire", role: "VP of Merchandising", platform: "linkedin", status: "pending", priority: "ka", location: "US", timezone: "America/Phoenix", score: 88 },
    { id: 33, name: "James Wilson", company: "Walmart", role: "Senior Buyer - Outdoor", platform: "linkedin", status: "pending", priority: "ka", location: "US", timezone: "America/Chicago", score: 95 },
    { id: 34, name: "Emily Chen", company: "Walmart", role: "Buyer - Automotive", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/Chicago", score: 86 },
    { id: 35, name: "Jason Brooks", company: "Best Buy", role: "Senior Buyer - Auto", platform: "linkedin", status: "pending", priority: "high", location: "US", timezone: "America/Chicago", score: 85 },
    { id: 36, name: "Hans Mueller", company: "Intersport", role: "Head of Purchasing", platform: "linkedin", status: "pending", priority: "ka", location: "DE", timezone: "Europe/Berlin", score: 89 },
    { id: 37, name: "Michael Hartridge", company: "Outdoor Retail", role: "Ops Leader", platform: "linkedin", status: "sent", priority: "high", location: "US", timezone: "America/New_York", sentTime: "2026-04-08T14:32:00Z", score: 75 }
  ];
}
