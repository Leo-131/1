(function applyProtectedAgencyMarkets(global) {
  if (!global || !global.COUNTRY_MARKET_DATA || !global.COUNTRY_ALIASES) return;

  const innpro = {
    agentCompany: 'INNPRO Robert Błędowski Sp. z o.o.',
    agentNature: '独家',
    agentOwner: 'Tracy',
    agentStatus: '有效',
    agentDaysLeft: 245,
  };

  const protectedMarkets = {
    '瑞士': { englishName: 'Switzerland' },
    '罗马尼亚': { englishName: 'Romania' },
    '希腊': { englishName: 'Greece' },
    '匈牙利': {
      population: 9600000,
      leisure: '中',
      included: '纳入',
      tier: '正常',
      regionGroup: '欧洲+非洲',
      subRegion: '中欧',
      englishName: 'Hungary',
    },
  };

  Object.entries(protectedMarkets).forEach(([country, details]) => {
    global.COUNTRY_MARKET_DATA[country] = {
      ...(global.COUNTRY_MARKET_DATA[country] || {}),
      ...details,
      ...innpro,
    };
  });

  Object.assign(global.COUNTRY_ALIASES, {
    Greece: '希腊',
    greece: '希腊',
    Hungary: '匈牙利',
    hungary: '匈牙利',
  });
})(window);
