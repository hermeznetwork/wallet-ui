const hermezPrefix = 'hez:'

function getHermezAddress (ethereumAddress) {
  return `${hermezPrefix}${ethereumAddress}`
}

function getPartiallyHiddenHermezAddress (ethereumAddress) {
  const firstAddressSlice = ethereumAddress.slice(0, 6)
  const secondAddressSlice = ethereumAddress.slice(
    ethereumAddress.length - 4,
    ethereumAddress.length
  )

  return `${hermezPrefix}${firstAddressSlice} *** ${secondAddressSlice}`
}

export {
  getHermezAddress,
  getPartiallyHiddenHermezAddress
}
