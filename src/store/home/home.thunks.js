import { CoordinatorAPI } from '@hermeznetwork/hermezjs'
import { getPoolTransactions } from '@hermeznetwork/hermezjs/src/tx-pool'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../utils/currencies'

import * as homeActions from './home.actions'

/**
 * Fetches the accounts for a Hermez Ethereum address and calculates the total balance.
 * @param {string} hermezEthereumAddress - Hermez ethereum address
 * @returns {void}
 */
function fetchTotalAccountsBalance (hermezEthereumAddress, preferredCurrency, fiatExchangeRates) {
  return (dispatch) => {
    dispatch(homeActions.loadTotalAccountsBalance())

    return CoordinatorAPI.getAccounts(hermezEthereumAddress, undefined, undefined, undefined, 2049)
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
            fiatExchangeRates
          )

          return amount + fiatBalance
        }, 0)

        dispatch(homeActions.loadTotalAccountsBalanceSuccess(totalAccountsBalance))
      })
      .catch(err => dispatch(homeActions.loadTotalAccountsBalanceFailure(err)))
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

export {
  fetchTotalAccountsBalance,
  fetchAccounts,
  fetchPoolTransactions,
  fetchExits
}
