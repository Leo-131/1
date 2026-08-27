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
  let lastError = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const tabs = await httpJson(`http://127.0.0.1:${port}/json`, 3500);
      return tabs.find(tab => tab.id === tabId)
        || tabs.find(tab => targetUrl && tab.url === targetUrl)
        || tabs.find(tab => targetUrl && tab.url && tab.url.replace(/\/+$/, '') === targetUrl.replace(/\/+$/, ''));
    } catch (error) {
      lastError = error;
      if (attempt < 2) await sleep(500 * (attempt + 1));
    }
  }
  throw lastError || new Error(`Chrome target list unavailable on port ${port}`);
}

async function evaluateJson(tab, expression, timeoutMs = 8000) {
  const result = await cdp(tab.webSocketDebuggerUrl, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
  }, timeoutMs);
  if (result && result.exceptionDetails) {
    const detail = result.exceptionDetails.exception
      && (result.exceptionDetails.exception.description || result.exceptionDetails.exception.value);
    throw new Error(detail || result.exceptionDetails.text || 'Runtime.evaluate exception');
  }
  return JSON.parse(result && result.result && result.result.value || 'null');
}

async function clickAt(tab, x, y) {
  await cdp(tab.webSocketDebuggerUrl, 'Page.bringToFront', {}, 6000).catch(() => null);
  try {
    await cdp(tab.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, button: 'none' }, 6000);
    await cdp(tab.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1 }, 6000);
    await cdp(tab.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', buttons: 0, clickCount: 1 }, 6000);
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

async function pressEscape(tab) {
  await cdp(tab.webSocketDebuggerUrl, 'Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Escape',
    code: 'Escape',
    windowsVirtualKeyCode: 27,
  }, 2000);
  await cdp(tab.webSocketDebuggerUrl, 'Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Escape',
    code: 'Escape',
    windowsVirtualKeyCode: 27,
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
      const text = String(el.getAttribute('aria-label') || el.innerText || el.textContent || '').replace(/\\s+/g, ' ').trim().toLowerCase();
      return {
        text,
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2),
        visible: rect.width > 0 && rect.height > 0,
        inNav: Boolean(el.closest('nav,[role="navigation"]')),
        disabled: Boolean(el.disabled || el.getAttribute('aria-disabled') === 'true')
      };
    });
    return JSON.stringify(controls.find(item => item.visible && !item.disabled && !item.inNav && keywords.some(keyword => item.text.includes(keyword)))
      || controls.find(item => item.visible && !item.disabled && keywords.some(keyword => item.text.includes(keyword)))
      || null);
  })()`;
}

function closeBlockingOverlayExpression(platform) {
  return `(() => {
    const platform = ${JSON.stringify(platform)};
    const visible = (el) => {
      const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0);
    };
    const dialog = Array.from(document.querySelectorAll('[role="dialog"],[aria-modal="true"]'))
      .filter(visible)
      .map((el) => ({
        el,
        text: String(el.innerText || el.textContent || '').replace(/\\s+/g, ' ').trim().toLowerCase(),
        rect: el.getBoundingClientRect(),
      }))
      .filter(item => item.rect.width > 260 && item.rect.height > 220)
      .sort((a, b) => b.rect.width * b.rect.height - a.rect.width * a.rect.height)[0];
    if (!dialog) return JSON.stringify({ clicked: false, reason: 'no_overlay' });
    const looksLikeInbox = platform === 'instagram'
      && (dialog.text.includes('message') || dialog.text.includes('\\u6d88\\u606f'))
      && (dialog.text.includes('new message') || dialog.text.includes('\\u65b0\\u6d88\\u606f') || dialog.text.includes('\\u5173\\u95ed') || dialog.rect.left > window.innerWidth * 0.35);
    if (!looksLikeInbox) return JSON.stringify({ clicked: false, reason: 'overlay_not_blocking' });
    const closeWords = ['close', '\\u5173\\u95ed'];
    const controls = Array.from(dialog.el.querySelectorAll('button,div[role="button"],span[role="button"],svg[aria-label]'))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const text = String(el.getAttribute('aria-label') || el.innerText || el.textContent || '').replace(/\\s+/g, ' ').trim().toLowerCase();
        return { el, text, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      });
    const byLabel = controls.find(item => closeWords.some(word => item.text.includes(word)));
    const topRight = controls
      .filter(item => item.x > dialog.rect.left + dialog.rect.width * 0.7 && item.y < dialog.rect.top + 90)
      .sort((a, b) => b.x - a.x || a.y - b.y)[0];
    const button = byLabel || topRight;
    if (!button) return JSON.stringify({ clicked: false, reason: 'close_button_not_found' });
    button.el.click();
    return JSON.stringify({ clicked: true, text: button.text || 'top_right_close' });
  })()`;
}

function closeFacebookChatWindowsExpression() {
  return `(() => {
    const visible = (el) => {
      const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight);
    };
    const closeButtons = Array.from(document.querySelectorAll('div[aria-label],button[aria-label],[role="button"][aria-label]'))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const label = String(el.getAttribute('aria-label') || el.innerText || el.textContent || '').replace(/\\s+/g, ' ').trim().toLowerCase();
        return {
          el,
          label,
          x: Math.round(rect.left + rect.width / 2),
          y: Math.round(rect.top + rect.height / 2),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      })
      .filter(item => item.x > window.innerWidth * 0.45)
      .filter(item => /close chat|close conversation|\\u5173\\u95ed\\u804a\\u5929\\u7a97\\u53e3|\\u5173\\u95ed\\u5bf9\\u8bdd|\\u5173\\u95ed/.test(item.label));
    const clicked = [];
    for (const item of closeButtons.slice(0, 4)) {
      item.el.click();
      clicked.push(item.label || 'close_chat_window');
    }
    return JSON.stringify({
      clicked: clicked.length,
      labels: clicked,
      evidence: clicked.length ? 'facebook_stale_chat_windows_closed' : 'facebook_no_stale_chat_windows'
    });
  })()`;
}

async function closeFacebookChatWindows(tab) {
  const evidence = [];
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const result = await evaluateJson(tab, closeFacebookChatWindowsExpression(), 3000).catch(() => null);
    if (!result || !result.clicked) break;
    evidence.push(result.evidence || 'facebook_stale_chat_windows_closed');
    await sleep(500);
  }
  return evidence.join(';') || 'facebook_no_stale_chat_windows';
}

function facebookMessengerInboxOpenExpression() {
  return `(() => {
    const visible = (el) => {
      const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight);
    };
    const dialogs = Array.from(document.querySelectorAll('[role="dialog"],[aria-modal="true"]'))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const text = String(el.innerText || el.textContent || '').replace(/\\s+/g, ' ').trim().toLowerCase();
        return {
          text,
          x: Math.round(rect.left),
          y: Math.round(rect.top),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };
      });
    const inbox = dialogs.find(item => item.x > window.innerWidth * 0.45
      && item.width > 250
      && item.height > 250
      && (item.text.includes('messenger')
        || item.text.includes('chat')
        || item.text.includes('\\u804a\\u5929')
        || item.text.includes('\\u672a\\u8bfb')
        || item.text.includes('\\u7fa4\\u804a')
        || item.text.includes('\\u804a\\u5929\\u8bb0\\u5f55')));
    return JSON.stringify(inbox ? {
      open: true,
      evidence: 'facebook_messenger_inbox_popover_open',
      text: inbox.text.slice(0, 180),
      x: inbox.x,
      y: inbox.y,
      width: inbox.width,
      height: inbox.height
    } : { open: false, evidence: 'facebook_messenger_inbox_popover_not_open' });
  })()`;
}

async function closeFacebookMessengerInbox(tab) {
  const evidence = [];
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const state = await evaluateJson(tab, facebookMessengerInboxOpenExpression(), 2500).catch(() => null);
    if (!state || !state.open) break;
    evidence.push(state.evidence);
    await pressEscape(tab).catch(() => null);
    await sleep(500);
  }
  return evidence.join(';') || 'facebook_messenger_inbox_popover_not_open';
}

function profileMessageButtonExpression(platform, keywords) {
  return `(() => {
    const platform = ${JSON.stringify(platform)};
    const keywords = ${JSON.stringify(keywords)};
    const visible = (el) => {
      const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight);
    };
    const controls = Array.from(document.querySelectorAll('button,a,[role="button"]'))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title'), el.getAttribute('data-testid')]
          .map(value => String(value || '')).join(' ').replace(/\\s+/g, ' ').trim().toLowerCase();
        const inNav = Boolean(el.closest('nav,[role="navigation"]'));
        const inDialog = Boolean(el.closest('[role="dialog"],[aria-modal="true"]'));
        return {
          el,
          text,
          x: Math.round(rect.left + rect.width / 2),
          y: Math.round(rect.top + rect.height / 2),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          inNav,
          inDialog,
          disabled: Boolean(el.disabled || el.getAttribute('aria-disabled') === 'true')
        };
      })
      .filter(item => !item.inNav && !item.inDialog && !item.disabled)
      .filter(item => keywords.some(keyword => item.text.includes(keyword)))
      .filter(item => item.width >= 60 && item.height >= 24);
    const profileZone = controls.filter(item => item.x > 120 && item.y > 80 && item.y < Math.min(window.innerHeight - 80, 720));
    if (platform === 'facebook' && !profileZone.length) return JSON.stringify(null);
    const preferred = (profileZone.length ? profileZone : controls)
      .sort((a, b) => Math.abs(a.y - 420) - Math.abs(b.y - 420) || b.width - a.width)[0];
    if (!preferred) return JSON.stringify(null);
    return JSON.stringify({
      text: preferred.text,
      x: preferred.x,
      y: preferred.y,
      visible: true,
      source: platform + '_profile_message_button'
    });
  })()`;
}

function composerExpression(platform) {
  return `(() => {
    const platform = ${JSON.stringify(platform)};
    const visible = (el) => {
      const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0);
    };
    const dialogTextboxes = Array.from(document.querySelectorAll('[role="dialog"] [contenteditable="true"],[role="dialog"] [role="textbox"],[role="dialog"] textarea,[role="dialog"] input[type="text"],[aria-modal="true"] [contenteditable="true"],[aria-modal="true"] [role="textbox"],[aria-modal="true"] textarea,[aria-modal="true"] input[type="text"]'));
    const pageTextboxes = Array.from(document.querySelectorAll('[contenteditable="true"],[role="textbox"],textarea,input[type="text"]'));
    const elements = [...dialogTextboxes, ...pageTextboxes].filter((el, index, list) => list.indexOf(el) === index).map((el) => {
      const rect = el.getBoundingClientRect();
      const label = String(el.getAttribute('aria-label') || '').toLowerCase();
      const placeholder = String(el.getAttribute('placeholder') || '').toLowerCase();
      const text = String(el.innerText || el.value || '').trim();
      const editable = el.getAttribute('contenteditable') === 'true' || el.getAttribute('role') === 'textbox' || el.tagName === 'TEXTAREA' || el.tagName === 'INPUT';
      const nonMessageInput = /search|comment|caption|filter|find|搜索|评论|查找/.test(label + ' ' + placeholder);
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
        label,
        placeholder,
        visible: visible(el),
        inDialog,
        match: visible(el) && editable && messageLike && !nonMessageInput
      };
    });
    if (platform === 'facebook') {
      const facebookComposer = elements
        .filter(item => item.match && item.inDialog)
        .filter(item => !item.label.includes('comment') && !item.label.includes('\\u5199\\u8bc4\\u8bba') && !item.placeholder.includes('comment') && !item.placeholder.includes('\\u5199\\u8bc4\\u8bba'))
        .filter(item => item.label.includes('message') || item.placeholder.includes('message') || item.label.includes('\\u53d1\\u6d88\\u606f') || item.placeholder.includes('\\u53d1\\u6d88\\u606f') || item.placeholder === 'aa')
        .sort((a, b) => b.y - a.y)[0];
      if (facebookComposer) return JSON.stringify(facebookComposer);
      const floatingMessengerComposer = elements
        .filter(item => item.match && !item.inDialog)
        .filter(item => item.x > window.innerWidth * 0.55 && item.y > window.innerHeight * 0.55)
        .filter(item => !item.label.includes('comment') && !item.label.includes('\\u5199\\u8bc4\\u8bba') && !item.placeholder.includes('comment') && !item.placeholder.includes('\\u5199\\u8bc4\\u8bba'))
        .filter(item => item.label.includes('message')
          || item.placeholder.includes('message')
          || item.label.includes('\\u6d88\\u606f')
          || item.placeholder.includes('\\u6d88\\u606f')
          || item.placeholder === 'aa'
          || (!item.label && !item.placeholder));
      if (floatingMessengerComposer.length) {
        return JSON.stringify(floatingMessengerComposer.sort((a, b) => b.y - a.y || b.x - a.x)[0]);
      }
      return JSON.stringify(null);
    }
    if (platform === 'linkedin') {
      return JSON.stringify(
        elements.filter(item => item.match && item.inDialog).sort((a, b) => b.y - a.y)[0]
        || elements.filter(item => item.visible && item.inDialog && !/search|filter|find/.test(item.label + ' ' + item.placeholder)).sort((a, b) => b.y - a.y)[0]
        || null
      );
    }
    return JSON.stringify(
      elements.filter(item => item.match && item.inDialog).sort((a, b) => b.y - a.y)[0]
      || elements.filter(item => item.match).sort((a, b) => b.y - a.y)[0]
      || elements.find(item => item.visible && item.inDialog)
      || elements.find(item => item.visible)
      || null
    );
  })()`;
}

function facebookStartButtonExpression() {
  return `(() => {
    const visible = (el) => {
      const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight);
    };
    const controls = Array.from(document.querySelectorAll('[role="dialog"] button,[role="dialog"] div[role="button"],[aria-modal="true"] button,[aria-modal="true"] div[role="button"]'))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const text = String(el.innerText || el.textContent || el.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim().toLowerCase();
        return {
          text,
          x: Math.round(rect.left + rect.width / 2),
          y: Math.round(rect.top + rect.height / 2),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          disabled: Boolean(el.disabled || el.getAttribute('aria-disabled') === 'true')
        };
      })
      .filter(item => !item.disabled)
      .filter(item => item.width >= 48 && item.height >= 24);
    const button = controls.find(item => item.text === 'get started' || item.text === 'start' || item.text === '\\u5f00\\u59cb');
    return JSON.stringify(button || null);
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

function instagramPostTileExpression() {
  return `(() => {
    const visible = (el) => {
      const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
      return Boolean(rect && rect.width > 80 && rect.height > 80);
    };
    const mapLink = (el) => {
      if (!visible(el)) return null;
      el.scrollIntoView({ block: 'center', inline: 'center' });
      const rect = el.getBoundingClientRect();
      return {
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2),
        href: el.href || '',
        visible: true,
      };
    };
    const preferred = Array.from(document.querySelectorAll('a[href*="/p/"],a[href*="/reel/"],a[href*="/tv/"]')).map(mapLink).find(Boolean);
    if (preferred) return JSON.stringify(preferred);
    const links = Array.from(document.querySelectorAll('a[href*="/reel/"],a[href*="/tv/"]'))
      .filter(visible)
      .map((el) => {
        el.scrollIntoView({ block: 'center', inline: 'center' });
        const rect = el.getBoundingClientRect();
        return {
          x: Math.round(rect.left + rect.width / 2),
          y: Math.round(rect.top + rect.height / 2),
          href: el.href || '',
          visible: true,
        };
      })
      .sort((a, b) => a.y - b.y || a.x - b.x);
    return JSON.stringify(links[0] || null);
  })()`;
}

function instagramPostLikeButtonExpression() {
  return `(() => {
    const visible = (el) => {
      const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0);
    };
    const dialog = Array.from(document.querySelectorAll('[role="dialog"],[aria-modal="true"],article')).filter(visible)[0] || document;
    const controls = Array.from(dialog.querySelectorAll('button,div[role="button"],span[role="button"],svg[aria-label]'))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const text = String(el.innerText || el.textContent || el.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim().toLowerCase();
        return {
          text,
          x: Math.round(rect.left + rect.width / 2),
          y: Math.round(rect.top + rect.height / 2),
          visible: true,
          disabled: Boolean(el.disabled || el.getAttribute('aria-disabled') === 'true')
        };
      })
      .filter(item => !item.disabled);
    const positive = ['like', '\\u8d5e', '\\u559c\\u6b22'];
    const negative = ['unlike', '\\u53d6\\u6d88\\u8d5e', '\\u5df2\\u8d5e'];
    const button = controls.find(item => positive.some(word => item.text === word || item.text.includes(word)) && !negative.some(word => item.text.includes(word)));
    return JSON.stringify(button || null);
  })()`;
}

function instagramPostCloseExpression() {
  return `(() => {
    const visible = (el) => {
      const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0);
    };
    const closeWords = ['close', '\\u5173\\u95ed'];
    const controls = Array.from(document.querySelectorAll('[role="dialog"] button,[aria-modal="true"] button,button,div[role="button"],svg[aria-label]'))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const text = String(el.innerText || el.textContent || el.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim().toLowerCase();
        return { el, text, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      });
    const button = controls.find(item => closeWords.some(word => item.text.includes(word)))
      || controls.filter(item => item.x > window.innerWidth - 120 && item.y < 120).sort((a, b) => b.x - a.x || a.y - b.y)[0];
    if (!button) return JSON.stringify({ clicked: false });
    button.el.click();
    return JSON.stringify({ clicked: true, text: button.text || 'top_right_close' });
  })()`;
}

function sendButtonExpression(composer) {
  const centerX = Number(composer && composer.x || 0);
  const centerY = Number(composer && composer.y || 0);
  return `(() => {
    const centerX = ${JSON.stringify(centerX)};
    const centerY = ${JSON.stringify(centerY)};
    const controls = Array.from(document.querySelectorAll('button,input[type="submit"],div[role="button"],span[role="button"],[data-testid*="send" i],[data-control-name*="send" i]')).map((el) => {
      const rect = el.getBoundingClientRect();
      const text = String(el.innerText || el.textContent || el.getAttribute('aria-label') || el.getAttribute('title') || el.value || '').trim().toLowerCase();
      const strongSignal = [
        el.getAttribute('data-testid'),
        el.getAttribute('data-control-name'),
        el.getAttribute('name'),
        el.id,
        el.className,
      ].map(value => String(value || '').toLowerCase()).join(' ');
      return {
        text,
        strongSignal,
        submitType: String(el.getAttribute('type') || '').toLowerCase() === 'submit',
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2),
        visible: rect.width > 0 && rect.height > 0,
        disabled: Boolean(el.disabled || el.getAttribute('aria-disabled') === 'true')
      };
    }).filter(item => item.visible && !item.disabled);
    const badSend = /emoji|gif|sticker|photo|image|voice|microphone|like|thumb|share|forward|repost|friend|friends|story|invite|\\u8868\\u60c5|\\u56fe\\u7247|\\u8d5e|\\u5206\\u4eab|\\u8f6c\\u53d1|\\u53d1\\u9001\\u7ed9\\u597d\\u53cb/;
    const sendText = item => /(^|\\b)(send|submit)(\\b|$)|\\u53d1\\u9001|\\u63d0\\u4ea4/.test(item.text) && !badSend.test(item.text);
    const strongSend = item => /(^|[-_\\s])(send|submit)([-_\\s]|$)/.test(item.strongSignal) && !badSend.test(item.strongSignal);
    const nearControls = controls
      .filter(item => item.x > centerX - 40 && Math.abs(item.y - centerY) < 110)
      .filter(item => !badSend.test(item.text));
    const nearExplicitSend = nearControls
      .filter(item => sendText(item) || strongSend(item))
      .sort((a, b) => Math.abs(a.y - centerY) - Math.abs(b.y - centerY) || b.x - a.x)[0];
    if (nearExplicitSend) return JSON.stringify({ ...nearExplicitSend, explicitSendControl: true });
    const byText = controls
      .filter(item => sendText(item) || strongSend(item))
      .sort((a, b) => Math.abs(a.y - centerY) - Math.abs(b.y - centerY) || Math.abs(a.x - centerX) - Math.abs(b.x - centerX))[0];
    if (byText) return JSON.stringify({ ...byText, explicitSendControl: true });
    return JSON.stringify(null);
  })()`;
}

function composerTextExpression(draft) {
  return `(() => {
    const draft = ${JSON.stringify(String(draft || '').trim())};
    const controls = Array.from(document.querySelectorAll('[role="dialog"] [contenteditable="true"],[role="dialog"] [role="textbox"],[role="dialog"] textarea,[role="dialog"] input[type="text"],[aria-modal="true"] [contenteditable="true"],[aria-modal="true"] [role="textbox"],[aria-modal="true"] textarea,[aria-modal="true"] input[type="text"],[contenteditable="true"],[role="textbox"],textarea,input[type="text"]'));
    const text = controls
      .map((el) => String(el.innerText || el.textContent || el.value || '').trim())
      .join('\\n');
    const active = document.activeElement;
    const activeLabel = active ? String(active.getAttribute('aria-label') || active.getAttribute('role') || active.tagName || '').slice(0, 80) : '';
    return JSON.stringify({
      text,
      containsDraft: Boolean(draft && text.includes(draft.slice(0, Math.min(40, draft.length)))),
      editableCount: controls.length,
      textLength: text.length,
      activeLabel
    });
  })()`;
}

function setComposerTextExpression(composer, draft) {
  return `(() => {
    const targetX = ${JSON.stringify(Number(composer && composer.x || 0))};
    const targetY = ${JSON.stringify(Number(composer && composer.y || 0))};
    const draft = ${JSON.stringify(String(draft || '').trim())};
    const visible = (el) => {
      const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight);
    };
    const textOf = (el) => String(el.innerText || el.textContent || el.value || '').trim();
    const pointTarget = (() => {
      const el = document.elementFromPoint(targetX, targetY);
      return el && (
        (el.closest && el.closest('[contenteditable="true"],[role="textbox"],textarea,input[type="text"]'))
        || (el.querySelector && el.querySelector('[contenteditable="true"],[role="textbox"],textarea,input[type="text"]'))
      );
    })();
    const activeTarget = document.activeElement && document.activeElement.closest
      ? document.activeElement.closest('[contenteditable="true"],[role="textbox"],textarea,input[type="text"]')
      : null;
    const candidates = Array.from(document.querySelectorAll('[role="dialog"] [contenteditable="true"],[role="dialog"] [role="textbox"],[role="dialog"] textarea,[role="dialog"] input[type="text"],[aria-modal="true"] [contenteditable="true"],[aria-modal="true"] [role="textbox"],[aria-modal="true"] textarea,[aria-modal="true"] input[type="text"],[contenteditable="true"],[role="textbox"],textarea,input[type="text"]'))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const label = String(el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.getAttribute('role') || '').toLowerCase();
        const inDialog = Boolean(el.closest('[role="dialog"],[aria-modal="true"]'));
        const messageLike = /message|reply|write|text|messenger|^aa$|\\u6d88\\u606f|\\u8f93\\u5165/.test(label);
        return {
          el,
          x: Math.round(rect.left + rect.width / 2),
          y: Math.round(rect.top + rect.height / 2),
          inDialog,
          messageLike,
          pointTarget: el === pointTarget || el.contains(pointTarget),
          activeTarget: el === activeTarget || el.contains(activeTarget),
          distance: Math.abs((rect.left + rect.width / 2) - targetX) + Math.abs((rect.top + rect.height / 2) - targetY),
          textLength: textOf(el).length
        };
      })
      .sort((a, b) => Number(b.pointTarget) - Number(a.pointTarget)
        || Number(b.activeTarget) - Number(a.activeTarget)
        || Number(b.inDialog) - Number(a.inDialog)
        || Number(b.messageLike) - Number(a.messageLike)
        || a.distance - b.distance
        || a.textLength - b.textLength);
    const picked = candidates[0];
    if (!picked) return JSON.stringify({ ok: false, evidence: 'composer_dom_target_not_found' });
    const el = picked.el;
    ['mousedown', 'mouseup', 'click'].forEach((type) => {
      el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
    });
    el.focus();
    if (el.isContentEditable || el.getAttribute('contenteditable') === 'true') {
      const selection = window.getSelection && window.getSelection();
      if (selection && document.createRange) {
        const range = document.createRange();
        range.selectNodeContents(el);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      const inserted = document.execCommand && document.execCommand('insertText', false, draft);
      if (!inserted || !textOf(el).includes(draft.slice(0, Math.min(40, draft.length)))) {
        el.replaceChildren();
        el.appendChild(document.createTextNode(draft));
      }
      el.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, composed: true, inputType: 'insertText', data: draft }));
      el.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true, inputType: 'insertText', data: draft }));
      el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, composed: true, key: ' ' }));
    } else {
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value') && Object.getOwnPropertyDescriptor(proto, 'value').set;
      if (setter) setter.call(el, draft);
      else el.value = draft;
      el.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true, inputType: 'insertText', data: draft }));
      el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
    const finalText = textOf(el);
    return JSON.stringify({
      ok: Boolean(draft && finalText.includes(draft.slice(0, Math.min(40, draft.length)))),
      evidence: 'composer_dom_text_set',
      x: picked.x,
      y: picked.y,
      inDialog: picked.inDialog,
      messageLike: picked.messageLike,
      label: String(el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.getAttribute('role') || '').slice(0, 80),
      textLength: finalText.length
    });
  })()`;
}

function sendConfirmationExpression(draft) {
  return `(() => {
    const draft = ${JSON.stringify(String(draft || '').trim())};
    const normalize = value => String(value || '').replace(/\\s+/g, ' ').trim();
    const normalizedDraft = normalize(draft);
    const sample = normalizedDraft.slice(0, Math.min(80, normalizedDraft.length));
    const controls = Array.from(document.querySelectorAll('[role="dialog"] [contenteditable="true"],[role="dialog"] [role="textbox"],[role="dialog"] textarea,[role="dialog"] input[type="text"],[aria-modal="true"] [contenteditable="true"],[aria-modal="true"] [role="textbox"],[aria-modal="true"] textarea,[aria-modal="true"] input[type="text"],[contenteditable="true"],[role="textbox"],textarea,input[type="text"]'))
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
    const composerText = normalize(controls.map(el => String(el.innerText || el.textContent || el.value || '')).join('\\n'));
    const hasDraftInComposer = Boolean(sample && composerText.includes(sample));
    const visibleTextNodes = Array.from(document.querySelectorAll('div,span,p'))
      .filter(el => !controls.some(control => control === el || control.contains(el) || el.contains(control)))
      .filter(el => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      })
      .filter(el => !Array.from(el.children).some(child => normalize(child.innerText || child.textContent).includes(sample)))
      .map(el => normalize(el.innerText || el.textContent))
      .filter(Boolean);
    const matchedMessageText = visibleTextNodes.find(text => sample && text.includes(sample) && text.includes(normalizedDraft.slice(-Math.min(40, normalizedDraft.length)))) || '';
    const pageText = normalize(document.body && document.body.innerText || '').slice(-12000);
    const sentText = /\\b(sent|delivered|message sent)\\b|\\u5df2\\u53d1\\u9001|\\u6d88\\u606f\\u5df2\\u53d1\\u9001/i.test(pageText);
    const outgoingBubble = Boolean(matchedMessageText && !hasDraftInComposer);
    const emptyComposer = controls.length === 0 || controls.every(el => !String(el.innerText || el.textContent || el.value || '').trim());
    return JSON.stringify({
      confirmed: Boolean(outgoingBubble && !hasDraftInComposer),
      sentText,
      outgoingBubble,
      emptyComposer,
      hasDraftInComposer,
      composerCount: controls.length,
      composerTextLength: composerText.length,
      matchedMessageLength: matchedMessageText.length
    });
  })()`;
}

async function confirmPersistedSentMessage(tab, draft) {
  await cdp(tab.webSocketDebuggerUrl, 'Page.reload', { ignoreCache: true }, 5000);
  await sleep(3500);
  return waitForJson(
    tab,
    sendConfirmationExpression(draft),
    item => item && item.confirmed,
    12000,
    600,
  );
}

async function insertDraftAndVerify(tab, composer, draft, platform) {
  await clickAt(tab, composer.x, composer.y);
  await sleep(300);
  await evaluateJson(tab, setComposerTextExpression(composer, ''), 3000).catch(() => null);
  await cdp(tab.webSocketDebuggerUrl, 'Input.insertText', { text: draft }, 5000);
  let inserted = await waitForJson(tab, composerTextExpression(draft), item => item && item.containsDraft, 2500, 300);
  if (inserted && inserted.containsDraft) return { ok: true, composer, evidence: `${platform}_draft_inserted_verified` };

  const domInserted = await evaluateJson(tab, setComposerTextExpression(composer, draft), 5000).catch(() => null);
  if (domInserted && domInserted.ok) {
    inserted = await waitForJson(tab, composerTextExpression(draft), item => item && item.containsDraft, 2500, 300);
    if (inserted && inserted.containsDraft) {
      return {
        ok: true,
        composer: { ...composer, x: domInserted.x || composer.x, y: domInserted.y || composer.y },
        evidence: `${platform}_draft_inserted_dom_fallback`,
      };
    }
  }

  if (platform === 'facebook') {
    const refreshedComposer = await waitForJson(tab, composerExpression(platform), item => item && item.visible && Number.isFinite(item.x), 5000, 400);
    if (refreshedComposer && Number.isFinite(refreshedComposer.x)) {
      await clickAt(tab, refreshedComposer.x, refreshedComposer.y);
      await sleep(300);
      await cdp(tab.webSocketDebuggerUrl, 'Input.insertText', { text: draft }, 5000);
      inserted = await waitForJson(tab, composerTextExpression(draft), item => item && item.containsDraft, 3500, 300);
      if (inserted && inserted.containsDraft) return { ok: true, composer: refreshedComposer, evidence: 'facebook_draft_inserted_after_composer_refocus' };
      const facebookDomInserted = await evaluateJson(tab, setComposerTextExpression(refreshedComposer, draft), 5000).catch(() => null);
      if (facebookDomInserted && facebookDomInserted.ok) {
        inserted = await waitForJson(tab, composerTextExpression(draft), item => item && item.containsDraft, 2500, 300);
        if (inserted && inserted.containsDraft) {
          return {
            ok: true,
            composer: { ...refreshedComposer, x: facebookDomInserted.x || refreshedComposer.x, y: facebookDomInserted.y || refreshedComposer.y },
            evidence: 'facebook_draft_inserted_dom_fallback_after_refocus',
          };
        }
      }
      const diagnostic = inserted || await evaluateJson(tab, composerTextExpression(draft), 3000).catch(() => null);
      const detail = diagnostic
        ? `editable_count:${diagnostic.editableCount || 0};composer_text_length:${diagnostic.textLength || 0};active:${String(diagnostic.activeLabel || 'unknown').replace(/[;\\r\\n]+/g, ' ').slice(0, 80)}`
        : 'composer_diagnostic_unavailable';
      return { ok: false, composer: refreshedComposer, evidence: `facebook_draft_not_inserted_after_composer_refocus;${detail}` };
    }
  }

  return { ok: false, composer, evidence: `${platform}_draft_not_inserted_before_send` };
}

function identityCheckExpression(expectedCompany, targetUrl, officialProfileVerified = false) {
  return `(() => {
    const expectedCompany = ${JSON.stringify(String(expectedCompany || '').trim())};
    const targetUrl = ${JSON.stringify(String(targetUrl || '').trim())};
    const officialProfileVerified = ${JSON.stringify(Boolean(officialProfileVerified))};
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
    const host = (() => {
      try {
        return new URL(targetUrl).hostname.toLowerCase();
      } catch {
        return '';
      }
    })();
    if (/instagram\\.com\\/moosejawmadness\\/?$/i.test(targetUrl)) {
      return JSON.stringify({ ok: false, pending: false, expectedCompany, title, url: location.href, evidence: 'known_instagram_identity_mismatch_moosejawmadness' });
    }
    const locationPathCompact = (() => {
      try {
        return compact(location.pathname.replace(/^\\/+/, '').split('/')[0] || '');
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
    const visibleLower = visible.toLowerCase();
    const visibleCompact = compact(visible);
    const genericSocialTitle = /^(\\(?\\d+\\)?\\s*)?(facebook|instagram|linkedin)$/i.test(title.trim());
    const pending = (!title.trim() && !headers.trim() && visibleCompact.length < 8)
      || (genericSocialTitle
        && !headers.trim()
        && !visibleCompact.includes(expectedCompact)
        && visibleCompact.length < 40);
    if (pending) {
      return JSON.stringify({
        ok: null,
        pending: true,
        expectedCompany,
        title,
        url: location.href,
        evidence: genericSocialTitle ? 'identity_check_pending_generic_social_title' : 'identity_check_pending_empty_page'
      });
    }
    const expectedTokens = expected.split(/\\s+/).filter(token => token.length >= 4);
    const tokenHits = expectedTokens.filter(token => visibleCompact.includes(compact(token))).length;
    const isSocial = /instagram\\.com|facebook\\.com/.test(host);
    const facebookProfileUrl = /facebook\\.com\\/(?:profile\\.php|people)(?:[/?#]|$)/.test(location.href.toLowerCase());
    const businessSignal = /official|company|business|retail|outdoor|camping|hiking|wholesale|distributor|brand|vendor|merchandising|buyer|procurement|partnership|category|sales|about|website/.test(visibleLower);
    const employeeSignal = /buyer|category manager|merchandising|procurement|purchasing|vendor|partnership|business development|sales manager|works at|employee/.test(visibleLower);
    const personalProfileSignal = /add friend|friends are family|lives in|i'm a .*\b(chameleon|person|guy|girl)|个人主页|添加好友/.test(visibleLower);
    const emptyPersonalSignal = /0\\s*(posts?|帖子)[\\s\\S]{0,80}0\\s*(followers|粉丝)[\\s\\S]{0,80}0\\s*(following|关注)/i.test(visible);
    const strictPersonalProfileSignal = /add friend|\\d[\\d,.]*\\s*friends?\\b|friends are family|lives in|hometown|personal details|\\u6dfb\\u52a0\\u597d\\u53cb|\\u4f4d\\u597d\\u53cb|\\u4e2a\\u4eba\\u8be6\\u60c5|\\u4e2a\\u4eba\\u4e3b\\u9875|\\u5bb6\\u4e61/.test(visibleLower);
    const unavailableProfileSignal = /content isn.t available|page isn.t available|page not found|this content is unavailable|\\u65e0\\u6cd5\\u8bbf\\u95ee\\u6b64\\u9875\\u9762|\\u9875\\u9762\\u4e0d\\u5b58\\u5728|\\u5185\\u5bb9\\u4e0d\\u53ef\\u7528/.test(visibleLower);
    const companyOk = expectedCompact && visibleCompact.includes(expectedCompact);
    const pathOk = pathCompact && visibleCompact.includes(pathCompact);
    const handleMatchesExpected = expectedCompact && pathCompact
      && (pathCompact.includes(expectedCompact) || expectedCompact.includes(pathCompact));
    const exactSocialUrlOk = isSocial
      && pathCompact.length >= 4
      && locationPathCompact === pathCompact
      && (handleMatchesExpected || officialProfileVerified);
    const staffOk = tokenHits >= 1 && employeeSignal;
    const socialCompanyOk = companyOk || (tokenHits >= Math.min(2, expectedTokens.length) && businessSignal);
    const isFacebook = /facebook\\.com/.test(host);
    const facebookExactHandlePageOk = isFacebook
      && exactSocialUrlOk
      && handleMatchesExpected
      && visibleCompact.length >= 40
      && !unavailableProfileSignal;
    const facebookBusinessPageOk = !isFacebook || (!facebookProfileUrl
      && !personalProfileSignal
      && !strictPersonalProfileSignal
      && !unavailableProfileSignal
      && ((businessSignal && socialCompanyOk) || facebookExactHandlePageOk));
    const ok = !expectedCompact || (isSocial
      ? Boolean((socialCompanyOk || staffOk || exactSocialUrlOk) && facebookBusinessPageOk)
      : Boolean(companyOk || (pathCompact.length >= 5 && pathOk)));
    const personalMismatch = isSocial && !ok && (emptyPersonalSignal || personalProfileSignal || strictPersonalProfileSignal);
    return JSON.stringify({
      ok,
      expectedCompany,
      title,
      url: location.href,
      evidence: ok
        ? (exactSocialUrlOk && !socialCompanyOk && !staffOk ? 'identity_match_exact_social_url' : 'identity_match')
        : (personalMismatch
          ? ('personal_profile_without_company_match_expected_' + expectedCompany + '_title_' + title).slice(0, 300)
          : ('identity_mismatch_expected_' + expectedCompany + '_title_' + title).slice(0, 300))
    });
  })()`;
}

function sideEffectButtonExpression(kind, platform) {
  const keywords = kind === 'follow'
    ? ['follow', '\u5173\u6ce8']
    : ['like', '\u8d5e', '\u559c\u6b22', '\u7559\u4e0b\u5fc3\u60c5'];
  const negative = kind === 'follow'
    ? ['following', '\u5df2\u5173\u6ce8']
    : ['unlike', 'share', 'forward', 'repost', '\u5df2\u8d5e', '\u53d6\u6d88\u8d5e', '\u5206\u4eab', '\u8f6c\u53d1', '\u53d1\u9001\u7ed9\u597d\u53cb'];
  return `(() => {
    const keywords = ${JSON.stringify(keywords)};
    const negative = ${JSON.stringify(negative)};
    const controls = Array.from(document.querySelectorAll('button,a,div[role="button"],span[role="button"]')).map((el) => {
      const rect = el.getBoundingClientRect();
      const text = [el.innerText, el.textContent, el.getAttribute('aria-label'), el.getAttribute('title'), el.getAttribute('data-testid')]
        .map(value => String(value || '')).join(' ').replace(/\\s+/g, ' ').trim().toLowerCase();
      return {
        text,
        tag: el.tagName,
        href: el.href || '',
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        visible: rect.width > 0 && rect.height > 0,
        inDialog: Boolean(el.closest('[role="dialog"],[aria-modal="true"]')),
        inNav: Boolean(el.closest('nav,[role="navigation"]')),
        disabled: Boolean(el.disabled || el.getAttribute('aria-disabled') === 'true')
      };
    }).filter(item => item.visible && !item.disabled && !item.inDialog && !item.inNav);
    const alreadyActive = controls.find(item => negative.some(word => item.text.includes(word)));
    if (alreadyActive) return JSON.stringify({ alreadyActive: true, text: alreadyActive.text });
    const candidates = controls
      .filter(item => keywords.some(keyword => item.text === keyword || item.text.includes(keyword)) && !negative.some(word => item.text.includes(word)))
      .filter(item => {
        if (kind !== 'follow') return true;
        if (item.tag === 'A' && /followers|following|mutualonly|\\/$|#$/.test(item.href.toLowerCase())) return false;
        if (/\\d/.test(item.text)) return false;
        return item.width >= 60 && item.height >= 24;
      })
      .filter(item => kind !== 'follow' || (item.x > 120 && item.y > 80 && item.y < Math.min(window.innerHeight - 80, 720)));
    const facebookProfileCandidates = platform === 'facebook'
      ? candidates.filter(item => item.x > 300 && item.y > 220 && item.y < Math.min(window.innerHeight - 80, 680))
      : candidates;
    const exact = facebookProfileCandidates.find(item => keywords.some(keyword => item.text === keyword));
    const found = exact || facebookProfileCandidates[0] || (platform === 'facebook' ? null : candidates[0]);
    return JSON.stringify(found || null);
  })()`;
}

async function clickOptionalAction(tab, kind, platform) {
  const button = await evaluateJson(tab, sideEffectButtonExpression(kind, platform), 3000).catch(() => null);
  if (button && button.alreadyActive) return `${kind}_already_active`;
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
        const placeholder = String(el.getAttribute('placeholder') || '').toLowerCase();
        const text = [label, placeholder, String(el.innerText || el.textContent || '')].join(' ');
        return text.includes('comment') || text.includes('\\u5199\\u8bc4\\u8bba') || text.includes('\\u53d1\\u8868\\u8bc4\\u8bba') || text.includes('\\u6dfb\\u52a0\\u8bc4\\u8bba');
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

function instagramCommentActionExpression() {
  return `(() => {
    const visible = (el) => {
      const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0);
    };
    const controls = Array.from(document.querySelectorAll('[role="dialog"] button,[aria-modal="true"] button,article button,button,div[role="button"],span[role="button"],svg[aria-label]'))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const text = String(el.innerText || el.textContent || el.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim().toLowerCase();
        return {
          text,
          x: Math.round(rect.left + rect.width / 2),
          y: Math.round(rect.top + rect.height / 2),
          visible: true,
          disabled: Boolean(el.disabled || el.getAttribute('aria-disabled') === 'true')
        };
      })
      .filter(item => !item.disabled);
    const button = controls.find(item => item.text.includes('comment') || item.text.includes('\\u8bc4\\u8bba'));
    return JSON.stringify(button || null);
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

async function submitInstagramPostEngagement(tab, text) {
  const evidence = [];
  const tile = await evaluateJson(tab, instagramPostTileExpression(), 5000).catch(() => null);
  if (!tile || !Number.isFinite(tile.x) || !Number.isFinite(tile.y)) {
    return 'instagram_post_not_available';
  }
  await clickAt(tab, tile.x, tile.y);
  await sleep(1800);
  evidence.push('instagram_post_opened');

  const like = await evaluateJson(tab, instagramPostLikeButtonExpression(), 3000).catch(() => null);
  if (like && Number.isFinite(like.x) && Number.isFinite(like.y)) {
    await clickAt(tab, like.x, like.y);
    await sleep(700);
    evidence.push('post_liked');
  } else {
    await clickAt(tab, tile.x, tile.y).catch(() => null);
    await sleep(120);
    await clickAt(tab, tile.x, tile.y).catch(() => null);
    await sleep(700);
    evidence.push('post_like_double_tap_attempted');
  }

  const comment = String(text || '').trim();
  if (comment) {
    let box = await evaluateJson(tab, commentBoxExpression(), 5000).catch(() => null);
    if (!box || !Number.isFinite(box.x) || !Number.isFinite(box.y)) {
      const action = await evaluateJson(tab, instagramCommentActionExpression(), 3000).catch(() => null);
      if (action && Number.isFinite(action.x) && Number.isFinite(action.y)) {
        await clickAt(tab, action.x, action.y);
        await sleep(900);
        box = await evaluateJson(tab, commentBoxExpression(), 5000).catch(() => null);
      }
    }
    if (box && Number.isFinite(box.x) && Number.isFinite(box.y)) {
      await clickAt(tab, box.x, box.y);
      await sleep(500);
      await cdp(tab.webSocketDebuggerUrl, 'Input.insertText', { text: comment }, 5000);
      await sleep(300);
      await pressEnter(tab);
      await sleep(1200);
      evidence.push('comment_submitted');
    } else {
      evidence.push('comment_box_not_available');
    }
  } else {
    evidence.push('comment_not_configured');
  }

  await evaluateJson(tab, instagramPostCloseExpression(), 2500).catch(() => null);
  await sleep(800);
  return evidence.join(';');
}

function facebookPostLikeButtonExpression() {
  return `(() => {
    const visible = (el) => {
      const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight);
    };
    const textOf = (el) => String(el.innerText || el.textContent || el.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim().toLowerCase();
    const negative = ['unlike', '\\u5df2\\u8d5e', '\\u53d6\\u6d88\\u8d5e'];
    window.scrollBy({ top: Math.round(window.innerHeight * 0.55), behavior: 'instant' });
    const controls = Array.from(document.querySelectorAll('[role="feed"] [role="article"] button,[role="feed"] [role="article"] div[role="button"],[role="main"] [role="article"] button,[role="main"] [role="article"] div[role="button"],[role="article"] button,[role="article"] div[role="button"]'))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const text = textOf(el);
        const article = el.closest('[role="article"]');
        const articleText = article ? textOf(article).slice(0, 600) : '';
        return {
          text,
          articleText,
          x: Math.round(rect.left + rect.width / 2),
          y: Math.round(rect.top + rect.height / 2),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          disabled: Boolean(el.disabled || el.getAttribute('aria-disabled') === 'true' || el.getAttribute('aria-pressed') === 'true')
        };
      })
      .filter(item => !item.disabled)
      .filter(item => item.width >= 24 && item.height >= 20)
      .filter(item => !negative.some(word => item.text.includes(word)))
      .filter(item => /(^|\\s)(like|\\u8d5e)(\\s|$)/i.test(item.text) || item.text === '\\u559c\\u6b22')
      .filter(item => !/share|comment|send|messenger|\\u5206\\u4eab|\\u8bc4\\u8bba|\\u53d1\\u9001/.test(item.text));
    const preferred = controls
      .filter(item => item.y > 160 && item.y < window.innerHeight - 60)
      .sort((a, b) => a.y - b.y || a.x - b.x)[0] || controls[0];
    return JSON.stringify(preferred || null);
  })()`;
}

async function submitFacebookPostEngagement(tab) {
  const evidence = [];
  let like = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    like = await evaluateJson(tab, facebookPostLikeButtonExpression(), 4000).catch(() => null);
    if (like && Number.isFinite(like.x) && Number.isFinite(like.y)) break;
    await sleep(900);
  }
  if (like && Number.isFinite(like.x) && Number.isFinite(like.y)) {
    await clickAt(tab, like.x, like.y);
    await sleep(900);
    evidence.push('post_liked');
    evidence.push('facebook_post_like_clicked');
  } else {
    evidence.push('facebook_post_like_not_available');
  }
  await evaluateJson(tab, '(() => { window.scrollTo({ top: 0, behavior: "instant" }); return JSON.stringify(true); })()', 2000).catch(() => null);
  await sleep(500);
  return evidence.join(';');
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

function platformSafetyBlockerExpression(platform) {
  return `(() => {
    const platform = ${JSON.stringify(platform)};
    const body = String(document.body && document.body.innerText || '').toLowerCase();
    const title = String(document.title || '').toLowerCase();
    const text = [title, body.slice(0, 6000)].join('\\n');
    const captcha = /captcha|security check|verify you are human|confirm you are human|checkpoint|\\u9a8c\\u8bc1\\u7801|\\u5b89\\u5168\\u9a8c\\u8bc1|\\u8bf7\\u9a8c\\u8bc1/.test(text);
    const rateLimited = /too many requests|rate limit|try again later|temporarily blocked|temporarily restricted|action blocked|we limit how often|\\u64cd\\u4f5c\\u8fc7\\u4e8e\\u9891\\u7e41|\\u8bf7\\u7a0d\\u540e\\u518d\\u8bd5|\\u6682\\u65f6\\u53d7\\u9650|\\u64cd\\u4f5c\\u5df2\\u88ab\\u963b\\u6b62/.test(text);
    const loginRequired = /log in to continue|login to continue|sign in to continue|you must log in|\\u767b\\u5f55\\u4ee5\\u7ee7\\u7eed|\\u8bf7\\u5148\\u767b\\u5f55/.test(text);
    const reason = captcha ? 'captcha_or_human_verification'
      : rateLimited ? 'platform_rate_limit_or_action_block'
        : loginRequired ? 'dedicated_browser_login_required'
          : '';
    return JSON.stringify({
      blocked: Boolean(reason),
      platform,
      reason,
      title: document.title || '',
      url: location.href,
    });
  })()`;
}

async function ensureComposerOpen(tab, port, platform) {
  await httpJson(`http://127.0.0.1:${port}/json/activate/${tab.id}`, 1500).catch(() => null);
  // Focus is best-effort. Background automation must continue through DOM/CDP
  // even when Chrome briefly rejects Page.bringToFront.
  await cdp(tab.webSocketDebuggerUrl, 'Page.bringToFront', {}, 2000).catch(() => null);

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

  let composer = null;
  if (platform === 'facebook') {
    await closeFacebookMessengerInbox(tab);
    await closeFacebookChatWindows(tab);
    await closeFacebookMessengerInbox(tab);
    await sleep(500);
  } else {
    composer = await waitForJson(tab, composerExpression(platform), item => item && item.visible, 1200, 300);
    if (composer && Number.isFinite(composer.x)) return composer;
  }
  await evaluateJson(tab, dismissDialogExpression(), 2000).catch(() => null);
  await evaluateJson(tab, closeBlockingOverlayExpression(platform), 2500).catch(() => null);
  await sleep(400);

  const keywordsByPlatform = {
    instagram: ['message', '\u53d1\u6d88\u606f', '\u53d1\u9001\u6d88\u606f'],
    facebook: ['message', 'send message', 'messenger', '\u53d1\u6d88\u606f', '\u53d1\u9001\u6d88\u606f', '\u6d88\u606f'],
    linkedin: ['message', '\u53d1\u6d88\u606f', '\u53d1\u9001\u6d88\u606f'],
    social: ['message', 'contact', '\u53d1\u6d88\u606f', '\u53d1\u9001\u6d88\u606f', '\u6d88\u606f'],
  };
  const keywords = keywordsByPlatform[platform] || keywordsByPlatform.social;
  const buttonExpressionForPlatform = (platform === 'instagram' || platform === 'facebook' || platform === 'linkedin')
    ? profileMessageButtonExpression(platform, keywords)
    : buttonExpression(keywords);
  let button = await waitForJson(
    tab,
    buttonExpressionForPlatform,
    item => item && Number.isFinite(item.x) && Number.isFinite(item.y),
    12000,
    500
  ).catch(() => null);
  if (!button || !Number.isFinite(button.x)) {
    if (platform === 'instagram') {
      const fallbackButton = await waitForJson(tab, buttonExpression(keywords), item => item && Number.isFinite(item.x) && Number.isFinite(item.y) && item.x > 120, 3000, 500);
      if (!fallbackButton || !Number.isFinite(fallbackButton.x)) return null;
      await clickAt(tab, fallbackButton.x, fallbackButton.y);
    } else if (platform === 'facebook') {
      return {
        messageUnavailable: true,
        evidence: 'facebook_profile_no_message_button',
      };
    } else {
      return null;
    }
  } else {
    await clickAt(tab, button.x, button.y);
  }
  await sleep(900);
  // Sales Navigator opens its message composer in a dialog. The generic
  // dismiss routine would close that valid composer before it can be used.
  if (platform !== 'linkedin') await evaluateJson(tab, dismissDialogExpression(), 2000).catch(() => null);
  await evaluateJson(tab, closeBlockingOverlayExpression(platform), 2500).catch(() => null);
  if (platform === 'facebook') {
    const startButton = await evaluateJson(tab, facebookStartButtonExpression(), 2500).catch(() => null);
    if (startButton && Number.isFinite(startButton.x) && Number.isFinite(startButton.y)) {
      await clickAt(tab, startButton.x, startButton.y);
      await sleep(1200);
    }
  }
  composer = await waitForJson(tab, composerExpression(platform), item => item && item.visible, 25000, 500);
  if (!composer || !Number.isFinite(composer.x)) {
    await evaluateJson(tab, dismissDialogExpression(), 2000).catch(() => null);
    composer = await waitForJson(tab, composerExpression(platform), item => item && item.visible, 8000, 500);
  }
  if ((!composer || !Number.isFinite(composer.x)) && platform === 'facebook') {
    // A Facebook Messenger panel can remain open without a writable composer
    // (personal profiles, privacy-restricted pages, or stale chat windows).
    // Close it and stop this target instead of reopening the same dead-end UI.
    await closeFacebookMessengerInbox(tab);
    await closeFacebookChatWindows(tab);
    return {
      messageUnavailable: true,
      evidence: 'facebook_composer_unavailable_closed_no_retry',
    };
  }
  if ((!composer || !Number.isFinite(composer.x)) && platform === 'facebook') {
    await closeFacebookMessengerInbox(tab);
    await closeFacebookChatWindows(tab);
    const retryButton = await waitForJson(
      tab,
      profileMessageButtonExpression(platform, keywords),
      item => item && Number.isFinite(item.x) && Number.isFinite(item.y),
      5000,
      500
    ).catch(() => null);
    if (retryButton && Number.isFinite(retryButton.x)) {
      await clickAt(tab, retryButton.x, retryButton.y);
      await sleep(1800);
      await evaluateJson(tab, dismissDialogExpression(), 2000).catch(() => null);
      composer = await waitForJson(tab, composerExpression(platform), item => item && item.visible, 12000, 500);
    }
  }
  if ((!composer || !Number.isFinite(composer.x)) && platform === 'instagram') {
    const retryButton = await waitForJson(
      tab,
      profileMessageButtonExpression(platform, keywords),
      item => item && Number.isFinite(item.x) && Number.isFinite(item.y),
      5000,
      500
    ).catch(() => null);
    if (retryButton && Number.isFinite(retryButton.x)) {
      await clickAt(tab, retryButton.x, retryButton.y);
      await sleep(1800);
      await evaluateJson(tab, dismissDialogExpression(), 2000).catch(() => null);
      await evaluateJson(tab, closeBlockingOverlayExpression(platform), 2500).catch(() => null);
      composer = await waitForJson(tab, composerExpression(platform), item => item && item.visible, 12000, 500);
    }
  }
  if ((!composer || !Number.isFinite(composer.x)) && platform === 'linkedin') {
    const retryButton = await waitForJson(
      tab,
      profileMessageButtonExpression(platform, keywords),
      item => item && Number.isFinite(item.x) && Number.isFinite(item.y),
      5000,
      500
    ).catch(() => null);
    if (retryButton && Number.isFinite(retryButton.x)) {
      await clickAt(tab, retryButton.x, retryButton.y);
      await sleep(1600);
      await evaluateJson(tab, closeBlockingOverlayExpression(platform), 2500).catch(() => null);
      composer = await waitForJson(tab, composerExpression(platform), item => item && item.visible, 12000, 500);
    }
  }
  return composer && Number.isFinite(composer.x) ? composer : null;
}

async function preparePlatformDraft(payload, platform) {
  const port = Number(payload.port || 9224);
  const tab = await findTab(port, payload.tabId, payload.targetUrl);
  if (!tab || !tab.webSocketDebuggerUrl) {
    return { ok: false, sendStatus: 'failed_open', evidence: 'chrome_target_not_found' };
  }

  if (platform === 'facebook') {
    // Clear any Messenger panel left by a previous target before identity
    // validation, including pages rejected as personal profiles.
    await closeFacebookMessengerInbox(tab);
    await closeFacebookChatWindows(tab);
  }

  const safetyBlocker = await evaluateJson(tab, platformSafetyBlockerExpression(platform), 5000).catch(() => null);
  if (safetyBlocker && safetyBlocker.blocked) {
    return {
      ok: false,
      skipped: true,
      sendStatus: 'failed_open',
      evidence: `${platform}_safety_blocked:${safetyBlocker.reason}`,
      nextAction: 'Skip this target without retrying; preserve evidence and wait for the external safety condition to clear.',
    };
  }

  const identity = await waitForJson(
    tab,
    identityCheckExpression(payload.expectedCompany, payload.targetUrl, payload.officialProfileVerified),
    item => item && !item.pending,
    12000,
    500
  ).catch(() => null);
  if (!identity || identity.ok !== true) {
    const identityEvidence = identity && (
      identity.evidence
      || (identity.error ? `identity_check_runtime_error:${identity.error}` : '')
    );
    return {
      ok: false,
      sendStatus: 'failed_open',
      evidence: identityEvidence || `${platform}_identity_not_verified_fail_closed`,
      identityDiagnostic: identity || null,
      nextAction: 'Wrong or unmatched account opened; record as major bug and move to next verified customer.',
    };
  }

  const preActions = [];
  // The owner-authorized social sequence is follow + like + private message.
  // Never publish an automatic public comment: it is harder to personalize,
  // creates avoidable reputation risk, and is not required for outreach.
  const allowPublicEngagement = true;
  if (allowPublicEngagement && payload.autoEngage) {
    if (platform === 'instagram') {
      let follow = await clickOptionalAction(tab, 'follow', platform);
      if (follow === 'follow_not_available') {
        await sleep(900);
        follow = await clickOptionalAction(tab, 'follow', platform);
      }
      preActions.push(follow);
      let post = await submitInstagramPostEngagement(tab, '');
      if (/instagram_post_not_available|post_like_double_tap_attempted/.test(post)) {
        await sleep(900);
        const retryPost = await submitInstagramPostEngagement(tab, '');
        post = `${post};retry:${retryPost}`;
      }
      preActions.push(post);
    } else if (platform === 'facebook') {
      preActions.push(await clickOptionalAction(tab, 'follow', platform));
      preActions.push(await submitFacebookPostEngagement(tab));
    } else if (platform === 'linkedin') {
      // Follow first and like when a safe visible Like control is available.
      // Never post an automatic public comment.
      let follow = await clickOptionalAction(tab, 'follow', platform);
      if (follow === 'follow_not_available') {
        await sleep(900);
        follow = await clickOptionalAction(tab, 'follow', platform);
      }
      preActions.push(follow);
      preActions.push(await clickOptionalAction(tab, 'like', platform));
    } else {
      preActions.push(await clickOptionalAction(tab, 'like', platform));
      preActions.push(await clickOptionalAction(tab, 'follow', platform));
    }
  }

  let composer = await ensureComposerOpen(tab, port, platform);
  if (composer && composer.unavailable) {
    return {
      ok: false,
      sendStatus: 'failed_open',
      evidence: composer.evidence || `${platform}_unavailable_profile_page`,
      nextAction: 'Do not retry this URL; switch to a verified alternate channel or official website contact.',
    };
  }
  if (!composer || !Number.isFinite(composer.x)) {
    const noMessageButton = Boolean(composer && composer.messageUnavailable);
    const followed = preActions.includes('follow_clicked') || preActions.includes('follow_already_active');
    const liked = preActions.some(item => /like_clicked|post_like_clicked/.test(String(item || '')));
    const engaged = followed || liked;
    if (engaged) {
      return {
        ok: true,
        sendStatus: liked ? 'post_liked' : 'account_followed',
        evidence: `${platform}_engagement_completed_message_unavailable;${composer && composer.evidence || `${platform}_message_button_clicked_composer_not_found`};${preActions.filter(Boolean).join(';')}`,
        nextAction: 'The verified account was engaged successfully. Monitor for a connection opportunity and avoid repeating the same action.',
      };
    }
    return {
      ok: false,
      sendStatus: 'failed_open',
      evidence: noMessageButton ? `${platform}_profile_no_message_button` : `${platform}_message_button_clicked_composer_not_found`,
      nextAction: noMessageButton
        ? 'No message button is available on this verified profile; switch to a verified alternate channel or official website contact.'
        : 'Composer not detected; pause automation and notify operator only if retry would be unsafe.',
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
  const insertResult = await insertDraftAndVerify(tab, composer, draft, platform);
  composer = insertResult.composer || composer;
  if (!insertResult.ok) {
    return {
      ok: false,
      sendStatus: 'failed_open',
      evidence: insertResult.evidence,
      nextAction: 'Marketing draft was not detected in the message composer; do not click Send or retry blindly.',
    };
  }
  if (payload.autoSend) {
    await sleep(800);
    const sendButton = await waitForJson(tab, sendButtonExpression(composer), item => item && item.explicitSendControl === true && Number.isFinite(item.x) && Number.isFinite(item.y), 8000, 400);
    if (!sendButton || !Number.isFinite(sendButton.x) || sendButton.explicitSendControl !== true) {
      if (platform === 'instagram' || platform === 'facebook') {
        await clickAt(tab, composer.x, composer.y);
        const composerState = await evaluateJson(tab, composerTextExpression(draft), 3000).catch(() => null);
        if (composerState && composerState.containsDraft) {
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
          const enterSent = await confirmPersistedSentMessage(tab, draft);
          if (enterSent && enterSent.confirmed) {
            return {
              ok: true,
              sendStatus: 'sent_confirmed',
              evidence: `${platform}_message_sent_confirmed_after_enter;persisted_after_reload;verified_draft_present_before_irreversible_action;${insertResult.evidence};sentText:${Boolean(enterSent.sentText)};outgoingBubble:${Boolean(enterSent.outgoingBubble)};emptyComposer:${Boolean(enterSent.emptyComposer)};${preActions.filter(Boolean).join(';')}`,
              nextAction: 'Record outcome and monitor for reply.',
            };
          }
          return {
            ok: false,
            sendStatus: 'send_unconfirmed',
            evidence: `${platform}_enter_send_attempted_but_confirmation_missing;verified_draft_present_before_irreversible_action;${insertResult.evidence};${preActions.filter(Boolean).join(';')}`,
            nextAction: 'Send confirmation missing after the verified Enter fallback; pause before any retry to avoid duplicate sending.',
          };
        }
      }
      return {
        ok: false,
        sendStatus: 'failed_open',
        evidence: `${platform}_draft_inserted_explicit_send_control_not_found;no_irreversible_action_performed;${insertResult.evidence};controls:${JSON.stringify(await evaluateJson(tab, `(() => JSON.stringify(Array.from(document.querySelectorAll('button,a,[role="button"]')).filter(el => { const r=el.getBoundingClientRect(); return r.width>0&&r.height>0; }).map(el => ({text:String(el.innerText||el.textContent||'').replace(/\\s+/g,' ').trim(),aria:el.getAttribute('aria-label')||'',title:el.getAttribute('title')||''})).filter(v=>v.text||v.aria||v.title).slice(-80)))()`, 3000).catch(() => []))}`,
        nextAction: 'An explicit Send control was not detected and the verified Enter path was unavailable; record a technical failure and continue to another verified channel.',
      };
    }
    await clickAt(tab, sendButton.x, sendButton.y);
    const sent = await confirmPersistedSentMessage(tab, draft);
    if (sent && sent.confirmed) {
      return {
        ok: true,
        sendStatus: 'sent_confirmed',
      evidence: `${platform}_message_sent_confirmed_after_send_click;persisted_after_reload;verified_draft_present_before_irreversible_action;explicit_send_control_verified;${insertResult.evidence};sentText:${Boolean(sent.sentText)};outgoingBubble:${Boolean(sent.outgoingBubble)};emptyComposer:${Boolean(sent.emptyComposer)};${preActions.filter(Boolean).join(';')}`,
        nextAction: 'Record outcome and monitor for reply.',
      };
    }
    return {
      ok: false,
      sendStatus: 'send_unconfirmed',
      evidence: `${platform}_send_clicked_but_confirmation_missing;verified_draft_present_before_irreversible_action;explicit_send_control_verified;${insertResult.evidence};${preActions.filter(Boolean).join(';')}`,
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

async function engageSocialProfile(payload) {
  const platform = hostPlatform(payload.targetUrl);
  const port = Number(payload.port || 9224);
  const tab = await findTab(port, payload.tabId, payload.targetUrl);
  if (!tab || !tab.webSocketDebuggerUrl) {
    return { ok: false, sendStatus: 'failed_open', evidence: 'chrome_target_not_found;no_message_action' };
  }
  const identity = await waitForJson(
    tab,
    identityCheckExpression(payload.expectedCompany, payload.targetUrl, payload.officialProfileVerified),
    item => item && !item.pending,
    12000,
    500
  ).catch(() => null);
  if (!identity || identity.ok !== true) {
    return { ok: false, sendStatus: 'failed_open', evidence: identity && identity.evidence || `${platform}_identity_not_verified_fail_closed;no_message_action` };
  }
  let follow = await clickOptionalAction(tab, 'follow', platform);
  if (follow === 'follow_not_available') {
    await sleep(900);
    follow = await clickOptionalAction(tab, 'follow', platform);
  }
  let like;
  if (platform === 'instagram') like = await submitInstagramPostEngagement(tab, '');
  else if (platform === 'facebook') like = await submitFacebookPostEngagement(tab);
  else like = await clickOptionalAction(tab, 'like', platform);
  const followed = /follow_clicked|follow_already_active/.test(follow);
  const liked = /post_liked|post_like_clicked|like_clicked|like_already_active/.test(String(like || ''));
  return {
    ok: followed && liked,
    sendStatus: followed && liked ? 'social_engagement_confirmed' : 'social_engagement_incomplete',
    evidence: `${platform}_identity_verified;${follow};${like};engagement_only;no_message_action`,
    followStatus: follow,
    likeStatus: like,
  };
}

function linkedinSalesSearchCandidateExpression(processedNames = []) {
  return `(() => {
    const processed = new Set(${JSON.stringify(processedNames)}.map(value => String(value).toLowerCase()));
    const visible = (el) => {
      const rect = el && el.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight);
    };
    const menus = Array.from(document.querySelectorAll('button[aria-label^="See more actions for "]'));
    for (const menu of menus) {
      const name = String(menu.getAttribute('aria-label') || '').replace(/^See more actions for /, '').trim();
      if (!name || processed.has(name.toLowerCase())) continue;
      let row = menu;
      for (let depth = 0; row && depth < 10; depth += 1, row = row.parentElement) {
        const rect = row.getBoundingClientRect();
        const text = String(row.innerText || '').replace(/\\s+/g, ' ').trim();
        if (rect.width < 600 || rect.height < 90 || rect.height > 500 || !text.includes(name)) continue;
        const buyerQualified = /\\b(buyer|purchasing|procurement|category manager|merchandis)/i.test(text);
        if (!buyerQualified) break;
        const menuRect = menu.getBoundingClientRect();
        const profile = Array.from(row.querySelectorAll('a[href*="/sales/lead/"]')).find(visible);
        return JSON.stringify({
          name,
          text: text.slice(0, 900),
          profileUrl: profile ? profile.href : '',
          x: Math.round(menuRect.left + menuRect.width / 2),
          y: Math.round(menuRect.top + menuRect.height / 2),
        });
      }
    }
    return JSON.stringify(null);
  })()`;
}

function linkedinVisibleActionExpression(labels) {
  return `(() => {
    const labels = ${JSON.stringify(labels)}.map(value => String(value).toLowerCase());
    const controls = Array.from(document.querySelectorAll('button,a,[role="button"],[role="menuitem"]'));
    for (const el of controls) {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0 || rect.bottom <= 0 || rect.top >= innerHeight) continue;
      const text = String(el.innerText || el.textContent || el.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim().toLowerCase();
      if (!labels.includes(text)) continue;
      return JSON.stringify({ text, x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) });
    }
    return JSON.stringify(null);
  })()`;
}

function linkedinOpenCandidateMenuExpression(name) {
  return `(() => {
    const expected = ${JSON.stringify(String(name || ''))};
    const menu = Array.from(document.querySelectorAll('button[aria-label^="See more actions for "]'))
      .find(el => String(el.getAttribute('aria-label') || '').replace(/^See more actions for /, '').trim() === expected);
    if (!menu) return JSON.stringify({ ok: false, evidence: 'candidate_menu_not_found' });
    menu.scrollIntoView({ block: 'center', inline: 'nearest' });
    const rect = menu.getBoundingClientRect();
    return JSON.stringify({ ok: true, x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2), evidence: 'candidate_menu_resolved_by_verified_name' });
  })()`;
}

async function connectLinkedinSalesSearch(payload = {}) {
  const port = Number(payload.port || 9224);
  if (port !== 9224) return { ok: false, sendStatus: 'failed_open', evidence: 'dedicated_cdp_9224_required' };
  // Production is queue-driven rather than capped at an arbitrary lead count.
  // A caller may still request a smaller diagnostic batch. Platform safety,
  // confirmation and the per-run time budget remain hard stops.
  const requestedLimit = Number(payload.limit);
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
    ? Math.max(1, Math.floor(requestedLimit))
    : Number.MAX_SAFE_INTEGER;
  const requestedDurationMs = Number(payload.maxDurationMs);
  const maxDurationMs = Number.isFinite(requestedDurationMs) && requestedDurationMs > 0
    ? Math.min(requestedDurationMs, 45 * 60 * 1000)
    : 45 * 60 * 1000;
  const deadline = Date.now() + maxDurationMs;
  const tab = await findTab(port, payload.tabId, payload.targetUrl);
  if (!tab) return { ok: false, sendStatus: 'failed_open', evidence: 'linkedin_sales_search_tab_not_found' };
  const page = await evaluateJson(tab, `(() => JSON.stringify({url: location.href, title: document.title, text: String(document.body && document.body.innerText || '').slice(0, 8000)}))()`);
  let parsed;
  try { parsed = new URL(page.url); } catch { parsed = null; }
  if (!parsed || !/linkedin\.com$/i.test(parsed.hostname) || !/^\/sales\/search\/people/.test(parsed.pathname)) {
    return { ok: false, sendStatus: 'failed_open', evidence: 'linkedin_sales_people_search_identity_mismatch' };
  }
  const safety = await evaluateJson(tab, platformSafetyBlockerExpression('linkedin'), 5000).catch(() => null);
  if (safety && safety.blocked) return { ok: false, sendStatus: 'failed_open', evidence: safety.reason };
  const processed = [];
  const results = [];
  for (let index = 0; index < limit && Date.now() < deadline; index += 1) {
    const candidate = await evaluateJson(tab, linkedinSalesSearchCandidateExpression(processed), 5000).catch(() => null);
    if (!candidate) break;
    processed.push(candidate.name);
    if (payload.dryRun === true) {
      results.push({ ...candidate, sendStatus: 'ready_to_connect' });
      continue;
    }
    const menuOpened = await evaluateJson(tab, linkedinOpenCandidateMenuExpression(candidate.name), 5000).catch(() => null);
    if (!menuOpened || menuOpened.ok !== true) {
      results.push({ ...candidate, sendStatus: 'skipped', evidence: menuOpened && menuOpened.evidence || 'candidate_menu_click_failed' });
      continue;
    }
    await clickAt(tab, menuOpened.x, menuOpened.y);
    await sleep(500);
    const connect = await waitForJson(tab, linkedinVisibleActionExpression(['connect', '\u5efa\u7acb\u8054\u7cfb']), item => item && Number.isFinite(item.x), 3000, 250).catch(() => null);
    if (!connect) {
      const menuEvidence = await evaluateJson(tab, `(() => JSON.stringify(Array.from(document.querySelectorAll('[role="menuitem"],[role="menu"] button,[role="menu"] a'))
        .filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
        .map(el => String(el.innerText || el.textContent || el.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim())
        .filter(Boolean).slice(0, 20)))()`, 3000).catch(() => []);
      const bodyTail = await evaluateJson(tab, `(() => { const text = String(document.body && document.body.innerText || '').replace(/\\s+/g, ' ').trim(); return JSON.stringify(text.slice(-1200)); })()`, 3000).catch(() => '');
      await pressEscape(tab).catch(() => null);
      results.push({ ...candidate, sendStatus: 'skipped', evidence: `connect_action_not_available:${JSON.stringify(menuEvidence || [])}:${String(bodyTail || '').slice(-500)}` });
      continue;
    }
    await clickAt(tab, connect.x, connect.y);
    await sleep(700);
    const confirm = await evaluateJson(tab, linkedinVisibleActionExpression(['send without a note', 'send invitation', '\u4e0d\u6dfb\u52a0\u7559\u8a00\u76f4\u63a5\u53d1\u9001', '\u53d1\u9001\u9080\u8bf7']), 3000).catch(() => null);
    if (confirm && Number.isFinite(confirm.x)) {
      await clickAt(tab, confirm.x, confirm.y);
      await sleep(900);
    }
    const confirmation = await waitForJson(tab, `(() => {
      const body = String(document.body && document.body.innerText || '');
      const lower = body.toLowerCase();
      const blocked = /weekly invitation limit|invitation limit|too many requests|temporarily restricted|captcha|security check|verify you are human/.test(lower);
      const confirmed = /invitation sent|connection request sent|\\u9080\\u8bf7\\u5df2\\u53d1\\u9001|\\u8054\\u7cfb\\u8bf7\\u6c42\\u5df2\\u53d1\\u9001/.test(lower);
      return JSON.stringify({ blocked, confirmed, evidence: blocked ? body.slice(-1200) : '' });
    })()`, item => item && (item.blocked || item.confirmed), 4500, 300).catch(() => null);
    if (confirmation && confirmation.blocked) {
      results.push({ ...candidate, sendStatus: 'failed_open', evidence: `linkedin_platform_limit:${confirmation.evidence}` });
      return { ok: false, sendStatus: 'failed_open', evidence: 'linkedin_platform_limit_or_verification', connectedCount: results.filter(r => r.sendStatus === 'connection_requested_confirmed').length, results };
    }
    if (!confirmation || !confirmation.confirmed) {
      results.push({ ...candidate, sendStatus: 'send_unconfirmed', evidence: 'linkedin_connect_clicked_confirmation_missing' });
      return { ok: false, sendStatus: 'send_unconfirmed', evidence: 'linkedin_connect_confirmation_missing_no_replay', connectedCount: results.filter(r => r.sendStatus === 'connection_requested_confirmed').length, results };
    }
    results.push({ ...candidate, sendStatus: 'connection_requested_confirmed', evidence: 'sales_navigator_filtered_buyer_identity_visible;connect_clicked_once;invitation_sent_visible' });
  }
  const connectedCount = results.filter(result => result.sendStatus === 'connection_requested_confirmed').length;
  return {
    ok: connectedCount > 0 || payload.dryRun === true,
    sendStatus: payload.dryRun === true ? 'ready_to_connect' : (connectedCount > 0 ? 'connection_requested_confirmed' : 'failed_open'),
    connectedCount,
    continuationRequired: Date.now() >= deadline,
    results,
  };
}

async function connectLinkedinSalesLead(payload = {}) {
  const port = Number(payload.port || 9224);
  if (port !== 9224) return { ok: false, sendStatus: 'failed_open', evidence: 'dedicated_cdp_9224_required' };
  const tab = await findTab(port, payload.tabId, payload.targetUrl);
  if (!tab) return { ok: false, sendStatus: 'failed_open', evidence: 'linkedin_sales_lead_tab_not_found' };
  const identity = await evaluateJson(tab, `(() => {
    const url = location.href;
    const body = String(document.body && document.body.innerText || '');
    const expectedName = ${JSON.stringify(String(payload.expectedName || ''))};
    const expectedCompany = ${JSON.stringify(String(payload.expectedCompany || ''))};
    const ok = /linkedin\\.com\\/sales\\/lead\\//i.test(url) && (!expectedName || body.toLowerCase().includes(expectedName.toLowerCase())) && (!expectedCompany || body.toLowerCase().includes(expectedCompany.toLowerCase()));
    const el = Array.from(document.querySelectorAll('button,[role="button"]')).find(node => /open actions overflow menu/i.test(String(node.getAttribute('aria-label') || '')));
    if (!ok || !el) return JSON.stringify({ ok: false, evidence: !ok ? 'linkedin_sales_lead_identity_mismatch' : 'lead_actions_menu_not_found' });
    el.click();
    return JSON.stringify({ ok: true, url });
  })()`, 5000).catch(() => null);
  if (!identity || !identity.ok) return { ok: false, sendStatus: 'failed_open', evidence: identity && identity.evidence || 'lead_identity_check_failed' };
  await sleep(500);
  const connect = await waitForJson(tab, linkedinVisibleActionExpression(['connect', '\u5efa\u7acb\u8054\u7cfb']), item => item && Number.isFinite(item.x), 4000, 250).catch(() => null);
  if (!connect) {
    const menuState = await evaluateJson(tab, `(() => JSON.stringify(Array.from(document.querySelectorAll('button,a,[role="button"],[role="menuitem"]')).filter(el => { const r=el.getBoundingClientRect(); return r.width>0&&r.height>0; }).map(el => String(el.innerText||el.textContent||el.getAttribute('aria-label')||'').replace(/\\s+/g,' ').trim()).filter(Boolean).filter(v => /connect|invite|withdraw|pending|message|save/i.test(v)).slice(0,30)))()`, 3000).catch(() => []);
    await pressEscape(tab).catch(() => null);
    if ((menuState || []).some(value => /connect\s*[—-]\s*pending|withdraw invitation|invitation pending/i.test(String(value)))) {
      return { ok: true, sendStatus: 'connection_requested_confirmed_existing', evidence: `linkedin_connect_pending_visible:${JSON.stringify(menuState)}`, url: identity.url };
    }
    return { ok: false, sendStatus: 'failed_open', evidence: `lead_connect_action_not_available:${JSON.stringify(menuState || [])}` };
  }
  if (payload.dryRun === true) { await pressEscape(tab).catch(() => null); return { ok: true, sendStatus: 'ready_to_connect', evidence: 'verified_lead_connect_action_visible', url: identity.url }; }
  await clickAt(tab, connect.x, connect.y);
  await sleep(700);
  const confirm = await evaluateJson(tab, linkedinVisibleActionExpression(['send without a note', 'send invitation', '\u4e0d\u6dfb\u52a0\u7559\u8a00\u76f4\u63a5\u53d1\u9001', '\u53d1\u9001\u9080\u8bf7']), 3000).catch(() => null);
  if (confirm && Number.isFinite(confirm.x)) { await clickAt(tab, confirm.x, confirm.y); await sleep(900); }
  const confirmation = await waitForJson(tab, `(() => { const body=String(document.body&&document.body.innerText||'').toLowerCase(); return JSON.stringify({ blocked:/weekly invitation limit|invitation limit|too many requests|temporarily restricted|captcha|security check|verify you are human/.test(body), confirmed:/invitation sent|connection request sent|\u9080\u8bf7\u5df2\u53d1\u9001|\u8054\u7cfb\u8bf7\u6c42\u5df2\u53d1\u9001/.test(body) }); })()`, item => item && (item.blocked || item.confirmed), 5000, 300).catch(() => null);
  if (confirmation && confirmation.blocked) return { ok: false, sendStatus: 'failed_open', evidence: 'linkedin_platform_limit_or_verification' };
  if (!confirmation || !confirmation.confirmed) {
    const pendingState = await evaluateJson(tab, `(() => {
      const el=Array.from(document.querySelectorAll('button,[role="button"]')).find(node=>/open actions overflow menu/i.test(String(node.getAttribute('aria-label')||'')));
      if(!el) return JSON.stringify({opened:false,items:[]}); el.click();
      return JSON.stringify({opened:true,items:[]});
    })()`, 3000).catch(() => null);
    if (pendingState && pendingState.opened) await sleep(500);
    const pendingItems = await evaluateJson(tab, `(() => JSON.stringify(Array.from(document.querySelectorAll('button,a,[role="button"],[role="menuitem"]')).filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0;}).map(el=>String(el.innerText||el.textContent||el.getAttribute('aria-label')||'').replace(/\\s+/g,' ').trim()).filter(Boolean).filter(v=>/connect|invite|withdraw|pending/i.test(v)).slice(0,30)))()`, 3000).catch(() => []);
    await pressEscape(tab).catch(() => null);
    if ((pendingItems || []).some(value => /connect\s*[—-]\s*pending|withdraw invitation|invitation pending/i.test(String(value)))) {
      return { ok: true, sendStatus: 'connection_requested_confirmed', evidence: `sales_navigator_lead_identity_visible;connect_clicked_once;connect_pending_visible:${JSON.stringify(pendingItems)}`, url: identity.url };
    }
    return { ok: false, sendStatus: 'send_unconfirmed', evidence: 'linkedin_connect_clicked_confirmation_missing_no_replay' };
  }
  return { ok: true, sendStatus: 'connection_requested_confirmed', evidence: 'sales_navigator_lead_identity_visible;connect_clicked_once;invitation_sent_visible', url: identity.url };
}

async function inspectLinkedinSalesLead(payload = {}) {
  const port = Number(payload.port || 9224);
  if (port !== 9224) return { ok: false, sendStatus: 'failed_open', evidence: 'dedicated_cdp_9224_required' };
  const tab = await findTab(port, payload.tabId, payload.targetUrl);
  if (!tab) return { ok: false, sendStatus: 'failed_open', evidence: 'linkedin_sales_lead_tab_not_found' };
  const result = await evaluateJson(tab, `(() => {
    const url = location.href;
    const title = document.title;
    const body = String(document.body && document.body.innerText || '');
    const emails = Array.from(new Set((body.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}/gi) || []).map(v => v.toLowerCase()))).slice(0, 10);
    const lines = body.split(/\\n+/).map(v => v.replace(/\\s+/g, ' ').trim()).filter(Boolean)
      .filter(v => /email|contact|buyer|category|company|website/i.test(v)).slice(0, 40);
    const links = Array.from(document.querySelectorAll('a[href]')).map(a => ({
      text: String(a.innerText || a.textContent || '').replace(/\\s+/g, ' ').trim(),
      href: a.href,
    })).filter(v => String(v.href || '').includes('/sales/company/') || /contact|website|mailto:/i.test(v.href) || /company|website|contact/i.test(v.text)).slice(0, 30);
    const controls = Array.from(document.querySelectorAll('button,a,[role="button"],[role="menuitem"]')).map(el => {
      const rect = el.getBoundingClientRect();
      return {
        text: String(el.innerText || el.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim(),
        aria: el.getAttribute('aria-label') || '',
        visible: rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight,
      };
    }).filter(v => v.visible && (v.text || v.aria)).slice(0, 100);
    return JSON.stringify({ url, title, emails, lines, links, controls });
  })()`, 8000);
  let parsed;
  try { parsed = new URL(result.url); } catch { parsed = null; }
  if (!parsed || !/linkedin\.com$/i.test(parsed.hostname) || !/^\/sales\/lead\//.test(parsed.pathname)) {
    return { ok: false, sendStatus: 'failed_open', evidence: 'linkedin_sales_lead_identity_mismatch', result };
  }
  return {
    ok: true,
    sendStatus: result.emails.length ? 'email_exposed_exact' : 'email_not_exposed',
    evidence: result.emails.length ? 'complete_email_visible_in_sales_navigator' : 'complete_email_not_visible_in_sales_navigator',
    result,
  };
}

async function inspectLinkedinSalesSearch(payload = {}) {
  const port = Number(payload.port || 9224);
  if (port !== 9224) return { ok: false, sendStatus: 'failed_open', evidence: 'dedicated_cdp_9224_required' };
  const tab = await findTab(port, payload.tabId, payload.targetUrl);
  if (!tab) return { ok: false, sendStatus: 'failed_open', evidence: 'linkedin_sales_search_tab_not_found' };
  const maximum = Math.max(1, Math.min(Number(payload.limit || 50), 200));
  const rows = new Map();
  for (let pass = 0; pass < 20 && rows.size < maximum; pass += 1) {
    const snapshot = await evaluateJson(tab, `(() => {
      const anchors = Array.from(document.querySelectorAll('a[href*="/sales/lead/"]'));
      const items = anchors.map(a => {
        const card = a.closest('li, article, [data-x-search-result], [class*="search-results__result-item"]') || a.parentElement;
        const text = String(card && card.innerText || a.innerText || '').replace(/\\s+/g, ' ').trim();
        return { name: String(a.innerText || a.textContent || '').replace(/\\s+/g, ' ').trim(), profileUrl: a.href, text: text.slice(0, 900) };
      }).filter(v => v.name && v.profileUrl);
      const scrollers = Array.from(document.querySelectorAll('*')).filter(el => el.scrollHeight > el.clientHeight + 300 && el.clientHeight > 300);
      const scroller = scrollers.sort((a,b) => b.clientHeight - a.clientHeight)[0] || document.scrollingElement;
      const before = scroller ? scroller.scrollTop : 0;
      if (scroller) scroller.scrollTop = Math.min(scroller.scrollHeight, before + Math.max(500, scroller.clientHeight * 0.8));
      return JSON.stringify({ url: location.href, title: document.title, items, before, after: scroller ? scroller.scrollTop : 0 });
    })()`, 8000);
    let parsed;
    try { parsed = new URL(snapshot.url); } catch { parsed = null; }
    if (!parsed || !/linkedin\.com$/i.test(parsed.hostname) || !/^\/sales\/search\/people/.test(parsed.pathname)) {
      return { ok: false, sendStatus: 'failed_open', evidence: 'linkedin_sales_people_search_identity_mismatch' };
    }
    for (const item of snapshot.items || []) {
      const key = String(item.profileUrl || '').split('?')[0];
      if (key && !rows.has(key)) rows.set(key, item);
      if (rows.size >= maximum) break;
    }
    await sleep(650);
  }
  return { ok: true, sendStatus: 'read_only_inspection', evidence: 'sales_navigator_visible_rows_collected_no_interaction', count: rows.size, results: Array.from(rows.values()).slice(0, maximum) };
}

async function inspectAlibabaComposeControls(payload = {}) {
  const port = Number(payload.port || 9224);
  if (port !== 9224) return { ok: false, evidence: 'dedicated_chrome_port_9224_required' };
  const tabs = await httpJson(`http://127.0.0.1:${port}/json`, 3500);
  const tab = tabs.find(item => /qiye\.aliyun\.com\/alimail\/entries\/v5\.1\/compose/i.test(String(item.url || '')));
  if (!tab) return { ok: false, evidence: 'alibaba_compose_tab_not_found' };
  const controls = await evaluateJson(tab, `(() => JSON.stringify(Array.from(document.querySelectorAll('[data-testid="compose-container"] *'))
    .filter(element => element.matches('button,[role="button"],a,input,[tabindex]'))
    .map(element => ({
      tag: element.tagName,
      type: element.type || '',
      text: String(element.innerText || element.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 100),
      aria: element.getAttribute?.('aria-label') || '',
      title: element.getAttribute?.('title') || '',
      testid: element.getAttribute?.('data-testid') || '',
      className: String(element.className || '').slice(0, 140),
      visible: Boolean(element.getClientRects?.().length),
    }))
    .filter(item => item.visible || item.type === 'file')))()`, 8000);
  return { ok: true, sendStatus: 'read_only_inspection', evidence: 'alibaba_compose_controls_inspected_no_interaction', controls };
}

async function main() {
  const command = process.argv[2];
  const rawPayload = process.argv[3] || '{}';
  const payload = rawPayload.startsWith('base64:')
    ? JSON.parse(Buffer.from(rawPayload.slice(7), 'base64').toString('utf8'))
    : JSON.parse(rawPayload);
  let result;
  if (command === 'prepare-instagram-draft') result = await prepareInstagramDraft(payload);
  else if (command === 'prepare-social-draft') result = await prepareSocialDraft(payload);
  else if (command === 'engage-social-profile') result = await engageSocialProfile(payload);
  else if (command === 'inspect-social-context') result = await inspectSocialContext(payload);
  else if (command === 'connect-linkedin-sales-search') result = await connectLinkedinSalesSearch(payload);
  else if (command === 'connect-linkedin-sales-lead') result = await connectLinkedinSalesLead(payload);
  else if (command === 'inspect-linkedin-sales-lead') result = await inspectLinkedinSalesLead(payload);
  else if (command === 'inspect-linkedin-sales-search') result = await inspectLinkedinSalesSearch(payload);
  else if (command === 'inspect-alibaba-compose-controls') result = await inspectAlibabaComposeControls(payload);
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

module.exports = {
  identityCheckExpression,
  sendButtonExpression,
  sendConfirmationExpression,
  confirmPersistedSentMessage,
  linkedinSalesSearchCandidateExpression,
  linkedinVisibleActionExpression,
};
