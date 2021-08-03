import { CoordinatorAPI } from '@hermeznetwork/hermezjs'

import * as tokenSwapActions from './token-swap.actions'
import * as tokenSwapApi from '../../apis/token-swap'
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
        const accounts = res.accounts.map(account => {
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
        return dispatch(tokenSwapActions.loadAccountsFailure(err))
      })
  }
}

/**
 * Get Quotes for a token swap between pairs
 * @param {Object} data
 * @param {String} data.fromToken - contract address from Token that user wants to swap
 * @param {String} data.toToken - contract addres from Token that user wants to receive
 * @param {String} data.fromHezAddr - address with tokens to swap
 * @param {String} [data.amountFromToken] - amount that user wants to swap
 * @param {String} [data.amountToToken] - amount that user wants to receive
 * @returns {void}
 */
function getQuotes (data) {
  return (dispatch, getState) => {
    dispatch(tokenSwapActions.getQuotes())
    tokenSwapApi.getQuotes(data)
      .then(res => {
        const quotes = res.map(quote => ({
          ...quote,
          rate: quote.amountToToken / quote.amountFromToken
        }))
        dispatch(tokenSwapActions.getQuotesSuccess(quotes))
      })
      .catch(e => {
        dispatch(tokenSwapActions.getQuoteFailure(e))
      })
  }
}

export { fetchAccounts, getQuotes }
