'use strict';

const nodemailer = require('nodemailer');
const { ImapFlow } = require('imapflow');
const dns = require('dns').promises;
const { alibabaEmailConfig, emailSenderReadiness, isEmail } = require('./email-channel');

const PERSONAL_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com',
  'msn.com', 'yahoo.com', 'icloud.com', 'me.com', 'aol.com', 'proton.me',
  'protonmail.com', 'qq.com', '163.com', '126.com',
]);

function clean(value) {
  return String(value || '').trim();
}

function normalizedEmail(value) {
  const email = clean(value).toLowerCase();
  return isEmail(email) ? email : '';
}

function recipientEmail(lead = {}) {
  return normalizedEmail(lead.publicEmail || lead.contactEmail || lead.email || lead.recipientEmail);
}

function normalizedWebsiteHost(value) {
  try {
    const url = new URL(clean(value));
    if (url.protocol !== 'https:') return '';
    return url.hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

function firstPartyOfficialAgencyPersonalEmail(lead = {}, recipient = recipientEmail(lead)) {
  if (!recipient) return false;
  const domain = recipient.split('@')[1];
  if (!PERSONAL_EMAIL_DOMAINS.has(domain)) return false;
  if (String(lead.customerType || '').toLowerCase() !== 'sales_agency') return false;
  if (Number(lead.fitScore || 0) < 70) return false;
  const externalStatus = String(lead.externalVerificationStatus || '').toLowerCase();
  const liveSignals = lead.firstPartyChannelVerification && Array.isArray(lead.firstPartyChannelVerification.signals)
    ? lead.firstPartyChannelVerification.signals.map(value => String(value).toLowerCase())
    : [];
  const firstPartyEmailStatus = externalStatus === 'official_supplier_email_verified'
    || (externalStatus === 'official_contact_form_verified' && liveSignals.includes('public_business_email'));
  if (!firstPartyEmailStatus) return false;
  if (String(lead.emailVerificationStatus || '').toLowerCase() !== 'official_public_business_email') return false;

  const websiteHost = normalizedWebsiteHost(lead.website || lead.url || lead.contactUrl);
  // Normalized discovery rows may retain a Google query in evidenceUrl while
  // carrying the authoritative live page in sourceEvidenceUrl/verification.
  // Prefer the explicit first-party fields; never promote the search URL.
  const evidenceHost = normalizedWebsiteHost(
    lead.firstPartyChannelVerification && lead.firstPartyChannelVerification.evidenceUrl
      || lead.sourceEvidenceUrl
      || lead.emailEvidenceUrl
      || lead.evidenceUrl,
  );
  if (!websiteHost || evidenceHost !== websiteHost) return false;

  const evidence = [lead.publicEmailStatus, lead.emailEvidence, lead.contactNote]
    .filter(Boolean).join(' ').toLowerCase().replace(/[_-]+/g, ' ');
  return /official first party|official (?:principal|agency|business) (?:contact|email|site|homepage)/.test(evidence)
    && /principal|agency|business|brand inquiry|representation/.test(evidence);
}

function verifiedBusinessEmailTarget(lead = {}) {
  const recipient = recipientEmail(lead);
  if (!recipient) return { ok: false, reason: 'verified_public_email_missing', recipient: '' };
  if (recipient === 'leo@flextailgear.com') return { ok: false, reason: 'sender_address_is_not_customer', recipient };
  const domain = recipient.split('@')[1];
  const officialAgencyPersonalEmail = firstPartyOfficialAgencyPersonalEmail(lead, recipient);
  if (PERSONAL_EMAIL_DOMAINS.has(domain) && !officialAgencyPersonalEmail) {
    return { ok: false, reason: 'personal_email_domain_not_allowed', recipient, domain };
  }

  const evidence = [
    lead.externalVerificationStatus,
    lead.emailVerificationStatus,
    lead.publicEmailStatus,
    lead.contactNote,
    lead.identitySource,
    lead.emailEvidence,
  ].filter(Boolean).join(' ').toLowerCase();
  // Verification producers persist stable machine tokens (underscores), while
  // older imports may contain human-readable labels. Treat both forms as the
  // same evidence so a live first-party verification is not discarded by the
  // downstream send gate.
  const normalizedEvidence = evidence.replace(/[_-]+/g, ' ');
  const verified = /official website mailto|verified|deliverable|official public|official business|public business email|official supplier email|official brand rep directory email|official procurement email|official vendor email/.test(normalizedEvidence);
  if (!verified) return { ok: false, reason: 'public_business_email_requires_verification', recipient, domain };
  return {
    ok: true,
    reason: officialAgencyPersonalEmail ? 'verified_first_party_agency_personal_domain_email' : 'verified_public_business_email',
    recipient,
    domain,
    evidence: clean(evidence).slice(0, 240),
  };
}

async function verifyBusinessEmailDomain(lead = {}, dependencies = {}) {
  const target = verifiedBusinessEmailTarget(lead);
  if (!target.ok) return target;
  const resolveMx = dependencies.resolveMx || dns.resolveMx;
  try {
    const records = await resolveMx(target.domain);
    const usable = (Array.isArray(records) ? records : [])
      .filter(record => record && clean(record.exchange) && clean(record.exchange) !== '.');
    if (!usable.length) return { ...target, ok: false, reason: 'recipient_domain_has_no_mail_exchange', mxRecords: [] };
    return {
      ...target,
      ok: true,
      reason: 'verified_public_business_email_with_mx',
      mxRecords: usable.map(record => clean(record.exchange).toLowerCase()).slice(0, 10),
    };
  } catch (error) {
    return {
      ...target,
      ok: false,
      reason: 'recipient_domain_mail_exchange_unverified',
      error: error && (error.code || error.message) || String(error),
    };
  }
}

function validateFirstTouchEmail({ from, to, subject, text, attachments } = {}) {
  const errors = [];
  const words = clean(text).split(/\s+/).filter(Boolean).length;
  if (normalizedEmail(from) !== 'leo@flextailgear.com') errors.push('sender_identity_mismatch');
  if (!normalizedEmail(to)) errors.push('recipient_email_invalid');
  if (!clean(subject)) errors.push('email_subject_missing');
  if (words < 90 || words > 140) errors.push('email_body_must_be_90_140_words');
  if (!/36\+.*2026|2026.*36\+/i.test(clean(text))) errors.push('email_36_plus_2026_sku_proof_missing');
  if (!/flextail\.com/i.test(clean(text))) errors.push('email_flextail_link_missing');
  if (!/buyer|procurement|purchasing|vendor|supplier|category|assortment/i.test(clean(text))) errors.push('email_procurement_cta_missing');
  if (Array.isArray(attachments) && attachments.length) errors.push('first_touch_attachments_not_allowed');
  return { ok: errors.length === 0, errors, words };
}

function sentMailboxPath(list = []) {
  const rows = Array.isArray(list) ? list : [];
  const special = rows.find(item => String(item && item.specialUse || '').toLowerCase() === '\\sent');
  if (special && special.path) return special.path;
  const named = rows.find(item => /(^|[/.])sent(?: items| mail)?$/i.test(String(item && item.path || '')));
  return named && named.path || '';
}

function envelopeHasRecipient(envelope = {}, recipient = '') {
  const addresses = Array.isArray(envelope.to) ? envelope.to : [];
  return addresses.some(item => normalizedEmail(item && item.address) === normalizedEmail(recipient));
}

async function confirmInSentFolder({ config, messageId, recipient, subject, sentAt }, dependencies = {}) {
  const ImapClient = dependencies.ImapFlow || ImapFlow;
  const sleep = dependencies.sleep || (ms => new Promise(resolve => setTimeout(resolve, ms)));
  const attempts = Math.max(1, Number(dependencies.confirmAttempts || 5));
  const intervalMs = Math.max(0, Number(dependencies.confirmIntervalMs == null ? 2000 : dependencies.confirmIntervalMs));
  const client = new ImapClient({
    host: config.imapHost,
    port: config.imapPort,
    secure: config.imapSecure,
    auth: { user: config.username, pass: config.securityPassword },
    logger: false,
  });
  try {
    await client.connect();
    const mailboxes = await client.list();
    const sentPath = sentMailboxPath(mailboxes);
    if (!sentPath) return { ok: false, reason: 'sent_mailbox_not_found' };
    await client.mailboxOpen(sentPath);
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      let uids = messageId
        ? await client.search({ header: { 'message-id': messageId } }, { uid: true })
        : [];
      if (!Array.isArray(uids) || !uids.length) {
        uids = await client.search({
          to: recipient,
          subject,
          since: new Date(new Date(sentAt).getTime() - 5 * 60 * 1000),
        }, { uid: true });
      }
      if (Array.isArray(uids) && uids.length) {
        const recentUids = uids.slice(-10);
        const messages = await client.fetchAll(recentUids, { uid: true, envelope: true, internalDate: true }, { uid: true });
        const match = messages.find(message => (
          envelopeHasRecipient(message.envelope, recipient)
          && clean(message.envelope && message.envelope.subject) === clean(subject)
        ));
        if (match) return { ok: true, reason: 'sent_folder_message_confirmed', sentPath, uid: match.uid, attempt };
      }
      if (attempt < attempts) await sleep(intervalMs);
    }
    return { ok: false, reason: 'sent_folder_confirmation_missing', sentPath };
  } finally {
    if (client.usable) await client.logout().catch(() => {});
    else if (typeof client.close === 'function') client.close();
  }
}

function smtpFailureStatus(error = {}) {
  const responseCode = Number(error.responseCode || 0);
  return responseCode >= 500 ? 'bounced' : 'failed_open';
}

function parseBounceSource(source = '') {
  const raw = Buffer.isBuffer(source) ? source.toString('utf8') : String(source || '');
  const decodedParts = [];
  const base64Part = /Content-Transfer-Encoding:\s*base64[\s\S]*?\r?\n\r?\n([A-Za-z0-9+/=\r\n]+?)(?=\r?\n--)/gi;
  for (const match of raw.matchAll(base64Part)) {
    try { decodedParts.push(Buffer.from(match[1].replace(/\s+/g, ''), 'base64').toString('utf8')); } catch {}
  }
  const text = `${raw}\n${decodedParts.join('\n')}`;
  const explicitRecipient = (text.match(/(?:Final-Recipient|Original-Recipient):[^;\r\n]*;\s*([^\s<>]+@[^\s<>]+)/i) || [])[1] || '';
  const addressCandidates = [...text.matchAll(/^(?:recipient|to):\s*(?:[^<\r\n]*<)?([^\s<>]+@[^\s<>;]+)>?/gim)]
    .map(match => normalizedEmail(match[1]))
    .filter(address => address
      && address !== 'leo@flextailgear.com'
      && !/mailsupport\.aliyun\.com$|mailer-daemon|postmaster|no-reply/i.test(address));
  const recipient = explicitRecipient || addressCandidates[addressCandidates.length - 1] || '';
  const messageIds = [...text.matchAll(/^(?:Original-Message-ID|Message-ID):\s*(<[^>]+>)/gim)]
    .map(match => clean(match[1]))
    .filter(value => value && !/mailsupport\.aliyun\.com/i.test(value));
  const messageId = messageIds[messageIds.length - 1] || '';
  const diagnostic = (text.match(/Diagnostic-Code:\s*([^\r\n]+)/i)
    || text.match(/(?:address not found|mailbox unavailable|recipient address rejected|user unknown|no such user)[^\r\n]*/i)
    || [])[0] || '';
  return { recipient: normalizedEmail(recipient), messageId: clean(messageId), diagnostic: clean(diagnostic).slice(0, 240) };
}

function bounceMailboxPaths(list = []) {
  const paths = ['INBOX'];
  for (const item of Array.isArray(list) ? list : []) {
    const path = clean(item && item.path);
    const specialUse = clean(item && item.specialUse).toLowerCase();
    if (path && (specialUse === '\\junk' || /(^|[/.])(junk|spam)$/i.test(path))) paths.push(path);
  }
  return [...new Set(paths)].slice(0, 3);
}

async function scanAlibabaBounces(options = {}, dependencies = {}) {
  const readiness = emailSenderReadiness(options.env || process.env);
  if (!readiness.ok) return { ok: false, reason: 'email_sender_not_configured', bounces: [], requiredEnv: readiness.requiredEnv };
  const config = alibabaEmailConfig(options.env || process.env);
  const ImapClient = dependencies.ImapFlow || ImapFlow;
  const client = new ImapClient({
    host: config.imapHost,
    port: config.imapPort,
    secure: config.imapSecure,
    auth: { user: config.username, pass: config.securityPassword },
    logger: false,
  });
  try {
    await client.connect();
    const since = options.since || new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const mailboxes = typeof client.list === 'function' ? await client.list() : [];
    const paths = bounceMailboxPaths(mailboxes);
    const bounces = [];
    for (const mailboxPath of paths) {
      await client.mailboxOpen(mailboxPath);
      const uids = await client.search({
        since,
        or: [
          { subject: 'Delivery Status Notification' },
          { subject: 'Undeliverable' },
          { subject: 'Mail delivery failed' },
          { subject: 'Returned mail' },
          { subject: '退信' },
        ],
      }, { uid: true });
      // Provider subject matching misses Chinese and vendor-specific DSNs.
      // Fetch a bounded recent window and classify locally from envelope and
      // raw RFC delivery-status fields instead.
      const broadUids = await client.search({ since }, { uid: true });
      if (!Array.isArray(broadUids) || !broadUids.length) continue;
      const envelopes = await client.fetchAll(broadUids.slice(-1000), { uid: true, envelope: true, internalDate: true }, { uid: true });
      const candidateUids = envelopes
        .filter(message => {
          const subject = clean(message.envelope && message.envelope.subject);
          const from = (message.envelope && Array.isArray(message.envelope.from) ? message.envelope.from : [])
            .map(item => `${clean(item && item.name)} ${clean(item && item.address)}`).join(' ');
          return /delivery status notification|delivery failure|failure|undeliver|mail delivery|returned mail|address not found|退信|退信通知|无法投递|投递失败/i.test(`${subject} ${from}`)
            || /mailer-daemon|postmaster|mailsupport\.aliyun/i.test(from);
        })
        .map(message => message.uid)
        .filter(Boolean)
        .slice(-500);
      if (!candidateUids.length) continue;
      const messages = await client.fetchAll(candidateUids, { uid: true, envelope: true, source: true, internalDate: true }, { uid: true });
      bounces.push(...messages
        .map(message => ({ ...parseBounceSource(message.source), mailboxPath, uid: message.uid, receivedAt: message.internalDate && new Date(message.internalDate).toISOString() }))
        .filter(item => item.recipient || item.messageId));
    }
    if (!bounces.length) return { ok: true, reason: 'no_recent_bounces', bounces: [], scannedMailboxes: paths };
    return { ok: true, reason: 'bounce_scan_complete', bounces };
  } finally {
    if (client.usable) await client.logout().catch(() => {});
    else if (typeof client.close === 'function') client.close();
  }
}

async function sendAndConfirmAlibabaEmail(input = {}, dependencies = {}) {
  const readiness = emailSenderReadiness(input.env || process.env);
  if (!readiness.ok) {
    return {
      ok: false,
      sendStatus: 'approval_pending',
      reason: 'email_sender_not_configured',
      evidence: `email_sender_not_configured;missing:${readiness.missing.join('|')}`,
      requiredEnv: readiness.requiredEnv,
    };
  }
  const target = verifiedBusinessEmailTarget(input.lead || input);
  if (!target.ok) return { ok: false, skipped: true, sendStatus: 'skipped', reason: target.reason, evidence: target.reason };
  const domainCheck = await verifyBusinessEmailDomain(input.lead || input, dependencies);
  if (!domainCheck.ok) {
    return { ok: false, skipped: true, sendStatus: 'skipped', reason: domainCheck.reason, evidence: domainCheck.reason };
  }

  const config = alibabaEmailConfig(input.env || process.env);
  const message = {
    from: config.from,
    to: target.recipient,
    subject: clean(input.subject),
    text: clean(input.text),
    attachments: [],
  };
  const content = validateFirstTouchEmail(message);
  if (!content.ok) {
    return {
      ok: false,
      skipped: true,
      sendStatus: 'skipped',
      reason: 'email_content_policy_failed',
      evidence: `email_content_policy_failed:${content.errors.join('|')}`,
      contentValidation: content,
    };
  }

  const createTransport = dependencies.createTransport || nodemailer.createTransport;
  const transporter = createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    pool: true,
    maxConnections: 1,
    auth: { user: config.username, pass: config.securityPassword },
    connectionTimeout: 30000,
    greetingTimeout: 15000,
    socketTimeout: 60000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  const sentAt = new Date().toISOString();
  try {
    if (typeof transporter.verify === 'function') await transporter.verify();
    const info = await transporter.sendMail({
      ...message,
      headers: {
        'X-FLEXTAIL-Lead-ID': clean(input.lead && (input.lead.id || input.lead.taskId)),
      },
      dsn: { id: clean(input.lead && (input.lead.id || input.lead.taskId)) || `flextail-${Date.now()}`, return: 'headers', notify: ['failure', 'delay'] },
    });
    const accepted = (Array.isArray(info.accepted) ? info.accepted : []).map(normalizedEmail);
    if (!accepted.includes(target.recipient)) {
      return { ok: false, sendStatus: 'bounced', reason: 'smtp_recipient_rejected', evidence: 'smtp_recipient_rejected', recipientEmail: target.recipient };
    }
    let confirmation;
    try {
      confirmation = await confirmInSentFolder({ config, messageId: info.messageId, recipient: target.recipient, subject: message.subject, sentAt }, dependencies);
    } catch (error) {
      confirmation = { ok: false, reason: 'sent_folder_check_failed', error: error.message || String(error) };
    }
    return {
      ok: confirmation.ok,
      sendStatus: confirmation.ok ? 'sent_confirmed' : 'send_unconfirmed',
      reason: confirmation.reason,
      evidence: `smtp_accepted;message_id:${info.messageId || 'missing'};${confirmation.reason}`,
      recipientEmail: target.recipient,
      messageId: info.messageId || '',
      sentAt,
      sentFolder: confirmation.sentPath || '',
      sentUid: confirmation.uid || null,
      contentValidation: content,
    };
  } catch (error) {
    const sendStatus = smtpFailureStatus(error);
    return {
      ok: false,
      sendStatus,
      reason: sendStatus === 'bounced' ? 'smtp_permanent_rejection' : 'smtp_send_failed',
      evidence: `${sendStatus === 'bounced' ? 'smtp_permanent_rejection' : 'smtp_send_failed'}:${error.code || error.responseCode || 'unknown'}`,
      recipientEmail: target.recipient,
    };
  } finally {
    if (typeof transporter.close === 'function') transporter.close();
  }
}

module.exports = {
  PERSONAL_EMAIL_DOMAINS,
  recipientEmail,
  firstPartyOfficialAgencyPersonalEmail,
  verifiedBusinessEmailTarget,
  validateFirstTouchEmail,
  sentMailboxPath,
  confirmInSentFolder,
  smtpFailureStatus,
  parseBounceSource,
  scanAlibabaBounces,
  verifyBusinessEmailDomain,
  sendAndConfirmAlibabaEmail,
};
