import hermezjs, { CoordinatorAPI, Providers, Tx, TxUtils, HermezCompressedAmount } from '@hermeznetwork/hermezjs'
import { push } from 'connected-react-router'
import { ethers } from 'ethers'
import HermezABI from '@hermeznetwork/hermezjs/src/abis/HermezABI'
import { TxType, TxState } from '@hermeznetwork/hermezjs/src/enums'

import * as globalActions from './global.actions'
import { LOAD_ETHEREUM_NETWORK_ERROR } from './global.reducer'
import * as fiatExchangeRatesApi from '../../apis/fiat-exchange-rates'
import * as storage from '../../utils/storage'
import * as constants from '../../constants'

/**
 * Sets the environment to use in hermezjs. If the chainId is supported will pick it up
 * a known environment and if not will use the one provided in the .env file
 */
function setHermezEnvironment () {
  return async (dispatch) => {
    dispatch(globalActions.loadEthereumNetwork())
    hermezjs.TxPool.initializeTransactionPool()

    if (!window.ethereum) {
      return dispatch(globalActions.loadEthereumNetworkFailure(LOAD_ETHEREUM_NETWORK_ERROR.METAMASK_NOT_INSTALLED))
    }

    hermezjs.Providers.getProvider().getNetwork()
      .then(({ chainId, name }) => {
        if (process.env.REACT_APP_ENV === 'production' && !hermezjs.Environment.isEnvironmentSupported(chainId)) {
          return dispatch(
            globalActions.loadEthereumNetworkFailure(LOAD_ETHEREUM_NETWORK_ERROR.CHAIN_ID_NOT_SUPPORTED)
          )
        }

        if (process.env.REACT_APP_ENV === 'production' && hermezjs.Environment.isEnvironmentSupported(chainId)) {
          hermezjs.Environment.setEnvironment(chainId)
        }

        if (process.env.REACT_APP_ENV === 'development') {
          hermezjs.Environment.setEnvironment({
            baseApiUrl: process.env.REACT_APP_HERMEZ_API_URL,
            contractAddresses: {
              [hermezjs.Constants.ContractNames.Hermez]:
                  process.env.REACT_APP_HERMEZ_CONTRACT_ADDRESS,
              [hermezjs.Constants.ContractNames.WithdrawalDelayer]:
                  process.env.REACT_APP_WITHDRAWAL_DELAYER_CONTRACT_ADDRESS
            },
            batchExplorerUrl: process.env.REACT_APP_BATCH_EXPLORER_URL,
            etherscanUrl: process.env.REACT_APP_ETHERSCAN_URL
          })
        }

        if (chainId === 1) {
          dispatch(globalActions.loadEthereumNetworkSuccess({ chainId, name: 'mainnet' }))
        } else if (chainId === 1337) {
          dispatch(globalActions.loadEthereumNetworkSuccess({ chainId, name: 'local' }))
        } else {
          dispatch(globalActions.loadEthereumNetworkSuccess({ chainId, name }))
        }
      })
      .catch((error) => globalActions.loadEthereumNetworkFailure(error.message))
  }
}

/**
 * Changes the route to which the user is going to be redirected to after a successful
 * login
 * @param {string} redirectRoute - Route to be redirected to
 * @returns {void}
 */
function changeRedirectRoute (redirectRoute) {
  return (dispatch) => {
    dispatch(globalActions.changeRedirectRoute(redirectRoute))
  }
}

/**
 * Fetches the USD exchange rates for the requested currency symbols
 * @param {string[]} symbols - ISO 4217 currency codes
 * @returns {void}
 */
function fetchFiatExchangeRates (symbols) {
  return (dispatch) => {
    dispatch(globalActions.loadFiatExchangeRates())

    return fiatExchangeRatesApi.getFiatExchangeRates(symbols)
      .then(res => dispatch(globalActions.loadFiatExchangeRatesSuccess(res.rates)))
      .catch(err => dispatch(globalActions.loadFiatExchangeRatesFailure(err)))
  }
}

/**
 * Changes the current network status of the application
 * @param {string} newNetworkStatus - Network status
 * @param {string} backgroundColor - Background color of the snackbar
 * @returns {void}
 */
function changeNetworkStatus (newNetworkStatus, backgroundColor) {
  return (dispatch, getState) => {
    const { global: { networkStatus: previousNetworkStatus } } = getState()

    if (previousNetworkStatus === 'online' && newNetworkStatus === 'offline') {
      dispatch(globalActions.openSnackbar('Connection lost'))
    }

    if (previousNetworkStatus === 'offline' && newNetworkStatus === 'online') {
      dispatch(globalActions.openSnackbar('Connection restored', backgroundColor))
    }

    dispatch(globalActions.changeNetworkStatus(newNetworkStatus))
  }
}

/**
 * Adds a pendingWithdraw to the pendingWithdraw pool
 * @param {string} hermezEthereumAddress - The account with which the pendingWithdraw was made
 * @param {string} pendingWithdraw - The pendingWithdraw to add to the pool
 * @returns {void}
 */
function addPendingWithdraw (pendingWithdraw) {
  return (dispatch, getState) => {
    const { global: { wallet, ethereumNetworkTask } } = getState()
    const { data: { chainId } } = ethereumNetworkTask
    const { hermezEthereumAddress } = wallet

    storage.addItem(constants.PENDING_WITHDRAWS_KEY, chainId, hermezEthereumAddress, pendingWithdraw)
    dispatch(globalActions.addPendingWithdraw(chainId, hermezEthereumAddress, pendingWithdraw))
  }
}

/**
 * Removes a pendingWithdraw from the pendingWithdraw pool
 * @param {string} hermezEthereumAddress - The account with which the pendingWithdraw was originally made
 * @param {string} pendingWithdrawId - The pendingWithdraw identifier to remove from the pool
 * @returns {void}
 */
function removePendingWithdraw (hermezEthereumAddress, pendingWithdrawId) {
  return (dispatch, getState) => {
    const { global: { wallet, ethereumNetworkTask } } = getState()
    const { data: { chainId } } = ethereumNetworkTask
    const { hermezEthereumAddress } = wallet

    storage.removeItem(constants.PENDING_WITHDRAWS_KEY, chainId, hermezEthereumAddress, pendingWithdrawId)
    dispatch(globalActions.removePendingWithdraw(hermezEthereumAddress, pendingWithdrawId))
  }
}

/**
 * Adds a pendingWithdraw to the pendingDelayedWithdraw store
 * @param {string} pendingDelayedWithdraw - The pendingDelayedWithdraw to add to the store
 * @returns {void}
 */
function addPendingDelayedWithdraw (pendingDelayedWithdraw) {
  return (dispatch, getState) => {
    const { global: { wallet, ethereumNetworkTask } } = getState()
    const { data: { chainId } } = ethereumNetworkTask
    const { hermezEthereumAddress } = wallet

    storage.addItem(constants.PENDING_DELAYED_WITHDRAWS_KEY, chainId, hermezEthereumAddress, pendingDelayedWithdraw)
    dispatch(globalActions.addPendingDelayedWithdraw(chainId, hermezEthereumAddress, pendingDelayedWithdraw))
  }
}

/**
 * Removes a pendingWithdraw from the pendingDelayedWithdraw store
 * @param {string} pendingDelayedWithdrawId - The pendingDelayedWithdraw identifier to remove from the store
 * @returns {void}
 */
function removePendingDelayedWithdraw (pendingDelayedWithdrawId) {
  return (dispatch, getState) => {
    const { global: { wallet, ethereumNetworkTask } } = getState()
    const { data: { chainId } } = ethereumNetworkTask
    const { hermezEthereumAddress } = wallet

    storage.removeItem(constants.PENDING_DELAYED_WITHDRAWS_KEY, chainId, hermezEthereumAddress, pendingDelayedWithdrawId)
    dispatch(globalActions.removePendingDelayedWithdraw(chainId, hermezEthereumAddress, pendingDelayedWithdrawId))
  }
}

/**
 * Updates the date in a delayed withdraw transaction
 * to the time when the transaction was mined
 * @param {String} transactionHash - The L1 transaction hash for a non-instant withdraw
 * @param {Number} pendingDelayedWithdrawDate - The date when the L1 transaction was mined
 */
function updatePendingDelayedWithdrawDate (transactionHash, pendingDelayedWithdrawDate) {
  return (dispatch, getState) => {
    const { global: { wallet, ethereumNetworkTask } } = getState()
    const { data: { chainId } } = ethereumNetworkTask
    const { hermezEthereumAddress } = wallet

    storage.updatePartialItemByCustomProp(
      constants.PENDING_DELAYED_WITHDRAWS_KEY,
      chainId,
      hermezEthereumAddress,
      { name: 'hash', value: transactionHash },
      { date: pendingDelayedWithdrawDate }
    )
    dispatch(globalActions.updatePendingDelayedWithdrawDate(chainId, hermezEthereumAddress, transactionHash, pendingDelayedWithdrawDate))
  }
}

function checkPendingDelayedWithdraw (exitId) {
  return (dispatch, getState) => {
    const { global: { wallet, pendingDelayedWithdraws, ethereumNetworkTask } } = getState()

    dispatch(globalActions.checkPendingDelayedWithdraw())
    const provider = Providers.getProvider()
    const accountPendingDelayedWithdraws = storage.getItemsByHermezAddress(
      pendingDelayedWithdraws,
      ethereumNetworkTask.data.chainId,
      wallet.hermezEthereumAddress
    )

    const pendingDelayedWithdraw = accountPendingDelayedWithdraws.find((delayedWithdraw) => delayedWithdraw.id === exitId)
    if (pendingDelayedWithdraw) {
      provider.getTransaction(pendingDelayedWithdraw.hash).then((transaction) => {
        provider.getBlock(transaction.blockNumber).then((block) => {
          // Converts timestamp from s to ms
          const newTimestamp = block.timestamp * 1000
          if (pendingDelayedWithdraw.date !== newTimestamp) {
            dispatch(updatePendingDelayedWithdrawDate(pendingDelayedWithdraw.hash, newTimestamp))
          }
          dispatch(globalActions.checkPendingDelayedWithdrawSuccess())
        })
      }).catch(console.log)
    } else {
      dispatch(globalActions.checkPendingDelayedWithdrawSuccess())
    }
  }
}

/**
 * Adds a pendingDeposit to the pendingDeposits store
 * @param {string} pendingDeposit - The pendingDeposit to add to the store
 * @returns {void}
 */
function addPendingDeposit (pendingDeposit) {
  return (dispatch, getState) => {
    const { global: { wallet, ethereumNetworkTask } } = getState()
    const { data: { chainId } } = ethereumNetworkTask
    const { hermezEthereumAddress } = wallet

    storage.addItem(constants.PENDING_DEPOSITS_KEY, chainId, hermezEthereumAddress, pendingDeposit)
    dispatch(globalActions.addPendingDeposit(chainId, hermezEthereumAddress, pendingDeposit))
  }
}

/**
 * Removes a pendingDeposit from the pendingDeposit store
 * @param {string} transactionId - The transaction identifier used to remove a pendingDeposit from the store
 * @returns {void}
 */
function removePendingDeposit (transactionId) {
  return (dispatch, getState) => {
    const { global: { wallet, ethereumNetworkTask } } = getState()
    const { data: { chainId } } = ethereumNetworkTask
    const { hermezEthereumAddress } = wallet

    storage.removeItem(constants.PENDING_DEPOSITS_KEY, chainId, hermezEthereumAddress, transactionId)
    dispatch(globalActions.removePendingDeposit(chainId, hermezEthereumAddress, transactionId))
  }
}

function updatePendingDepositId (transactionHash, transactionId) {
  return (dispatch, getState) => {
    const { global: { wallet, ethereumNetworkTask } } = getState()
    const { data: { chainId } } = ethereumNetworkTask
    const { hermezEthereumAddress } = wallet

    storage.updatePartialItemByCustomProp(
      constants.PENDING_DEPOSITS_KEY,
      chainId,
      hermezEthereumAddress,
      { name: 'hash', value: transactionHash },
      { id: transactionId }
    )
    dispatch(globalActions.updatePendingDepositId(chainId, hermezEthereumAddress, transactionHash, transactionId))
  }
}

function checkPendingDeposits () {
  return (dispatch, getState) => {
    const { global: { wallet, pendingDeposits, ethereumNetworkTask } } = getState()

    dispatch(globalActions.checkPendingDeposits())
    const provider = Providers.getProvider()
    const accountPendingDeposits = storage.getItemsByHermezAddress(
      pendingDeposits,
      ethereumNetworkTask.data.chainId,
      wallet.hermezEthereumAddress
    )
    const pendingDepositsHashes = accountPendingDeposits.map(deposit => deposit.hash)
    const pendingDepositsTxReceipts = pendingDepositsHashes.map(hash => provider.getTransactionReceipt(hash))

    Promise.all(pendingDepositsTxReceipts).then((txReceipts) => {
      const transactionHistoryPromises = txReceipts
        .filter(txReceipt => txReceipt && txReceipt.logs && txReceipt.logs.length > 0)
        .map((txReceipt) => {
          const hermezContractInterface = new ethers.utils.Interface(HermezABI)
          // Need to parse logs, but only events from the Hermez SC. Ignore errors when trying to parse others
          const parsedLogs = []
          for (const txReceiptLog of txReceipt.logs) {
            try {
              const parsedLog = hermezContractInterface.parseLog(txReceiptLog)
              parsedLogs.push(parsedLog)
            } catch (e) {}
          }
          const l1UserTxEvent = parsedLogs.find((event) => event.name === 'L1UserTxEvent')

          if (!l1UserTxEvent) {
            return Promise.resolve()
          }

          const txId = TxUtils.getL1UserTxId(l1UserTxEvent.args[0], l1UserTxEvent.args[1])
          const pendingDeposit = accountPendingDeposits.find(deposit => deposit.hash === txReceipt.transactionHash)

          if (pendingDeposit && !pendingDeposit.id) {
            dispatch(updatePendingDepositId(txReceipt.transactionHash, txId))
          }

          return CoordinatorAPI.getHistoryTransaction(txId)
        })

      Promise.all(transactionHistoryPromises)
        .then((results) => {
          results
            .filter(result => result !== undefined)
            .forEach((transaction) => {
              if (transaction.batchNum !== null) {
                dispatch(removePendingDeposit(transaction.id))
              }
            })
          dispatch(globalActions.checkPendingDepositsSuccess())
        })
        .catch(() => dispatch(globalActions.checkPendingDepositsSuccess()))
    })
  }
}

function checkPendingTransactions () {
  return (_, getState) => {
    const { global: { wallet, nextForgers } } = getState()

    hermezjs.TxPool.getPoolTransactions(undefined, wallet.publicKeyCompressedHex)
      .then((poolTransactions) => {
        const tenMinutesInMs = 10 * 60 * 1000
        const oneDayInMs = 24 * 60 * 60 * 1000
        const resendTransactionsRequests = poolTransactions
          .filter(transaction => {
            const txTimestampInMs = new Date(transaction.timestamp).getTime()
            const nowInMs = new Date().getTime()

            // Retry the transaction if it hasn't been forged after 10min and it's not 24h old yet+
            return transaction.state !== TxState.Forged &&
              txTimestampInMs + tenMinutesInMs < nowInMs &&
              txTimestampInMs + oneDayInMs > nowInMs
          })
          .map((transaction) => {
            const txData = {
              type: transaction.type,
              from: transaction.fromAccountIndex,
              amount: HermezCompressedAmount.compressAmount(transaction.amount),
              ...(
                transaction.type === TxType.TransferToEthAddr
                  ? { to: transaction.toHezEthereumAddress }
                  : transaction.type === TxType.Transfer
                    ? { to: transaction.toAccountIndex }
                    : {}
              ),
              fee: transaction.fee
            }

            return Tx.generateAndSendL2Tx(txData, wallet, transaction.token, nextForgers, false)
              .catch(() => {})
          })

        Promise.all(resendTransactionsRequests)
      })
  }
}

/**
 * Fetches the state of the coordinator
 * @returns {void}
 */
function fetchCoordinatorState () {
  return (dispatch) => {
    dispatch(globalActions.loadCoordinatorState())

    return hermezjs.CoordinatorAPI.getState()
      .then(res => dispatch(globalActions.loadCoordinatorStateSuccess(res)))
      .catch(err => dispatch(globalActions.loadCoordinatorStateFailure(err)))
  }
}

/**
 * Removes the MetaMask wallet data from the Redux store and the localStorage
 * @returns {void}
 */
function disconnectWallet () {
  return (dispatch) => {
    dispatch(globalActions.unloadWallet())
    dispatch(push('/login'))
  }
}

/**
 * Reloads the webapp
 * @returns {void}
 */
function reloadApp () {
  return () => {
    window.location.reload()
  }
}

export {
  setHermezEnvironment,
  changeRedirectRoute,
  fetchFiatExchangeRates,
  changeNetworkStatus,
  addPendingWithdraw,
  removePendingWithdraw,
  addPendingDelayedWithdraw,
  removePendingDelayedWithdraw,
  updatePendingDelayedWithdrawDate,
  checkPendingDelayedWithdraw,
  addPendingDeposit,
  removePendingDeposit,
  updatePendingDepositId,
  checkPendingDeposits,
  checkPendingTransactions,
  fetchCoordinatorState,
  disconnectWallet,
  reloadApp
}
