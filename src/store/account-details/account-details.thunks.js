import { CoordinatorAPI } from 'hermezjs'
import { getPoolTransactions } from 'hermezjs/src/tx-pool'

import * as accountDetailsActionTypes from './account-details.actions'

/**
 * Fetches the account details for the specified account index
 * @param {string} accountIndex - The account index
 * @returns {void}
 */
function fetchAccount (accountIndex) {
  return (dispatch) => {
    dispatch(accountDetailsActionTypes.loadAccount())

    return CoordinatorAPI.getAccount(accountIndex)
      .then(res => dispatch(accountDetailsActionTypes.loadAccountSuccess(res)))
      .catch(err => dispatch(accountDetailsActionTypes.loadAccountFailure(err)))
  }
}

/**
 * Fetches the transaction details for each transaction in the pool for the specified account index
 * @param {string} accountIndex - The account index
 * @returns {void}
 */
function fetchPoolTransactions (accountIndex) {
  return (dispatch, getState) => {
    dispatch(accountDetailsActionTypes.loadPoolTransactions())

    const { global: { metaMaskWalletTask } } = getState()

    if (metaMaskWalletTask.status === 'successful') {
      const { publicKeyCompressedHex } = metaMaskWalletTask.data
      getPoolTransactions(accountIndex, publicKeyCompressedHex)
        .then((transactions) => dispatch(accountDetailsActionTypes.loadPoolTransactionsSuccess(transactions)))
        .catch(err => dispatch(accountDetailsActionTypes.loadPoolTransactionsFailure(err)))
    } else {
      dispatch(accountDetailsActionTypes.loadPoolTransactionsFailure('MetaMask wallet is not available'))
    }
  }
}

/**
 * Fetches the transactions details for the specified account index
 * @param {string} accountIndex - The account index
 * @returns {void}
 */
function fetchHistoryTransactions (accountIndex, fromItem) {
  return (dispatch) => {
    dispatch(accountDetailsActionTypes.loadHistoryTransactions())

    return CoordinatorAPI.getTransactions(accountIndex, fromItem)
      .then(res => dispatch(accountDetailsActionTypes.loadHistoryTransactionsSuccess(res)))
      .catch(err => dispatch(accountDetailsActionTypes.loadHistoryTransactionsFailure(err)))
  }
}

/**
 * Fetches the exit data for transactions of type Exit
 *
 * @param {Array} exitTransactions - Array of transactions of type Exit
 */
function fetchExits (exitTransactions) {
  return (dispatch) => {
    dispatch(accountDetailsActionTypes.loadExits())

    const exitTransactionsPromises = exitTransactions.map(exitTransaction => CoordinatorAPI.getExit(exitTransaction.batchNum, exitTransaction.fromAccountIndex))

    return Promise.all(exitTransactionsPromises)
      .then((exits) => {
        // TODO: Remove once we have hermez-node
        // const pendingWithdraws = exits.filter(exit => !exit.instantWithdrawn)
        dispatch(accountDetailsActionTypes.loadExitsSuccess(exits))
      })
      .catch(err => dispatch(accountDetailsActionTypes.loadExitsFailure(err)))
  }
}

export {
  fetchAccount,
  fetchPoolTransactions,
  fetchHistoryTransactions,
  fetchExits
}
