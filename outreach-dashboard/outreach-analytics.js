(function exposeOutreachAnalytics(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.OutreachAnalytics = api;
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function createOutreachAnalytics() {
  'use strict';

  const CONFIRMED_SEND = 'sent_confirmed';
  const DIRECTIONS = new Set(['rising', 'stable', 'falling', 'unknown']);
  const SHANGHAI_OFFSET_MS = 8 * 60 * 60 * 1000;
  const REPORT_EVENTS = [
    ['discovered', 'discoveredAt'],
    ['profiled', 'profiledAt'],
    ['approved', 'approvedAt'],
    ['sent', 'sentAt'],
    ['replied', 'repliedAt'],
    ['contactCaptured', 'contactCapturedAt'],
    ['opportunity', 'opportunityAt'],
    ['autoSkipped', 'autoSkippedAt'],
  ];
  const HIGH_INTENT_KEYWORDS = [
    ['camping gear wholesale', 'transactional', 96, 'Wholesale buyers'],
    ['outdoor gear distributor', 'transactional', 95, 'Distributors'],
    ['private label camping equipment', 'transactional', 94, 'OEM / private label'],
    ['portable air pump distributor', 'transactional', 93, 'Product distributors'],
    ['camping equipment importer', 'transactional', 92, 'Importers'],
    ['outdoor equipment dealer', 'transactional', 91, 'Dealers'],
    ['RV accessories distributor', 'transactional', 90, 'RV channel'],
    ['camping accessories wholesale', 'transactional', 90, 'Wholesale buyers'],
    ['OEM camping gear manufacturer', 'transactional', 89, 'OEM partners'],
    ['rechargeable camping lantern wholesale', 'transactional', 88, 'Lighting buyers'],
    ['ultralight camping gear supplier', 'transactional', 88, 'Specialty retail'],
    ['sporting goods distributor', 'transactional', 87, 'Sporting goods'],
    ['outdoor retail partnership', 'commercial', 86, 'Retail partnerships'],
    ['camping gear supplier for retailers', 'transactional', 86, 'Retail buyers'],
    ['outdoor products wholesale supplier', 'transactional', 85, 'Wholesale buyers'],
    ['camping equipment bulk order', 'transactional', 84, 'Volume buyers'],
    ['outdoor gear retail buyer', 'commercial', 83, 'Decision makers'],
    ['camping products sourcing', 'commercial', 82, 'Sourcing teams'],
  ];

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function safeRate(numerator, denominator) {
    if (!denominator) {
      return 0;
    }
    return Math.round((numerator / denominator) * 10000) / 10000;
  }

  function hasNumericValue(value) {
    return typeof value === 'number' && Number.isFinite(value);
  }

  function normalizeTrendRecord(record) {
    const source = record && typeof record === 'object' ? record : {};
    const region = typeof source.region === 'string' ? source.region : '';
    const period = typeof source.period === 'string' ? source.period : '';
    const collectedAt = typeof source.collectedAt === 'string' ? source.collectedAt : '';
    const numericIndex = Number(source.index);
    const complete = source.status === 'available'
      && region
      && period
      && collectedAt
      && hasNumericValue(source.index);

    if (!complete) {
      return {
        status: 'data_unavailable',
        region,
        period,
        collectedAt,
        index: null,
        direction: 'unknown',
      };
    }

    return {
      status: 'available',
      region,
      period,
      collectedAt,
      index: clamp(numericIndex, 0, 100),
      direction: DIRECTIONS.has(source.direction) ? source.direction : 'unknown',
    };
  }

  function isConfirmedSend(record) {
    return record.state === CONFIRMED_SEND
      || record.sendStatus === CONFIRMED_SEND
      || record.automationStatus === CONFIRMED_SEND;
  }

  function normalizeGroupKey(value, fallback) {
    return typeof value === 'string' && value.trim()
      ? value.trim().toLowerCase()
      : fallback;
  }

  function groupRecords(records, keySelector) {
    const groups = new Map();
    for (const item of Array.isArray(records) ? records : []) {
      const record = item && typeof item === 'object' ? item : {};
      const key = keySelector(record);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(record);
    }
    return groups;
  }

  function buildFunnel(records) {
    const funnel = {
      discovered: 0,
      profiled: 0,
      approved: 0,
      sent: 0,
      replied: 0,
      contactCaptured: 0,
      opportunity: 0,
    };

    for (const record of records) {
      if (record.discoveredAt) {
        funnel.discovered += 1;
      }
      if (record.profiledAt) {
        funnel.profiled += 1;
      }
      if (record.approvedAt) {
        funnel.approved += 1;
      }

      const confirmed = isConfirmedSend(record);
      if (!confirmed) {
        continue;
      }
      funnel.sent += 1;
      if (record.repliedAt) {
        funnel.replied += 1;
      }
      if (record.contactCapturedAt) {
        funnel.contactCaptured += 1;
      }
      if (record.opportunityAt) {
        funnel.opportunity += 1;
      }
    }

    return funnel;
  }

  function buildConversionRates(funnel) {
    const source = funnel || {};
    return {
      profileRate: safeRate(source.profiled, source.discovered),
      approvalRate: safeRate(source.approved, source.profiled),
      sendRate: safeRate(source.sent, source.approved),
      discoveryToSendRate: safeRate(source.sent, source.discovered),
      discoveryToReplyRate: safeRate(source.replied, source.discovered),
      replyRate: safeRate(source.replied, source.sent),
      contactCaptureRate: safeRate(source.contactCaptured, source.sent),
      opportunityRate: safeRate(source.opportunity, source.sent),
      replyToContactRate: safeRate(source.contactCaptured, source.replied),
      replyToOpportunityRate: safeRate(source.opportunity, source.replied),
    };
  }

  function buildKeywordMetrics(records) {
    const groups = groupRecords(
      records,
      record => normalizeGroupKey(record.keyword, 'unknown'),
    );

    return Array.from(groups, ([keyword, group]) => {
      const funnel = buildFunnel(group);
      return {
        keyword,
        sampleSize: group.length,
        funnel,
        rates: buildConversionRates(funnel),
      };
    });
  }

  function countryToTrendsGeo(records) {
    const aliases = {
      'united states': 'US', usa: 'US', us: 'US', '美国': 'US',
      'united kingdom': 'GB', uk: 'GB', '英国': 'GB',
      canada: 'CA', '加拿大': 'CA', germany: 'DE', '德国': 'DE',
      france: 'FR', '法国': 'FR', australia: 'AU', '澳大利亚': 'AU',
      japan: 'JP', '日本': 'JP', italy: 'IT', '意大利': 'IT',
      spain: 'ES', '西班牙': 'ES', netherlands: 'NL', '荷兰': 'NL',
    };
    const counts = new Map();
    for (const record of Array.isArray(records) ? records : []) {
      const raw = String(record && record.country || '').trim().toLowerCase();
      const geo = aliases[raw] || (/^[a-z]{2}$/i.test(raw) ? raw.toUpperCase() : '');
      if (geo) counts.set(geo, (counts.get(geo) || 0) + 1);
    }
    return Array.from(counts).sort((left, right) => right[1] - left[1])[0]?.[0] || 'US';
  }

  function buildTrendsUrl(keyword, geo) {
    const params = new URLSearchParams({
      date: 'today 12-m',
      geo: geo || 'US',
      q: keyword,
    });
    return `https://trends.google.com/trends/explore?${params.toString()}`;
  }

  function buildKeywordOpportunities(records, options) {
    const source = Array.isArray(records) ? records : [];
    const config = options && typeof options === 'object' ? options : {};
    const metrics = buildKeywordMetrics(source);
    const observed = new Map(metrics.map(item => [item.keyword, item]));
    const geo = String(config.geo || countryToTrendsGeo(source)).toUpperCase();
    const catalog = HIGH_INTENT_KEYWORDS.map(([keyword, intent, baseScore, audience]) => ({
      keyword,
      intent,
      baseScore,
      audience,
    }));

    for (const item of metrics) {
      if (!catalog.some(entry => entry.keyword.toLowerCase() === item.keyword)) {
        catalog.push({
          keyword: item.keyword,
          intent: /\b(wholesale|distributor|supplier|importer|dealer|bulk|oem)\b/i.test(item.keyword)
            ? 'transactional'
            : 'commercial',
          baseScore: 78,
          audience: 'Observed audience',
        });
      }
    }

    return catalog.map(entry => {
      const metric = observed.get(entry.keyword.toLowerCase());
      const sampleSize = metric ? metric.sampleSize : 0;
      const replyRate = metric ? metric.rates.replyRate : null;
      const contactCaptureRate = metric ? metric.rates.contactCaptureRate : null;
      const opportunityRate = metric ? metric.rates.opportunityRate : null;
      const evidenceLift = metric
        ? Math.min(14, sampleSize * 2)
          + Math.round(replyRate * 12)
          + Math.round(contactCaptureRate * 10)
          + Math.round(opportunityRate * 12)
        : 0;
      return {
        keyword: entry.keyword,
        intent: entry.intent,
        audience: entry.audience,
        source: metric ? 'observed' : 'recommended',
        sampleSize,
        replyRate,
        contactCaptureRate,
        opportunityRate,
        priorityScore: clamp(entry.baseScore + evidenceLift, 0, 100),
        geo,
        trendsUrl: buildTrendsUrl(entry.keyword, geo),
      };
    }).sort((left, right) => {
      if (left.source !== right.source) return left.source === 'observed' ? -1 : 1;
      return right.priorityScore - left.priorityScore
        || right.sampleSize - left.sampleSize
        || left.keyword.localeCompare(right.keyword);
    });
  }

  function buildTemplateMetrics(records) {
    const groups = groupRecords(
      records,
      record => normalizeGroupKey(record.templateId, 'unknown'),
    );

    return Array.from(groups, ([templateId, group]) => {
      const confirmed = group.filter(isConfirmedSend);
      const replies = confirmed.filter(record => record.repliedAt).length;
      const contactsCaptured = confirmed.filter(record => record.contactCapturedAt).length;
      const opportunities = confirmed.filter(record => record.opportunityAt).length;

      return {
        templateId,
        sampleSize: group.length,
        confirmedSends: confirmed.length,
        replies,
        contactsCaptured,
        opportunities,
        replyRate: safeRate(replies, confirmed.length),
        contactCaptureRate: safeRate(contactsCaptured, confirmed.length),
        opportunityRate: safeRate(opportunities, confirmed.length),
      };
    });
  }

  function buildReplyConversionInsights(breakdowns) {
    const source = breakdowns && typeof breakdowns === 'object' ? breakdowns : {};
    const dimensions = ['platform', 'countryMarket', 'keyword', 'template', 'icpTier'];
    const items = [];
    for (const dimension of dimensions) {
      for (const item of source[dimension] || []) {
        const sent = Number(item.metrics && item.metrics.sent || 0);
        if (!sent) continue;
        items.push({
          dimension,
          label: item.label,
          sent,
          replied: Number(item.metrics.replied || 0),
          contactCaptured: Number(item.metrics.contactCaptured || 0),
          opportunity: Number(item.metrics.opportunity || 0),
          rates: item.rates,
          confidence: sent >= 10 ? 'strong' : sent >= 3 ? 'directional' : 'low_sample',
        });
      }
    }
    const ranked = items.slice().sort((left, right) =>
      Number(right.rates.replyRate || 0) - Number(left.rates.replyRate || 0)
      || right.replied - left.replied
      || right.sent - left.sent
      || left.label.localeCompare(right.label));
    const underperforming = items
      .filter(item => item.sent >= 3 && Number(item.rates.replyRate || 0) < 0.05)
      .sort((left, right) => right.sent - left.sent || left.label.localeCompare(right.label));
    return {
      topReplySegments: ranked.slice(0, 8),
      underperformingSegments: underperforming.slice(0, 8),
    };
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function localDateParts(value) {
    const dateOnly = typeof value === 'string'
      ? value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
      : null;
    if (dateOnly) {
      return {
        year: Number(dateOnly[1]),
        month: Number(dateOnly[2]),
        day: Number(dateOnly[3]),
      };
    }

    const parsed = new Date(value || Date.now());
    const valid = Number.isFinite(parsed.getTime()) ? parsed : new Date();
    const shifted = new Date(valid.getTime() + SHANGHAI_OFFSET_MS);
    return {
      year: shifted.getUTCFullYear(),
      month: shifted.getUTCMonth() + 1,
      day: shifted.getUTCDate(),
    };
  }

  function formatLocalDate(year, month, day) {
    return `${year}-${pad(month)}-${pad(day)}`;
  }

  function localDayFromTimestamp(timestamp) {
    const shifted = new Date(timestamp + SHANGHAI_OFFSET_MS);
    return formatLocalDate(
      shifted.getUTCFullYear(),
      shifted.getUTCMonth() + 1,
      shifted.getUTCDate(),
    );
  }

  function getNaturalPeriod(type, anchor) {
    const reportType = type === 'monthly' ? 'monthly' : 'weekly';
    const parts = localDateParts(anchor);
    const localMidnight = Date.UTC(parts.year, parts.month - 1, parts.day);
    let startLocal;
    let endLocal;

    if (reportType === 'monthly') {
      startLocal = Date.UTC(parts.year, parts.month - 1, 1);
      endLocal = Date.UTC(parts.year, parts.month, 1);
    } else {
      const day = new Date(localMidnight).getUTCDay();
      const daysSinceMonday = (day + 6) % 7;
      startLocal = localMidnight - (daysSinceMonday * 24 * 60 * 60 * 1000);
      endLocal = startLocal + (7 * 24 * 60 * 60 * 1000);
    }

    const start = startLocal - SHANGHAI_OFFSET_MS;
    const endExclusive = endLocal - SHANGHAI_OFFSET_MS;
    const startDay = localDayFromTimestamp(start);
    const finalDay = localDayFromTimestamp(endExclusive - 1);

    return {
      type: reportType,
      key: reportType === 'monthly' ? startDay.slice(0, 7) : startDay,
      label: reportType === 'monthly' ? startDay.slice(0, 7) : `${startDay} - ${finalDay}`,
      start: new Date(start).toISOString(),
      endExclusive: new Date(endExclusive).toISOString(),
      anchor: formatLocalDate(parts.year, parts.month, parts.day),
    };
  }

  function emptyReportMetrics() {
    return {
      discovered: 0,
      profiled: 0,
      approved: 0,
      sent: 0,
      replied: 0,
      contactCaptured: 0,
      opportunity: 0,
      autoSkipped: 0,
    };
  }

  function eventApplies(record, metric) {
    if (metric === 'discovered') return true;
    if (metric === 'profiled') return Boolean(record.profiledAt);
    if (metric === 'approved') return Boolean(record.approvedAt) || isConfirmedSend(record);
    if (metric === 'sent') return isConfirmedSend(record);
    if (metric === 'autoSkipped') return record.state === 'auto_skipped';
    return Boolean(record[REPORT_EVENTS.find(item => item[0] === metric)[1]]);
  }

  function buildPeriodReport(records, options) {
    const source = Array.isArray(records) ? records : [];
    const config = options && typeof options === 'object' ? options : {};
    const period = getNaturalPeriod(config.type, config.anchor);
    const start = Date.parse(period.start);
    const endExclusive = Date.parse(period.endExclusive);
    const metrics = emptyReportMetrics();
    const metricCustomers = new Map(REPORT_EVENTS.map(([metric]) => [metric, new Set()]));
    const dataQuality = { missingTimestamps: 0, invalidTimestamps: 0 };
    const evaluated = source.map((item, recordIndex) => {
      const record = item && typeof item === 'object' ? item : {};
      const events = {};
      const eventTimes = {};
      const eventEvidence = {};

      for (const [metric, field] of REPORT_EVENTS) {
        if ((metric === 'sent' || ['replied', 'contactCaptured', 'opportunity'].includes(metric))
          && !isConfirmedSend(record)) {
          events[metric] = false;
          continue;
        }

        const value = record[field];
        if (!value) {
          events[metric] = false;
          if (eventApplies(record, metric)) dataQuality.missingTimestamps += 1;
          continue;
        }

        const timestamp = Date.parse(value);
        if (!Number.isFinite(timestamp)) {
          events[metric] = false;
          dataQuality.invalidTimestamps += 1;
          continue;
        }

        events[metric] = timestamp >= start && timestamp < endExclusive;
        if (events[metric]) {
          eventTimes[metric] = value;
          eventEvidence[metric] = 'explicit';
        }
      }

      // A verified downstream event may establish operational eligibility, but
      // it never proves that a scored profile was actually materialized.
      // Keep profile scoring explicit so the dashboard cannot turn every send
      // into a fabricated profile event.
      const funnel = ['discovered', 'profiled', 'approved', 'sent', 'replied', 'contactCaptured', 'opportunity'];
      for (let downstreamIndex = funnel.length - 1; downstreamIndex > 0; downstreamIndex -= 1) {
        const downstream = funnel[downstreamIndex];
        if (!events[downstream]) continue;
        for (let upstreamIndex = 0; upstreamIndex < downstreamIndex; upstreamIndex += 1) {
          const upstream = funnel[upstreamIndex];
          if (upstream === 'profiled') continue;
          if (events[upstream]) continue;
          events[upstream] = true;
          eventTimes[upstream] = eventTimes[downstream];
          eventEvidence[upstream] = `inferred_from_${downstream}`;
        }
      }

      const customerKey = normalizeGroupKey(record.company || record.name || record.taskId || record.id || `record-${recordIndex}`, `record-${recordIndex}`);
      for (const [metric] of REPORT_EVENTS) {
        if (!events[metric]) continue;
        const seen = metricCustomers.get(metric);
        if (!seen.has(customerKey)) {
          seen.add(customerKey);
          metrics[metric] += 1;
        }
      }

      return { record, events, eventTimes, eventEvidence, customerKey };
    });

    function breakdown(keySelector) {
      const groups = new Map();
      for (const entry of evaluated) {
        const label = normalizeGroupKey(keySelector(entry.record), 'unknown');
        if (!groups.has(label)) groups.set(label, {
          metrics: emptyReportMetrics(),
          customers: new Map(REPORT_EVENTS.map(([metric]) => [metric, new Set()])),
        });
        const group = groups.get(label);
        for (const [metric] of REPORT_EVENTS) {
          if (!entry.events[metric]) continue;
          const seen = group.customers.get(metric);
          if (seen.has(entry.customerKey)) continue;
          seen.add(entry.customerKey);
          group.metrics[metric] += 1;
        }
      }
      return Array.from(groups, ([label, group]) => ({
        label,
        metrics: group.metrics,
        rates: buildConversionRates(group.metrics),
      })).filter(item => Object.values(item.metrics).some(Boolean))
        .sort((left, right) => right.metrics.sent - left.metrics.sent
          || right.metrics.replied - left.metrics.replied
          || right.metrics.contactCaptured - left.metrics.contactCaptured
          || left.label.localeCompare(right.label));
    }

    const rates = buildConversionRates(metrics);
    const scoredCustomers = new Map();
    evaluated.forEach(entry => {
      if (!entry.events.discovered) return;
      const rawScore = entry.record.icpScore ?? entry.record.fitScore;
      const score = Number(rawScore);
      if (!Number.isFinite(score) || score <= 0 || score > 100) return;
      const current = scoredCustomers.get(entry.customerKey);
      if (!Number.isFinite(current) || score > current) scoredCustomers.set(entry.customerKey, score);
    });
    const scoredValues = [...scoredCustomers.values()];
    const icpScoring = {
      average: scoredValues.length
        ? Math.round((scoredValues.reduce((sum, score) => sum + score, 0) / scoredValues.length) * 10) / 10
        : null,
      scoredCustomers: scoredValues.length,
      discoveredCustomers: metrics.discovered,
      coverage: metrics.discovered ? scoredValues.length / metrics.discovered : 0,
      minimum: scoredValues.length ? Math.min(...scoredValues) : null,
      maximum: scoredValues.length ? Math.max(...scoredValues) : null,
    };
    const replyTypesByCustomer = new Map();
    evaluated.forEach(entry => {
      if (!entry.events.replied) return;
      const type = ['human', 'automated'].includes(entry.record.replyType)
        ? entry.record.replyType
        : 'unclassified';
      const existing = replyTypesByCustomer.get(entry.customerKey);
      if (!existing || existing === 'unclassified' || (existing === 'automated' && type === 'human')) {
        replyTypesByCustomer.set(entry.customerKey, type);
      }
    });
    const replyDiagnostics = [...replyTypesByCustomer.values()].reduce((summary, type) => {
      summary[type] += 1;
      return summary;
    }, { human: 0, automated: 0, unclassified: 0 });
    const funnelMetrics = ['discovered', 'approved', 'sent', 'replied', 'contactCaptured', 'opportunity'];
    const consistencyViolations = funnelMetrics.slice(1).filter((metric, index) => metrics[metric] > metrics[funnelMetrics[index]]);
    const breakdowns = {
      platform: breakdown(record => record.platform),
      countryMarket: breakdown(record => record.country || record.market),
      keyword: breakdown(record => record.keyword),
      template: breakdown(record => record.templateId),
      icpTier: breakdown(record => record.icpTier || record.tier),
    };
    return {
      period,
      metrics,
      icpScoring,
      rates,
      replyDiagnostics,
      conversion: buildReplyConversionInsights(breakdowns),
      breakdowns,
      eventRecords: evaluated,
      consistency: {
        funnelMonotonic: consistencyViolations.length === 0,
        violations: consistencyViolations,
      },
      dataQuality,
      hasData: Object.values(metrics).some(Boolean),
    };
  }

  return {
    normalizeTrendRecord,
    buildKeywordMetrics,
    buildKeywordOpportunities,
    buildTemplateMetrics,
    buildConversionRates,
    getNaturalPeriod,
    buildPeriodReport,
  };
}));
