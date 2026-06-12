(function exposeVerifiedProfileRegistry(root) {
  'use strict';

  root.VERIFIED_PROFILE_REGISTRY = {
    ellisbrigham: { status: 'verified', handle: 'ellisbrigham', company: 'Ellis Brigham', country: '英国', url: 'https://www.instagram.com/ellisbrigham/' },
    campmor: { status: 'verified', handle: 'campmor', company: 'Campmor', country: '美国', url: 'https://www.instagram.com/campmor/' },
    otimosoutdoorgear: { status: 'verified', handle: 'otimosoutdoorgear', company: 'Otimos Outdoor Gear', country: '英国', url: 'https://www.instagram.com/otimosoutdoorgear/' },
    worldofcamping: { status: 'verified', handle: 'worldofcamping', company: 'World of Camping', country: '英国', url: 'https://www.instagram.com/worldofcamping/' },
    anacondastores: { status: 'verified', handle: 'anacondastores', company: 'Anaconda Stores', country: '澳大利亚', url: 'https://www.instagram.com/anacondastores/' },
    mec: { status: 'verified', handle: 'mec', company: 'Mountain Equipment Company (MEC)', country: '加拿大', url: 'https://www.instagram.com/mec/' },
    monasheeoutdoors: { status: 'verified', handle: 'monasheeoutdoors', company: 'Monashee Outdoors', country: '加拿大', url: 'https://www.instagram.com/monasheeoutdoors/' },
    camp4wheels: {
      status: 'identity_mismatch',
      handle: 'camp4wheels',
      company: 'Camp4Wheels travel account',
      country: '波兰',
      url: 'https://www.instagram.com/camp4wheels/',
      note: 'Travel and rooftop-tent content account; not verified as a rooftop-tent importer.',
    },
    huntingandfishingnewzealand: { status: 'verified', handle: 'huntingandfishingnewzealand', company: 'Hunting & Fishing New Zealand', country: '新西兰', url: 'https://www.instagram.com/huntingandfishingnewzealand/' },
    kathmandugear: { status: 'verified', handle: 'kathmandugear', company: 'Kathmandu', country: '新西兰', url: 'https://www.instagram.com/kathmandugear/' },
    macpac: { status: 'verified', handle: 'macpac', company: 'Macpac', country: '新西兰', url: 'https://www.instagram.com/macpac/' },
    rebelsportnz: { status: 'verified', handle: 'rebelsportnz', company: 'Rebel Sport New Zealand', country: '新西兰', url: 'https://www.instagram.com/rebelsportnz/' },
    stoneycreeknz: { status: 'verified', handle: 'stoneycreeknz', company: 'Stoney Creek New Zealand', country: '新西兰', url: 'https://www.instagram.com/stoneycreeknz/' },
    triedandtrout: {
      status: 'verified',
      handle: 'triedandtroutsupply',
      company: 'Tried & Trout Supply Co.',
      country: '美国',
      url: 'https://www.instagram.com/triedandtroutsupply/',
      note: 'Corrected from @triedandtrout.',
    },
    kfoutdoor: { status: 'verified', handle: 'kfoutdoor', company: 'KF Outdoor Official', country: '印度尼西亚', url: 'https://www.instagram.com/kfoutdoor/' },
    'prago.outdoors': { status: 'verified', handle: 'prago.outdoors', company: 'Prago Outdoors', country: '印度', url: 'https://www.instagram.com/prago.outdoors/' },
  };

  Object.values(root.VERIFIED_PROFILE_REGISTRY).forEach(profile => {
    profile.platform = 'instagram';
    profile.verifiedAt = '2026-06-12';
    profile.source = 'public Instagram profile';
  });
}(typeof globalThis !== 'undefined' ? globalThis : window));
