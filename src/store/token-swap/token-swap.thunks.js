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
        fiatExchangeRatesTask: { data: fiatExchangeRates },
        pricesTask
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
          console.log(account)
          console.log(pricesTask.data)
          const accountPriceUpdated = {
            ...account,
            token: pricesTask.data.tokens[account.token.id]
          }
          const accountBalance = getAccountBalance(accountPriceUpdated)

          const fixedTokenAmount = getFixedTokenAmount(
            accountBalance,
            accountPriceUpdated.token.decimals
          )

          const fiatBalance = getTokenAmountInPreferredCurrency(
            fixedTokenAmount,
            accountPriceUpdated.token.USD,
            preferredCurrency,
            fiatExchangeRates
          )

          return {
            ...accountPriceUpdated,
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
        const { referenceId } = res
        const now = Date.now()
        const quotes = res.quotes.map(quote => ({
          ...quote,
          rate: quote.amountToToken / quote.amountFromToken,
          validUntil: new Date(now + quote.ttlMs)
        }))
        dispatch(tokenSwapActions.getQuotesSuccess({ referenceId, quotes }))
      })
      .catch(e => {
        dispatch(tokenSwapActions.getQuoteFailure(e))
      })
  }
}

export { fetchAccounts, getQuotes }
