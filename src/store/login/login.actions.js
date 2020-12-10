export const loginActionTypes = {
  GO_TO_ACCOUNT_SELECTOR_STEP: '[LOGIN] GO TO ACCOUNT SELECTOR STEP',
  GO_TO_WALLET_LOADER_STEP: '[LOGIN] GO TO WALLET LOADER STEP',
  GO_TO_PREVIOUS_STEP: '[LOGIN] GO TO PREVIOUS STEP',
  RESET_STATE: '[LOGIN] RESET STATE'
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

function goToPreviousStep () {
  return {
    type: loginActionTypes.GO_TO_PREVIOUS_STEP
  }
}

function resetState () {
  return {
    type: loginActionTypes.RESET_STATE
  }
}

export {
  goToAccountSelectorStep,
  goToWalletLoaderStep,
  goToPreviousStep,
  resetState
}
