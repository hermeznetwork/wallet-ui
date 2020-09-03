import * as homeActions from './home.actions'
import * as rollupApi from '../../apis/rollup'
import * as priceUpdaterApi from '../../apis/price-updater'

function fetchAccounts (ethereumAddress) {
  return (dispatch) => {
    dispatch(homeActions.loadAccounts())

    return rollupApi.getAccounts(ethereumAddress)
      .then(res => dispatch(homeActions.loadAccountsSuccess(res)))
      .catch(err => dispatch(homeActions.loadAccountsFailure(err)))
  }
}

function fetchTokenPrices (tokens) {
  return (dispatch) => {
    dispatch(homeActions.loadTokensPrice())

    return priceUpdaterApi.getTokensPrice(tokens)
      .then(res => dispatch(homeActions.loadTokensPriceSuccess(res)))
      .catch(err => dispatch(homeActions.loadTokensPriceFailure(err)))
  }
}

export { fetchAccounts, fetchTokenPrices }
