import { CoordinatorAPI, Tx } from '@hermeznetwork/hermezjs'
import { TxType, TxState } from '@hermeznetwork/hermezjs/src/tx-utils'

import * as transactionActions from './transaction.actions'
import * as globalThunks from '../global/global.thunks'
import * as ethereum from '../../utils/ethereum'

/**
 * Fetches the account details for a token id in MetaMask.
 * @param {string} tokenId - id of the token of the account
 * @returns {void}
 */
function fetchMetaMaskAccount (tokenId) {
  return (dispatch, getState) => {
    const { global: { wallet } } = getState()

    dispatch(transactionActions.loadAccount())

    if (!wallet) {
      return dispatch(transactionActions.loadAccountFailure('MetaMask wallet is not loaded'))
    }

    return CoordinatorAPI.getTokens(undefined, undefined, undefined, 2049)
      .then((res) => {
        ethereum.getTokens(wallet, res.tokens)
          .then(metaMaskTokens => {
            const account = metaMaskTokens.find((token) => token.token.id === tokenId)

            if (account) {
              dispatch(transactionActions.loadAccountSuccess(account))
            } else {
              dispatch(transactionActions.loadAccountFailure('Token not found'))
            }
          })
          .catch(error => dispatch(transactionActions.loadAccountFailure(error.message)))
      })
  }
}

/**
 * Fetches the account details for an accountIndex in the Hermez API.
 * @param {string} accountIndex - accountIndex of the account
 * @returns {void}
 */
function fetchHermezAccount (accountIndex) {
  return (dispatch, getState) => {
    const { global: { wallet } } = getState()

    dispatch(transactionActions.loadAccount())

    if (!wallet) {
      return dispatch(transactionActions.loadAccountFailure('MetaMask wallet is not loaded'))
    }

    return CoordinatorAPI.getAccount(accountIndex)
      .then((res) => dispatch(transactionActions.loadAccountSuccess(res)))
      .catch(error => dispatch(transactionActions.loadAccountFailure(error.message)))
  }
}

/**
 * Fetches the details of an exit
 * @param {string} accountIndex - account index
 * @param {number} batchNum - batch number
 * @returns {void}
 */
function fetchExit (accountIndex, batchNum) {
  return (dispatch, getState) => {
    const { global: { wallet } } = getState()

    if (!wallet) {
      return dispatch(transactionActions.loadExitFailure('MetaMask wallet is not loaded'))
    }

    dispatch(transactionActions.loadExit())

    Promise.all([
      CoordinatorAPI.getAccount(accountIndex),
      CoordinatorAPI.getExit(batchNum, accountIndex)
    ]).then(([account, exit]) => {
      dispatch(transactionActions.loadExitSuccess(account, exit, wallet.hermezEthereumAddress))
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
    if (transactionType === TxType.Deposit) {
      return CoordinatorAPI.getTokens(undefined, undefined, undefined, 2049)
        .then((res) => {
          ethereum.getTokens(wallet, res.tokens)
            .then(metaMaskTokens => dispatch(transactionActions.loadAccountsSuccess(transactionType, metaMaskTokens)))
            .catch(err => transactionActions.loadAccountsFailure(err.message))
        })
    } else {
      return CoordinatorAPI.getAccounts(wallet.hermezEthereumAddress, undefined, fromItem)
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
  return function (dispatch) {
    dispatch(transactionActions.loadFees())

    return CoordinatorAPI.getState()
      .then(res => dispatch(transactionActions.loadFeesSuccess(res.recommendedFee)))
      .catch(err => dispatch(transactionActions.loadFeesFailure(err)))
  }
}

function deposit (amount, account) {
  return (dispatch, getState) => {
    const { global: { wallet, signer } } = getState()

    dispatch(transactionActions.startTransactionSigning())

    return Tx.deposit(
      amount,
      wallet.hermezEthereumAddress,
      account.token,
      wallet.publicKeyCompressedHex,
      signer
    )
      .then((data) => {
        CoordinatorAPI.getAccounts(wallet.hermezEthereumAddress, [account.token.id])
          .then((res) => {
            dispatch(globalThunks.addPendingDeposit({
              id: data.hash,
              fromHezEthereumAddress: wallet.hermezEthereumAddress,
              toHezEthereumAddress: wallet.hermezEthereumAddress,
              token: account.token,
              amount: amount.toString(),
              state: TxState.Pending,
              timestamp: new Date().toISOString(),
              type: res.accounts.length ? TxType.Deposit : TxType.CreateAccountDeposit
            }))
            dispatch(transactionActions.goToFinishTransactionStep())
          })
      })
      .catch((error) => {
        dispatch(transactionActions.stopTransactionSigning())
        console.log(error)
      })
  }
}

function withdraw (amount, account, exit, completeDelayedWithdrawal, instantWithdrawal) {
  return (dispatch, getState) => {
    const { global: { wallet, signer } } = getState()
    const withdrawalId = account.accountIndex + exit.merkleProof.root

    dispatch(transactionActions.startTransactionSigning())

    // Differentiate between a withdraw on the Hermez SC and the DelayedWithdrawal SC
    if (!completeDelayedWithdrawal) {
      return Tx.withdraw(
        amount,
        account.accountIndex,
        account.token,
        wallet.publicKeyCompressedHex,
        exit.batchNum,
        exit.merkleProof.siblings,
        instantWithdrawal,
        signer
      ).then(() => {
        if (instantWithdrawal) {
          dispatch(globalThunks.addPendingWithdraw(wallet.hermezEthereumAddress, withdrawalId))
        } else {
          dispatch(globalThunks.addPendingDelayedWithdraw({
            id: withdrawalId,
            instant: false,
            date: Date.now()
          }))
        }

        dispatch(transactionActions.goToFinishTransactionStep())
      }).catch((error) => {
        dispatch(transactionActions.stopTransactionSigning())
        console.log(error)
      })
    } else {
      return Tx.delayedWithdraw(
        wallet.hermezEthereumAddress,
        account.token,
        signer
      )
        .then(() => {
          dispatch(globalThunks.removePendingDelayedWithdraw(withdrawalId))
          dispatch(transactionActions.goToFinishTransactionStep())
        })
        .catch((error) => {
          dispatch(transactionActions.stopTransactionSigning())
          console.log(error)
        })
    }
  }
}

function forceExit (amount, account) {
  return (dispatch, getState) => {
    const { global: { signer } } = getState()

    dispatch(transactionActions.startTransactionSigning())

    return Tx.forceExit(
      amount,
      account.accountIndex,
      account.token,
      signer
    )
      .then(() => dispatch(transactionActions.goToFinishTransactionStep()))
      .catch((error) => {
        dispatch(transactionActions.stopTransactionSigning())
        console.log(error)
      })
  }
}

function exit (amount, account, fee) {
  return (dispatch, getState) => {
    const { global: { wallet } } = getState()
    const txData = {
      type: TxType.Exit,
      from: account.accountIndex,
      amount,
      fee,
      nonce: account.nonce
    }

    return Tx.generateAndSendL2Tx(txData, wallet, account.token)
      .then(() => dispatch(transactionActions.goToFinishTransactionStep()))
      .catch(console.log)
  }
}

function transfer (amount, from, to, fee) {
  return (dispatch, getState) => {
    const { global: { wallet } } = getState()
    const txData = {
      type: TxType.Transfer,
      from: from.accountIndex,
      to: to.accountIndex || to.hezEthereumAddress,
      amount,
      fee,
      nonce: from.nonce
    }

    return Tx.generateAndSendL2Tx(txData, wallet, from.token)
      .then(() => dispatch(transactionActions.goToFinishTransactionStep()))
      .catch(console.log)
  }
}

export {
  fetchMetaMaskAccount,
  fetchHermezAccount,
  fetchExit,
  fetchAccounts,
  fetchFees,
  deposit,
  withdraw,
  forceExit,
  exit,
  transfer
}
