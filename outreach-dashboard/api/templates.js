// API route for message templates
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { templateId, lang, type, variables } = req.body;
    const { name, company, region } = variables;
    
    const templates = {
      initial: {
        en: {
          subject: `Partnership Opportunity - Flextail & ${company}`,
          body: `Hi ${name},\n\nI'm Leo from Flextail. We're Top 1 on Amazon in ultralight outdoor electronics.\n\nWe're launching 36+ new SKUs in 2026 and looking for partners like ${company}.\n\nWould you be open to a quick 15-min call this week?\n\nBest,\nLeo Liu\nSales & Operations Director\nFlextail Gear`
        },
        zh: {
          subject: `合作机会 - Flextail & ${company}`,
          body: `您好 ${name}，\n\n我是Flextail的Leo。我们是亚马逊超轻户外电子类目第一品牌。\n\n2026年将推出36+新品，正在寻找像${company}这样的合作伙伴。\n\n您这周方便安排一个15分钟的电话沟通吗？\n\n此致\nLeo Liu\n销售与运营总监\nFlextail Gear`
        }
      },
      followup: {
        en: {
          subject: `Quick follow-up`,
          body: `Hi ${name},\n\nJust following up on my previous message.\n\nI'd love to explore how Flextail can partner with ${company}.\n\nAre you available for a brief call this week?\n\nBest,\nLeo`
        },
        zh: {
          subject: `跟进`,
          body: `您好 ${name}，\n\n跟进一下之前的消息。\n\n希望能探讨Flextail与${company}的合作机会。\n\n您这周方便通话吗？\n\n此致\nLeo`
        }
      },
      ka: {
        en: {
          subject: `Strategic Partnership - ${company} & Flextail`,
          body: `Hi ${name},\n\nGiven your role at ${company}, I believe there's significant synergy with Flextail.\n\nWe're Amazon's #1 in ultralight outdoor electronics, launching 36+ SKUs in 2026.\n\nWould you have 20 minutes for a strategic discussion?\n\nBest,\nLeo Liu\nFlextail Gear`
        },
        zh: {
          subject: `战略合作 - ${company} & Flextail`,
          body: `您好 ${name}，\n\n鉴于您在${company}的职位，我相信与Flextail有很大的协同效应。\n\n我们是亚马逊超轻户外电子类目第一品牌，2026年将推出36+新品。\n\n您有20分钟时间进行战略讨论吗？\n\n此致\nLeo Liu\nFlextail Gear`
        }
      }
    };

    const selected = templates[type]?.[lang] || templates.initial.en;
    
    return res.status(200).json({
      success: true,
      generated: selected
    });
  }

  // GET - return template list
  res.status(200).json({
    success: true,
    templates: [
      { id: 'flextail-outdoor', brand: 'Flextail', product: 'Outdoor Electronics', templates: { en: true, zh: true, de: true, ja: true } },
      { id: 'flextail-tirepump', brand: 'Flextail', product: 'Tire Pumps', templates: { en: true, zh: true } },
      { id: 'vollyc-3c', brand: 'Vollyc', product: '3C Electronics', templates: { en: true, zh: true } }
    ]
  });
}
