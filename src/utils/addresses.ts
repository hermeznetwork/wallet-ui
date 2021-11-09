/**
 * Get the partially hidden representation of a hermez ethereum address
 */
function getPartiallyHiddenHermezAddress(hermezAddress: string): string {
  const firstAddressSlice = hermezAddress.slice(0, 10);
  const secondAddressSlice = hermezAddress.slice(hermezAddress.length - 4, hermezAddress.length);

  return `${firstAddressSlice} *** ${secondAddressSlice}`;
}

/**
 * Get the partially hidden representation of a ethereum address
 */
function getPartiallyHiddenEthereumAddress(ethereumAddress: string): string {
  const firstAddressSlice = ethereumAddress.slice(0, 6);
  const secondAddressSlice = ethereumAddress.slice(
    ethereumAddress.length - 4,
    ethereumAddress.length
  );

  return `${firstAddressSlice} *** ${secondAddressSlice}`;
}

/**
 * Checks whether a Ethereum address has a valid format
 */
function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Checks whether a Hermez address has a valid format
 */
function isValidHermezAddress(address: string): boolean {
  return /^hez:0x[a-fA-F0-9]{40}$/.test(address);
}

export {
  getPartiallyHiddenHermezAddress,
  getPartiallyHiddenEthereumAddress,
  isValidEthereumAddress,
  isValidHermezAddress,
};
