const DEFAULT_ALIBABA_SMTP_HOST = 'smtp.qiye.aliyun.com';
const DEFAULT_ALIBABA_SMTP_PORT = 465;
const DEFAULT_ALIBABA_IMAP_HOST = 'imap.qiye.aliyun.com';
const DEFAULT_ALIBABA_IMAP_PORT = 993;
const { protectedAlibabaPassword } = require('./secure-credential-store');

function clean(value) {
  return String(value || '').trim();
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(value));
}

function emailDomain(value) {
  return clean(value).toLowerCase().split('@')[1] || '';
}

function alibabaEmailConfig(env = process.env) {
  return {
    provider: 'alibaba-enterprise-mail',
    smtpHost: clean(env.ALIBABA_SMTP_HOST) || DEFAULT_ALIBABA_SMTP_HOST,
    smtpPort: Number(env.ALIBABA_SMTP_PORT || DEFAULT_ALIBABA_SMTP_PORT),
    smtpSecure: true,
    imapHost: clean(env.ALIBABA_IMAP_HOST) || DEFAULT_ALIBABA_IMAP_HOST,
    imapPort: Number(env.ALIBABA_IMAP_PORT || DEFAULT_ALIBABA_IMAP_PORT),
    imapSecure: true,
    from: clean(env.OUTREACH_EMAIL_FROM),
    username: clean(env.ALIBABA_SMTP_USER),
    securityPassword: clean(env.ALIBABA_SMTP_SECURITY_PASSWORD) || protectedAlibabaPassword(env),
  };
}

function emailSenderReadiness(env = process.env) {
  const config = alibabaEmailConfig(env);
  const missing = [];
  if (!isEmail(config.from)) missing.push('OUTREACH_EMAIL_FROM');
  if (!isEmail(config.username)) missing.push('ALIBABA_SMTP_USER');
  if (!config.securityPassword) missing.push('ALIBABA_SMTP_SECURITY_PASSWORD');
  if (config.from && config.username && config.from.toLowerCase() !== config.username.toLowerCase()) {
    missing.push('sender_identity_mismatch');
  }
  if (config.from && emailDomain(config.from) !== 'flextailgear.com') {
    missing.push('non_flextail_sender_domain');
  }
  return {
    ok: missing.length === 0,
    provider: config.provider,
    from: config.from,
    senderDomain: emailDomain(config.from),
    smtp: `${config.smtpHost}:${config.smtpPort}`,
    imap: `${config.imapHost}:${config.imapPort}`,
    missing,
    requiredEnv: [
      'OUTREACH_EMAIL_FROM',
      'ALIBABA_SMTP_USER',
      'ALIBABA_SMTP_SECURITY_PASSWORD',
    ],
    security: {
      smtpSsl: true,
      imapSsl: true,
      useAlibabaThirdPartySecurityPassword: true,
      neverPersistPlaintextPasswordInRepository: true,
    },
  };
}

module.exports = {
  alibabaEmailConfig,
  emailSenderReadiness,
  isEmail,
};
