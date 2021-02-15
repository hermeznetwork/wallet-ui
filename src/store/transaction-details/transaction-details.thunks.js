import { CoordinatorAPI } from '@hermeznetwork/hermezjs'
import { HttpStatusCode } from '@hermeznetwork/hermezjs/src/http'

import * as transactionDetailsActionTypes from './transaction-details.actions'

/**
 * Fetches the details of a transaction
 * @param {string} transactionIdOrHash - Transaction id or hash
 */
function fetchTransaction (transactionIdOrHash) {
  return (dispatch, getState) => {
    const { global: { wallet, pendingDeposits } } = getState()
    const accountPendingDeposits = pendingDeposits[wallet.hermezEthereumAddress]

    dispatch(transactionDetailsActionTypes.loadTransaction())

    if (accountPendingDeposits !== undefined) {
      const pendingDeposit = accountPendingDeposits
        .find(deposit => deposit.hash === transactionIdOrHash)

      if (pendingDeposit !== undefined) {
        console.log('pending deposit ok')
        console.log(pendingDeposit)
        return dispatch(transactionDetailsActionTypes.loadTransactionSuccess(pendingDeposit))
      }
    }

    return CoordinatorAPI.getPoolTransaction(transactionIdOrHash)
      .then(res => dispatch(transactionDetailsActionTypes.loadTransactionSuccess(res)))
      .catch(err => {
        if (err.response.status === HttpStatusCode.NOT_FOUND) {
          return CoordinatorAPI.getHistoryTransaction(transactionIdOrHash)
            .then(res => dispatch(transactionDetailsActionTypes.loadTransactionSuccess(res)))
            .catch(() => dispatch(transactionDetailsActionTypes.loadTransactionFailure()))
        } else {
          dispatch(transactionDetailsActionTypes.loadTransactionFailure())
        }
      })
  }
}

export { fetchTransaction }
