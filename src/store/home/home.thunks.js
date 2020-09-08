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

export { fetchAccounts }
