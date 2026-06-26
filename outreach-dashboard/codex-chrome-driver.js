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
  await cdp(tab.webSocketDebuggerUrl, 'Page.bringToFront', {}, 2000);
  await cdp(tab.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, button: 'none' }, 2000);
  await cdp(tab.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 }, 2000);
  await cdp(tab.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 }, 2000);
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
      const text = String(el.innerText || el.textContent || el.getAttribute('aria-label') || '').trim().toLowerCase();
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
    const elements = Array.from(document.querySelectorAll('[contenteditable="true"],textarea,input[type="text"]')).map((el) => {
      const rect = el.getBoundingClientRect();
      const label = String(el.getAttribute('aria-label') || '').toLowerCase();
      const placeholder = String(el.getAttribute('placeholder') || '').toLowerCase();
      const text = String(el.innerText || el.value || '').trim();
      const visible = rect.width > 0 && rect.height > 0;
      const editable = el.getAttribute('contenteditable') === 'true' || el.tagName === 'TEXTAREA' || el.tagName === 'INPUT';
      const messageLike = label.includes('message') || placeholder.includes('message')
        || label.includes('\\u6d88\\u606f') || placeholder.includes('\\u6d88\\u606f')
        || label.includes('messenger') || placeholder.includes('messenger')
        || platform === 'facebook' || platform === 'instagram';
      return {
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2),
        text,
        visible,
        match: visible && editable && messageLike
      };
    });
    return JSON.stringify(elements.find(item => item.match) || elements.find(item => item.visible) || null);
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
      .sort((a, b) => Math.abs(a.y - centerY) - Math.abs(b.y - centerY) || a.x - b.x)[0];
    return JSON.stringify(nearComposer || null);
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

  let composer = await waitForJson(tab, composerExpression(platform), item => item && item.visible, 1200, 300);
  if (composer && Number.isFinite(composer.x)) return composer;

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
  composer = await waitForJson(tab, composerExpression(platform), item => item && item.visible, 15000, 500);
  return composer && Number.isFinite(composer.x) ? composer : null;
}

async function preparePlatformDraft(payload, platform) {
  const port = Number(payload.port || 9224);
  const tab = await findTab(port, payload.tabId, payload.targetUrl);
  if (!tab || !tab.webSocketDebuggerUrl) {
    return { ok: false, sendStatus: 'approval_pending', evidence: 'chrome_target_not_found' };
  }

  const composer = await ensureComposerOpen(tab, port, platform);
  if (!composer || !Number.isFinite(composer.x)) {
    return {
      ok: false,
      sendStatus: 'approval_pending',
      evidence: `${platform}_message_button_clicked_composer_not_found`,
      nextAction: 'Message panel opened but composer was not detected; finish manually without duplicate sending.',
    };
  }
  const draft = String(payload.draft || '').trim();
  if (!draft) {
    return { ok: false, sendStatus: 'approval_pending', evidence: `${platform}_message_composer_opened_no_draft` };
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
        nextAction: 'Draft inserted but Send button was not detected; review manually.',
      };
    }
    await clickAt(tab, sendButton.x, sendButton.y);
    const sent = await waitForJson(tab, composerTextExpression(draft), item => item && !item.containsDraft, 12000, 500);
    if (sent && !sent.containsDraft) {
      return {
        ok: true,
        sendStatus: 'sent_confirmed',
        evidence: `${platform}_message_sent_confirmed_composer_cleared`,
        nextAction: 'Record outcome and monitor for reply.',
      };
    }
    return {
      ok: false,
      sendStatus: 'send_unconfirmed',
      evidence: `${platform}_send_clicked_but_confirmation_missing`,
      nextAction: 'Check the chat manually before any retry to avoid duplicate sending.',
    };
  }
  return {
    ok: true,
    sendStatus: 'draft_prepared',
    evidence: `${platform}_message_composer_opened_and_draft_inserted_no_send`,
    nextAction: 'Review the prepared draft and click Send manually only after confirmation.',
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
      sendStatus: 'approval_pending',
      evidence: `driver_error: ${error.message || error}`,
    }));
    process.exitCode = 1;
  });
}
