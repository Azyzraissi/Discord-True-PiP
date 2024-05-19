document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggleExtension');
  
    chrome.storage.local.get('extensionEnabled', (result) => {
      toggle.checked = result.extensionEnabled;
    });
  
    toggle.addEventListener('change', () => {
      const enabled = toggle.checked;
      chrome.storage.local.set({ extensionEnabled: enabled });
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.runtime.sendMessage({ action: 'toggleExtension', enabled: enabled });
      });
    });
  });