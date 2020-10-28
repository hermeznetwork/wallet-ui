/**
 * Get the partially hidden hermez address representation of an ethereum address
 * @param {string} ethereumAddress
 * @returns {string}
 */
function getPartiallyHiddenHermezAddress (ethereumAddress) {
  console.log(ethereumAddress)
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
