export const globalActionTypes = {
  LOAD_WALLET: '[GLOBAL] LOAD WALLET',
  UNLOAD_WALLET: '[GLOBAL] UNLOAD WALLET',
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
  REMOVE_PENDING_WITHDRAW: '[GLOBAL] REMOVE PENDING WITHRAW',
  ADD_PENDING_DELAYED_WITHDRAW: '[GLOBAL] ADD PENDING DELAYED WITHRAW',
  REMOVE_PENDING_DELAYED_WITHDRAW: '[GLOBAL] REMOVE PENDING DELAYED WITHRAW',
  LOAD_COORDINATOR_STATE: '[GLOBAL] LOAD COORDINATOR STATE',
  LOAD_COORDINATOR_STATE_SUCCESS: '[GLOBAL] LOAD COORDINATOR STATE SUCCESS',
  LOAD_COORDINATOR_STATE_FAILURE: '[GLOBAL] LOAD COORDINATOR STATE FAILURE'
}

function loadWallet (wallet) {
  return {
    type: globalActionTypes.LOAD_WALLET,
    wallet
  }
}

function unloadWallet () {
  return {
    type: globalActionTypes.UNLOAD_WALLET
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

function loadFiatExchangeRates () {
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

function addPendingWithdraw (hermezEthereumAddress, pendingWithdraw) {
  return {
    type: globalActionTypes.ADD_PENDING_WITHDRAW,
    hermezEthereumAddress,
    pendingWithdraw
  }
}

function removePendingWithdraw (hermezEthereumAddress, withdrawId) {
  return {
    type: globalActionTypes.REMOVE_PENDING_WITHDRAW,
    hermezEthereumAddress,
    withdrawId
  }
}

function addPendingDelayedWithdraw (hermezEthereumAddress, pendingDelayedWithdraw) {
  return {
    type: globalActionTypes.ADD_PENDING_DELAYED_WITHDRAW,
    hermezEthereumAddress,
    pendingDelayedWithdraw
  }
}

function removePendingDelayedWithdraw (hermezEthereumAddress, pendingDelayedWithdrawId) {
  return {
    type: globalActionTypes.REMOVE_PENDING_DELAYED_WITHDRAW,
    hermezEthereumAddress,
    pendingDelayedWithdrawId
  }
}

function loadCoordinatorState () {
  return {
    type: globalActionTypes.LOAD_COORDINATOR_STATE
  }
}

function loadCoordinatorStateSuccess (coordinatorState) {
  return {
    type: globalActionTypes.LOAD_COORDINATOR_STATE_SUCCESS,
    coordinatorState
  }
}

function loadCoordinatorStateFailure (error) {
  return {
    type: globalActionTypes.LOAD_COORDINATOR_STATE_FAILURE,
    error: error.message
  }
}

export {
  loadWallet,
  unloadWallet,
  changeHeader,
  changeRedirectRoute,
  loadFiatExchangeRates,
  loadFiatExchangeRatesSuccess,
  loadFiatExchangeRatesFailure,
  openSnackbar,
  closeSnackbar,
  changeNetworkStatus,
  addPendingWithdraw,
  removePendingWithdraw,
  addPendingDelayedWithdraw,
  removePendingDelayedWithdraw,
  loadCoordinatorState,
  loadCoordinatorStateSuccess,
  loadCoordinatorStateFailure
}
