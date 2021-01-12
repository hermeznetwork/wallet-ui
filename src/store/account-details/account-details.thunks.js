import { CoordinatorAPI } from '@hermeznetwork/hermezjs'
import { getPoolTransactions } from '@hermeznetwork/hermezjs/src/tx-pool'

import * as accountDetailsActionTypes from './account-details.actions'
import { removePendingWithdraw } from '../global/global.thunks'

/**
 * Fetches the account details for the specified account index
 * @param {string} accountIndex - Account index
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
 * @param {string} accountIndex - Account index
 * @returns {void}
 */
function fetchPoolTransactions (accountIndex) {
  return (dispatch, getState) => {
    dispatch(accountDetailsActionTypes.loadPoolTransactions())

    const { global: { wallet } } = getState()

    if (wallet) {
      getPoolTransactions(accountIndex, wallet.publicKeyCompressedHex)
        .then((transactions) => dispatch(accountDetailsActionTypes.loadPoolTransactionsSuccess(transactions)))
        .catch(err => dispatch(accountDetailsActionTypes.loadPoolTransactionsFailure(err)))
    } else {
      dispatch(accountDetailsActionTypes.loadPoolTransactionsFailure('MetaMask wallet is not available'))
    }
  }
}

/**
 * Fetches the transactions details for the specified account index
 * @param {string} accountIndex - Account index
 * @returns {void}
 */
function fetchHistoryTransactions (accountIndex, fromItem) {
  return (dispatch, getState) => {
    dispatch(accountDetailsActionTypes.loadHistoryTransactions())

    const { accountDetails: { exitsTask }, global: { wallet } } = getState()

    return CoordinatorAPI.getTransactions(
      undefined,
      undefined,
      undefined,
      accountIndex,
      fromItem,
      CoordinatorAPI.PaginationOrder.DESC
    )
      .then((res) => {
        res.transactions = res.transactions.filter((transaction) => {
          if (transaction.type === 'Exit') {
            const exitTx = exitsTask.data.exits.find((exit) =>
              exit.batchNum === transaction.batchNum &&
              exit.accountIndex === transaction.fromAccountIndex
            )
            if (exitTx) {
              if (exitTx.instantWithdraw) {
                removePendingWithdraw(wallet.hermezEthereumAddress, exitTx.accountIndex + exitTx.merkleProof.root)
                return true
              } else {
                return false
              }
            } else {
              return true
            }
          } else {
            return true
          }
        })

        return res
      })
      .then(res => dispatch(accountDetailsActionTypes.loadHistoryTransactionsSuccess(res)))
      .catch(err => dispatch(accountDetailsActionTypes.loadHistoryTransactionsFailure(err)))
  }
}

/**
 * Fetches the exit data for transactions of type Exit that are still pending a withdraw
 * @returns {void}
 */
function fetchExits () {
  return (dispatch, getState) => {
    dispatch(accountDetailsActionTypes.loadExits())

    const { global: { wallet } } = getState()

    return CoordinatorAPI.getExits(wallet.hermezEthereumAddress, true)
      .then(exits => dispatch(accountDetailsActionTypes.loadExitsSuccess(exits)))
      .catch(err => dispatch(accountDetailsActionTypes.loadExitsFailure(err)))
  }
}

export {
  fetchAccount,
  fetchPoolTransactions,
  fetchHistoryTransactions,
  fetchExits
}
