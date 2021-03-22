export const globalActionTypes = {
  LOAD_HERMEZ_STATUS: '[GLOBAL] LOAD HERMEZ STATUS',
  LOAD_HERMEZ_STATUS_SUCCESS: '[GLOBAL] LOAD HERMEZ STATUS SUCCESS',
  LOAD_HERMEZ_STATUS_FAILURE: '[GLOBAL] LOAD HERMEZ STATUS FAILURE',
  LOAD_ETHEREUM_NETWORK: '[GLOBAL] LOAD ETHEREUM NETWORK',
  LOAD_ETHEREUM_NETWORK_SUCCESS: '[GLOBAL] LOAD ETHEREUM NETWORK SUCCESS',
  LOAD_ETHEREUM_NETWORK_FAILURE: '[GLOBAL] LOAD ETHEREUM NETWORK FAILURE',
  LOAD_WALLET: '[GLOBAL] LOAD WALLET',
  UNLOAD_WALLET: '[GLOBAL] UNLOAD WALLET',
  SET_SIGNER: '[GLOBAL] SET SIGNER',
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
  UPDATE_PENDING_DELAYED_WITHDRAW_DATE: '[GLOBAL] UPDATE PENDING DELAYED WITHDRAW DATE',
  CHECK_PENDING_DELAYED_WITHDRAW: '[GLOBAL] CHECK PENDING DELAYED WITHDRAW',
  CHECK_PENDING_DELAYED_WITHDRAW_SUCCESS: '[GLOBAL] CHECK PENDING DELAYD WITHDRAW',
  ADD_PENDING_DEPOSIT: '[GLOBAL] ADD PENDING DEPOSIT',
  REMOVE_PENDING_DEPOSIT: '[GLOBAL] REMOVE PENDING DEPOSIT',
  UPDATE_PENDING_DEPOSIT_ID: '[GLOBAL] UPDATE PENDING DEPOSIT ID',
  CHECK_PENDING_DEPOSITS: '[GLOBAL] CHECK PENDING DEPOSITS',
  CHECK_PENDING_DEPOSITS_SUCCESS: '[GLOBAL] CHECK PENDING DEPOSITS SUCCESS',
  LOAD_COORDINATOR_STATE: '[GLOBAL] LOAD COORDINATOR STATE',
  LOAD_COORDINATOR_STATE_SUCCESS: '[GLOBAL] LOAD COORDINATOR STATE SUCCESS',
  LOAD_COORDINATOR_STATE_FAILURE: '[GLOBAL] LOAD COORDINATOR STATE FAILURE'
}

function loadHermezStatus () {
  return {
    type: globalActionTypes.LOAD_HERMEZ_STATUS
  }
}

function loadHermezStatusSuccess (status) {
  return {
    type: globalActionTypes.LOAD_HERMEZ_STATUS_SUCCESS,
    status
  }
}

function loadHermezStatusFailure (error) {
  return {
    type: globalActionTypes.LOAD_HERMEZ_STATUS_FAILURE,
    error
  }
}

function loadEthereumNetwork () {
  return {
    type: globalActionTypes.LOAD_ETHEREUM_NETWORK
  }
}

function loadEthereumNetworkSuccess (ethereumNetwork) {
  return {
    type: globalActionTypes.LOAD_ETHEREUM_NETWORK_SUCCESS,
    ethereumNetwork
  }
}

function loadEthereumNetworkFailure (error) {
  return {
    type: globalActionTypes.LOAD_ETHEREUM_NETWORK_FAILURE,
    error
  }
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

function setSigner (signer) {
  return {
    type: globalActionTypes.SET_SIGNER,
    signer
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

function addPendingWithdraw (chainId, hermezEthereumAddress, pendingWithdraw) {
  return {
    type: globalActionTypes.ADD_PENDING_WITHDRAW,
    chainId,
    hermezEthereumAddress,
    pendingWithdraw
  }
}

function removePendingWithdraw (chainId, hermezEthereumAddress, pendingWithdrawId) {
  return {
    type: globalActionTypes.REMOVE_PENDING_WITHDRAW,
    chainId,
    hermezEthereumAddress,
    pendingWithdrawId
  }
}

function addPendingDelayedWithdraw (chainId, hermezEthereumAddress, pendingDelayedWithdraw) {
  return {
    type: globalActionTypes.ADD_PENDING_DELAYED_WITHDRAW,
    chainId,
    hermezEthereumAddress,
    pendingDelayedWithdraw
  }
}

function removePendingDelayedWithdraw (chainId, hermezEthereumAddress, pendingDelayedWithdrawId) {
  return {
    type: globalActionTypes.REMOVE_PENDING_DELAYED_WITHDRAW,
    chainId,
    hermezEthereumAddress,
    pendingDelayedWithdrawId
  }
}

function updatePendingDelayedWithdrawDate (chainId, hermezEthereumAddress, transactionHash, transactionDate) {
  return {
    type: globalActionTypes.UPDATE_PENDING_DELAYED_WITHDRAW_DATE,
    chainId,
    hermezEthereumAddress,
    transactionHash,
    transactionDate
  }
}

function checkPendingDelayedWithdraw () {
  return {
    type: globalActionTypes.CHECK_PENDING_DELAYED_WITHDRAW
  }
}

function checkPendingDelayedWithdrawSuccess () {
  return {
    type: globalActionTypes.CHECK_PENDING_DELAYED_WITHDRAW_SUCCESS
  }
}

function addPendingDeposit (chainId, hermezEthereumAddress, pendingDeposit) {
  return {
    type: globalActionTypes.ADD_PENDING_DEPOSIT,
    chainId,
    hermezEthereumAddress,
    pendingDeposit
  }
}

function removePendingDeposit (chainId, hermezEthereumAddress, transactionId) {
  return {
    type: globalActionTypes.REMOVE_PENDING_DEPOSIT,
    chainId,
    hermezEthereumAddress,
    transactionId
  }
}

function updatePendingDepositId (chainId, hermezEthereumAddress, transactionHash, transactionId) {
  return {
    type: globalActionTypes.UPDATE_PENDING_DEPOSIT_ID,
    chainId,
    hermezEthereumAddress,
    transactionHash,
    transactionId
  }
}

function checkPendingDeposits () {
  return {
    type: globalActionTypes.CHECK_PENDING_DEPOSITS
  }
}

function checkPendingDepositsSuccess () {
  return {
    type: globalActionTypes.CHECK_PENDING_DEPOSITS_SUCCESS
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
  loadHermezStatus,
  loadHermezStatusSuccess,
  loadHermezStatusFailure,
  loadEthereumNetwork,
  loadEthereumNetworkSuccess,
  loadEthereumNetworkFailure,
  loadWallet,
  unloadWallet,
  setSigner,
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
  updatePendingDelayedWithdrawDate,
  checkPendingDelayedWithdraw,
  checkPendingDelayedWithdrawSuccess,
  addPendingDeposit,
  removePendingDeposit,
  updatePendingDepositId,
  checkPendingDeposits,
  checkPendingDepositsSuccess,
  loadCoordinatorState,
  loadCoordinatorStateSuccess,
  loadCoordinatorStateFailure
}
