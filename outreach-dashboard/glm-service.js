'use strict';

function parseJsonContent(text) {
  const cleaned = String(text || '').trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function cleanName(value) {
  return String(value || '').replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
}

const SALES_COPY_REFERENCE = [
  'Leo represents Flextail and Vollyc.',
  'Flextail is the first and core brand: ultralight electric products for outdoor, travel and home use; currently Top 1 on Amazon with strong global sell-through and proven product-market fit.',
  'Vollyc is the second brand for practical, high-rotation 3C electronics.',
  'For outdoor and travel-oriented leads, anchor the message on Flextail fit first, then mention Vollyc only when relevant.',
  'Use a professional B2B structure: nice to e-meet you, explain brand relevance, offer a brief brand/catalog introduction, mention 36+ new SKUs planned for 2026 across usage scenarios and price tiers, and ask for a short intro video meeting or the right buyer/category contact.',
  'Do not claim an existing relationship unless the visible context or lead data proves prior contact.',
].join(' ');

function leadPersona(lead) {
  const text = [
    lead?.company,
    lead?.name,
    lead?.role,
    lead?.buyerPersona,
    lead?.keyword,
    lead?.productCategory,
    lead?.background,
    lead?.category,
  ].map(value => String(value || '').toLowerCase()).join(' ');
  if (/distributor|distribution|importer|dealer|wholesale|agent|代理|进口|分销/.test(text)) {
    return {
      type: 'distributor/importer',
      angle: 'regional sell-through, channel fit, margin-ready product line, and whether they cover outdoor/travel electronics buyers',
      ask: 'the owner of distribution evaluation or the best time for a short intro video meeting',
    };
  }
  if (/category|buyer|merchant|assortment|retail|chain|store|merchandising|采购|品类/.test(text)) {
    return {
      type: 'retail/category buyer',
      angle: 'assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand',
      ask: 'the category buyer or vendor-review owner for a short intro video meeting',
    };
  }
  if (/brand|odm|oem|private label|product manager|sourcing|manufacturer|产品|开发/.test(text)) {
    return {
      type: 'brand/ODM or sourcing lead',
      angle: 'co-development, ODM capability, usage-scenario expansion, and practical product roadmap fit',
      ask: 'the product or sourcing lead for a short intro video meeting',
    };
  }
  if (/3c|electronics|consumer electronics|gadget|tech|digital/.test(text)) {
    return {
      type: '3C/electronics channel',
      angle: 'Vollyc 3C rotation plus Flextail travel electrics, with practical high-frequency consumer use cases',
      ask: 'the electronics category owner for a short intro video meeting',
    };
  }
  return {
    type: 'outdoor/travel channel prospect',
    angle: 'lightweight outdoor and travel-electric relevance, brand credibility, and 2026 SKU pipeline',
    ask: 'the right buyer/category contact for a short intro video meeting',
  };
}

function professionalSalesDraft(lead, draft) {
  const original = String(draft || '').trim();
  const company = cleanName(lead?.company || lead?.name || 'your team');
  const category = cleanName(lead?.keyword || lead?.productCategory || 'camping and outdoor accessories');
  const persona = leadPersona(lead);
  const collateral = collateralForLead(lead);
  const channel = String(lead?.platform || lead?.channel || '').toLowerCase();
  const isSocial = /facebook|instagram|linkedin/.test(channel);
  const stage = String(lead?.touchStage || lead?.sequenceStage || lead?.status || 'initial').toLowerCase();
  const tooGeneric = !/flextail|supplier|wholesale|vendor|category|buyer|merchant|line sheet|distribution|assortment|sku|video meeting|product-market/i.test(original)
    || /appreciate the breadth|love to learn|happy to share details|at your convenience/i.test(original)
    || original.length > 620
    || original.length < 120;
  if (original && !tooGeneric) return original;
  if (/follow.?up.?2|day.?7|day.?10|close/.test(stage)) {
    return [
      `Hi ${company} team — one last quick note from Leo at FLEXTAIL.`,
      `If ${category} is not a current priority, no problem. If it is, who owns the category or vendor review so I can send only the most relevant range?`,
    ].join(' ');
  }
  if (/follow|day.?3|day.?5/.test(stage)) {
    return [
      `Hi ${company} team — following up on my FLEXTAIL note.`,
      `Our ultralight pumps, lighting and travel electrics cover multiple use cases and price tiers, which may fit your ${category} assortment.`,
      `Would a 15-minute range review be useful, or could you point me to the category buyer?`,
    ].join(' ');
  }
  const message = [
    `Hi ${company} team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand.`,
    `For a ${persona.type}, the strongest fit is ${persona.angle}; your ${category} focus looks relevant to that direction.`,
    `We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to ${persona.ask}?`,
  ];
  if (!isSocial) message.splice(2, 0, `Relevant range: ${collateral.url}`);
  return message.join(' ');
}

function leadMessages(lead) {
  return [
    {
      role: 'system',
      content: [
        'You qualify B2B outdoor, camping and RV retail leads for FLEXTAIL.',
        'Return concise JSON only. Never invent identity, contact or trend evidence.',
        'Draft like a senior global channel sales operator: specific, commercial, respectful, and low-pressure.',
        SALES_COPY_REFERENCE,
        'Every draft must be customized to the exact customer persona and concrete lead evidence. Optimize the message for the highest chance of a reply and a booked phone/video meeting, not for generic brand awareness.',
        'Choose the conversion angle by persona: retail/category buyer = assortment fit, price tiers and vendor review; distributor/importer = regional sell-through, margins and channel coverage; brand/ODM/sourcing = co-development and product roadmap; 3C/electronics = Vollyc rotation plus Flextail travel electrics; outdoor/travel channel = lightweight use-case fit.',
        'The outreach draft must be 55-90 English words, mention FLEXTAIL once, connect to the lead category, include either 36+ new SKUs in 2026 or brief brand/catalog intro, ask for a short intro video meeting or the right buyer/category/vendor-review contact, and avoid generic praise, emojis, hype, discounts, false partnerships, or "send catalog" spam.',
      ].join(' '),
    },
    {
      role: 'user',
      content: JSON.stringify({
        task: 'Assess the exact lead and prepare one compliant professional English B2B outreach message for automatic execution when safety gates pass.',
        lead,
        inferredPersona: leadPersona(lead),
        conversionObjective: 'maximize reply rate and conversion to a short phone/video meeting by using the lead-specific persona, category, channel, region, and current conversation context',
        schema: {
          fitScore: 'integer 0-100',
          verdict: 'develop|recheck|skip',
          reason: 'short factual reason',
          draft: '55-90 words, customer-persona-specific professional channel-sales message based on the reference email, mentions FLEXTAIL once, asks for video meeting or buyer/category/vendor-review contact, no false claims',
          nextStep: 'like_follow_dm|open_profile|skip',
        },
      }),
    },
  ];
}

async function requestGlm(options) {
  const config = options || {};
  if (!config.apiKey) throw new Error('GLM API key is not configured');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs || 45000);
  try {
    const response = await (config.fetchImpl || fetch)(
      `${String(config.baseUrl || 'https://open.bigmodel.cn/api/paas/v4').replace(/\/+$/, '')}/chat/completions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: config.model || 'glm-4-flash',
          temperature: 0.2,
          messages: config.messages || leadMessages(config.lead),
        }),
      },
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = data.error && (data.error.message || data.error);
      throw new Error(`GLM request failed: ${response.status}${detail ? ` ${detail}` : ''}`);
    }
    const text = data?.choices?.[0]?.message?.content || '';
    const result = parseJsonContent(text);
    if (result && result.draft) {
      result.draft = professionalSalesDraft(config.lead || {}, result.draft);
    }
    return {
      ok: true,
      model: data.model || config.model || 'glm-4-flash',
      text,
      result,
    };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { leadMessages, leadPersona, parseJsonContent, professionalSalesDraft, requestGlm };
const { collateralForLead } = require('./sales-collateral');
