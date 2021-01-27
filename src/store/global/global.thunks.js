import hermezjs from '@hermeznetwork/hermezjs'
import { push } from 'connected-react-router'

import * as globalActions from './global.actions'
import { LOAD_ETHEREUM_NETWORK_ERROR } from './global.reducer'
import { PENDING_WITHDRAWS_KEY, PENDING_DELAYED_WITHDRAWS_KEY } from '../../constants'
import * as fiatExchangeRatesApi from '../../apis/fiat-exchange-rates'

/**
 * Sets the environment to use in hermezjs. If the chainId is supported will pick it up
 * a known environment and if not will use the one provided in the .env file
 */
function setHermezEnvironment () {
  return async (dispatch) => {
    dispatch(globalActions.loadEthereumNetwork())
    hermezjs.TxPool.initializeTransactionPool()

    if (!window.ethereum) {
      return dispatch(globalActions.loadEthereumNetworkFailure(LOAD_ETHEREUM_NETWORK_ERROR.METAMASK_NOT_INSTALLED))
    }

    hermezjs.Providers.getProvider().getNetwork()
      .then(({ chainId, name }) => {
        if (process.env.REACT_APP_ENV === 'production' && !hermezjs.Environment.isEnvironmentSupported(chainId)) {
          return dispatch(
            globalActions.loadEthereumNetworkFailure(LOAD_ETHEREUM_NETWORK_ERROR.CHAIN_ID_NOT_SUPPORTED)
          )
        }
        if (hermezjs.Environment.isEnvironmentSupported(chainId)) {
          hermezjs.Environment.setEnvironment(chainId)
        }

        if (process.env.REACT_APP_ENV === 'development' && !hermezjs.Environment.isEnvironmentSupported(chainId)) {
          hermezjs.Environment.setEnvironment({
            baseApiUrl: process.env.REACT_APP_HERMEZ_API_URL,
            contractAddresses: {
              [hermezjs.Constants.ContractNames.Hermez]:
                  process.env.REACT_APP_HERMEZ_CONTRACT_ADDRESS,
              [hermezjs.Constants.ContractNames.WithdrawalDelayer]:
                  process.env.REACT_APP_WITHDRAWAL_DELAYER_CONTRACT_ADDRESS
            }
          })
        }

        if (chainId === 1) {
          dispatch(globalActions.loadEthereumNetworkSuccess({ chainId, name: 'mainnet' }))
        } else {
          dispatch(globalActions.loadEthereumNetworkSuccess({ chainId, name }))
        }
      })
      .catch((error) => globalActions.loadEthereumNetworkFailure(error.message))
  }
}

/**
 * Changes the route to which the user is going to be redirected to after a successful
 * login
 * @param {string} redirectRoute - Route to be redirected to
 * @returns {void}
 */
function changeRedirectRoute (redirectRoute) {
  return (dispatch) => {
    dispatch(globalActions.changeRedirectRoute(redirectRoute))
  }
}

/**
 * Fetches the USD exchange rates for the requested currency symbols
 * @param {string[]} symbols - ISO 4217 currency codes
 * @returns {void}
 */
function fetchFiatExchangeRates (symbols) {
  return (dispatch) => {
    dispatch(globalActions.loadFiatExchangeRates())

    return fiatExchangeRatesApi.getFiatExchangeRates(symbols)
      .then(res => dispatch(globalActions.loadFiatExchangeRatesSuccess(res.rates)))
      .catch(err => dispatch(globalActions.loadFiatExchangeRatesFailure(err)))
  }
}

/**
 * Changes the current network status of the application
 * @param {string} newNetworkStatus - Network status
 * @param {string} backgroundColor - Background color of the snackbar
 * @returns {void}
 */
function changeNetworkStatus (newNetworkStatus, backgroundColor) {
  return (dispatch, getState) => {
    const { global: { networkStatus: previousNetworkStatus } } = getState()

    if (previousNetworkStatus === 'online' && newNetworkStatus === 'offline') {
      dispatch(globalActions.openSnackbar('Connection lost'))
    }

    if (previousNetworkStatus === 'offline' && newNetworkStatus === 'online') {
      dispatch(globalActions.openSnackbar('Connection restored', backgroundColor))
    }

    dispatch(globalActions.changeNetworkStatus(newNetworkStatus))
  }
}

/**
 * Adds a pendingWithdraw to the pendingWithdraw pool
 * @param {string} hermezEthereumAddress - The account with which the pendingWithdraw was made
 * @param {string} pendingWithdraw - The pendingWithdraw to add to the pool
 * @returns {void}
 */
function addPendingWithdraw (hermezEthereumAddress, pendingWithdraw) {
  return (dispatch) => {
    const pendingWithdrawPool = JSON.parse(localStorage.getItem(PENDING_WITHDRAWS_KEY))
    const accountPendingWithdrawPool = pendingWithdrawPool[hermezEthereumAddress]
    const newAccountPendingWithdrawPool = accountPendingWithdrawPool === undefined
      ? [pendingWithdraw]
      : [...accountPendingWithdrawPool, pendingWithdraw]
    const newPendingWithdrawPool = {
      ...pendingWithdrawPool,
      [hermezEthereumAddress]: newAccountPendingWithdrawPool
    }

    localStorage.setItem(PENDING_WITHDRAWS_KEY, JSON.stringify(newPendingWithdrawPool))
    dispatch(globalActions.addPendingWithdraw(hermezEthereumAddress, pendingWithdraw))
  }
}

/**
 * Removes a pendingWithdraw from the pendingWithdraw pool
 * @param {string} hermezEthereumAddress - The account with which the pendingWithdraw was originally made
 * @param {string} pendingWithdrawId - The pendingWithdraw identifier to remove from the pool
 * @returns {void}
 */
function removePendingWithdraw (hermezEthereumAddress, pendingWithdrawId) {
  return (dispatch) => {
    const pendingWithdrawPool = JSON.parse(localStorage.getItem(PENDING_WITHDRAWS_KEY))
    const accountPendingWithdrawPool = pendingWithdrawPool[hermezEthereumAddress]
    const newAccountPendingWithdrawPool = accountPendingWithdrawPool
      .filter((pendingWithdraw) => pendingWithdraw !== pendingWithdrawId)
    const newPendingWithdrawPool = {
      ...pendingWithdrawPool,
      [hermezEthereumAddress]: newAccountPendingWithdrawPool
    }

    localStorage.setItem(PENDING_WITHDRAWS_KEY, JSON.stringify(newPendingWithdrawPool))
    dispatch(globalActions.removePendingWithdraw(hermezEthereumAddress, pendingWithdrawId))
  }
}

/**
 * Adds a pendingWithdraw to the pendingDelayedWithdraw store
 * @param {string} pendingDelayedWithdraw - The pendingDelayedWithdraw to add to the store
 * @returns {void}
 */
function addPendingDelayedWithdraw (pendingDelayedWithdraw) {
  return (dispatch, getState) => {
    const { global: { wallet } } = getState()
    const { hermezEthereumAddress } = wallet

    const pendingDelayedWithdrawStore = JSON.parse(localStorage.getItem(PENDING_DELAYED_WITHDRAWS_KEY))
    const accountPendingDelayedWithdrawStore = pendingDelayedWithdrawStore[hermezEthereumAddress]
    const newAccountPendingDelayedWithdrawStore = accountPendingDelayedWithdrawStore === undefined
      ? [pendingDelayedWithdraw]
      : [...accountPendingDelayedWithdrawStore, pendingDelayedWithdraw]
    const newPendingDelayedWithdrawStore = {
      ...pendingDelayedWithdrawStore,
      [hermezEthereumAddress]: newAccountPendingDelayedWithdrawStore
    }

    localStorage.setItem(PENDING_DELAYED_WITHDRAWS_KEY, JSON.stringify(newPendingDelayedWithdrawStore))
    dispatch(globalActions.addPendingDelayedWithdraw(hermezEthereumAddress, pendingDelayedWithdraw))
  }
}

/**
 * Removes a pendingWithdraw from the pendingDelayedWithdraw store
 * @param {string} pendingDelayedWithdrawId - The pendingDelayedWithdraw identifier to remove from the store
 * @returns {void}
 */
function removePendingDelayedWithdraw (pendingDelayedWithdrawId) {
  return (dispatch, getState) => {
    const { global: { wallet } } = getState()
    const { hermezEthereumAddress } = wallet

    const pendingDelayedWithdrawStore = JSON.parse(localStorage.getItem(PENDING_DELAYED_WITHDRAWS_KEY))
    const accountPendingDelayedWithdrawStore = pendingDelayedWithdrawStore[hermezEthereumAddress]
    const newAccountPendingDelayedWithdrawStore = accountPendingDelayedWithdrawStore
      .filter((pendingDelayedWithdraw) => pendingDelayedWithdraw.id !== pendingDelayedWithdrawId)
    const newPendingDelayedWithdrawStore = {
      ...pendingDelayedWithdrawStore,
      [hermezEthereumAddress]: newAccountPendingDelayedWithdrawStore
    }

    localStorage.setItem(PENDING_DELAYED_WITHDRAWS_KEY, JSON.stringify(newPendingDelayedWithdrawStore))
    dispatch(globalActions.removePendingDelayedWithdraw(hermezEthereumAddress, pendingDelayedWithdrawId))
  }
}

/**
 * Fetches the state of the coordinator
 * @returns {void}
 */
function fetchCoordinatorState () {
  return (dispatch) => {
    dispatch(globalActions.loadCoordinatorState())

    return hermezjs.CoordinatorAPI.getState()
      .then(res => dispatch(globalActions.loadCoordinatorStateSuccess(res)))
      .catch(err => dispatch(globalActions.loadCoordinatorStateFailure(err)))
  }
}

/**
 * Removes the MetaMask wallet data from the Redux store and the localStorage
 * @returns {void}
 */
function disconnectWallet () {
  return (dispatch) => {
    dispatch(globalActions.unloadWallet())
    dispatch(push('/login'))
  }
}

/**
 * Reloads the webapp
 * @returns {void}
 */
function reloadApp () {
  return (dispatch) => {
    window.location.reload()
  }
}

export {
  setHermezEnvironment,
  changeRedirectRoute,
  fetchFiatExchangeRates,
  changeNetworkStatus,
  addPendingWithdraw,
  removePendingWithdraw,
  addPendingDelayedWithdraw,
  removePendingDelayedWithdraw,
  fetchCoordinatorState,
  disconnectWallet,
  reloadApp
}
