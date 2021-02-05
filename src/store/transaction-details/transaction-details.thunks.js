import { CoordinatorAPI } from '@hermeznetwork/hermezjs'
import { HttpStatusCode } from '@hermeznetwork/hermezjs/src/http'

import * as transactionDetailsActionTypes from './transaction-details.actions'

/**
 * Fetches the details of a transaction
 * @param {string} transactionId - Transaction id
 */
function fetchTransaction (transactionId) {
  return (dispatch, getState) => {
    const { global: { wallet, pendingDeposits } } = getState()
    const accountPendingDeposits = pendingDeposits[wallet.hermezEthereumAddress]

    dispatch(transactionDetailsActionTypes.loadTransaction())

    if (accountPendingDeposits !== undefined) {
      const pendingDeposit = accountPendingDeposits
        .find(deposit => deposit.transactionHash === transactionId)

      if (pendingDeposit !== undefined) {
        return dispatch(transactionDetailsActionTypes.loadTransaction(pendingDeposit))
      }
    }

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
