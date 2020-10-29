export const accountDetailsActionTypes = {
  LOAD_ACCOUNT: '[ACCOUNT DETAILS] LOAD ACCOUNT',
  LOAD_ACCOUNT_SUCCESS: '[ACCOUNT DETAILS] LOAD ACCOUNT SUCCESS',
  LOAD_ACCOUNT_FAILURE: '[ACCOUNT DETAILS] LOAD ACCOUNT FAILURE',
  LOAD_POOL_TRANSACTIONS: '[ACCOUNT DETAILS] LOAD POOL TRANSACTIONS',
  LOAD_POOL_TRANSACTIONS_SUCCESS: '[ACCOUNT DETAILS] LOAD POOL TRANSACTIONS SUCCESS',
  LOAD_POOL_TRANSACTIONS_FAILURE: '[ACCOUNT DETAILS] LOAD POOL TRANSACTIONS FAILURE',
  LOAD_HISTORY_TRANSACTIONS: '[ACCOUNT DETAILS] LOAD HISTORY TRANSACTIONS',
  LOAD_HISTORY_TRANSACTIONS_SUCCESS: '[ACCOUNT DETAILS] LOAD HISTORY TRANSACTIONS SUCCESS',
  LOAD_HISTORY_TRANSACTIONS_FAILURE: '[ACCOUNT DETAILS] LOAD HISTORY TRANSACTIONS FAILURE',
  LOAD_MORE_HISTORY_TRANSACTIONS: '[ACCOUNT DETAILS] LOAD MORE HISTORY TRANSACTIONS',
  LOAD_MORE_HISTORY_TRANSACTIONS_SUCCESS: '[ACCOUNT DETAILS] LOAD MORE HISTORY TRANSACTIONS SUCCESS',
  LOAD_MORE_HISTORY_TRANSACTIONS_FAILURE: '[ACCOUNT DETAILS] LOAD MORE HISTORY TRANSACTIONS FAILURE',
  LOAD_EXITS: '[ACCOUNT DETAILS] LOAD EXITS',
  LOAD_EXITS_SUCCESS: '[ACCOUNT DETAILS] LOAD EXITS SUCCESS',
  LOAD_EXITS_FAILURE: '[ACCOUNT DETAILS] LOAD EXITS FAILURE'
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

function loadPoolTransactions () {
  return {
    type: accountDetailsActionTypes.LOAD_POOL_TRANSACTIONS
  }
}

function loadPoolTransactionsSuccess (transactions) {
  return {
    type: accountDetailsActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS,
    transactions
  }
}

function loadPoolTransactionsFailure () {
  return {
    type: accountDetailsActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE
  }
}

function loadHistoryTransactions () {
  return {
    type: accountDetailsActionTypes.LOAD_HISTORY_TRANSACTIONS
  }
}

function loadHistoryTransactionsSuccess (data) {
  return {
    type: accountDetailsActionTypes.LOAD_HISTORY_TRANSACTIONS_SUCCESS,
    data
  }
}

function loadHistoryTransactionsFailure () {
  return {
    type: accountDetailsActionTypes.LOAD_HISTORY_TRANSACTIONS_FAILURE
  }
}

function loadMoreHistoryTransactions () {
  return {
    type: accountDetailsActionTypes.LOAD_MORE_HISTORY_TRANSACTIONS
  }
}

function loadMoreHistoryTransactionsSuccess (data) {
  return {
    type: accountDetailsActionTypes.LOAD_MORE_HISTORY_TRANSACTIONS_SUCCESS,
    data
  }
}

function loadMoreHistoryTransactionsFailure () {
  return {
    type: accountDetailsActionTypes.LOAD_MORE_HISTORY_TRANSACTIONS_FAILURE
  }
}

function loadExits () {
  return {
    type: accountDetailsActionTypes.LOAD_EXITS
  }
}

function loadExitsSuccess (exits) {
  return {
    type: accountDetailsActionTypes.LOAD_EXITS_SUCCESS,
    exits
  }
}

function loadExitsFailure (error) {
  return {
    type: accountDetailsActionTypes.LOAD_EXITS_FAILURE,
    error
  }
}

export {
  loadAccount,
  loadAccountSuccess,
  loadAccountFailure,
  loadPoolTransactions,
  loadPoolTransactionsSuccess,
  loadPoolTransactionsFailure,
  loadHistoryTransactions,
  loadHistoryTransactionsSuccess,
  loadHistoryTransactionsFailure,
  loadMoreHistoryTransactions,
  loadMoreHistoryTransactionsSuccess,
  loadMoreHistoryTransactionsFailure,
  loadExits,
  loadExitsSuccess,
  loadExitsFailure
}
