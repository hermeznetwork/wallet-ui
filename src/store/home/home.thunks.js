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

export { fetchAccounts }
