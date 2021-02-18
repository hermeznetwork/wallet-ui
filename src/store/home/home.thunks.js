import axios from 'axios'
import { CoordinatorAPI } from '@hermeznetwork/hermezjs'
import { getPoolTransactions } from '@hermeznetwork/hermezjs/src/tx-pool'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../utils/currencies'

import * as homeActions from './home.actions'

let refreshCancelTokenSource = axios.CancelToken.source()

/**
 * Fetches the accounts for a Hermez Ethereum address and calculates the total balance.
 * @returns {void}
 */
function fetchTotalAccountsBalance () {
  return (dispatch, getState) => {
    const {
      home: { totalAccountsBalanceTask },
      global: { wallet, fiatExchangeRatesTask },
      myAccount: { preferredCurrency }
    } = getState()

    if (totalAccountsBalanceTask.status === 'pending' || totalAccountsBalanceTask.status === 'successful') {
      dispatch(homeActions.loadTotalAccountsBalance())

      return CoordinatorAPI.getAccounts(wallet.hermezEthereumAddress, undefined, undefined, undefined, 2049)
        .then((res) => {
          const totalAccountsBalance = res.accounts.reduce((amount, account) => {
            const fixedAccountBalance = getFixedTokenAmount(
              account.balance,
              account.token.decimals
            )
            const fiatBalance = getTokenAmountInPreferredCurrency(
              fixedAccountBalance,
              account.token.USD,
              preferredCurrency,
              fiatExchangeRatesTask.data
            )

            return amount + fiatBalance
          }, 0)
          dispatch(homeActions.loadTotalAccountsBalanceSuccess(totalAccountsBalance))
        })
        .catch(err => dispatch(homeActions.loadTotalAccountsBalanceFailure(err)))
    }
  }
}

/**
 * Fetches the accounts for a Hermez Ethereum address
 * @param {number} fromItem - id of the first account to be returned from the API
 * @returns {void}
 */
function fetchAccounts (fromItem) {
  return (dispatch, getState) => {
    const { global: { wallet } } = getState()

    dispatch(homeActions.loadAccounts())

    if (fromItem) {
      refreshCancelTokenSource.cancel()
    }

    console.log(fromItem)
    return CoordinatorAPI.getAccounts(wallet.hermezEthereumAddress, undefined, fromItem, undefined, 1)
      .then(res => dispatch(homeActions.loadAccountsSuccess(res)))
      .catch(err => dispatch(homeActions.loadAccountsFailure(err)))
  }
}

/**
 * Refreshes the accounts information for the accounts that have already been
 * loaded
 * @param {string} accountIndex - Account index
 */
function refreshAccounts () {
  return (dispatch, getState) => {
    const { home: { accountsTask }, global: { wallet } } = getState()

    if (accountsTask.status === 'successful') {
      dispatch(homeActions.refreshHistoryAccounts())

      refreshCancelTokenSource = axios.CancelToken.source()

      const axiosConfig = { cancelToken: refreshCancelTokenSource.token }
      const initialReq = CoordinatorAPI.getAccounts(wallet.hermezEthereumAddress, undefined, undefined, undefined, 1, axiosConfig)
      const requests = accountsTask.data.fromItemHistory
        .reduce((requests, fromItem) => ([
          ...requests,
          CoordinatorAPI.getAccounts(
            wallet.hermezEthereumAddress,
            undefined,
            fromItem,
            undefined,
            1,
            axiosConfig
          )
        ]), [initialReq])

      Promise.all(requests)
        .then((results) => {
          const accounts = results.reduce((acc, result) => [...acc, ...result.accounts], [])
          const pendingItems = results[results.length - 1].pendingItems

          return { accounts, pendingItems }
        })
        .then(res => dispatch(homeActions.refreshHistoryAccountsSuccess(res)))
    }
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
    const { home: { exitsTask }, global: { wallet } } = getState()

    if (exitsTask.status === 'pending' || exitsTask.status === 'successful') {
      dispatch(homeActions.loadExits())

      return CoordinatorAPI.getExits(wallet.hermezEthereumAddress, true)
        .then(exits => dispatch(homeActions.loadExitsSuccess(exits)))
        .catch(err => dispatch(homeActions.loadExitsFailure(err)))
    }
  }
}

export {
  fetchTotalAccountsBalance,
  fetchAccounts,
  refreshAccounts,
  fetchPoolTransactions,
  fetchExits
}
