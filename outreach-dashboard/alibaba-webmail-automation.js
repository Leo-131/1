'use strict';

// The web client is used only as a fallback when SMTP credentials are not
// configured. A message is never counted until the exact subject is visible
// in Sent; these helpers only make the compose UI detection resilient to UI
// markup and locale changes.
const ALIBABA_WEBMAIL_SENT_URL = 'https://qiye.aliyun.com/alimail/entries/v5.1/mail/sentitems/all';

function serialized(value) {
  return JSON.stringify(String(value || ''));
}

function composeStartExpression() {
  return `(() => {
    const textOf = element => String(element?.innerText || element?.textContent || element?.getAttribute?.('aria-label') || element?.getAttribute?.('title') || '').trim();
    const isVisible = element => Boolean(element && element.getClientRects && element.getClientRects().length);
    const composePattern = /\b(compose|new message|write mail)\b|\u5199\u90ae\u4ef6|\u64b0\u5199|\u65b0\u5efa\u90ae\u4ef6/i;
    const candidates = Array.from(document.querySelectorAll('button,[role="button"],a,div[tabindex]'))
      .filter(element => isVisible(element) && composePattern.test(textOf(element)));
    const compose = candidates[0] || null;
    if (!compose) {
      const pageText = document.body?.innerText || '';
      const loginRequired = /\b(sign in|log in|login)\b|\u767b\u5f55/i.test(pageText);
      return JSON.stringify({ ok: false, evidence: loginRequired ? 'alibaba_webmail_login_required' : 'alibaba_webmail_compose_button_missing' });
    }
    compose.click();
    return JSON.stringify({ ok: true, evidence: 'alibaba_webmail_compose_open_clicked', control: compose.tagName, label: textOf(compose).slice(0, 80) });
  })()`;
}

function composeFieldsExpression() {
  return `(() => {
    const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]),textarea'));
    const labelOf = input => [input.getAttribute('aria-label'), input.getAttribute('placeholder'), input.name, input.id, input.parentElement?.innerText].filter(Boolean).join(' ');
    const recipientPattern = /\b(to|recipient|email)\b|\u6536\u4ef6\u4eba|\u6536\u4ef6/i;
    const subjectPattern = /\bsubject\b|\u4e3b\u9898/i;
    const recipientInput = inputs.find(input => recipientPattern.test(labelOf(input)))
      || document.querySelector('input[role="combobox"]')
      || null;
    const subjectInput = inputs.find(input => subjectPattern.test(labelOf(input))) || null;
    const editorFrame = document.querySelector('iframe.e_iframe, iframe[title*="editor" i], iframe[title*="\u7f16\u8f91" i]');
    const editorBody = editorFrame?.contentDocument?.body || document.querySelector('[contenteditable="true"]') || null;
    return { recipientInput, subjectInput, editorBody };
  })()`;
}

function composeFillExpression({ recipient, subject, text } = {}) {
  return `(() => {
    const recipient = ${serialized(recipient)};
    const subject = ${serialized(subject)};
    const bodyText = ${serialized(text)};
    const setValue = (element, value) => {
      const prototype = element.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
      if (descriptor?.set) descriptor.set.call(element, value);
      else element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };
    const fields = ${composeFieldsExpression()};
    const { recipientInput, subjectInput, editorBody } = fields;
    if (!recipientInput || !subjectInput || !editorBody) return JSON.stringify({ ok: false, evidence: 'alibaba_webmail_compose_fields_missing', recipientInput: Boolean(recipientInput), subjectInput: Boolean(subjectInput), editorBody: Boolean(editorBody) });
    recipientInput.focus();
    setValue(recipientInput, recipient);
    for (const type of ['keydown', 'keypress', 'keyup']) recipientInput.dispatchEvent(new KeyboardEvent(type, { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
    setValue(subjectInput, subject);
    editorBody.focus();
    editorBody.innerText = bodyText;
    editorBody.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: bodyText }));
    editorBody.dispatchEvent(new Event('change', { bubbles: true }));
    return JSON.stringify({ ok: true, evidence: 'alibaba_webmail_draft_inserted', recipient, subject, bodyLength: bodyText.length });
  })()`;
}

function composeInspectionExpression({ recipient, subject, text } = {}) {
  return `(() => {
    const recipient = ${serialized(recipient)};
    const subject = ${serialized(subject)};
    const expectedBody = ${serialized(text)};
    const fields = ${composeFieldsExpression()};
    const recipientText = document.body?.innerText || '';
    const actualBody = fields.editorBody ? (fields.editorBody.innerText || '').trim() : '';
    const recipientReady = recipientText.toLowerCase().includes(recipient.toLowerCase());
    const subjectReady = Boolean(fields.subjectInput && fields.subjectInput.value === subject);
    const bodyReady = actualBody === expectedBody.trim();
    return JSON.stringify({ ok: recipientReady && subjectReady && bodyReady, recipientReady, subjectReady, bodyReady, evidence: recipientReady && subjectReady && bodyReady ? 'alibaba_webmail_draft_verified' : 'alibaba_webmail_draft_verification_failed' });
  })()`;
}

function composeSendExpression({ recipient, subject } = {}) {
  return `(() => {
    const recipient = ${serialized(recipient)};
    const subject = ${serialized(subject)};
    const fields = ${composeFieldsExpression()};
    const pageText = document.body?.innerText || '';
    if (!pageText.toLowerCase().includes(recipient.toLowerCase()) || !fields.subjectInput || fields.subjectInput.value !== subject) return JSON.stringify({ ok: false, sendClicked: false, evidence: 'alibaba_webmail_pre_send_identity_check_failed' });
    const textOf = element => String(element?.innerText || element?.textContent || element?.getAttribute?.('aria-label') || '').trim();
    const sendPattern = /^send$/i.test.bind(/^send$/i);
    const candidates = Array.from(document.querySelectorAll('button,[role="button"]')).filter(button => {
      const label = textOf(button);
      return /^send$/i.test(label) || /^\u53d1\u9001$/.test(label);
    });
    if (candidates.length !== 1) return JSON.stringify({ ok: false, sendClicked: false, evidence: 'alibaba_webmail_send_button_not_unique', count: candidates.length });
    candidates[0].click();
    return JSON.stringify({ ok: true, sendClicked: true, evidence: 'alibaba_webmail_send_clicked' });
  })()`;
}

function sendToastExpression() {
  return `(() => {
    const text = document.body?.innerText || '';
    const confirmed = /\b(message sent|mail sent)\b|\u53d1\u9001\u6210\u529f|\u90ae\u4ef6\u53d1\u9001\u6210\u529f/i.test(text);
    return JSON.stringify({ ok: confirmed, confirmed, evidence: confirmed ? 'alibaba_mail_sent_success_toast' : 'alibaba_mail_send_confirmation_waiting' });
  })()`;
}

function sentFolderConfirmationExpression({ subject } = {}) {
  return `(() => {
    const subject = ${serialized(subject)};
    const rows = Array.from(document.querySelectorAll('article,tr,[role="row"],li'));
    const match = rows.find(row => String(row.innerText || row.textContent || '').includes(subject));
    return JSON.stringify({ ok: Boolean(match), confirmed: Boolean(match), evidence: match ? 'sent_folder_record_confirmed' : 'sent_folder_record_missing', subject });
  })()`;
}

module.exports = { ALIBABA_WEBMAIL_SENT_URL, composeStartExpression, composeFillExpression, composeInspectionExpression, composeSendExpression, sendToastExpression, sentFolderConfirmationExpression };
