/**
 * Get the partially hidden hermez address representation of an ethereum address
 * @param {string} ethereumAddress - Ethereum address to partially hide
 * @returns {string} - Partially hidden ethereum address
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
  getPartiallyHiddenHermezAddress
}
