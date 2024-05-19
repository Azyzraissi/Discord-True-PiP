function enablePictureInPicture() {
    const videoElements = document.getElementsByTagName('video');
  
    if (!document.pictureInPictureEnabled) {
      console.error('Picture-in-Picture is not supported in this browser.');
      return;
    }
  
    function enterPiP(video) {
      if (document.pictureInPictureElement !== video) {
        video.requestPictureInPicture().catch(error => {
          console.error('Error entering Picture-in-Picture mode:', error);
        });
      }
    }
  
    function checkAndEnterPiP() {
      Array.from(videoElements).forEach(video => {
        if (!document.pictureInPictureElement) {
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
      checkAndEnterPiP();
    });
  
    window.addEventListener('resize', () => {
      checkAndEnterPiP();
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