export const homeActionTypes = {
  LOAD_ACCOUNTS: '[HOME] LOAD ACCOUNTS',
  LOAD_ACCOUNTS_SUCCESS: '[HOME] LOAD ACCOUNTS SUCCESS',
  LOAD_ACCOUNTS_FAILURE: '[HOME] LOAD ACCOUNTS FAILURE',
  LOAD_TRANSACTIONS: '[HOME] LOAD TRANSACTIONS',
  LOAD_TRANSACTIONS_SUCCESS: '[HOME] LOAD TRANSACTIONS SUCCESS',
  LOAD_TRANSACTIONS_FAILURE: '[HOME] LOAD TRANSACTIONS FAILURE'
}

function loadAccounts () {
  return {
    type: homeActionTypes.LOAD_ACCOUNTS
  }
}

function loadAccountsSuccess (accounts) {
  return {
    type: homeActionTypes.LOAD_ACCOUNTS_SUCCESS,
    accounts: accounts
  }
}

function loadAccountsFailure () {
  return {
    type: homeActionTypes.LOAD_ACCOUNTS_FAILURE
  }
}

function loadTransactions () {
  return {
    type: homeActionTypes.LOAD_TRANSACTIONS
  }
}

function loadTransactionsSuccess (transactions) {
  return {
    type: homeActionTypes.LOAD_TRANSACTIONS_SUCCESS,
    transactions
  }
}

function loadTransactionsFailure () {
  return {
    type: homeActionTypes.LOAD_TRANSACTIONS_FAILURE
  }
}

export {
  loadAccounts,
  loadAccountsSuccess,
  loadAccountsFailure,
  loadTransactions,
  loadTransactionsSuccess,
  loadTransactionsFailure
}
