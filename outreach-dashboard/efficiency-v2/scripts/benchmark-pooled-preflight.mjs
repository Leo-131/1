// Local-only comparison. No browser, network, model calls, file writes or sends.
import {performance} from 'node:perf_hooks';
import {planWorkspace} from './plan-workspace-round.mjs';
const [researchDir,historyDir,...candidateFiles]=process.argv.slice(2);
if(!researchDir||!historyDir||candidateFiles.length<2)throw Error('Use researchDir historyDir candidate1 candidate2 ...');
const separateRuns=[],pooledRuns=[];let separate,pooled;
function runSeparate(){const start=performance.now();separate=candidateFiles.map(candidateFile=>planWorkspace({candidateFile,researchDir,historyDir}));separateRuns.push(performance.now()-start);}
function runPooled(){const start=performance.now();pooled=planWorkspace({candidateFiles,researchDir,historyDir});pooledRuns.push(performance.now()-start);}
// Warm both paths, then alternate order to reduce first-run/JIT timing bias.
runSeparate();runPooled();separateRuns.length=0;pooledRuns.length=0;
for(let i=0;i<6;i++){if(i%2){runPooled();runSeparate();}else{runSeparate();runPooled();}}
const median=rows=>{const sorted=[...rows].sort((a,b)=>a-b);return (sorted[2]+sorted[3])/2;};
const separateMs=median(separateRuns),pooledMs=median(pooledRuns);
console.log(JSON.stringify({scope:'local deterministic preflight only, not end-to-end outreach',
 candidateFiles:candidateFiles.length,candidateRows:pooled.inputs.candidateRows,runsPerMode:6,timing:'warmed-alternating-order-median',
 separateReads:separate.reduce((n,p)=>n+p.inputs.filesRead,0),pooledReads:pooled.inputs.filesRead,
 separateMs:Math.round(separateMs),pooledMs:Math.round(pooledMs),pending:pooled.rows.length,
 sendPerformed:false,modelCalls:0,requiresLiveVerification:true}));
