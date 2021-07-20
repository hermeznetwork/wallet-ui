import { CoordinatorAPI } from '@hermeznetwork/hermezjs'

import * as tokenSwapActions from './token-swap.actions'
import { getAccountBalance } from '../../utils/accounts'
import {
  getFixedTokenAmount,
  getTokenAmountInPreferredCurrency
} from '../../utils/currencies'

/**
 * Fetches the accounts for a Hermez address
 * @param {Number} fromItem - id of the first account to be returned from the API
 * @returns {void}
 */
function fetchAccounts (fromItem) {
  return (dispatch, getState) => {
    const {
      global: {
        wallet: { publicKeyBase64: hermezAddress },
        fiatExchangeRatesTask: { data: fiatExchangeRates }
      },
      myAccount: { preferredCurrency }
    } = getState()

    return CoordinatorAPI.getAccounts(
      hermezAddress,
      undefined,
      fromItem,
      undefined
    )
      .then(res => {
        console.log(res)
        const accounts = res.accounts.map(account => {
          console.log(account)
          const accountBalance = getAccountBalance(account)

          const fixedTokenAmount = getFixedTokenAmount(
            accountBalance,
            account.token.decimals
          )

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
      .then(res => dispatch(tokenSwapActions.loadAccountsSuccess(res)))
      .catch(err => {
        console.log(err)
        return dispatch(tokenSwapActions.loadAccountsFailure(err))
      })
  }
}

export { fetchAccounts }
