import * as globalActions from './global.actions'
import * as fiatExchangeRatesApi from '../../apis/fiat-exchange-rates'

function changeRedirectRoute (redirecRoute) {
  return (dispatch) => {
    dispatch(globalActions.changeRedirectRoute(redirecRoute))
  }
}

function fetchFiatExchangeRates (symbols) {
  return (dispatch) => {
    dispatch(globalActions.loadFiatExchangeRates())

    return fiatExchangeRatesApi.getFiatExchangeRates(symbols)
      .then(res => dispatch(globalActions.loadFiatExchangeRatesSuccess(res.rates)))
      .catch(err => dispatch(globalActions.loadFiatExchangeRatesFailure(err)))
  }
}

export {
  changeRedirectRoute,
  fetchFiatExchangeRates
}
