import axios from 'axios'
import { CoordinatorAPI } from '@hermeznetwork/hermezjs'
import { getPoolTransactions } from '@hermeznetwork/hermezjs/src/tx-pool'
import { TxType } from '@hermeznetwork/hermezjs/src/enums'
import { push } from 'connected-react-router'
import * as accountDetailsActions from './account-details.actions'
import * as ethereum from '../../utils/ethereum'
import { RootState } from '../'
import { AppDispatch } from '../../' 

// domain
import { Account, Token, HermezTransaction, Exit } from '../../domain/hermez'
import { Transactions, Exits } from '../../persistence'

let refreshCancelTokenSource = axios.CancelToken.source()

/**
 * Fetches the account details for the specified account index
 * @param {string} accountIndex - Account index
 * @returns {void}
 */
function fetchAccount (accountIndex: Account["accountIndex"]) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const { global: { wallet } } = getState()

    dispatch(accountDetailsActions.loadAccount())

    return CoordinatorAPI.getAccount(accountIndex)
      .then((account: Account) => {
        if (wallet === undefined || account.bjj !== wallet.publicKeyBase64) {
          dispatch(push('/'))
        } else {
          dispatch(accountDetailsActions.loadAccountSuccess(account))
        }
      })
      .catch((err: Error) => dispatch(accountDetailsActions.loadAccountFailure(err)))
  }
}

/**
 * Checks whether the Ethereum account has >0 balance for the token
 * @param {Object} token - Hermez token object for the loaded account
 * @returns {void}
 */
function fetchL1TokenBalance (token: Token) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const { global: { wallet } } = getState()

    dispatch(accountDetailsActions.loadL1TokenBalance())

    return ethereum.getTokens(wallet, [token])
      .then(metamaskTokens => {
        if (metamaskTokens[0]) {
          // ToDo: Why are we fetching the L1 Token Balance if don't use it?
          // The action loadL1TokenBalanceSuccess expected a param that is not being passed.
          // I've removed the param of the action in the migration to TS until this is clarified.
          dispatch(accountDetailsActions.loadL1TokenBalanceSuccess())
        } else {
          dispatch(accountDetailsActions.loadL1TokenBalanceFailure())
        }
      })
      .catch(_ => dispatch(accountDetailsActions.loadL1TokenBalanceFailure()))
  }
}

/**
 * Fetches the transaction details for each transaction in the pool for the specified account index
 * @param {string} accountIndex - Account index
 * @returns {void}
 */
function fetchPoolTransactions (accountIndex: Account["accountIndex"]) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(accountDetailsActions.loadPoolTransactions())

    const { global: { wallet } } = getState()
    if (wallet !== undefined) {
      getPoolTransactions(accountIndex, wallet.publicKeyCompressedHex)
      // We need to reverse the txs to match the order of the txs from the history (DESC)
        .then((transactions: HermezTransaction[]) => transactions.reverse())
        .then((transactions: HermezTransaction[]) => dispatch(accountDetailsActions.loadPoolTransactionsSuccess(transactions)))
        .catch((err: Error) => dispatch(accountDetailsActions.loadPoolTransactionsFailure(err)))
    }
  }
}

function filterExitsFromHistoryTransactions (historyTransactions: HermezTransaction[], exits: Exit[]) {
  return historyTransactions.filter((transaction) => {
    if (transaction.type === TxType.Exit) {
      const exitTx = exits.find((exit) =>
        exit.batchNum === transaction.batchNum &&
        exit.accountIndex === transaction.fromAccountIndex
      )

      // If the Exit isn't pending, return true and show in history
      return !exitTx || exitTx.instantWithdraw || exitTx.delayedWithdraw
    } else {
      return true
    }
  })
}

/**
 * Fetches the transactions details for the specified account index
 * @param {string} accountIndex - Account index
 * @returns {void}
 */
// ToDo: Define fromItem type
function fetchHistoryTransactions (accountIndex: Account["accountIndex"], fromItem: unknown, historyExits: Exits) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      accountDetails: { historyTransactionsTask }
    } = getState()

    if (fromItem === undefined && historyTransactionsTask.status === 'successful') {
      return dispatch(refreshHistoryTransactions(accountIndex, historyExits))
    }

    dispatch(accountDetailsActions.loadHistoryTransactions())

    if (fromItem) {
      refreshCancelTokenSource.cancel()
    }

    return CoordinatorAPI.getTransactions(
      undefined,
      undefined,
      undefined,
      accountIndex,
      fromItem,
      CoordinatorAPI.PaginationOrder.DESC
    )
      .then((historyTransactions: Transactions) => {
        const filteredTransactions = filterExitsFromHistoryTransactions(
          historyTransactions.transactions,
          historyExits.exits,
        )

        return { ...historyTransactions, transactions: filteredTransactions }
      })
      .then((historyTransactions: Transactions) => dispatch(accountDetailsActions.loadHistoryTransactionsSuccess(historyTransactions)))
      .catch((err: Error) => dispatch(accountDetailsActions.loadHistoryTransactionsFailure(err)))
  }
}

/**
 * Refreshes the transactions information for the transactions that have already been
 * loaded
 * @param {string} accountIndex - Account index
 */
function refreshHistoryTransactions (accountIndex: Account["accountIndex"], historyExits: Exits) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      accountDetails: { historyTransactionsTask }
    } = getState()

    if (historyTransactionsTask.status === 'successful') {
      dispatch(accountDetailsActions.refreshHistoryTransactions())

      refreshCancelTokenSource = axios.CancelToken.source()

      const axiosConfig = { cancelToken: refreshCancelTokenSource.token }
      const initialReq = CoordinatorAPI.getTransactions(
        undefined,
        undefined,
        undefined,
        accountIndex,
        undefined,
        CoordinatorAPI.PaginationOrder.DESC,
        undefined,
        axiosConfig
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
            CoordinatorAPI.PaginationOrder.DESC,
            undefined,
            axiosConfig
          )
        ]), [initialReq])

      Promise.all(requests)
        .then((results) => {
          const transactions = results.reduce((acc, result) => [...acc, ...result.transactions], [])
          const filteredTransactions = filterExitsFromHistoryTransactions(
            transactions,
            historyExits.exits,
          )
          const pendingItems: number = results[results.length - 1].pendingItems

          return { transactions: filteredTransactions, pendingItems }
        })
        .then((historyTransactions: Transactions) => dispatch(accountDetailsActions.refreshHistoryTransactionsSuccess(historyTransactions)))
    }
  }
}

/**
 * Fetches the exit data for transactions of type Exit that are still pending a withdraw
 * @param {Number} tokenId - The token ID for the current account
 * @returns {void}
 */
function fetchExits (tokenId: Token["id"]) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(accountDetailsActions.loadExits())

    const { global: { wallet } } = getState()
    if (wallet !== undefined) {
      return CoordinatorAPI.getExits(wallet.hermezEthereumAddress, true, tokenId)
      .then((historyExits: Exits) => dispatch(accountDetailsActions.loadExitsSuccess(historyExits)))
      .catch((err: Error) => dispatch(accountDetailsActions.loadExitsFailure(err)))
    }
  }
}

export {
  fetchAccount,
  fetchL1TokenBalance,
  fetchPoolTransactions,
  fetchHistoryTransactions,
  refreshHistoryTransactions,
  fetchExits
}
