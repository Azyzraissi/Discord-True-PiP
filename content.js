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
          console.error('Error entering Picture-in-Picture mode:', error);
        }
      }
    }
  
    function checkAndEnterPiP() {
      Array.from(videoElements).forEach(video => {
        enterPiP(video);
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