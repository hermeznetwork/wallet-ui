import { CoordinatorAPI } from '@hermeznetwork/hermezjs'
import { getPoolTransactions } from '@hermeznetwork/hermezjs/src/tx-pool'

import * as homeActions from './home.actions'
import { ACCOUNT_AUTH_KEY, ACCOUNT_AUTH_SIGNATURE_KEY } from '../../constants'

/**
 * Fetches the accounts for a Hermez Ethereum address
 * @param {string} hermezEthereumAddress - Hermez ethereum address
 * @param {number} fromItem - id of the first account to be returned from the API
 * @returns {void}
 */
function fetchAccounts (hermezEthereumAddress, fromItem) {
  return (dispatch) => {
    dispatch(homeActions.loadAccounts())

    return CoordinatorAPI.getAccounts(hermezEthereumAddress, fromItem)
      .then(res => dispatch(homeActions.loadAccountsSuccess(res)))
      .catch(err => dispatch(homeActions.loadAccountsFailure(err)))
  }
}

/**
 * Fetches the transactions which are in the transactions pool
 * @returns {void}
 */
function fetchPoolTransactions () {
  return (dispatch, getState) => {
    dispatch(homeActions.loadPoolTransactions())

    const { global: { wallet } } = getState()

    if (wallet) {
      getPoolTransactions(null, wallet.publicKeyCompressedHex)
        .then((transactions) => dispatch(homeActions.loadPoolTransactionsSuccess(transactions)))
        .catch(err => dispatch(homeActions.loadPoolTransactionsFailure(err)))
    } else {
      dispatch(homeActions.loadPoolTransactionsFailure('Wallet not available'))
    }
  }
}

/**
 * Fetches the exit data for transactions of type Exit
 * @returns {void}
 */
function fetchExits () {
  return (dispatch) => {
    dispatch(homeActions.loadExits())

    return CoordinatorAPI.getExits(true)
      .then(exits => dispatch(homeActions.loadExitsSuccess(exits)))
      .catch(err => dispatch(homeActions.loadExitsFailure(err)))
  }
}

/**
 * Sends a create account authorization request if it hasn't been done
 * for the current coordinator
 */
function postCreateAccountAuthorization () {
  return (dispatch, getState) => {
    const { home: { accountAuthSignature }, global: { wallet } } = getState()

    const accountAuth = JSON.parse(localStorage.getItem(ACCOUNT_AUTH_KEY))
    const currentAccountAuth = accountAuth[wallet.hermezEthereumAddress]

    const currentSignature = accountAuthSignature[wallet.hermezEthereumAddress]
    const getSignature = currentSignature
      ? () => Promise.resolve(currentSignature)
      : wallet.signCreateAccountAuthorization.bind(wallet)
    const apiUrl = CoordinatorAPI.getBaseApiUrl()

    if (!currentAccountAuth || !currentAccountAuth[apiUrl]) {
      getSignature()
        .then((signature) => {
          setAccountAuthSignature(wallet.hermezEthereumAddress, signature)

          return CoordinatorAPI.postCreateAccountAuthorization(
            wallet.hermezEthereumAddress,
            `${wallet.publicKeyBase64}`,
            signature
          )
        })
        .then(() => {
          const newAccountAuth = {
            ...accountAuth,
            [wallet.hermezEthereumAddress]: {
              ...currentAccountAuth,
              [apiUrl]: true
            }
          }
          localStorage.setItem(ACCOUNT_AUTH_KEY, JSON.stringify(newAccountAuth))
          dispatch(homeActions.addAccountAuth(wallet.hermezEthereumAddress, apiUrl))
        })
        .catch(console.log)
    }
  }
}

/**
 *
 * @param {*} hermezEthereumAddress
 * @param {*} signature
 */
function setAccountAuthSignature (hermezEthereumAddress, signature) {
  return (dispatch) => {
    const accountAuthSignature = JSON.parse(localStorage.getItem(ACCOUNT_AUTH_SIGNATURE_KEY))
    const newAccountAuthSignature = {
      ...accountAuthSignature,
      [hermezEthereumAddress]: signature
    }
    localStorage.setItem(ACCOUNT_AUTH_SIGNATURE_KEY, JSON.stringify(newAccountAuthSignature))
    dispatch(homeActions.setAccountAuthSignature(hermezEthereumAddress, signature))
  }
}

export {
  fetchAccounts,
  fetchPoolTransactions,
  fetchExits,
  postCreateAccountAuthorization,
  setAccountAuthSignature
}
