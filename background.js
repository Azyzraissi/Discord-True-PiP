chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ extensionEnabled: false });
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggleExtension') {
      chrome.storage.local.set({ extensionEnabled: message.enabled }, () => {
        if (message.enabled) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0].id) {
              chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['content.js']
              });
            }
          });
        }
        sendResponse({ status: 'done' });
      });
      return true;
    }
  });