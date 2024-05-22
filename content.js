function enablePictureInPicture() {
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
        console.error('Error entering Picture-in-Picture mode:', error);
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
    const videoElements = document.getElementsByTagName('video');
    Array.from(videoElements).forEach(video => {
      if (!pipActive && !video.paused && !video.ended) {
        enterPiP(video);
      }
    });
  }

  function monitorVideos() {
    const videoElements = document.getElementsByTagName('video');
    Array.from(videoElements).forEach(video => {
      video.addEventListener('play', () => {
        if (document.hidden || !document.hasFocus()) {
          enterPiP(video);
        }
      });

      video.addEventListener('pause', () => {
        exitPiP();
      });

      video.addEventListener('ended', () => {
        exitPiP();
      });

      video.addEventListener('enterpictureinpicture', () => {
        if (!pipActive) {
          exitPiP(); // Close our PiP if Discord's internal PiP is triggered
        }
      });

      video.addEventListener('leavepictureinpicture', () => {
        pipActive = false;
      });

      // Detect state changes triggered by Discord's internal mechanisms
      video.addEventListener('emptied', () => {
        exitPiP();
      });

      video.addEventListener('abort', () => {
        exitPiP();
      });

      video.addEventListener('error', () => {
        exitPiP();
      });
    });
  }

  // Event listeners for visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      checkAndEnterPiP();
    }
  });

  // Event listeners for window focus and blur
  window.addEventListener('blur', () => {
    checkAndEnterPiP();
  });

  window.addEventListener('focus', () => {
    // Keep PiP active when the window gains focus
  });

  // Initial check
  if (document.visibilityState === 'hidden' || !document.hasFocus()) {
    checkAndEnterPiP();
  }

  // Monitor URL changes to keep PiP active when navigating within Discord
  const observer = new MutationObserver(() => {
    checkAndEnterPiP();
    monitorVideos();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Run the monitor function to attach event listeners to existing videos
  monitorVideos();
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