import axios from 'axios'
import { CoordinatorAPI } from '@hermeznetwork/hermezjs'
import { getPoolTransactions } from '@hermeznetwork/hermezjs/src/tx-pool'
import { getAccountBalance } from '../../utils/accounts'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../utils/currencies'

import * as homeActions from './home.actions'

let refreshCancelTokenSource = axios.CancelToken.source()

/**
 * Fetches the accounts for a Hermez Ethereum address and calculates the total balance.
 * @returns {void}
 */
function fetchTotalBalance (hermezEthereumAddress, poolTransactions, pendingDeposits, pendingWithdraws, fiatExchangeRates, preferredCurrency) {
  return (dispatch, getState) => {
    const { home: { totalBalanceTask } } = getState()

    if (totalBalanceTask.status === 'pending' || totalBalanceTask.status === 'successful') {
      dispatch(homeActions.loadTotalBalance())

      return CoordinatorAPI.getAccounts(hermezEthereumAddress, undefined, undefined, undefined, 2049)
        .then((res) => {
          const accounts = res.accounts.map((account) => {
            const accountBalance = getAccountBalance(account, poolTransactions, pendingDeposits, pendingWithdraws)
            const fixedTokenAmount = getFixedTokenAmount(accountBalance, account.token.decimals)
            const fiatBalance = getTokenAmountInPreferredCurrency(
              fixedTokenAmount,
              account.token.USD,
              preferredCurrency,
              fiatExchangeRates
            )

            return {
              ...account,
              balance: accountBalance,
              fiatBalance
            }
          })

          return { ...res, accounts }
        })
        .then((res) => {
          const totalAccountsBalance = res.accounts.reduce((totalBalance, account) => {
            return totalBalance + Number(account.fiatBalance)
          }, 0)

          dispatch(homeActions.loadTotalBalanceSuccess(totalAccountsBalance))
        })
        .catch((err) => dispatch(homeActions.loadTotalBalanceFailure(err)))
    }
  }
}

/**
 * Fetches the accounts for a Hermez Ethereum address
 * @param {number} fromItem - id of the first account to be returned from the API
 * @returns {void}
 */
function fetchAccounts (hermezEthereumAddress, fromItem, poolTransactions, pendingDeposits, pendingWithdraws, fiatExchangeRates, preferredCurrency) {
  return (dispatch, getState) => {
    const { home: { accountsTask } } = getState()

    if (fromItem === undefined && accountsTask.status === 'successful') {
      return dispatch(
        refreshAccounts(
          hermezEthereumAddress,
          poolTransactions,
          pendingDeposits,
          pendingWithdraws,
          fiatExchangeRates,
          preferredCurrency
        )
      )
    }

    dispatch(homeActions.loadAccounts())

    if (fromItem) {
      refreshCancelTokenSource.cancel()
    }

    return CoordinatorAPI.getAccounts(hermezEthereumAddress, undefined, fromItem, undefined)
      .then((res) => {
        const accounts = res.accounts.map((account) => {
          const accountBalance = getAccountBalance(account, poolTransactions, pendingDeposits, pendingWithdraws)
          const fixedTokenAmount = getFixedTokenAmount(accountBalance, account.token.decimals)
          const fiatBalance = getTokenAmountInPreferredCurrency(
            fixedTokenAmount,
            account.token.USD,
            preferredCurrency,
            fiatExchangeRates
          )

          return {
            ...account,
            balance: accountBalance,
            fiatBalance
          }
        })

        return { ...res, accounts }
      })
      .then(res => dispatch(homeActions.loadAccountsSuccess(res)))
      .catch(err => dispatch(homeActions.loadAccountsFailure(err)))
  }
}

/**
 * Refreshes the accounts information for the accounts that have already been
 * loaded
 * @param {string} accountIndex - Account index
 */
function refreshAccounts (hermezEthereumAddress, poolTransactions, pendingDeposits, pendingWithdraws, fiatExchangeRates, preferredCurrency) {
  return (dispatch, getState) => {
    const { home: { accountsTask } } = getState()

    if (accountsTask.status === 'successful') {
      dispatch(homeActions.refreshAccounts())

      refreshCancelTokenSource = axios.CancelToken.source()

      const axiosConfig = { cancelToken: refreshCancelTokenSource.token }
      const initialReq = CoordinatorAPI.getAccounts(
        hermezEthereumAddress,
        undefined,
        undefined,
        undefined,
        undefined,
        axiosConfig
      )
      const requests = accountsTask.data.fromItemHistory
        .reduce((requests, fromItem) => ([
          ...requests,
          CoordinatorAPI.getAccounts(
            hermezEthereumAddress,
            undefined,
            fromItem,
            undefined,
            undefined,
            axiosConfig
          )
        ]), [initialReq])

      Promise.all(requests)
        .then((results) => {
          const accounts = results
            .reduce((acc, result) => [...acc, ...result.accounts], [])
            .map((account) => {
              const accountBalance = getAccountBalance(account, poolTransactions, pendingDeposits, pendingWithdraws)
              const fixedTokenAmount = getFixedTokenAmount(accountBalance, account.token.decimals)
              const fiatBalance = getTokenAmountInPreferredCurrency(
                fixedTokenAmount,
                account.token.USD,
                preferredCurrency,
                fiatExchangeRates
              )

              return {
                ...account,
                balance: accountBalance,
                fiatBalance
              }
            })
          const pendingItems = results[results.length - 1].pendingItems

          return { accounts, pendingItems }
        })
        .then(res => dispatch(homeActions.refreshAccountsSuccess(res)))
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

    getPoolTransactions(null, wallet.publicKeyCompressedHex)
      .then((transactions) => dispatch(homeActions.loadPoolTransactionsSuccess(transactions)))
      .catch(err => dispatch(homeActions.loadPoolTransactionsFailure(err)))
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
  fetchTotalBalance,
  fetchAccounts,
  refreshAccounts,
  fetchPoolTransactions,
  fetchExits
}
