(function(){
 'use strict';
 const stateApi=window.customerDev?.workspaceState || (location.hostname==='127.0.0.1'||location.hostname==='localhost' ? async changes=>{
  const r=await fetch('/api/workspace-state',changes?{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({changes})}:{});return r.json();
 }:null);
 if(!stateApi)return;
 const keys=['customer_development_status_changes_v1','customer_development_activity_changes_v1'];
 const baseKey='workspace_sync_base_v1';let base={},running=false,failed=false,timer;
 try{base=JSON.parse(localStorage.getItem(baseKey)||'{}');}catch{}
 const label=document.createElement('div');label.id='workspace-sync-status';label.style.cssText='position:fixed;bottom:12px;right:12px;padding:8px 12px;background:#17283c;color:white;z-index:9999;font:13px sans-serif;border-radius:6px';document.body.append(label);
 async function sync(){
  if(running||failed)return;running=true;
  const snapshot=Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)]));
  const changes=keys.filter(k=>snapshot[k]!==null&&snapshot[k]!==base[k]).map(key=>({key,base:base[key]??null,value:snapshot[key]}));
  try{
   const result=await stateApi(changes.length?changes:null);
   if(!result.ok)throw Object.assign(new Error(result.error||'同步失败'),{conflict:result.conflict});
   let remoteChanged=false;
   for(const key of keys){
    const value=result.values[key]??null;
    if(localStorage.getItem(key)===snapshot[key]){
     remoteChanged ||= value!==snapshot[key];
     if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);
    }
    base[key]=value;
   }
   localStorage.setItem(baseKey,JSON.stringify(base));label.textContent='已同步客户进度 · '+new Date().toLocaleTimeString('zh-CN');
   if(remoteChanged){label.textContent+=' · 刷新查看更新';label.onclick=()=>location.reload();}
  }catch(e){failed=Boolean(e.conflict);label.textContent=e.message+(failed?'（本地修改已保留）':' · 将自动重试');}
  finally{running=false;}
 }
 const originalSet=Storage.prototype.setItem;
 Storage.prototype.setItem=function(key,value){originalSet.call(this,key,value);if(this===localStorage&&keys.includes(key)){clearTimeout(timer);timer=setTimeout(sync,800);}};
 setInterval(()=>{if(!document.hidden)sync();},30000);window.addEventListener('online',sync);sync();
}());
