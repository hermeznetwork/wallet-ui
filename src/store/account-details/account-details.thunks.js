import * as accountDetailsActionTypes from './account-details.actions'
import * as rollupApi from '../../apis/rollup'

function fetchAccount (ethereumAddress, tokenId) {
  return (dispatch) => {
    dispatch(accountDetailsActionTypes.loadAccount())

    return rollupApi.getAccount(ethereumAddress, tokenId)
      .then(res => dispatch(accountDetailsActionTypes.loadAccountSuccess(res)))
      .catch(err => dispatch(accountDetailsActionTypes.loadAccountFailure(err)))
  }
}

function fetchTransactions (ethereumAddress, tokenId) {
  return (dispatch) => {
    dispatch(accountDetailsActionTypes.loadTransactions())

    return rollupApi.getTransactions(ethereumAddress, tokenId)
      .then(res => dispatch(accountDetailsActionTypes.loadTransactionsSuccess(res)))
      .catch(err => dispatch(accountDetailsActionTypes.loadTransactionsFailure(err)))
  }
}

export { fetchAccount, fetchTransactions }
