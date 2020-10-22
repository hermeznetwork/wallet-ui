import * as homeActions from './home.actions'
import * as rollupApi from '../../apis/rollup'
import { getPoolTransactions } from '../../utils/tx-pool'

function fetchAccounts (hermezEthereumAddress) {
  return (dispatch) => {
    dispatch(homeActions.loadAccounts())

    return rollupApi.getAccounts(hermezEthereumAddress)
      .then(res => dispatch(homeActions.loadAccountsSuccess(res)))
      .catch(err => dispatch(homeActions.loadAccountsFailure(err)))
  }
}

/**
 * Fetches the transaction details for each transaction in the pool
 *
 * @returns {void}
 */
function fetchPoolTransactions () {
  return (dispatch, getState) => {
    dispatch(homeActions.loadPoolTransactions())

    const { global: { metaMaskWalletTask } } = getState()

    if (metaMaskWalletTask.status === 'successful') {
      const { publicKeyCompressedHex } = metaMaskWalletTask.data
      getPoolTransactions(null, publicKeyCompressedHex)
        .then((transactions) => dispatch(homeActions.loadPoolTransactionsSuccess(transactions)))
        .catch(err => dispatch(homeActions.loadPoolTransactionsFailure(err)))
    } else {
      dispatch(homeActions.loadPoolTransactionsFailure('MetaMask wallet is not available'))
    }
  }
}

/**
 * Fetches the transactions details
 * @returns {void}
 */
function fetchHistoryTransactions () {
  return (dispatch) => {
    dispatch(homeActions.loadHistoryTransactions())

    return rollupApi.getTransactions()
      .then(res => dispatch(homeActions.loadHistoryTransactionsSuccess(res)))
      .catch(err => dispatch(homeActions.loadHistoryTransactionsFailure(err)))
  }
}

/**
 * Fetches the exit data for transactions of type Exit
 *
 * @param {Array} exitTransactions - Array of transactions of type Exit
 */
function fetchExits (exitTransactions) {
  return (dispatch) => {
    dispatch(homeActions.loadExits())

    const exitTransactionsPromises = exitTransactions.map(exitTransaction => rollupApi.getExit(exitTransaction.batchNum, exitTransaction.fromAccountIndex))

    return Promise.all(exitTransactionsPromises)
      .then((exits) => {
        // TODO: Remove once we have hermez-node
        // const pendingWithdraws = exits.filter(exit => !exit.instantWithdrawn)
        dispatch(homeActions.loadExitsSuccess(exits))
      })
      .catch(err => dispatch(homeActions.loadExitsFailure(err)))
  }
}

export {
  fetchAccounts,
  fetchPoolTransactions,
  fetchHistoryTransactions,
  fetchExits
}
