export const accountDetailsActionTypes = {
  LOAD_ACCOUNT: '[ACCOUNT DETAILS] LOAD ACCOUNT',
  LOAD_ACCOUNT_SUCCESS: '[ACCOUNT DETAILS] LOAD ACCOUNT SUCCESS',
  LOAD_ACCOUNT_FAILURE: '[ACCOUNT DETAILS] LOAD ACCOUNT FAILURE',
  LOAD_USD_TOKEN_EXCHANGE_RATE: '[HOME] LOAD USD TOKEN EXCHANGE RATE',
  LOAD_USD_TOKEN_EXCHANGE_RATE_SUCCESS: '[HOME] LOAD USD TOKEN EXCHANGE RATE SUCCESS',
  LOAD_USD_TOKEN_EXCHANGE_RATE_FAILURE: '[HOME] LOAD USD TOKEN EXCHANGE RATE FAILURE',
  LOAD_TRANSACTIONS: '[ACCOUNT DETAILS] LOAD TRANSACTIONS',
  LOAD_TRANSACTIONS_SUCCESS: '[ACCOUNT DETAILS] LOAD TRANSACTIONS SUCCESS',
  LOAD_TRANSACTIONS_FAILURE: '[ACCOUNT DETAILS] LOAD TRANSACTIONS FAILURE'
}

function loadAccount () {
  return {
    type: accountDetailsActionTypes.LOAD_ACCOUNT
  }
}

function loadAccountSuccess (account) {
  return {
    type: accountDetailsActionTypes.LOAD_ACCOUNT_SUCCESS,
    account
  }
}

function loadAccountFailure () {
  return {
    type: accountDetailsActionTypes.LOAD_ACCOUNT_FAILURE
  }
}

function loadUSDTokenExchangeRate () {
  return {
    type: accountDetailsActionTypes.LOAD_USD_TOKEN_EXCHANGE_RATE
  }
}

function loadUSDTokenExchangeRateSuccess (usdTokenExchangeRate) {
  return {
    type: accountDetailsActionTypes.LOAD_USD_TOKEN_EXCHANGE_RATE_SUCCESS,
    usdTokenExchangeRate
  }
}

function loadUSDTokenExchangeRateFailure () {
  return {
    type: accountDetailsActionTypes.LOAD_USD_TOKEN_EXCHANGE_RATE_FAILURE
  }
}

function loadTransactions () {
  return {
    type: accountDetailsActionTypes.LOAD_TRANSACTIONS
  }
}

function loadTransactionsSuccess (transactions) {
  return {
    type: accountDetailsActionTypes.LOAD_TRANSACTIONS_SUCCESS,
    transactions
  }
}

function loadTransactionsFailure () {
  return {
    type: accountDetailsActionTypes.LOAD_TRANSACTIONS_FAILURE
  }
}

export {
  loadAccount,
  loadAccountSuccess,
  loadAccountFailure,
  loadUSDTokenExchangeRate,
  loadUSDTokenExchangeRateSuccess,
  loadUSDTokenExchangeRateFailure,
  loadTransactions,
  loadTransactionsSuccess,
  loadTransactionsFailure
}
