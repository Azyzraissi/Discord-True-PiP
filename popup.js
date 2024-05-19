document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
  
    // Set the initial state of the toggle button based on the stored value
    chrome.storage.local.get('extensionEnabled', (result) => {
      toggleButton.checked = result.extensionEnabled;
    });
  
    // Add an event listener to the toggle button
    toggleButton.addEventListener('change', () => {
      const isEnabled = toggleButton.checked;
      chrome.storage.local.set({ extensionEnabled: isEnabled });
      
      // Notify content scripts about the change
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { extensionEnabled: isEnabled });
      });
    });
  });