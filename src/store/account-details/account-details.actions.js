export const accountDetailsActionTypes = {
  LOAD_ACCOUNT: '[ACCOUNT DETAILS] LOAD ACCOUNT',
  LOAD_ACCOUNT_SUCCESS: '[ACCOUNT DETAILS] LOAD ACCOUNT SUCCESS',
  LOAD_ACCOUNT_FAILURE: '[ACCOUNT DETAILS] LOAD ACCOUNT FAILURE',
  LOAD_TRANSACTIONS: '[ACCOUNT DETAILS] LOAD TRANSACTIONS',
  LOAD_TRANSACTIONS_SUCCESS: '[ACCOUNT DETAILS] LOAD TRANSACTIONS SUCCESS',
  LOAD_TRANSACTIONS_FAILURE: '[ACCOUNT DETAILS] LOAD TRANSACTIONS FAILURE',
  LOAD_TOKEN_PRICE: '[ACCOUNT DETAILS] LOAD TOKEN PRICE',
  LOAD_TOKEN_PRICE_SUCCESS: '[ACCOUNT DETAILS] LOAD TOKEN PRICE SUCCESS',
  LOAD_TOKEN_PRICE_FAILURE: '[ACCOUNT DETAILS] LOAD TOKEN PRICE FAILURE'
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
  loadTransactions,
  loadTransactionsSuccess,
  loadTransactionsFailure
}
