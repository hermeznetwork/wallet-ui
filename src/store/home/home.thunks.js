import { loadAccounts, loadAccountsSuccess, loadAccountsFailure } from './home.actions'
import { getAccounts } from '../../apis/rollup'

function fetchAccounts (ethereumAddress) {
  return (dispatch) => {
    dispatch(loadAccounts())

    return getAccounts(ethereumAddress)
      .then(res => dispatch(loadAccountsSuccess(res)))
      .catch(err => dispatch(loadAccountsFailure(err)))
  }
}

export { fetchAccounts }
