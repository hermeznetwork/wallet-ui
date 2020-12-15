import { CoordinatorAPI } from 'hermezjs'

import * as transactionActions from './transaction.actions'
import { TransactionType } from '../../views/transaction/transaction.view'
import { getMetaMaskTokens } from '../../utils/metamask'

/**
 * Fetches the account details for a token id. If the transaction is a deposit, it will
 * look for the account details in MetaMask. Otherwise, it will look for the details
 * in the API
 * @param {string} tokenId - id of the token of the account
 * @param {string} transactionType - Transaction type
 * @returns {void}
 */
function fetchAccount (tokenId, transactionType) {
  return (dispatch, getState) => {
    const { global: { wallet } } = getState()

    dispatch(transactionActions.loadAccount())

    if (!wallet) {
      return dispatch(transactionActions.loadAccountFailure('MetaMask wallet is not loaded'))
    }

    if (transactionType === TransactionType.Deposit) {
      return CoordinatorAPI.getTokens()
        .then((hermezTokens) => {
          getMetaMaskTokens(wallet, hermezTokens)
            .then(metaMaskTokens => {
              const account = metaMaskTokens.find((account) => account.id === tokenId)

              dispatch(transactionActions.loadAccountSuccess(account))
            })
            .catch(error => dispatch(transactionActions.loadAccountFailure(error.message)))
        })
    } else {
      return CoordinatorAPI.getAccounts(
        wallet.hermezEthereumAddress,
        [tokenId]
      )
        .then((res) => dispatch(transactionActions.loadAccountSuccess(res.accounts[0])))
        .catch(error => dispatch(transactionActions.loadAccountFailure(error.message)))
    }
  }
}

/**
 * Fetches the details of an exit
 * @param {number} tokenId - id of the token of the account
 * @param {number} batchNum - batch number
 * @param {string} accountIndex - account index
 * @returns {void}
 */
function fetchExit (tokenId, batchNum, accountIndex) {
  return async function (dispatch, getState) {
    const { global: { wallet } } = getState()

    if (!wallet) {
      return dispatch(transactionActions.loadExitFailure('MetaMask wallet is not loaded'))
    }

    dispatch(transactionActions.loadExit())

    Promise.all([
      CoordinatorAPI.getAccounts(wallet.hermezEthereumAddress, [tokenId]),
      CoordinatorAPI.getExit(batchNum, accountIndex)
    ]).then(([accountsRes, exit]) => {
      dispatch(transactionActions.loadExitSuccess(accountsRes.accounts[0], exit, wallet.hermezEthereumAddress))
    }).catch(err => dispatch(transactionActions.loadExitFailure(err.message)))
  }
}

/**
 * Fetches the accounts to use in the transaction. If the transaction is a deposit it will
 * look for them on MetaMask, otherwise it will look for them on the rollup api
 * @param {string} transactionType - Transaction type
 * @param {number} fromItem - id of the first account to be returned from the api
 * @returns {void}
 */
function fetchAccounts (transactionType, fromItem) {
  return (dispatch, getState) => {
    const { global: { wallet } } = getState()

    dispatch(transactionActions.loadAccounts())

    if (!wallet) {
      return dispatch(transactionActions.loadAccountsFailure('MetaMask wallet is not loaded'))
    }

    // TODO: Remove the ForceExit from the if when the Hermez node is ready
    if (transactionType === TransactionType.Deposit || transactionType === TransactionType.ForceExit) {
      return CoordinatorAPI.getTokens()
        .then((res) => {
          getMetaMaskTokens(wallet, res.tokens)
            .then(metaMaskTokens => dispatch(transactionActions.loadAccountsSuccess(transactionType, metaMaskTokens)))
            .catch(err => transactionActions.loadAccountsFailure(err.message))
        })
    } else {
      return CoordinatorAPI.getAccounts(wallet.hermezEthereumAddress, fromItem)
        .then(res => dispatch(transactionActions.loadAccountsSuccess(transactionType, res)))
        .catch(err => transactionActions.loadAccountsFailure(err.message))
    }
  }
}

/**
 * Fetches the recommended fees from the Coordinator
 * @returns {void}
 */
function fetchFees () {
  return async function (dispatch) {
    dispatch(transactionActions.loadFees())

    return CoordinatorAPI.getState()
      .then(res => dispatch(transactionActions.loadFeesSuccess(res.recommendedFee)))
      .catch(err => dispatch(transactionActions.loadFeesFailure(err)))
  }
}

export {
  fetchAccount,
  fetchExit,
  fetchAccounts,
  fetchFees
}
