const test = require('node:test');
const assert = require('node:assert/strict');
const {
  alibabaEmailConfig,
  emailSenderReadiness,
} = require('../outreach-dashboard/email-channel');
const secureCredentialStore = require('../outreach-dashboard/secure-credential-store');

test('protected Alibaba credential path stays outside the repository', () => {
  const file = secureCredentialStore.alibabaCredentialPath({ APPDATA: 'C:\\Users\\operator\\AppData\\Roaming' });
  assert.match(file, /AppData[\\/]Roaming[\\/]FLEXTAIL[\\/]alibaba-mail\.dpapi$/);
  assert.doesNotMatch(file, /outreach-dashboard/i);
});

test('Alibaba Mail defaults to official SSL endpoints', () => {
  const config = alibabaEmailConfig({});
  assert.equal(config.smtpHost, 'smtp.qiye.aliyun.com');
  assert.equal(config.smtpPort, 465);
  assert.equal(config.imapHost, 'imap.qiye.aliyun.com');
  assert.equal(config.imapPort, 993);
  assert.equal(config.smtpSecure, true);
  assert.equal(config.imapSecure, true);
});

test('Alibaba Mail requires a matching FLEXTAIL sender and security password', () => {
  const blocked = emailSenderReadiness({});
  assert.equal(blocked.ok, false);
  assert.ok(blocked.missing.includes('ALIBABA_SMTP_SECURITY_PASSWORD'));

  const ready = emailSenderReadiness({
    OUTREACH_EMAIL_FROM: 'leo@flextailgear.com',
    ALIBABA_SMTP_USER: 'leo@flextailgear.com',
    ALIBABA_SMTP_SECURITY_PASSWORD: 'test-security-password',
  });
  assert.equal(ready.ok, true);
  assert.equal(ready.senderDomain, 'flextailgear.com');
});

test('Alibaba Mail rejects personal or mismatched sender identities', () => {
  const result = emailSenderReadiness({
    OUTREACH_EMAIL_FROM: 'personal@outlook.com',
    ALIBABA_SMTP_USER: 'leo@flextailgear.com',
    ALIBABA_SMTP_SECURITY_PASSWORD: 'test-security-password',
  });
  assert.equal(result.ok, false);
  assert.ok(result.missing.includes('sender_identity_mismatch'));
  assert.ok(result.missing.includes('non_flextail_sender_domain'));
});
