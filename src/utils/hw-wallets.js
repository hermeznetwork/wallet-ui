/**
 * Builds an Ethereum BIP-44 path from an account type and index
 * @param {number} accountType - Account type
 * @param {number} accountIndex - Account index
 * @returns {string} - BIP-44 path of the account
 */
function buildEthereumBIP44Path (accountType, accountIndex) {
  return `m/44'/60'/${accountType}'/0/${accountIndex}`
}

export {
  buildEthereumBIP44Path
}
