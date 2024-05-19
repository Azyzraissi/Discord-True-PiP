function enablePictureInPicture() {
    const videoElements = document.getElementsByTagName('video');
  
    if (!document.pictureInPictureEnabled) {
      console.error('Picture-in-Picture is not supported in this browser.');
      return;
    }
  
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        Array.from(videoElements).forEach(video => {
          if (document.pictureInPictureElement !== video) {
            video.requestPictureInPicture().catch(error => {
              console.error('Error entering Picture-in-Picture mode:', error);
            });
          }
        });
      }
    });
  
    window.addEventListener('resize', () => {
      if (!document.hidden) {
        Array.from(videoElements).forEach(video => {
          if (document.pictureInPictureElement === video) {
            video.requestPictureInPicture().catch(error => {
              console.error('Error entering Picture-in-Picture mode:', error);
            });
          }
        });
      }
    });
  }
  
  chrome.storage.local.get('extensionEnabled', (result) => {
    if (result.extensionEnabled) {
      enablePictureInPicture();
    }
  });