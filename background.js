// Background script
chrome.runtime.onInstalled.addListener(() => {
    // Set the initial state
    chrome.storage.local.set({ extensionEnabled: false });
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggleExtension') {
      chrome.storage.local.set({ extensionEnabled: message.enabled }, () => {
        if (message.enabled) {
          chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            files: ['content.js']
          });
        }
        sendResponse({ status: 'done' });
      });
      return true; // Indicates that the response is asynchronous
    }
  });