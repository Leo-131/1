// Outreach Data Module
const OUTREACH_DATA = {
  contacts: [],
  fb_records: [
    {name:'Outdoor Gears Group',page:'Outdoor Gears, Stuff, Equipments Buy & Sell',type:'Post',date:'2026-04-13',status:'Done'},
    {name:'Camping Enthusiasts',page:'Camping and Outdoor Enthusiasts',type:'Post',date:'2026-05-07',status:'Done'},
    {name:'Hiking Gear Hub',page:'Hiking Gear Hub',type:'Like',date:'2026-05-08',status:'Done'},
    {name:'Outdoor Adventures',page:'Outdoor Adventures Community',type:'Comment',date:'2026-05-08',status:'Done'},
    {name:'Backpacking Life',page:'Backpacking Life',type:'Post',date:'2026-05-09',status:'Done'},
    {name:'Campfire Stories',page:'Campfire Stories',type:'Like',date:'2026-05-10',status:'Done'},
    {name:'Wilderness Explorers',page:'Wilderness Explorers',type:'Comment',date:'2026-05-11',status:'Done'},
    {name:'Trekking World',page:'Trekking World',type:'Post',date:'2026-05-12',status:'Done'},
    {name:'Mountain Life',page:'Mountain Life',type:'Like',date:'2026-05-13',status:'Done'},
    {name:'Adventure Awaits',page:'Adventure Awaits',type:'Comment',date:'2026-05-14',status:'Done'},
    {name:'Nature Lovers',page:'Nature Lovers',type:'Post',date:'2026-05-15',status:'Done'},
    {name:'Trail Blazers',page:'Trail Blazers',type:'Like',date:'2026-05-16',status:'Done'},
    {name:'Outdoor Family',page:'Outdoor Family',type:'Comment',date:'2026-05-17',status:'Done'},
    {name:'Gear Reviews',page:'Gear Reviews Hub',type:'Post',date:'2026-05-18',status:'Done'}
  ],
  ins_records: [
    {account:'camp4wheels',name:'Poland rooftop tent importer',dm:'Partnership DM - replied with WhatsApp interest',date:'2026-04-13',status:'Replied'},
    {account:'kfoutdoor',name:'KF Outdoor Jakarta',dm:'Sent partnership proposal',date:'2026-05-14',status:'Sent'},
    {account:'otimosoutdoorgear',name:'Otimos UK',dm:'Sent - replied with website contact',date:'2026-05-14',status:'Replied'},
    {account:'campmor',name:'Campmor US',dm:'Sent - replied to email buyers@campmor.com',date:'2026-05-14',status:'Replied'},
    {account:'cotswoldoutdoor',name:'Cotswold Outdoor UK',dm:'Sent - rejected: not interested',date:'2026-05-14',status:'Rejected'},
    {account:'worldofcamping',name:'World of Camping UK',dm:'Sent - replied with info@worldofcamping.co.uk',date:'2026-05-14',status:'Replied'},
    {account:'monasheeoutdoors',name:'Monashee Outdoors',dm:'Sent - replied: will let us know',date:'2026-05-14',status:'Replied'},
    {account:'mec',name:'MEC Canada',dm:'Sent - requested product info to info@mec.ca',date:'2026-05-14',status:'Replied'},
    {account:'triedandtrout',name:'Tried & Trout Supply Co',dm:'Sent to Colorado fly fishing shop',date:'2026-05-15',status:'Sent'},
    {account:'prago.outdoors',name:'Prago Outdoors',dm:'Sent partnership proposal',date:'2026-05-15',status:'Sent'},
    {account:'kathmandugear',name:'Kathmandu NZ',dm:'Attempted - DM button not working',date:'2026-05-18',status:'Failed'}
  ],
  daily_progress: [
    {date:'2026-04-13',fb:1,ins:1,li:0},
    {date:'2026-05-07',fb:2,ins:0,li:0},
    {date:'2026-05-08',fb:2,ins:0,li:0},
    {date:'2026-05-09',fb:1,ins:0,li:0},
    {date:'2026-05-10',fb:1,ins:0,li:0},
    {date:'2026-05-11',fb:1,ins:0,li:0},
    {date:'2026-05-12',fb:1,ins:0,li:0},
    {date:'2026-05-13',fb:1,ins:0,li:0},
    {date:'2026-05-14',fb:1,ins:7,li:0},
    {date:'2026-05-15',fb:1,ins:2,li:0},
    {date:'2026-05-16',fb:1,ins:0,li:0},
    {date:'2026-05-17',fb:1,ins:0,li:0},
    {date:'2026-05-18',fb:1,ins:1,li:0}
  ]
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OUTREACH_DATA;
}
