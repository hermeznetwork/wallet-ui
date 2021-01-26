export const loginActionTypes = {
  GO_TO_ACCOUNT_SELECTOR_STEP: '[LOGIN] GO TO ACCOUNT SELECTOR STEP',
  GO_TO_WALLET_LOADER_STEP: '[LOGIN] GO TO WALLET LOADER STEP',
  GO_TO_PREVIOUS_STEP: '[LOGIN] GO TO PREVIOUS STEP',
  LOAD_WALLET: '[LOGIN] LOAD WALLET',
  LOAD_WALLET_SUCCESS: '[LOGIN] LOAD WALLET SUCCESS',
  LOAD_WALLET_FAILURE: '[LOGIN] LOAD WALLET FAILURE',
  LOAD_NETWORK_NAME: '[LOGIN] LOAD NETWORK NAME',
  LOAD_NETWORK_NAME_SUCCESS: '[LOGIN] LOAD NETWORK NAME SUCCESS',
  LOAD_NETWORK_NAME_FAILURE: '[LOGIN] LOAD NETWORK NAME FAILURE',
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

function loadWallet () {
  return {
    type: loginActionTypes.LOAD_WALLET
  }
}

function loadWalletSuccess (wallet) {
  return {
    type: loginActionTypes.LOAD_WALLET_SUCCESS,
    wallet
  }
}

function loadWalletFailure (error) {
  return {
    type: loginActionTypes.LOAD_WALLET_FAILURE,
    error
  }
}

function loadNetworkName () {
  return {
    type: loginActionTypes.LOAD_NETWORK_NAME
  }
}

function loadNetworkNameSuccess (networkName) {
  return {
    type: loginActionTypes.LOAD_NETWORK_NAME_SUCCESS,
    networkName
  }
}

function loadNetworkNameFailure () {
  return {
    type: loginActionTypes.LOAD_NETWORK_NAME_FAILURE
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
  loadWallet,
  loadWalletSuccess,
  loadWalletFailure,
  loadNetworkName,
  loadNetworkNameSuccess,
  loadNetworkNameFailure,
  resetState
}
