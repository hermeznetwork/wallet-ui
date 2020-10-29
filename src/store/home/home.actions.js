export const homeActionTypes = {
  LOAD_ACCOUNTS: '[HOME] LOAD ACCOUNTS',
  LOAD_ACCOUNTS_SUCCESS: '[HOME] LOAD ACCOUNTS SUCCESS',
  LOAD_ACCOUNTS_FAILURE: '[HOME] LOAD ACCOUNTS FAILURE',
  LOAD_MORE_ACCOUNTS: '[HOME] LOAD MORE ACCOUNTS',
  LOAD_MORE_ACCOUNTS_SUCCESS: '[HOME] LOAD MORE ACCOUNTS SUCCESS',
  LOAD_MORE_ACCOUNTS_FAILURE: '[HOME] LOAD MORE ACCOUNTS FAILURE',
  LOAD_POOL_TRANSACTIONS: '[HOME] LOAD POOL TRANSACTIONS',
  LOAD_POOL_TRANSACTIONS_SUCCESS: '[HOME] LOAD POOL TRANSACTIONS SUCCESS',
  LOAD_POOL_TRANSACTIONS_FAILURE: '[HOME] LOAD POOL TRANSACTIONS FAILURE',
  LOAD_HISTORY_TRANSACTIONS: '[HOME] LOAD HISTORY TRANSACTIONS',
  LOAD_HISTORY_TRANSACTIONS_SUCCESS: '[HOME] LOAD HISTORY TRANSACTIONS SUCCESS',
  LOAD_HISTORY_TRANSACTIONS_FAILURE: '[HOME] LOAD HISTORY TRANSACTIONS FAILURE',
  LOAD_EXITS: '[HOME] LOAD EXITS',
  LOAD_EXITS_SUCCESS: '[HOME] LOAD EXITS SUCCESS',
  LOAD_EXITS_FAILURE: '[HOME] LOAD EXITS FAILURE'
}

function loadAccounts () {
  return {
    type: homeActionTypes.LOAD_ACCOUNTS
  }
}

function loadAccountsSuccess (data) {
  return {
    type: homeActionTypes.LOAD_ACCOUNTS_SUCCESS,
    data
  }
}

function loadAccountsFailure () {
  return {
    type: homeActionTypes.LOAD_ACCOUNTS_FAILURE
  }
}

function loadMoreAccounts () {
  return {
    type: homeActionTypes.LOAD_MORE_ACCOUNTS
  }
}

function loadMoreAccountsSuccess (data) {
  return {
    type: homeActionTypes.LOAD_MORE_ACCOUNTS_SUCCESS,
    data
  }
}

function loadMoreAccountsFailure () {
  return {
    type: homeActionTypes.LOAD_MORE_ACCOUNTS_FAILURE
  }
}

function loadPoolTransactions () {
  return {
    type: homeActionTypes.LOAD_POOL_TRANSACTIONS
  }
}

function loadPoolTransactionsSuccess (transactions) {
  return {
    type: homeActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS,
    transactions
  }
}

function loadPoolTransactionsFailure () {
  return {
    type: homeActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE
  }
}

function loadHistoryTransactions () {
  return {
    type: homeActionTypes.LOAD_HISTORY_TRANSACTIONS
  }
}

function loadHistoryTransactionsSuccess (transactions) {
  return {
    type: homeActionTypes.LOAD_HISTORY_TRANSACTIONS_SUCCESS,
    transactions
  }
}

function loadHistoryTransactionsFailure () {
  return {
    type: homeActionTypes.LOAD_HISTORY_TRANSACTIONS_FAILURE
  }
}

function loadExits () {
  return {
    type: homeActionTypes.LOAD_EXITS
  }
}

function loadExitsSuccess (exits) {
  return {
    type: homeActionTypes.LOAD_EXITS_SUCCESS,
    exits
  }
}

function loadExitsFailure (error) {
  return {
    type: homeActionTypes.LOAD_EXITS_FAILURE,
    error
  }
}

export {
  loadAccounts,
  loadAccountsSuccess,
  loadAccountsFailure,
  loadMoreAccounts,
  loadMoreAccountsSuccess,
  loadMoreAccountsFailure,
  loadPoolTransactions,
  loadPoolTransactionsSuccess,
  loadPoolTransactionsFailure,
  loadHistoryTransactions,
  loadHistoryTransactionsSuccess,
  loadHistoryTransactionsFailure,
  loadExits,
  loadExitsSuccess,
  loadExitsFailure
}
