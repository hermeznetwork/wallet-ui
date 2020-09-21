import * as transactionDetailsActionTypes from './transaction-details.actions'
import * as rollupApi from '../../apis/rollup'
import { HttpStatusCode } from '../../utils/http'

function fetchTransaction (transactionId) {
  return (dispatch) => {
    dispatch(transactionDetailsActionTypes.loadTransaction())

    return rollupApi.getPoolTransaction(transactionId)
      .then(res => dispatch(transactionDetailsActionTypes.loadTransactionSuccess(res)))
      .catch(err => {
        if (err.response.status === HttpStatusCode.NOT_FOUND) {
          return rollupApi.getHistoryTransaction(transactionId)
            .then(res => dispatch(transactionDetailsActionTypes.loadTransactionSuccess(res)))
            .catch(() => dispatch(transactionDetailsActionTypes.loadTransactionFailure()))
        } else {
          dispatch(transactionDetailsActionTypes.loadTransactionFailure())
        }
      })
  }
}

export { fetchTransaction }
