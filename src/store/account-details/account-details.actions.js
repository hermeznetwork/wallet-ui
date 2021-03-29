export const accountDetailsActionTypes = {
  LOAD_ACCOUNT: '[ACCOUNT DETAILS] LOAD ACCOUNT',
  LOAD_ACCOUNT_SUCCESS: '[ACCOUNT DETAILS] LOAD ACCOUNT SUCCESS',
  LOAD_ACCOUNT_FAILURE: '[ACCOUNT DETAILS] LOAD ACCOUNT FAILURE',
  LOAD_L1_TOKEN_BALANCE: '[ACCOUNT DETAILS] LOAD L1 TOKEN BALANCE',
  LOAD_L1_TOKEN_BALANCE_SUCCESS: '[ACCOUNT DETAILS] LOAD L1 TOKEN BALANCE SUCCESS',
  LOAD_L1_TOKEN_BALANCE_FAILURE: '[ACCOUNT DETAILS] LOAD L1 TOKEN BALANCE FAILURE',
  LOAD_POOL_TRANSACTIONS: '[ACCOUNT DETAILS] LOAD POOL TRANSACTIONS',
  LOAD_POOL_TRANSACTIONS_SUCCESS: '[ACCOUNT DETAILS] LOAD POOL TRANSACTIONS SUCCESS',
  LOAD_POOL_TRANSACTIONS_FAILURE: '[ACCOUNT DETAILS] LOAD POOL TRANSACTIONS FAILURE',
  LOAD_HISTORY_TRANSACTIONS: '[ACCOUNT DETAILS] LOAD HISTORY TRANSACTIONS',
  LOAD_HISTORY_TRANSACTIONS_SUCCESS: '[ACCOUNT DETAILS] LOAD HISTORY TRANSACTIONS SUCCESS',
  LOAD_HISTORY_TRANSACTIONS_FAILURE: '[ACCOUNT DETAILS] LOAD HISTORY TRANSACTIONS FAILURE',
  LOAD_EXITS: '[ACCOUNT DETAILS] LOAD EXITS',
  LOAD_EXITS_SUCCESS: '[ACCOUNT DETAILS] LOAD EXITS SUCCESS',
  LOAD_EXITS_FAILURE: '[ACCOUNT DETAILS] LOAD EXITS FAILURE',
  REFRESH_HISTORY_TRANSACTIONS: '[ACCOUNT DETAILS] REFRESH HISTORY TRANSACTIONS',
  REFRESH_HISTORY_TRANSACTIONS_SUCCESS: '[ACCOUNT DETAILS] REFRESH HISTORY TRANSACTIONS SUCCESS',
  RESET_STATE: '[ACCOUNT DETAILS] RESET STATE'
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

function loadL1TokenBalance () {
  return {
    type: accountDetailsActionTypes.LOAD_L1_TOKEN_BALANCE
  }
}

function loadL1TokenBalanceSuccess (account) {
  return {
    type: accountDetailsActionTypes.LOAD_L1_TOKEN_BALANCE_SUCCESS,
    account
  }
}

function loadL1TokenBalanceFailure () {
  return {
    type: accountDetailsActionTypes.LOAD_L1_TOKEN_BALANCE_FAILURE
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

function refreshHistoryTransactions () {
  return {
    type: accountDetailsActionTypes.REFRESH_HISTORY_TRANSACTIONS
  }
}

function refreshHistoryTransactionsSuccess (data) {
  return {
    type: accountDetailsActionTypes.REFRESH_HISTORY_TRANSACTIONS_SUCCESS,
    data
  }
}

function resetState () {
  return {
    type: accountDetailsActionTypes.RESET_STATE
  }
}

export {
  loadAccount,
  loadAccountSuccess,
  loadAccountFailure,
  loadL1TokenBalance,
  loadL1TokenBalanceSuccess,
  loadL1TokenBalanceFailure,
  loadPoolTransactions,
  loadPoolTransactionsSuccess,
  loadPoolTransactionsFailure,
  loadHistoryTransactions,
  loadHistoryTransactionsSuccess,
  loadHistoryTransactionsFailure,
  loadExits,
  loadExitsSuccess,
  loadExitsFailure,
  refreshHistoryTransactions,
  refreshHistoryTransactionsSuccess,
  resetState
}
