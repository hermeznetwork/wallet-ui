import { CoordinatorAPI } from '@hermeznetwork/hermezjs'
import { getPoolTransactions } from '@hermeznetwork/hermezjs/src/tx-pool'
import { getAccountBalance } from '../../utils/accounts'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../utils/currencies'

import * as homeActions from './home.actions'

/**
 * Fetches all the accounts for a Hermez Ethereum address to calculate the total balance
 * later on taking into account the transactions from the pool and the pending deposits
 * @param {string} hermezEthereumAddress - Hermez ethereum address
 * @returns {void}
 */
function fetchTotalBalance (hermezEthereumAddress, poolTransactions, pendingDeposits, pendingWithdraws, fiatExchangeRates, preferredCurrency) {
  return (dispatch) => {
    dispatch(homeActions.loadTotalBalance())

    return CoordinatorAPI.getAccounts(hermezEthereumAddress, undefined, undefined, undefined, 2049)
      .then((res) => {
        const accounts = res.accounts.map((account) => {
          const tokenPoolTransactions = poolTransactions.filter(transaction => transaction.token.id === account.token.id)
          const tokenPendingDeposits = pendingDeposits.filter(deposit => deposit.token.id === account.token.id)
          const tokenPendingWithdraws = pendingWithdraws.filter(withdraw => withdraw.token.id === account.token.id)
          const accountBalance = getAccountBalance(account, tokenPoolTransactions, tokenPendingDeposits, tokenPendingWithdraws)
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

/**
 * Fetches the accounts for a Hermez Ethereum address
 * @param {string} hermezEthereumAddress - Hermez ethereum address
 * @param {number} fromItem - id of the first account to be returned from the API
 * @returns {void}
 */
function fetchAccounts (hermezEthereumAddress, fromItem, poolTransactions, pendingDeposits, pendingWithdraws, fiatExchangeRates, preferredCurrency) {
  return (dispatch) => {
    dispatch(homeActions.loadAccounts())

    return CoordinatorAPI.getAccounts(hermezEthereumAddress, undefined, fromItem)
      .then((res) => {
        const accounts = res.accounts.map((account) => {
          const tokenPoolTransactions = poolTransactions.filter(transaction => transaction.token.id === account.token.id)
          const tokenPendingDeposits = pendingDeposits.filter(deposit => deposit.token.id === account.token.id)
          const tokenPendingWithdraws = pendingWithdraws.filter(withdraw => withdraw.token.id === account.token.id)
          const accountBalance = getAccountBalance(account, tokenPoolTransactions, tokenPendingDeposits, tokenPendingWithdraws)
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
    dispatch(homeActions.loadExits())

    const { global: { wallet } } = getState()

    return CoordinatorAPI.getExits(wallet.hermezEthereumAddress, true)
      .then(exits => dispatch(homeActions.loadExitsSuccess(exits)))
      .catch(err => dispatch(homeActions.loadExitsFailure(err)))
  }
}

export {
  fetchTotalBalance,
  fetchAccounts,
  fetchPoolTransactions,
  fetchExits
}
