'use strict';

const nodemailer = require('nodemailer');
const { ImapFlow } = require('imapflow');
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

function verifiedBusinessEmailTarget(lead = {}) {
  const recipient = recipientEmail(lead);
  if (!recipient) return { ok: false, reason: 'verified_public_email_missing', recipient: '' };
  if (recipient === 'leo@flextailgear.com') return { ok: false, reason: 'sender_address_is_not_customer', recipient };
  const domain = recipient.split('@')[1];
  if (PERSONAL_EMAIL_DOMAINS.has(domain)) return { ok: false, reason: 'personal_email_domain_not_allowed', recipient, domain };

  const evidence = [
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
  const verified = /official website mailto|verified|deliverable|official public|official business|public business email|official supplier email|official procurement email|official vendor email/.test(normalizedEvidence);
  if (!verified) return { ok: false, reason: 'public_business_email_requires_verification', recipient, domain };
  return { ok: true, reason: 'verified_public_business_email', recipient, domain, evidence: clean(evidence).slice(0, 240) };
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
  const text = Buffer.isBuffer(source) ? source.toString('utf8') : String(source || '');
  const recipient = (text.match(/(?:Final-Recipient|Original-Recipient):[^;\r\n]*;\s*([^\s<>]+@[^\s<>]+)/i)
    || text.match(/(?:recipient|to):\s*<?([^\s<>]+@[^\s<>]+)>?/i)
    || [])[1] || '';
  const messageId = (text.match(/Original-Message-ID:\s*(<[^>]+>)/i)
    || text.match(/Message-ID:\s*(<[^>]+>)/i)
    || [])[1] || '';
  const diagnostic = (text.match(/Diagnostic-Code:\s*([^\r\n]+)/i) || [])[1] || '';
  return { recipient: normalizedEmail(recipient), messageId: clean(messageId), diagnostic: clean(diagnostic).slice(0, 240) };
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
    await client.mailboxOpen('INBOX');
    const since = options.since || new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const uids = await client.search({
      since,
      or: [
        { subject: 'Delivery Status Notification' },
        { subject: 'Undeliverable' },
        { subject: 'Mail delivery failed' },
        { subject: 'Returned mail' },
      ],
    }, { uid: true });
    if (!Array.isArray(uids) || !uids.length) return { ok: true, reason: 'no_recent_bounces', bounces: [] };
    const messages = await client.fetchAll(uids.slice(-100), { uid: true, envelope: true, source: true, internalDate: true }, { uid: true });
    const bounces = messages
      .map(message => ({ ...parseBounceSource(message.source), uid: message.uid, receivedAt: message.internalDate && new Date(message.internalDate).toISOString() }))
      .filter(item => item.recipient || item.messageId);
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
  verifiedBusinessEmailTarget,
  validateFirstTouchEmail,
  sentMailboxPath,
  confirmInSentFolder,
  smtpFailureStatus,
  parseBounceSource,
  scanAlibabaBounces,
  sendAndConfirmAlibabaEmail,
};
