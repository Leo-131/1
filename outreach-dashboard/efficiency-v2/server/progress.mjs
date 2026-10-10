export const progressFiles={
 'public/outreach_data.json':'OUTREACH_SHEET_DATA',
 'daily-automation-latest.js':'DAILY_AUTOMATION_LATEST',
 'daily-automation-execution-latest.js':'DAILY_AUTOMATION_EXECUTION_LATEST',
 'google-lead-discovery-latest.js':'GOOGLE_LEAD_DISCOVERY_LATEST',
 'autonomous-outreach-results.js':'AUTONOMOUS_OUTREACH_RESULTS',
 'outreach-intelligence-latest.js':'OUTREACH_INTELLIGENCE_LATEST',
 'system-visibility-latest.js':'SYSTEM_VISIBILITY_LATEST',
 'system-readiness-latest.js':'SystemReadinessData',
 'github-sync/latest-status.js':'GITHUB_SYNC_LATEST'
};
export async function digest(text){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text))),b=>b.toString(16).padStart(2,'0')).join('');}
export function latestDate(data){
 let latest=0;const visit=v=>{if(!v||typeof v!=='object')return;for(const [key,value] of Object.entries(v)){
  if(typeof value==='string'&&/^(generatedAt|timestamp|updatedAt|sentAt|repliedAt|resultCheckedAt|last_run)$/.test(key)){const n=Date.parse(value);if(Number.isFinite(n))latest=Math.max(latest,n);}
  else if(value&&typeof value==='object')visit(value);
 }};visit(data);return latest?new Date(latest).toISOString():null;
}
export async function progressManifest(env,request){
 const row=await env.DB.prepare('SELECT value, revision FROM dashboard_state WHERE id = ?').bind('progress-manifest').first();
 const base=await env.ASSETS.fetch(new Request(new URL('/progress-baseline.json',request.url)));
 const baseline=base.ok?await base.json():{};
 return {revision:row?.revision||0,files:{...baseline,...(row?JSON.parse(row.value):{})},overrides:row?JSON.parse(row.value):{}};
}
export async function progressRoute(request,env,json,user){
 const url=new URL(request.url),file=decodeURIComponent(url.pathname.slice('/api/progress/'.length));
 if(url.pathname==='/api/progress'){
  if(request.method!=='GET')return json({ok:false,error:'Method not allowed'},405);
  const m=await progressManifest(env,request);return json({ok:true,revision:m.revision,files:m.files});
 }
 if(!Object.hasOwn(progressFiles,file))return json({ok:false,error:'Unknown progress source'},404);
 const m=await progressManifest(env,request),current=m.files[file];
 if(request.method==='GET'){
  if(!m.overrides[file])return json({ok:true,baseline:true,hash:current?.hash});
  const stored=await env.BUCKET.get('progress/'+m.overrides[file].hash);
  if(!stored)return json({ok:false,error:'Progress storage unavailable'},503);
  return new Response(stored.body,{headers:{'Content-Type':'application/json','Cache-Control':'private, no-cache','ETag':'"'+m.overrides[file].hash+'"'}});
 }
 if(request.method!=='PUT')return json({ok:false,error:'Method not allowed'},405);
 if(!env.BUCKET)return json({ok:false,error:'Progress storage unavailable'},503);
 const body=await readLimited(request,12*1024*1024);
 let payload;try{payload=JSON.parse(body);}catch{return json({ok:false,error:'Invalid JSON'},400);}
 if(!payload.data||typeof payload.data!=='object')return json({ok:false,error:'Progress must be JSON data'},400);
 const serialized=JSON.stringify(payload.data),hash=await digest(serialized),date=latestDate(payload.data);
 if(current?.hash===hash)return json({ok:true,unchanged:true,hash});
 if(payload.baseHash!==(current?.hash||null))return json({ok:false,conflict:true,error:'进度来源已更新，请重新同步。'},409);
 if(current?.date&&(!date||date<current.date))return json({ok:false,stale:true,error:'已保留云端较新的进度，未用旧数据覆盖。'},409);
 const entry={hash,date,syncedAt:new Date().toISOString(),source:'desktop'};
 // Immutable content first; only publish its pointer after successful persistence.
 await env.BUCKET.put('progress/'+hash,JSON.stringify({ok:true,data:payload.data,...entry}),{httpMetadata:{contentType:'application/json'}});
 for(let i=0;i<3;i++){
  const fresh=i?await progressManifest(env,request):m;
  if(fresh.files[file]?.hash!==current?.hash)return json({ok:false,conflict:true,error:'Progress changed during upload'},409);
  const value=JSON.stringify({...fresh.overrides,[file]:entry});
  const result=fresh.revision===0
   ?await env.DB.prepare('INSERT OR IGNORE INTO dashboard_state (id,value,revision,updated_at,updated_by) VALUES (?,?,1,?,?)').bind('progress-manifest',value,entry.syncedAt,user).run()
   :await env.DB.prepare('UPDATE dashboard_state SET value = ?, revision = revision + 1, updated_at = ?, updated_by = ? WHERE id = ? AND revision = ?').bind(value,entry.syncedAt,user,'progress-manifest',fresh.revision).run();
  if(result.meta?.changes)return json({ok:true,...entry});
 }
 return json({ok:false,conflict:true,error:'Progress is busy; retry later'},409);
}
export async function readLimited(request,limit){
 if(Number(request.headers.get('content-length'))>limit)throw Object.assign(new Error('Too large'),{status:413});
 const reader=request.body?.getReader();if(!reader)return '';
 let size=0;const parts=[];
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw Object.assign(new Error('Too large'),{status:413});}parts.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const p of parts){bytes.set(p,offset);offset+=p.length;}return new TextDecoder().decode(bytes);
}
