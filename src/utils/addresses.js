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
 * Checks whether a Ethereum address has a valid format
 * @param {string} address - Ethereum address e.g. 0x9294cD558F2Db6ca403191Ae3502cD0c2251E995
 * @returns {boolean} - Result of the test
 */
function isValidEthereumAddress (address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Checks whether a Hermez address has a valid format
 * @param {string} address - Hermez address e.g. hez:0x9294cD558F2Db6ca403191Ae3502cD0c2251E995
 * @returns {boolean} - Result of the test
 */
function isValidHermezAddress (address) {
  return /^hez:0x[a-fA-F0-9]{40}$/.test(address)
}

export {
  getPartiallyHiddenHermezAddress,
  getPartiallyHiddenEthereumAddress,
  isValidEthereumAddress,
  isValidHermezAddress
}
