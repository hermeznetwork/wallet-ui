export const globalActionTypes = {
  CHANGE_HEADER: '[GLOBAL] CHANGE HEADER',
  CHANGE_REDIRECT_ROUTE: '[GLOBAL] CHANGE REDIRECT ROUTE',
  LOAD_CONFIG: '[GLOBAL] LOAD CONFIG',
  LOAD_CONFIG_SUCCESS: '[GLOBAL] LOAD CONFIG SUCCESS',
  LOAD_CONFIG_FAILURE: '[GLOBAL] LOAD CONFIG FAILURE',
  LOAD_FIAT_EXCHANGE_RATES: '[GLOBAL] LOAD FIAT EXCHANGE RATES',
  LOAD_FIAT_EXCHANGE_RATES_SUCCESS: '[GLOBAL] LOAD FIAT EXCHANGE RATES SUCCESS',
  LOAD_FIAT_EXCHANGE_RATES_FAILURE: '[GLOBAL] LOAD FIAT EXCHANGE RATES FAILURE',
  LOAD_GAS_MULTIPLIER: '[GLOBAL] LOAD GAS MULTIPLIER',
  LOAD_CURRENT_BATCH: '[GLOBAL] LOAD CURRENT BATCH',
  LOAD_CURRENT_BATCH_SUCCESS: '[GLOBAL] LOAD CURRENT BATCH SUCCESS',
  LOAD_CURRENT_BATCH_FAILURE: '[GLOBAL] LOAD CURRENT BATCH FAILURE',
  ADD_POOL_TRANSACTION: '[GLOBAL] ADD POOL TRANSACTION',
  REMOVE_POOL_TRANSACTION: '[GLOBAL] REMOVE POOL TRANSACTION'
}

function changeHeader (header) {
  return {
    type: globalActionTypes.CHANGE_HEADER,
    header
  }
}

function changeRedirectRoute (redirectRoute) {
  return {
    type: globalActionTypes.CHANGE_REDIRECT_ROUTE,
    redirectRoute
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

function addPoolTransaction (hermezEthereumAddress, transaction) {
  return {
    type: globalActionTypes.ADD_POOL_TRANSACTION,
    hermezEthereumAddress,
    transaction
  }
}

function removePoolTransaction (hermezEthereumAddress, transactionId) {
  return {
    type: globalActionTypes.REMOVE_POOL_TRANSACTION,
    hermezEthereumAddress,
    transactionId
  }
}

export {
  changeHeader,
  changeRedirectRoute,
  loadConfig,
  loadConfigSuccess,
  loadConfigFailure,
  loadFiatExchangeRates,
  loadFiatExchangeRatesSuccess,
  loadFiatExchangeRatesFailure,
  addPoolTransaction,
  removePoolTransaction
}
