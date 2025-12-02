// content.js - Enhanced chat extraction for multiple platforms
(function () {
  // Prevent double-injection when executeScript runs the file multiple times
  if (window.__BABILI_CHAT_EXTRACTOR_INJECTED) {
    // Respond to messages if previously injected
    chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
      if (msg && msg.action === 'extract_messages') {
        extractMessages().then(res => sendResponse(res)).catch(err => sendResponse({ success: false, error: err.message }));
        return true;
      }
    });
    return;
  }
  window.__BABILI_CHAT_EXTRACTOR_INJECTED = true;

  async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  // Heuristics to find the chat scroll container
  function findScrollContainer() {
    // Common candidates: role="main", role="log", div[aria-label*="Conversation"], or the outer chat scrollable div
    const candidates = [
      // Google Chat 2024-2025 - scrollable div with jsname (from DOM inspection)
      {
        name: 'Google Chat scrollable (jsname)', fn: () => {
          const scrollables = Array.from(document.querySelectorAll('div[jsname]')).filter(d =>
            d.scrollHeight > d.clientHeight && d.clientHeight > 300
          );
          return scrollables[0];
        }
      },
      // Generic scrollable div - most reliable for Google Chat
      {
        name: 'Any scrollable div (>300px)', fn: () => {
          const scrollables = Array.from(document.querySelectorAll('div')).filter(d =>
            d.scrollHeight > d.clientHeight && d.clientHeight > 300
          );
          return scrollables[0];
        }
      },
      // Google Chat specific containers
      { name: 'Conversation with aria-label', fn: () => document.querySelector('div[aria-label*="Conversation with"]') },
      { name: 'role=list', fn: () => document.querySelector('div[role="list"]') },
      { name: 'role=log', fn: () => document.querySelector('[role="log"]') },
      { name: 'Messages aria-label', fn: () => document.querySelector('[aria-label*="Messages"]') },
      { name: 'Main content area', fn: () => document.querySelector('main') },
      // WhatsApp
      { name: 'WhatsApp conversation panel', fn: () => document.querySelector('[data-testid="conversation-panel-messages"]') },
      // Generic fallbacks
      { name: 'role=main', fn: () => document.querySelector('[role="main"]') },
      { name: 'role=region', fn: () => document.querySelector('div[role="region"]') },
      // Aggressive Google Chat fallback
      { name: 'Google Chat content (c-wiz)', fn: () => document.querySelector('c-wiz[data-topic-id]') }
    ];

    for (const candidate of candidates) {
      try {
        const el = candidate.fn();
        if (el) {
          console.log(`[Babili] Found container using: ${candidate.name}`, el);
          return el;
        }
      } catch (e) {
        console.warn(`[Babili] Container candidate "${candidate.name}" failed:`, e);
      }
    }

    // Fallback to body
    console.warn('[Babili] Using document.body as fallback container');
    return document.scrollingElement || document.body;
  }

  // Utility to normalize timestamps (best-effort)
  function parseTimestampFromNode(node) {
    try {
      // Google Chat 2024-2025 - check siblings for timestamp
      const parent = node.parentElement;
      if (parent && parent.classList.contains('rogmqd')) {
        // Look in sibling elements for timestamp
        const siblings = Array.from(parent.children);
        for (const sibling of siblings) {
          if (sibling === node) continue; // Skip the message node itself

          // Look for timestamp-like content
          const siblingText = sibling.textContent?.trim();
          if (siblingText && siblingText.length < 30) {
            // Check for timestamp patterns
            if (/\d{1,2}:\d{2}|Yesterday|Today|\d+\s*min|\d+\s*hour/i.test(siblingText)) {
              return siblingText;
            }
          }

          // Check children of siblings
          const timeEl = sibling.querySelector('time, .timestamp, [aria-label*="time"]');
          if (timeEl) {
            return timeEl.textContent?.trim() || timeEl.getAttribute('datetime') || null;
          }
        }
      }

      // Google Chat specific - look for aria-label with timestamp pattern (check node AND parent)
      const ariaLabel = node.getAttribute('aria-label') || node.parentElement?.getAttribute('aria-label');
      if (ariaLabel) {
        // Extract timestamp from patterns like "Message from Sandra Masiwa at Yesterday 21:23"
        const timeMatch = ariaLabel.match(/at (.+)$/i);
        if (timeMatch) return timeMatch[1].trim();
      }

      // Look for time elements
      const timeEl = node.querySelector('time, span[aria-label], abbr, .timestamp, .Ts, [data-testid="msg-meta"]');
      if (timeEl) {
        const txt = timeEl.getAttribute('datetime') || timeEl.getAttribute('aria-label') || timeEl.title || timeEl.textContent;
        if (txt) return txt.trim();
      }

      // Try finding timestamp in sibling or parent elements
      const parentEl = node.closest('[data-timestamp]') || node.parentElement;
      if (parentEl) {
        const found = parentEl.querySelector('time, span[aria-label], abbr, .timestamp');
        if (found) return found.textContent.trim();
      }

      // Look for common timestamp patterns in text content
      const textContent = node.textContent;
      const timestampPatterns = [
        /Yesterday \d{1,2}:\d{2}/i,
        /Today \d{1,2}:\d{2}/i,
        /\d{1,2}:\d{2}\s*(AM|PM)?/i,
        /\d+\s*min(ute)?s?\s*ago/i,
        /\d+\s*hour?s?\s*ago/i
      ];
      for (const pattern of timestampPatterns) {
        const match = textContent.match(pattern);
        if (match) return match[0];
      }
    } catch (e) { }
    return null;
  }

  // Heuristic to extract sender from a message node
  function extractSender(node) {
    // Google Chat 2024-2025 - check parent and siblings
    // Messages from "You" are typically aligned right
    const parent = node.parentElement;
    if (parent && parent.classList.contains('rogmqd')) {
      // Check if this is a right-aligned message (from You)
      const computedStyle = window.getComputedStyle(parent);
      const parentComputedStyle = window.getComputedStyle(parent.parentElement || parent);

      // Check various alignment indicators
      if (computedStyle.marginLeft === 'auto' ||
        computedStyle.justifyContent === 'flex-end' ||
        computedStyle.alignSelf === 'flex-end' ||
        parentComputedStyle.justifyContent === 'flex-end') {
        return 'You';
      }

      // Look for sender name in siblings WITHIN the same message container (rogmqd)
      // Do NOT look at parent.parentElement.children as those are other messages
      const siblings = Array.from(parent.children);
      for (const sibling of siblings) {
        if (sibling === node) continue;
        const text = sibling.textContent?.trim();
        // Avoid picking up timestamps or other metadata
        if (text && text.length > 2 && text.length < 50 && /^[A-Za-z\s]{2,40}$/.test(text) && !/\d{1,2}:\d{2}/.test(text)) {
          // Found potential sender name
          return text;
        }
      }
    }

    // Google Chat - extract from aria-label (check node AND parent)
    const ariaLabel = node.getAttribute('aria-label') || node.parentElement?.getAttribute('aria-label');
    if (ariaLabel) {
      // Pattern: "Message from Sandra Masiwa at Yesterday 21:23"
      const fromMatch = ariaLabel.match(/(?:Message )?from (.+?) at/i);
      if (fromMatch) return fromMatch[1].trim();

      // Pattern: "You sent a message at ..."
      if (ariaLabel.match(/You sent|You at/i)) return 'You';
    }

    // WhatsApp specific
    const whatsappSender = node.querySelector('[data-testid="message-author"]');
    if (whatsappSender) {
      return whatsappSender.textContent.trim() || 'You';
    }

    // Look for sender name element
    const nameEl = node.querySelector('[aria-label][data-name], .zW, .sender, .participant, .name, [data-sender-name]');
    if (nameEl) {
      return nameEl.getAttribute('data-name') || nameEl.getAttribute('aria-label') || nameEl.textContent.trim();
    }

    // Check if message is aligned right (usually indicates "You")
    const computedStyle = window.getComputedStyle(node);
    if (computedStyle.marginLeft === 'auto' || computedStyle.alignSelf === 'flex-end' || computedStyle.justifyContent === 'flex-end') {
      return 'You';
    }

    // Some layouts put sender in the previous sibling
    let prev = node.previousElementSibling;
    while (prev) {
      if (prev.textContent && prev.textContent.trim().length < 80) {
        // Small heuristic to pick short names
        const txt = prev.textContent.trim();
        if (/^[A-Za-z\s]{2,40}$/.test(txt)) return txt;
      }
      prev = prev.previousElementSibling;
    }

    return 'Unknown';
  }

  // Extract the textual content and media indicators
  function extractTextFromNode(node) {
    // WhatsApp specific extraction
    const whatsappText = node.querySelectorAll('.copyable-text span');
    if (whatsappText.length > 0) {
      let text = '';
      whatsappText.forEach(span => {
        if (span.textContent && !span.textContent.includes('[')) {
          text += span.textContent;
        }
      });
      if (text) return text.trim();
    }

    // Google Chat 2024-2025 - extract from jsname="bgckF" or .DTp27d container
    if (node.hasAttribute('jsname') && node.getAttribute('jsname') === 'bgckF') {
      // This is the message container itself - get direct text
      let text = '';
      node.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          text += child.textContent;
        }
      });
      if (text.trim()) return text.trim();
    }

    // Google Chat - look for message content element
    const googleChatContent = node.querySelector('[data-message-text], .zzVqCe, div[dir="auto"]');
    if (googleChatContent) {
      const text = googleChatContent.textContent.trim();
      // Filter out timestamps that might be included
      const cleanedText = text.replace(/Yesterday \d{1,2}:\d{2}/gi, '')
        .replace(/Today \d{1,2}:\d{2}/gi, '')
        .replace(/\d{1,2}:\d{2}\s*(AM|PM)?/gi, '')
        .trim();
      if (cleanedText) return cleanedText;
    }

    // Get visible text, preserving emoji and inline links
    const nodeClone = node.cloneNode(true);
    const selectorsToRemove = [
      'button', 'svg', 'img', 'iframe', 'input',
      '.reaction', '.metadata', '.timestamp',
      'time', '[aria-label*="at "]' // Remove timestamp elements
    ];
    selectorsToRemove.forEach(sel => {
      const els = nodeClone.querySelectorAll(sel);
      els.forEach(e => e.remove());
    });

    let txt = nodeClone.textContent || '';

    // Clean up common artifacts
    txt = txt.replace(/Yesterday \d{1,2}:\d{2}/gi, '')
      .replace(/Today \d{1,2}:\d{2}/gi, '')
      .replace(/\d{1,2}:\d{2}\s*(AM|PM)?/gi, '')
      .trim();

    return txt;
  }

  // Collect message nodes heuristically
  function findMessageNodes(container) {
    // WhatsApp specific
    const whatsappMessages = container.querySelectorAll('[data-testid^="msg-container"]');
    if (whatsappMessages.length > 0) {
      console.log('[Babili] Found WhatsApp messages:', whatsappMessages.length);
      return Array.from(whatsappMessages);
    }

    // Google Chat specific - try multiple selector strategies
    const googleChatSelectors = [
      // 2024-2025 Google Chat structure (from DOM inspection)
      'div[jsname="bgckF"]', // Direct message container
      '.rogmqd', // Message parent container
      'div.DTp27d', // Message content div
      // Other 2024+ patterns
      'div[data-message-id]:not([data-message-id=""])',
      'div[jslog*="message"]',
      'div[aria-label*="Message from"]',
      'div[aria-label*="You at"]',
      'div[data-topic-id] > div[role="listitem"]',
      // Older patterns
      'div[aria-label*="from "]',
      '.nH.aJl > div', // Gmail chat container pattern
      'c-wiz[data-message-id]'
    ];

    for (const selector of googleChatSelectors) {
      try {
        const messages = Array.from(container.querySelectorAll(selector));
        console.log(`[Babili] Trying selector "${selector}": found ${messages.length}`);

        // Filter out non-message elements
        const validMessages = messages.filter(msg => {
          const text = msg.textContent.trim();
          // Exclude common UI elements
          if (text.includes('Try reloading the page')) return false;
          if (text.includes('Break free from browser tabs')) return false;
          if (text.includes('Learn more about the app')) return false;
          if (text.includes('Google Workspace')) return false;
          if (text.includes('History is on')) return false;
          if (text.length === 0) return false;
          if (text.length < 2) return false; // Too short
          return true;
        });

        console.log(`[Babili] After filtering: ${validMessages.length} valid messages`);

        if (validMessages.length > 0) {
          return validMessages;
        }
      } catch (e) {
        console.warn('[Babili] Selector failed:', selector, e);
      }
    }

    // Aggressive fallback for Google Chat - look for message-like patterns
    console.warn('[Babili] Using aggressive fallback strategy');
    try {
      const allElements = container.querySelectorAll('div');
      const messagePattern = /^((?!Search|New chat|Home|Mentions|Starred|History).)+/;

      const possibleMessages = Array.from(allElements).filter(el => {
        // Look for elements with reasonable text content
        const text = el.textContent?.trim();
        if (!text || text.length < 2 || text.length > 500) return false;

        // Must have an aria-label or be a direct child of something with one
        const hasAriaLabel = el.hasAttribute('aria-label') || el.parentElement?.hasAttribute('aria-label');
        if (!hasAriaLabel) return false;

        // Exclude UI elements
        if (text.includes('Try reloading')) return false;
        if (text.includes('Break free from')) return false;

        return true;
      });

      console.log('[Babili] Aggressive fallback found:', possibleMessages.length);
      if (possibleMessages.length > 0) return possibleMessages;
    } catch (e) {
      console.error('[Babili] Aggressive fallback failed:', e);
    }

    // Final fallback: Common selectors for other platforms
    const genericSelectors = [
      'div[role="listitem"]',
      'div[role="row"]',
      '.message, .chat-message, [data-type="message"]'
    ];

    for (const selector of genericSelectors) {
      try {
        const found = Array.from(container.querySelectorAll(selector));
        console.log(`[Babili] Generic selector "${selector}": found ${found.length}`);
        if (found.length > 0) return found;
      } catch (e) { }
    }

    console.error('[Babili] No messages found with any selector strategy');
    return [];
  }

  // Auto-scroll until no new content loads (best-effort)
  async function autoScrollToTop(container, maxIters = 100) {
    console.log('[Babili] Starting auto-scroll to load all messages...');
    try {
      let lastHeight = -1;
      let stableCount = 0;
      const STABLE_THRESHOLD = 3; // Consider stable after 3 consecutive similar heights

      for (let i = 0; i < maxIters; i++) {
        const scrollTopBefore = container.scrollTop;
        container.scrollTop = 0; // Go to top (oldest)

        // Wait for content to load (10 seconds for very conservative loading)
        await wait(10000);

        const newHeight = container.scrollHeight;
        const heightDiff = Math.abs(newHeight - lastHeight);

        // Log progress every 10 iterations
        if (i % 10 === 0 || heightDiff > 10) {
          console.log(`[Babili] Scroll iteration ${i + 1}/${maxIters}: height=${newHeight}px (diff: ${heightDiff}px)`);
        }

        // Check if height has stabilized
        if (heightDiff < 10) {
          stableCount++;
          if (stableCount >= STABLE_THRESHOLD) {
            console.log(`[Babili] ✓ Scroll complete after ${i + 1} iterations. All messages loaded.`);
            break;
          }
        } else {
          stableCount = 0; // Reset if we see growth
        }

        lastHeight = newHeight;
      }

      if (stableCount < STABLE_THRESHOLD) {
        console.warn(`[Babili] Reached max iterations (${maxIters}). May not have loaded all messages.`);
      }
    } catch (e) {
      console.error('[Babili] Auto-scroll error:', e);
    }
  }

  // Main extraction function
  async function extractMessages() {
    const container = findScrollContainer();
    if (!container) {
      console.error('[Babili] Could not find chat container');
      return { success: false, error: 'Could not find chat container.' };
    }

    console.log('[Babili] Found container:', container);

    // Auto-scroll disabled per user request - only extract visible messages
    // await autoScrollToTop(container, 80);
    // await wait(500);

    const messageNodes = findMessageNodes(container);
    console.log('[Babili] Found message nodes:', messageNodes.length);

    if (messageNodes.length === 0) {
      // Try a very broad fallback approach
      console.warn('[Babili] No messages found with primary selectors, trying fallback');
      const allDivs = container.querySelectorAll('div');
      console.log('[Babili] Total divs in container:', allDivs.length);
    }

    const messages = [];
    let idCounter = 1;

    for (const node of messageNodes) {
      try {
        let text = extractTextFromNode(node);
        console.log(`[Babili] Node ${idCounter} - raw text:`, text?.substring(0, 100));

        if (!text || text.length === 0) {
          console.log(`[Babili] Skipping node ${idCounter} - no text`);
          continue;
        }

        const sender = extractSender(node);
        console.log(`[Babili] Node ${idCounter} - sender:`, sender);

        // Clean up: remove sender name if it appears at the start of the text
        if (sender && sender !== 'Unknown' && sender !== 'You') {
          // Remove sender name from beginning of text (common in some chat exports)
          if (text.startsWith(sender)) {
            text = text.substring(sender.length).trim();
          }
          // Also handle "Sender:" pattern
          const senderPattern = new RegExp(`^${sender.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:?\\s*`, 'i');
          text = text.replace(senderPattern, '').trim();
        }

        // Skip if text is too short after cleanup
        if (text.length < 1) {
          console.log(`[Babili] Skipping node ${idCounter} - text too short after cleanup`);
          continue;
        }

        const ts = parseTimestampFromNode(node) || (node.getAttribute('data-ts') || node.getAttribute('data-message-id') || null);
        const rawHtml = node.innerHTML || null;

        console.log(`[Babili] ✓ Extracted message ${idCounter}: "${text.substring(0, 50)}..." from ${sender}`);

        messages.push({
          id: 'm' + (idCounter++),
          sender,
          text,
          timestamp: ts,
          rawHtml
        });
      } catch (e) {
        // Skip problematic nodes
        console.warn('[Babili] Failed to extract message:', e);
      }
    }

    // Basic metadata attempt
    const metadata = {
      url: location.href,
      title: document.title,
      extractedAt: new Date().toISOString(),
      platform: detectPlatform()
    };

    return { success: true, metadata, messages };
  }

  // Detect which chat platform we're on
  function detectPlatform() {
    const url = location.href;
    if (url.includes('web.whatsapp.com')) return 'WhatsApp Web';
    if (url.includes('chat.google.com')) return 'Google Chat';
    if (url.includes('mail.google.com')) return 'Gmail Chat';
    if (url.includes('messenger.com')) return 'Facebook Messenger';
    if (url.includes('web.telegram.org')) return 'Telegram Web';
    return 'Unknown Platform';
  }

  // Message handler for popup requests
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg && msg.action === 'extract_messages') {
      extractMessages().then(res => sendResponse(res)).catch(err => sendResponse({ success: false, error: err.message }));
      return true; // Indicates async
    }
  });

})();
