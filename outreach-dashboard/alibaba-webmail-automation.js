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
    const roots = [document];
    for (let index = 0; index < roots.length; index += 1) {
      const root = roots[index];
      for (const element of root.querySelectorAll('*')) {
        if (element.shadowRoot && !roots.includes(element.shadowRoot)) roots.push(element.shadowRoot);
        if (element.tagName === 'IFRAME') {
          try {
            if (element.contentDocument && !roots.includes(element.contentDocument)) roots.push(element.contentDocument);
          } catch {}
        }
      }
    }
    const composePattern = /\b(compose|new message|write mail|new mail)\b|\u5199\u90ae\u4ef6|\u64b0\u5199|\u65b0\u5efa\u90ae\u4ef6/i;
    const candidates = roots.flatMap(root => Array.from(root.querySelectorAll('button,[role="button"],a,div[tabindex],[data-testid],[class]')))
      .map(element => {
        const label = textOf(element);
        const identity = [label, element.getAttribute?.('aria-label'), element.getAttribute?.('data-testid'), element.getAttribute?.('class'), element.getAttribute?.('href')].filter(Boolean).join(' ');
        const semantic = element.tagName === 'BUTTON' || element.getAttribute?.('role') === 'button';
        return { element, label, identity, semantic };
      })
      .filter(item => isVisible(item.element) && !item.element.disabled
        && (item.semantic || item.label.length <= 120)
        && (composePattern.test(item.identity) || /(?:^|[-_\\s])(compose|write-mail|new-mail)(?:$|[-_\\s])/i.test(item.identity)))
      .sort((left, right) => Number(right.semantic) - Number(left.semantic) || left.label.length - right.label.length)
      .map(item => item.element);
    const compose = candidates[0] || null;
    if (!compose) {
      const loginControl = roots.flatMap(root => Array.from(root.querySelectorAll('input[type="password"],form[action*="login" i],button[type="submit"]')))
        .find(element => isVisible(element));
      const loginRequired = Boolean(loginControl) || /(?:^|\\.)login\\.|\\/login(?:[/?#]|$)/i.test(location.href);
      return JSON.stringify({ ok: false, evidence: loginRequired ? 'alibaba_webmail_login_required' : 'alibaba_webmail_compose_button_missing', url: location.href, title: document.title });
    }
    compose.click();
    return JSON.stringify({ ok: true, evidence: 'alibaba_webmail_compose_open_clicked', control: compose.tagName, label: textOf(compose).slice(0, 80) });
  })()`;
}

function composeFieldsExpression() {
  return `(() => {
    const roots = [document];
    for (let index = 0; index < roots.length; index += 1) {
      const root = roots[index];
      for (const element of root.querySelectorAll('*')) {
        if (element.shadowRoot && !roots.includes(element.shadowRoot)) roots.push(element.shadowRoot);
        if (element.tagName === 'IFRAME') {
          try {
            if (element.contentDocument && !roots.includes(element.contentDocument)) roots.push(element.contentDocument);
          } catch {}
        }
      }
    }
    const inputs = roots.flatMap(root => Array.from(root.querySelectorAll('input:not([type="hidden"]),textarea,[role="combobox"],[contenteditable="true"]')));
    const isVisible = input => {
      const rect = input?.getBoundingClientRect?.();
      return Boolean(rect && rect.width > 0 && rect.height > 0);
    };
    const directLabelOf = input => {
      const labelledBy = input.getAttribute?.('aria-labelledby');
      const labelledText = labelledBy && input.ownerDocument?.getElementById?.(labelledBy)?.innerText;
      return [input.getAttribute?.('aria-label'), input.getAttribute?.('placeholder'), input.name, input.id, labelledText]
        .filter(Boolean)
        .join(' ')
        .replace(/\\s+/g, '');
    };
    const labelOf = input => {
      const ancestorText = [];
      for (let node = input.parentElement, depth = 0; node && depth < 5; node = node.parentElement, depth += 1) {
        const text = String(node.innerText || '').trim();
        if (text && text.length <= 240) ancestorText.push(text);
      }
      return [directLabelOf(input), ...ancestorText]
        .filter(Boolean)
        .join(' ')
        .replace(/\\s+/g, '');
    };
    const recipientPattern = /\b(to|recipient|email)\b|\u6536\u4ef6\u4eba|\u6536\u4ef6/i;
    const subjectPattern = /\bsubject\b|\u4e3b\u9898/i;
    const recipientInput = inputs.find(input => isVisible(input) && recipientPattern.test(directLabelOf(input)))
      || roots.flatMap(root => Array.from(root.querySelectorAll('input[role="combobox"]')))
        .filter(isVisible)
        .sort((left, right) => right.getBoundingClientRect().width - left.getBoundingClientRect().width)[0]
      || null;
    const subjectInput = inputs.find(input => isVisible(input) && subjectPattern.test(labelOf(input))) || null;
    const composeRoots = roots.flatMap(root => Array.from(root.querySelectorAll('[data-testid="compose-container"]')));
    const editorSearchRoots = composeRoots.length ? composeRoots : roots;
    const editorFrame = editorSearchRoots.map(root => root.querySelector('iframe.e_iframe')).find(Boolean)
      || editorSearchRoots.flatMap(root => Array.from(root.querySelectorAll('iframe')))
      .find(frame => {
        try {
          const body = frame.contentDocument?.body;
          return Boolean(body && (body.isContentEditable || body.getAttribute('contenteditable') === 'true' || body.querySelector('[contenteditable="true"]')));
        } catch {
          return false;
        }
      });
    const editorBody = editorFrame?.contentDocument?.body
      || editorSearchRoots.map(root => root.querySelector('[contenteditable="true"],[role="textbox"]')).find(Boolean)
      || null;
    return { recipientInput, subjectInput, editorBody };
  })()`;
}

function composeFillExpression({ recipient, subject, text } = {}) {
  return `(() => {
    const recipient = ${serialized(recipient)};
    const subject = ${serialized(subject)};
    const bodyText = ${serialized(text)};
    const setValue = (element, value) => {
      const view = element.ownerDocument?.defaultView || window;
      const isTextControl = element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';
      const prototype = element.tagName === 'TEXTAREA' ? view.HTMLTextAreaElement.prototype : view.HTMLInputElement.prototype;
      const descriptor = isTextControl ? Object.getOwnPropertyDescriptor(prototype, 'value') : null;
      if (descriptor?.set) descriptor.set.call(element, value);
      else if (isTextControl) element.value = value;
      else element.textContent = value;
      element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: value }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };
    const fields = ${composeFieldsExpression()};
    const { recipientInput, subjectInput, editorBody } = fields;
    if (!recipientInput || !subjectInput || !editorBody) return JSON.stringify({ ok: false, evidence: 'alibaba_webmail_compose_fields_missing', recipientInput: Boolean(recipientInput), subjectInput: Boolean(subjectInput), editorBody: Boolean(editorBody) });
    recipientInput.focus();
    setValue(recipientInput, recipient);
    recipientInput.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter', code: 'Enter', keyCode: 13, which: 13 }));
    recipientInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter', code: 'Enter', keyCode: 13, which: 13 }));
    const recipientNeedle = recipient.toLowerCase();
    const recipientContainer = recipientInput.closest?.('[class*="recipient"],[class*="address"],[class*="select"],[class*="mail"]')
      || recipientInput.parentElement?.parentElement
      || recipientInput.parentElement;
    const committedRecipientSignals = [
      recipientContainer?.innerText,
      recipientContainer?.textContent,
      recipientContainer?.getAttribute?.('title'),
      recipientContainer?.getAttribute?.('data-value'),
      recipientContainer?.getAttribute?.('data-email'),
      recipientInput.ownerDocument?.body?.innerText,
    ].filter(Boolean).map(value => String(value).toLowerCase());
    const recipientTokens = committedRecipientSignals
      .flatMap(value => value.match(/[a-z0-9.!#$%&'*+/=?^_\x60{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) || [])
      .map(value => value.toLowerCase());
    const recipientCommittedMatch = recipientTokens.includes(recipientNeedle);
    setValue(subjectInput, subject);
    editorBody.focus();
    editorBody.innerText = bodyText;
    editorBody.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: bodyText }));
    editorBody.dispatchEvent(new Event('change', { bubbles: true }));
    const recipientRect = recipientInput.getBoundingClientRect?.();
    const subjectRect = subjectInput.getBoundingClientRect?.();
    const recipientRoot = recipientInput.getRootNode?.();
    return JSON.stringify({
      ok: true,
      evidence: 'alibaba_webmail_content_inserted_recipient_control_verified',
      recipient,
      recipientValueMatch: String(recipientInput.value || '').trim().toLowerCase() === recipient.toLowerCase(),
      recipientCommittedMatch,
      subject,
      subjectValueMatch: String(subjectInput.value ?? subjectInput.innerText ?? subjectInput.textContent ?? '').trim() === subject,
      bodyLength: bodyText.length,
      recipientControl: {
        tag: recipientInput.tagName,
        type: recipientInput.getAttribute?.('type') || '',
        role: recipientInput.getAttribute?.('role') || '',
        className: String(recipientInput.className || '').slice(0, 120),
        x: Math.round(recipientRect?.x || 0),
        y: Math.round(recipientRect?.y || 0),
        width: Math.round(recipientRect?.width || 0),
        height: Math.round(recipientRect?.height || 0),
        shadowRoot: Boolean(recipientRoot && recipientRoot.host),
      },
      subjectControl: {
        tag: subjectInput.tagName,
        type: subjectInput.getAttribute?.('type') || '',
        role: subjectInput.getAttribute?.('role') || '',
        className: String(subjectInput.className || '').slice(0, 120),
        x: Math.round(subjectRect?.x || 0),
        y: Math.round(subjectRect?.y || 0),
        width: Math.round(subjectRect?.width || 0),
        height: Math.round(subjectRect?.height || 0),
      },
    });
  })()`;
}

function composeInspectionExpression({ recipient, subject, text } = {}) {
  return `(() => {
    const recipient = ${serialized(recipient)};
    const subject = ${serialized(subject)};
    const expectedBody = ${serialized(text)};
    const fields = ${composeFieldsExpression()};
    const normalize = value => String(value || '').replace(/\\r\\n/g, '\\n').replace(/\\u00a0/g, ' ').replace(/[ \\t]+$/gm, '').trim();
    const recipientNeedle = recipient.toLowerCase();
    const roots = [document];
    for (let index = 0; index < roots.length; index += 1) {
      const root = roots[index];
      for (const element of root.querySelectorAll('*')) {
        if (element.shadowRoot && !roots.includes(element.shadowRoot)) roots.push(element.shadowRoot);
        if (element.tagName === 'IFRAME') {
          try {
            if (element.contentDocument && !roots.includes(element.contentDocument)) roots.push(element.contentDocument);
          } catch {}
        }
      }
    }
    const recipientText = roots.map(root => root.body?.innerText || root.host?.innerText || '').join('\\n');
    const recipientSignals = roots.flatMap(root => Array.from(root.querySelectorAll('input,[title],[aria-label],[data-email],[data-value],[class*="recipient"],[class*="address"],[class*="select"]')))
      .flatMap(element => [
        element.value,
        element.getAttribute?.('title'),
        element.getAttribute?.('aria-label'),
        element.getAttribute?.('data-email'),
        element.getAttribute?.('data-value'),
        element.textContent,
      ])
      .filter(Boolean)
      .map(value => String(value).toLowerCase());
    const actualBody = fields.editorBody ? normalize(fields.editorBody.innerText || fields.editorBody.textContent || '') : '';
    const recipientTokens = recipientSignals
      .flatMap(value => value.match(/[a-z0-9.!#$%&'*+/=?^_\x60{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) || [])
      .map(value => value.toLowerCase());
    const recipientControlValue = String(fields.recipientInput?.value || '').trim().toLowerCase();
    const recipientControlExactMatch = recipientControlValue === recipientNeedle;
    const recipientReady = recipientTokens.includes(recipientNeedle) || recipientControlExactMatch;
    const subjectReady = Boolean(fields.subjectInput && String(fields.subjectInput.value ?? fields.subjectInput.innerText ?? fields.subjectInput.textContent ?? '').trim() === subject);
    const bodyReady = actualBody === normalize(expectedBody);
    return JSON.stringify({ ok: recipientReady && subjectReady && bodyReady, recipientReady, recipientControlExactMatch, subjectReady, bodyReady, evidence: recipientReady && subjectReady && bodyReady ? 'alibaba_webmail_draft_verified' : 'alibaba_webmail_draft_verification_failed' });
  })()`;
}

function composeRecipientFocusExpression() {
  return `(() => {
    const fields = ${composeFieldsExpression()};
    const recipientInput = fields.recipientInput;
    if (!recipientInput) return JSON.stringify({ ok: false, evidence: 'alibaba_webmail_recipient_control_missing' });
    recipientInput.focus();
    const rect = recipientInput.getBoundingClientRect?.();
    return JSON.stringify({
      ok: document.activeElement === recipientInput || recipientInput.getRootNode?.().activeElement === recipientInput,
      evidence: 'alibaba_webmail_scoped_recipient_control_focused',
      role: recipientInput.getAttribute?.('role') || '',
      type: recipientInput.getAttribute?.('type') || '',
      x: Math.round(rect?.x || 0),
      y: Math.round(rect?.y || 0),
    });
  })()`;
}

function composeSubjectFocusExpression() {
  return `(() => {
    const fields = ${composeFieldsExpression()};
    const subjectInput = fields.subjectInput;
    if (!subjectInput) return JSON.stringify({ ok: false, evidence: 'alibaba_webmail_subject_control_missing' });
    subjectInput.focus();
    if (typeof subjectInput.select === 'function') subjectInput.select();
    return JSON.stringify({
      ok: document.activeElement === subjectInput || subjectInput.getRootNode?.().activeElement === subjectInput,
      evidence: 'alibaba_webmail_subject_control_focused_for_physical_fill',
      tag: subjectInput.tagName,
      role: subjectInput.getAttribute?.('role') || '',
    });
  })()`;
}

function composeSendExpression({ recipient, subject } = {}) {
  return `(() => {
    const recipient = ${serialized(recipient)};
    const subject = ${serialized(subject)};
    const fields = ${composeFieldsExpression()};
    const pageText = document.body?.innerText || '';
    const recipientControlValue = String(fields.recipientInput?.value || '').trim().toLowerCase();
    const recipientReady = recipientControlValue === recipient.toLowerCase() || pageText.toLowerCase().includes(recipient.toLowerCase());
    const actualSubject = String(fields.subjectInput?.value ?? fields.subjectInput?.innerText ?? fields.subjectInput?.textContent ?? '').trim();
    if (!recipientReady || !fields.subjectInput || actualSubject !== subject) return JSON.stringify({ ok: false, sendReady: false, evidence: 'alibaba_webmail_pre_send_identity_check_failed' });
    const textOf = element => String(element?.innerText || element?.textContent || element?.getAttribute?.('aria-label') || '').trim();
    const candidates = Array.from(document.querySelectorAll('button,[role="button"]')).filter(button => {
      const label = textOf(button);
      const rect = button.getBoundingClientRect?.();
      return Boolean(rect && rect.width > 0 && rect.height > 0)
        && !button.disabled
        && (/^send$/i.test(label) || /^\u53d1\u9001$/.test(label));
    });
    if (candidates.length !== 1) return JSON.stringify({ ok: false, sendReady: false, evidence: 'alibaba_webmail_send_button_not_unique', count: candidates.length });
    const button = candidates[0];
    const rect = button.getBoundingClientRect();
    return JSON.stringify({
      ok: true,
      sendReady: true,
      evidence: 'alibaba_webmail_send_control_verified',
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
      width: rect.width,
      height: rect.height,
      label: textOf(button),
    });
  })()`;
}

function postSendStateExpression({ subject } = {}) {
  return `(() => {
    const subject = ${serialized(subject)};
    const fields = ${composeFieldsExpression()};
    const text = document.body?.innerText || '';
    const successToast = /\b(message sent|mail sent)\b|\u53d1\u9001\u6210\u529f|\u90ae\u4ef6\u53d1\u9001\u6210\u529f/i.test(text);
    const composerStillOpen = Boolean(fields.subjectInput && String(fields.subjectInput.value ?? fields.subjectInput.innerText ?? fields.subjectInput.textContent ?? '').trim() === subject);
    const blockingDialog = Array.from(document.querySelectorAll('[role="dialog"],.ant-modal,.next-dialog'))
      .filter(element => element.getClientRects?.().length)
      .map(element => String(element.innerText || element.textContent || '').trim())
      .filter(Boolean)
      .slice(0, 5);
    return JSON.stringify({
      ok: successToast || !composerStillOpen,
      successToast,
      composerStillOpen,
      blockingDialog,
      evidence: successToast
        ? 'alibaba_mail_sent_success_toast'
        : !composerStillOpen
          ? 'alibaba_webmail_composer_closed_after_physical_click'
          : blockingDialog.length
            ? 'alibaba_webmail_send_blocking_dialog_visible'
            : 'alibaba_webmail_composer_still_open_after_physical_click',
    });
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
    const roots = [document];
    for (let index = 0; index < roots.length; index += 1) {
      const root = roots[index];
      for (const element of root.querySelectorAll('*')) {
        if (element.shadowRoot && !roots.includes(element.shadowRoot)) roots.push(element.shadowRoot);
        if (element.tagName === 'IFRAME') {
          try {
            if (element.contentDocument && !roots.includes(element.contentDocument)) roots.push(element.contentDocument);
          } catch {}
        }
      }
    }
    const rows = roots.flatMap(root => Array.from(root.querySelectorAll('article,tr,[role="row"],li')));
    const match = rows.find(row => String(row.innerText || row.textContent || '').includes(subject));
    return JSON.stringify({ ok: Boolean(match), confirmed: Boolean(match), evidence: match ? 'sent_folder_record_confirmed' : 'sent_folder_record_missing', subject });
  })()`;
}

module.exports = { ALIBABA_WEBMAIL_SENT_URL, composeStartExpression, composeFillExpression, composeRecipientFocusExpression, composeSubjectFocusExpression, composeInspectionExpression, composeSendExpression, postSendStateExpression, sendToastExpression, sentFolderConfirmationExpression };
