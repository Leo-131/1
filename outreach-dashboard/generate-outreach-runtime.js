const { refreshRuntime } = require('./outreach-runtime');

const phaseArg = process.argv.find(item => item.startsWith('--phase='));
const phase = phaseArg ? phaseArg.slice('--phase='.length) : 'manual';
const result = refreshRuntime({ phase });

console.log(JSON.stringify({
  phase,
  policyStatus: result.context.policyStatus,
  sendingAllowed: result.context.sendingAllowed,
  confirmedToday: result.context.confirmedToday,
  remainingToday: result.context.remainingToday,
  activeBlocks: result.context.activeBlocks,
}, null, 2));
