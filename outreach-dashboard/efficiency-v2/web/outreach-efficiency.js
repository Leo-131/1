(function(root) {
  'use strict';
  // Preserve Array.find's first-source precedence without rescanning every row.
  function researchIndex(rows) {
    const byId = new Map();
    for (let position = 0; position < rows.length; position++) {
      const row = rows[position];
      if (row?.taskId && !byId.has(row.taskId)) byId.set(row.taskId, {row, position});
    }
    return byId;
  }
  function researchFor(record, index) {
    let first;
    for (const id of [record.taskId, record.id, record.automationTaskId]) {
      const match = index.get(id);
      if (match && (!first || match.position < first.position)) first = match;
    }
    return first?.row;
  }
  function modelClient(fetcher, now = Date.now) {
    const cache = new Map(), pending = new Map();
    const ttl = 3600000;
    function generate(task, publicFacts) {
      const key = JSON.stringify([task, publicFacts]);
      for (const [id, value] of cache) if (value.expires <= now()) cache.delete(id);
      const cached = cache.get(key);
      if (cached) return Promise.resolve({...cached.result, cached:true,
        usage:{prompt_tokens:0,completion_tokens:0,total_tokens:0}});
      if (pending.has(key)) return pending.get(key);
      const promise = (async () => {
        const response = await fetcher('/api/models', {method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({task,publicFacts,publicDataConfirmed:true}),
          signal:AbortSignal.timeout(25000)});
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.error || '模型请求失败');
        // Never cache failed, incomplete, or execution-authorizing responses.
        if (result.requiresReview !== true || result.sendPerformed !== false) throw new Error('Invalid advisory response');
        cache.set(key, {result, expires:now()+ttl});
        while (cache.size > 100) cache.delete(cache.keys().next().value);
        return result;
      })().finally(() => pending.delete(key));
      pending.set(key, promise);
      return promise;
    }
    return {generate};
  }
  // Planning is not sending. A source failure stays parked until evidence changes.
  function researchBatch(candidates, {keys, blocked, research = [], limit = 100}) {
    const seen = new Set(), cached = new Map(), rows = [], counts = {historical:0,duplicate:0,parked:0};
    const parked = new Set(['excluded','source_failed','evidence_insufficient','parked','identity_mismatch']);
    const outcomeBlocks = new Set(['sent_confirmed','submitted_confirmed','send_unconfirmed',
      'send_clicked_outcome_unknown_do_not_resend','outcome_pending','replied','bounced']);
    const statuses = row => [row.researchStatus,row.status,row.sendStatus,row.automationStatus].filter(Boolean);
    const sources = row => new Set((row.evidenceSources || []).filter(url =>
      typeof url === 'string' && /^https?:\/\//i.test(url)));
    function newEvidence(row, previous) {
      if (!row.evidenceRevision || row.evidenceRevision === previous.evidenceRevision) return false;
      const old = sources(previous);
      return [...sources(row)].some(url => !old.has(url));
    }
    // Retain every alias match. A later clean row cannot erase a group failure.
    for (const row of research) {
      if (!row) continue;
      for (const key of keys(row).filter(Boolean)) {
        if (!cached.has(key)) cached.set(key,new Set());
        cached.get(key).add(row);
      }
    }
    for (const row of candidates) {
      if (!row) continue;
      const identity = keys(row).filter(Boolean);
      if (!identity.length) continue;
      const previous = new Set(identity.flatMap(key => [...(cached.get(key) || [])]));
      if (blocked(row) || statuses(row).some(status => outcomeBlocks.has(status)) ||
          [...previous].some(item => statuses(item).some(status => outcomeBlocks.has(status)))) {
        counts.historical++;continue;
      }
      if (identity.some(key=>seen.has(key))) {counts.duplicate++;continue;}
      if (statuses(row).some(status => parked.has(status)) || [...previous].some(item =>
          statuses(item).some(status => parked.has(status)) && !newEvidence(row,item))) {
        counts.parked++;continue;
      }
      identity.forEach(key=>seen.add(key));rows.push(row);
      if (rows.length >= Math.min(100,Math.max(1,Number(limit)||100))) break;
    }
    return {rows,counts,sendPerformed:false,requiresLiveVerification:true};
  }
  root.OutreachEfficiency = {researchIndex, researchFor, modelClient, researchBatch};
})(typeof window !== 'undefined' ? window : globalThis);
