import { CoordinatorAPI, Tx, TxFees, HermezCompressedAmount } from '@hermeznetwork/hermezjs'
import { TxType, TxState } from '@hermeznetwork/hermezjs/src/enums'
import { getPoolTransactions } from '@hermeznetwork/hermezjs/src/tx-pool'
import * as ethers from 'ethers'

import * as transactionActions from './transaction.actions'
import * as globalThunks from '../global/global.thunks'
import * as ethereum from '../../utils/ethereum'
import { getAccountBalance } from '../../utils/accounts'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../utils/currencies'
import { getProvider } from '@hermeznetwork/hermezjs/src/providers'
import { ETHER_TOKEN_ID } from '@hermeznetwork/hermezjs/src/constants'
import { getEthereumAddress } from '@hermeznetwork/hermezjs/src/addresses'

/**
 * Fetches the account details for a token id in an Ethereum wallet.
 * @param {string} tokenId - id of the token of the account
 * @returns {void}
 */
function fetchEthereumAccount (tokenId) {
  return (dispatch, getState) => {
    const { global: { wallet } } = getState()

    dispatch(transactionActions.loadAccount())

    if (!wallet) {
      return dispatch(transactionActions.loadAccountFailure('Ethereum wallet is not loaded'))
    }

    return CoordinatorAPI.getTokens(undefined, undefined, undefined, undefined, 2049)
      .then((res) => {
        ethereum.getTokens(wallet, res.tokens)
          .then(ethereumTokens => {
            const account = ethereumTokens.find((token) => token.token.id === tokenId)

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
function fetchHermezAccount (accountIndex, poolTransactions, pendingDeposits, fiatExchangeRates, preferredCurrency) {
  return (dispatch, getState) => {
    const { global: { wallet } } = getState()

    dispatch(transactionActions.loadAccount())

    if (!wallet) {
      return dispatch(transactionActions.loadAccountFailure('Ethereum wallet is not loaded'))
    }

    return CoordinatorAPI.getAccount(accountIndex)
      .then((account) => {
        const accountBalance = getAccountBalance(account, poolTransactions, pendingDeposits)
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
 * @param {Number} batchNum - batch number
 * @returns {void}
 */
function fetchExit (accountIndex, batchNum) {
  return (dispatch, getState) => {
    const { global: { wallet } } = getState()

    if (!wallet) {
      return dispatch(transactionActions.loadExitFailure('Ethereum wallet is not loaded'))
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
 * look for them on Ethereum, otherwise it will look for them on the rollup api
 * @param {string} transactionType - Transaction type
 * @param {Number} fromItem - id of the first account to be returned from the api
 * @returns {void}
 */
function fetchAccounts (transactionType, fromItem, poolTransactions, pendingDeposits, fiatExchangeRates, preferredCurrency) {
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
            .catch(err => dispatch(transactionActions.loadAccountsFailure(err)))
        })
    } else {
      return CoordinatorAPI.getAccounts(wallet.hermezEthereumAddress, undefined, fromItem)
        .then((res) => {
          const accounts = res.accounts.map((account) => {
            const accountBalance = getAccountBalance(account, poolTransactions, pendingDeposits)
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

function fetchAccountBalance () {
  return async (dispatch, getState) => {
    const { global: { wallet } } = getState()

    dispatch(transactionActions.loadAccountBalance())

    const ethereumAddress = getEthereumAddress(wallet.hermezEthereumAddress)
    const provider = getProvider()

    return provider.getBalance(ethereumAddress)
      .then((balance) => dispatch(transactionActions.loadAccountBalanceSuccess(ethers.utils.formatUnits(balance))))
      .catch((err) => dispatch(transactionActions.loadAccountBalanceFailure(err)))
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

function fetchEstimatedWithdrawFee (token, amount) {
  return async (dispatch, getState) => {
    dispatch(transactionActions.loadEstimatedWithdrawFee())

    try {
      const { global: { signer } } = getState()
      const provider = getProvider()
      const gasPrice = await provider.getGasPrice()
      const estimatedMerkleSiblingsLength = 4
      const overrides = { gasPrice }
      const gasLimit = await TxFees.estimateWithdrawGasLimit(token, estimatedMerkleSiblingsLength, amount, overrides, signer)
      const feeBigInt = BigInt(gasLimit) * BigInt(gasPrice)
      const ethToken = await CoordinatorAPI.getToken(ETHER_TOKEN_ID)
      const feeUSD = Number(ethers.utils.formatEther(feeBigInt)) * ethToken.USD

      dispatch(transactionActions.loadEstimatedWithdrawFeeSuccess({ amount: feeBigInt.toString(), USD: feeUSD }))
    } catch (err) {
      dispatch(transactionActions.loadEstimatedWithdrawFeeFailure(err))
    }
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
              account: res.accounts.length && res.accounts[0],
              type: res.accounts.length ? TxType.Deposit : TxType.CreateAccountDeposit
            }))
            dispatch(transactionActions.goToFinishTransactionStep())
          })
      })
      .catch((error) => {
        console.error(error)
        dispatch(transactionActions.stopTransactionSigning())
        // 4001 error code means that user denied tx signature
        if (error.code !== 4001) {
          dispatch(transactionActions.goToTransactionErrorStep())
        }
      })
  }
}

function withdraw (amount, account, exit, completeDelayedWithdrawal, instantWithdrawal) {
  return (dispatch, getState) => {
    const { global: { wallet, signer } } = getState()
    const withdrawalId = account.accountIndex + exit.batchNum

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
      ).then((txData) => {
        if (instantWithdrawal) {
          dispatch(globalThunks.addPendingWithdraw({
            hash: txData.hash,
            hermezEthereumAddress: wallet.hermezEthereumAddress,
            id: withdrawalId,
            accountIndex: account.accountIndex,
            batchNum: exit.batchNum,
            amount,
            token: account.token,
            timestamp: new Date().toISOString()
          }))
        } else {
          dispatch(globalThunks.addPendingDelayedWithdraw({
            hash: txData.hash,
            id: withdrawalId,
            instant: false,
            amount,
            token: account.token,
            timestamp: new Date().toISOString()
          }))
        }

        dispatch(transactionActions.goToFinishTransactionStep())
      }).catch((error) => {
        console.error(error)
        dispatch(transactionActions.stopTransactionSigning())
        // 4001 error code means that user denied tx signature
        if (error.code !== 4001) {
          dispatch(transactionActions.goToTransactionErrorStep())
        }
      })
    } else {
      return Tx.delayedWithdraw(
        wallet.hermezEthereumAddress,
        account.token,
        signer
      )
        .then(() => {
          dispatch(globalThunks.addPendingWithdraw({
            hermezEthereumAddress: wallet.hermezEthereumAddress,
            id: withdrawalId,
            accountIndex: account.accountIndex,
            batchNum: exit.batchNum,
            amount,
            token: account.token
          }))
          dispatch(transactionActions.goToFinishTransactionStep())
        })
        .catch((error) => {
          console.error(error)
          dispatch(transactionActions.stopTransactionSigning())
          // 4001 error code means that user denied tx signature
          if (error.code !== 4001) {
            dispatch(transactionActions.goToTransactionErrorStep())
          }
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
        console.error(error)
        dispatch(transactionActions.stopTransactionSigning())
        // 4001 error code means that user denied tx signature
        if (error.code !== 4001) {
          dispatch(transactionActions.goToTransactionErrorStep())
        }
      })
  }
}

function exit (amount, account, fee) {
  return (dispatch, getState) => {
    const { global: { wallet, nextForgers } } = getState()
    const txData = {
      type: TxType.Exit,
      from: account.accountIndex,
      amount: HermezCompressedAmount.compressAmount(amount),
      fee
    }

    return Tx.generateAndSendL2Tx(txData, wallet, account.token, nextForgers)
      .then(() => dispatch(transactionActions.goToFinishTransactionStep()))
      .catch((error) => {
        console.error(error)
        dispatch(transactionActions.stopTransactionSigning())
        dispatch(transactionActions.goToTransactionErrorStep())
      })
  }
}

function transfer (amount, from, to, fee) {
  return (dispatch, getState) => {
    const { global: { wallet, nextForgers } } = getState()

    const txData = {
      from: from.accountIndex,
      to: to.accountIndex || to.hezEthereumAddress || to.hezBjjAddress,
      amount: HermezCompressedAmount.compressAmount(amount),
      fee
    }

    return Tx.generateAndSendL2Tx(txData, wallet, from.token, nextForgers)
      .then(() => dispatch(transactionActions.goToFinishTransactionStep()))
      .catch((error) => {
        console.error(error)
        dispatch(transactionActions.stopTransactionSigning())
        dispatch(transactionActions.goToTransactionErrorStep())
      })
  }
}

export {
  fetchEthereumAccount,
  fetchHermezAccount,
  fetchExit,
  fetchPoolTransactions,
  fetchAccounts,
  fetchAccountBalance,
  fetchFees,
  fetchEstimatedWithdrawFee,
  deposit,
  withdraw,
  forceExit,
  exit,
  transfer
}
