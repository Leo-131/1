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
    const dataQuality = { missingTimestamps: 0, invalidTimestamps: 0 };
    const evaluated = source.map(item => {
      const record = item && typeof item === 'object' ? item : {};
      const events = {};

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
        if (events[metric]) metrics[metric] += 1;
      }

      return { record, events };
    });

    function breakdown(keySelector) {
      const groups = new Map();
      for (const entry of evaluated) {
        const label = normalizeGroupKey(keySelector(entry.record), 'unknown');
        if (!groups.has(label)) groups.set(label, emptyReportMetrics());
        const groupMetrics = groups.get(label);
        for (const [metric] of REPORT_EVENTS) {
          if (entry.events[metric]) groupMetrics[metric] += 1;
        }
      }
      return Array.from(groups, ([label, groupMetrics]) => ({
        label,
        metrics: groupMetrics,
        rates: {
          replyRate: safeRate(groupMetrics.replied, groupMetrics.sent),
          contactCaptureRate: safeRate(groupMetrics.contactCaptured, groupMetrics.sent),
          opportunityRate: safeRate(groupMetrics.opportunity, groupMetrics.sent),
        },
      })).filter(item => Object.values(item.metrics).some(Boolean))
        .sort((left, right) => right.metrics.sent - left.metrics.sent
          || right.metrics.replied - left.metrics.replied
          || right.metrics.contactCaptured - left.metrics.contactCaptured
          || left.label.localeCompare(right.label));
    }

    return {
      period,
      metrics,
      rates: {
        replyRate: safeRate(metrics.replied, metrics.sent),
        contactCaptureRate: safeRate(metrics.contactCaptured, metrics.sent),
        opportunityRate: safeRate(metrics.opportunity, metrics.sent),
      },
      breakdowns: {
        platform: breakdown(record => record.platform),
        countryMarket: breakdown(record => record.country || record.market),
        keyword: breakdown(record => record.keyword),
        template: breakdown(record => record.templateId),
        icpTier: breakdown(record => record.icpTier || record.tier),
      },
      dataQuality,
      hasData: Object.values(metrics).some(Boolean),
    };
  }

  return {
    normalizeTrendRecord,
    buildKeywordMetrics,
    buildTemplateMetrics,
    getNaturalPeriod,
    buildPeriodReport,
  };
}));
