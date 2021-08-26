import hermezjs, { CoordinatorAPI, Providers, Tx, TxUtils, HermezCompressedAmount, Addresses } from '@hermeznetwork/hermezjs'
import { push } from 'connected-react-router'
import { ethers } from 'ethers'
import HermezABI from '@hermeznetwork/hermezjs/src/abis/HermezABI'
import { TxType, TxState } from '@hermeznetwork/hermezjs/src/enums'
import { HttpStatusCode } from '@hermeznetwork/hermezjs/src/http'
import { getEthereumAddress } from '@hermeznetwork/hermezjs/src/addresses'

import * as globalActions from './global.actions'
import * as hermezWebApi from '../../apis/hermez-web'
import * as airdropApi from '../../apis/rewards'
import * as priceApi from '../../apis/price-updater'
import * as storage from '../../utils/storage'
import * as constants from '../../constants'
import { isTxMined, hasTxBeenReverted, isTxCanceled, isTxExpectedToFail } from '../../utils/ethereum'
import { CurrencySymbol } from '../../utils/currencies'
import { getNextForgerUrls } from '../../utils/coordinator'

/**
 * Sets the environment to use in hermezjs. If the chainId is supported will pick it up
 * a known environment and if not will use the one provided in the .env file
 */
function setHermezEnvironment (chainId, chainName) {
  return async (dispatch) => {
    dispatch(globalActions.loadEthereumNetwork())

    hermezjs.TxPool.initializeTransactionPool()

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

    dispatch(globalActions.loadEthereumNetworkSuccess({ chainId, name: chainName }))
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
function fetchFiatExchangeRates () {
  return (dispatch) => {
    const symbols = Object.values(CurrencySymbol)
      .filter(currency => currency.code !== CurrencySymbol.USD.code)
      .map((currency) => currency.code)

    dispatch(globalActions.loadFiatExchangeRates())

    return priceApi.getFiatExchangeRates(symbols)
      .then(res => dispatch(globalActions.loadFiatExchangeRatesSuccess(res)))
      .catch(() => {
        dispatch(globalActions.loadFiatExchangeRatesSuccess(priceApi.mockedFiatExchangeRates))
      })
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

function checkHermezStatus () {
  return (dispatch) => {
    dispatch(globalActions.loadHermezStatus())

    return hermezWebApi.getNetworkStatus()
      .then((res) => dispatch(globalActions.loadHermezStatusSuccess(res)))
      .catch(() => dispatch(globalActions.loadHermezStatusFailure('An error occurred loading Hermez status')))
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
 * @param {string} hash - The transaction hash used to remove a pendingWithdraw from the store
 * @returns {void}
 */
function removePendingWithdraw (hash) {
  return (dispatch, getState) => {
    const { global: { wallet, ethereumNetworkTask } } = getState()
    const { data: { chainId } } = ethereumNetworkTask
    const { hermezEthereumAddress } = wallet

    storage.removeItemByCustomProp(constants.PENDING_WITHDRAWS_KEY, chainId, hermezEthereumAddress, { name: 'hash', value: hash })
    dispatch(globalActions.removePendingWithdraw(chainId, hermezEthereumAddress, hash))
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
 * Removes a pendingWithdraw from the pendingDelayedWithdraws store by hash
 * @param {string} pendingDelayedWithdrawHash - The pendingDelayedWithdraw hash to remove from the store
 * @returns {void}
 */
function removePendingDelayedWithdrawByHash (pendingDelayedWithdrawHash) {
  return (dispatch, getState) => {
    const { global: { wallet, ethereumNetworkTask } } = getState()
    const { data: { chainId } } = ethereumNetworkTask
    const { hermezEthereumAddress } = wallet

    storage.removeItemByCustomProp(constants.PENDING_DELAYED_WITHDRAWS_KEY, chainId, hermezEthereumAddress, { name: 'hash', value: pendingDelayedWithdrawHash })
    dispatch(globalActions.removePendingDelayedWithdrawByHash(chainId, hermezEthereumAddress, pendingDelayedWithdrawHash))
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
      { timestamp: pendingDelayedWithdrawDate }
    )
    dispatch(globalActions.updatePendingDelayedWithdrawDate(chainId, hermezEthereumAddress, transactionHash, pendingDelayedWithdrawDate))
  }
}

/**
 * Checks L1 transactions for pending delayed withdrawals.
 * If they have failed, clear from storage.
 * Updates the date the transaction happened if necessary.
 * @returns {void}
 */
function checkPendingDelayedWithdrawals () {
  return async (dispatch, getState) => {
    const { global: { wallet, pendingDelayedWithdraws, ethereumNetworkTask } } = getState()

    dispatch(globalActions.checkPendingDelayedWithdrawals())

    const provider = Providers.getProvider()
    const accountEthBalance = BigInt(await provider.getBalance(Addresses.getEthereumAddress(wallet.hermezEthereumAddress)))
    const accountPendingDelayedWithdraws = storage.getItemsByHermezAddress(
      pendingDelayedWithdraws,
      ethereumNetworkTask.data.chainId,
      wallet.hermezEthereumAddress
    )

    // Gets the actual transaction and checks if it doesn't exist or is expected to fail
    const pendingDelayedWithdrawsTxs = accountPendingDelayedWithdraws.map((pendingDelayedWithdraw) => {
      return provider.getTransaction(pendingDelayedWithdraw.hash).then((tx) => {
        // Checks whether the date of pendingDelayedWithdraw needs to be updated
        provider.getBlock(tx.blockNumber).then((block) => {
          // Converts timestamp from s to ms
          const newTimestamp = block.timestamp * 1000
          if (new Date(pendingDelayedWithdraw.timestamp).getTime() !== newTimestamp) {
            dispatch(updatePendingDelayedWithdrawDate(pendingDelayedWithdraw.hash, new Date(newTimestamp).toISOString()))
          }
        })

        // Checks here to have access to pendingDelayedWithdraw.timestamp
        if (isTxCanceled(tx) || isTxExpectedToFail(tx, pendingDelayedWithdraw.timestamp, accountEthBalance)) {
          dispatch(removePendingDelayedWithdrawByHash(pendingDelayedWithdraw.hash))
        }
        return tx
      })
    })

    Promise.all(pendingDelayedWithdrawsTxs)
      .then((txs) => {
        const minedTxs = txs.filter(isTxMined)
        const pendingDelayedWithdrawsTxReceipts = minedTxs.map(tx => provider.getTransactionReceipt(tx.hash))

        // Checks receipts to see if transactions have been reverted
        Promise.all(pendingDelayedWithdrawsTxReceipts)
          .then((txReceipts) => {
            const revertedTxReceipts = txReceipts.filter(hasTxBeenReverted)

            revertedTxReceipts.forEach((tx) => {
              dispatch(removePendingDelayedWithdrawByHash(tx.transactionHash))
            })

            // Checks with Coordinator API if exit has been withdrawn
            const exitsApiPromises = accountPendingDelayedWithdraws.map((pendingDelayedWithdraw) => {
              return CoordinatorAPI.getExit(pendingDelayedWithdraw.batchNum, pendingDelayedWithdraw.accountIndex)
                .then((exitTx) => {
                  // Checks here to have access to pendingDelayedWithdraw.id
                  if (exitTx.delayedWithdraw) {
                    dispatch(removePendingDelayedWithdraw(pendingDelayedWithdraw.id))
                  }
                })
            })

            Promise.all(exitsApiPromises).finally(() => dispatch(globalActions.checkPendingDelayedWithdrawalsSuccess()))
          })
      })
  }
}

/**
 * Checks pending exits to see if they have been completed
 * and delete them from storage
 * @returns {void}
 */
function checkPendingWithdrawals () {
  return async (dispatch, getState) => {
    const { global: { wallet, ethereumNetworkTask, pendingWithdraws } } = getState()

    dispatch(globalActions.checkPendingWithdrawals())

    const provider = Providers.getProvider()
    const accountEthBalance = BigInt(await provider.getBalance(Addresses.getEthereumAddress(wallet.hermezEthereumAddress)))
    const accountPendingWithdraws = storage.getItemsByHermezAddress(
      pendingWithdraws,
      ethereumNetworkTask.data.chainId,
      wallet.hermezEthereumAddress
    )

    // Gets the actual transaction and checks if it doesn't exist or is expected to fail
    const pendingWithdrawsTxs = accountPendingWithdraws.map((pendingWithdraw) => {
      return provider.getTransaction(pendingWithdraw.hash).then((tx) => {
        // Checks here to have access to pendingWithdraw.timestamp
        if (isTxCanceled(tx) || isTxExpectedToFail(tx, pendingWithdraw.timestamp, accountEthBalance)) {
          dispatch(removePendingWithdraw(pendingWithdraw.hash))
        }
        return tx
      })
    })

    Promise.all(pendingWithdrawsTxs)
      .then((txs) => {
        const minedTxs = txs.filter(isTxMined)
        const pendingWithdrawsTxReceipts = minedTxs.map(tx => provider.getTransactionReceipt(tx.hash))

        // Checks receipts to see if transactions have been reverted
        Promise.all(pendingWithdrawsTxReceipts)
          .then((txReceipts) => {
            const revertedTxReceipts = txReceipts.filter(hasTxBeenReverted)

            revertedTxReceipts.forEach((tx) => {
              dispatch(removePendingWithdraw(tx.transactionHash))
            })

            // Checks with Coordinator API if exit has been withdrawn
            const exitsApiPromises = accountPendingWithdraws.map((pendingWithdraw) => {
              return CoordinatorAPI.getExit(pendingWithdraw.batchNum, pendingWithdraw.accountIndex)
                .then((exitTx) => {
                  // Checks here to have access to pendingWithdraw.hash
                  if (exitTx.instantWithdraw || exitTx.delayedWithdraw) {
                    dispatch(removePendingWithdraw(pendingWithdraw.hash))
                    dispatch(removePendingDelayedWithdraw(pendingWithdraw.id))
                  }
                })
            })

            Promise.all(exitsApiPromises).finally(() => dispatch(globalActions.checkPendingWithdrawalsSuccess()))
          })
      })
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
 * Removes a pendingDeposit from the pendingDeposit store by id
 * @param {string} transactionId - The transaction identifier used to remove a pendingDeposit from the store
 * @returns {void}
 */
function removePendingDepositById (transactionId) {
  return (dispatch, getState) => {
    const { global: { wallet, ethereumNetworkTask } } = getState()
    const { data: { chainId } } = ethereumNetworkTask
    const { hermezEthereumAddress } = wallet

    storage.removeItem(constants.PENDING_DEPOSITS_KEY, chainId, hermezEthereumAddress, transactionId)
    dispatch(globalActions.removePendingDepositById(chainId, hermezEthereumAddress, transactionId))
  }
}

/**
 * Removes a pendingDeposit from the pendingDeposit store by hash
 * @param {string} hash - The transaction hash used to remove a pendingDeposit from the store
 * @returns {void}
 */
function removePendingDepositByHash (hash) {
  return (dispatch, getState) => {
    const { global: { wallet, ethereumNetworkTask } } = getState()
    const { data: { chainId } } = ethereumNetworkTask
    const { hermezEthereumAddress } = wallet

    storage.removeItemByCustomProp(constants.PENDING_DEPOSITS_KEY, chainId, hermezEthereumAddress, { name: 'hash', value: hash })
    dispatch(globalActions.removePendingDepositByHash(chainId, hermezEthereumAddress, hash))
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
  return async (dispatch, getState) => {
    const { global: { wallet, pendingDeposits, ethereumNetworkTask } } = getState()

    dispatch(globalActions.checkPendingDeposits())

    const provider = Providers.getProvider()
    const accountEthBalance = BigInt(await provider.getBalance(Addresses.getEthereumAddress(wallet.hermezEthereumAddress)))
    const accountPendingDeposits = storage.getItemsByHermezAddress(
      pendingDeposits,
      ethereumNetworkTask.data.chainId,
      wallet.hermezEthereumAddress
    )
    const pendingDepositsTxs = accountPendingDeposits.map((pendingDeposit) => {
      return provider.getTransaction(pendingDeposit.hash).then((tx) => {
        if (isTxCanceled(tx) || isTxExpectedToFail(tx, pendingDeposit.timestamp, accountEthBalance)) {
          dispatch(removePendingDepositByHash(pendingDeposit.hash))
        }

        return tx
      })
    })

    Promise.all(pendingDepositsTxs).then((txs) => {
      const minedTxs = txs.filter(tx => tx !== null && tx.blockNumber !== null)
      const pendingDepositsTxReceipts = minedTxs.map(tx => provider.getTransactionReceipt(tx.hash))

      Promise.all(pendingDepositsTxReceipts).then((txReceipts) => {
        const hermezContractInterface = new ethers.utils.Interface(HermezABI)
        const revertedTxReceipts = txReceipts.filter(hasTxBeenReverted)
        const successfulTxReceipts = txReceipts.filter(txReceipt => txReceipt.status === 1 && txReceipt.logs && txReceipt.logs.length > 0)
        const transactionHistoryPromises = successfulTxReceipts.map((txReceipt) => {
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

        revertedTxReceipts.forEach((tx) => {
          dispatch(removePendingDepositByHash(tx.transactionHash))
        })

        Promise.all(transactionHistoryPromises)
          .then((results) => {
            results
              .filter(result => result !== undefined)
              .forEach((transaction) => {
                if (transaction.batchNum !== null) {
                  dispatch(removePendingDepositById(transaction.id))
                }
              })
            dispatch(globalActions.checkPendingDepositsSuccess())
          })
          .catch(() => dispatch(globalActions.checkPendingDepositsSuccess()))
      })
    })
  }
}

function checkPendingTransactions () {
  return (_, getState) => {
    const { global: { wallet, coordinatorStateTask } } = getState()
    const nextForgerUrls = getNextForgerUrls(coordinatorStateTask.data)

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

            return Tx.generateAndSendL2Tx(txData, wallet, transaction.token, nextForgerUrls, false)
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
    const provider = Providers.getProvider()
    if (provider.provider?.connector) {
      // Kills the stored Web Connect session to show QR with next login
      provider.provider.connector.killSession()
    }
    dispatch(globalActions.unloadWallet())
    dispatch(push('/login'))
    if (process.env.REACT_APP_ENABLE_AIRDROP === 'true') {
      dispatch(globalActions.closeRewardsSidenav())
    }
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

/**
 * Fetches Airdrop estimated reward for a given ethAddr
 * @returns {void}
 */
function fetchReward () {
  return (dispatch, getState) => {
    dispatch(globalActions.loadReward())

    return airdropApi.getReward()
      .then((res) => dispatch(globalActions.loadRewardSuccess(res)))
      .catch(() => dispatch(globalActions.loadRewardFailure('An error occurred loading estimated reward.')))
  }
}

/**
 * Fetches Airdrop earned reward for a given ethAddr
 * @returns {void}
 */
function fetchEarnedReward () {
  return (dispatch, getState) => {
    const { global: { wallet } } = getState()

    dispatch(globalActions.loadEarnedReward())

    return airdropApi.getAccumulatedEarnedReward(getEthereumAddress(wallet.hermezEthereumAddress))
      .then((res) => dispatch(globalActions.loadEarnedRewardSuccess(res)))
      .catch(err => {
        if (err.response?.status === HttpStatusCode.NOT_FOUND) {
          dispatch(globalActions.loadEarnedRewardSuccess(0))
        } else {
          dispatch(globalActions.loadEarnedRewardFailure('An error occurred loading estimated reward.'))
        }
      })
  }
}

/**
 * Fetches Airdrop reward percentage
 * @returns {void}
 */
function fetchRewardPercentage () {
  return (dispatch) => {
    dispatch(globalActions.loadRewardPercentage())

    return airdropApi.getRewardPercentage()
      .then((res) => dispatch(globalActions.loadRewardPercentageSuccess(res)))
      .catch(() => dispatch(globalActions.loadRewardPercentageFailure('An error occurred loading reward percentage.')))
  }
}

/**
 * Checks if an account is eligible for the Airdrop
 * @returns {void}
 */
function fetchRewardAccountEligibility () {
  return (dispatch, getState) => {
    const { global: { wallet } } = getState()

    dispatch(globalActions.loadRewardAccountEligilibity())

    return airdropApi.getAccountEligibility(getEthereumAddress(wallet.hermezEthereumAddress))
      .then((res) => dispatch(globalActions.loadRewardAccountEligilibitySuccess(res)))
      .catch((err) => {
        if (err.response?.status === HttpStatusCode.NOT_FOUND) {
          dispatch(globalActions.loadRewardAccountEligilibitySuccess(false))
        } else {
          dispatch(globalActions.loadRewardAccountEligilibityFailure('An error occurred loading account eligibility.'))
        }
      })
  }
}

/**
 * Fetches details for the token used for the rewards
 * @param {Number} tokenId - A token ID
 * @returns {Object} Response data with a specific token
 */
function fetchRewardToken () {
  return (dispatch) => {
    dispatch(globalActions.loadRewardToken())

    return CoordinatorAPI.getToken(constants.HEZ_TOKEN_ID)
      .then((res) => dispatch(globalActions.loadRewardTokenSuccess(res)))
      .catch(() => (globalActions.loadRewardTokenFailure('An error occured loading token.')))
  }
}

/**
 * Fetches details for the token used for the rewards
 * @param {Number} tokenId - A token ID
 * @returns {Object} Response data with a specific token
 */
function fetchTokensPrice () {
  return (dispatch) => {
    dispatch(globalActions.loadTokensPrice())

    return priceApi.getTokensPrice()
      .then((res) => dispatch(globalActions.loadTokensPriceSuccess(res)))
      .catch(() => (globalActions.loadTokensPriceFailure('An error occured loading token.')))
  }
}

export {
  setHermezEnvironment,
  changeRedirectRoute,
  fetchFiatExchangeRates,
  changeNetworkStatus,
  checkHermezStatus,
  addPendingWithdraw,
  removePendingWithdraw,
  addPendingDelayedWithdraw,
  removePendingDelayedWithdraw,
  updatePendingDelayedWithdrawDate,
  checkPendingDelayedWithdrawals,
  checkPendingWithdrawals,
  addPendingDeposit,
  removePendingDepositById,
  removePendingDepositByHash,
  updatePendingDepositId,
  checkPendingDeposits,
  checkPendingTransactions,
  fetchCoordinatorState,
  disconnectWallet,
  reloadApp,
  fetchReward,
  fetchEarnedReward,
  fetchRewardPercentage,
  fetchRewardAccountEligibility,
  fetchRewardToken,
  fetchTokensPrice
}
