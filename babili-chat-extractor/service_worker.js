// service_worker.js - Simple background worker for the extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('Babili Chat Extractor installed');
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Service worker received message:', request);
  sendResponse({ received: true });
});
