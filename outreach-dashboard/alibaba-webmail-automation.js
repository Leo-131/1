'use strict';

const ALIBABA_WEBMAIL_SENT_URL = 'https://qiye.aliyun.com/alimail/entries/v5.1/mail/sentitems/all';

function serialized(value) {
  return JSON.stringify(String(value || ''));
}

function composeStartExpression() {
  return `(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const compose = buttons.find(button => /写邮件/.test((button.innerText || button.textContent || '').trim()));
    if (!compose) return JSON.stringify({ ok: false, evidence: 'alibaba_webmail_compose_button_missing' });
    compose.click();
    return JSON.stringify({ ok: true, evidence: 'alibaba_webmail_compose_open_clicked' });
  })()`;
}

function composeFillExpression({ recipient, subject, text } = {}) {
  return `(() => {
    const recipient = ${serialized(recipient)};
    const subject = ${serialized(subject)};
    const bodyText = ${serialized(text)};
    const setValue = (element, value) => {
      const descriptor = Object.getOwnPropertyDescriptor(element.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, 'value');
      if (descriptor && descriptor.set) descriptor.set.call(element, value);
      else element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };
    const recipientInputs = Array.from(document.querySelectorAll('input[role="combobox"]'))
      .filter(input => /hide-clear/.test(String(input.className || '')));
    const recipientInput = recipientInputs[0] || null;
    const subjectInput = document.querySelector('input.sc-lpjIfP')
      || Array.from(document.querySelectorAll('input[type="text"]')).find(input => /主题/.test((input.parentElement && input.parentElement.innerText) || ''));
    const editorFrame = document.querySelector('iframe.e_iframe');
    const editorBody = editorFrame && editorFrame.contentDocument && editorFrame.contentDocument.body;
    if (!recipientInput || !subjectInput || !editorBody) {
      return JSON.stringify({ ok: false, evidence: 'alibaba_webmail_compose_fields_missing', recipientInput: Boolean(recipientInput), subjectInput: Boolean(subjectInput), editorBody: Boolean(editorBody) });
    }
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
    const recipientText = document.body.innerText || '';
    const subjectInput = document.querySelector('input.sc-lpjIfP')
      || Array.from(document.querySelectorAll('input[type="text"]')).find(input => /主题/.test((input.parentElement && input.parentElement.innerText) || ''));
    const editorFrame = document.querySelector('iframe.e_iframe');
    const editorBody = editorFrame && editorFrame.contentDocument && editorFrame.contentDocument.body;
    const actualBody = editorBody ? (editorBody.innerText || '').trim() : '';
    const recipientReady = recipientText.toLowerCase().includes(recipient.toLowerCase());
    const subjectReady = Boolean(subjectInput && subjectInput.value === subject);
    const bodyReady = actualBody === expectedBody.trim();
    return JSON.stringify({ ok: recipientReady && subjectReady && bodyReady, recipientReady, subjectReady, bodyReady, evidence: recipientReady && subjectReady && bodyReady ? 'alibaba_webmail_draft_verified' : 'alibaba_webmail_draft_verification_failed' });
  })()`;
}

function composeSendExpression({ recipient, subject } = {}) {
  return `(() => {
    const recipient = ${serialized(recipient)};
    const subject = ${serialized(subject)};
    const pageText = document.body.innerText || '';
    const subjectInput = document.querySelector('input.sc-lpjIfP');
    if (!pageText.toLowerCase().includes(recipient.toLowerCase()) || !subjectInput || subjectInput.value !== subject) {
      return JSON.stringify({ ok: false, sendClicked: false, evidence: 'alibaba_webmail_pre_send_identity_check_failed' });
    }
    const sendButtons = Array.from(document.querySelectorAll('button'))
      .filter(button => (button.innerText || button.textContent || '').trim() === '发送');
    if (sendButtons.length !== 1) return JSON.stringify({ ok: false, sendClicked: false, evidence: 'alibaba_webmail_send_button_not_unique', count: sendButtons.length });
    sendButtons[0].click();
    return JSON.stringify({ ok: true, sendClicked: true, evidence: 'alibaba_webmail_send_clicked' });
  })()`;
}

function sendToastExpression() {
  return `(() => {
    const text = document.body.innerText || '';
    const confirmed = /发送成功|邮件发送成功/.test(text);
    return JSON.stringify({ ok: confirmed, confirmed, evidence: confirmed ? 'alibaba_mail_sent_success_toast' : 'alibaba_mail_send_confirmation_waiting' });
  })()`;
}

function sentFolderConfirmationExpression({ subject } = {}) {
  return `(() => {
    const subject = ${serialized(subject)};
    const articles = Array.from(document.querySelectorAll('article'));
    const match = articles.find(article => (article.innerText || article.textContent || '').includes(subject));
    return JSON.stringify({ ok: Boolean(match), confirmed: Boolean(match), evidence: match ? 'sent_folder_record_confirmed' : 'sent_folder_record_missing', subject });
  })()`;
}

module.exports = {
  ALIBABA_WEBMAIL_SENT_URL,
  composeStartExpression,
  composeFillExpression,
  composeInspectionExpression,
  composeSendExpression,
  sendToastExpression,
  sentFolderConfirmationExpression,
};
