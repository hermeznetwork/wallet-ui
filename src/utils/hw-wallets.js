function buildEthereumBip44Path (accountType, accountIndex) {
  return `m/44'/60'/${accountType}'/0/${accountIndex}`
}

export {
  buildEthereumBip44Path
}
