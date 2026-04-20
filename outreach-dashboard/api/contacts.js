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
  if (!rows || rows.length < 2)   return [
  {
    "id": 1,
    "name": "James Chen",
    "company": "Bass Pro Shops",
    "role": "Senior Buyer - Outdoor",
    "platform": "linkedin",
    "status": "accepted",
    "priority": "ka",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 95
  },
  {
    "id": 2,
    "name": "Sarah Miller",
    "company": "REI Co-op",
    "role": "Category Manager - Camping",
    "platform": "linkedin",
    "status": "accepted",
    "priority": "high",
    "location": "US",
    "timezone": "America/Los_Angeles",
    "score": 88
  },
  {
    "id": 3,
    "name": "Michael Torres",
    "company": "Camping World",
    "role": "VP of Merchandising",
    "platform": "linkedin",
    "status": "pending",
    "priority": "ka",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 90
  },
  {
    "id": 4,
    "name": "Emma Wilson",
    "company": "Dick's Sporting Goods",
    "role": "Director of Outdoor Products",
    "platform": "linkedin",
    "status": "accepted",
    "priority": "ka",
    "location": "US",
    "timezone": "America/New_York",
    "score": 88
  },
  {
    "id": 5,
    "name": "David Park",
    "company": "Pacific Outdoor Group",
    "role": "CEO",
    "platform": "linkedin",
    "status": "pending",
    "priority": "high",
    "location": "US",
    "timezone": "America/Los_Angeles",
    "score": 82
  },
  {
    "id": 6,
    "name": "Lisa Chang",
    "company": "L.L.Bean",
    "role": "Head of Buying",
    "platform": "linkedin",
    "status": "pending",
    "priority": "ka",
    "location": "US",
    "timezone": "America/New_York",
    "score": 87
  },
  {
    "id": 7,
    "name": "Robert Kim",
    "company": "AutoZone",
    "role": "Category Manager",
    "platform": "linkedin",
    "status": "pending",
    "priority": "medium",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 78
  },
  {
    "id": 8,
    "name": "Jennifer Lee",
    "company": "REI",
    "role": "Product Sourcing Manager",
    "platform": "linkedin",
    "status": "accepted",
    "priority": "high",
    "location": "US",
    "timezone": "America/Los_Angeles",
    "score": 85
  },
  {
    "id": 9,
    "name": "Mark Johnson",
    "company": "Canadian Tire",
    "role": "Senior Buyer - Electronics",
    "platform": "linkedin",
    "status": "pending",
    "priority": "ka",
    "location": "CA",
    "timezone": "America/Toronto",
    "score": 90
  },
  {
    "id": 10,
    "name": "Amanda White",
    "company": "Backcountry.com",
    "role": "Merchandising Manager",
    "platform": "linkedin",
    "status": "pending",
    "priority": "high",
    "location": "US",
    "timezone": "America/Denver",
    "score": 83
  },
  {
    "id": 11,
    "name": "Chris Brown",
    "company": "Best Buy",
    "role": "Regional Buyer",
    "platform": "linkedin",
    "status": "pending",
    "priority": "ka",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 88
  },
  {
    "id": 12,
    "name": "Kevin Zhang",
    "company": "Global Electronics Distribution",
    "role": "Managing Director",
    "platform": "linkedin",
    "status": "accepted",
    "priority": "high",
    "location": "US",
    "timezone": "America/New_York",
    "score": 80
  },
  {
    "id": 13,
    "name": "Nicole Adams",
    "company": "Walgreens",
    "role": "Category Manager",
    "platform": "linkedin",
    "status": "pending",
    "priority": "ka",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 85
  },
  {
    "id": 14,
    "name": "Tom Martinez",
    "company": "Rural King",
    "role": "Owner",
    "platform": "linkedin",
    "status": "pending",
    "priority": "medium",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 75
  },
  {
    "id": 15,
    "name": "Jessica Wong",
    "company": "Costco Canada",
    "role": "Head of Merchandising",
    "platform": "linkedin",
    "status": "accepted",
    "priority": "ka",
    "location": "CA",
    "timezone": "America/Vancouver",
    "score": 87
  },
  {
    "id": 16,
    "name": "Ryan Cooper",
    "company": "Airstream",
    "role": "Director of Product Development",
    "platform": "linkedin",
    "status": "pending",
    "priority": "high",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 83
  },
  {
    "id": 17,
    "name": "Stephanie Liu",
    "company": "Target",
    "role": "Senior Buyer",
    "platform": "linkedin",
    "status": "pending",
    "priority": "ka",
    "location": "US",
    "timezone": "America/Minneapolis",
    "score": 88
  },
  {
    "id": 18,
    "name": "Brian Scott",
    "company": "Winnebago",
    "role": "Procurement Manager",
    "platform": "linkedin",
    "status": "pending",
    "priority": "high",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 82
  },
  {
    "id": 19,
    "name": "Michelle Chen",
    "company": "MEC Canada",
    "role": "Buyer - Electronics",
    "platform": "linkedin",
    "status": "pending",
    "priority": "medium",
    "location": "CA",
    "timezone": "America/Vancouver",
    "score": 80
  },
  {
    "id": 20,
    "name": "Daniel Brooks",
    "company": "Harbor Freight",
    "role": "Category Manager",
    "platform": "linkedin",
    "status": "pending",
    "priority": "ka",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 85
  },
  {
    "id": 21,
    "name": "Ashley Morgan",
    "company": "RVDA",
    "role": "Director of Partnerships",
    "platform": "linkedin",
    "status": "pending",
    "priority": "low",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 60,
    "excluded": true
  },
  {
    "id": 22,
    "name": "Jason Park",
    "company": "Thor Industries",
    "role": "Strategic Sourcing Director",
    "platform": "linkedin",
    "status": "pending",
    "priority": "ka",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 90
  },
  {
    "id": 23,
    "name": "Laura Martinez",
    "company": "Ace Hardware",
    "role": "Outdoor Category Manager",
    "platform": "linkedin",
    "status": "pending",
    "priority": "ka",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 85
  },
  {
    "id": 24,
    "name": "Eric Wong",
    "company": "Sportsman's Warehouse",
    "role": "VP of Merchandising",
    "platform": "linkedin",
    "status": "pending",
    "priority": "high",
    "location": "US",
    "timezone": "America/Denver",
    "score": 82
  },
  {
    "id": 25,
    "name": "Rachel Green",
    "company": "Walmart",
    "role": "Senior Buyer - Electronics",
    "platform": "linkedin",
    "status": "accepted",
    "priority": "ka",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 92
  }
] API route to fetch contacts from Google Sheet
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
  {
    "id": 1,
    "name": "James Chen",
    "company": "Bass Pro Shops",
    "role": "Senior Buyer - Outdoor",
    "platform": "linkedin",
    "status": "accepted",
    "priority": "ka",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 95
  },
  {
    "id": 2,
    "name": "Sarah Miller",
    "company": "REI Co-op",
    "role": "Category Manager - Camping",
    "platform": "linkedin",
    "status": "accepted",
    "priority": "high",
    "location": "US",
    "timezone": "America/Los_Angeles",
    "score": 88
  },
  {
    "id": 3,
    "name": "Michael Torres",
    "company": "Camping World",
    "role": "VP of Merchandising",
    "platform": "linkedin",
    "status": "pending",
    "priority": "ka",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 90
  },
  {
    "id": 4,
    "name": "Emma Wilson",
    "company": "Dick's Sporting Goods",
    "role": "Director of Outdoor Products",
    "platform": "linkedin",
    "status": "accepted",
    "priority": "ka",
    "location": "US",
    "timezone": "America/New_York",
    "score": 88
  },
  {
    "id": 5,
    "name": "David Park",
    "company": "Pacific Outdoor Group",
    "role": "CEO",
    "platform": "linkedin",
    "status": "pending",
    "priority": "high",
    "location": "US",
    "timezone": "America/Los_Angeles",
    "score": 82
  },
  {
    "id": 6,
    "name": "Lisa Chang",
    "company": "L.L.Bean",
    "role": "Head of Buying",
    "platform": "linkedin",
    "status": "pending",
    "priority": "ka",
    "location": "US",
    "timezone": "America/New_York",
    "score": 87
  },
  {
    "id": 7,
    "name": "Robert Kim",
    "company": "AutoZone",
    "role": "Category Manager",
    "platform": "linkedin",
    "status": "pending",
    "priority": "medium",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 78
  },
  {
    "id": 8,
    "name": "Jennifer Lee",
    "company": "REI",
    "role": "Product Sourcing Manager",
    "platform": "linkedin",
    "status": "accepted",
    "priority": "high",
    "location": "US",
    "timezone": "America/Los_Angeles",
    "score": 85
  },
  {
    "id": 9,
    "name": "Mark Johnson",
    "company": "Canadian Tire",
    "role": "Senior Buyer - Electronics",
    "platform": "linkedin",
    "status": "pending",
    "priority": "ka",
    "location": "CA",
    "timezone": "America/Toronto",
    "score": 90
  },
  {
    "id": 10,
    "name": "Amanda White",
    "company": "Backcountry.com",
    "role": "Merchandising Manager",
    "platform": "linkedin",
    "status": "pending",
    "priority": "high",
    "location": "US",
    "timezone": "America/Denver",
    "score": 83
  },
  {
    "id": 11,
    "name": "Chris Brown",
    "company": "Best Buy",
    "role": "Regional Buyer",
    "platform": "linkedin",
    "status": "pending",
    "priority": "ka",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 88
  },
  {
    "id": 12,
    "name": "Kevin Zhang",
    "company": "Global Electronics Distribution",
    "role": "Managing Director",
    "platform": "linkedin",
    "status": "accepted",
    "priority": "high",
    "location": "US",
    "timezone": "America/New_York",
    "score": 80
  },
  {
    "id": 13,
    "name": "Nicole Adams",
    "company": "Walgreens",
    "role": "Category Manager",
    "platform": "linkedin",
    "status": "pending",
    "priority": "ka",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 85
  },
  {
    "id": 14,
    "name": "Tom Martinez",
    "company": "Rural King",
    "role": "Owner",
    "platform": "linkedin",
    "status": "pending",
    "priority": "medium",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 75
  },
  {
    "id": 15,
    "name": "Jessica Wong",
    "company": "Costco Canada",
    "role": "Head of Merchandising",
    "platform": "linkedin",
    "status": "accepted",
    "priority": "ka",
    "location": "CA",
    "timezone": "America/Vancouver",
    "score": 87
  },
  {
    "id": 16,
    "name": "Ryan Cooper",
    "company": "Airstream",
    "role": "Director of Product Development",
    "platform": "linkedin",
    "status": "pending",
    "priority": "high",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 83
  },
  {
    "id": 17,
    "name": "Stephanie Liu",
    "company": "Target",
    "role": "Senior Buyer",
    "platform": "linkedin",
    "status": "pending",
    "priority": "ka",
    "location": "US",
    "timezone": "America/Minneapolis",
    "score": 88
  },
  {
    "id": 18,
    "name": "Brian Scott",
    "company": "Winnebago",
    "role": "Procurement Manager",
    "platform": "linkedin",
    "status": "pending",
    "priority": "high",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 82
  },
  {
    "id": 19,
    "name": "Michelle Chen",
    "company": "MEC Canada",
    "role": "Buyer - Electronics",
    "platform": "linkedin",
    "status": "pending",
    "priority": "medium",
    "location": "CA",
    "timezone": "America/Vancouver",
    "score": 80
  },
  {
    "id": 20,
    "name": "Daniel Brooks",
    "company": "Harbor Freight",
    "role": "Category Manager",
    "platform": "linkedin",
    "status": "pending",
    "priority": "ka",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 85
  },
  {
    "id": 21,
    "name": "Ashley Morgan",
    "company": "RVDA",
    "role": "Director of Partnerships",
    "platform": "linkedin",
    "status": "pending",
    "priority": "low",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 60,
    "excluded": true
  },
  {
    "id": 22,
    "name": "Jason Park",
    "company": "Thor Industries",
    "role": "Strategic Sourcing Director",
    "platform": "linkedin",
    "status": "pending",
    "priority": "ka",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 90
  },
  {
    "id": 23,
    "name": "Laura Martinez",
    "company": "Ace Hardware",
    "role": "Outdoor Category Manager",
    "platform": "linkedin",
    "status": "pending",
    "priority": "ka",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 85
  },
  {
    "id": 24,
    "name": "Eric Wong",
    "company": "Sportsman's Warehouse",
    "role": "VP of Merchandising",
    "platform": "linkedin",
    "status": "pending",
    "priority": "high",
    "location": "US",
    "timezone": "America/Denver",
    "score": 82
  },
  {
    "id": 25,
    "name": "Rachel Green",
    "company": "Walmart",
    "role": "Senior Buyer - Electronics",
    "platform": "linkedin",
    "status": "accepted",
    "priority": "ka",
    "location": "US",
    "timezone": "America/Chicago",
    "score": 92
  }
]
};
