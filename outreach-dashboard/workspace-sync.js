'use strict';
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');const {execFileSync}=require('node:child_process');
const SITE='https://flextail-customer-workspace.leo13111.chatgpt.site';
const FILES={
 'daily-automation-latest.js':'DAILY_AUTOMATION_LATEST','daily-automation-execution-latest.js':'DAILY_AUTOMATION_EXECUTION_LATEST',
 'google-lead-discovery-latest.js':'GOOGLE_LEAD_DISCOVERY_LATEST','autonomous-outreach-results.js':'AUTONOMOUS_OUTREACH_RESULTS',
 'outreach-intelligence-latest.js':'OUTREACH_INTELLIGENCE_LATEST','system-visibility-latest.js':'SYSTEM_VISIBILITY_LATEST',
 'system-readiness-latest.js':'SystemReadinessData','github-sync/latest-status.js':'GITHUB_SYNC_LATEST',
 'public/outreach_data.json':'OUTREACH_SHEET_DATA'
};
function parseData(source,global){
 if(source.trim().startsWith('{')||source.trim().startsWith('['))return JSON.parse(source);
 const m=source.match(new RegExp('^\\s*window\\.'+global+'\\s*=\\s*([\\s\\S]*?)\\s*;?\\s*$'));
 if(!m)throw new Error('Only a JSON data assignment can be synchronized');return JSON.parse(m[1]);
}
function token(){
 if(process.env.OUTREACH_WORKSPACE_TOKEN)return process.env.OUTREACH_WORKSPACE_TOKEN;
 if(process.platform==='darwin')try{return execFileSync('/usr/bin/security',['find-generic-password','-s','flextail-workspace-sync','-a','outreach','-w'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}catch{}
 if(process.platform==='win32')try{
  return execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',"$s=Get-Content (Join-Path $env:APPDATA 'FlextailWorkspace/sync-token.dpapi') | ConvertTo-SecureString; $p=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($s); try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($p) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($p) }"],{encoding:'utf8',stdio:['ignore','pipe','ignore'],windowsHide:true}).trim();
 }catch{}
 return '';
}
function atomic(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});const tmp=file+'.tmp';fs.writeFileSync(tmp,JSON.stringify(value),{mode:0o600});fs.renameSync(tmp,file);}
function createSync({root=__dirname,fetchImpl=fetch,credential=token,stateDir=path.join(root,'.workspace-sync')}={}){
 let active=false,stopped=false,timer=null,backoff=30000,secret,etag=null;
 const fingerprints=new Map(),hashes=new Map(),skippedVersions=new Map();
 const statusFile=path.join(stateDir,'status.json');
 const request=async(route,options={})=>{
  secret=secret||credential();if(!secret)throw new Error('Workspace sync credential is not configured');
  const r=await fetchImpl(SITE+route,{...options,redirect:'error',signal:AbortSignal.timeout(30000),headers:{'OAI-Sites-Authorization':'Bearer '+secret,Authorization:'Bearer '+secret,...(options.body?{'Content-Type':'application/json'}:{}),...options.headers}});
  if(r.status===304)return null;
  if(!r.headers?.get('content-type')?.includes('application/json') && r.headers)throw new Error('Workspace returned a non-JSON response ('+r.status+'); check site access');
  const data=await r.json();if(!r.ok||!data.ok){if(r.status===401||r.status===403)secret=null;throw Object.assign(new Error(data.error||'Workspace sync failed'),{status:r.status,stale:data.stale,conflict:data.conflict});}return data;
 };
 async function state(changes){return request('/api/state',changes?{method:'PATCH',body:JSON.stringify({changes})}:{});}
 async function syncOnce(){
  if(active)return {busy:true};active=true;
  try{
   const manifest=await request('/api/progress');let uploaded=0;const skipped=[];
   for(const [file,global] of Object.entries(FILES)){
    const full=path.join(root,file);if(!fs.existsSync(full))continue;
    const stat=fs.statSync(full),fingerprint=stat.mtimeMs+':'+stat.size;
    const cached=hashes.get(file);
    if(skippedVersions.get(file)===fingerprint+':'+manifest.files[file]?.hash){skipped.push(file+': cloud is newer');continue;}
    if(fingerprints.get(file)===fingerprint&&cached===manifest.files[file]?.hash)continue;
    if(stat.size>12*1024*1024){skipped.push(file+': oversized');continue;}
    let data;try{data=parseData(fs.readFileSync(full,'utf8'),global);}catch{skipped.push(file+': invalid data');continue;}
    const hash=crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
    if(hash===manifest.files[file]?.hash){fingerprints.set(file,fingerprint);hashes.set(file,hash);continue;}
    try{const result=await request('/api/progress/'+file,{method:'PUT',body:JSON.stringify({baseHash:manifest.files[file]?.hash||null,data})});hashes.set(file,result.hash);fingerprints.set(file,fingerprint);uploaded++;}
    catch(e){if(e.stale){skippedVersions.set(file,fingerprint+':'+manifest.files[file]?.hash);skipped.push(file+': cloud is newer');continue;}throw e;}
   }
   const remote=await state();atomic(path.join(stateDir,'cloud-state.json'),remote);
   const result={ok:true,site:SITE,lastSyncedAt:new Date().toISOString(),uploaded,skipped,revision:remote.revision};atomic(statusFile,result);backoff=30000;return result;
  }catch(e){const result={ok:false,site:SITE,checkedAt:new Date().toISOString(),error:e.message};atomic(statusFile,result);backoff=Math.min(backoff*2,300000);throw e;}
  finally{active=false;}
 }
 function start(){stopped=false;const tick=async()=>{try{await syncOnce();}catch(e){console.error('Workspace sync:',e.message);}if(!stopped)timer=setTimeout(tick,backoff);};tick();}
 function stop(){stopped=true;clearTimeout(timer);}
 return {state,syncOnce,start,stop,configured:()=>Boolean(credential())};
}
module.exports={SITE,FILES,parseData,createSync};
if(require.main===module){const sync=createSync({root:process.argv.slice(2).find(arg=>!arg.startsWith('--'))||__dirname});if(process.argv.includes('--once'))sync.syncOnce().then(r=>console.log(JSON.stringify(r))).catch(e=>{console.error(e.message);process.exitCode=1;});else {sync.start();for(const event of ['SIGTERM','SIGINT'])process.on(event,()=>{sync.stop();process.exit(0);});}}
