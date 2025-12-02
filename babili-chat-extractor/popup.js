// popup.js - Babili Chat Extractor
const extractBtn = document.getElementById('extractBtn');
const exportBtn = document.getElementById('exportBtn');
const uploadBtn = document.getElementById('uploadBtn');
const statusEl = document.getElementById('status');
const outputEl = document.getElementById('output');
const uploadUrlInput = document.getElementById('uploadUrl');

let latestData = null;

function setStatus(message, type = '') {
  statusEl.textContent = message;
  statusEl.className = 'status';
  if (type) {
    statusEl.classList.add(type);
  }
}

extractBtn.addEventListener('click', async () => {
  setStatus('Injecting content script...', 'loading');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      setStatus('No active tab found', 'error');
      return;
    }

    // Inject the content script into ALL frames (important for Gmail Chat)
    const injectionResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      files: ['content.js']
    });

    setStatus(`Extracting messages from ${injectionResults.length} frames...`, 'loading');

    // Collect responses from ALL frames
    const allFrames = await chrome.webNavigation.getAllFrames({ tabId: tab.id });
    console.log(`[Popup] Found ${allFrames.length} frames`);

    const responses = [];
    for (const frame of allFrames) {
      try {
        const response = await chrome.tabs.sendMessage(tab.id,
          { action: 'extract_messages' },
          { frameId: frame.frameId }
        );
        if (response && response.success && response.messages && response.messages.length > 0) {
          console.log(`[Popup] Frame ${frame.frameId} returned ${response.messages.length} messages`);
          responses.push(response);
        }
      } catch (e) {
        console.log(`[Popup] Frame ${frame.frameId} failed:`, e.message);
      }
    }

    if (responses.length === 0) {
      setStatus('No messages extracted. Make sure a chat is open.', 'error');
      return;
    }

    // Find the response with the most messages (likely the actual chat)
    const bestResponse = responses.reduce((best, current) =>
      current.messages.length > best.messages.length ? current : best
    );

    console.log(`[Popup] Using response with ${bestResponse.messages.length} messages`);

    latestData = bestResponse.messages;
    setStatus(`Extracted ${latestData.length} messages successfully`, 'success');

    // Enable export and upload buttons
    exportBtn.disabled = false;
    uploadBtn.disabled = false;

    // Show preview in output
    const preview = {
      metadata: bestResponse.metadata,
      messageCount: latestData.length,
      firstMessage: latestData[0],
      lastMessage: latestData[latestData.length - 1]
    };
    outputEl.textContent = JSON.stringify(preview, null, 2);
  } catch (error) {
    console.error('Extraction error:', error);
    setStatus('Failed to extract. See console for details.', 'error');
  }
});

// Listen for extraction completion from service worker
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'extraction_complete') {
    latestData = msg.messages;
    setStatus(`Extracted ${latestData.length} messages successfully`, 'success');

    // Enable export and upload buttons
    exportBtn.disabled = false;
    uploadBtn.disabled = false;

    // Show preview in output
    const preview = {
      metadata: msg.metadata,
      messageCount: latestData.length,
      firstMessage: latestData[0],
      lastMessage: latestData[latestData.length - 1]
    };
    outputEl.textContent = JSON.stringify(preview, null, 2);
  }
});

exportBtn.addEventListener('click', async () => {
  if (!latestData || latestData.length === 0) {
    setStatus('No data to export', 'error');
    return;
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    messageCount: latestData.length,
    messages: latestData
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const filename = `babili-chat-${Date.now()}.json`;

  try {
    await chrome.downloads.download({ url, filename, saveAs: true });
    setStatus('Download started successfully', 'success');
  } catch (error) {
    console.error('Download error:', error);
    setStatus('Download failed. See console.', 'error');
  } finally {
    URL.revokeObjectURL(url);
  }
});

uploadBtn.addEventListener('click', async () => {
  if (!latestData || latestData.length === 0) {
    setStatus('No data to upload', 'error');
    return;
  }

  const uploadUrl = uploadUrlInput.value.trim();
  if (!uploadUrl) {
    setStatus('Enter a valid upload URL', 'error');
    return;
  }

  setStatus('Uploading to Babili...', 'loading');

  const payload = {
    exportedAt: new Date().toISOString(),
    messageCount: latestData.length,
    messages: latestData
  };

  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      setStatus('Upload successful!', 'success');
    } else {
      const errorText = await response.text();
      setStatus(`Upload failed: ${response.status} ${errorText}`, 'error');
    }
  } catch (error) {
    console.error('Upload error:', error);
    setStatus('Upload error. Check console.', 'error');
  }
});
