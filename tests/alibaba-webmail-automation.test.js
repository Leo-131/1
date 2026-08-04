const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const {
  ALIBABA_WEBMAIL_SENT_URL,
  composeStartExpression,
  composeFillExpression,
  composeInspectionExpression,
  composeSendExpression,
  postSendStateExpression,
  sendToastExpression,
  sentFolderConfirmationExpression,
} = require('../outreach-dashboard/alibaba-webmail-automation');

test('Alibaba webmail automation targets the authenticated Sent route', () => {
  assert.equal(ALIBABA_WEBMAIL_SENT_URL, 'https://qiye.aliyun.com/alimail/entries/v5.1/mail/sentitems/all');
});

test('Alibaba webmail expressions are valid JavaScript and keep exact recipient/subject evidence', () => {
  const payload = {
    recipient: 'hello@furtherfaster.co.nz',
    subject: 'FLEXTAIL outdoor electronics | Further Faster range review',
    text: 'A safe first-touch message',
  };
  const expressions = [
    composeStartExpression(),
    composeFillExpression(payload),
    composeInspectionExpression(payload),
    composeSendExpression(payload),
    postSendStateExpression(payload),
    sendToastExpression(),
    sentFolderConfirmationExpression(payload),
  ];
  for (const expression of expressions) assert.doesNotThrow(() => new vm.Script(expression));
  assert.match(composeStartExpression(), /shadowRoot/);
  assert.match(composeStartExpression(), /contentDocument/);
  assert.match(composeStartExpression(), /input\[type="password"\]/);
  assert.match(composeStartExpression(), /aria-label/);
  assert.match(composeStartExpression(), /写邮件/);
  assert.match(composeFillExpression(payload), /ownerDocument/);
  assert.match(composeFillExpression(payload), /shadowRoot/);
  assert.ok(composeFillExpression(payload).includes(".replace(/\\s+/g, '')"));
  assert.match(composeFillExpression(payload), /\[role="combobox"\]/);
  assert.match(composeFillExpression(payload), /directLabelOf/);
  assert.match(composeFillExpression(payload), /getBoundingClientRect\(\)\.width/);
  assert.match(composeFillExpression(payload), /iframe\.e_iframe/);
  assert.match(composeFillExpression(payload), /querySelectorAll\('iframe'\)/);
  assert.match(composeFillExpression(payload), /content_inserted_recipient_control_verified/);
  assert.match(composeFillExpression(payload), /isVisible/);
  assert.match(composeFillExpression(payload), /setValue\(recipientInput, recipient\)/);
  assert.match(composeFillExpression(payload), /recipientCommittedMatch/);
  assert.match(composeFillExpression(payload), /committedRecipientSignals/);
  assert.match(composeFillExpression(payload), /width: Math\.round\(recipientRect\?\.width \|\| 0\)/);
  assert.match(composeInspectionExpression(payload), /data-email/);
  assert.match(composeInspectionExpression(payload), /recipientSignals/);
  assert.match(composeInspectionExpression(payload), /\[class\*="recipient"\]/);
  assert.match(composeInspectionExpression(payload), /root\.host/);
  assert.match(composeInspectionExpression(payload), /replace\(\/\\u00a0\/g/);
  assert.match(composeSendExpression(payload), /send_button_not_unique/);
  assert.match(composeSendExpression(payload), /send_control_verified/);
  assert.match(composeSendExpression(payload), /getBoundingClientRect/);
  assert.doesNotMatch(composeSendExpression(payload), /\.click\(\)/);
  assert.match(postSendStateExpression(payload), /composerStillOpen/);
  assert.match(postSendStateExpression(payload), /blockingDialog/);
  assert.match(sentFolderConfirmationExpression(payload), /sent_folder_record_confirmed/);
  assert.match(sentFolderConfirmationExpression(payload), /shadowRoot/);
});
