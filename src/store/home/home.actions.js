export const homeActionTypes = {
  LOAD_TOTAL_BALANCE: '[HOME] LOAD TOTAL BALANCE',
  LOAD_TOTAL_BALANCE_SUCCESS: '[HOME] LOAD TOTAL BALANCE SUCCESS',
  LOAD_TOTAL_BALANCE_FAILURE: '[HOME] LOAD TOTAL BALANCE FAILURE',
  LOAD_ACCOUNTS: '[HOME] LOAD ACCOUNTS',
  LOAD_ACCOUNTS_SUCCESS: '[HOME] LOAD ACCOUNTS SUCCESS',
  LOAD_ACCOUNTS_FAILURE: '[HOME] LOAD ACCOUNTS FAILURE',
  LOAD_POOL_TRANSACTIONS: '[HOME] LOAD POOL TRANSACTIONS',
  LOAD_POOL_TRANSACTIONS_SUCCESS: '[HOME] LOAD POOL TRANSACTIONS SUCCESS',
  LOAD_POOL_TRANSACTIONS_FAILURE: '[HOME] LOAD POOL TRANSACTIONS FAILURE',
  LOAD_HISTORY_TRANSACTIONS: '[HOME] LOAD HISTORY TRANSACTIONS',
  LOAD_HISTORY_TRANSACTIONS_SUCCESS: '[HOME] LOAD HISTORY TRANSACTIONS SUCCESS',
  LOAD_HISTORY_TRANSACTIONS_FAILURE: '[HOME] LOAD HISTORY TRANSACTIONS FAILURE',
  LOAD_EXITS: '[HOME] LOAD EXITS',
  LOAD_EXITS_SUCCESS: '[HOME] LOAD EXITS SUCCESS',
  LOAD_EXITS_FAILURE: '[HOME] LOAD EXITS FAILURE',
  RESET_STATE: '[HOME] RESET STATE'
}

function loadTotalBalance () {
  return {
    type: homeActionTypes.LOAD_TOTAL_BALANCE
  }
}

function loadTotalBalanceSuccess (balance) {
  return {
    type: homeActionTypes.LOAD_TOTAL_BALANCE_SUCCESS,
    balance
  }
}

function loadTotalBalanceFailure () {
  return {
    type: homeActionTypes.LOAD_TOTAL_BALANCE_FAILURE
  }
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

function resetState () {
  return {
    type: homeActionTypes.RESET_STATE
  }
}

export {
  loadTotalBalance,
  loadTotalBalanceSuccess,
  loadTotalBalanceFailure,
  loadAccounts,
  loadAccountsSuccess,
  loadAccountsFailure,
  loadPoolTransactions,
  loadPoolTransactionsSuccess,
  loadPoolTransactionsFailure,
  loadHistoryTransactions,
  loadHistoryTransactionsSuccess,
  loadHistoryTransactionsFailure,
  loadExits,
  loadExitsSuccess,
  loadExitsFailure,
  resetState
}
