/**
 * Copies a text to the user clipboard
 */
function copyToClipboard(text: string): void {
  const textArea = document.createElement("textarea");

  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

/**
 * Reads the content of the user clipboard
 */
function readFromClipboard(): Promise<string> {
  return navigator.clipboard.readText();
}

/**
 * Checks if the user has at least one videodevice available
 */
function isAnyVideoDeviceAvailable(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      reject(new Error("enumerateDevices() not supported"));
    }

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        if (devices.some((device) => device.kind === "videoinput")) {
          resolve(true);
        }

        resolve(false);
      })
      .catch(reject);
  });
}

function isMobileDevice(): boolean {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function isAndroidDevice(): boolean {
  return /Android/i.test(navigator.userAgent);
}

function isiOsDevice(): boolean {
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

function isFirefox(): boolean {
  return /firefox/i.test(navigator.userAgent);
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
