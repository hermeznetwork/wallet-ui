/**
 * Converts a time to a corresponding 'Xh Xd Xm left' string
 * @param {Number} endingTime - time in ms
 * @returns {String}
 */

function getTimeLeft (time) {
  const m = Math.floor((time / (1000 * 60)) % 60)
  const h = Math.floor((time / (1000 * 60 * 60)) % 24)
  const d = Math.floor(time / (1000 * 60 * 60 * 24))

  return `${d}d ${h}h ${m}m left`
}

export { getTimeLeft }
