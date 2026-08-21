const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT_JSON = path.join(ROOT, 'google-lead-discovery-latest.json');
const OUT_JS = path.join(ROOT, 'google-lead-discovery-latest.js');
const OUT_CSV = path.join(ROOT, 'google-lead-discovery-latest.csv');
const VERIFIED_EXTERNAL_CANDIDATES_PATH = path.join(ROOT, 'verified-external-candidates.json');
const QUALIFIED_ICP_THRESHOLD = 70;
const EXCLUSIVE_AGENCY_MARKETS = new Map([
  ['switzerland', 'INNPRO Robert Błędowski Sp. z o.o.'],
  ['romania', 'INNPRO Robert Błędowski Sp. z o.o.'],
  ['greece', 'INNPRO Robert Błędowski Sp. z o.o.'],
  ['hungary', 'INNPRO Robert Błędowski Sp. z o.o.'],
]);
const ACTIVE_CUSTOMER_ALIASES = new Set([
  'rei',
  'rei co op',
  'rei coop',
  'academy sports outdoors',
  'acadamy sports outdoors',
  'academy',
  'acadamy',
  'scheels',
  'innpro robert błędowski sp z o o',
  'innpro robert bledowski sp z o o',
  'innpro',
]);

function activeCustomerKey(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/ł/gi, 'l')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\+/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function isActiveCustomer(company) {
  return ACTIVE_CUSTOMER_ALIASES.has(activeCustomerKey(company));
}

function exclusiveAgentForCountry(country) {
  return EXCLUSIVE_AGENCY_MARKETS.get(String(country || '').trim().toLowerCase()) || '';
}

function loadVerifiedExternalCandidates() {
  const parsed = JSON.parse(fs.readFileSync(VERIFIED_EXTERNAL_CANDIDATES_PATH, 'utf8'));
  if (!Array.isArray(parsed)) throw new Error('verified external candidates must be an array');
  return parsed.map((candidate, index) => {
    const required = ['company', 'country', 'url', 'contactUrl', 'segment', 'fitScore', 'evidenceUrl', 'externalVerificationStatus'];
    const missing = required.filter(field => !String(candidate && candidate[field] || '').trim());
    if (missing.length) {
      throw new Error(`verified external candidate ${index + 1} missing: ${missing.join(', ')}`);
    }
    if (Number(candidate.fitScore) < QUALIFIED_ICP_THRESHOLD) {
      throw new Error(`verified external candidate ${candidate.company} is below ICP threshold`);
    }
    if (!/^official_(supplier_form|supplier_route|supplier_email)_verified$/.test(candidate.externalVerificationStatus)) {
      throw new Error(`verified external candidate ${candidate.company} lacks accepted supplier-route evidence`);
    }
    return {
      ...candidate,
      refillSeed: true,
      discoverySupplyLayer: 'verified_external_candidate_registry',
    };
  });
}

const CANDIDATES = [
  {
    company: 'Camp Studio Thailand',
    country: 'Thailand',
    url: 'https://www.campstudio.co.th/',
    instagramUrl: 'https://www.instagram.com/campstudio.chiangmai/',
    officialSocialProfileVerified: true,
    contactUrl: 'https://www.campstudio.co.th/contact',
    segment: 'camping retailer network',
    fitScore: 86,
    background: 'Thai camping retailer with a multi-store dealer network and an official contact form linked from its website.',
    buyerPersona: 'Camping accessories buyer or supplier partnership manager.',
  },
  {
    company: 'Gecko Overland',
    country: 'United Arab Emirates',
    url: 'https://gecko-overland.com/',
    instagramUrl: 'https://www.instagram.com/geckooverland_uae/',
    officialSocialProfileVerified: true,
    contactUrl: 'https://gecko-overland.com/contact/',
    segment: 'camping and overland retailer',
    fitScore: 80,
    background: 'Dubai camping and overland retailer with an official contact form and official Instagram profile.',
    buyerPersona: 'Camping accessories buyer or retail partnership manager.',
  },
  {
    company: 'Basecamp Outfitters Roslyn',
    country: 'United States',
    url: 'https://www.basecamp-outfitters.com/',
    instagramUrl: 'https://www.instagram.com/basecampoutfitters_roslynwa/',
    officialSocialProfileVerified: true,
    contactUrl: 'https://www.basecamp-outfitters.com/',
    segment: 'outdoor specialty retailer',
    fitScore: 74,
    background: 'Washington outdoor specialty retailer whose official website links its official Instagram account.',
    buyerPersona: 'Store owner or outdoor accessories buyer.',
  },
  {
    company: 'New World Outdoor Gear Co',
    country: 'United States',
    url: 'https://www.nwogco.com/',
    instagramUrl: 'https://www.instagram.com/newworldoutdoorgearco/',
    officialSocialProfileVerified: true,
    contactUrl: 'https://www.nwogco.com/',
    segment: 'outdoor gear retailer',
    fitScore: 72,
    background: 'Outdoor gear retailer whose official website links its official Instagram account and contact section.',
    buyerPersona: 'Store owner or outdoor accessories buyer.',
  },
  {
    company: 'REI Co-op',
    country: 'United States',
    url: 'https://www.rei.com/',
    instagramUrl: 'https://www.instagram.com/rei/',
    facebookUrl: 'https://www.facebook.com/REI',
    contactUrl: 'https://www.rei.com/help',
    segment: 'outdoor retail chain',
    fitScore: 98,
    partnershipStatus: 'active_partner',
    doNotOutreach: true,
    background: 'Large US outdoor specialty retailer and co-op with camping, hiking, travel, and outdoor equipment categories.',
    buyerPersona: 'Category buyer / merchandising manager for camping, outdoor electronics, and accessories.',
  },
  {
    company: 'Bass Pro Shops',
    country: 'United States',
    url: 'https://www.basspro.com/',
    instagramUrl: 'https://www.instagram.com/bassproshops/',
    facebookUrl: 'https://www.facebook.com/bassproshops',
    contactUrl: 'https://www.basspro.com/shop/en/contact-us',
    segment: 'outdoor retail chain',
    fitScore: 96,
    background: 'Major North American outdoor, fishing, hunting, camping, and boating retailer with strong channel fit.',
    buyerPersona: 'Outdoor camping accessories buyer or category merchant.',
  },
  {
    company: 'Cabela\'s',
    country: 'United States',
    url: 'https://www.cabelas.com/',
    instagramUrl: 'https://www.instagram.com/cabelas/',
    facebookUrl: 'https://www.facebook.com/Cabelas',
    contactUrl: 'https://www.cabelas.com/shop/en/contact-us',
    segment: 'outdoor retail chain',
    fitScore: 95,
    background: 'Outdoor retail brand under Bass Pro group, relevant for camping and outdoor accessory distribution.',
    buyerPersona: 'Camping, hunting, or outdoor gear buyer.',
  },
  {
    company: 'MEC',
    country: 'Canada',
    url: 'https://www.mec.ca/',
    instagramUrl: 'https://www.instagram.com/mec/',
    facebookUrl: 'https://www.facebook.com/MountainEquipmentCoop',
    contactUrl: 'https://www.mec.ca/en/contact-us',
    segment: 'outdoor retail chain',
    fitScore: 94,
    background: 'Canadian outdoor retail co-op focused on camping, hiking, climbing, travel, and outdoor gear.',
    buyerPersona: 'Camping equipment / outdoor accessories category buyer.',
  },
  {
    company: 'Sail Outdoors',
    country: 'Canada',
    url: 'https://www.sail.ca/',
    instagramUrl: 'https://www.instagram.com/sailoutdoors/',
    facebookUrl: 'https://www.facebook.com/SAILoutdoors',
    contactUrl: 'https://www.sail.ca/en/contact-us',
    segment: 'outdoor retail chain',
    fitScore: 91,
    background: 'Canadian outdoor retailer for camping, fishing, hunting, apparel, and equipment.',
    buyerPersona: 'Outdoor equipment buyer or merchandising lead.',
  },
  {
    company: 'GO Outdoors',
    country: 'United Kingdom',
    url: 'https://www.gooutdoors.co.uk/',
    instagramUrl: 'https://www.instagram.com/gooutdoors/',
    facebookUrl: 'https://www.facebook.com/GOoutdoorsUK/',
    contactUrl: 'https://www.gooutdoors.co.uk/contact-us',
    segment: 'outdoor retail chain',
    fitScore: 93,
    background: 'UK outdoor retailer with camping, tents, hiking, cycling, and outdoor equipment categories.',
    buyerPersona: 'Camping and outdoor accessories buyer.',
  },
  {
    company: 'Cotswold Outdoor',
    country: 'United Kingdom',
    url: 'https://www.cotswoldoutdoor.com/',
    instagramUrl: 'https://www.instagram.com/cotswoldoutdoor/',
    facebookUrl: 'https://www.facebook.com/CotswoldOutdoor',
    contactUrl: 'https://www.cotswoldoutdoor.com/contact-us',
    segment: 'outdoor retail chain',
    fitScore: 90,
    background: 'UK specialty outdoor retailer for hiking, camping, travel, and technical outdoor products.',
    buyerPersona: 'Outdoor product category buyer or partnership manager.',
  },
  {
    company: 'Anaconda',
    country: 'Australia',
    url: 'https://www.anacondastores.com/',
    instagramUrl: 'https://www.instagram.com/anacondastores/',
    facebookUrl: 'https://www.facebook.com/AnacondaStores',
    contactUrl: 'https://www.anacondastores.com/contact-us',
    segment: 'outdoor retail chain',
    fitScore: 92,
    background: 'Australian outdoor retailer for camping, hiking, fishing, 4WD, and outdoor lifestyle equipment.',
    buyerPersona: 'Camping / 4WD / outdoor equipment buyer.',
  },
  {
    company: 'BCF',
    country: 'Australia',
    url: 'https://www.bcf.com.au/',
    instagramUrl: 'https://www.instagram.com/bcf.australia/',
    facebookUrl: 'https://www.facebook.com/BCFAustralia',
    contactUrl: 'https://www.bcf.com.au/contact-us',
    segment: 'outdoor retail chain',
    fitScore: 89,
    background: 'Australian boating, camping, and fishing retailer with strong fit for compact outdoor power and camping accessories.',
    buyerPersona: 'Camping or outdoor accessories buyer.',
  },
  {
    company: 'Kathmandu',
    country: 'New Zealand',
    url: 'https://www.kathmandu.co.nz/',
    instagramUrl: 'https://www.instagram.com/kathmandugear/',
    facebookUrl: 'https://www.facebook.com/Kathmandu',
    contactUrl: 'https://www.kathmandu.co.nz/contact-us',
    segment: 'outdoor brand and retail chain',
    fitScore: 88,
    background: 'New Zealand outdoor brand and retailer with apparel, travel, hiking, and camping categories.',
    buyerPersona: 'Partnership, wholesale, or retail category manager.',
  },
  {
    company: 'Decathlon Germany',
    country: 'Germany',
    url: 'https://www.decathlon.de/',
    instagramUrl: 'https://www.instagram.com/decathlondeutschland/',
    facebookUrl: 'https://www.facebook.com/DecathlonDeutschland',
    contactUrl: 'https://www.decathlon.de/help/app/contact',
    segment: 'sporting goods retail chain',
    fitScore: 90,
    background: 'Large sporting goods retailer with camping, hiking, outdoor, and travel categories.',
    buyerPersona: 'Outdoor/camping category buyer or marketplace partnership lead.',
  },
  {
    company: 'Decathlon France',
    country: 'France',
    url: 'https://www.decathlon.fr/',
    instagramUrl: 'https://www.instagram.com/decathlonfrance/',
    facebookUrl: 'https://www.facebook.com/DecathlonFrance',
    contactUrl: 'https://www.decathlon.fr/help/app/contact',
    segment: 'sporting goods retail chain',
    fitScore: 90,
    background: 'Large French sporting goods retailer with strong outdoor and camping category coverage.',
    buyerPersona: 'Outdoor/camping category buyer or marketplace partnership lead.',
  },
  {
    company: 'Bever',
    country: 'Netherlands',
    url: 'https://www.bever.nl/',
    instagramUrl: 'https://www.instagram.com/bevernl/',
    facebookUrl: 'https://www.facebook.com/BeverNL',
    contactUrl: 'https://www.bever.nl/klantenservice/contactgegevens.html',
    segment: 'outdoor retail chain',
    fitScore: 86,
    background: 'Dutch outdoor retailer for hiking, camping, travel, and outdoor apparel/equipment.',
    buyerPersona: 'Outdoor equipment buyer or category manager.',
  },
  {
    company: 'Liberty Mountain',
    country: 'United States',
    url: 'https://libertymountain.com/',
    instagramUrl: 'https://www.instagram.com/libertymountain/',
    facebookUrl: 'https://www.facebook.com/LibertyMountain',
    contactUrl: 'https://libertymountain.com/find-a-rep',
    segment: 'technical outdoor wholesale distributor',
    customerType: 'agency',
    refillSeed: true,
    fitScore: 95,
    background: 'Large US wholesale distributor carrying camping, hiking, climbing, travel, lighting, electronics, and outdoor products from more than 1,000 brands.',
    buyerPersona: 'Brand acquisition, exclusive distribution, or outdoor products sales leadership.',
  },
  {
    company: 'Summit International',
    country: 'United Kingdom',
    url: 'https://www.summitint.co/',
    instagramUrl: 'https://www.instagram.com/summitint/',
    facebookUrl: 'https://www.facebook.com/summitint',
    contactUrl: 'https://www.summitint.co/contact/',
    publicEmail: 'info@summitint.co',
    contactPhone: '+44 (0) 1268 505 171',
    segment: 'outdoor importer and distributor',
    customerType: 'agency',
    refillSeed: true,
    fitScore: 90,
    background: 'UK outdoor B2B importer and distributor supplying retailers, wholesalers, supermarkets, and independent businesses across camping and hiking categories.',
    buyerPersona: 'Brand partnerships, buying, or distribution director for outdoor products.',
  },
  {
    company: 'Academy Sports + Outdoors',
    country: 'United States',
    url: 'https://www.academy.com/',
    contactUrl: 'https://vendor.academy.com/becoming-a-vendor.html',
    segment: 'sporting goods and outdoor retail chain',
    customerType: 'key_account',
    refillSeed: true,
    fitScore: 96,
    background: 'Large US sporting goods and outdoor retailer with hundreds of stores, camping categories, and an official new outdoor vendor application path.',
    buyerPersona: 'Outdoor category buyer, vendor onboarding, or merchandising manager.',
  },
  {
    company: 'Sportsman\'s Warehouse',
    country: 'United States',
    url: 'https://www.sportsmans.com/',
    instagramUrl: 'https://www.instagram.com/sportsmanswarehouse/',
    facebookUrl: 'https://www.facebook.com/SportsmansWarehouse',
    contactUrl: 'https://www.sportsmans.com/contact-us',
    segment: 'outdoor specialty retail chain',
    customerType: 'key_account',
    refillSeed: true,
    fitScore: 93,
    background: 'US outdoor specialty retailer with more than 140 locations and camping, fishing, hunting, apparel, and footwear categories.',
    buyerPersona: 'Camping equipment category buyer, merchandising lead, or vendor partnership manager.',
  },
  {
    company: 'SCHEELS',
    country: 'United States',
    url: 'https://www.scheels.com/',
    contactUrl: 'https://www.scheels.com/help-center/',
    segment: 'all-sports and outdoor retail chain',
    customerType: 'key_account',
    refillSeed: true,
    fitScore: 92,
    background: 'Employee-owned US all-sports retailer with a large store network, camping and hiking specialty shops, and more than 10,000 associates.',
    buyerPersona: 'Camping and hiking category buyer, business partner, or merchandising manager.',
  },
  {
    company: 'Camping World',
    country: 'United States',
    url: 'https://www.campingworld.com/',
    instagramUrl: 'https://www.instagram.com/campingworld/',
    facebookUrl: 'https://www.facebook.com/campingworld',
    contactUrl: 'https://www.campingworld.com/contact-us.html',
    segment: 'RV and camping retail chain',
    customerType: 'key_account',
    refillSeed: true,
    fitScore: 89,
    background: 'Large US RV and camping retailer with broad portable power, campsite, outdoor living, and travel accessory categories.',
    buyerPersona: 'Camping accessories buyer, vendor partnerships, or outdoor living category manager.',
  },
  {
    company: 'Backcountry',
    country: 'United States',
    url: 'https://www.backcountry.com/',
    instagramUrl: 'https://www.instagram.com/backcountry/',
    facebookUrl: 'https://www.facebook.com/Backcountry/',
    contactUrl: 'https://www.backcountry.com/sc/contact-us',
    segment: 'outdoor ecommerce and specialty retail',
    customerType: 'key_account',
    refillSeed: true,
    fitScore: 94,
    background: 'US outdoor ecommerce and specialty retailer covering camping, hiking, travel, snow, bike, apparel, and outdoor accessories.',
    buyerPersona: 'Outdoor category buyer, marketplace/vendor partnership, or merchandising manager.',
  },
  {
    company: 'evo',
    country: 'United States',
    url: 'https://www.evo.com/',
    instagramUrl: 'https://www.instagram.com/evo/',
    facebookUrl: 'https://www.facebook.com/evo/',
    contactUrl: 'https://www.evo.com/contact',
    segment: 'outdoor gear retailer and adventure retail group',
    customerType: 'key_account',
    refillSeed: true,
    fitScore: 88,
    background: 'Outdoor, ski, snowboard, bike, and adventure gear retailer with multi-store retail and ecommerce channels.',
    buyerPersona: 'Outdoor gear buyer, retail partnership lead, or merchandising manager.',
  },
  {
    company: 'Mountain Warehouse',
    country: 'United Kingdom',
    url: 'https://www.mountainwarehouse.com/',
    instagramUrl: 'https://www.instagram.com/mountainwarehouse/',
    facebookUrl: 'https://www.facebook.com/MountainWarehouse/',
    contactUrl: 'https://www.mountainwarehouse.com/help/contact-us/',
    segment: 'outdoor clothing and equipment retail chain',
    customerType: 'key_account',
    refillSeed: true,
    fitScore: 86,
    background: 'International outdoor retail chain selling outdoor clothing, camping, hiking, travel, and family outdoor equipment.',
    buyerPersona: 'Outdoor accessories buyer, product/category manager, or vendor partnership contact.',
  },
  {
    company: 'Snowys Outdoors',
    country: 'Australia',
    url: 'https://www.snowys.com.au/',
    instagramUrl: 'https://www.instagram.com/snowys_outdoors/',
    facebookUrl: 'https://www.facebook.com/SnowysOutdoors/',
    contactUrl: 'https://www.snowys.com.au/contact-us',
    segment: 'camping and hiking ecommerce retailer',
    customerType: 'key_account',
    refillSeed: true,
    fitScore: 87,
    background: 'Australian camping and hiking retailer focused on camping gear, travel equipment, outdoor accessories, and ecommerce fulfillment.',
    buyerPersona: 'Camping gear buyer, ecommerce category manager, or outdoor accessories partnership contact.',
  },
  {
    company: 'Aqipa',
    country: 'Austria',
    url: 'https://www.aqipa.com/',
    instagramUrl: 'https://www.instagram.com/aqipa.gearguru/',
    contactUrl: 'https://support.aqipa.com/en-US/new-ticket',
    segment: 'pan-European premium consumer electronics and action gear distributor',
    customerType: 'agency',
    refillSeed: true,
    fitScore: 98,
    background: 'Pan-European value-added distributor and brand growth accelerator for premium consumer electronics, lifestyle, accessories, home appliances, e-mobility, and action gear.',
    buyerPersona: 'Brand Operations Management, vendor partnerships, distribution markets, or category director.',
    targetMarkets: 'Germany, Austria, France, Italy, Spain, Portugal, United Kingdom and Nordics',
    excludedMarkets: 'Switzerland, Romania, Greece, Hungary, Netherlands, Belgium, Poland, Czechia, Slovakia, Estonia, Lithuania and Slovenia',
    evidenceUrl: 'https://support.aqipa.com/en-US/kb/articles/anfrage-partner-werden',
    dataSources: ['Aqipa official partner information', 'Aqipa official contact form'],
  },
  {
    company: 'Esprinet Group',
    country: 'Italy',
    url: 'https://www.esprinet.com/en/',
    linkedinUrl: 'https://www.linkedin.com/company/esprinet-group/',
    linkedinDirectOutreach: true,
    contactUrl: 'https://www.esprinet.com/en/become-a-supplier/',
    segment: 'Southern Europe technology and consumer electronics distributor',
    customerType: 'agency',
    refillSeed: true,
    fitScore: 99,
    background: 'Large Southern European technology and consumer electronics distributor serving about 30,000 resellers and working with more than 850 manufacturers.',
    buyerPersona: 'Supplier onboarding, producer partnerships, consumer electronics category, or vendor management director.',
    targetMarkets: 'Italy, Spain and Portugal',
    excludedMarkets: 'Switzerland, Romania, Greece and Hungary',
    evidenceUrl: 'https://www.esprinet.com/en/become-a-supplier/',
    dataSources: ['Esprinet official group website', 'Esprinet official supplier form', 'official LinkedIn company page'],
  },
  {
    company: 'CMS Distribution',
    country: 'Ireland',
    url: 'https://www.cmsdistribution.com/',
    linkedinUrl: 'https://www.linkedin.com/company/cms-distribution',
    linkedinDirectOutreach: true,
    contactUrl: 'https://www.cmsdistribution.com/contact-us',
    segment: 'European value-added consumer electronics and technology distributor',
    customerType: 'agency',
    refillSeed: true,
    fitScore: 97,
    background: 'Value-added technology distributor representing more than 200 manufacturers, with consumer electronics, retail and B2B channel coverage in the UK, Ireland and wider Europe.',
    buyerPersona: 'Vendor partnerships, consumer product sales, brand management, or distribution director.',
    targetMarkets: 'Ireland, United Kingdom, France and Nordics',
    excludedMarkets: 'Switzerland, Romania, Greece, Hungary, Netherlands, Belgium, Poland, Czechia, Slovakia, Estonia, Lithuania and Slovenia',
    evidenceUrl: 'https://www.cmsdistribution.com/contact-us',
    dataSources: ['CMS official company website', 'CMS official contact form', 'official LinkedIn company page'],
  },
  {
    company: 'EET Group',
    country: 'Denmark',
    url: 'https://www.eetgroup.com/en-eu/',
    linkedinUrl: 'https://www.linkedin.com/company/eet-group-a-s/',
    linkedinDirectOutreach: true,
    contactUrl: 'https://www.eetgroup.com/en-eu/eet/become-a-supplier',
    publicEmail: 'sales@eet.eu',
    segment: 'pan-European consumer electronics and value-added technology distributor',
    customerType: 'agency',
    refillSeed: true,
    fitScore: 99,
    background: 'Pan-European distributor operating across 24 markets with more than 30,000 buying customers, a supplier-onboarding form, and consumer electronics, travel accessories, gadgets and smart-home categories.',
    buyerPersona: 'Supplier onboarding, consumer electronics business line, vendor partnerships, or retail distribution director.',
    targetMarkets: 'Nordics, Germany, France, Italy, Spain, Portugal, United Kingdom and Ireland',
    excludedMarkets: 'Switzerland, Romania, Greece and Hungary',
    evidenceUrl: 'https://www.eetgroup.com/en-eu/eet/become-a-supplier',
    dataSources: ['EET official group website', 'EET official supplier form', 'official LinkedIn company page'],
  },
  {
    company: 'KOMSA',
    country: 'Germany',
    url: 'https://komsa.com/en/',
    linkedinUrl: 'https://www.linkedin.com/company/komsa/',
    linkedinDirectOutreach: true,
    contactUrl: 'https://komsa.com/en/contact/',
    segment: 'European consumer electronics sales marketing and distribution group',
    customerType: 'agency',
    refillSeed: true,
    fitScore: 98,
    background: 'Large privately owned European technology sales, marketing and service group with 200 technology partners, 30,000 retail partners, 75,000 points of sale and consumer electronics, smart-home, gaming and e-mobility coverage.',
    buyerPersona: 'Manufacturer partnerships, product management, consumer electronics distribution, or vendor onboarding director.',
    targetMarkets: 'Germany, United Kingdom, Ireland and France',
    excludedMarkets: 'Switzerland, Romania, Greece and Hungary',
    evidenceUrl: 'https://komsa.com/en/contact/',
    dataSources: ['KOMSA official company profile', 'KOMSA official contact form', 'official LinkedIn company page'],
  },
];

const DIRECTORY_REFILL_SOURCE = 'https://outdoorretailer.com/retailers-of-interest/';
const DIRECTORY_REFILL_CANDIDATES = [
  ['Garage Grown Gear', 'United States', 'https://www.garagegrowngear.com/', 'https://www.instagram.com/garagegrowngear/', 91],
  ['CampSaver', 'United States', 'https://www.campsaver.com/', 'https://www.instagram.com/campsaver/', 90],
  ['Enwild', 'United States', 'https://www.enwild.com/', 'https://www.instagram.com/enwildoutdoors/', 88],
  ['Kittery Trading Post', 'United States', 'https://www.kitterytradingpost.com/', '', 89],
  ['High Country Outfitters', 'United States', 'https://highcountryoutfitters.com/', 'https://www.instagram.com/highcountryoutfitters/', 88],
  ['Next Adventure', 'United States', 'https://nextadventure.net/', 'https://www.instagram.com/nextadventurepdx/', 88],
  ['Alpenglow Sports', 'United States', 'https://alpenglowsports.com/', 'https://www.instagram.com/alpenglowsports/', 87],
  ['Ute Mountaineer', 'United States', 'https://utemountaineer.com/', '', 87],
  ['Neptune Mountaineering', 'United States', 'https://neptunemountaineering.com/', '', 87],
  ["Bill & Paul’s Sporthaus", 'United States', 'https://billandpauls.com/', '', 88],
  ['Kenco Outfitters', 'United States', 'https://kencooutfitters.com/', '', 87],
  ['Great Outdoor Provision Co.', 'United States', 'https://www.greatoutdoorprovision.com/', '', 89],
  ['Alpine Shop', 'United States', 'https://www.alpineshop.com/', '', 88],
  ["Jesse Brown's Outdoors", 'United States', 'https://jessebrowns.com/', '', 87],
  ['Travel Country Outfitters', 'United States', 'https://www.travelcountry.com/', '', 87],
  ['The Benchmark Outdoor Outfitters', 'United States', 'https://www.benchmarkoutfitter.com/', '', 88],
  ['Appalachian Outfitters', 'United States', 'https://www.appalachianoutfitters.com/', '', 88],
  ['Roads Rivers and Trails', 'United States', 'https://roadsriversandtrails.com/', '', 87],
  ["Bill Jackson's Shop for Adventure", 'United States', 'https://www.billjacksons.com/', '', 89],
  ['Pack and Paddle', 'United States', 'https://packpaddle.com/', '', 88],
  ['Outdoor World Direct', 'United Kingdom', 'https://www.outdoorworlddirect.co.uk/', '', 88],
  ['Survive & Thrive', 'United Kingdom', 'https://www.survive-thrive.com/', '', 84],
  ['Exploration Wild', 'United States', 'https://explorationwild.com/', '', 86],
  ['Lost Wave', 'United States', 'https://www.lost-wave.com/', '', 82],
  ['Camping Travel Store', 'United Kingdom', 'https://www.campingtravelstore.co.uk/', '', 84],
  ['Newquay Camping & Leisure', 'United Kingdom', 'https://newquaycampingshop.com/', '', 85],
  ['Old School Outdoor', 'United States', 'https://oldschooloutdoor.com/', '', 81],
  ['Kermode Overland', 'Canada', 'https://kermodeoverland.com/', '', 86],
  ['Outcamping', 'United Kingdom', 'https://outcamping.co.uk/', '', 84],
  ['Equipment Outdoors', 'United Kingdom', 'https://www.equipmentoutdoors.co.uk/', '', 83],
  ['Action Outdoors', 'United Kingdom', 'https://www.actionoutdoors.co.uk/', '', 82],
  ['Outdoors Plus', 'Canada', 'https://outdoorsplus.ca/', '', 84],
  ['Canada Outdoors', 'Canada', 'https://www.canadaoutdoors.com/', '', 85],
  ['Backcountry Sportsman', 'United States', 'https://backcountrysportsmanoutfitters.com/', '', 86],
  ['Purely Outdoors', 'United Kingdom', 'https://www.purelyoutdoors.co.uk/', '', 87],
  ['Grasshopper Leisure', 'United Kingdom', 'https://www.grasshopperleisure.co.uk/', '', 86],
  ['The Outdoor Shop Lewes', 'United Kingdom', 'https://www.outdoorshoplewes.co.uk/', '', 83],
  ['Westside Stores', 'Canada', 'https://westsidestores.ca/', '', 87],
  ['Switching Gear', 'Canada', 'https://www.switchinggear.ca/', '', 84],
  ["Mawson's Sports", 'Canada', 'https://mawsons.ca/', '', 83],
  ['Spry', 'Canada', 'https://spryactive.ca/', '', 82],
  ['Pack Gear Go', 'New Zealand', 'https://www.packgeargo.co.nz/', '', 86],
  ['Gearshop', 'New Zealand', 'https://www.gearshop.co.nz/', '', 89],
  ['Lifestyle Gear', 'New Zealand', 'https://lifestylegear.co.nz/', '', 82],
  ['Tight Lines', 'New Zealand', 'https://tightlines.co.nz/', '', 88],
  ['Outdoor Shop NZ', 'New Zealand', 'https://outdoorshop.nz/', '', 85],
  ['Dwights Outdoors', 'New Zealand', 'https://dwights.co.nz/', '', 88],
  ['Outdoor eStore', 'New Zealand', 'https://www.outdoorestore.co.nz/', '', 86],
  ['Camping Country Superstore', 'Australia', 'https://campingcountry.com.au/', '', 89],
  ['West End Outdoors', 'United Kingdom', 'https://www.westendoutdoors.co.uk/', '', 87],
  ['Vamos Outdoors', 'Canada', 'https://vamosoutdoors.ca/', '', 83],
  ['WeyFarm Outdoors', 'United Kingdom', 'https://weyfarm-outdoors.co.uk/', '', 86],
  ['Great Western Camping', 'United Kingdom', 'https://www.greatwesterncamping.co.uk/', '', 88],
  ['Camping World UK', 'United Kingdom', 'https://www.campingworld.co.uk/', '', 90],
  ['Outdoors Ramsey', 'United Kingdom', 'https://www.outdoorsramsey.co.uk/', '', 84],
  ['Castleberg Outdoors', 'United Kingdom', 'https://www.castlebergoutdoors.co.uk/', '', 88],
  ['WM Camping', 'United Kingdom', 'https://wmcamping.co.uk/', '', 85],
  ["MD Outdoors", "New Zealand", "https://www.mdoutdoors.co.nz/", '', 87],
  ["Mc's Outdoor Store", "Ireland", "https://www.mcsoutdoorstore.ie/", '', 86],
  ["Sportsden", "Ireland", "https://www.sportsden.ie/", '', 87],
  ["MacEoin General Merchants", "Ireland", "https://www.maceoinltd.com/", '', 89],
  ["Outdoor Adventure Store", "Ireland", "https://outdooradventurestore.ie/", '', 90],
  ["S.K Camping & Leisure", "United Kingdom", "https://www.skcamping.com/", '', 89],
  ["Black & White Outdoors", "United States", "https://blackandwhiteoutdoors.com/", '', 84],
  ["NZ Outdoors", "New Zealand", "https://www.nz-outdoors.co.nz/", '', 84],
  ["Craze Outdoors", "Canada", "https://crazeoutdoors.com/", '', 88],
  ["Charles Camping", "Ireland", "https://www.charlescamping.ie/", '', 88],
  ["Portwest The Outdoor Shop", "Ireland", "https://www.theoutdoorshop.ie/", '', 90],
  ["Basecamp Dublin", "Ireland", "https://basecamp.ie/", '', 88],
  ["JSJ Camping & Garden", "Netherlands", "https://jsj-bv.com/", '', 91],
  ["Veneboer Camping & Outdoor", "Netherlands", "https://www.veneboercamping.nl/", '', 89],
  ["GetCamping", "Sweden", "https://www.getcamping.se/", '', 88],
  ["Outdoordump", "Netherlands", "https://outdoordump.nl/", '', 84],
  ["OutdoorHaven", "Netherlands", "https://outdoorhaven.nl/", '', 84],
  ["Huna Outdoor", "Netherlands", "https://hunaoutdoor.nl/", '', 89],
  ["Expedition Store Sweden", "Sweden", "https://expeditionstore.se/", '', 90],
  ["Van Os Imports", "Netherlands", "https://www.vanosimports.com/", '', 92],
  ["De Campingwinkel", "Belgium", "https://decampingwinkel.be/", '', 89],
  ["Camps Store Diest", "Belgium", "https://www.campsstore.be/", '', 85],
  ["Klima Outdoor", "Germany", "https://klima-outdoor.de/", '', 84],
  ["CanvasCamp", "Belgium", "https://www.canvascamp.com/", '', 89],
  ["High Peak Outdoor", "Germany", "https://www.highpeak-outdoor.com/", '', 90],
  ["Der Freistaat Mega Store", "Germany", "https://shop.derfreistaat.de/", '', 90],
  ["Van Dijk Outdoor & Recreatie", "Belgium", "https://autodaktenten-webshop.be/", '', 86],
  ["MK Outdoor", "Germany", "https://www.mkoutdoor.de/", '', 85],
  ["Kampersport", "Belgium", "https://kampersport.com/", '', 85],
  ["Shopping4Camping", "Belgium", "https://www.shopping4camping.be/", '', 88],
  ["De Kampeerder", "Belgium", "https://dekampeerder.be/", '', 88],
  ["Campingudstyr.dk", "Denmark", "https://www.campingudstyr.dk/", '', 88],
  ["Naturligvis Outdoor", "Denmark", "https://www.naturligvis.com/", '', 90],
  ['Bentgate Mountaineering', 'United States', 'https://www.bentgate.com/', '', 86],
  ['The Great Outdoor Shop', 'United States', 'https://thegreatoutdoorshop.com/', '', 86],
  ['Backcountry Experience', 'United States', 'https://www.backcountryexperience.com/', '', 88],
  ['Arizona Hiking Shack', 'United States', 'https://www.hikingshack.com/', '', 86],
  ['AvidMax Outfitters', 'United States', 'https://www.avidmax.com/', '', 85],
  ['Tahoe Sports Hub', 'United States', 'https://www.tahoesportshub.com/', '', 87],
  ['J&H Outdoors', 'United States', 'https://jhoutdoors.com/', '', 86],
  ['The Trail Head', 'United States', 'https://trailheadmontana.net/', '', 87],
  ["Hilton's Tent City", 'United States', 'https://www.hiltonstentcity.com/', '', 86],
  ['Durango Outdoor Exchange', 'United States', 'https://durangooutdoorexchange.com/', '', 84],
  ['Gear West', 'United States', 'https://www.gearwest.com/', '', 85],
  ['Valhalla Pure Outfitters', 'Canada', 'https://vpo.ca/', '', 90],
  ['La Cordee', 'Canada', 'https://www.lacordee.com/', '', 88],
  ['Latulippe', 'Canada', 'https://latulippe.com/', '', 87],
  ['Continental Sports Inc', 'Canada', 'https://csisports.ca/', '', 91],
  ['Outdoor Equipment Distributors', 'United States', 'https://www.oedinc.com/', '', 80],
  ['Canadawide Sports', 'Canada', 'https://www.shop.canadawidesports.com/pages/about-us', '', 89],
  ['Outdoor Gear Canada', 'Canada', 'https://www.ogc.ca/', '', 84],
  ['C&G Distribution', 'United States', 'https://cng-distribution.com/', '', 88],
  ['Terra Outdoor Gear Distribution', 'Canada', 'https://terraoutdoorgear.com/', '', 91],
  ['JAMSCA Solutions', 'Canada', 'https://jamsca.com/retailer-sports-goods-wholesaler-for-retailers/', '', 78],
  ['GMD Wholesale', 'Canada', 'https://gmdwholesale.ca/', '', 84],
  ['Classic Products International', 'Canada', 'https://classicproductsinc.com/', '', 80],
  ['CWR Wholesale Distribution', 'United States', 'https://cwrdistribution.com/Camping_Supplies', '', 92],
  ['Northern Exposure Sporting Group', 'Canada', 'https://northernsporting.com/', '', 88],
  ['ROI Recreation Outfitters', 'Canada', 'https://roirecreation.com/about-us', '', 92],
  ['Hicks Inc', 'United States', 'https://www.hicksinc.com/', '', 89],
  ['Interex Industries', 'Canada', 'https://www.interexind.ca/', '', 86],
  ['D.M.A. Distributing', 'Canada', 'https://dmadistributing.ca/', '', 84],
  ['NordCore Group', 'Canada', 'https://www.nordcoregroup.ca/contactus', '', 88],
  ['Sturm Mil-Tec USA', 'United States', 'https://www.sturm-miltec.com/about-us', '', 90],
  ['ICO Distributors', 'Canada', 'https://www.icodistributors.ca/', '', 89],
  ['Wilcor International', 'United States', 'https://www.wilcor.net/', '', 88],
  ['Premium Living Products', 'Canada', 'https://premiumlivingproducts.com/', '', 82],
  ['Tin Shack Ltd', 'Canada', 'https://tinshack.ca/', '', 88],
  ['Young & MacKenzie Distribution', 'Canada', 'https://yandm.ca/b2b/', '', 92],
  ['Hendrix Outdoors', 'United States', 'https://hendrixoutdoors.com/', '', 91],
  ['Garibaldi Supply Co.', 'Canada', 'https://garibaldisupplyco.com/', '', 87],
  ['Yates Outdoor Sales', 'United States', 'https://www.yatesoutdoor.com/', '', 85],
  ['REVASSA', 'Mexico', 'https://revassa.com.mx/', '', 80],
  ['Blue Ridge Knives', 'United States', 'https://www.blueridgeknives.com/wholesale-camping-tools/', '', 86],
  ['Round The Wheel Collective', 'United States', 'https://www.roundthewheelcollective.com/', '', 85],
  ['1889 Sales', 'United States', 'https://1889sales.com/about.html', '', 88],
  ['NOHRTH', 'United States', 'https://nohrth.com/about-us/', '', 90],
  ['Can-Am Sales Group', 'United States', 'https://canamsalesgroup.com/', '', 92],
  ['Zia Works Distribution', 'United States', 'https://www.nwziaworks.com/', '', 86],
  ['The Bunker Agency', 'United States', 'https://www.thebunkeratlanta.com/about', '', 87],
  ['Parallel 33 Sales Group', 'United States', 'https://www.parallel33sales.com/about', '', 89],
  ['Caraway & Co.', 'United States', 'https://www.carawayandco.com/', '', 84],
  ['RTIC Mexico', 'Mexico', 'https://rtic.mx/products/hilera-rtic-45-hard-cooler', '', 78],
  ['Coonhound Sales & Marketing', 'Canada', 'https://coonhoundsales.com/contact/', '', 91, 'sales_agency'],
  ['Escala Sales & Marketing', 'Canada', 'https://escala.ca/', '', 89],
  ['Sportco Marketing', 'United States', 'https://www.sportcomarketinginc.com/', '', 93],
  ['Waypoint Outdoor', 'United States', 'https://www.waypointoutdoor.com/wp-content/uploads/2025/04/Rockies-PNW-Territory-sales-rep-4.2025.pdf', '', 94],
  ['Vigos Group', 'United States', 'https://vigosgroup.com/', '', 91],
  ['Henry Sports Group', 'Canada', 'https://henrysportsgroup.ca/about', '', 87],
  ['Urban Outdoor Sales', 'United States', 'https://www.urbanoutdoorsales.net/', '', 86],
  ['Outlaw Mountain Sports', 'United States', 'https://www.outlawmtn.com/', '', 94, 'sales_agency'],
  ['Housed & Harnessed', 'United Kingdom', 'https://housedandharnessed.uk/contact', '', 92, 'sales_agency'],
  ['Action Sports Distribution', 'United Kingdom', 'https://www.actionsportsdist.co.uk/', '', 91, 'sales_agency'],
  ['Maxtrack Distribution', 'United Kingdom', 'https://maxtrack.com/', 'https://www.instagram.com/maxtrack.distribution/', 92, 'sales_agency'],
  ['Shiner Distribution', 'United Kingdom', 'https://shiner.co.uk/', '', 91, 'sales_agency'],
  ['Watersports Solution', 'United Kingdom', 'https://www.watersportssolution.co.uk/', '', 90, 'sales_agency'],
  ['PSS Agency', 'United States', 'https://pssagency.com/', '', 93, 'sales_agency'],
  ['Wire to Wire Partners', 'United States', 'https://wiretowirepartners.com/', '', 91, 'sales_agency'],
  ['Sports, Inc.', 'United States', 'https://www.sportsinc.us/prospective-suppliers', '', 96, 'key_account'],
  ['Stellar Sales Alliance', 'United States', 'https://stellarsalesalliance.com/', '', 86, 'sales_agency'],
  ['Sport Dimension', 'United States', 'https://www.sportdimension.com/about-us', '', 88, 'key_account'],
  ['Alexander & Townsend', 'United States', 'https://www.alexander-townsend.com/contact-us', '', 94, 'sales_agency'],
  ['Mountain States Sales', 'United States', 'https://www.mountainstatessales.com/', '', 90, 'sales_agency'],
  ['MWS Associates', 'United States', 'https://mws-associates.com/', '', 95, 'sales_agency'],
  ['Phil Hunt Agencies', 'United Kingdom', 'https://www.philhuntagencies.co.uk/', '', 89, 'sales_agency'],
  ['The Outdoor Agency Ireland', 'United Kingdom', 'https://theoutdooragencyireland.com/', 'https://www.instagram.com/outdooragencyie/', 92, 'sales_agency'],
  ['The Foundry', 'United Kingdom', 'https://www.thisisthefoundry.com/sector/outdoors', 'https://www.linkedin.com/company/wearethefoundry', 86, 'sales_agency'],
  ['Howe Sound Sales', 'Canada', 'https://howesoundsales.com/', '', 91],
  ['Outdoor Market Alliance', 'United States', 'https://www.outdoormarketalliance.org/', '', 86],
  ['Tandem West Sales', 'Canada', 'https://www.tandemwestsales.com/', '', 89],
  ['360 Adventure Collective', 'United States', 'https://360adventurecollective.org/', '', 87],
  ['OnwardUP', 'Canada', 'https://onwardup.com/brands/', '', 94],
  ['OUTTECH', 'United States', 'https://www.outtech-online.com/', '', 96],
  ['Covey Sales & Marketing', 'United States', 'https://coveysales.com/aboutus/', '', 92, 'sales_agency'],
  ['4 Point Sales', 'United States', 'https://www.4pointsales.com/', '', 90, 'sales_agency'],
  ['Rep First', 'United States', 'https://www.repfirst.com/about-us', '', 92, 'sales_agency'],
  ['Venture Out, Inc.', 'United States', 'https://ventureoutinc.com/', '', 88, 'sales_agency'],
  ['Adventure Marketing Group', 'United States', 'https://www.adventuremarketinggroup.net/', '', 94, 'sales_agency'],
  ['Sharp End Sales', 'United States', 'https://www.sharpendsales.com/', '', 90, 'sales_agency'],
  ['Ground Up Sales', 'United States', 'https://www.groundupsales.net/who-we-are', '', 91, 'sales_agency'],
  ['Adventure Labworks', 'United States', 'https://www.adventurelabworks.com/new-page-3', '', 95, 'sales_agency'],
  ['End2End Outdoor', 'United States', 'https://end2endoutdoor.com/', '', 94, 'sales_agency'],
  ['Ascension Sales Group', 'United States', 'https://www.ascensionsalesgroup.com/', '', 92, 'sales_agency'],
  ['The Alpine Cowboy', 'United States', 'https://alpinecowboy.com/index.html', '', 91, 'sales_agency'],
  ['KNS Reps', 'United States', 'https://www.knsreps.com/contact.asp', '', 91, 'sales_agency'],
  ['Midwest Outdoor Sales', 'United States', 'https://www.midwestoutdoorsales.com/', '', 95, 'sales_agency'],
  ['Parallel 45 Sales Group', 'United States', 'https://parallel45sales.com/', '', 91, 'sales_agency'],
  ['Powers Pedersen Sales Group', 'United States', 'https://p-psg.com/', '', 92, 'sales_agency'],
  ['Pacific Crest Trading', 'United States', 'https://www.pctreps.com/', '', 94, 'sales_agency'],
  ['Sierra Outdoor Collective', 'United States', 'https://sierraoutdoorcollective.com/', '', 94, 'sales_agency'],
  ['Green River Sales Group', 'United States', 'https://www.greenriversales.com/contact-us', '', 92, 'sales_agency'],
  ['Cordillera Sales', 'United States', 'https://www.cordillerasales.com/', '', 91, 'sales_agency'],
  ['Granite Marketing', 'United States', 'https://www.granitereps.com/', '', 92, 'sales_agency'],
  ['Hi Altitude Sales & Consulting', 'United States', 'https://www.hialtitude.com/', '', 93, 'sales_agency'],
  ['Summit Sales NW', 'United States', 'https://www.summitsalesnw.com/', '', 96, 'sales_agency'],
  ['West Bay Trading Company', 'United States', 'https://www.westbaytradingcompany.com/', '', 90, 'sales_agency'],
  ['North Branch Traders', 'United States', 'https://www.northbranchtraders.com/about-us', '', 92, 'sales_agency'],
  ['Babbling Brook Sales', 'United States', 'https://www.babblingbrooksales.com/', '', 88, 'sales_agency'],
  ['Sanitas Sales Group', 'United States', 'https://sanitassalesgroup.com/about/', '', 94, 'sales_agency'],
  ['Mountain Source', 'United States', 'https://www.mountainsource.com/', '', 95, 'sales_agency'],
  ['Black Dog Sales Group', 'United States', 'https://www.blackdogsalesgroup.com/', '', 91, 'sales_agency'],
  ['Freestone Sales Group', 'United States', 'https://freestonesalesgroup.com/', '', 90, 'sales_agency'],
  ['Pinnacle Outdoor Group', 'United States', 'https://www.pinnacleoutdoorgroup.com/', '', 92, 'sales_agency'],
  ['Roam Sales Agency', 'United States', 'https://www.roam-sales.com/', '', 89, 'sales_agency'],
  ['Heron Outdoors', 'United States', 'https://www.heronoutdoors.co/', '', 88, 'sales_agency'],
  ['Elevated Outdoor Sales', 'United States', 'https://www.elevatedoutdoorsales.com/home', '', 90, 'sales_agency'],
  ['Mindful Outdoor Sales', 'United States', 'https://www.mindfuloutdoorsales.com/', '', 89, 'sales_agency'],
  ['Stoner Andrews', 'United States', 'https://www.stonerandrews.com/history-ethos', '', 94, 'sales_agency'],
  ['Action Sports Agency', 'United States', 'https://www.actionsportsagency.com/', '', 90, 'sales_agency'],
  ['VERT Outdoors', 'United States', 'https://vertoutdoors.com/team', '', 92, 'sales_agency'],
  ['Evergreen Outdoor Group', 'United States', 'https://www.evergreenog.com/our-story', '', 91, 'sales_agency'],
  ['Skyline Sales & Consulting', 'United States', 'https://www.skylinesalesreps.com/about-us', '', 92, 'sales_agency'],
  ['Specialty Sports Reps', 'United States', 'https://www.teamssr.com/', '', 91, 'sales_agency'],
  ['Brandywine River Reps', 'United States', 'https://www.brreps.com/', '', 91, 'sales_agency'],
  ['Professional Marketing Inc', 'United States', 'https://www.wileyoutdoorproducts.com/', '', 88, 'sales_agency'],
  ['Elite Outdoor Sports Marketing', 'United States', 'https://eliteoutdoorsports.com/who-we-are/', '', 90, 'sales_agency'],
  ['Pacific Coast Sports Marketing', 'United States', 'https://www.pacificcoastsportsmkt.com/', '', 92, 'sales_agency'],
  ['7 Summits Sports', 'United States', 'https://www.7summitssportsinc.com/', '', 89, 'sales_agency'],
  ['Level 8 Outdoor', 'United States', 'https://level8outdoor.com/about-us', '', 93, 'sales_agency'],
  ['Sespe Group', 'United States', 'https://www.sespegroup.com/', '', 95, 'sales_agency'],
  ['Edgeline Collective', 'United States', 'https://edgelinecollective.com/', '', 87, 'sales_agency'],
  ['Suggs-Nicholas-Shea', 'United States', 'https://suggsnicholasshea.com/', '', 90, 'sales_agency'],
  ["O'Brien Sales", 'United States', 'https://www.obriensales.com/about/', '', 90, 'sales_agency'],
  ['Mountain Exposure', 'Canada', 'https://www.mountainx.ca/sales', '', 93, 'sales_agency'],
  ['High Gear Sales', 'Canada', 'https://www.highgearsales.ca/', '', 88, 'sales_agency'],
  ['Owens Outdoor Sales', 'United States', 'https://owensoutdoorsales.com/', '', 91, 'sales_agency'],
  ['MTNSTUFF', 'United States', 'https://www.mtnstuff.com/', '', 94, 'sales_agency'],
  ['Perspective Outdoor', 'United States', 'https://www.perspectiveoutdoor.com/contact-us', '', 90, 'sales_agency'],
  ['RV Lifestyle', 'United States', 'https://www.rvli.com/contact', '', 91, 'sales_agency'],
  ['Gravel Agency', 'Canada', 'https://www.gravelagency.com/en/', '', 94, 'sales_agency'],
  ['Avenue Distribution', 'Canada', 'https://avenuedist.com/', 'https://www.instagram.com/avenue_distribution/?hl=en', 93, 'sales_agency'],
  ['Pro Line Sports', 'Canada', 'https://www.proline-sports.ca/', 'https://instagram.com/prolinesportscanada', 94, 'sales_agency'],
  ['C.G. Emery International', 'Canada', 'https://www.cgemery.info/', '', 94, 'sales_agency'],
  ['BlueRiver Trading', 'Canada', 'https://www.bluerivertrading.com/company.asp', '', 92, 'sales_agency'],
  ['Rock Gear Distribution', 'Canada', 'https://rockgeardistribution.com/wp-content/uploads/2019/12/Press-Release-Bliz-Rock-Gear-2019.pdf', '', 94, 'sales_agency'],
  ['Base Camp Agency', 'United States', 'https://www.base-camp-agency.com/', 'https://www.instagram.com/basecamp.agency/?hl=en', 88, 'sales_agency'],
  ['Something Clever PNW', 'United States', 'https://www.somethingcleverpnw.com/', 'https://www.instagram.com/something_clever/', 91, 'sales_agency'],
  ['Rabbit Mountain Mexico', 'Mexico', 'https://rabbitmex.com/', 'https://www.instagram.com/rabbitmountainmex/', 95, 'key_account'],
  ['Nomadic Supply Company', 'United States', 'https://nomadicsupply.com/sell-your-products-with-nomadic-supply-company/', 'https://www.instagram.com/nomadic.supply/', 95, 'key_account'],
  ['Punto Vertical Mexico', 'Mexico', 'https://www.puntovertical.com.mx/', 'https://www.instagram.com/puntoverticalmx/', 90, 'key_account'],
  ['Endless Adventure Sales', 'United States', 'https://endlessadventuresales.com/contact', '', 93, 'sales_agency'],
  ['The Curtis Group Sales', 'United States', 'https://thecurtisgroupsales.com/contact-us/', '', 93, 'sales_agency'],
  ['Denne Sport Sales', 'United States', 'https://dssmw.com/', '', 92, 'sales_agency'],
  ['Aim Outside LLC', 'United States', 'https://aimoutside.com/', 'https://www.linkedin.com/company/aim-outside-llc', 94, 'sales_agency'],
  ['Activ Agency Denver', 'United States', 'https://www.activagency.com/contact', 'https://www.instagram.com/activagency', 92, 'sales_agency'],
  ['Air Fresh Marketing', 'United States', 'https://www.airfreshmarketing.com/outdoor-recreation-brand-ambassadors', '', 88, 'sales_agency'],
  ['Boardwalk Sales Agency', 'Canada', 'https://www.boardwalksales.ca/contact-us', '', 93, 'sales_agency'],
  ['Tandem West Sales', 'Canada', 'https://www.tandemwestsales.com/', '', 94, 'sales_agency'],
  ['Nicolas Rochon Agency', 'Canada', 'https://www.agencenr.com/', '', 90, 'sales_agency'],
  ['Out There Social Outdoor Agency', 'Canada', 'https://www.outtheresocial.ca/services', '', 88, 'sales_agency'],
  ['Tentworld', 'Australia', 'https://www.tentworld.com.au/', '', 90],
  ['Wildfire Sports', 'Australia', 'https://www.wildfiresports.com.au/', '', 87],
  ['Bivouac Outdoor', 'New Zealand', 'https://www.bivouac.co.nz/', '', 89],
  ['Further Faster', 'New Zealand', 'https://www.furtherfaster.co.nz/', '', 86],
  ['Trekitt', 'United Kingdom', 'https://www.trekitt.co.uk/', '', 90],
  ['Taunton Leisure', 'United Kingdom', 'https://www.tauntonleisure.com/', '', 88],
  ['Ultralight Outdoor Gear', 'United Kingdom', 'https://ultralightoutdoorgear.co.uk/', '', 90],
  ['SportPursuit', 'United Kingdom', 'https://www.sportpursuit.com/', '', 87],
  ['Alpinetrek', 'United Kingdom', 'https://www.alpinetrek.co.uk/', '', 89],
  ['Bergfreunde', 'Germany', 'https://www.bergfreunde.eu/', 'https://www.instagram.com/bergfreunde/', 91],
  ['Bergzeit', 'Germany', 'https://www.bergzeit.de/', 'https://www.instagram.com/bergzeit/', 90],
  ['Globetrotter', 'Germany', 'https://www.globetrotter.de/', 'https://www.instagram.com/globetrotterde/', 92],
  ['Fritz Berger', 'Germany', 'https://www.fritz-berger.de/', 'https://www.instagram.com/berger.camping/', 91],
  ['Camping Wagner', 'Germany', 'https://www.campingwagner.de/', 'https://www.instagram.com/campingwagner/', 90],
  ['Obelink', 'Netherlands', 'https://www.obelink.nl/', '', 93],
  ['OutdoorXL', 'Netherlands', 'https://www.outdoorxl.nl/', '', 88],
  ['Kampeerwereld Hendriks', 'Netherlands', 'https://www.kampeerwereld.nl/', '', 87],
  ['De Wit Schijndel', 'Netherlands', 'https://www.de-wit.nl/', '', 89],
  ['Au Vieux Campeur', 'France', 'https://www.auvieuxcampeur.fr/', '', 91],
  ['Snowleader', 'France', 'https://www.snowleader.com/', '', 89],
  ['Hardloop', 'France', 'https://www.hardloop.fr/', '', 87],
  ['Ekosport', 'France', 'https://www.ekosport.fr/', '', 89],
  ['Barrabes', 'Spain', 'https://www.barrabes.com/', '', 89],
  ['Scandinavian Outdoor', 'Finland', 'https://scandinavianoutdoor.com/', '', 89],
  ['Varuste', 'Finland', 'https://varuste.net/', '', 87],
  ['Outnorth', 'Sweden', 'https://www.outnorth.com/', '', 90],
  ['Naturkompaniet', 'Sweden', 'https://www.naturkompaniet.se/', '', 90],
  ['Fjellsport', 'Norway', 'https://www.fjellsport.no/', '', 90],
  ['Spejder Sport', 'Denmark', 'https://www.spejdersport.dk/', '', 88],
  ['Friluftsland', 'Denmark', 'https://www.friluftsland.dk/', '', 88],
  ['Transa', 'Switzerland', 'https://www.transa.ch/', '', 89],
  ['Precision Sales Unlimited', 'United States', 'https://www.precisionsalesunlimited.com/', '', 86, 'sales_agency'],
  ['Three Mountain Associates', 'United States', 'https://www.threemountainassociates.com/', '', 85, 'sales_agency'],
  ['Precision Sales and Marketing', 'United States', 'https://www.precisionsalesandmarketing.com/services', '', 86, 'sales_agency'],
  ['Kittredge and Associates', 'United States', 'https://www.kittredgeandassociates.com/', '', 84, 'sales_agency'],
  ['PFP and Associates', 'United States', 'https://www.pfpandassociates.com/', '', 86, 'sales_agency'],
  ['Front Point Sales', 'United States', 'https://frontpointsales.com/', '', 82, 'sales_agency'],
  ['Morrison Sports Marketing', 'United States', 'https://morrisonsportsmarketing.com/', '', 84, 'sales_agency'],
  ['Reach Sales Group', 'United States', 'https://www.reach-salesgroup.com/', '', 83, 'sales_agency'],
  ['Apex Outdoor Sales', 'United States', 'https://www.apexoutdoorsales.com/', '', 84, 'sales_agency'],
  ['The Evans Group', 'United States', 'https://theevansgroup.net/about/', '', 87, 'sales_agency'],
  ['Outdoor Industry Group', 'United States', 'https://outdoorindustrygroup.com/contact-us/', '', 84, 'sales_agency'],
  ['Northwest Road Reps', 'United States', 'https://nwroadreps.com/brands/', '', 84, 'sales_agency'],
  ['Kelly Brand Management', 'United States', 'https://www.kellybrandmanagement.com/who-we-serve/', '', 84, 'sales_agency'],
  ['Awesome Outdoors Group', 'United States', 'https://www.awesomeoutdoorsgroup.com/about-us', '', 85, 'sales_agency'],
  ['Action Brio', 'Canada', 'https://www.actionbrio.com/about', '', 84, 'sales_agency'],
  ['AKA Sports Group', 'Canada', 'https://www.akasportsgroup.com/', '', 83, 'sales_agency'],
  ['CRF Agency', 'Canada', 'https://www.crfagency.com/about', '', 82, 'sales_agency'],
  ['NLA Agency', 'Canada', 'https://nlaagency.com/', '', 86, 'sales_agency'],
  ['Mutinous Sales and Marketing', 'Canada', 'https://sites.google.com/mutinousmarketing.com/mutinous-sales-marketing/home', '', 80, 'sales_agency'],
  ['Rise and Shine Sales Agency', 'Canada', 'https://www.riseandshinesales.ca/', '', 83, 'sales_agency'],
  ['Green Drake Outdoors', 'United States', 'https://www.greendrakeoutdoors.com/', '', 82, 'sales_agency'],
  ['Perpetual Motion NW', 'United States', 'https://www.perpetualmotionnw.com/', '', 84, 'sales_agency'],
  ['BRM Reps', 'United States', 'https://www.brmreps.com/contact-us.html', '', 83, 'sales_agency'],
].map(([company, country, url, instagramUrl, fitScore, customerType = 'key_account']) => ({
  company,
  country,
  url,
  contactUrl: url,
  instagramUrl,
  segment: customerType === 'sales_agency'
    ? 'verified outdoor industry manufacturer representative and sales agency'
    : 'verified outdoor, camping, travel and consumer electronics retail channel',
  customerType,
  refillSeed: true,
  fitScore,
  background: customerType === 'sales_agency'
    ? `${company} is qualified from its first-party website as a North American outdoor-industry sales or manufacturer-representative agency with retailer and brand-development relationships relevant to FLEXTAIL distribution.`
    : `${company} is listed or qualified as an outdoor/camping specialty retail prospect with assortment fit for lightweight outdoor electrics and practical high-rotation 3C products.`,
  buyerPersona: customerType === 'sales_agency'
    ? 'Agency principal, brand-development lead or vendor-partnership owner.'
    : 'Outdoor electronics, camping accessories, travel products or consumer electronics category buyer.',
  // The directory is a discovery hint only. The persisted execution evidence
  // must remain the candidate's first-party website so downstream gates never
  // mistake a directory or search page for identity proof.
  evidenceUrl: url,
  discoverySourceUrl: DIRECTORY_REFILL_SOURCE,
  dataSources: ['Outdoor Retailer retailer directory', 'official company website'],
}));

const DIRECTORY_PUBLIC_CONTACT_ENRICHMENT = {
  'RV Lifestyle': ['info@rvli.com', 'Official company-domain email published on the RV Lifestyle contact page; the same first-party site identifies RV Lifestyle as a U.S. manufacturers representative agency serving suppliers, distributors and dealers.', 'https://www.rvli.com/contact'],
  'Gravel Agency': ['csr@gravelagency.com', 'Official company-domain customer-service email published on the Gravel Agency website; the same first-party site identifies Gravel as a Canadian manufacturers representative agency and distributor with coast-to-coast retailer coverage.', 'https://www.gravelagency.com/en/'],
  'Avenue Distribution': ['sean@avenuedist.com', 'Named founder email published on Avenue Distribution official website; the same page documents 30+ years connecting outdoor and action-sports brands with Canadian retailers and links the official Instagram profile.', 'https://avenuedist.com/'],
  'Pro Line Sports': ['info@proline-sports.ca', 'Official company-domain email published on Pro Line Sports official website; the same page documents Canadian outdoor sales, strategy, marketing and distribution and links official Facebook, Instagram and LinkedIn profiles.', 'https://www.proline-sports.ca/'],
  'C.G. Emery International': ['info@cgemery.com', 'Official company-domain email published on the C.G. Emery website, which identifies the company as a Canadian outdoor wholesale distributor supporting more than 300 dealer locations.', 'https://www.cgemery.info/'],
  'BlueRiver Trading': ['info@bluerivertrading.com', 'Official company-domain email published on the BlueRiver Trading company page, which identifies the company as a Canadian wholesale outdoor distributor marketing exclusively to retailers across Canada.', 'https://www.bluerivertrading.com/company.asp'],
  'Rock Gear Distribution': ['ian@rockgeardistribution.com', 'Named president email published in a first-party Rock Gear Distribution document that identifies the company as an active-outdoor distributor with a nationwide Canadian sales-rep network serving specialty and large-format retailers.', 'https://rockgeardistribution.com/wp-content/uploads/2019/12/Press-Release-Bliz-Rock-Gear-2019.pdf'],
  'Base Camp Agency': ['cameron@base-camp-agency.com', 'Official company-domain email published on Base Camp Agency official website beside its outdoor-industry specialty sales and wholesale account-management services and official Instagram and LinkedIn links.', 'https://www.base-camp-agency.com/'],
  'Something Clever PNW': ['hello@somethingcleverpnw.com', 'Official company-domain email published on Something Clever official website, which identifies the company as a Pacific Northwest outdoor and lifestyle sales agency and links its official Instagram profile.', 'https://www.somethingcleverpnw.com/'],
  'Rabbit Mountain Mexico': ['contacto@rabbitmex.com', 'Official company-domain email published on Rabbit Mountain Mexico official website, which identifies the company as a Mexican outdoor wholesaler with 5,000+ products, 10+ brands and presence in 20+ cities and links its official Facebook and Instagram profiles.', 'https://rabbitmex.com/'],
  'Nomadic Supply Company': ['', 'Official first-party Sell Your Products page invites outdoor brands to apply to one of North America’s largest overlanding retailers, which reports 20,000+ products, 350+ partner brands and links its official Instagram profile.', 'https://nomadicsupply.com/sell-your-products-with-nomadic-supply-company/'],
  'Punto Vertical Mexico': ['contacto@puntovertical.com.mx', 'Official company-domain email published on Punto Vertical official website beside its national Mexican outdoor retail operation and exact official Facebook and Instagram links.', 'https://www.puntovertical.com.mx/'],
  'Endless Adventure Sales': ['', 'Official contact page of a U.S. outdoor-lifestyle sales agency whose first-party site states it represents brands across Arizona, California, Hawaii and Nevada.', 'https://endlessadventuresales.com/contact'],
  'The Curtis Group Sales': ['', 'Official contact form of a U.S. ski and outdoor sales agency representing brands across New England and the Mid-Atlantic.', 'https://thecurtisgroupsales.com/contact-us/'],
  'Denne Sport Sales': ['joe.denne@dssmw.com', 'Named company-domain email published on the official site of a Midwest outdoor-industry sales agency that represents footwear and apparel brands and develops key accounts.', 'https://dssmw.com/'],
  'Aim Outside LLC': ['', 'Official company LinkedIn profile cross-links aimoutside.com and identifies a U.S. outdoor manufacturer representative with more than 600 retailer relationships across North America.', 'https://www.linkedin.com/company/aim-outside-llc'],
  'Activ Agency Denver': ['', 'Official website identifies a Denver outdoor and action-sports sales agency in a showroom collective representing more than 175 brands and links its exact official Instagram profile.', 'https://www.activagency.com/about'],
  'Air Fresh Marketing': ['hello@airfreshmarketing.com', 'Official company-domain email and quote route published on the first-party outdoor recreation page of a Denver agency serving outdoor brands in more than 200 U.S. markets.', 'https://www.airfreshmarketing.com/outdoor-recreation-brand-ambassadors'],
  'Boardwalk Sales Agency': ['rachel@boardwalksales.ca', 'Named partner and brand-development email published on the official site of an Ontario outdoor and lifestyle sales agency.', 'https://www.boardwalksales.ca/contact-us'],
  'Tandem West Sales': ['danielle@tandemwestsales.com', 'Named company-domain email published on the official site of a Western Canada outdoor, lifestyle and ski brand sales agency.', 'https://www.tandemwestsales.com/'],
  'Nicolas Rochon Agency': ['info@agencenr.com', 'Official company-domain email and contact route published on the first-party site of this Montreal sales agency, alongside its brands, sales representatives and official Instagram link.', 'https://www.agencenr.com/'],
  'Out There Social Outdoor Agency': ['inquire@outtheresocial.ca', 'Official company-domain inquiry email and contact form published on the first-party site of an outdoor-brand marketing agency serving Canada and the United States.', 'https://www.outtheresocial.ca/services'],
  'Continental Sports Inc': ['info@csisports.net', 'Official company-domain email published on the Continental Sports website, which identifies the company as a Canadian wholesale distributor serving independent retailers across camping and outdoor categories.', 'https://csisports.ca/'],
  'Outdoor Equipment Distributors': ['info@oedinc.com', 'Official company-domain email published on the Outdoor Equipment Distributors website, which identifies the company as a wholesale distributor serving independent dealers.', 'https://www.oedinc.com/'],
  'Canadawide Sports': ['info@canadawidesports.com', 'Official company-domain email published on the Canadawide Sports about page, which documents nationwide wholesale distribution, a 65,000-square-foot distribution centre, and national-chain and independent-store customers.', 'https://www.shop.canadawidesports.com/pages/about-us'],
  'JAMSCA Solutions': ['info@jamsca.com', 'Official company-domain email published on the JAMSCA retailer page for wholesale onboarding and retail partnerships across Canada.', 'https://jamsca.com/retailer-sports-goods-wholesaler-for-retailers/'],
  'Classic Products International': ['sales@classicproductsinc.com', 'Official company-domain sales email published on the Classic Products International website, which documents Canadian sporting-goods distribution and major, mid-tier and specialty retail relationships.', 'https://classicproductsinc.com/'],
  'ROI Recreation Outfitters': ['info@roirecreation.com', 'Official company-domain email published on the ROI Recreation website, which identifies ROI as a North American outdoor-lifestyle distributor seeking premium brand and dealer partners.', 'https://roirecreation.com/about-us'],
  'Hicks Inc': ['info@hicks.com', 'Official company-domain email published on the Hicks website, which identifies Hicks as a national outdoor-products wholesale distributor serving U.S. retail stores.', 'https://www.hicksinc.com/'],
  'ICO Distributors': ['support@bridensolutions.ca', 'Official support email published on the ICO Distributors website, which identifies ICO as a Canadian wholesale distributor selling outdoor brands only to Canadian retailers.', 'https://www.icodistributors.ca/'],
  'Blue Ridge Knives': ['onestop@brk.com', 'Official business email published on the Blue Ridge Knives wholesale camping-tools page beside its dealer onboarding route.', 'https://www.blueridgeknives.com/wholesale-camping-tools/'],
  'Round The Wheel Collective': ['patrick@roundthewheelcollective.com', 'Official company-domain email published on the Round The Wheel Collective homepage for outdoor-brand representation in the Northeast United States.', 'https://www.roundthewheelcollective.com/'],
  'Can-Am Sales Group': ['info@canamsalesgroup.com', 'Official company-domain email published on the Can-Am Sales Group homepage beside its North American outdoor vendor-partner program.', 'https://canamsalesgroup.com/'],
  'OUTTECH': ['sales@outtech-online.com', 'Official company-domain sales email published on the OUTTECH homepage, which documents national outdoor-market coverage, distributor and major-retail channels, and a large specialist sales-services team.', 'https://www.outtech-online.com/'],
  'Rep First': ['orders@repfirst.com', 'Official general company-domain orders email published on the Rep First about page beside its adventure-sports manufacturer-representation profile.', 'https://www.repfirst.com/about-us'],
  'Venture Out, Inc.': ['connect@ventureoutinc.com', 'Official general company-domain contact email published on the Venture Out website.', 'https://ventureoutinc.com/'],
  'KNS Reps': ['service@knsreps.com', 'Official general company-domain service email published on the KNS Reps contact page for this outdoor and ski manufacturer-representative agency.', 'https://www.knsreps.com/contact.asp'],
  'West Bay Trading Company': ['office@westbay.co', 'Official general company-domain office email published for West Bay Trading Company, whose first-party site documents more than 40 years representing outdoor recreation brands.', 'https://www.westbaytradingcompany.com/'],
  'North Branch Traders': ['info@northbranchtraders.com', 'Official general company-domain email published on the North Branch Traders about page beside its Mid-Atlantic sales and account-management services.', 'https://www.northbranchtraders.com/about-us'],
  'Black Dog Sales Group': ['info@blackdogsalesgroup.com', 'Official general company-domain email published on the Black Dog Sales Group homepage beside its outdoor brand-building and retailer-growth services.', 'https://www.blackdogsalesgroup.com/'],
  'Outlaw Mountain Sports': ['info@outlawmtn.com', 'Official company-domain email published on the Outlaw Mountain Sports homepage, which identifies the company as a U.S. sales agency representing emerging outdoor brands to specialty retailers.', 'https://www.outlawmtn.com/'],
  'Housed & Harnessed': ['letschat@housedandharnessed.uk', 'Official company-domain email published on the Housed & Harnessed contact page; the same first-party site identifies the company as a UK outdoor, active and lifestyle brand partner.', 'https://housedandharnessed.uk/contact'],
  'Action Sports Distribution': ['info@actionsportsdist.co.uk', 'Official company-domain email published on the Action Sports Distribution contact section; the same first-party site documents 25+ years distributing outdoor and action-sports brands into UK retail.', 'https://www.actionsportsdist.co.uk/'],
  'Maxtrack Distribution': ['info@maxtrack.com', 'Official company-domain email published on the Maxtrack homepage; the same first-party site identifies a UK B2B adventure-sports distributor and links its exact official Instagram profile.', 'https://maxtrack.com/'],
  'Watersports Solution': ['sales@watersportssolution.co.uk', 'Official company-domain sales email published on the Watersports Solution homepage, which identifies the company as a UK distributor of watersports and outdoor equipment brands.', 'https://www.watersportssolution.co.uk/'],
  'PSS Agency': ['info@pssagency.com', 'Official company-domain email published on the PSS Agency homepage, which identifies a Western U.S. outdoor sales and marketing agency seeking brands to represent.', 'https://pssagency.com/'],
  'Sports, Inc.': ['info@hq.sportsinc.com', 'Official headquarters email published on the Sports, Inc. prospective-suppliers page beside its supplier consideration route and network of more than 1,000 outdoor and athletic brands.', 'https://www.sportsinc.us/prospective-suppliers'],
  'Stellar Sales Alliance': ['Fernando@stellarsalesalliance.com', 'Named managing-partner company-domain email published on the official site of a U.S. manufacturers representative agency serving outdoor-living dealers and distributors.', 'https://stellarsalesalliance.com/'],
  'Sport Dimension': ['info@sportdimension.com', 'Official company-domain email published on the Sport Dimension about page, which documents 30+ outdoor and watersports brands and distribution into specialty and large sporting-goods retailers.', 'https://www.sportdimension.com/about-us'],
  'Alexander & Townsend': ['contacts@alexander-townsend.com', 'Official company-domain email published on the Alexander & Townsend contact page, which invites product-representation inquiries for its outdoor sporting-goods agency.', 'https://www.alexander-townsend.com/contact-us'],
  'Mountain States Sales': ['Don@MountainStatesSales.com', 'Named company-domain email published on the Mountain States Sales homepage for its U.S. sporting-goods manufacturers representative office.', 'https://www.mountainstatessales.com/'],
  'MWS Associates': ['contact@mws-associates.com', 'Official company-domain email published on the MWS Associates homepage, which identifies a veteran U.S. outdoor-industry manufacturers representative team covering hiking, camping, hunting and fishing.', 'https://mws-associates.com/'],
  'Phil Hunt Agencies': ['phil@philhuntagencies.co.uk', 'Official company-domain email encoded and published on the first-party Phil Hunt Agencies homepage, which identifies the business as a UK surf, sports, outdoor and leisurewear sales agency.', 'https://www.philhuntagencies.co.uk/'],
  'The Outdoor Agency Ireland': ['stephen@theoutdooragencyireland.com', 'Official company-domain email published on the first-party agency homepage, which identifies an outdoor-brand sales agency serving Northern Ireland and links its exact official Instagram profile.', 'https://theoutdooragencyireland.com/'],
  'The Foundry': ['info@thisisthefoundry.com', 'Official company-domain email published on the first-party outdoor-sector page, which documents UK market-entry, retail and trade work for outdoor brands and links the exact LinkedIn organization profile.', 'https://www.thisisthefoundry.com/sector/outdoors'],
  'Stoner Andrews': ['office@stonerandrews.com', 'Official general company-domain office email published on the Stoner Andrews history page beside its outdoor-industry sales-agency record.', 'https://www.stonerandrews.com/history-ethos'],
  'Tentworld': ['contact@tentworld.com.au', 'Official public company-domain email published by Tentworld; route the supplier proposal to the category buyer or vendor-review owner.', 'https://www.tentworld.com.au/contact-us'],
  'Wildfire Sports': ['enquiries@wildfiresports.com.au', 'Official public business email on the Wildfire Sports contact page; route to category buyer or vendor-review owner.', 'https://www.wildfiresports.com.au/contact-us'],
  'Bivouac Outdoor': ['web@bivouac.co.nz', 'Official public business email on the Bivouac Outdoor contact page; route to category buyer or vendor-review owner.'],
  'Further Faster': ['hello@furtherfaster.co.nz', 'Official public business email on the Further Faster website; the company also publicly states that it distributes outdoor brands in New Zealand.'],
  'Scandinavian Outdoor': ['info@scandinavianoutdoor.com', 'Official public company-domain email on the Scandinavian Outdoor customer-service page; route the supplier proposal to the category buyer or vendor-review owner.', 'https://scandinavianoutdoor.com/page/customer-service/'],
  'Varuste': ['info@varuste.net', 'Official public company-domain email published by Varuste; route the supplier proposal to the category buyer or vendor-review owner.', 'https://varuste.net/'],
  'Fjellsport': ['kundeservice@fjellsport.no', 'Official public company-domain contact published in the Fjellsport privacy and contact information; route the supplier proposal to the category buyer or vendor-review owner.', 'https://www.fjellsport.no/faq/personvern'],
  'Outnorth': ['info@outnorth.com', 'Official public company-domain email on the Outnorth contact page; route the supplier proposal to the category buyer or vendor-review owner.', 'https://www.outnorth.com/int/faq/contact'],
  'Bentgate Mountaineering': ['bentgate@bentgate.com', 'Official company-domain customer-support address exposed by the Bentgate contact page; route the proposal to the category buyer or owner.', 'https://www.bentgate.com/service/'],
  'Valhalla Pure Outfitters': ['vancouver@vpo.ca', 'Official VPO Vancouver store address published beside the named store owner; request routing to the central category buyer.', 'https://vpo.ca/stores/vpo-vancouver'],
  'La Cordee': ['info@lacordee.com', 'Official company-domain address published by La Cordee on its contact page; route the supplier proposal to the category buyer.', 'https://www.lacordee.com/en/pages/contact-us'],
  'AvidMax Outfitters': ['customerservice@avidmax.com', 'Official company-domain address published on the AvidMax headquarters contact page; route the supplier proposal to the category buyer.', 'https://www.avidmax.com/contact-us/'],
  'Neptune Mountaineering': ['info@neptunemountaineering.com', 'Official company-domain address published on the Neptune customer-support page; route the supplier proposal to the category buyer.', 'https://www.neptunemountaineering.com/pages/customer-support'],
  "Bill & Paul’s Sporthaus": ['customerservice@billandpauls.com', 'Official company-domain customer-service address published on the Bill & Paul’s Sporthaus hours and location page; route the supplier proposal to the category buyer or owner.', 'https://billandpauls.com/pages/hours-and-location'],
  'Kenco Outfitters': ['Support@kencooutfitters.com', 'Official company-domain support address published on the Kenco Outfitters rewards page; route the supplier proposal to the category buyer or owner.', 'https://kencooutfitters.com/pages/rewards'],
  'Great Outdoor Provision Co.': ['shop@greatoutdoorprovision.com', 'Official company-domain shop address published on the Great Outdoor Provision Co. FAQ and policies page; route the supplier proposal to the category buyer.', 'https://www.greatoutdoorprovision.com/pages/faqs-policies'],
  'Alpine Shop': ['customercare@alpineshop.com', 'Official company-domain customer-care address published in a first-party Alpine Shop customer document; route the supplier proposal to the category buyer.', 'https://dev.alpineshop.com/images/contrail/File/packslip_page1.pdf'],
  "Jesse Brown's Outdoors": ['jesse@jessebrowns.com', "Official company-domain address published on the Jesse Brown's Outdoors contact page; route the supplier proposal to the category buyer or owner.", 'https://shop.jessebrowns.com/pages/contact'],
  'Travel Country Outfitters': ['info@TravelCountry.com', 'Official company-domain address published on the Travel Country Outfitters contact page; route the supplier proposal to the category buyer or owner.', 'https://www.travelcountry.com/shop/Action/Info_Show/Id/42'],
  'The Benchmark Outdoor Outfitters': ['info@benchmarkoutfitter.com', 'Official company-domain general address published on the Benchmark customer-support page beside its business-inquiry route; route the proposal to the category buyer or owner.', 'https://www.benchmarkoutfitter.com/service/'],
  'Appalachian Outfitters': ['cs@appalachianoutfitters.com', 'Official company-domain customer-service address published on the Appalachian Outfitters contact-information page; route the proposal to the category buyer or owner.', 'https://www.appalachianoutfitters.com/policies/contact-information'],
  'Roads Rivers and Trails': ['rrt@roadsriversandtrails.com', 'Official company-domain address published on the Roads Rivers and Trails trip-planning page; route the proposal to the category buyer or owner.', 'https://roadsriversandtrails.com/trip-planning/'],
  "Bill Jackson's Shop for Adventure": ['camping@billjacksons.com', "Official company-domain camping-department address published by Bill Jackson's Shop for Adventure; route the proposal to the camping category buyer.", 'https://www.billjacksons.com/class/thru-hike-clinic-2025/'],
  'Pack and Paddle': ['info@packpaddle.com', 'Official company-domain store address published on the Pack and Paddle contact page; route the proposal to the camping or outdoor-accessories buyer.', 'https://packpaddle.com/contact-us/'],
  'Outdoor World Direct': ['info@outdoorworlddirect.co.uk', 'Official company-domain address published on the Outdoor World Direct contact and camping-support pages; route the proposal to the camping category buyer.', 'https://www.outdoorworlddirect.co.uk/contact'],
  'Survive & Thrive': ['info@survive-thrive.com', 'Official company-domain address published on the Survive & Thrive company website; route the proposal to the owner or outdoor-equipment buyer.', 'https://www.survive-thrive.com/'],
  'Exploration Wild': ['info@explorationwild.com', 'Official company-domain address published on the Exploration Wild about page; route the proposal to the camping category buyer.', 'https://explorationwild.com/pages/about-us'],
  'Lost Wave': ['info@lost-wave.com', 'Official company-domain address published on the Lost Wave about and contact page; route the proposal to the owner or outdoor buyer.', 'https://www.lost-wave.com/about'],
  'Camping Travel Store': ['info@campingtravelstore.co.uk', 'Official company-domain address published on the Camping Travel Store contact page; route the proposal to the camping buyer or owner.', 'https://www.campingtravelstore.co.uk/contact-us'],
  'Newquay Camping & Leisure': ['info@newquaycampingshop.co.uk', 'Official company-domain address published on the Newquay Camping & Leisure contact page; route the proposal to the camping buyer or owner.', 'https://newquaycampingshop.com/pages/contact-us'],
  'Old School Outdoor': ['info@oldschooloutdoor.com', 'Official company-domain address published on the Old School Outdoor contact page; route the proposal to the owner or outdoor buyer.', 'https://oldschooloutdoor.com/pages/contact'],
  'Kermode Overland': ['info@kermodeoverland.com', 'Official company-domain address published on the Kermode Overland contact page; route the proposal to the overlanding-accessories buyer or owner.', 'https://kermodeoverland.com/contact-us/'],
  'Outcamping': ['info@outcamping.co.uk', 'Official company-domain address published on the Outcamping about page; route the proposal to the camping buyer or owner.', 'https://outcamping.co.uk/pages/about-us'],
  'Equipment Outdoors': ['info@equipmentoutdoors.co.uk', 'Official company-domain address published on the Equipment Outdoors website; route the proposal to the camping or outdoor-equipment buyer.', 'https://www.equipmentoutdoors.co.uk/'],
  'Action Outdoors': ['info@actionoutdoors.co.uk', 'Official company-domain address published on the Action Outdoors about page; route the proposal to the owner or outdoor-equipment buyer.', 'https://www.actionoutdoors.co.uk/about/'],
  'Outdoors Plus': ['info@outdoorsplus.ca', 'Official company-domain address published on the Outdoors Plus camping page; route the proposal to the camping buyer or owner.', 'https://outdoorsplus.ca/services/camping/'],
  'Canada Outdoors': ['info@canadaoutdoors.com', 'Official company-domain address published on the Canada Outdoors customer-service page; route the proposal to the camping buyer.', 'https://www.canadaoutdoors.com/pages/customer-service'],
  'Backcountry Sportsman': ['info@backcountrysportsman.com', 'Official company-domain address published prominently on the Backcountry Sportsman official homepage; route the proposal to the camping or paddlesports buyer.', 'https://backcountrysportsmanoutfitters.com/'],
  'Purely Outdoors': ['info@purelyoutdoors.co.uk', 'Official company-domain address published on the Purely Outdoors showroom page; route the proposal to the camping buyer or owner.', 'https://www.purelyoutdoors.co.uk/showroom.htm'],
  'Grasshopper Leisure': ['info@grasshopperleisure.co.uk', 'Official company-domain address published on the Grasshopper Leisure homepage; route the proposal to the camping buyer or owner.', 'https://www.grasshopperleisure.co.uk/'],
  'The Outdoor Shop Lewes': ['info@outdoorshoplewes.co.uk', 'Official company-domain address published on The Outdoor Shop Lewes homepage; route the proposal to the outdoor-equipment buyer or owner.', 'https://www.outdoorshoplewes.co.uk/'],
  'Westside Stores': ['info@westsidestores.ca', 'Official company-domain address published on the Westside Stores about page; route the proposal to the camping buyer or owner.', 'https://westsidestores.ca/pages/about-us.html'],
  'Switching Gear': ['info@switchinggear.ca', 'Official company-domain address published on the Switching Gear about page; route the proposal to the outdoor buyer or owner.', 'https://www.switchinggear.ca/About.html'],
  "Mawson's Sports": ['info@mawsons.ca', "Official company-domain address published on the Mawson's Sports homepage; route the proposal to the outdoor buyer or owner.", 'https://mawsons.ca/'],
  'Spry': ['info@spryactive.ca', 'Official company-domain address published on the Spry about page; route the proposal to the active-outdoor buyer or owner.', 'https://spryactive.ca/pages/about'],
  'Pack Gear Go': ['sales@packgeargo.co.nz', 'Official company-domain address published on the Pack Gear Go contact page; route the proposal to the ultralight outdoor buyer or owner.', 'https://www.packgeargo.co.nz/contact/'],
  'Gearshop': ['sales@gearshop.co.nz', 'Official company-domain address published on the Gearshop contact page; route the proposal to the outdoor buyer or owner.', 'https://www.gearshop.co.nz/pages/contact'],
  'Lifestyle Gear': ['info@lifestylegear.co.nz', 'Official company-domain address published on the Lifestyle Gear contact page; route the proposal to the outdoor buyer or owner.', 'https://lifestylegear.co.nz/pages/contact'],
  'Tight Lines': ['service@tightlines.co.nz', 'Official company-domain general address published on the Tight Lines about page beside its outdoor distribution profile; route the proposal to the category buyer.', 'https://tightlines.co.nz/pages/about-us'],
  'Outdoor Shop NZ': ['info@outdoorshop.nz', 'Official company-domain address published on the Outdoor Shop NZ contact page; route the proposal to the outdoor buyer or owner.', 'https://outdoorshop.nz/pages/contact-us'],
  'Dwights Outdoors': ['online@dwights.co.nz', 'Official company-domain online-sales address published on the Dwights Outdoors contact page; route the proposal to the camping buyer.', 'https://dwights.co.nz/pages/contact-us'],
  'Outdoor eStore': ['service@outdoorestore.co.nz', 'Official company-domain address published on the Outdoor eStore contact page; route the proposal to the outdoor buyer or owner.', 'https://www.outdoorestore.co.nz/pages/contact-us'],
  'Camping Country Superstore': ['sales@campingcountry.com.au', 'Official company-domain address published on the Camping Country about page for its independent camping superstore; route the proposal to the camping buyer.', 'https://campingcountry.com.au/about-us/'],
  'West End Outdoors': ['support@westendoutdoors.co.uk', 'Official company-domain address published on the West End Outdoors contact-information page; route the proposal to the outdoor buyer or owner.', 'https://www.westendoutdoors.co.uk/policies/contact-information'],
  'Vamos Outdoors': ['info@vamosoutdoors.ca', 'Official company-domain address published on the Vamos Outdoors homepage; route the proposal to the outdoor and travel buyer or owner.', 'https://vamosoutdoors.ca/'],
  'WeyFarm Outdoors': ['info@weyfarm-outdoors.co.uk', 'Official company-domain address published on the WeyFarm Outdoors homepage; route the proposal to the camping buyer or owner.', 'https://weyfarm-outdoors.co.uk/'],
  'Great Western Camping': ['sales@greatwesterncamping.co.uk', 'Official company-domain address published on the Great Western Camping contact page; route the proposal to the outdoor buyer or owner.', 'https://www.greatwesterncamping.co.uk/contact'],
  'Camping World UK': ['sales@campingworld.co.uk', 'Official company-domain sales address published on the Camping World UK contact page; route the proposal to the camping category buyer.', 'https://www.campingworld.co.uk/us/Visit-and-Contact-Us/cc-339.aspx'],
  'Outdoors Ramsey': ['sales@outdoorsramsey.co.uk', 'Official company-domain sales address published on the Outdoors Ramsey first-party shop page; delivery failure evidence permanently suppresses this exact recipient and company.', 'https://www.outdoorsramsey.co.uk/outdoor-shop-in-ramsey-isle-of-man/'],
  'Castleberg Outdoors': ['enquiries@castlebergoutdoors.co.uk', 'Official company-domain enquiries address published on the Castleberg Outdoors first-party about page; route the proposal to the outdoor buyer.', 'https://www.castlebergoutdoors.co.uk/about-castleberg-outdoors'],
  'WM Camping': ['customerservices@wmcamping.co.uk', 'Official company-domain customer-services address published on the WM Camping first-party contact page; route the proposal to the camping buyer.', 'https://wmcamping.co.uk/pages/contact-us'],
  "MD Outdoors": ["info@mdoutdoors.co.nz", "Official first-party New Zealand company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://www.mdoutdoors.co.nz/pages/contact-us"],
  "Mc's Outdoor Store": ["info@mcsoutdoorstore.ie", "Official first-party Ireland company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://www.mcsoutdoorstore.ie/contact-us/"],
  "Sportsden": ["info@sportsden.ie", "Official first-party Ireland company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://www.sportsden.ie/pages/contact-us"],
  "MacEoin General Merchants": ["info@maceoinltd.com", "Official first-party Ireland company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://www.maceoinltd.com/"],
  "Outdoor Adventure Store": ["online@oas.ie", "Official first-party Ireland company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://outdooradventurestore.ie/pages/about-us"],
  "S.K Camping & Leisure": ["info@skcamping.com", "Official first-party United Kingdom company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://www.skcamping.com/"],
  "Black & White Outdoors": ["sales@blackandwhiteoutdoors.com", "Official first-party United States company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://blackandwhiteoutdoors.com/contact-us/"],
  "NZ Outdoors": ["info@nz-outdoors.co.nz", "Official first-party New Zealand company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://www.nz-outdoors.co.nz/pages/support"],
  "Craze Outdoors": ["support@crazeoutdoors.com", "Official first-party Canada company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://crazeoutdoors.com/pages/contact-us"],
  "Charles Camping": ["info@charlescamping.ie", "Official first-party Ireland company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://www.charlescamping.ie/contact-us"],
  "Portwest The Outdoor Shop": ["sales@theoutdoorshop.ie", "Official first-party Ireland company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://www.theoutdoorshop.ie/pages/contact-us"],
  "Basecamp Dublin": ["info@basecamp.ie", "Official first-party Ireland company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://basecamp.ie/pages/privacy-policy"],
  "JSJ Camping & Garden": ["info@jsj-bv.com", "Official first-party Netherlands company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://jsj-bv.com/"],
  "Veneboer Camping & Outdoor": ["info@veneboercamping.nl", "Official first-party Netherlands company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://www.veneboercamping.nl/contact"],
  "GetCamping": ["info@getcamping.se", "Official first-party Sweden company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://www.getcamping.eu/en/info/about-us/"],
  "Outdoordump": ["info@outdoordump.nl", "Official first-party Netherlands company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://outdoordump.nl/contact/"],
  "OutdoorHaven": ["info@outdoorhaven.nl", "Official first-party Netherlands company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://outdoorhaven.nl/"],
  "Huna Outdoor": ["info@hunaoutdoor.nl", "Official first-party Netherlands company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://hunaoutdoor.nl/"],
  "Expedition Store Sweden": ["info@expeditionstore.se", "Official first-party Sweden company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://expeditionstore.se/pages/contact-us"],
  "Van Os Imports": ["info@vanosimports.nl", "Official first-party Netherlands company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://www.vanosimports.com/en/grid/outdoor"],
  "De Campingwinkel": ["info@decampingwinkel.be", "Official first-party Belgium company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://decampingwinkel.be/contact/"],
  "Camps Store Diest": ["info@campsstore.be", "Official first-party Belgium company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://www.campsstore.be/contact"],
  "Klima Outdoor": ["schwarte@drshop24.de", "Official first-party Germany company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://klima-outdoor.de/pages/contact"],
  "CanvasCamp": ["info@canvascamp.com", "Official first-party Belgium company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://www.canvascamp.com/en/contact-us"],
  "High Peak Outdoor": ["service@simexoutdoor.com", "Official first-party Germany company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://www.highpeak-outdoor.com/kontakt.html"],
  "Der Freistaat Mega Store": ["webshop@derfreistaat.de", "Official first-party Germany company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://shop.derfreistaat.de/de/kontakt/"],
  "Van Dijk Outdoor & Recreatie": ["webshop@autodaktenten.be", "Official first-party Belgium company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://autodaktenten-webshop.be/pages/contact"],
  "MK Outdoor": ["service@mkoutdoor.de", "Official first-party Germany company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://www.mkoutdoor.de/Impressum/"],
  "Kampersport": ["info@kampersport.com", "Official first-party Belgium company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://kampersport.com/nous-contacter/"],
  "Shopping4Camping": ["info@shopping4.be", "Official first-party Belgium company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://www.shopping4camping.be/pages/contact-bereikbaarheid"],
  "De Kampeerder": ["info@dekampeerder.be", "Official first-party Belgium company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://dekampeerder.be/"],
  "Campingudstyr.dk": ["info@campingudstyr.dk", "Official first-party Denmark company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://www.campingudstyr.dk/contact"],
  "Naturligvis Outdoor": ["mail@naturligvis.com", "Official first-party Denmark company contact published for this camping/outdoor retailer or distributor; route the proposal to the category buyer or vendor-review owner.", "https://www.naturligvis.com/side/kontakt"],
  'Kittery Trading Post': ['info@ktp.com', 'Official company-domain address published in the Kittery Trading Post contact section; route the supplier proposal to the category buyer.', 'https://www.kitterytradingpost.com/customer-service/cookie-policy/'],
  'Spejder Sport': ['kundeservice@spejdersport.dk', 'Official company-domain address published with Spejder Sport company ownership and headquarters details; route to the category buyer.', 'https://www.spejdersport.dk/handelsbetingelser/'],
  'Hardloop': ['hello@hardloop.fr', 'Official company-domain contact address published by Hardloop; route the supplier proposal to the category buyer.', 'https://www.hardloop.fr/article/671-acupression-tout-savoir'],
  'Trekitt': ['support@trekitt.co.uk', 'Official company-domain support address published on Trekitt contact and FAQ pages; route the supplier proposal to the category buyer.', 'https://www.trekitt.co.uk/pages/contact/'],
  'Barrabes': ['customerservice@barrabes.com', 'Official company-domain customer-service address published by Barrabes; route the supplier proposal to the category buyer.', 'https://www.barrabes.com/en/help/contact'],
  'Snowleader': ['contact@snowleader.com', 'Official company-domain contact address published in Snowleader first-party customer documents; route the supplier proposal to the category buyer.', 'https://images.snowleader.com/media/wysiwyg/Global-Blue-fr.pdf'],
  'SportPursuit': ['team@sportpursuit.com', 'Official company-domain address published in SportPursuit terms and contact pages; route the supplier proposal to the category buyer or brand-partnership owner.', 'https://www.sportpursuit.com/terms-conditions'],
  'Tahoe Sports Hub': ['tahoesportshub@gmail.com', 'Exact public business address published on the official Tahoe Sports Hub contact page; route the proposal to the retail buyer or owner.', 'https://www.tahoesportshub.com/contact'],
  'J&H Outdoors': ['web@jhoutdoors.com', 'Official company-domain address published in the J&H Outdoors FAQ; route the proposal to the category buyer or owner.', 'https://jhoutdoors.com/pages/faq'],
  'The Trail Head': ['info@trailheadmontana.net', 'Official company-domain address published on The Trail Head website; route the proposal to the category buyer or owner.', 'https://trailheadmontana.net/'],
  "Hilton's Tent City": ['support@hiltonstentcity.com', "Official company-domain address published by Hilton's Tent City; route the proposal to the named buyer or current vendor-review owner.", 'https://www.hiltonstentcity.com/pages/returns-exchanges'],
};

const LARGE_AGENCY_AND_DISTRIBUTOR_NAMES = new Set([
  'OUTTECH', 'Waypoint Outdoor', 'OnwardUP', 'Sportco Marketing', 'CWR Wholesale Distribution',
  'ROI Recreation Outfitters', 'Young & MacKenzie Distribution', 'Can-Am Sales Group',
  'Covey Sales & Marketing', 'Continental Sports Inc', 'Terra Outdoor Gear Distribution',
  'Hendrix Outdoors', 'Coonhound Sales & Marketing', 'Vigos Group', 'Howe Sound Sales',
  'Sturm Mil-Tec USA', 'Canadawide Sports', 'Hicks Inc', 'ICO Distributors',
  'Parallel 33 Sales Group', 'Escala Sales & Marketing', 'Tandem West Sales', 'C&G Distribution',
  'Northern Exposure Sporting Group', 'NordCore Group', 'Tin Shack Ltd', '1889 Sales',
  'Garibaldi Supply Co.', 'The Bunker Agency', 'Henry Sports Group', '360 Adventure Collective',
  'Interex Industries', 'Zia Works Distribution', 'Urban Outdoor Sales', 'Outdoor Market Alliance',
  'Yates Outdoor Sales', 'Round The Wheel Collective', 'Outdoor Gear Canada', 'GMD Wholesale',
  'D.M.A. Distributing', 'Caraway & Co.', 'Premium Living Products',
  'Outdoor Equipment Distributors', 'Classic Products International', 'REVASSA', 'JAMSCA Solutions',
]);

for (const candidate of DIRECTORY_REFILL_CANDIDATES) {
  if (LARGE_AGENCY_AND_DISTRIBUTOR_NAMES.has(candidate.company)) {
    candidate.customerType = 'sales_agency';
    candidate.segment = 'verified North American outdoor sales agency or wholesale distributor';
    candidate.background = `${candidate.company} is a first-party verified North American outdoor sales agency or wholesale distributor with retailer access relevant to FLEXTAIL's compact outdoor assortment.`;
    candidate.buyerPersona = 'Agency principal, distributor owner, manufacturer partnerships director, or vendor onboarding lead.';
  }
  const enrichment = DIRECTORY_PUBLIC_CONTACT_ENRICHMENT[candidate.company];
  if (enrichment) {
    candidate.publicEmail = enrichment[0];
    candidate.contactEmail = enrichment[0];
    candidate.publicEmailStatus = enrichment[1];
    candidate.emailVerificationStatus = 'official_public_business_email';
    candidate.emailEvidence = candidate.company === 'Further Faster'
      ? 'official_homepage_and_where_to_buy_distribution_page'
      : 'official_contact_page';
    candidate.emailEvidenceUrl = enrichment[2] || candidate.url;
    candidate.contactUrl = enrichment[2] || candidate.contactUrl;
  }
  if (candidate.company === 'Pro Line Sports') {
    candidate.facebookUrl = 'https://www.facebook.com/pages/Pro-Line-Sports-Ltd/122852307734042';
    candidate.linkedinUrl = 'https://www.linkedin.com/company/pro-line-sports-ltd/';
  }
  if (candidate.company === 'Base Camp Agency') {
    candidate.linkedinUrl = 'https://www.linkedin.com/company/base-camp-agency';
  }
}

CANDIDATES.push(...DIRECTORY_REFILL_CANDIDATES);
CANDIDATES.push(...loadVerifiedExternalCandidates());

const SOCIAL_REFILL_SOURCE = 'verified outdoor retailer official website and public social profile refill';
const SOCIAL_REFILL_CANDIDATES = [
  ['Public Lands', 'United States', 'https://www.publiclands.com/', 'https://www.instagram.com/publiclands/', 'https://www.facebook.com/publiclands', 92],
  ['Moosejaw', 'United States', 'https://www.moosejaw.com/', 'https://www.instagram.com/moosejawmadness/', 'https://www.facebook.com/Moosejaw', 91],
  ['Eastern Mountain Sports', 'United States', 'https://www.ems.com/', 'https://www.instagram.com/easternmntnsports/', 'https://www.facebook.com/EasternMountainSports', 90],
  ['Campman', 'United States', 'https://www.campman.com/', 'https://www.instagram.com/campman/', 'https://www.facebook.com/campman', 88],
  ['Pack Rat Outdoor Center', 'United States', 'https://www.packratoc.com/', 'https://www.instagram.com/packratoc/', 'https://www.facebook.com/packratoc', 87],
  ['The Mountaineer', 'United States', 'https://mountaineer.com/', 'https://www.instagram.com/themountaineerkeenevalley/', 'https://www.facebook.com/themountaineerkeenevalley', 87],
  ['Sierra', 'United States', 'https://www.sierra.com/', 'https://www.instagram.com/sierraofficial/', 'https://www.facebook.com/Sierra', 88],
  ['Outdoorplay', 'United States', 'https://www.outdoorplay.com/', 'https://www.instagram.com/outdoorplay/', 'https://www.facebook.com/outdoorplay', 86],
  ['Campmor', 'United States', 'https://www.campmor.com/', 'https://www.instagram.com/campmor/', 'https://www.facebook.com/Campmor', 88],
  ['Ramsey Outdoor', 'United States', 'https://www.ramseyoutdoor.com/', 'https://www.instagram.com/ramseyoutdoor/', 'https://www.facebook.com/RamseyOutdoor', 86],
  ['Massey Outfitters', 'United States', 'https://www.masseysoutfitters.com/', 'https://www.instagram.com/masseysoutfitters/', 'https://www.facebook.com/MasseysOutfitters', 86],
  ['Quest Outdoors', 'United States', 'https://questoutdoors.com/', 'https://www.instagram.com/questoutdoors/', 'https://www.facebook.com/QuestOutdoors', 86],
  ['River Sports Outfitters', 'United States', 'https://www.riversportsoutfitters.com/', 'https://www.instagram.com/riversportsoutfitters/', 'https://www.facebook.com/riversportsoutfitters', 86],
  ['Rock/Creek', 'United States', 'https://www.rockcreek.com/', 'https://www.instagram.com/rockcreek/', 'https://www.facebook.com/rockcreek', 87],
  ['Half-Moon Outfitters', 'United States', 'https://www.halfmoonoutfitters.com/', 'https://www.instagram.com/halfmoonoutfitters/', 'https://www.facebook.com/HalfMoonOutfitters', 86],
  ['Sunlight Sports', 'United States', 'https://sunlightsports.com/', 'https://www.instagram.com/sunlightsports/', 'https://www.facebook.com/sunlightsports', 86],
  ['Jax Outdoor Gear', 'United States', 'https://www.jaxgoods.com/', 'https://www.instagram.com/jaxoutdoor/', 'https://www.facebook.com/jaxoutdoorgear', 86],
  ['Christy Sports', 'United States', 'https://www.christysports.com/', 'https://www.instagram.com/christysports/', 'https://www.facebook.com/christysports', 87],
  ['Paragon Sports', 'United States', 'https://www.paragonsports.com/', 'https://www.instagram.com/paragonsports/', 'https://www.facebook.com/ParagonSports', 87],
  ['Mountain Equipment', 'United Kingdom', 'https://www.mountain-equipment.co.uk/', 'https://www.instagram.com/mountain_equipment/', 'https://www.facebook.com/MountainEquipment', 88],
  ['Tiso', 'United Kingdom', 'https://www.tiso.com/', 'https://www.instagram.com/tiso.outdoor/', 'https://www.facebook.com/TisoOutdoor', 87],
  ['George Fisher', 'United Kingdom', 'https://www.georgefisher.co.uk/', 'https://www.instagram.com/georgefisheruk/', 'https://www.facebook.com/georgefisheruk', 86],
  ['LD Mountain Centre', 'United Kingdom', 'https://www.ldmountaincentre.com/', 'https://www.instagram.com/ld_mountain_centre/', 'https://www.facebook.com/LDMountainCentre', 86],
  ['Absolute-Snow', 'United Kingdom', 'https://www.absolute-snow.co.uk/', 'https://www.instagram.com/absolutesnow/', 'https://www.facebook.com/AbsoluteSnow', 86],
  ['Ellis Brigham', 'United Kingdom', 'https://www.ellis-brigham.com/', 'https://www.instagram.com/ellisbrigham/', 'https://www.facebook.com/ellisbrigham', 89],
  ['Facewest', 'United Kingdom', 'https://www.facewest.co.uk/', 'https://www.instagram.com/facewest/', 'https://www.facebook.com/Facewest', 85],
  ['Above and Beyond', 'Ireland', 'https://www.aboveandbeyond.ie/', 'https://www.instagram.com/aboveandbeyondireland/', 'https://www.facebook.com/aboveandbeyondireland', 85],
  ['72hours', 'Canada', 'https://72hours.ca/', 'https://www.instagram.com/72hours.ca/', 'https://www.facebook.com/72hours.ca', 86],
  ['Atmosphere', 'Canada', 'https://www.atmosphere.ca/', 'https://www.instagram.com/atmosphereoutdoor/', 'https://www.facebook.com/Atmosphere', 88],
  ['Sail Outdoors', 'Canada', 'https://www.sail.ca/', '', 'https://www.facebook.com/SAILoutdoors', 89],
  ['Altitude Sports', 'Canada', 'https://www.altitude-sports.com/', 'https://www.instagram.com/altitudesports/', 'https://www.facebook.com/AltitudeSports', 89],
  ['The Last Hunt', 'Canada', 'https://www.thelasthunt.com/', 'https://www.instagram.com/thelasthunt/', 'https://www.facebook.com/thelasthunt', 86],
  ['Marmot Basin Retail', 'Canada', 'https://www.marmotbasin.com/', 'https://www.instagram.com/marmotbasin/', 'https://www.facebook.com/marmotbasin', 85],
  ['Wild Earth', 'Australia', 'https://www.wildearth.com.au/', 'https://www.instagram.com/wildearthaustralia/', 'https://www.facebook.com/wildearth', 89],
  ['Tentworld Australia', 'Australia', 'https://www.tentworld.com.au/', 'https://www.instagram.com/tentworldaustralia/', 'https://www.facebook.com/Tentworld', 89],
  ['Paddy Pallin', 'Australia', 'https://www.paddypallin.com.au/', 'https://www.instagram.com/paddypallin/', 'https://www.facebook.com/PaddyPallin', 88],
  ['Macpac', 'Australia', 'https://www.macpac.com.au/', 'https://www.instagram.com/macpac/', 'https://www.facebook.com/macpac', 89],
  ['Tentworld NZ', 'New Zealand', 'https://www.tentworld.co.nz/', 'https://www.instagram.com/tentworldnz/', 'https://www.facebook.com/tentworldnz', 86],
  ['Torpedo7', 'New Zealand', 'https://www.torpedo7.co.nz/', 'https://www.instagram.com/torpedo7/', 'https://www.facebook.com/Torpedo7', 87],
  ['Outdoor Action', 'New Zealand', 'https://www.outdooraction.co.nz/', 'https://www.instagram.com/outdooractionnz/', 'https://www.facebook.com/outdooractionnz', 86],
  ['Campz', 'Germany', 'https://www.campz.de/', 'https://www.instagram.com/campz.de/', 'https://www.facebook.com/campz.de', 86],
  ['Sport Conrad', 'Germany', 'https://www.sport-conrad.com/', 'https://www.instagram.com/sportconrad/', 'https://www.facebook.com/SportConrad', 87],
  ['Doorout', 'Germany', 'https://www.doorout.com/', 'https://www.instagram.com/doorout_com/', 'https://www.facebook.com/dooroutcom', 86],
  ['Addnature', 'Sweden', 'https://www.addnature.com/', 'https://www.instagram.com/addnature/', 'https://www.facebook.com/addnature', 86],
  ['XXL Sport', 'Norway', 'https://www.xxl.no/', 'https://www.instagram.com/xxlsport/', 'https://www.facebook.com/xxlsport', 88],
  ['Intersport Norway', 'Norway', 'https://www.intersport.no/', 'https://www.instagram.com/intersportnorge/', 'https://www.facebook.com/intersportnorge', 87],
  ['Blue Tomato', 'Austria', 'https://www.blue-tomato.com/', 'https://www.instagram.com/bluetomato/', 'https://www.facebook.com/bluetomato', 87],
  ['Sportler', 'Italy', 'https://www.sportler.com/', 'https://www.instagram.com/sportler_com/', 'https://www.facebook.com/Sportler', 87],
  ['Trekkinn', 'Spain', 'https://www.tradeinn.com/trekkinn/', 'https://www.instagram.com/trekkinn/', 'https://www.facebook.com/trekkinn', 86],
  ['Mammut Store', 'Switzerland', 'https://www.mammut.com/', 'https://www.instagram.com/mammut_swiss1862/', 'https://www.facebook.com/mammut', 87],
  ['4Camping', 'Czech Republic', 'https://www.4camping.cz/', 'https://www.instagram.com/4camping.cz/', 'https://www.facebook.com/4camping.cz', 86],
  ['8a.pl', 'Poland', 'https://8a.pl/', 'https://www.instagram.com/8apl/', 'https://www.facebook.com/sklep8apl', 86],
  ['Sklep Podroznika', 'Poland', 'https://www.sklep-podroznika.pl/', 'https://www.instagram.com/skleppodroznika/', 'https://www.facebook.com/skleppodroznika', 85],
  ['Bever Zwerfsport', 'Netherlands', 'https://www.bever.nl/', 'https://www.instagram.com/bevernl/', 'https://www.facebook.com/BeverNL', 86],
  // The consortium is real, but no current first-party source proves ownership
  // of the legacy /outdoorspecialist social handles. Keep its official website
  // candidate and fail closed on social until an exact official link is found.
  ['Outdoor Specialist', 'Netherlands', 'https://www.outdoorspecialist.nl/', '', '', 85],
].map(([company, country, url, instagramUrl, facebookUrl, fitScore]) => ({
  company,
  country,
  url,
  contactUrl: url,
  instagramUrl,
  facebookUrl,
  segment: 'verified outdoor, camping and travel retail social refill channel',
  customerType: 'key_account',
  refillSeed: true,
  fitScore: Math.min(Number(fitScore || 0), 84),
  background: `${company} is a qualified outdoor, camping, travel or sport retail prospect with category fit for FLEXTAIL portable outdoor electrics and Vollyc practical 3C products.`,
  buyerPersona: 'Outdoor, camping, travel accessories, ecommerce or category buyer.',
  evidenceUrl: SOCIAL_REFILL_SOURCE,
  dataSources: ['official company website', 'public social profile refill'],
  officialSocialProfileVerified: company === 'Doorout' || company === '8a.pl' || company === 'Wild Earth',
  socialProfileEvidenceUrl: company === 'Doorout'
    ? 'https://www.doorout.com/'
    : (company === '8a.pl'
      ? 'https://8a.pl/media/pliki/polityka_prywatno%C5%9Bci_FB_8a.pdf'
      : (company === 'Wild Earth' ? 'https://www.wildearth.com.au/' : '')),
  socialProfileVerifiedAt: company === 'Wild Earth' ? '2026-08-04T07:00:00.000Z' : '',
}));

// Source-backed public routing addresses for the current refill batch.
// These are not claimed buyer emails; route the message to the buyer/vendor team.
const PUBLIC_CONTACT_ENRICHMENT = {
  Outdoorplay: ['customerservice@outdoorplay.com', 'Official Outdoorplay contact page; route to buyer/vendor team.'],
  'Sport Conrad': ['info@sport-conrad.de', 'Public Sport Conrad contact address; route to buyer/vendor team.'],
  'Rock/Creek': ['companyrockcreek@gmail.com', 'Public Rock Creek contact address; route to buyer/vendor team.'],
  Tiso: [
    'mail@tiso.co.uk',
    'Official Tiso general-business address explicitly published for organisations seeking to work with Tiso or discuss opportunities.',
    'https://www.tiso.com/pages/contact',
  ],
  'The Mountaineer': [
    'mountaineer@mountaineer.com',
    'Official company-domain address published by The Mountaineer on its privacy contact page; route the proposal to the category buyer or owner.',
    'https://mountaineer.com/privacy-policy/',
  ],
};
for (const candidate of SOCIAL_REFILL_CANDIDATES) {
  const enrichment = PUBLIC_CONTACT_ENRICHMENT[candidate.company];
  if (enrichment) {
    candidate.publicEmail = enrichment[0];
    candidate.contactEmail = enrichment[0];
    candidate.publicEmailStatus = enrichment[1];
    if (enrichment[2]) {
      candidate.emailVerificationStatus = 'official_public_business_email';
      candidate.emailEvidence = 'official_contact_page';
      candidate.emailEvidenceUrl = enrichment[2];
      candidate.contactUrl = enrichment[2];
    }
  }
}

CANDIDATES.push(...SOCIAL_REFILL_CANDIDATES);

const KNOWN_BROKEN_SOCIAL_URLS = new Set([
  'https://www.instagram.com/sailoutdoors/',
  'https://www.instagram.com/summitint/',
  'https://www.facebook.com/sailoutdoors',
  'https://www.facebook.com/summitint',
]);
const KNOWN_MISMATCHED_SOCIAL_URLS = new Set([
  'https://www.instagram.com/moosejawmadness/',
]);

const VERIFIED_ENRICHMENT = {
  Aqipa: {
    founded: '1990',
    headquarters: 'Kundl, Tyrol, Austria',
    companyScale: 'Pan-European and Australian operations; automated logistics infrastructure exceeding 43,000 picks per day',
    businessModel: 'Premium Value-Added Distributor / Brand Growth Accelerator',
    marketPosition: 'Pan-European premium lifestyle and consumer electronics distribution leader',
    corePositioning: 'International growth accelerator and distributor for premium lifestyle gear',
    industryPosition: 'Established in 1990; expanded from Austria into pan-European distribution and took over Pioneer & Onkyo Europe distribution operations in 2018',
    coverage: 'Europe and Australia',
    mainBrands: 'GoPro, Marshall, TEAC, Esoteric, Pioneer, Onkyo, Braun Audio, JLab and other premium lifestyle/consumer electronics brands',
    productCategory: 'Premium audio, consumer electronics, action gear, lifestyle technology, e-mobility, home appliances and accessories',
    buyingCapability: 'Very high; pan-European demand planning, SAP/EDI retail integration, automated warehousing, distribution, ecommerce and marketplace management',
    decisionMaker: 'Brand Operations Management Team, Brand Sales Director, vendor partnerships or category director',
    productFit: 'Zero Power 10000C, Zero Lantern and Max Repeller S positioned as premium lifestyle technology accessories',
    productRationale: 'FLEXTAIL design-led compact electronics can extend Aqipa action gear and premium lifestyle portfolios as high-margin accessories',
    crossCategoryPositioning: 'Premium Lifestyle Tech Accessories for portable audio, travel, patio and action-gear users',
    buyerValue: 'Award-winning design, high-margin add-on potential, pan-European compliance readiness and 2026 product pipeline',
    recommendedOpening: 'Present FLEXTAIL as a premium lifestyle technology brand, not a low-cost camping-equipment supplier; lead with design awards, margins and EU compliance readiness',
    opportunity: 'Use Aqipa as a pan-European growth partner for premium outdoor and lifestyle electronics across its retailer, ecommerce and key-account network',
    competition: 'Existing premium accessory and lifestyle technology brands in Aqipa portfolio; differentiation must come from design, compact performance and margin',
    brandRisk: 'High brand-fit threshold: packaging, content and sell-in materials must match Aqipa premium portfolio standards',
    complianceRisk: 'EU battery/electronics review requires CE, RoHS, REACH, WEEE and UN38.3 documentation where applicable',
    commercialRisk: 'Large distributor terms, market investment, exclusivity scope, rebates and payment terms require commercial review',
    decisionCycleRisk: 'Likely multi-stage brand, category, compliance and commercial review; plan for a 3-6 month onboarding cycle',
    executiveConclusion: 'Aqipa is not an Entry / Niche prospect. It is a premium pan-European value-added distributor and brand growth accelerator founded in 1990, with strong consumer-electronics, premium-audio, action-gear, ecommerce and logistics capabilities. FLEXTAIL should approach Aqipa as a premium lifestyle technology brand and pursue its Brand Operations Management or vendor-partnership team.',
    dataSources: [
      'https://www.aqipa.com/en-FR/the-gear-guide/aqipa-news/aqipas-35-year-journey-from-tyrolean-garage-to-european-tech-powerhouse/',
      'https://www.aqipa.com/en-IT',
      'https://support.aqipa.com/en-US/kb/articles/anfrage-partner-werden',
      'https://www.aqipa.com/en-GB/the-gear-guide/insights/challenges-pan-european-distribution/',
      'https://support.aqipa.com/en-GB/kb/articles/pdf/aqipa-high-end-esoteric-webshop',
    ],
  },
  'REI Co-op': {
    linkedinUrl: 'https://www.linkedin.com/company/rei',
    founded: '1938',
    headquarters: 'Seattle, Washington, United States',
    companyScale: '10,001+ employees; national US co-op retailer and ecommerce channel',
    coverage: 'National / United States',
    mainBrands: 'Multi-brand outdoor retail assortment across camping, hiking, cycling, travel, apparel, and REI private label',
    salesChannel: 'Omni-channel retail: stores, ecommerce, co-op membership, outdoor services',
    buyingCapability: 'Large national buyer organization; vendor/category review likely required',
    decisionMaker: 'Camping accessories buyer, category merchant, vendor onboarding or merchandising manager',
    publicEmail: '',
    publicEmailStatus: 'No public buyer email verified; use official help/contact path or LinkedIn/company vendor research.',
    contactPhone: '',
    vendorPortal: 'https://www.rei.com/help',
    linkedinCompany: 'https://www.linkedin.com/company/rei',
    contactNote: 'Use REI help/contact route and LinkedIn procurement/category research; do not guess employee emails.',
    dataSources: ['LinkedIn company profile', 'Official website/contact page'],
  },
  'Bass Pro Shops': {
    linkedinUrl: 'https://www.linkedin.com/company/bassproshops',
    founded: '1972',
    headquarters: 'Springfield, Missouri, United States',
    companyScale: '150+ Bass Pro/Cabela retail locations across North America; large omnichannel outdoor retail group',
    coverage: 'North America',
    mainBrands: 'Bass Pro Shops, Cabela’s, Tracker Boats and broad third-party outdoor/fishing/camping brands',
    salesChannel: 'Destination retail stores, ecommerce, catalog, loyalty/membership, vendor portal',
    buyingCapability: 'Very high; formal vendor submission via Bass Pro Shops/Cabela’s vendor relations',
    decisionMaker: 'Camping/outdoor accessories category merchant or vendor relations team',
    publicEmail: 'vendorrelations@basspro.com',
    publicEmailStatus: 'Official vendor submission email for finished product/company information.',
    contactPhone: '',
    vendorPortal: 'https://vendorportal.basspro.com/',
    linkedinCompany: 'https://www.linkedin.com/company/bassproshops',
    contactNote: 'Send product information, company information, website link and primary contact to vendor relations with the right department subject line.',
    dataSources: ['Bass Pro Shops Vendor Relations Portal', 'Bass Pro Shops LinkedIn'],
  },
  'Cabela\'s': {
    linkedinUrl: 'https://www.linkedin.com/company/cabela%27s',
    founded: '1961',
    headquarters: 'Sidney, Nebraska, United States',
    companyScale: '10,001+ employee retail brand under Bass Pro Shops group',
    coverage: 'United States / Canada through Bass Pro Shops group',
    mainBrands: 'Cabela’s, Bass Pro Shops group brands, hunting/fishing/camping/outdoor categories',
    salesChannel: 'Retail stores, ecommerce, catalog, Bass Pro Shops/Cabela’s vendor relations',
    buyingCapability: 'Very high; same Bass Pro Shops/Cabela’s vendor review route',
    decisionMaker: 'Camping, hunting, outdoor gear buyer or Bass Pro Shops/Cabela’s vendor relations',
    publicEmail: 'vendorrelations@basspro.com',
    publicEmailStatus: 'Official Cabela’s help article points product submissions to this vendor relations email.',
    contactPhone: '',
    vendorPortal: 'https://help.cabelas.com/company-information-ff566349/how-can-i-sell-my-product-through-cabelas-cf904a21',
    linkedinCompany: 'https://www.linkedin.com/company/cabela%27s',
    contactNote: 'Submit finished product/company information through Bass Pro Shops/Cabela’s vendor relations.',
    dataSources: ['Cabela’s help article', 'Cabela’s LinkedIn'],
  },
  MEC: {
    linkedinUrl: 'https://ca.linkedin.com/company/mountainequipmentcompany',
    founded: '1971',
    headquarters: 'Vancouver, British Columbia, Canada',
    companyScale: 'Canadian national outdoor retailer; established 1971',
    coverage: 'Canada',
    mainBrands: 'Outdoor gear, apparel and equipment for camping, climbing, hiking, cycling, snow and travel',
    salesChannel: 'Stores, ecommerce, membership/community channel',
    buyingCapability: 'High; category/brand partnership or merchandising route required',
    decisionMaker: 'Camping equipment category merchant, brand partnerships, vendor review contact',
    publicEmail: 'info@mec.ca',
    publicEmailStatus: 'Public general information/customer contact email; buyer email not publicly verified.',
    contactPhone: '1-888-847-0770',
    vendorPortal: 'https://www.mec.ca/en/contact-us',
    linkedinCompany: 'https://ca.linkedin.com/company/mountainequipmentcompany',
    contactNote: 'Use info/contact path first; ask for camping/outdoor accessories category buyer or brand partnership contact.',
    dataSources: ['MEC LinkedIn', 'MEC public contact/FAQ sources'],
  },
  'Sail Outdoors': {
    linkedinUrl: 'https://ca.linkedin.com/company/sailpleinairoutdoors',
    founded: '1981',
    headquarters: 'Beloeil, Quebec, Canada',
    companyScale: 'Quebec/Ontario outdoor, camping, hunting and fishing retail network',
    coverage: 'Eastern Canada',
    mainBrands: 'Brand-name outdoor sports, camping, hunting and fishing products',
    salesChannel: 'Stores and ecommerce',
    buyingCapability: 'Medium/High; regional Canadian outdoor chain',
    decisionMaker: 'Camping/outdoor equipment department buyer or merchandising manager',
    publicEmail: '',
    publicEmailStatus: 'No public buyer email verified; Instagram profile is broken, use Facebook or official contact page.',
    contactPhone: '',
    vendorPortal: 'https://www.sail.ca/en/contact-us',
    linkedinCompany: 'https://ca.linkedin.com/company/sailpleinairoutdoors',
    contactNote: 'Reroute away from broken Instagram URL; use Facebook page and official contact page.',
    dataSources: ['SAIL LinkedIn', 'SAIL public contact page/job descriptions'],
  },
  'GO Outdoors': {
    linkedinUrl: 'https://uk.linkedin.com/company/go-outdoors-ltd',
    founded: '1969',
    headquarters: 'Bury, Lancashire, United Kingdom',
    companyScale: '1,001-5,000 employees; major UK outdoor retail chain',
    coverage: 'United Kingdom',
    mainBrands: 'Camping equipment, outdoor clothing/footwear, cycling, fishing, caravanning, tents',
    salesChannel: 'Stores and ecommerce',
    buyingCapability: 'High; category buyer or JD Outdoors/GO Outdoors merchandising route',
    decisionMaker: 'Camping equipment buyer, outdoor accessories category manager, vendor review contact',
    publicEmail: '',
    publicEmailStatus: 'No public buyer email verified; use official contact page and LinkedIn category research.',
    contactPhone: '+44 330 008 1555',
    vendorPortal: 'https://www.gooutdoors.co.uk/contact-us',
    linkedinCompany: 'https://uk.linkedin.com/company/go-outdoors-ltd',
    contactNote: 'Use official contact route and ask for camping/accessories buyer; validate any personal emails before use.',
    dataSources: ['GO Outdoors LinkedIn', 'GO Outdoors public company/contact sources'],
  },
  'Cotswold Outdoor': {
    linkedinUrl: 'https://uk.linkedin.com/company/cotswold-outdoor',
    founded: '1997',
    headquarters: 'Swindon, Wiltshire, United Kingdom',
    companyScale: 'Part of Cotswold Outdoor Group; one of the largest UK outdoor retail groups',
    coverage: 'United Kingdom',
    mainBrands: 'Cotswold Outdoor, Snow+Rock, Runners Need group brands',
    salesChannel: 'Stores and ecommerce',
    buyingCapability: 'High; outdoor group/category buying route',
    decisionMaker: 'Outdoor equipment buyer, category manager, group merchandising contact',
    publicEmail: 'enquiries@cotswoldoutdoor.com',
    publicEmailStatus: 'Official customer contact email; buyer email not publicly verified.',
    contactPhone: '01666 336447',
    vendorPortal: 'https://help.cotswoldoutdoor.com/hc/en-gb/articles/21898663918866-Contact-Details',
    linkedinCompany: 'https://uk.linkedin.com/company/cotswold-outdoor',
    contactNote: 'Use enquiries/contact route to request vendor/category buyer routing.',
    dataSources: ['Cotswold Outdoor contact details', 'Cotswold Outdoor Group sources'],
  },
  Anaconda: {
    linkedinUrl: 'https://au.linkedin.com/company/anaconda-group-pty-ltd',
    founded: '2004',
    headquarters: 'South Melbourne, Victoria, Australia',
    companyScale: '501-1,000 employees on LinkedIn; large Australian camping/adventure retail chain',
    coverage: 'Australia',
    mainBrands: 'Camping, fishing, hiking, 4WD, outdoor lifestyle and adventure retail brands',
    salesChannel: 'Stores and ecommerce',
    buyingCapability: 'High; Australian national outdoor chain under Spotlight Group holdings',
    decisionMaker: 'Camping/4WD/outdoor equipment buyer or category manager',
    publicEmail: 'info@spotlightgroup.com',
    publicEmailStatus: 'Parent/group public contact email; direct buyer email not publicly verified.',
    contactPhone: '1300 558 990',
    vendorPortal: 'https://help.anacondastores.com/hc/en-au',
    linkedinCompany: 'https://au.linkedin.com/company/anaconda-group-pty-ltd',
    contactNote: 'Use official enquiry form or group contact; request camping/4WD category buyer routing.',
    dataSources: ['Anaconda LinkedIn', 'Anaconda help centre', 'Spotlight Group Anaconda page'],
  },
  BCF: {
    linkedinUrl: 'https://au.linkedin.com/company/boating-camping-fishing',
    founded: '2005',
    headquarters: 'Strathpine, Queensland, Australia',
    companyScale: '1,001-5,000 employees; largest outdoor retailer in Australia per company profile',
    coverage: 'Australia',
    mainBrands: 'Boating, camping, fishing and outdoor brands under Super Retail Group',
    salesChannel: 'Stores and ecommerce; Super Retail Group trade partner processes',
    buyingCapability: 'High; Super Retail Group trade partner route',
    decisionMaker: 'Camping/outdoor accessories category manager or Super Retail Group trade partner contact',
    publicEmail: '',
    publicEmailStatus: 'No public buyer email verified; use Super Retail Group trade partner/contact route.',
    contactPhone: '',
    vendorPortal: 'https://www.superretailgroup.com.au/working-with-us/Trade/',
    linkedinCompany: 'https://au.linkedin.com/company/boating-camping-fishing',
    contactNote: 'Use Super Retail Group trade partner information; do not use generic AP emails for sales pitch.',
    dataSources: ['BCF LinkedIn', 'Super Retail Group trade partner page'],
  },
  Kathmandu: {
    linkedinUrl: 'https://sd.linkedin.com/company/kathmandu',
    founded: '1987',
    headquarters: 'Christchurch, Canterbury, New Zealand',
    companyScale: 'Outdoor lifestyle brand/retailer across New Zealand, Australia and international wholesale channels',
    coverage: 'New Zealand / Australia / international brand distribution',
    mainBrands: 'Kathmandu, Oboz and KMD Brands outdoor portfolio',
    salesChannel: 'Stores, ecommerce, brand/wholesale sales channels',
    buyingCapability: 'Medium/High; brand partnership/wholesale sales route may be more relevant than vendor pitch',
    decisionMaker: 'Partnerships, wholesale, sales manager, or category collaboration contact',
    publicEmail: 'eric.eichberger@kmdbrands.com',
    publicEmailStatus: 'Published North America sales contact on Kathmandu support page; validate region fit before outreach.',
    contactPhone: '+1 604 781 1253',
    vendorPortal: 'https://help.kathmanduoutdoor.com/support/solutions/articles/51000414624-sales-team-contact-details',
    linkedinCompany: 'https://sd.linkedin.com/company/kathmandu',
    contactNote: 'Use sales-team contact page for region routing; for vendor/category pitch ask for outdoor accessories partnership contact.',
    dataSources: ['Kathmandu LinkedIn', 'Kathmandu sales team contact page'],
  },
  'Decathlon Germany': {
    linkedinUrl: 'https://www.linkedin.com/company/decathlon-group',
    founded: '1976',
    headquarters: 'Villeneuve-d’Ascq / Lille, France; Germany country operation',
    companyScale: 'Decathlon Group: 10,001+ employees and 1,800+ stores globally',
    coverage: 'Germany / Europe / Global Decathlon group',
    mainBrands: 'Decathlon private-label sports/outdoor brands and marketplace categories',
    salesChannel: 'Stores, ecommerce, marketplace, group retail operations',
    buyingCapability: 'Very high; marketplace/vendor onboarding or camping category buyer route',
    decisionMaker: 'Camping/outdoor category buyer, marketplace partnership, Decathlon Germany vendor onboarding',
    publicEmail: 'international.media@decathlon.com',
    publicEmailStatus: 'Public group media email only; buyer/vendor email not publicly verified.',
    contactPhone: '',
    vendorPortal: 'https://www.decathlon.de/help/app/contact',
    linkedinCompany: 'https://www.linkedin.com/company/decathlon-group',
    contactNote: 'Use country contact/marketplace route; do not use media email for sales except as routing fallback.',
    dataSources: ['Decathlon LinkedIn', 'Decathlon group contact page'],
  },
  'Decathlon France': {
    linkedinUrl: 'https://www.linkedin.com/company/decathlon-group',
    founded: '1976',
    headquarters: 'Villeneuve-d’Ascq / Lille, France',
    companyScale: 'Decathlon Group: 10,001+ employees and 1,800+ stores globally',
    coverage: 'France / Europe / Global Decathlon group',
    mainBrands: 'Decathlon private-label sports/outdoor brands and marketplace categories',
    salesChannel: 'Stores, ecommerce, marketplace, group retail operations',
    buyingCapability: 'Very high; marketplace/vendor onboarding or camping category buyer route',
    decisionMaker: 'Camping/outdoor category buyer, marketplace partnership, Decathlon France vendor onboarding',
    publicEmail: 'international.media@decathlon.com',
    publicEmailStatus: 'Public group media email only; buyer/vendor email not publicly verified.',
    contactPhone: '',
    vendorPortal: 'https://www.decathlon.fr/help/app/contact',
    linkedinCompany: 'https://www.linkedin.com/company/decathlon-group',
    contactNote: 'Use country contact/marketplace route; do not use media email for sales except as routing fallback.',
    dataSources: ['Decathlon LinkedIn', 'Decathlon group contact page'],
  },
  Bever: {
    linkedinUrl: 'https://nl.linkedin.com/company/bever',
    founded: '1977',
    headquarters: 'Pijnacker, South Holland, Netherlands',
    companyScale: 'Dutch outdoor retail chain; 40 stores reported by public company sources',
    coverage: 'Netherlands',
    mainBrands: 'Outdoor apparel, footwear, camping, hiking and travel gear brands',
    salesChannel: 'Stores, ecommerce, customer service/contact form and social channels',
    buyingCapability: 'Medium/High; national Netherlands outdoor specialist',
    decisionMaker: 'Outdoor equipment/category buyer or B2B/partnership contact',
    publicEmail: 'klantenservice@bever.nl',
    publicEmailStatus: 'Official customer service email; buyer email not publicly verified.',
    contactPhone: '+31 85 888 50 88',
    vendorPortal: 'https://www.bever.nl/klantenservice/contactgegevens.html',
    linkedinCompany: 'https://nl.linkedin.com/company/bever',
    contactNote: 'Use official email/contact form to request category buyer routing; WhatsApp/customer channels are for service.',
    dataSources: ['Bever official contact page', 'Bever LinkedIn/public company sources'],
  },
  'Summit International': {
    linkedinUrl: 'https://uk.linkedin.com/company/summit-international',
    founded: '',
    headquarters: 'Basildon, Essex, United Kingdom',
    companyScale: 'UK based importer and distributor for the outdoor B2B trade sector',
    coverage: 'United Kingdom / Europe',
    mainBrands: 'Camping, sports and outdoor leisure products for trade customers',
    salesChannel: 'B2B distribution, showrooms, official contact form and trade website',
    buyingCapability: 'High; outdoor B2B importer/distributor with retailer and wholesale channels',
    decisionMaker: 'Brand partnerships, buying, or distribution director for outdoor products',
    publicEmail: 'info@summitint.co',
    publicEmailStatus: 'Official public contact email from Summit International contact page; buyer email not publicly verified.',
    contactPhone: '+44 (0) 1268 505 171',
    vendorPortal: 'https://www.summitint.co/contact/',
    linkedinCompany: 'https://uk.linkedin.com/company/summit-international',
    contactNote: 'Use official contact form or info email to request buying/distribution contact routing.',
    dataSources: ['Summit International official contact page', 'Summit International LinkedIn/public company sources'],
  },
};

function csvCell(value) {
  return `"${String(value == null ? '' : value).replace(/"/g, '""')}"`;
}

function googleUrl(company, segment, country) {
  const query = `"${company}" "${segment}" "${country}" buyer OR wholesale OR contact`;
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function contactSearchUrl(company, website) {
  const host = String(website || '').replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const query = `site:${host} ${JSON.stringify(company)} contact buyer wholesale email vendor`;
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function hasVerifiedContactPath(item) {
  const contact = String(item && item.contactUrl || '').trim();
  const website = String(item && item.url || '').trim();
  if (!contact || !website) return false;
  try {
    const contactUrl = new URL(contact);
    const websiteUrl = new URL(website);
    const contactPath = contactUrl.pathname.replace(/\/+$/, '') || '/';
    const websitePath = websiteUrl.pathname.replace(/\/+$/, '') || '/';
    const normalizedContactHost = contactUrl.hostname.toLowerCase().replace(/^www\./, '');
    const normalizedWebsiteHost = websiteUrl.hostname.toLowerCase().replace(/^www\./, '');
    return normalizedContactHost === normalizedWebsiteHost
      && contactPath !== '/'
      && contactPath !== websitePath;
  } catch {
    return false;
  }
}

function slug(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function websiteContactSubject(item) {
  return 'FLEXTAIL retail partnership | 2026 assortment';
}

function legacyMarketingEmailSignature() {
  return `[Flextail.com](https://www.flextail.com/), [vollyc.com](https://vollyc.com/)

[Sincerely](https://wa.me/8617321028184)
[Best Regard](https://wa.me/8617321028184)
[Leo Liu](https://wa.me/8617321028184)
[Sales](https://wa.me/8617321028184) [& Operations Director](https://wa.me/8617321028184)
[Brand & ODM Department](https://wa.me/8617321028184)
[Tel/whatsapp:  +86 17321028184](https://wa.me/8617321028184)

[Email:  Leo@flextailgear.com](https://wa.me/8617321028184)
[SHANGHAI FLEXTAIL TECHNOLOGY CO.,LTD.](https://wa.me/8617321028184)
[Room103, Building No.6, No.1 Yanjiaqiao, Pudong District, ShangHai, China](https://wa.me/8617321028184)`;
}

function legacyWebsiteContactMessage(item) {
  const teamName = String(item.company || 'Your').replace(/\s+(Inc|Ltd|Limited|LLC|Group)$/i, '').trim() || 'Your';
  return `Dear ${teamName} Team,

Nice to e-meet you.
I am Leo, from Flextail & Vollyc.

Flextail is our first and core brand, specializing in ultralight electric products for outdoor, travel, and home use. The brand is currently Top 1 on Amazon, with strong global sell-through and a proven product-market fit.
Vollyc, our second brand, focuses on 3C electronics, targeting practical, high-rotation consumer use cases.

From our perspective, your platform and positioning are highly aligned with Flextail’s product philosophy, especially in lightweight outdoor and travel-oriented electrics.

We have already contacted with your team, and we are now actively exploring opportunities in other regions.
Attached, you will find a brief introduction to our brands and current product catalog for your reference.

Looking ahead, we are planning to launch over 36 new SKUs in 2026, covering multiple usage scenarios and price tiers, which we believe could be of interest to your assortment strategy.

If you are available, I would greatly appreciate the opportunity to arrange a short introductory video meeting to present our brands and discuss potential collaboration opportunities.

Thank you for your time and consideration. I look forward to your reply.

${legacyMarketingEmailSignature()}
`;
}

function websiteContactMessage(item) {
  const teamName = String(item.company || 'Your')
    .replace(/\s+(Inc|Ltd|Limited|LLC|Group)$/i, '')
    .trim() || 'Your';
  const relevance = String(
    item.productCategory
    || item.keyword
    || 'outdoor, camping and travel retail'
  ).replace(/\s+/g, ' ').trim();
  return `Dear ${teamName} Team,

I’m Leo from FLEXTAIL. Your focus on ${relevance} looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.

FLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.

Would you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?

Product overview: https://www.flextail.com/

Best regards,
Leo Liu
Sales & Operations Director
Leo@flextailgear.com`;
}

function baseLead(item, id, evidenceUrl) {
  const enrichment = VERIFIED_ENRICHMENT[item.company] || {};
  const exclusiveAgent = exclusiveAgentForCountry(item.country);
  const partnerAccount = Boolean(item.doNotOutreach || item.partnershipStatus === 'active_partner' || isActiveCustomer(item.company));
  return {
    ...enrichment,
    id,
    name: item.company,
    company: item.company,
    customerType: item.customerType || 'key_account',
    discoveryMode: item.refillSeed ? 'autonomous_refill' : 'baseline_verified_pool',
    country: item.country,
    countryEn: item.country,
    fitScore: item.fitScore,
    fitTier: item.fitScore >= 90 ? 'A+' : 'A',
    marketScore: 4.5,
    marketStatus: exclusiveAgent ? 'exclusive' : (item.marketStatus || 'open'),
    agencyState: exclusiveAgent ? 'exclusive' : (item.agencyState || 'open'),
    agentCompany: exclusiveAgent || item.agentCompany || '',
    keyword: item.segment,
    role: item.buyerPersona,
    background: item.background,
    buyerPersona: item.buyerPersona,
    buyerName: item.buyerName || '',
    linkedinBuyerUrl: item.linkedinBuyerUrl || '',
    buyerIdentityVerified: item.buyerIdentityVerified === true,
    buyerIdentityEvidenceUrl: item.buyerIdentityEvidenceUrl || '',
    targetMarkets: item.targetMarkets || '',
    excludedMarkets: item.excludedMarkets || '',
    productCategory: enrichment.productCategory || item.segment,
    businessModel: enrichment.businessModel || 'Retail Chain',
    productFit: enrichment.productFit || 'FLEXTAIL portable pumps, outdoor power, camping lighting and compact camping accessories',
    opportunity: enrichment.opportunity || item.background,
    linkedin_url: enrichment.linkedinUrl || item.linkedinUrl || '',
    linkedin: enrichment.linkedinUrl || item.linkedinUrl || '',
    publicEmail: enrichment.publicEmail || item.publicEmail || '',
    contactEmail: enrichment.publicEmail || item.publicEmail || '',
    vendorPortal: enrichment.vendorPortal || item.vendorPortal || item.contactUrl || '',
    contactPhone: enrichment.contactPhone || item.contactPhone || '',
    contactNote: enrichment.contactNote || item.contactNote || '',
    publicEmailStatus: enrichment.publicEmailStatus || item.publicEmailStatus || '',
    emailVerificationStatus: enrichment.emailVerificationStatus || item.emailVerificationStatus || '',
    emailEvidence: enrichment.emailEvidence || item.emailEvidence || '',
    emailEvidenceUrl: enrichment.emailEvidenceUrl || item.emailEvidenceUrl || '',
    website: item.url,
    evidenceUrl,
    sourceEvidenceUrl: item.evidenceUrl || item.url,
    discoverySourceUrl: item.discoverySourceUrl || '',
    externalVerificationStatus: item.externalVerificationStatus || '',
    query: evidenceUrl,
    source: 'google_customer_discovery',
    sourceType: 'google',
    discoveryProvider: 'google',
    channel: String(item.platform || '').toLowerCase(),
    identityStatus: 'verified',
    officialSocialProfileVerified: item.officialSocialProfileVerified === true,
    socialProfileOwnerCompany: item.socialProfileOwnerCompany || '',
    socialProfileEvidenceUrl: item.socialProfileEvidenceUrl || '',
    socialProfileVerifiedAt: item.socialProfileVerifiedAt || '',
    profiledAt: enrichment.decisionMaker && enrichment.dataSources ? new Date().toISOString() : '',
    partnershipStatus: partnerAccount ? 'active_partner' : (item.partnershipStatus || ''),
    doNotOutreach: partnerAccount,
    automationStatus: partnerAccount ? 'partner_account' : '',
    partnerNote: partnerAccount ? 'Active customer/cooperation account; keep profile only and do not create new outreach tasks.' : '',
    sendStatus: partnerAccount ? 'partner_account' : '',
    workingTime: {
      dueNow: true,
      timeZone: 'local-market',
      localTime: new Date().toLocaleString(),
      nextBest: 'open exact company profile, review background, then start compliant buyer/contact development',
    },
  };
}

function channelLeads(item) {
  const evidenceUrl = googleUrl(item.company, item.segment, item.country);
  const baseId = `google-customer-${slug(item.company)}`;
  const partnerAccount = Boolean(item.doNotOutreach || item.partnershipStatus === 'active_partner' || isActiveCustomer(item.company));
  const invalidChannels = {};
  const declaredSocialOwner = String(item.socialProfileOwnerCompany || '').trim();
  if (declaredSocialOwner && activeCustomerKey(declaredSocialOwner) !== activeCustomerKey(item.company)) {
    if (item.instagramUrl) {
      invalidChannels.instagram = {
        url: item.instagramUrl,
        status: 'identity_mismatch',
        evidence: `Official page belongs to represented brand ${declaredSocialOwner}, not agency ${item.company}; do not use it as the agency account.`,
      };
    }
    if (item.facebookUrl) {
      invalidChannels.facebook = {
        url: item.facebookUrl,
        status: 'identity_mismatch',
        evidence: `Official page belongs to represented brand ${declaredSocialOwner}, not agency ${item.company}; do not use it as the agency account.`,
      };
    }
  }
  if (item.instagramUrl) {
    let instagramHandle = '';
    try {
      instagramHandle = new URL(item.instagramUrl).pathname.replace(/^\/+/, '').split('/')[0] || '';
    } catch {}
    const companyKey = slug(item.company).replace(/-/g, '');
    const handleKey = slug(instagramHandle).replace(/-/g, '');
    if (!item.officialSocialProfileVerified
      && companyKey
      && handleKey
      && !handleKey.includes(companyKey)
      && !companyKey.includes(handleKey)) {
      invalidChannels.instagram = {
        url: item.instagramUrl,
        status: 'identity_mismatch',
        evidence: `Instagram handle ${instagramHandle} does not match company ${item.company}; do not use this account for outreach.`,
      };
    }
  }
  if (item.instagramUrl && (KNOWN_BROKEN_SOCIAL_URLS.has(item.instagramUrl.toLowerCase())
    || KNOWN_MISMATCHED_SOCIAL_URLS.has(item.instagramUrl.toLowerCase()))) {
    invalidChannels.instagram = {
      url: item.instagramUrl,
      status: KNOWN_MISMATCHED_SOCIAL_URLS.has(item.instagramUrl.toLowerCase()) ? 'identity_mismatch' : 'broken_profile_url',
      evidence: KNOWN_MISMATCHED_SOCIAL_URLS.has(item.instagramUrl.toLowerCase())
        ? 'Instagram profile is not the verified customer account; use Facebook or official website contact instead.'
        : 'Instagram reports this page is unavailable; use Facebook or official website contact instead.',
    };
  }
  if (item.facebookUrl && KNOWN_BROKEN_SOCIAL_URLS.has(item.facebookUrl.toLowerCase().replace(/\/$/, ''))) {
    invalidChannels.facebook = {
      url: item.facebookUrl,
      status: 'broken_profile_url',
      evidence: 'Facebook reports this content is unavailable; use official website contact or another verified company profile instead.',
    };
  }
  const enrichment = VERIFIED_ENRICHMENT[item.company] || {};
  const linkedinUrl = enrichment.linkedinUrl || item.linkedinUrl || '';
  const enrichedOfficialEmail = enrichment.publicEmail || item.contactEmail || item.publicEmail || '';
  const enrichedEmailVerificationStatus = enrichment.emailVerificationStatus || item.emailVerificationStatus || '';
  const socialSiblings = {
    linkedin: linkedinUrl,
    instagram: invalidChannels.instagram ? '' : (item.instagramUrl || ''),
    facebook: invalidChannels.facebook ? '' : (item.facebookUrl || ''),
    websiteContact: item.contactUrl || item.url,
  };
  const verifiedOfficialEmail = String(enrichedOfficialEmail).includes('@')
    && (enrichedEmailVerificationStatus === 'official_public_business_email'
      || enrichedEmailVerificationStatus === 'official_brand_rep_directory_email'
      || item.externalVerificationStatus === 'official_supplier_email_verified');
  const verifiedContactPath = hasVerifiedContactPath(item) || verifiedOfficialEmail;
  const leads = [];
  if (/linkedin\.com\/in\//i.test(linkedinUrl) || item.linkedinDirectOutreach === true) {
    leads.push({
      ...baseLead(item, `${baseId}-linkedin`, evidenceUrl),
      platform: 'linkedin',
      platformUrl: linkedinUrl,
      url: linkedinUrl,
      action: partnerAccount ? 'partner_account' : 'develop',
      reason: partnerAccount ? 'active_partner_no_new_outreach' : 'verified_linkedin_profile_ready',
      alternateChannels: socialSiblings,
      identitySource: 'verified LinkedIn profile + official website + Google background query',
      channelPriority: 0,
    });
  }
  if (item.instagramUrl && !invalidChannels.instagram) {
    leads.push({
      ...baseLead(item, `${baseId}-instagram`, evidenceUrl),
      platform: 'instagram',
      platformUrl: item.instagramUrl,
      url: item.instagramUrl,
      action: partnerAccount ? 'partner_account' : 'develop',
      reason: partnerAccount ? 'active_partner_no_new_outreach' : 'concrete_google_discovered_major_customer_instagram',
      alternateChannels: socialSiblings,
      identitySource: 'official website/social profile + Google background query',
      channelPriority: 1,
    });
  }
  if (item.facebookUrl && !invalidChannels.facebook) {
    leads.push({
      ...baseLead(item, `${baseId}-facebook`, evidenceUrl),
      platform: 'facebook',
      platformUrl: item.facebookUrl,
      url: item.facebookUrl,
      action: partnerAccount ? 'partner_account' : 'develop',
      reason: partnerAccount ? 'active_partner_no_new_outreach' : 'concrete_google_discovered_major_customer_facebook',
      alternateChannels: socialSiblings,
      invalidChannels,
      facebookStatus: 'verified_official_page_candidate',
      identitySource: 'official Facebook page candidate + official website + Google background query',
      channelPriority: 2,
    });
  }
  leads.push({
    ...baseLead(item, `${baseId}-website-contact`, evidenceUrl),
    platform: verifiedOfficialEmail ? 'email' : 'website_form',
    channelType: verifiedOfficialEmail ? 'email' : 'website_form',
    platformUrl: item.contactUrl || item.url,
    url: item.contactUrl || item.url,
    contactUrl: item.contactUrl || item.url,
    contactSearchUrl: contactSearchUrl(item.company, item.url),
    emailFrom: 'leo@flextailgear.com',
    websiteContactSubject: websiteContactSubject(item),
    websiteContactMessage: websiteContactMessage(item),
    websiteContactFlow: 'open_official_contact_us_fill_attach_auto_submit',
    action: partnerAccount ? 'partner_account' : (verifiedContactPath ? 'email_priority' : 'verify_target'),
    partnershipStatus: partnerAccount ? 'active_partner' : (item.partnershipStatus || ''),
    doNotOutreach: partnerAccount,
    automationStatus: partnerAccount ? 'partner_account' : '',
    partnerNote: partnerAccount ? 'Active customer/cooperation account; keep profile only and do not create new outreach tasks.' : '',
    sendStatus: partnerAccount ? 'partner_account' : '',
    reason: partnerAccount ? 'active_partner_no_new_outreach' : (verifiedContactPath ? 'official_website_contact_channel' : 'homepage_only_contact_path_requires_verification'),
    alternateChannels: socialSiblings,
    invalidChannels,
    identitySource: verifiedContactPath ? 'official website contact path + Google buyer/contact query' : 'official homepage found; exact buyer/contact path still requires verification',
    channelPriority: 3,
  });
  return leads;
}

function buildLeads(limit = 40) {
  const leadsById = new Map();
  CANDIDATES
    .flatMap(channelLeads)
    .forEach(lead => {
      if (!leadsById.has(lead.id) || /^official_supplier_/.test(lead.externalVerificationStatus)) {
        leadsById.set(lead.id, lead);
      }
    });
  return [...leadsById.values()]
    .sort((left, right) => right.fitScore - left.fitScore || left.channelPriority - right.channelPriority)
    .slice(0, limit);
}

function buildDiscoveryRun(limit = 40, previousRun = null) {
  const generatedAt = new Date().toISOString();
  const previousLeads = previousRun && Array.isArray(previousRun.leads) ? previousRun.leads : [];
  const previousById = new Map(previousLeads.map(lead => [String(lead.id || ''), lead]));
  const previousByCompany = new Map(previousLeads.map(lead => [activeCustomerKey(lead.company || lead.name), lead]));
  const previousGeneratedAt = previousRun && Number.isFinite(Date.parse(previousRun.generatedAt))
    ? previousRun.generatedAt
    : '';
  const leads = buildLeads(limit).map(lead => {
    const previous = previousById.get(String(lead.id || ''))
      || previousByCompany.get(activeCustomerKey(lead.company || lead.name))
      || {};
    const discoveredAt = Number.isFinite(Date.parse(previous.discoveredAt))
      ? previous.discoveredAt
      : previousGeneratedAt || generatedAt;
    const profiledAt = Number.isFinite(Date.parse(previous.profiledAt))
      ? previous.profiledAt
      : lead.profiledAt;
    return { ...lead, discoveredAt, profiledAt };
  });
  const refillCompanies = CANDIDATES.filter(item => item.refillSeed && !isActiveCustomer(item.company) && Number(item.fitScore || 0) > QUALIFIED_ICP_THRESHOLD);
  const activeCustomerCount = CANDIDATES.filter(item => isActiveCustomer(item.company) || item.doNotOutreach || item.partnershipStatus === 'active_partner').length;
  return {
    generatedAt,
    mode: 'google-concrete-customer-discovery',
    objective: 'continuously refill verified agency and key-account prospects above ICP 70, exclude active customers, then convert them into exact official social and website outreach targets',
    discoveryRefillAttempted: true,
    discoveryRefreshModel: 'artifact_rebuilt_each_run_from_verified_refill_pool',
    candidatePoolCount: CANDIDATES.length,
    activeCustomerExcludedCount: activeCustomerCount,
    qualifiedNonPartnerCompanyCount: refillCompanies.length,
    qualifiedThreshold: QUALIFIED_ICP_THRESHOLD,
    refillCandidateCount: refillCompanies.length,
    refillByCustomerType: {
      agency: refillCompanies.filter(item => item.customerType === 'agency').length,
      key_account: refillCompanies.filter(item => item.customerType === 'key_account').length,
    },
    leads,
  };
}

function main() {
  const limitArg = process.argv.find(arg => /^--limit=/.test(arg));
  const limit = limitArg ? Number(limitArg.split('=')[1]) : 40;
  let previousRun = null;
  try {
    previousRun = JSON.parse(fs.readFileSync(OUT_JSON, 'utf8'));
  } catch (_) {
    previousRun = null;
  }
  const run = buildDiscoveryRun(limit, previousRun);
  fs.writeFileSync(OUT_JSON, JSON.stringify(run, null, 2));
  fs.writeFileSync(OUT_JS, `window.GOOGLE_LEAD_DISCOVERY_LATEST = ${JSON.stringify(run, null, 2)};\n`);
  const columns = ['rank', 'id', 'company', 'platform', 'country', 'fitScore', 'keyword', 'website', 'platformUrl', 'contactUrl', 'contactSearchUrl', 'emailFrom', 'websiteContactSubject', 'websiteContactMessage', 'background', 'buyerPersona', 'evidenceUrl', 'action'];
  const rows = run.leads.map((lead, index) => ({ rank: index + 1, ...lead }));
  fs.writeFileSync(OUT_CSV, [columns.join(','), ...rows.map(row => columns.map(column => csvCell(row[column])).join(','))].join('\n'));
  console.log(JSON.stringify({ count: run.leads.length, json: OUT_JSON, csv: OUT_CSV }, null, 2));
}

if (require.main === module) main();

module.exports = { buildDiscoveryRun, buildLeads };
