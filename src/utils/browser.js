/**
 * Copies a text to the user clipboard
 * @param {*} text - Text to be copied to the clipboard
 * @returns {void}
 */
function copyToClipboard (text) {
  const textArea = document.createElement('textarea')

  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.opacity = 0
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
}

/**
 * Reads the content of the user clipboard
 * @returns {string} - Content read from the user clipboard
 */
function readFromClipboard () {
  return navigator.clipboard.readText()
}

export {
  copyToClipboard,
  readFromClipboard
}
