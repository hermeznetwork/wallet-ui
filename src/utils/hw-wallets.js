/**
 * Builds an Ethereum BIP-44 path from a chain id, account type and index. The chain id
 * is used to determine the coin type of the BIP-44 path. 60 is used for Mainnet and 1
 * is used for Testnets.
 * @param {number} accountType - Account type
 * @param {number} accountIndex - Account index
 * @returns {string} - BIP-44 path of the account
 */
function buildEthereumBIP44Path (chainId, accountType, accountIndex) {
  const coinType = chainId === 1 ? '60' : '1'

  return `m/44'/${coinType}'/${accountType}'/0/${accountIndex}`
}

export {
  buildEthereumBIP44Path
}
