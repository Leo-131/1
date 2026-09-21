(function(){
  'use strict';
  const translations={
    '汇报中心':'Reports','销售资料':'Sales materials','开发工作台':'Workspace','今日队列':'Today’s queue','客户附表':'Customers','客户分析':'Customer analysis','SEO 趋势':'SEO trends','模板实验':'Template experiments','自动化审计':'Automation audit','系统设置':'Settings',
    '保存线上修改':'Save changes','刷新线上状态':'Refresh cloud data','导出未保存修改':'Export unsaved changes','私有在线工作台':'Private workspace','客户开发中心暂未加载':'Customer workspace could not load','重新加载':'Reload',
    '按自然周和自然月复盘客户开发结果，仅统计有时间证据的真实事件':'Review customer development by calendar week or month. Only timestamped, evidenced events are counted.',
    '导出 CSV':'Export CSV','打印/PDF':'Print / PDF','周报':'Weekly','月报':'Monthly','周期总结与数据归因':'Period summary and attribution','由转化数据和操作日志自动生成':'Generated from conversion data and activity logs','已采纳并生效':'Adopted and active','下一阶段系统操作':'Next actions',
    '发现客户':'Prospects discovered','平均 ICP 评分':'Average ICP score','自动决策':'Automated decisions','确认发送':'Confirmed sends','收到回复':'Replies received','获得联系方式':'Contact details captured','成交机会':'Opportunities','自动跳过':'Automatically skipped','转化漏斗':'Conversion funnel','回复证据分类':'Reply evidence','自动回复会进入总回复数，但不会冒充人工采购意向':'Automatic replies count toward total replies but are not treated as human buying intent.',
    'Codex 全自动决策与执行，GLM 优化画像与文案；仅重大 bug 暂停通知':'Codex decisions and execution, with GLM assistance for profiles and copy; major errors pause execution.',
    '今日已开发':'Developed today','今日待开发':'Pending today','可自动触达':'Eligible for outreach','候选客户池':'Prospect pool','今日已开发客户':'Customers developed today','销售系统就绪度':'Sales system readiness','统一CRM与转化行动队列':'CRM and conversion actions','优先企业':'Priority accounts','CRM阶段':'CRM stage','可用渠道':'Available channels','建议动作':'Suggested action','Email运营漏斗':'Email funnel','任务明细':'Task details',
    '客户':'Customer','国家':'Country','当前任务':'Current task','为什么没有自动发送':'Why it was not sent automatically','入口':'Open','短期不重复 / 冷却中':'Deduplication / cooldown','状态':'Status','最近触达':'Last contact','规则':'Rules','当前客户':'Current customer','暂无待开发客户':'No customers awaiting outreach','打开客户主页':'Open customer profile','接下来':'Up next','关键词':'Keyword','ICP分':'ICP score','区域':'Region','操作':'Actions',
    '默认只显示未触达且身份校验通过的新客户，历史客户单独跟进':'New prospects with verified identities and no previous contact are shown by default. Existing contacts have a separate follow-up queue.',
    '可自动开发':'Eligible for outreach','执行子集':'Execution subset','跟进中':'Following up','短期不重复':'In cooldown','全部任务':'All tasks','北美代理储备':'North American agency prospects',
    '全部平台':'All platforms','全部状态':'All statuses','可重试':'Retry available','全部国家':'All countries','全部行业':'All industries','全部来源':'All sources','全部触达状态':'All contact states','未触达':'Not contacted','已触达':'Contacted','已获取联系方式':'Contact details captured','需跟进':'Follow-up needed','全部触达时间':'All contact dates','无触达时间':'No contact date','最近 7 天':'Last 7 days','最近 30 天':'Last 30 days','最近 90 天':'Last 90 days','自定义日期':'Custom range','最近更新':'Last updated','成交概率':'Deal probability','ICP 分数':'ICP score','市场分数':'Market score','公司':'Company','筛选':'Filter','重置筛选':'Reset filters','姓名':'Name','职位':'Role','平台':'Platform','可建联 Email':'Contact email','最近真实触达':'Last verified contact',
    '总览':'Overview','画像':'Profile','体量':'Scale','渠道':'Channel','客户总量':'Total customers','高 ICP':'High ICP','可联系客户':'Contactable customers','社媒客户':'Social prospects','客户状态结构':'Customer status distribution','占比、均分、高 ICP 数量按当前客户池实时计算':'Shares, average scores and high-ICP counts are calculated from the current customer pool.','客户画像':'Customer profiles','国家占比':'Country distribution','客户体量':'Customer scale','平台渠道':'Platform channels','高价值客户拆解':'High-value customer analysis','按成交概率、ICP、国家优先级与联系方式综合排序':'Ranked by deal probability, ICP, country priority and available contact details.','综合分':'Overall score','可联系性':'Contactability',
    '按最新 Google/队列客户生成关键词与国家热度，并提供逐国家 Google Trends 核验入口':'Keywords and country activity are derived from the latest discovery and queue data, with country-specific Google Trends links.','真实关键词漏斗':'Observed keyword funnel','仅统计已确认发送后的回复，不用预测值冒充结果':'Only replies following confirmed sends are counted. Forecasts are not presented as actual results.','全球国家热度矩阵':'Country activity matrix','基于最新队列客户数、国家、ICP、渠道和联系方式；趋势链接按国家打开 Google Trends':'Based on queue size, country, ICP, channels and contact details. Trend links open the selected country in Google Trends.','本地开发热度':'Outreach activity score','客户 / 渠道':'Customers / channels','代表客户':'Example customers','国家趋势核验':'Country trend verification','高转化关键词机会池':'Keyword opportunities','实测词优先，推荐词必须落到国家/客户热度后再执行':'Observed keywords take priority. Validate suggested keywords against country and customer demand before use.','意图':'Intent','目标客户':'Target customers','证据':'Evidence','优先级':'Priority','趋势核验':'Verify trends',
    '只以发送确认记录计算回复率和联系方式获取率':'Reply and contact-capture rates use confirmed send records only.','模板':'Template','样本':'Sample','回复':'Replies','回复率':'Reply rate','联系方式率':'Contact-capture rate','机会率':'Opportunity rate','Codex 决策与 Codex Chrome Extension 执行证据留档，GLM 仅作为辅助模型':'Codex decisions and Chrome Extension execution evidence are retained. GLM is an assistive model only.','时间':'Time','任务':'Task','阶段':'Stage','代理':'Agent','结果':'Result','安全门为只读，不允许自动优化降低标准':'Safety requirements are read-only and cannot be weakened by automatic optimization.','沿用已批准的 FLEXTAIL 资料链接':'Approved FLEXTAIL sales materials',
    '上线查看 · 未连接发信执行器':'Online view · Sending executor not connected','在线查看 · 未连接发信执行器':'Online view · Sending executor not connected','正在检查进度同步状态…':'Checking synchronization…','云端修改自动保存；等待本地系统首次上传。':'Cloud edits save automatically. Waiting for the first desktop upload.','浏览器自动发信、GLM、OKKI 未连接；已连接的本地系统会自动上传新进度；网站修改自动保存并回传。':'Sending, GLM and OKKI are not connected in this browser. Connected desktops upload new progress; website edits save automatically and sync back.',
    '云端状态已加载':'Cloud data loaded','有待同步修改':'Changes awaiting sync','有待保存修改':'Unsaved changes','正在保存…':'Saving…','正在同步…':'Syncing…','已保存到线上':'Saved to cloud','另一端有新进度，完成输入后将自动刷新':'Updates are available from another device. The page will refresh after you finish typing.','本地进度最近同步：':'Latest desktop upload: ','（北京时间）':' (China Standard Time)','上一页':'Previous','下一页':'Next','没有匹配客户，请重置或调整筛选条件':'No matching customers. Reset or adjust your filters.','搜索姓名、公司、职位...':'Search name, company or role…','最近触达开始日期':'Contact date: from','最近触达结束日期':'Contact date: to',
    'ICP 分值算法':'ICP scoring model','画像已评分':'Profile scored','账号已核验':'Account verified','已点赞':'Liked','已关注':'Followed','重大异常暂停':'Paused: critical exception','自动决策通过':'Decision approved','发送已确认':'Send confirmed','等待回复':'Awaiting reply','已排期':'Scheduled','已换渠道':'Channel changed','发送未确认':'Send unconfirmed','待建档':'Not yet profiled','尚未确认发送':'Send not yet confirmed','待触达':'Awaiting outreach','已建联':'Connected','待跟进':'Follow-up pending','待执行':'Pending execution','已完成':'Completed','当前阶段':'Current stage','待核验':'Needs verification','无真实触达时间':'No verified contact time','联系方式待核验':'Contact details need verification','暂无已验证关键词数据':'No verified keyword data yet','暂无数据':'No data yet','本期无记录':'No records in this period',
    '暂无触达记录，可作为新客户候选；若已合作或已触达，请在客户状态中标记，系统会自动排除今日新开发。':'No contact history. Mark existing relationships or previous outreach in customer status so they are excluded from new prospecting.',
    '客户背调明细':'Customer research','触达时间线':'Contact timeline','客户评分模型':'Customer scoring model','模块':'Module','字段':'Field','当前值':'Current value','说明':'Notes','维度':'Dimension','权重':'Weight','100 分制，90+ 为战略客户':'100-point scale; 90+ indicates strategic priority','销售推进阶段与 KPI':'Sales stages and KPIs','销售总监视角的目标看板':'Sales management targets',
    'Codex 决策':'Codex decision','公司及集团永久去重':'Permanent company/group deduplication','公司及集团永久去重；未知发送结果禁止重发':'Company/group deduplication; do not resend when the previous outcome is unknown','线上数据与分析':'Online data and analytics','发信：需已验证的桌面执行器':'Sending requires a verified desktop executor',
    '销售自动化规则':'Sales automation rules','真实事件':'Verified events','人工回复':'Human replies','自动回复':'Automatic replies','未知回复类型':'Unknown reply type','资料索取':'Material requests','已拒绝':'Declined','未开发':'Not developed','已开发':'Developed','已回复':'Replied','已发送':'Sent','失败':'Failed','未知':'Unknown','重点':'Priority','开放':'Open','独代占用':'Exclusive agency market','无':'None','是':'Yes','否':'No'
  };
  const originalEnglish={'Customer Development':'客户开发中心','Customer Automated Development System':'客户自动开发系统','Sales Intelligence Dossier':'销售情报档案','Verified Channel Matrix':'已核验渠道','Sales-ready customer facts, opportunity, risk, and next action':'客户事实、机会、风险与下一步行动','Broken social links are marked for reroute instead of blind retry':'失效链接会标记为更换渠道，不盲目重试','Verified channel':'已核验渠道','Global Customer Analysis Dashboard V3.0':'全球客户分析看板 V3.0','CRM Pipeline':'CRM 销售流程','Dashboard KPI':'看板 KPI'};
  const originals=new WeakMap(),attributes=new WeakMap();let language='zh-CN',observer;
  try{language=localStorage.getItem('flextail_language')==='en'?'en':'zh-CN';}catch{}
  const sorted=Object.keys(translations).sort((a,b)=>b.length-a.length);
  function translate(text){
    const trimmed=text.trim();if(!trimmed)return text;
    if(language==='zh-CN')return originalEnglish[trimmed]?text.replace(trimmed,originalEnglish[trimmed]):text;
    if(!/[\u4e00-\u9fff]/.test(trimmed))return text;
    let value=translations[trimmed];
    if(!value){
      value=trimmed
        .replace(/^第 (\d+) \/ (\d+) 页 · 共 (\d+) 条$/,'Page $1 / $2 · $3 records')
        .replace(/^18\.4 筛选模式 · (\d+) \/ (\d+) 条$/,'Filtered customers · $1 / $2 records')
        .replace(/^专业客户结构拆解 · (\d+) 条客户 · (\d+) 条高 ICP$/,'Customer analysis · $1 customers · $2 high-ICP prospects')
        .replace(/^执行时间 /,'Executed at ');
      for(const source of sorted)if(value.includes(source))value=value.split(source).join(translations[source]);
    }
    return text.replace(trimmed,value);
  }
  function skip(element){return !element||element.closest('script,style,textarea,code,pre,[data-language-control],.cc-evidence-cell,.cc-timeline p,.hosted-materials a')||element.closest('td')&&!element.closest('.cc-chip');}
  function apply(root=document.body){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
    while((node=walker.nextNode())){
      if(skip(node.parentElement))continue;
      const current=node.nodeValue,remembered=originals.get(node);
      const source=remembered&&current===remembered.translated?remembered.source:current;
      const translated=translate(source);originals.set(node,{source,translated});if(current!==translated)node.nodeValue=translated;
    }
    for(const element of root.querySelectorAll('[placeholder],[title],[aria-label]')){
      if(skip(element))continue;const values=attributes.get(element)||{};
      for(const attr of ['placeholder','title','aria-label'])if(element.hasAttribute(attr)){
        if(!values[attr])values[attr]=element.getAttribute(attr);element.setAttribute(attr,translate(values[attr]));
      }attributes.set(element,values);
    }
    document.documentElement.lang=language;document.title=language==='en'?'FLEXTAIL · Customer Development':'FLEXTAIL · 客户开发中心';
    const control=document.getElementById('workspace-language');if(control)control.value=language;
    observer?.takeRecords();
  }
  function install(){
    const existing=document.getElementById('workspace-language');
    if(existing){const sidebar=document.querySelector('.cc-sidebar');if(sidebar&&existing.parentElement.parentElement!==sidebar)sidebar.append(existing.parentElement);return;}
    const bar=document.createElement('label');bar.className='workspace-language-control';bar.dataset.languageControl='1';
    bar.innerHTML='<span>语言 / Language</span><select id="workspace-language" aria-label="语言 / Language"><option value="zh-CN">简体中文</option><option value="en">English</option></select>';
    const mount=document.querySelector('.cc-sidebar')||document.body;mount.append(bar);
    const select=bar.querySelector('select');select.value=language;select.onchange=()=>{language=select.value;try{localStorage.setItem('flextail_language',language);}catch{}apply();};
  }
  function start(){install();apply();observer=new MutationObserver(records=>{
    install();const roots=new Set();for(const record of records){
      const nodes=record.type==='characterData'?[record.target.parentElement]:[...record.addedNodes].map(node=>node.nodeType===1?node:node.parentElement);
      for(const root of nodes)if(root?.nodeType===1&&!skip(root))roots.add(root);
    }
    for(const root of roots)apply(root);
  });observer.observe(document.body,{subtree:true,childList:true,characterData:true});}
  window.FlextailI18n={setLanguage(value){language=value==='en'?'en':'zh-CN';try{localStorage.setItem('flextail_language',language);}catch{}apply();},translate};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
}());
