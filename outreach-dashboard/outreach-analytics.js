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
        rates: {
          profileRate: safeRate(funnel.profiled, funnel.discovered),
          approvalRate: safeRate(funnel.approved, funnel.profiled),
          sendRate: safeRate(funnel.sent, funnel.approved),
          replyRate: safeRate(funnel.replied, funnel.sent),
          contactCaptureRate: safeRate(funnel.contactCaptured, funnel.sent),
          opportunityRate: safeRate(funnel.opportunity, funnel.sent),
        },
      };
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

  return {
    normalizeTrendRecord,
    buildKeywordMetrics,
    buildTemplateMetrics,
  };
}));
