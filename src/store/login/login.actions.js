export const loginActionTypes = {
  GO_TO_ACCOUNT_SELECTOR_STEP: '[LOGIN] GO TO ACCOUNT SELECTOR STEP',
  GO_TO_WALLET_LOADER_STEP: '[LOGIN] GO TO WALLET LOADER STEP',
  GO_TO_CREATE_ACCOUNT_AUTH_STEP: '[LOGIN] GO TO CREATE ACCOUNT AUTH STEP',
  GO_TO_PREVIOUS_STEP: '[LOGIN] GO TO PREVIOUS STEP',
  LOAD_WALLET: '[LOGIN] LOAD WALLET',
  LOAD_WALLET_FAILURE: '[LOGIN] LOAD WALLET FAILURE',
  ADD_ACCOUNT_AUTH: '[HOME] ADD ACCOUNT AUTH',
  SET_ACCOUNT_AUTH_SIGNATURE: '[HOME] SET ACCOUNT AUTH SIGNATURE',
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

function goToCreateAccountAuthStep (wallet) {
  return {
    type: loginActionTypes.GO_TO_CREATE_ACCOUNT_AUTH_STEP,
    wallet
  }
}

function goToPreviousStep () {
  return {
    type: loginActionTypes.GO_TO_PREVIOUS_STEP
  }
}

function loadWallet () {
  return {
    type: loginActionTypes.LOAD_WALLET
  }
}

function loadWalletFailure (error) {
  return {
    type: loginActionTypes.LOAD_WALLET_FAILURE,
    error
  }
}

function addAccountAuth (hermezEthereumAddress, coordinatorUrl) {
  return {
    type: loginActionTypes.ADD_ACCOUNT_AUTH,
    hermezEthereumAddress,
    coordinatorUrl
  }
}

function setAccountAuthSignature (hermezEthereumAddress, signature) {
  return {
    type: loginActionTypes.SET_ACCOUNT_AUTH_SIGNATURE,
    hermezEthereumAddress,
    signature
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
  goToCreateAccountAuthStep,
  goToPreviousStep,
  loadWallet,
  loadWalletFailure,
  addAccountAuth,
  setAccountAuthSignature,
  resetState
}
