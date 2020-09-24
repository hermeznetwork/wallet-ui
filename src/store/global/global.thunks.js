import ethers from 'ethers'

import * as globalActions from './global.actions'
import * as fiatExchangeRatesApi from '../../apis/fiat-exchange-rates'
import config from '../../utils/config.json'
import { TRANSACTION_POOL_KEY } from '../../constants'

function changeRedirectRoute (redirecRoute) {
  return (dispatch) => {
    dispatch(globalActions.changeRedirectRoute(redirecRoute))
  }
}

function fetchFiatExchangeRates (symbols) {
  return (dispatch) => {
    dispatch(globalActions.loadFiatExchangeRates())

    return fiatExchangeRatesApi.getFiatExchangeRates(symbols)
      .then(res => dispatch(globalActions.loadFiatExchangeRatesSuccess(res.rates)))
      .catch(err => dispatch(globalActions.loadFiatExchangeRatesFailure(err)))
  }
}

function fetchConfig () {
  return async (dispatch) => {
    dispatch(globalActions.loadConfig())
    try {
      let chainId
      let errorMessage = ''

      if (config.nodeEth) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const networkInfo = await provider.getNetwork()
        chainId = networkInfo.chainId
      } else {
        chainId = -1
        errorMessage = 'No Node Ethereum'
      }
      if (!config.operator) errorMessage = 'No operator'
      if (!config.address) errorMessage = 'No Rollup Address'
      if (!config.abiRollup) errorMessage = 'No Rollup ABI'
      if (!config.abiTokens) errorMessage = 'No Tokens ABI'
      if (!config.tokensAddress) errorMessage = 'No Tokens Address'

      dispatch(globalActions.loadConfigSuccess(config, config.abiRollup, config.abiTokens, chainId, errorMessage))
      if (errorMessage !== '') {
        return false
      } else {
        return true
      }
    } catch (error) {
      const newConfig = config
      newConfig.nodeEth = undefined
      dispatch(globalActions.loadConfigFailure(newConfig, 'Failure Configuration'))
      return false
    }
  }
}

/**
 * Adds a transaction to the transaction pool
 * @param {string} hermezEthereumAddress - The account with which the transaction was made
 * @param {string} transaction - The transaction to add to the pool
 * @returns {void}
 */
function addPoolTransaction (hermezEthereumAddress, transaction) {
  return (dispatch) => {
    const transactionPool = JSON.parse(localStorage.getItem(TRANSACTION_POOL_KEY))
    const accountTransactionPool = transactionPool[hermezEthereumAddress]
    const newAccountTransactionPool = accountTransactionPool === undefined
      ? [transaction]
      : [...accountTransactionPool, transaction]
    const newTransactionPool = {
      ...transactionPool,
      [hermezEthereumAddress]: newAccountTransactionPool
    }

    localStorage.setItem(TRANSACTION_POOL_KEY, JSON.stringify(newTransactionPool))
    dispatch(globalActions.addPoolTransaction(newTransactionPool))
  }
}

/**
 * Removes a transaction from the transaction pool
 * @param {string} hermezEthereumAddress - The account with which the transaction was originally made
 * @param {string} transactionId - The transaction identifier to remove from the pool
 * @returns {void}
 */
function removePoolTransaction (hermezEthereumAddress, transactionId) {
  return (dispatch) => {
    const transactionPool = JSON.parse(localStorage.getItem(TRANSACTION_POOL_KEY))
    const accountTransactionPool = transactionPool[hermezEthereumAddress]
    const newAccountTransactionPool = accountTransactionPool
      .filter((transaction) => transaction.id !== transactionId)
    const newTransactionPool = {
      ...transactionPool,
      [hermezEthereumAddress]: newAccountTransactionPool
    }

    localStorage.setItem(TRANSACTION_POOL_KEY, JSON.stringify(newTransactionPool))
    dispatch(globalActions.removePoolTransaction(transactionId))
  }
}

export {
  changeRedirectRoute,
  fetchConfig,
  fetchFiatExchangeRates,
  addPoolTransaction,
  removePoolTransaction
}
