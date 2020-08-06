import * as homeActions from './home.actions'
import * as rollupApi from '../../apis/rollup'

function fetchAccounts (ethereumAddress) {
  return (dispatch) => {
    dispatch(homeActions.loadAccounts())

    return rollupApi.getAccounts(ethereumAddress)
      .then(res => dispatch(homeActions.loadAccountsSuccess(res)))
      .catch(err => dispatch(homeActions.loadAccountsFailure(err)))
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

export { fetchAccounts, fetchRecentTransactions }
