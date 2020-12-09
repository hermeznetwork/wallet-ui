export const loginActionTypes = {
  GO_TO_ACCOUNT_SELECTOR_STEP: '[ACCOUNT] GO TO ACCOUNT SELECTOR STEP',
  GO_TO_WALLET_LOADER_STEP: '[ACCOUNT] GO TO WALLET LOADER STEP'
}

function goToAccountSelectorStep (walletName) {
  return {
    type: loginActionTypes.GO_TO_ACCOUNT_SELECTOR_STEP,
    walletName
  }
}

function goToWalletLoaderStep (walletName, accountData) {
  return {
    type: loginActionTypes.GO_TO_WALLET_LOADER_STEP,
    walletName,
    accountData
  }
}

export {
  goToAccountSelectorStep,
  goToWalletLoaderStep
}
