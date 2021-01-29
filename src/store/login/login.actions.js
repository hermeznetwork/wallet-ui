export const loginActionTypes = {
  GO_TO_WALLET_SELECTOR_STEP: '[LOGIN] GO TO WALLET SELECTOR STEP',
  GO_TO_ACCOUNT_SELECTOR_STEP: '[LOGIN] GO TO ACCOUNT SELECTOR STEP',
  GO_TO_WALLET_LOADER_STEP: '[LOGIN] GO TO WALLET LOADER STEP',
  GO_TO_CREATE_ACCOUNT_AUTH_STEP: '[LOGIN] GO TO CREATE ACCOUNT AUTH STEP',
  GO_TO_ERROR_STEP: '[LOGIN] GO TO ERROR STEP',
  GO_TO_PREVIOUS_STEP: '[LOGIN] GO TO PREVIOUS STEP',
  LOAD_WALLET: '[LOGIN] LOAD WALLET',
  LOAD_WALLET_FAILURE: '[LOGIN] LOAD WALLET FAILURE',
  LOAD_ACCOUNT_AUTH: '[LOGIN] LOAD ACCOUNT AUTH',
  LOAD_ACCOUNT_AUTH_SUCCESS: '[LOGIN] LOAD ACCOUNT AUTH SUCCESS',
  LOAD_ACCOUNT_AUTH_FAILURE: '[LOGIN] LOAD ACCOUNT AUTH FAILURE',
  ADD_ACCOUNT_AUTH: '[LOGIN] ADD ACCOUNT AUTH',
  ADD_ACCOUNT_AUTH_SUCCESS: '[LOGIN] ADD ACCOUNT AUTH SUCCESS',
  ADD_ACCOUNT_AUTH_FAILURE: '[LOGIN] ADD ACCOUNT AUTH FAILURE',
  SET_ACCOUNT_AUTH_SIGNATURE: '[LOGIN] SET ACCOUNT AUTH SIGNATURE',
  RESET_STATE: '[LOGIN] RESET STATE'
}

function goToWalletSelectorStep () {
  return {
    type: loginActionTypes.GO_TO_WALLET_SELECTOR_STEP
  }
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

function goToErrorStep (error) {
  return {
    type: loginActionTypes.GO_TO_ERROR_STEP,
    error
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

function loadAccountAuth () {
  return {
    type: loginActionTypes.LOAD_ACCOUNT_AUTH
  }
}

function loadAccountAuthSuccess () {
  return {
    type: loginActionTypes.LOAD_ACCOUNT_AUTH_SUCCESS
  }
}

function loadAccountAuthFailure (error) {
  return {
    type: loginActionTypes.LOAD_ACCOUNT_AUTH_FAILURE,
    error
  }
}

function addAccountAuth () {
  return {
    type: loginActionTypes.ADD_ACCOUNT_AUTH
  }
}

function addAccountAuthSuccess () {
  return {
    type: loginActionTypes.ADD_ACCOUNT_AUTH_SUCCESS
  }
}

function addAccountAuthFailure (error) {
  return {
    type: loginActionTypes.ADD_ACCOUNT_AUTH_FAILURE,
    error
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
  goToWalletSelectorStep,
  goToAccountSelectorStep,
  goToWalletLoaderStep,
  goToCreateAccountAuthStep,
  goToErrorStep,
  goToPreviousStep,
  loadWallet,
  loadWalletFailure,
  loadAccountAuth,
  loadAccountAuthSuccess,
  loadAccountAuthFailure,
  addAccountAuth,
  addAccountAuthSuccess,
  addAccountAuthFailure,
  setAccountAuthSignature,
  resetState
}
