/**
 * Copies a text to the user clipboard
 * @param {*} text - Text to be copied to the clipboard
 * @returns {void}
 */
function copyToClipboard(text) {
  const textArea = document.createElement("textarea");

  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = 0;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

/**
 * Reads the content of the user clipboard
 * @returns {string} - Content read from the user clipboard
 */
function readFromClipboard() {
  return navigator.clipboard.readText();
}

/**
 * Checks if the user has at least one videodevice available
 * @returns {Promise}
 */
function isAnyVideoDeviceAvailable() {
  return new Promise((resolve, reject) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      reject(new Error("enumerateDevices() not supported"));
    }

    return navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        if (devices.some((device) => device.kind === "videoinput")) {
          return resolve(true);
        }

        return resolve(false);
      })
      .catch(reject);
  });
}

function isMobileDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function isAndroidDevice() {
  return /Android/i.test(navigator.userAgent);
}

function isiOsDevice() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

function isFirefox() {
  return navigator.userAgent.match(/firefox/i);
}

export {
  copyToClipboard,
  readFromClipboard,
  isAnyVideoDeviceAvailable,
  isMobileDevice,
  isAndroidDevice,
  isiOsDevice,
  isFirefox,
};
