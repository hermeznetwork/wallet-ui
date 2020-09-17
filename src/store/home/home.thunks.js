import * as homeActions from './home.actions'
import * as rollupApi from '../../apis/rollup'

function fetchAccounts (hermezEthereumAddress) {
  return (dispatch) => {
    dispatch(homeActions.loadAccounts())

    return rollupApi.getAccounts(hermezEthereumAddress)
      .then(res => dispatch(homeActions.loadAccountsSuccess(res)))
      .catch(err => dispatch(homeActions.loadAccountsFailure(err)))
  }
}

function fetchUSDTokenExchangeRates (tokenIds) {
  return (dispatch) => {
    dispatch(homeActions.loadUSDTokenExchangeRates())

    return rollupApi.getTokens(tokenIds)
      .then(res => {
        const usdTokenExchangeRates = res.tokens
          .reduce((exchangeRatesMap, token) => ({
            ...exchangeRatesMap,
            [token.symbol]: token.USD
          }), {})

        dispatch(homeActions.loadUSDTokenExchangeRatesSuccess(usdTokenExchangeRates))
      })
      .catch(err => dispatch(homeActions.loadUSDTokenExchangeRatesFailure(err)))
  }
}

export { fetchAccounts, fetchUSDTokenExchangeRates }
