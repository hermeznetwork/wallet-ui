export const homeActionTypes = {
  LOAD_ACCOUNTS: '[HOME] LOAD ACCOUNTS',
  LOAD_ACCOUNTS_SUCCESS: '[HOME] LOAD ACCOUNTS SUCCESS',
  LOAD_ACCOUNTS_FAILURE: '[HOME] LOAD ACCOUNTS FAILURE',
  LOAD_USD_TOKEN_EXCHANGE_RATES: '[HOME] LOAD USD TOKEN EXCHANGE RATES',
  LOAD_USD_TOKEN_EXCHANGE_RATES_SUCCESS: '[HOME] LOAD USD TOKEN EXCHANGE RATES SUCCESS',
  LOAD_USD_TOKEN_EXCHANGE_RATES_FAILURE: '[HOME] LOAD USD TOKEN EXCHANGE RATES FAILURE'
}

function loadAccounts () {
  return {
    type: homeActionTypes.LOAD_ACCOUNTS
  }
}

function loadAccountsSuccess (accounts) {
  return {
    type: homeActionTypes.LOAD_ACCOUNTS_SUCCESS,
    accounts
  }
}

function loadAccountsFailure () {
  return {
    type: homeActionTypes.LOAD_ACCOUNTS_FAILURE
  }
}

function loadUSDTokenExchangeRates () {
  return {
    type: homeActionTypes.LOAD_USD_TOKEN_EXCHANGE_RATES
  }
}

function loadUSDTokenExchangeRatesSuccess (usdTokenExchangeRates) {
  return {
    type: homeActionTypes.LOAD_USD_TOKEN_EXCHANGE_RATES_SUCCESS,
    usdTokenExchangeRates
  }
}

function loadUSDTokenExchangeRatesFailure () {
  return {
    type: homeActionTypes.LOAD_USD_TOKEN_EXCHANGE_RATES_FAILURE
  }
}

export {
  loadAccounts,
  loadAccountsSuccess,
  loadAccountsFailure,
  loadUSDTokenExchangeRates,
  loadUSDTokenExchangeRatesSuccess,
  loadUSDTokenExchangeRatesFailure
}
