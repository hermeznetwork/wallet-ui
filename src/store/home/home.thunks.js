import { CoordinatorAPI } from '@hermeznetwork/hermezjs'
import { getPoolTransactions } from '@hermeznetwork/hermezjs/src/tx-pool'

import * as homeActions from './home.actions'

/**
 * Fetches all the accounts for a Hermez Ethereum address to calculate the total balance
 * later on taking into account the transactions from the pool and the pending deposits
 * @param {string} hermezEthereumAddress - Hermez ethereum address
 * @returns {void}
 */
function fetchAllAccounts (hermezEthereumAddress) {
  return (dispatch) => {
    dispatch(homeActions.loadAllAccounts())

    return CoordinatorAPI.getAccounts(hermezEthereumAddress, undefined, undefined, undefined, 2049)
      .then((res) => dispatch(homeActions.loadAllAccountsSuccess(res.accounts)))
      .catch(err => dispatch(homeActions.loadAllAccountsFailure(err)))
  }
}

/**
 * Fetches the accounts for a Hermez Ethereum address
 * @param {string} hermezEthereumAddress - Hermez ethereum address
 * @param {number} fromItem - id of the first account to be returned from the API
 * @returns {void}
 */
function fetchAccounts (hermezEthereumAddress, fromItem) {
  return (dispatch) => {
    dispatch(homeActions.loadAccounts())

    return CoordinatorAPI.getAccounts(hermezEthereumAddress, undefined, fromItem)
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
  return (dispatch, getState) => {
    dispatch(homeActions.loadExits())

    const { global: { wallet } } = getState()

    return CoordinatorAPI.getExits(wallet.hermezEthereumAddress, true)
      .then(exits => dispatch(homeActions.loadExitsSuccess(exits)))
      .catch(err => dispatch(homeActions.loadExitsFailure(err)))
  }
}

export {
  fetchAllAccounts,
  fetchAccounts,
  fetchPoolTransactions,
  fetchExits
}
