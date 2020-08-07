export const homeActionTypes = {
  LOAD_ACCOUNTS: '[HOME] LOAD ACCOUNTS',
  LOAD_ACCOUNTS_SUCCESS: '[HOME] LOAD ACCOUNTS SUCCESS',
  LOAD_ACCOUNTS_FAILURE: '[HOME] LOAD ACCOUNTS FAILURE',
  LOAD_RECENT_TRANSACTIONS: '[HOME] LOAD RECENT TRANSACTIONS',
  LOAD_RECENT_TRANSACTIONS_SUCCESS: '[HOME] LOAD RECENT TRANSACTIONS SUCCESS',
  LOAD_RECENT_TRANSACTIONS_FAILURE: '[HOME] LOAD RECENT TRANSACTIONS FAILURE'
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

function loadRecentTransactions () {
  return {
    type: homeActionTypes.LOAD_RECENT_TRANSACTIONS
  }
}

function loadRecentTransactionsSuccess (transactions) {
  return {
    type: homeActionTypes.LOAD_RECENT_TRANSACTIONS_SUCCESS,
    transactions
  }
}

function loadRecentTransactionsFailure () {
  return {
    type: homeActionTypes.LOAD_RECENT_TRANSACTIONS_FAILURE
  }
}

export {
  loadAccounts,
  loadAccountsSuccess,
  loadAccountsFailure,
  loadRecentTransactions,
  loadRecentTransactionsSuccess,
  loadRecentTransactionsFailure
}
