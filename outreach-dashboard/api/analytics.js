// API route for analytics data
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const analysis = {
    funnel: {
      total: 37,
      sent: 3,
      replied: 0,
      accepted: 0,
      meeting: 0
    },
    rates: {
      toSent: 8,
      toReply: 0,
      toAccept: 0,
      toClose: 0
    },
    regions: [
      { name: '美国东部', total: 15, accepted: 0, rate: 0 },
      { name: '美国西部', total: 10, accepted: 0, rate: 0 },
      { name: '美国中部', total: 8, accepted: 0, rate: 0 },
      { name: '欧洲', total: 3, accepted: 0, rate: 0 },
      { name: '英国', total: 1, accepted: 0, rate: 0 }
    ],
    customerTypes: {
      KA: { total: 11, accepted: 0, rate: 0 },
      Chain: { total: 8, accepted: 0, rate: 0 },
      Distributor: { total: 12, accepted: 0, rate: 0 },
      Agent: { total: 6, accepted: 0, rate: 0 }
    },
    insights: [
      { title: '转化率偏低', detail: '当前转化率 0%，建议优化话术和发送时段', priority: '高' },
      { title: 'KA客户集中', detail: '11个KA客户待跟进，建议优先处理', priority: '高' },
      { title: '美国市场为主', detail: '90%客户位于美国，可考虑拓展欧洲', priority: '中' }
    ]
  };

  res.status(200).json({ success: true, analysis });
}
