import * as homeActions from './home.actions'
import * as rollupApi from '../../apis/rollup'

function fetchCoinsBalance (ethereumAddress) {
  return (dispatch) => {
    dispatch(homeActions.loadCoinsBalance())

    return rollupApi.getCoinsBalance(ethereumAddress)
      .then(res => dispatch(homeActions.loadCoinsBalanceSuccess(res)))
      .catch(err => dispatch(homeActions.loadCoinsBalanceFailure(err)))
  }
}

function fetchRecentTransactions (ethereumAddress) {
  return (dispatch) => {
    dispatch(homeActions.loadRecentTransactions())

    return rollupApi.getTransactions(ethereumAddress)
      .then(res => dispatch(homeActions.loadRecentTransactionsSuccess(res)))
      .catch(err => dispatch(homeActions.loadRecentTransactionsFailure(err)))
  }
}

export { fetchCoinsBalance, fetchRecentTransactions }
