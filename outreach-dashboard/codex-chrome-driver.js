'use strict';

const http = require('http');

function httpJson(url, timeoutMs = 2500, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { timeout: timeoutMs, method }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on('timeout', () => req.destroy(new Error(`Timeout: ${url}`)));
    req.on('error', reject);
    req.end();
  });
}

function cdp(wsUrl, method, params = {}, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const id = 1;
    const timer = setTimeout(() => {
      try { ws.close(); } catch {}
      reject(new Error(`CDP timeout: ${method}`));
    }, timeoutMs);
    ws.onopen = () => ws.send(JSON.stringify({ id, method, params }));
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      clearTimeout(timer);
      ws.close();
      if (message.error) reject(new Error(message.error.message || JSON.stringify(message.error)));
      else resolve(message.result || null);
    };
    ws.onerror = () => {
      clearTimeout(timer);
      reject(new Error(`CDP websocket error: ${method}`));
    };
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForJson(tab, expression, accepts, timeoutMs = 15000, intervalMs = 500) {
  const deadline = Date.now() + timeoutMs;
  let last = null;
  while (Date.now() < deadline) {
    try {
      last = await evaluateJson(tab, expression, Math.min(5000, timeoutMs));
      if (accepts(last)) return last;
    } catch (error) {
      last = { error: error.message || String(error) };
    }
    await sleep(intervalMs);
  }
  return last;
}

async function findTab(port, tabId, targetUrl) {
  const tabs = await httpJson(`http://127.0.0.1:${port}/json`, 2500);
  return tabs.find(tab => tab.id === tabId)
    || tabs.find(tab => targetUrl && tab.url === targetUrl)
    || tabs.find(tab => targetUrl && tab.url && tab.url.replace(/\/+$/, '') === targetUrl.replace(/\/+$/, ''));
}

async function evaluateJson(tab, expression, timeoutMs = 8000) {
  const result = await cdp(tab.webSocketDebuggerUrl, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
  }, timeoutMs);
  if (result && result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || 'Runtime.evaluate exception');
  }
  return JSON.parse(result && result.result && result.result.value || 'null');
}

async function clickAt(tab, x, y) {
  await cdp(tab.webSocketDebuggerUrl, 'Page.bringToFront', {}, 6000).catch(() => null);
  try {
    await cdp(tab.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, button: 'none' }, 6000);
    await cdp(tab.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 }, 6000);
    await cdp(tab.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 }, 6000);
  } catch (error) {
    const domClicked = await evaluateJson(tab, `
      (() => {
        const el = document.elementFromPoint(${Math.round(Number(x) || 0)}, ${Math.round(Number(y) || 0)});
        if (!el) return false;
        const target = el.closest('button,a,[role="button"],[contenteditable="true"],textarea,input') || el;
        target.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }));
        target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
        target.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
        target.click();
        return true;
      })()
    `, 6000).catch(() => false);
    if (!domClicked) throw error;
  }
}

async function pressEnter(tab) {
  await cdp(tab.webSocketDebuggerUrl, 'Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Enter',
    code: 'Enter',
    windowsVirtualKeyCode: 13,
  }, 2000);
  await cdp(tab.webSocketDebuggerUrl, 'Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Enter',
    code: 'Enter',
    windowsVirtualKeyCode: 13,
  }, 2000);
}

function hostPlatform(targetUrl) {
  try {
    const hostname = new URL(targetUrl || '').hostname.toLowerCase();
    if (hostname.includes('instagram.com')) return 'instagram';
    if (hostname.includes('facebook.com')) return 'facebook';
    if (hostname.includes('linkedin.com')) return 'linkedin';
  } catch {
    // Fall through to generic social behavior.
  }
  return 'social';
}

function buttonExpression(keywords) {
  return `(() => {
    const keywords = ${JSON.stringify(keywords)};
    const controls = Array.from(document.querySelectorAll('button,a,div[role="button"],span[role="button"]')).map((el) => {
      const rect = el.getBoundingClientRect();
      const text = String(el.innerText || el.textContent || el.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim().toLowerCase();
      return {
        text,
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2),
        visible: rect.width > 0 && rect.height > 0
      };
    });
    return JSON.stringify(controls.find(item => item.visible && keywords.some(keyword => item.text.includes(keyword))) || null);
  })()`;
}

function composerExpression(platform) {
  return `(() => {
    const platform = ${JSON.stringify(platform)};
    const visible = (el) => {
      const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0);
    };
    const dialogTextboxes = Array.from(document.querySelectorAll('[role="dialog"] [contenteditable="true"],[role="dialog"] textarea,[role="dialog"] input[type="text"],[aria-modal="true"] [contenteditable="true"],[aria-modal="true"] textarea,[aria-modal="true"] input[type="text"]'));
    const pageTextboxes = Array.from(document.querySelectorAll('[contenteditable="true"],textarea,input[type="text"]'));
    const elements = [...dialogTextboxes, ...pageTextboxes].filter((el, index, list) => list.indexOf(el) === index).map((el) => {
      const rect = el.getBoundingClientRect();
      const label = String(el.getAttribute('aria-label') || '').toLowerCase();
      const placeholder = String(el.getAttribute('placeholder') || '').toLowerCase();
      const text = String(el.innerText || el.value || '').trim();
      const editable = el.getAttribute('contenteditable') === 'true' || el.tagName === 'TEXTAREA' || el.tagName === 'INPUT';
      const messageLike = label.includes('message') || placeholder.includes('message')
        || label.includes('\\u6d88\\u606f') || placeholder.includes('\\u6d88\\u606f')
        || label.includes('write') || placeholder.includes('write')
        || label.includes('text') || placeholder.includes('text')
        || label.includes('messenger') || placeholder.includes('messenger')
        || platform === 'facebook' || platform === 'instagram';
      const inDialog = Boolean(el.closest('[role="dialog"],[aria-modal="true"]'));
      return {
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2),
        text,
        visible: visible(el),
        inDialog,
        match: visible(el) && editable && messageLike
      };
    });
    return JSON.stringify(
      elements.find(item => item.match && item.inDialog)
      || elements.find(item => item.match)
      || elements.find(item => item.visible && item.inDialog)
      || elements.find(item => item.visible)
      || null
    );
  })()`;
}

function dismissDialogExpression() {
  return `(() => {
    const visible = (el) => {
      const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0);
    };
    const words = ['not now', 'skip', 'later', '\\u4ee5\\u540e\\u518d\\u8bf4', '\\u7a0d\\u540e', '\\u53d6\\u6d88'];
    const controls = Array.from(document.querySelectorAll('[role="dialog"] button,[aria-modal="true"] button,button,div[role="button"],span[role="button"]'))
      .filter(visible)
      .map((el) => ({
        el,
        text: String(el.innerText || el.textContent || el.getAttribute('aria-label') || '').trim().toLowerCase()
      }));
    const button = controls.find(item => words.some(word => item.text.includes(word)));
    if (button) {
      button.el.click();
      return JSON.stringify({ clicked: true, text: button.text });
    }
    return JSON.stringify({ clicked: false });
  })()`;
}

function sendButtonExpression(composer) {
  const centerX = Number(composer && composer.x || 0);
  const centerY = Number(composer && composer.y || 0);
  return `(() => {
    const centerX = ${JSON.stringify(centerX)};
    const centerY = ${JSON.stringify(centerY)};
    const controls = Array.from(document.querySelectorAll('button,div[role="button"],span[role="button"]')).map((el) => {
      const rect = el.getBoundingClientRect();
      const text = String(el.innerText || el.textContent || el.getAttribute('aria-label') || '').trim().toLowerCase();
      return {
        text,
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2),
        visible: rect.width > 0 && rect.height > 0,
        disabled: Boolean(el.disabled || el.getAttribute('aria-disabled') === 'true')
      };
    }).filter(item => item.visible && !item.disabled);
    const byText = controls.find(item => item.text.includes('send') || item.text.includes('\\u53d1\\u9001'));
    if (byText) return JSON.stringify(byText);
    const nearComposer = controls
      .filter(item => item.x > centerX && Math.abs(item.y - centerY) < 95)
      .filter(item => !/emoji|gif|sticker|photo|image|voice|microphone|like|thumb|share|forward|repost|\\u8868\\u60c5|\\u56fe\\u7247|\\u8d5e|\\u5206\\u4eab|\\u8f6c\\u53d1|\\u53d1\\u9001\\u7ed9\\u597d\\u53cb/.test(item.text))
      .sort((a, b) => Math.abs(a.y - centerY) - Math.abs(b.y - centerY) || b.x - a.x)[0];
    if (nearComposer) return JSON.stringify(nearComposer);
    const rightMost = controls
      .filter(item => item.x > centerX && Math.abs(item.y - centerY) < 95)
      .sort((a, b) => Math.abs(a.y - centerY) - Math.abs(b.y - centerY) || b.x - a.x)[0];
    return JSON.stringify(rightMost || null);
  })()`;
}

function composerTextExpression(draft) {
  return `(() => {
    const draft = ${JSON.stringify(String(draft || '').trim())};
    const text = Array.from(document.querySelectorAll('[contenteditable="true"],textarea,input[type="text"]'))
      .map((el) => String(el.innerText || el.value || '').trim())
      .join('\\n');
    return JSON.stringify({ text, containsDraft: Boolean(draft && text.includes(draft.slice(0, Math.min(40, draft.length)))) });
  })()`;
}

function identityCheckExpression(expectedCompany, targetUrl) {
  return `(() => {
    const expectedCompany = ${JSON.stringify(String(expectedCompany || '').trim())};
    const targetUrl = ${JSON.stringify(String(targetUrl || '').trim())};
    const normalize = (value) => String(value || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
    const compact = (value) => normalize(value).replace(/\\s+/g, '');
    const expected = normalize(expectedCompany);
    const expectedCompact = compact(expectedCompany);
    const pathCompact = (() => {
      try {
        return compact(new URL(targetUrl).pathname.replace(/^\\/+/, '').split('/')[0] || '');
      } catch {
        return '';
      }
    })();
    const title = String(document.title || '');
    const headers = Array.from(document.querySelectorAll('h1,h2,strong,a[aria-label],div[role="main"] span'))
      .slice(0, 80)
      .map(el => String(el.innerText || el.textContent || el.getAttribute('aria-label') || '').trim())
      .filter(Boolean)
      .join(' | ');
    const visible = [title, headers, String(document.body && document.body.innerText || '').slice(0, 1200)].join('\\n');
    const visibleCompact = compact(visible);
    const companyOk = expectedCompact && visibleCompact.includes(expectedCompact);
    const pathOk = pathCompact && visibleCompact.includes(pathCompact);
    const ok = !expectedCompact || companyOk || (pathCompact.length >= 5 && pathOk);
    return JSON.stringify({
      ok,
      expectedCompany,
      title,
      url: location.href,
      evidence: ok ? 'identity_match' : ('identity_mismatch_expected_' + expectedCompany + '_title_' + title).slice(0, 300)
    });
  })()`;
}

function sideEffectButtonExpression(kind, platform) {
  const keywords = kind === 'follow'
    ? ['follow', '\\u5173\\u6ce8']
    : ['like', '\\u8d5e', '\\u559c\\u6b22', '\\u7559\\u4e0b\\u5fc3\\u60c5'];
  const negative = kind === 'follow'
    ? ['following', '\\u5df2\\u5173\\u6ce8']
    : ['unlike', 'share', 'forward', 'repost', '\\u5df2\\u8d5e', '\\u53d6\\u6d88\\u8d5e', '\\u5206\\u4eab', '\\u8f6c\\u53d1', '\\u53d1\\u9001\\u7ed9\\u597d\\u53cb'];
  return `(() => {
    const keywords = ${JSON.stringify(keywords)};
    const negative = ${JSON.stringify(negative)};
    const controls = Array.from(document.querySelectorAll('button,a,div[role="button"],span[role="button"]')).map((el) => {
      const rect = el.getBoundingClientRect();
      const text = String(el.innerText || el.textContent || el.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim().toLowerCase();
      return {
        text,
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2),
        visible: rect.width > 0 && rect.height > 0,
        disabled: Boolean(el.disabled || el.getAttribute('aria-disabled') === 'true')
      };
    }).filter(item => item.visible && !item.disabled);
    const exact = controls.find(item => keywords.some(keyword => item.text === keyword) && !negative.some(word => item.text.includes(word)));
    const found = exact || controls.find(item => keywords.some(keyword => item.text.includes(keyword)) && !negative.some(word => item.text.includes(word)));
    return JSON.stringify(found || null);
  })()`;
}

async function clickOptionalAction(tab, kind, platform) {
  const button = await evaluateJson(tab, sideEffectButtonExpression(kind, platform), 3000).catch(() => null);
  if (!button || !Number.isFinite(button.x) || !Number.isFinite(button.y)) {
    return `${kind}_not_available`;
  }
  await clickAt(tab, button.x, button.y);
  await sleep(800);
  return `${kind}_clicked`;
}

function commentBoxExpression() {
  return `(() => {
    const visible = (el) => {
      const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight);
    };
    const box = Array.from(document.querySelectorAll('[contenteditable="true"],[role="textbox"],textarea'))
      .find((el) => {
        const label = String(el.getAttribute('aria-label') || '').toLowerCase();
        return label.includes('comment') || label.includes('\\u5199\\u8bc4\\u8bba') || label.includes('\\u53d1\\u8868\\u8bc4\\u8bba');
      });
    if (!box) return JSON.stringify(null);
    if (!visible(box)) box.scrollIntoView({ block: 'center' });
    const rect = box.getBoundingClientRect();
    return JSON.stringify({
      x: Math.round(rect.left + rect.width / 2),
      y: Math.round(rect.top + rect.height / 2),
      visible: rect.width > 0 && rect.height > 0,
      label: String(box.getAttribute('aria-label') || '')
    });
  })()`;
}

async function submitOptionalComment(tab, text) {
  const comment = String(text || '').trim();
  if (!comment) return 'comment_not_configured';
  const box = await evaluateJson(tab, commentBoxExpression(), 3000).catch(() => null);
  if (!box || !Number.isFinite(box.x) || !Number.isFinite(box.y)) return 'comment_not_available';
  await clickAt(tab, box.x, box.y);
  await sleep(500);
  await cdp(tab.webSocketDebuggerUrl, 'Input.insertText', { text: comment }, 5000);
  await sleep(300);
  await pressEnter(tab);
  await sleep(1200);
  return 'comment_submitted';
}

function conversationContextExpression() {
  return `(() => {
    const visible = (el) => {
      const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0);
    };
    const dialog = Array.from(document.querySelectorAll('[role="dialog"], section, main'))
      .filter(visible)
      .map((el) => String(el.innerText || el.textContent || '').trim())
      .filter(Boolean)
      .sort((a, b) => b.length - a.length)[0] || '';
    const body = String(document.body && document.body.innerText || '').trim();
    const text = (dialog || body).replace(/\\n{3,}/g, '\\n\\n').slice(-5000);
    return JSON.stringify({ title: document.title, url: location.href, text });
  })()`;
}

function unavailableProfileExpression(platform) {
  return `(() => {
    const platform = ${JSON.stringify(platform)};
    const text = String(document.body && document.body.innerText || '').toLowerCase();
    const title = String(document.title || '').toLowerCase();
    const patterns = [
      "sorry, this page isn't available",
      'the link you followed may be broken',
      "content isn't available",
      "this content isn't available",
      "page isn't available",
      '\\u5f88\\u62b1\\u6b49\\uff0c\\u65e0\\u6cd5\\u8bbf\\u95ee\\u6b64\\u9875\\u9762',
      '\\u4f60\\u70b9\\u51fb\\u7684\\u94fe\\u63a5\\u53ef\\u80fd\\u5df2\\u635f\\u574f',
      '\\u9875\\u9762\\u5df2\\u88ab\\u79fb\\u9664'
    ];
    const unavailable = patterns.some(pattern => text.includes(pattern) || title.includes(pattern));
    return JSON.stringify({
      unavailable,
      platform,
      url: location.href,
      title: document.title || '',
      evidence: unavailable ? text.slice(0, 600) : ''
    });
  })()`;
}

async function ensureComposerOpen(tab, port, platform) {
  await httpJson(`http://127.0.0.1:${port}/json/activate/${tab.id}`, 1500).catch(() => null);
  await cdp(tab.webSocketDebuggerUrl, 'Page.bringToFront', {}, 2000);

  await waitForJson(tab, `(() => JSON.stringify({
    ready: document.readyState,
    url: location.href,
    visibleControls: Array.from(document.querySelectorAll('button,a,div[role="button"]')).filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }).length
  }))()`, item => item && item.ready === 'complete' && item.visibleControls > 0, 15000, 500);

  const unavailable = await evaluateJson(tab, unavailableProfileExpression(platform), 5000).catch(() => null);
  if (unavailable && unavailable.unavailable) {
    return {
      unavailable: true,
      evidence: `${platform}_unavailable_profile_page: ${unavailable.evidence || unavailable.title || unavailable.url}`,
    };
  }

  let composer = await waitForJson(tab, composerExpression(platform), item => item && item.visible, 1200, 300);
  if (composer && Number.isFinite(composer.x)) return composer;
  await evaluateJson(tab, dismissDialogExpression(), 2000).catch(() => null);

  const keywordsByPlatform = {
    instagram: ['message', '\\u53d1\\u6d88\\u606f', '\\u53d1\\u9001\\u6d88\\u606f'],
    facebook: ['message', 'send message', 'messenger', '\\u53d1\\u6d88\\u606f', '\\u53d1\\u9001\\u6d88\\u606f', '\\u6d88\\u606f'],
    linkedin: ['message', '\\u53d1\\u6d88\\u606f', '\\u53d1\\u9001\\u6d88\\u606f'],
    social: ['message', 'contact', '\\u53d1\\u6d88\\u606f', '\\u53d1\\u9001\\u6d88\\u606f', '\\u6d88\\u606f'],
  };
  const keywords = keywordsByPlatform[platform] || keywordsByPlatform.social;
  const button = await waitForJson(tab, buttonExpression(keywords), item => item && Number.isFinite(item.x) && Number.isFinite(item.y), 12000, 500);
  if (!button || !Number.isFinite(button.x)) {
    if (platform === 'instagram') {
      await clickAt(tab, 615, 336);
    } else {
      return null;
    }
  } else {
    await clickAt(tab, button.x, button.y);
  }
  await sleep(900);
  await evaluateJson(tab, dismissDialogExpression(), 2000).catch(() => null);
  composer = await waitForJson(tab, composerExpression(platform), item => item && item.visible, 25000, 500);
  if (!composer || !Number.isFinite(composer.x)) {
    await evaluateJson(tab, dismissDialogExpression(), 2000).catch(() => null);
    composer = await waitForJson(tab, composerExpression(platform), item => item && item.visible, 8000, 500);
  }
  return composer && Number.isFinite(composer.x) ? composer : null;
}

async function preparePlatformDraft(payload, platform) {
  const port = Number(payload.port || 9224);
  const tab = await findTab(port, payload.tabId, payload.targetUrl);
  if (!tab || !tab.webSocketDebuggerUrl) {
    return { ok: false, sendStatus: 'failed_open', evidence: 'chrome_target_not_found' };
  }

  const identity = await evaluateJson(tab, identityCheckExpression(payload.expectedCompany, payload.targetUrl), 5000).catch(() => null);
  if (identity && identity.ok === false) {
    return {
      ok: false,
      sendStatus: 'failed_open',
      evidence: identity.evidence || `${platform}_identity_mismatch`,
      nextAction: 'Wrong or unmatched account opened; record as major bug and move to next verified customer.',
    };
  }

  const preActions = [];
  if (payload.autoEngage) {
    preActions.push(await submitOptionalComment(tab, payload.engagementComment || 'Great outdoor checklist. Useful reminder for hikers preparing a complete, lightweight kit.'));
    preActions.push(await clickOptionalAction(tab, 'like', platform));
    preActions.push(await clickOptionalAction(tab, 'follow', platform));
  }

  const composer = await ensureComposerOpen(tab, port, platform);
  if (composer && composer.unavailable) {
    return {
      ok: false,
      sendStatus: 'failed_open',
      evidence: composer.evidence || `${platform}_unavailable_profile_page`,
      nextAction: 'Do not retry this URL; switch to a verified alternate channel or official website contact.',
    };
  }
  if (!composer || !Number.isFinite(composer.x)) {
    return {
      ok: false,
      sendStatus: 'failed_open',
      evidence: `${platform}_message_button_clicked_composer_not_found`,
      nextAction: 'Composer not detected; pause automation and notify operator only if retry would be unsafe.',
    };
  }
  const draft = String(payload.draft || '').trim();
  if (!draft) {
    return { ok: false, sendStatus: 'failed_open', evidence: `${platform}_message_composer_opened_no_draft` };
  }
  if (composer.text && !payload.replaceExistingDraft && !payload.autoSend) {
    return { ok: true, sendStatus: 'draft_already_present', evidence: `${platform}_message_composer_already_contains_text` };
  }

  await clickAt(tab, composer.x, composer.y);
  if (composer.text && (payload.replaceExistingDraft || payload.autoSend)) {
    await cdp(tab.webSocketDebuggerUrl, 'Input.dispatchKeyEvent', {
      type: 'keyDown',
      key: 'a',
      code: 'KeyA',
      windowsVirtualKeyCode: 65,
      modifiers: 2,
    }, 2000);
    await cdp(tab.webSocketDebuggerUrl, 'Input.dispatchKeyEvent', {
      type: 'keyUp',
      key: 'a',
      code: 'KeyA',
      windowsVirtualKeyCode: 65,
      modifiers: 2,
    }, 2000);
    await cdp(tab.webSocketDebuggerUrl, 'Input.dispatchKeyEvent', {
      type: 'keyDown',
      key: 'Backspace',
      code: 'Backspace',
      windowsVirtualKeyCode: 8,
    }, 2000);
    await cdp(tab.webSocketDebuggerUrl, 'Input.dispatchKeyEvent', {
      type: 'keyUp',
      key: 'Backspace',
      code: 'Backspace',
      windowsVirtualKeyCode: 8,
    }, 2000);
    await sleep(300);
  }
  await cdp(tab.webSocketDebuggerUrl, 'Input.insertText', { text: draft }, 5000);
  if (payload.autoSend) {
    await sleep(800);
    const sendButton = await waitForJson(tab, sendButtonExpression(composer), item => item && Number.isFinite(item.x) && Number.isFinite(item.y), 8000, 400);
    if (!sendButton || !Number.isFinite(sendButton.x)) {
      return {
        ok: false,
        sendStatus: 'send_unconfirmed',
        evidence: `${platform}_draft_inserted_send_button_not_found`,
        nextAction: 'Draft inserted but Send button was not detected; pause to avoid unsafe duplicate sending.',
      };
    }
    await clickAt(tab, sendButton.x, sendButton.y);
    const sent = await waitForJson(tab, composerTextExpression(draft), item => item && !item.containsDraft, 12000, 500);
    if (sent && !sent.containsDraft) {
      return {
        ok: true,
        sendStatus: 'sent_confirmed',
        evidence: `${platform}_message_sent_confirmed_composer_cleared;${preActions.filter(Boolean).join(';')}`,
        nextAction: 'Record outcome and monitor for reply.',
      };
    }
    return {
      ok: false,
      sendStatus: 'send_unconfirmed',
      evidence: `${platform}_send_clicked_but_confirmation_missing`,
      nextAction: 'Send confirmation missing; pause and notify operator before any retry to avoid duplicate sending.',
    };
  }
  return {
    ok: true,
    sendStatus: 'draft_prepared',
    evidence: `${platform}_message_composer_opened_and_draft_inserted_no_send`,
    nextAction: 'Draft prepared but auto-send was not requested; enable auto-send for full automation.',
  };
}

async function inspectSocialContext(payload) {
  const port = Number(payload.port || 9224);
  const platform = hostPlatform(payload.targetUrl);
  const tab = await findTab(port, payload.tabId, payload.targetUrl);
  if (!tab || !tab.webSocketDebuggerUrl) {
    return { ok: false, evidence: 'chrome_target_not_found', contextText: '' };
  }
  const composer = await ensureComposerOpen(tab, port, platform);
  const context = await evaluateJson(tab, conversationContextExpression(), 8000).catch(() => null);
  return {
    ok: Boolean(context && context.text),
    platform,
    composerOpen: Boolean(composer),
    contextText: context && context.text || '',
    title: context && context.title || tab.title || '',
    url: context && context.url || tab.url || payload.targetUrl || '',
    evidence: context && context.text ? `${platform}_conversation_context_collected` : `${platform}_conversation_context_unavailable`,
  };
}

async function prepareInstagramDraft(payload) {
  return preparePlatformDraft(payload, 'instagram');
}

async function prepareSocialDraft(payload) {
  return preparePlatformDraft(payload, hostPlatform(payload.targetUrl));
}

async function main() {
  const command = process.argv[2];
  const payload = JSON.parse(process.argv[3] || '{}');
  let result;
  if (command === 'prepare-instagram-draft') result = await prepareInstagramDraft(payload);
  else if (command === 'prepare-social-draft') result = await prepareSocialDraft(payload);
  else if (command === 'inspect-social-context') result = await inspectSocialContext(payload);
  else throw new Error(`Unknown command: ${command}`);
  process.stdout.write(JSON.stringify(result));
}

if (require.main === module) {
  main().catch(error => {
    process.stdout.write(JSON.stringify({
      ok: false,
      sendStatus: 'failed_open',
      evidence: `driver_error: ${error.message || error}`,
    }));
    process.exitCode = 1;
  });
}
