const SALES_COLLATERAL = Object.freeze({
  brand: {
    label: 'FLEXTAIL official brand site',
    url: 'https://www.flextail.com/',
    useFor: ['brand', 'general', 'distributor'],
  },
  assortment: {
    label: 'FLEXTAIL complete product assortment',
    url: 'https://www.flextail.com/collections/all-products',
    useFor: ['retailer', 'buyer', 'category', 'distributor'],
  },
  camping: {
    label: 'FLEXTAIL camping appliances',
    url: 'https://www.flextail.com/collections/camping-appliances',
    useFor: ['camping', 'outdoor', 'retailer'],
  },
  pumps: {
    label: 'FLEXTAIL portable pump collection',
    url: 'https://www.flextail.com/collections/portable-pump',
    useFor: ['pump', 'sleeping pad', 'bike', 'sup', 'retailer'],
  },
  tinyPump2x: {
    label: 'TINY PUMP 2X product proof',
    url: 'https://www.flextail.com/products/tiny-pump-2x',
    useFor: ['camping', 'pump', 'backpacking', 'giftable'],
  },
});

function collateralForLead(lead = {}) {
  const text = [
    lead.company,
    lead.name,
    lead.keyword,
    lead.productCategory,
    lead.category,
    lead.buyerPersona,
    lead.role,
  ].map(value => String(value || '').toLowerCase()).join(' ');
  const entries = Object.values(SALES_COLLATERAL);
  const matched = entries.find(item => item.useFor.some(token => text.includes(token)));
  return matched || SALES_COLLATERAL.assortment;
}

module.exports = { SALES_COLLATERAL, collateralForLead };
