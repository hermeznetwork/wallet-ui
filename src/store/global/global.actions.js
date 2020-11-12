export const globalActionTypes = {
  LOAD_METAMASK_WALLET: '[GLOBAL] LOAD METAMASK WALLET',
  LOAD_METAMASK_WALLET_SUCCESS: '[GLOBAL] LOAD METAMASK WALLET SUCCESS',
  LOAD_METAMASK_WALLET_FAILURE: '[GLOBAL] LOAD METAMASK WALLET FAILURE',
  UNLOAD_METAMASK_WALLET: '[GLOBAL] UNLOAD METAMASK WALLET',
  CHANGE_HEADER: '[GLOBAL] CHANGE HEADER',
  CHANGE_REDIRECT_ROUTE: '[GLOBAL] CHANGE REDIRECT ROUTE',
  LOAD_FIAT_EXCHANGE_RATES: '[GLOBAL] LOAD FIAT EXCHANGE RATES',
  LOAD_FIAT_EXCHANGE_RATES_SUCCESS: '[GLOBAL] LOAD FIAT EXCHANGE RATES SUCCESS',
  LOAD_FIAT_EXCHANGE_RATES_FAILURE: '[GLOBAL] LOAD FIAT EXCHANGE RATES FAILURE',
  LOAD_GAS_MULTIPLIER: '[GLOBAL] LOAD GAS MULTIPLIER',
  LOAD_CURRENT_BATCH: '[GLOBAL] LOAD CURRENT BATCH',
  LOAD_CURRENT_BATCH_SUCCESS: '[GLOBAL] LOAD CURRENT BATCH SUCCESS',
  LOAD_CURRENT_BATCH_FAILURE: '[GLOBAL] LOAD CURRENT BATCH FAILURE',
  ADD_POOL_TRANSACTION: '[GLOBAL] ADD POOL TRANSACTION',
  REMOVE_POOL_TRANSACTION: '[GLOBAL] REMOVE POOL TRANSACTION',
  OPEN_SNACKBAR: '[GLOBAL] OPEN SNACKBAR',
  CLOSE_SNACKBAR: '[GLOBAL] CLOSE SNACKBAR',
  CHANGE_NETWORK_STATUS: '[GLOBAL] CHANGE NETWORK STATUS',
  ADD_PENDING_WITHDRAW: '[GLOBAL] ADD PENDING WITHRAW',
  REMOVE_PENDING_WITHDRAW: '[GLOBAL] REMOVE PENDING WITHRAW'
}

function loadMetamaskWallet () {
  return {
    type: globalActionTypes.LOAD_METAMASK_WALLET
  }
}

function loadMetamaskWalletSuccess (metaMaskWallet) {
  return {
    type: globalActionTypes.LOAD_METAMASK_WALLET_SUCCESS,
    metaMaskWallet
  }
}

function loadMetamaskWalletFailure (error) {
  return {
    type: globalActionTypes.LOAD_METAMASK_WALLET_FAILURE,
    error
  }
}

function unloadMetaMaskWallet () {
  return {
    type: globalActionTypes.UNLOAD_METAMASK_WALLET
  }
}

function changeHeader (header) {
  return {
    type: globalActionTypes.CHANGE_HEADER,
    header
  }
}

function changeRedirectRoute (redirectRoute) {
  return {
    type: globalActionTypes.CHANGE_REDIRECT_ROUTE,
    redirectRoute
  }
}

function loadFiatExchangeRates (symbols) {
  return {
    type: globalActionTypes.LOAD_FIAT_EXCHANGE_RATES
  }
}

function loadFiatExchangeRatesSuccess (fiatExchangeRates) {
  return {
    type: globalActionTypes.LOAD_FIAT_EXCHANGE_RATES_SUCCESS,
    fiatExchangeRates
  }
}

function loadFiatExchangeRatesFailure (error) {
  return {
    type: globalActionTypes.LOAD_FIAT_EXCHANGE_RATES_FAILURE,
    error: error.message
  }
}

function openSnackbar (message, backgroundColor) {
  return {
    type: globalActionTypes.OPEN_SNACKBAR,
    message,
    backgroundColor
  }
}

function closeSnackbar () {
  return {
    type: globalActionTypes.CLOSE_SNACKBAR
  }
}

function changeNetworkStatus (networkStatus) {
  return {
    type: globalActionTypes.CHANGE_NETWORK_STATUS,
    networkStatus
  }
}

function addPendingWithdraw (hermezEthereumAdress, pendingWithdraw) {
  return {
    type: globalActionTypes.ADD_PENDING_WITHDRAW,
    hermezEthereumAdress,
    pendingWithdraw
  }
}

function removePendingWithdraw (hermezEthereumAdress, withdrawId) {
  return {
    type: globalActionTypes.REMOVE_PENDING_WITHDRAW,
    hermezEthereumAdress,
    withdrawId
  }
}
export {
  loadMetamaskWallet,
  loadMetamaskWalletSuccess,
  loadMetamaskWalletFailure,
  unloadMetaMaskWallet,
  changeHeader,
  changeRedirectRoute,
  loadFiatExchangeRates,
  loadFiatExchangeRatesSuccess,
  loadFiatExchangeRatesFailure,
  openSnackbar,
  closeSnackbar,
  changeNetworkStatus,
  addPendingWithdraw,
  removePendingWithdraw
}
