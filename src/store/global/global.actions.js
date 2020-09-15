export const globalActionTypes = {
  CHANGE_REDIRECT_ROUTE: '[GLOBAL] CHANGE REDIRECT ROUTE',
  LOAD_TOKENS: '[GLOBAL] LOAD TOKENS',
  LOAD_TOKENS_SUCCESS: '[GLOBAL] LOAD TOKENS SUCCESS',
  LOAD_TOKENS_FAILURE: '[GLOBAL] LOAD TOKENS FAILURE',
  LOAD_CONFIG: '[GLOBAL] LOAD CONFIG',
  LOAD_CONFIG_SUCCESS: '[GLOBAL] LOAD CONFIG SUCCESS',
  LOAD_CONFIG_FAILURE: '[GLOBAL] LOAD CONFIG FAILURE',
  LOAD_FIAT_EXCHANGE_RATES: '[GLOBAL] LOAD FIAT EXCHANGE RATES',
  LOAD_FIAT_EXCHANGE_RATES_SUCCESS: '[GLOBAL] LOAD FIAT EXCHANGE RATES SUCCESS',
  LOAD_FIAT_EXCHANGE_RATES_FAILURE: '[GLOBAL] LOAD FIAT EXCHANGE RATES FAILURE',
  LOAD_GAS_MULTIPLIER: '[GLOBAL] LOAD GAS MULTIPLIER',
  LOAD_CURRENT_BATCH: '[GLOBAL] LOAD CURRENT BATCH',
  LOAD_CURRENT_BATCH_SUCCESS: '[GLOBAL] LOAD CURRENT BATCH SUCCESS',
  LOAD_CURRENT_BATCH_FAILURE: '[GLOBAL] LOAD CURRENT BATCH FAILURE'
}

function changeRedirectRoute (redirectRoute) {
  return {
    type: globalActionTypes.CHANGE_REDIRECT_ROUTE,
    redirectRoute
  }
}

function loadTokens () {
  return {
    type: globalActionTypes.LOAD_TOKENS
  }
}

function loadTokensSuccess (accounts) {
  return {
    type: globalActionTypes.LOAD_TOKENS_SUCCESS,
    accounts
  }
}

function loadTokensFailure () {
  return {
    type: globalActionTypes.LOAD_TOKENS_FAILURE
  }
}

function loadConfig () {
  return {
    type: globalActionTypes.LOAD_CONFIG
  }
}

function loadConfigSuccess (config, abiRollup, abiTokens, chainId, error) {
  return {
    type: globalActionTypes.LOAD_CONFIG_SUCCESS,
    config: { config, abiRollup, abiTokens, chainId },
    error
  }
}

function loadConfigFailure (config, error) {
  return {
    type: globalActionTypes.LOAD_CONFIG_FAILURE,
    config: { config },
    error
  }
}

function loadFiatExchangeRates (symbols) {
  return {
    type: globalActionTypes.LOAD_FIAT_EXCHANGE_RATES
  }
}

function loadFiatExchangeRatesSuccess (fiatExchangeRates) {
  return {
    type: globalActionTypes.LOAD_FIAT_EXCHANGE_RATES_SUCCESS,
    fiatExchangeRates
  }
}

function loadFiatExchangeRatesFailure (error) {
  return {
    type: globalActionTypes.LOAD_FIAT_EXCHANGE_RATES_FAILURE,
    error: error.message
  }
}

function loadGasMultiplier (num) {
  return {
    type: globalActionTypes.LOAD_GAS_MULTIPLIER,
    gasMultiplier: num
  }
}

function loadCurrentBatch () {
  return {
    type: globalActionTypes.LOAD_CURRENT_BATCH
  }
}

function loadCurrentBatchSuccess (currentBatch) {
  return {
    type: globalActionTypes.LOAD_CURRENT_BATCH_SUCCESS,
    currentBatch: currentBatch
  }
}

function loadCurrentBatchFailure () {
  return {
    type: globalActionTypes.LOAD_CURRENT_BATCH_FAILURE
  }
}

export {
  changeRedirectRoute,
  loadTokens,
  loadTokensSuccess,
  loadTokensFailure,
  loadConfig,
  loadConfigSuccess,
  loadConfigFailure,
  loadFiatExchangeRates,
  loadFiatExchangeRatesSuccess,
  loadFiatExchangeRatesFailure,
  loadGasMultiplier,
  loadCurrentBatch,
  loadCurrentBatchSuccess,
  loadCurrentBatchFailure
}
