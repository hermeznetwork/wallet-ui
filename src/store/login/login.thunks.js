import * as globalActions from '../global/global.actions'
import * as loginActions from './login.actions'

function showLoadWalletError (errorMessage) {
  return (dispatch) => {
    dispatch(globalActions.openSnackbar(errorMessage))
    dispatch(loginActions.goToPreviousStep())
  }
}

export {
  showLoadWalletError
}
