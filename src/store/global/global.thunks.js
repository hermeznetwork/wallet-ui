import ethers from 'ethers'
import { keccak256 } from 'js-sha3'
import hermezjs from 'hermezjs'

import * as globalActions from './global.actions'
import { METAMASK_MESSAGE, PENDING_WITHDRAWS_KEY, PENDING_DELAYED_WITHDRAWS_KEY } from '../../constants'
import * as fiatExchangeRatesApi from '../../apis/fiat-exchange-rates'

function fetchMetamaskWallet () {
  return async function (dispatch) {
    dispatch(globalActions.loadMetamaskWallet())
    try {
      const { ethereum } = window
      if (!ethereum || !ethereum.isMetaMask) {
        dispatch(globalActions.loadMetamaskWalletFailure('MetaMask is not available'))
      }
      await ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const ethereumAddress = await signer.getAddress()
      const hermezEthereumAddress = hermezjs.Addresses.getHermezAddress(ethereumAddress)
      const signature = await signer.signMessage(METAMASK_MESSAGE)
      const hashedSignature = keccak256(signature)
      const bufferSignature = hermezjs.Utils.hexToBuffer(hashedSignature)
      const wallet = new hermezjs.BabyJubWallet.BabyJubWallet(bufferSignature, hermezEthereumAddress)
      dispatch(globalActions.loadMetamaskWalletSuccess(wallet))
    } catch (error) {
      dispatch(globalActions.loadMetamaskWalletFailure(error.message))
    }
  }
}

function changeRedirectRoute (redirecRoute) {
  return (dispatch) => {
    dispatch(globalActions.changeRedirectRoute(redirecRoute))
  }
}

function fetchFiatExchangeRates (symbols) {
  return (dispatch) => {
    dispatch(globalActions.loadFiatExchangeRates())

    return fiatExchangeRatesApi.getFiatExchangeRates(symbols)
      .then(res => dispatch(globalActions.loadFiatExchangeRatesSuccess(res.rates)))
      .catch(err => dispatch(globalActions.loadFiatExchangeRatesFailure(err)))
  }
}

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
    const { global: { metaMaskWalletTask } } = getState()
    const { hermezEthereumAddress } = metaMaskWalletTask.data

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
    const { global: { metaMaskWalletTask } } = getState()
    const { hermezEthereumAddress } = metaMaskWalletTask.data

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
 */
function fetchCoordinatorState () {
  return (dispatch) => {
    dispatch(globalActions.loadCoordinatorState())

    return hermezjs.CoordinatorAPI.getState()
      .then(res => dispatch(globalActions.loadCoordinatorStateSuccess(res)))
      .catch(err => dispatch(globalActions.loadCoordinatorStateFailure(err)))
  }
}

export {
  fetchMetamaskWallet,
  changeRedirectRoute,
  fetchFiatExchangeRates,
  changeNetworkStatus,
  addPendingWithdraw,
  removePendingWithdraw,
  addPendingDelayedWithdraw,
  removePendingDelayedWithdraw,
  fetchCoordinatorState
}
