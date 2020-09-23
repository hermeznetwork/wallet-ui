import * as accountDetailsActionTypes from './account-details.actions'
import * as rollupApi from '../../apis/rollup'
import { HttpStatusCode } from '../../utils/http'
import { removePoolTransaction } from '../global/global.thunks'

/**
 * Fetches the account details for the specified account index
 * @param {string} accountIndex - The account index
 * @returns {void}
 */
function fetchAccount (accountIndex) {
  return (dispatch) => {
    dispatch(accountDetailsActionTypes.loadAccount())

    return rollupApi.getAccount(accountIndex)
      .then(res => dispatch(accountDetailsActionTypes.loadAccountSuccess(res)))
      .catch(err => dispatch(accountDetailsActionTypes.loadAccountFailure(err)))
  }
}

/**
 * Fetches the transaction details for each transaction in the pool for the specified account index
 * @param {string} accountIndex - The account index
 * @returns {void}
 */
function fetchPoolTransactions (accountIndex) {
  return (dispatch, getState) => {
    dispatch(accountDetailsActionTypes.loadPoolTransactions())

    const { global: { transactionPool }, account: { metaMaskWalletTask } } = getState()

    if (metaMaskWalletTask.status === 'successful') {
      const { hermezEthereumAddress } = metaMaskWalletTask.data
      const accountTransactionPool = transactionPool[hermezEthereumAddress]

      if (accountTransactionPool === undefined) {
        return dispatch(accountDetailsActionTypes.loadPoolTransactionsSuccess([]))
      }

      const accountTransactionsPromises = accountTransactionPool
        .filter(transaction => transaction.fromAccountIndex === accountIndex)
        .map(({ id: transactionId }) =>
          rollupApi
            .getPoolTransaction(transactionId)
            .catch(err => {
              if (err.response.status === HttpStatusCode.NOT_FOUND) {
                dispatch(removePoolTransaction(hermezEthereumAddress, transactionId))
              }
            })
        )

      return Promise.all(accountTransactionsPromises)
        .then((transactions) => {
          const successfulTransactions = transactions.filter(transaction => transaction !== undefined)

          dispatch(accountDetailsActionTypes.loadPoolTransactionsSuccess(successfulTransactions))
        })
        .catch(err => dispatch(accountDetailsActionTypes.loadPoolTransactionsFailure(err)))
    } else {
      dispatch(accountDetailsActionTypes.loadPoolTransactionsFailure('MetaMask wallet is not available'))
    }
  }
}

/**
 * Fetches the transactions details for the specified account index
 * @param {string} accountIndex - The account index
 * @returns {void}
 */
function fetchHistoryTransactions (accountIndex) {
  return (dispatch) => {
    dispatch(accountDetailsActionTypes.loadHistoryTransactions())

    return rollupApi.getTransactions(accountIndex)
      .then(res => dispatch(accountDetailsActionTypes.loadHistoryTransactionsSuccess(res)))
      .catch(err => dispatch(accountDetailsActionTypes.loadHistoryTransactionsFailure(err)))
  }
}

export { fetchAccount, fetchPoolTransactions, fetchHistoryTransactions }
