import { loadCoinsBalance, loadCoinsBalanceSuccess, loadCoinsBalanceFailure } from './home.actions'
import { getCoinsBalance } from '../../apis/rollup'

function fetchCoinsBalance (ethereumAddress) {
  return (dispatch) => {
    dispatch(loadCoinsBalance())

    return getCoinsBalance(ethereumAddress)
      .then(res => dispatch(loadCoinsBalanceSuccess(res)))
      .catch(err => dispatch(loadCoinsBalanceFailure(err)))
  }
}

export { fetchCoinsBalance }
