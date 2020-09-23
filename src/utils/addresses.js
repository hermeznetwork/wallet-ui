const hermezPrefix = 'hez:'

/**
 * Get the hermez address representation of an ethereum address
 * @param {string} ethereumAddress
 * @returns {string}
 */
function getHermezAddress (ethereumAddress) {
  return `${hermezPrefix}${ethereumAddress}`
}

/**
 * Get the partially hidden hermez address representation of an ethereum address
 * @param {string} ethereumAddress
 * @returns {string}
 */
function getPartiallyHiddenHermezAddress (ethereumAddress) {
  const firstAddressSlice = ethereumAddress.slice(0, 10)
  const secondAddressSlice = ethereumAddress.slice(
    ethereumAddress.length - 4,
    ethereumAddress.length
  )

  return `${firstAddressSlice} *** ${secondAddressSlice}`
}

export {
  getHermezAddress,
  getPartiallyHiddenHermezAddress
}
