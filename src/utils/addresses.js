/**
 * Get the partially hidden representation of a hermez ethereum address
 * @param {string} hermezAddress - Hermez address to partially hide
 * @returns {string} - Partially hidden hermez address
 */
function getPartiallyHiddenHermezAddress (hermezAddress) {
  const firstAddressSlice = hermezAddress.slice(0, 10)
  const secondAddressSlice = hermezAddress.slice(
    hermezAddress.length - 4,
    hermezAddress.length
  )

  return `${firstAddressSlice} *** ${secondAddressSlice}`
}

/**
 * Get the partially hidden representation of a ethereum address
 * @param {string} ethereumAddress - Hermez address to partially hide
 * @returns {string} - Partially hidden ethereum address
 */
function getPartiallyHiddenEthereumAddress (ethereumAddress) {
  const firstAddressSlice = ethereumAddress.slice(0, 6)
  const secondAddressSlice = ethereumAddress.slice(
    ethereumAddress.length - 4,
    ethereumAddress.length
  )

  return `${firstAddressSlice} *** ${secondAddressSlice}`
}

/**
 * Get the ethereum address from a hermez address
 * @param {string} hermezAddress - Hermez address used to extract the Ethereum address
 * @returns {string} - Ethereum address
 */
function getEthereumAddressFromHermezAddress (hermezAddress) {
  return hermezAddress.split(':')[1]
}

export {
  getPartiallyHiddenHermezAddress,
  getPartiallyHiddenEthereumAddress,
  getEthereumAddressFromHermezAddress
}
