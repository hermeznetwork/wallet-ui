import * as transactionDetailsActionTypes from './transaction-details.actions'
import { CoordinatorAPI } from '@hermeznetwork/hermezjs'
import { HttpStatusCode } from '@hermeznetwork/hermezjs/src/http'

/**
 * Fetches the details of a transaction
 * @param {string} transactionId - Transaction id
 */
function fetchTransaction (transactionId) {
  return (dispatch) => {
    dispatch(transactionDetailsActionTypes.loadTransaction())

    return CoordinatorAPI.getPoolTransaction(transactionId)
      .then(res => dispatch(transactionDetailsActionTypes.loadTransactionSuccess(res)))
      .catch(err => {
        if (err.response.status === HttpStatusCode.NOT_FOUND) {
          return CoordinatorAPI.getHistoryTransaction(transactionId)
            .then(res => dispatch(transactionDetailsActionTypes.loadTransactionSuccess(res)))
            .catch(() => dispatch(transactionDetailsActionTypes.loadTransactionFailure()))
        } else {
          dispatch(transactionDetailsActionTypes.loadTransactionFailure())
        }
      })
  }
}

export { fetchTransaction }
