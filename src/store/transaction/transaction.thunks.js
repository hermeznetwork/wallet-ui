import { CoordinatorAPI, Tx, HermezCompressedAmount } from '@hermeznetwork/hermezjs'
import { TxType, TxState } from '@hermeznetwork/hermezjs/src/enums'
import { getPoolTransactions } from '@hermeznetwork/hermezjs/src/tx-pool'

import * as transactionActions from './transaction.actions'
import * as globalThunks from '../global/global.thunks'
import * as ethereum from '../../utils/ethereum'
import { getAccountBalance } from '../../utils/accounts'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../utils/currencies'

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

    return CoordinatorAPI.getTokens(undefined, undefined, undefined, undefined, 2049)
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
function fetchHermezAccount (accountIndex, poolTransactions, pendingDeposits, pendingWithdraws, fiatExchangeRates, preferredCurrency) {
  return (dispatch, getState) => {
    const { global: { wallet } } = getState()

    dispatch(transactionActions.loadAccount())

    if (!wallet) {
      return dispatch(transactionActions.loadAccountFailure('MetaMask wallet is not loaded'))
    }

    return CoordinatorAPI.getAccount(accountIndex)
      .then((account) => {
        const accountBalance = getAccountBalance(account, poolTransactions, pendingDeposits, pendingWithdraws)
        const fixedTokenAmount = getFixedTokenAmount(accountBalance, account.token.decimals)
        const fiatBalance = getTokenAmountInPreferredCurrency(
          fixedTokenAmount,
          account.token.USD,
          preferredCurrency,
          fiatExchangeRates
        )

        return { ...account, balance: accountBalance, fiatBalance }
      })
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
 * Fetches the transactions which are in the transactions pool
 * @returns {void}
 */
function fetchPoolTransactions () {
  return (dispatch, getState) => {
    dispatch(transactionActions.loadPoolTransactions())

    const { global: { wallet } } = getState()

    getPoolTransactions(null, wallet.publicKeyCompressedHex)
      .then((transactions) => dispatch(transactionActions.loadPoolTransactionsSuccess(transactions)))
      .catch(err => dispatch(transactionActions.loadPoolTransactionsFailure(err)))
  }
}

/**
 * Fetches the accounts to use in the transaction. If the transaction is a deposit it will
 * look for them on MetaMask, otherwise it will look for them on the rollup api
 * @param {string} transactionType - Transaction type
 * @param {number} fromItem - id of the first account to be returned from the api
 * @returns {void}
 */
function fetchAccounts (transactionType, fromItem, poolTransactions, pendingDeposits, pendingWithdraws, fiatExchangeRates, preferredCurrency) {
  return (dispatch, getState) => {
    const { global: { wallet } } = getState()

    dispatch(transactionActions.loadAccounts())

    if (transactionType === TxType.Deposit) {
      return CoordinatorAPI.getTokens(undefined, undefined, undefined, undefined, 2049)
        .then((res) => {
          ethereum.getTokens(wallet, res.tokens)
            .then((tokens) => {
              return tokens.map((token) => {
                const tokenBalance = token.balance.toString()
                const fixedTokenAmount = getFixedTokenAmount(tokenBalance, token.token.decimals)
                const fiatTokenBalance = getTokenAmountInPreferredCurrency(
                  fixedTokenAmount,
                  token.token.USD,
                  preferredCurrency,
                  fiatExchangeRates
                )

                return { ...token, balance: tokenBalance, fiatBalance: fiatTokenBalance }
              })
            })
            .then(metaMaskTokens => dispatch(transactionActions.loadAccountsSuccess(transactionType, metaMaskTokens)))
            .catch(console.log)
        })
    } else {
      return CoordinatorAPI.getAccounts(wallet.hermezEthereumAddress, undefined, fromItem)
        .then((res) => {
          const accounts = res.accounts.map((account) => {
            const accountBalance = getAccountBalance(account, poolTransactions, pendingDeposits, pendingWithdraws)
            const fixedTokenAmount = getFixedTokenAmount(accountBalance, account.token.decimals)
            const fiatBalance = getTokenAmountInPreferredCurrency(
              fixedTokenAmount,
              account.token.USD,
              preferredCurrency,
              fiatExchangeRates
            )

            return { ...account, balance: accountBalance, fiatBalance }
          })

          return { ...res, accounts }
        })
        .then(res => dispatch(transactionActions.loadAccountsSuccess(transactionType, res)))
        .catch(err => dispatch(transactionActions.loadAccountsFailure(err)))
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
      HermezCompressedAmount.compressAmount(amount),
      wallet.hermezEthereumAddress,
      account.token,
      wallet.publicKeyCompressedHex,
      signer
    )
      .then((txData) => {
        CoordinatorAPI.getAccounts(wallet.hermezEthereumAddress, [account.token.id])
          .then((res) => {
            dispatch(globalThunks.addPendingDeposit({
              hash: txData.hash,
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
          dispatch(globalThunks.addPendingWithdraw({
            hermezEthereumAddress: wallet.hermezEthereumAddress,
            id: withdrawalId,
            amount,
            token: account.token
          }))
        } else {
          dispatch(globalThunks.addPendingDelayedWithdraw({
            id: withdrawalId,
            instant: false,
            date: Date.now(),
            amount,
            token: account.token
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
      HermezCompressedAmount.compressAmount(amount),
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
      amount: HermezCompressedAmount.compressAmount(amount),
      fee
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
      amount: HermezCompressedAmount.compressAmount(amount),
      fee
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
  fetchPoolTransactions,
  fetchAccounts,
  fetchFees,
  deposit,
  withdraw,
  forceExit,
  exit,
  transfer
}
