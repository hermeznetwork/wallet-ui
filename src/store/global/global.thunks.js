import ethers from 'ethers'

import * as globalActions from './global.actions'
import * as rollupApi from '../../apis/rollup'
import * as fiatExchangeRatesApi from '../../apis/fiat-exchange-rates'
import config from '../../utils/config.json'
import { CliExternalOperator } from '../../utils/cli-external-operator'

function changeRedirectRoute (redirecRoute) {
  return (dispatch) => {
    dispatch(globalActions.changeRedirectRoute(redirecRoute))
  }
}

function fetchTokens () {
  return (dispatch) => {
    dispatch(globalActions.loadTokens())

    return rollupApi.getTokens()
      .then(res => dispatch(globalActions.loadTokensSuccess(res)))
      .catch(err => dispatch(globalActions.loadTokensFailure(err)))
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

function fetchGasMultiplier (num) {
  return function (dispatch) {
    dispatch(globalActions.loadGasMultiplier(num))
  }
}

function fetchCurrentBatch (urlOperator) {
  return async function (dispatch) {
    dispatch(globalActions.loadCurrentBatch())
    let currentBatch
    try {
      const apiOperator = new CliExternalOperator(urlOperator)
      const resOperator = await apiOperator.getState()
      currentBatch = resOperator.data.rollupSynch.lastBatchSynched
      dispatch(globalActions.loadCurrentBatchSuccess(currentBatch))
    } catch (err) {
      dispatch(globalActions.loadCurrentBatchFailure())
    }
  }
}

export {
  changeRedirectRoute,
  fetchTokens,
  fetchConfig,
  fetchFiatExchangeRates,
  fetchGasMultiplier,
  fetchCurrentBatch
}
