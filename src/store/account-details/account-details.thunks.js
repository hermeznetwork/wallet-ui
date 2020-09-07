import * as accountDetailsActionTypes from './account-details.actions'
import * as rollupApi from '../../apis/rollup'
import * as priceUpdaterApi from '../../apis/price-updater'

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

function fetchTokenPrice (token) {
  return (dispatch) => {
    dispatch(accountDetailsActionTypes.loadTokenPrice())

    return priceUpdaterApi.getTokensPrice([token])
      .then(res => dispatch(accountDetailsActionTypes.loadTokenPriceSuccess(res)))
      .catch(err => dispatch(accountDetailsActionTypes.loadTokenPriceFailure(err)))
  }
}

export { fetchAccount, fetchTransactions, fetchTokenPrice }
