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
  ADD_POOL_TRANSACTION: '[GLOBAL] ADD POOL TRANSACTION',
  REMOVE_POOL_TRANSACTION: '[GLOBAL] REMOVE POOL TRANSACTION',
  OPEN_SNACKBAR: '[GLOBAL] OPEN SNACKBAR',
  CLOSE_SNACKBAR: '[GLOBAL] CLOSE SNACKBAR',
  CHANGE_NETWORK_STATUS: '[GLOBAL] CHANGE NETWORK STATUS',
  ADD_PENDING_WITHDRAW: '[GLOBAL] ADD PENDING WITHRAW',
  REMOVE_PENDING_WITHDRAW: '[GLOBAL] REMOVE PENDING WITHRAW',
  ADD_PENDING_DELAYED_WITHDRAW: '[GLOBAL] ADD PENDING DELAYED WITHRAW',
  REMOVE_PENDING_DELAYED_WITHDRAW: '[GLOBAL] REMOVE PENDING DELAYED WITHRAW',
  REMOVE_PENDING_DELAYED_WITHDRAW_BY_HASH: '[GLOBAL] REMOVE PENDING DELAYED WITHRAW BY HASH',
  UPDATE_PENDING_DELAYED_WITHDRAW_DATE: '[GLOBAL] UPDATE PENDING DELAYED WITHDRAW DATE',
  CHECK_PENDING_DELAYED_WITHDRAWALS: '[GLOBAL] CHECK PENDING DELAYED WITHDRAWALS',
  CHECK_PENDING_DELAYED_WITHDRAWALS_SUCCESS: '[GLOBAL] CHECK PENDING DELAYED WITHDRAWALS SUCCESS',
  CHECK_PENDING_WITHDRAWALS: '[GLOBAL] CHECK PENDING WITHDRAWALS',
  CHECK_PENDING_WITHDRAWALS_SUCCESS: '[GLOBAL] CHECK PENDING WITHDRAWALS SUCCESS',
  ADD_PENDING_DEPOSIT: '[GLOBAL] ADD PENDING DEPOSIT',
  REMOVE_PENDING_DEPOSIT_BY_HASH: '[GLOBAL] REMOVE PENDING DEPOSIT BY HASH',
  REMOVE_PENDING_DEPOSIT_BY_ID: '[GLOBAL] REMOVE PENDING DEPOSIT BY ID',
  UPDATE_PENDING_DEPOSIT_ID: '[GLOBAL] UPDATE PENDING DEPOSIT ID',
  CHECK_PENDING_DEPOSITS: '[GLOBAL] CHECK PENDING DEPOSITS',
  CHECK_PENDING_DEPOSITS_SUCCESS: '[GLOBAL] CHECK PENDING DEPOSITS SUCCESS',
  LOAD_COORDINATOR_STATE: '[GLOBAL] LOAD COORDINATOR STATE',
  LOAD_COORDINATOR_STATE_SUCCESS: '[GLOBAL] LOAD COORDINATOR STATE SUCCESS',
  LOAD_COORDINATOR_STATE_FAILURE: '[GLOBAL] LOAD COORDINATOR STATE FAILURE',
  OPEN_REWARDS_SIDENAV: '[GLOBAL] OPEN REWARDS SIDENAV',
  CLOSE_REWARDS_SIDENAV: '[GLOBAL] CLOSE REWARDS SIDENAV',
  LOAD_REWARD: '[GLOBAL] LOAD REWARD',
  LOAD_REWARD_SUCCESS: '[GLOBAL] LOAD REWARD SUCCESS',
  LOAD_REWARD_FAILURE: '[GLOBAL] LOAD REWARD FAILURE',
  LOAD_EARNED_REWARD: '[GLOBAL] LOAD EARNED REWARD',
  LOAD_EARNED_REWARD_SUCCESS: '[GLOBAL] LOAD EARNED REWARD SUCCESS',
  LOAD_EARNED_REWARD_FAILURE: '[GLOBAL] LOAD EARNED REWARD FAILURE',
  LOAD_REWARD_PERCENTAGE: '[GLOBAL] LOAD REWARD PERCENTAGE',
  LOAD_REWARD_PERCENTAGE_SUCCESS: '[GLOBAL] LOAD REWARD PERCENTAGE SUCCESS',
  LOAD_REWARD_PERCENTAGE_FAILURE: '[GLOBAL] LOAD REWARD PERCENTAGE FAILURE',
  LOAD_REWARD_ACCOUNT_ELIGIBILITY: '[GLOBAL] LOAD REWARD ACCOUNT ELIGIBILITY',
  LOAD_REWARD_ACCOUNT_ELIGIBILITY_SUCCESS: '[GLOBAL] LOAD REWARD ACCOUNT ELIGIBILITY SUCCESS',
  LOAD_REWARD_ACCOUNT_ELIGIBILITY_FAILURE: '[GLOBAL] LOAD REWARD ACCOUNT ELIGIBILITY FAILURE',
  LOAD_REWARD_TOKEN: '[GLOBAL] LOAD REWARD TOKEN',
  LOAD_REWARD_TOKEN_SUCCESS: '[GLOBAL] LOAD REWARD TOKEN SUCCESS',
  LOAD_REWARD_TOKEN_FAILURE: '[GLOBAL] LOAD REWARD TOKEN FAILURE'
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

function removePendingWithdraw (chainId, hermezEthereumAddress, hash) {
  return {
    type: globalActionTypes.REMOVE_PENDING_WITHDRAW,
    chainId,
    hermezEthereumAddress,
    hash
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

function removePendingDelayedWithdrawByHash (chainId, hermezEthereumAddress, pendingDelayedWithdrawHash) {
  return {
    type: globalActionTypes.REMOVE_PENDING_DELAYED_WITHDRAW_BY_HASH,
    chainId,
    hermezEthereumAddress,
    pendingDelayedWithdrawHash
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

function checkPendingDelayedWithdrawals () {
  return {
    type: globalActionTypes.CHECK_PENDING_DELAYED_WITHDRAWALS
  }
}

function checkPendingDelayedWithdrawalsSuccess () {
  return {
    type: globalActionTypes.CHECK_PENDING_DELAYED_WITHDRAWALS_SUCCESS
  }
}

function checkPendingWithdrawals () {
  return {
    type: globalActionTypes.CHECK_PENDING_WITHDRAWALS
  }
}

function checkPendingWithdrawalsSuccess () {
  return {
    type: globalActionTypes.CHECK_PENDING_WITHDRAWALS_SUCCESS
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

function removePendingDepositByHash (chainId, hermezEthereumAddress, hash) {
  return {
    type: globalActionTypes.REMOVE_PENDING_DEPOSIT_BY_HASH,
    chainId,
    hermezEthereumAddress,
    hash
  }
}

function removePendingDepositById (chainId, hermezEthereumAddress, id) {
  return {
    type: globalActionTypes.REMOVE_PENDING_DEPOSIT_BY_ID,
    chainId,
    hermezEthereumAddress,
    id
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

function openRewardsSidenav () {
  return {
    type: globalActionTypes.OPEN_REWARDS_SIDENAV
  }
}

function closeRewardsSidenav () {
  return {
    type: globalActionTypes.CLOSE_REWARDS_SIDENAV
  }
}

function loadReward () {
  return {
    type: globalActionTypes.LOAD_REWARD
  }
}

function loadRewardSuccess (data) {
  return {
    type: globalActionTypes.LOAD_REWARD_SUCCESS,
    data
  }
}

function loadRewardFailure (error) {
  return {
    type: globalActionTypes.LOAD_REWARD_FAILURE,
    error
  }
}

function loadEarnedReward () {
  return {
    type: globalActionTypes.LOAD_EARNED_REWARD
  }
}

function loadEarnedRewardSuccess (data) {
  return {
    type: globalActionTypes.LOAD_EARNED_REWARD_SUCCESS,
    data
  }
}

function loadEarnedRewardFailure (error) {
  return {
    type: globalActionTypes.LOAD_EARNED_REWARD_FAILURE,
    error
  }
}

function loadRewardPercentage () {
  return {
    type: globalActionTypes.LOAD_REWARD_PERCENTAGE
  }
}

function loadRewardPercentageSuccess (data) {
  return {
    type: globalActionTypes.LOAD_REWARD_PERCENTAGE_SUCCESS,
    data
  }
}

function loadRewardPercentageFailure (error) {
  return {
    type: globalActionTypes.LOAD_REWARD_PERCENTAGE_FAILURE,
    error
  }
}

function loadRewardAccountEligilibity () {
  return {
    type: globalActionTypes.LOAD_REWARD_ACCOUNT_ELIGIBILITY
  }
}

function loadRewardAccountEligilibitySuccess (data) {
  return {
    type: globalActionTypes.LOAD_REWARD_ACCOUNT_ELIGIBILITY_SUCCESS,
    data
  }
}

function loadRewardAccountEligilibityFailure (error) {
  return {
    type: globalActionTypes.LOAD_REWARD_ACCOUNT_ELIGIBILITY_FAILURE,
    error
  }
}

function loadRewardToken () {
  return {
    type: globalActionTypes.LOAD_REWARD_TOKEN
  }
}

function loadRewardTokenSuccess (data) {
  return {
    type: globalActionTypes.LOAD_REWARD_TOKEN_SUCCESS,
    data
  }
}

function loadRewardTokenFailure (error) {
  return {
    type: globalActionTypes.LOAD_REWARD_TOKEN_FAILURE,
    error
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
  openSnackbar,
  closeSnackbar,
  changeNetworkStatus,
  addPendingWithdraw,
  removePendingWithdraw,
  addPendingDelayedWithdraw,
  removePendingDelayedWithdraw,
  removePendingDelayedWithdrawByHash,
  updatePendingDelayedWithdrawDate,
  checkPendingDelayedWithdrawals,
  checkPendingDelayedWithdrawalsSuccess,
  checkPendingWithdrawals,
  checkPendingWithdrawalsSuccess,
  addPendingDeposit,
  removePendingDepositByHash,
  removePendingDepositById,
  updatePendingDepositId,
  checkPendingDeposits,
  checkPendingDepositsSuccess,
  loadCoordinatorState,
  loadCoordinatorStateSuccess,
  loadCoordinatorStateFailure,
  openRewardsSidenav,
  closeRewardsSidenav,
  loadReward,
  loadRewardSuccess,
  loadRewardFailure,
  loadEarnedReward,
  loadEarnedRewardSuccess,
  loadEarnedRewardFailure,
  loadRewardPercentage,
  loadRewardPercentageSuccess,
  loadRewardPercentageFailure,
  loadRewardAccountEligilibity,
  loadRewardAccountEligilibitySuccess,
  loadRewardAccountEligilibityFailure,
  loadRewardToken,
  loadRewardTokenSuccess,
  loadRewardTokenFailure
}
