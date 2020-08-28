import * as transactionDetailsActionTypes from './transaction-details.actions'
import * as rollupApi from '../../apis/rollup'

function fetchTransaction (transactionId) {
  return (dispatch) => {
    dispatch(transactionDetailsActionTypes.loadTransaction())

    return rollupApi.getTransaction(transactionId)
      .then(res => dispatch(transactionDetailsActionTypes.loadTransactionSuccess(res)))
      .catch(err => dispatch(transactionDetailsActionTypes.loadTransactionFailure(err)))
  }
}

export { fetchTransaction }
