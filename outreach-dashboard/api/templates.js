// API route for message templates
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { templateId, lang, type, variables } = req.body;
    const { name, company, region } = variables;
    const recipientName = name || 'there';
    const recipientCompany = company || 'your team';
    const regionLine = region ? ` in ${region}` : '';
    const signature = [
      'Sincerely,',
      'Leo Liu',
      'Sales & Operations Director',
      'Brand & ODM Department',
      'SHANGHAI FLEXTAIL TECHNOLOGY CO., LTD.',
      'Tel/WhatsApp: +86 17321028184',
      'Email: Leo@flextailgear.com',
      'https://www.flextail.com/ | https://vollyc.com/',
    ].join('\n');
    
    const templates = {
      initial: {
        en: {
          subject: `Flextail & Vollyc introduction for ${recipientCompany}`,
          body: `Dear ${recipientName},\n\nNice to e-meet you. I am Leo from Flextail & Vollyc.\n\nFlextail is our first and core brand, specializing in ultralight electric products for outdoor, travel, and home use. The brand is currently Top 1 on Amazon, with strong global sell-through and proven product-market fit.\n\nVollyc, our second brand, focuses on 3C electronics for practical, high-rotation consumer use cases.\n\nFrom our perspective, ${recipientCompany}'s platform and positioning are highly aligned with Flextail's product philosophy, especially in lightweight outdoor and travel-oriented electrics${regionLine}.\n\nWe are planning to launch over 36 new SKUs in 2026, covering multiple usage scenarios and price tiers. I would appreciate the opportunity to arrange a short introductory video meeting to present our brands and discuss potential collaboration opportunities.\n\n${signature}`
        },
        zh: {
          subject: `合作机会 - Flextail & ${company}`,
          body: `您好 ${name}，\n\n我是Flextail的Leo。我们是亚马逊超轻户外电子类目第一品牌。\n\n2026年将推出36+新品，正在寻找像${company}这样的合作伙伴。\n\n您这周方便安排一个15分钟的电话沟通吗？\n\n此致\nLeo Liu\n销售与运营总监\nFlextail Gear`
        }
      },
      followup: {
        en: {
          subject: `Quick follow-up`,
          body: `Dear ${recipientName},\n\nJust following up on my previous note introducing Flextail & Vollyc.\n\nFlextail is focused on ultralight outdoor, travel, and home-use electric products, and we are preparing 36+ new SKUs for 2026 across different usage scenarios and price tiers.\n\nIf ${recipientCompany} is reviewing outdoor or travel-oriented electrics, could we arrange a short introductory video meeting, or could you point me to the right buyer/category contact?\n\n${signature}`
        },
        zh: {
          subject: `跟进`,
          body: `您好 ${name}，\n\n跟进一下之前的消息。\n\n希望能探讨Flextail与${company}的合作机会。\n\n您这周方便通话吗？\n\n此致\nLeo`
        }
      },
      ka: {
        en: {
          subject: `Strategic brand introduction - ${recipientCompany} & Flextail`,
          body: `Dear ${recipientName},\n\nNice to e-meet you. I am Leo from Flextail & Vollyc.\n\nFlextail is our first and core brand for ultralight electric products across outdoor, travel, and home use. It is currently Top 1 on Amazon, with strong global sell-through and proven product-market fit. Vollyc complements this with practical, high-rotation 3C electronics.\n\nGiven ${recipientCompany}'s assortment and positioning, I believe Flextail's lightweight outdoor and travel-oriented electrics could be relevant to your future category planning${regionLine}.\n\nWe are planning over 36 new SKUs in 2026 across multiple usage scenarios and price tiers. Would you be available for a short introductory video meeting so I can present our brands, current catalog, and potential collaboration options?\n\n${signature}`
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
