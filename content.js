function enablePictureInPicture() {
    const videoElements = document.getElementsByTagName('video');
    let actionTaken = false; // Track if any action has been taken on the page
    let pipActive = false; // Track if PiP mode is currently active
  
    if (!document.pictureInPictureEnabled) {
      console.error('Picture-in-Picture is not supported in this browser.');
      return;
    }
  
    async function enterPiP(video) {
      if (!pipActive && !video.paused && !video.ended) {
        try {
          await video.requestPictureInPicture();
          pipActive = true;
        } catch (error) {
          if (error.name === 'NotAllowedError' || error.name === 'NotSupportedError') {
            console.error('Error entering Picture-in-Picture mode:', error);
          }
        }
      }
    }
  
    async function exitPiP() {
      if (pipActive) {
        try {
          await document.exitPictureInPicture();
          pipActive = false;
        } catch (error) {
          console.error('Error exiting Picture-in-Picture mode:', error);
        }
      }
    }
  
    function checkAndEnterPiP() {
      Array.from(videoElements).forEach(video => {
        if (!pipActive && !video.paused && !video.ended) {
          enterPiP(video);
        }
      });
    }
  
    // Function to reset actionTaken flag and exit PiP mode
    function resetAndExitPiP() {
      actionTaken = false;
      exitPiP();
    }
  
    // Event listeners to track user actions
    document.addEventListener('click', resetAndExitPiP);
    document.addEventListener('input', resetAndExitPiP);
    document.addEventListener('keydown', resetAndExitPiP);
  
    // Event listeners for visibility change, focus, and resize
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