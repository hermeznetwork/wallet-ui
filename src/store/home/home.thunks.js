import * as homeActions from './home.actions'
import { CoordinatorAPI } from 'hermezjs'
import { getPoolTransactions } from 'hermezjs/src/tx-pool'

/**
 * Fetches the accounts for a Hermez Ethereum address
 * @param {string} hermezEthereumAddress - Hermez ethereum address
 * @param {number} fromItem - id of the first account to be returned from the API
 * @returns {void}
 */
function fetchAccounts (hermezEthereumAddress, fromItem) {
  return (dispatch) => {
    dispatch(homeActions.loadAccounts())

    return CoordinatorAPI.getAccounts(hermezEthereumAddress, fromItem)
      .then(res => dispatch(homeActions.loadAccountsSuccess(res)))
      .catch(err => dispatch(homeActions.loadAccountsFailure(err)))
  }
}

/**
 * Fetches the transactions which are in the transactions pool
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
 * Fetches the exit data for transactions of type Exit
 * @param {Object[]} exitTransactions - Transactions of type Exit
 * @returns {void}
 */
function fetchExits (exitTransactions) {
  return (dispatch) => {
    dispatch(homeActions.loadExits())

    return CoordinatorAPI.getExits(true)
      .then(exits => dispatch(homeActions.loadExitsSuccess(exits)))
      .catch(err => dispatch(homeActions.loadExitsFailure(err)))
  }
}

export {
  fetchAccounts,
  fetchPoolTransactions,
  fetchExits
}
