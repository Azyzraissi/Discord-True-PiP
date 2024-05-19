function enablePictureInPicture() {
    const videoElements = document.getElementsByTagName('video');
  
    if (!document.pictureInPictureEnabled) {
      console.error('Picture-in-Picture is not supported in this browser.');
      return;
    }
  
    async function enterPiP(video) {
      if (document.pictureInPictureElement !== video) {
        try {
          await video.requestPictureInPicture();
        } catch (error) {
          if (error.name === 'NotAllowedError' || error.name === 'NotSupportedError') {
            console.error('Error entering Picture-in-Picture mode:', error);
          }
        }
      }
    }
  
    function checkAndEnterPiP() {
      Array.from(videoElements).forEach(video => {
        if (!document.pictureInPictureElement && !video.paused && !video.ended) {
          enterPiP(video);
        }
      });
    }
  
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        checkAndEnterPiP();
      }
    });
  
    window.addEventListener('focus', () => {
      if (!document.hidden) {
        checkAndEnterPiP();
      }
    });
  
    window.addEventListener('resize', () => {
      if (!document.hidden) {
        checkAndEnterPiP();
      }
    });
  
    // Initial check
    if (document.visibilityState === 'hidden') {
      checkAndEnterPiP();
    }
  }
  
  // Check if the extension is enabled and run the function
  chrome.storage.local.get('extensionEnabled', (result) => {
    if (result.extensionEnabled) {
      enablePictureInPicture();
    }
  });
  
  // Listen for messages to enable/disable the extension dynamically
  chrome.runtime.onMessage.addListener((message) => {
    if (message.extensionEnabled) {
      enablePictureInPicture();
    } else {
      // Exit Picture-in-Picture mode if the extension is disabled
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(error => {
          console.error('Error exiting Picture-in-Picture mode:', error);
        });
      }
    }
  });