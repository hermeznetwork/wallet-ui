import { CoordinatorAPI } from '@hermeznetwork/hermezjs'
import { getPoolTransactions } from '@hermeznetwork/hermezjs/src/tx-pool'

import * as accountDetailsActions from './account-details.actions'
import { removePendingWithdraw, removePendingDelayedWithdraw } from '../global/global.thunks'
import { TxType } from '@hermeznetwork/hermezjs/src/enums'

/**
 * Fetches the account details for the specified account index
 * @param {string} accountIndex - Account index
 * @returns {void}
 */
function fetchAccount (accountIndex) {
  return (dispatch) => {
    dispatch(accountDetailsActions.loadAccount())

    return CoordinatorAPI.getAccount(accountIndex)
      .then(res => dispatch(accountDetailsActions.loadAccountSuccess(res)))
      .catch(err => dispatch(accountDetailsActions.loadAccountFailure(err)))
  }
}

/**
 * Fetches the transaction details for each transaction in the pool for the specified account index
 * @param {string} accountIndex - Account index
 * @returns {void}
 */
function fetchPoolTransactions (accountIndex) {
  return (dispatch, getState) => {
    dispatch(accountDetailsActions.loadPoolTransactions())

    const { global: { wallet } } = getState()

    if (wallet) {
      getPoolTransactions(accountIndex, wallet.publicKeyCompressedHex)
        .then((transactions) => dispatch(accountDetailsActions.loadPoolTransactionsSuccess(transactions)))
        .catch(err => dispatch(accountDetailsActions.loadPoolTransactionsFailure(err)))
    } else {
      dispatch(accountDetailsActions.loadPoolTransactionsFailure('MetaMask wallet is not available'))
    }
  }
}

function filterExitsFromHistoryTransactions (historyTransactions, exits, wallet, dispatch) {
  return historyTransactions.filter((transaction) => {
    if (transaction.type === TxType.Exit) {
      const exitTx = exits.find((exit) =>
        exit.batchNum === transaction.batchNum &&
        exit.accountIndex === transaction.fromAccountIndex
      )

      if (exitTx) {
        if (exitTx.instantWithdraw) {
          removePendingWithdraw(wallet.hermezEthereumAddress, exitTx.accountIndex + exitTx.merkleProof.Root)
          return true
        }
        if (exitTx.delayedWithdraw) {
          removePendingDelayedWithdraw(wallet.hermezEthereumAddress, exitTx.accountIndex + exitTx.merkleProof.Root)
          return true
        }
        return false
      }
    }

    return true
  })
}

/**
 * Fetches the transactions details for the specified account index
 * @param {string} accountIndex - Account index
 * @returns {void}
 */
function fetchHistoryTransactions (accountIndex, fromItem) {
  return (dispatch, getState) => {
    dispatch(accountDetailsActions.loadHistoryTransactions())

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
        const filteredTransactions = filterExitsFromHistoryTransactions(
          res.transactions,
          exitsTask.data,
          wallet,
          dispatch
        )

        return { ...res, transactions: filteredTransactions }
      })
      .then(res => dispatch(accountDetailsActions.loadHistoryTransactionsSuccess(res)))
      .catch(err => dispatch(accountDetailsActions.loadHistoryTransactionsFailure(err)))
  }
}

/**
 * Refreshes the transactions information for the transactions that have already been
 * loaded
 * @param {string} accountIndex - Account index
 */
function refreshHistoryTransactions (accountIndex) {
  return (dispatch, getState) => {
    const { accountDetails: { historyTransactionsTask, exitsTask }, global: { wallet } } = getState()

    if (historyTransactionsTask.status === 'successful') {
      dispatch(accountDetailsActions.refreshHistoryTransactions())

      const initialReq = CoordinatorAPI.getTransactions(
        undefined,
        undefined,
        undefined,
        accountIndex,
        undefined,
        CoordinatorAPI.PaginationOrder.DESC
      )

      const requests = historyTransactionsTask.data.fromItemHistory
        .reduce((requests, fromItem) => ([
          ...requests,
          CoordinatorAPI.getTransactions(
            undefined,
            undefined,
            undefined,
            accountIndex,
            fromItem,
            CoordinatorAPI.PaginationOrder.DESC
          )
        ]), [initialReq])

      Promise.all(requests)
        .then((results) => {
          const transactions = results.reduce((acc, result) => {
            return [...acc, ...result.transactions]
          }, [])
          const filteredTransactions = filterExitsFromHistoryTransactions(
            transactions,
            exitsTask.data,
            wallet,
            dispatch
          )
          const pendingItems = results[results.length - 1].pendingItems

          return { transactions: filteredTransactions, pendingItems }
        })
        .then(res => dispatch(accountDetailsActions.refreshHistoryTransactionsSuccess(res)))
    }
  }
}

/**
 * Fetches the exit data for transactions of type Exit that are still pending a withdraw
 * @param {Number} tokenId - The token ID for the current account
 * @returns {void}
 */
function fetchExits (tokenId) {
  return (dispatch, getState) => {
    dispatch(accountDetailsActions.loadExits())

    const { global: { wallet } } = getState()

    return CoordinatorAPI.getExits(wallet.hermezEthereumAddress, true, tokenId)
      .then(exits => dispatch(accountDetailsActions.loadExitsSuccess(exits)))
      .catch(err => dispatch(accountDetailsActions.loadExitsFailure(err)))
  }
}

export {
  fetchAccount,
  fetchPoolTransactions,
  fetchHistoryTransactions,
  refreshHistoryTransactions,
  fetchExits
}
