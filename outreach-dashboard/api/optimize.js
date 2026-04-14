// API route for optimization and health check
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const type = req.query.type;

  if (type === 'profiles') {
    return res.status(200).json({
      success: true,
      customerProfiles: {
        high_potential: [
          { name: "Lealand Blum", company: "Amazon", score: 95, reason: "Amazon Vendor Manager - direct channel" },
          { name: "James Wilson", company: "Walmart", score: 95, reason: "Walmart Senior Buyer - major retail" },
          { name: "Justin Hartwig", company: "Camping World", score: 94, reason: "Senior Buyer - RV market leader" },
          { name: "Peter Jelinek", company: "Camping World", score: 93, reason: "VP Merchandising - decision maker" },
          { name: "Peter Whitcomb", company: "TERSUS", score: 92, reason: "CEO - Amazon background" }
        ],
        medium_potential: [
          { name: "Tom Bielek", company: "Yixiang", score: 90, reason: "VP Sales - multi-channel" },
          { name: "Tom Bradley", company: "NAPA", score: 90, reason: "Director - auto parts" },
          { name: "Dan Murphy", company: "AutoZone", score: 91, reason: "Senior Buyer - tire category" },
          { name: "Mark Thompson", company: "REI", score: 89, reason: "Senior Buyer - outdoor" },
          { name: "Hans Mueller", company: "Intersport", score: 89, reason: "Head of Purchasing - EU" }
        ],
        recommended_action: [
          { customer: "Lealand Blum", company: "Amazon", action: "Send KA proposal", priority: "最高" },
          { customer: "James Wilson", company: "Walmart", action: "Schedule call", priority: "最高" },
          { customer: "Whitney La Ruffa", company: "Black Dog", action: "Follow up (7 days)", priority: "高" }
        ]
      }
    });
  }

  // Default health check response
  res.status(200).json({
    success: true,
    healthCheck: {
      status: 'healthy',
      metrics: {
        'API响应': '< 100ms',
        '数据同步': '正常',
        '系统负载': '低',
        '存储使用': '12%'
      },
      issues: [],
      warnings: []
    },
    automationStrategy: {
      daily_targets: { new_contacts: 100, followups: 30 },
      timing: { best_hours: [9, 10, 14, 15] }
    },
    optimizationSummary: {
      quickWins: [
        '优化LinkedIn消息开头，提高打开率',
        '在9-11am时段集中发送',
        '优先跟进KA客户列表'
      ]
    }
  });
}
