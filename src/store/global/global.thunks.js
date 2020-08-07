import * as globalActions from './global.actions'
import * as rollupApi from '../../apis/rollup'

function fetchTokens () {
  return (dispatch) => {
    dispatch(globalActions.loadTokens())

    return rollupApi.getTokens()
      .then(res => dispatch(globalActions.loadTokensSuccess(res)))
      .catch(err => dispatch(globalActions.loadTokensFailure(err)))
  }
}

export { fetchTokens }
