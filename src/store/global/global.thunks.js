import { ethers } from 'ethers'
import { keccak256 } from 'js-sha3'
import hermezjs from 'hermezjs'
import TransportU2F from '@ledgerhq/hw-transport-u2f'
import Eth from '@ledgerhq/hw-app-eth'
import TrezorConnect from 'trezor-connect'
import { push } from 'connected-react-router'

import * as globalActions from './global.actions'
import { AUTH_MESSAGE, PENDING_WITHDRAWS_KEY, PENDING_DELAYED_WITHDRAWS_KEY } from '../../constants'
import * as fiatExchangeRatesApi from '../../apis/fiat-exchange-rates'
import { strToHex } from '../../utils/strings'
import { buildEthereumBip44Path } from '../../utils/hw-wallets'

/**
 * Asks the user to login using a MetaMask wallet and stores its data in the Redux store
 * @returns {void}
 */
function fetchMetaMaskWallet () {
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
      const signature = await signer.signMessage(AUTH_MESSAGE)
      const hashedSignature = keccak256(signature)
      const signatureBuffer = hermezjs.Utils.hexToBuffer(hashedSignature)
      const wallet = new hermezjs.BabyJubWallet.BabyJubWallet(signatureBuffer, hermezEthereumAddress)
      dispatch(globalActions.loadMetamaskWalletSuccess(wallet))
    } catch (error) {
      dispatch(globalActions.loadMetamaskWalletFailure(error.message))
    }
  }
}

function fetchLedgerWallet (accountData) {
  return async (dispatch) => {
    try {
      const { accountType, accountIndex } = accountData
      const path = buildEthereumBip44Path(accountType, accountIndex)
      const transport = await TransportU2F.create()
      const ethereum = new Eth(transport)
      const { address } = await ethereum.getAddress(path)
      const hermezEthereumAddress = hermezjs.Addresses.getHermezAddress(address)
      const result = await ethereum.signPersonalMessage(path, strToHex(AUTH_MESSAGE))
      const hexV = (result.v - 27).toString(16)
      const fixedHexV = hexV.length < 2 ? `0${hexV}` : hexV
      const signature = `0x${result.r}${result.s}${fixedHexV}`
      const hashedSignature = keccak256(signature)
      const signatureBuffer = hermezjs.Utils.hexToBuffer(hashedSignature)
      const wallet = new hermezjs.BabyJubWallet.BabyJubWallet(signatureBuffer, hermezEthereumAddress)
      dispatch(globalActions.loadMetamaskWalletSuccess(wallet))
    } catch (error) {
      dispatch(globalActions.loadMetamaskWalletFailure(error.message))
    }
  }
}

function fetchTrezorWallet (accountData) {
  return async (dispatch) => {
    try {
      const { accountType, accountIndex } = accountData
      const path = buildEthereumBip44Path(accountType, accountIndex)
      const result = await TrezorConnect.ethereumSignMessage({
        path: path,
        message: AUTH_MESSAGE
      })

      if (result.success) {
        const { address, signature } = result.payload
        const hashedSignature = keccak256(`0x${signature}`)
        const hermezEthereumAddress = hermezjs.Addresses.getHermezAddress(address)
        const signatureBuffer = hermezjs.Utils.hexToBuffer(hashedSignature)
        const wallet = new hermezjs.BabyJubWallet.BabyJubWallet(signatureBuffer, hermezEthereumAddress)
        dispatch(globalActions.loadMetamaskWalletSuccess(wallet))
      } else {
        dispatch(globalActions.loadMetamaskWalletFailure(result.payload.error))
      }
    } catch (error) {
      dispatch(globalActions.loadMetamaskWalletFailure(error.message))
    }
  }
}

/**
 * Changes the route to which the user is going to be redirected to after a successful
 * login
 * @param {string} redirecRoute - Route to be redirected to
 * @returns {void}
 */
function changeRedirectRoute (redirecRoute) {
  return (dispatch) => {
    dispatch(globalActions.changeRedirectRoute(redirecRoute))
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
function disconnectMetaMaskWallet () {
  return (dispatch) => {
    dispatch(globalActions.unloadMetaMaskWallet())
    dispatch(push('/login'))
  }
}

export {
  fetchMetaMaskWallet,
  fetchLedgerWallet,
  fetchTrezorWallet,
  changeRedirectRoute,
  fetchFiatExchangeRates,
  changeNetworkStatus,
  addPendingWithdraw,
  removePendingWithdraw,
  addPendingDelayedWithdraw,
  removePendingDelayedWithdraw,
  fetchCoordinatorState,
  disconnectMetaMaskWallet
}
