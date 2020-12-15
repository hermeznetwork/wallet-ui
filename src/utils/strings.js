/**
 * Converts a string to hex
 * @param {string} value - String to convert to hex
 * @returns {string} - String converted to hex
 */
function strToHex (value) {
  if (typeof value !== 'string') {
    throw new Error('The input value should be a string')
  }

  return value.split('')
    .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
}

export {
  strToHex
}
