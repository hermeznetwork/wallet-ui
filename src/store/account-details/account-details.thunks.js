import * as accountDetailsActionTypes from './account-details.actions'
import * as rollupApi from '../../apis/rollup'
import { HttpStatusCode } from '../../utils/http'
import { removePoolTransaction } from '../global/global.thunks'

function fetchAccount (accountIndex) {
  return (dispatch) => {
    dispatch(accountDetailsActionTypes.loadAccount())

    return rollupApi.getAccount(accountIndex)
      .then(res => dispatch(accountDetailsActionTypes.loadAccountSuccess(res)))
      .catch(err => dispatch(accountDetailsActionTypes.loadAccountFailure(err)))
  }
}

function fetchPoolTransactions (accountIndex) {
  return (dispatch, getState) => {
    dispatch(accountDetailsActionTypes.loadPoolTransactions())

    const { global: { transactionPool } } = getState()
    const accountTransactionsPromises = transactionPool
      .filter(transaction => transaction.fromAccountIndex === accountIndex)
      .map(({ id: transactionId }) =>
        rollupApi
          .getPoolTransaction(transactionId)
          .catch(err => {
            console.log(err)
            if (err.response.status === HttpStatusCode.NOT_FOUND) {
              dispatch(removePoolTransaction(transactionId))
            }
          })
      )

    return Promise.all(accountTransactionsPromises)
      .then((transactions) => {
        console.log(transactions)
        const successfulTransactions = transactions.filter(transaction => transaction !== undefined)
        console.log(successfulTransactions)
        dispatch(accountDetailsActionTypes.loadPoolTransactionsSuccess(successfulTransactions))
      })
      .catch(err => dispatch(accountDetailsActionTypes.loadPoolTransactionsFailure(err)))
  }
}

function fetchHistoryTransactions (accountIndex) {
  return (dispatch) => {
    dispatch(accountDetailsActionTypes.loadHistoryTransactions())

    return rollupApi.getTransactions(accountIndex)
      .then(res => dispatch(accountDetailsActionTypes.loadHistoryTransactionsSuccess(res)))
      .catch(err => dispatch(accountDetailsActionTypes.loadHistoryTransactionsFailure(err)))
  }
}

export { fetchAccount, fetchPoolTransactions, fetchHistoryTransactions }
