document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggleExtension');
  
    // Load the current state from storage
    chrome.storage.local.get('extensionEnabled', (result) => {
      toggle.checked = result.extensionEnabled;
    });
  
    // Add event listener to the checkbox
    toggle.addEventListener('change', () => {
      const enabled = toggle.checked;
      chrome.storage.local.set({ extensionEnabled: enabled });
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.runtime.sendMessage({ action: 'toggleExtension', enabled: enabled });
      });
    });
  });