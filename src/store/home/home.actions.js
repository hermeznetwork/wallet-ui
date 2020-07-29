export const homeActionTypes = {
  LOAD_COINS_BALANCE: '[HOME] LOAD COINS BALANCE',
  LOAD_COINS_BALANCE_SUCCESS: '[HOME] LOAD COINS BALANCE SUCCESS',
  LOAD_COINS_BALANCE_FAILURE: '[HOME] LOAD COINS BALANCE FAILURE',
  LOAD_RECENT_TRANSACTIONS: '[HOME] LOAD RECENT TRANSACTIONS',
  LOAD_RECENT_TRANSACTIONS_SUCCESS: '[HOME] LOAD RECENT TRANSACTIONS SUCCESS',
  LOAD_RECENT_TRANSACTIONS_FAILURE: '[HOME] LOAD RECENT TRANSACTIONS FAILURE'
}

function loadCoinsBalance () {
  return {
    type: homeActionTypes.LOAD_COINS_BALANCE
  }
}

function loadCoinsBalanceSuccess (coinsBalance) {
  return {
    type: homeActionTypes.LOAD_COINS_BALANCE_SUCCESS,
    coinsBalance
  }
}

function loadCoinsBalanceFailure () {
  return {
    type: homeActionTypes.LOAD_COINS_BALANCE_FAILURE
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
  loadCoinsBalance,
  loadCoinsBalanceSuccess,
  loadCoinsBalanceFailure,
  loadRecentTransactions,
  loadRecentTransactionsSuccess,
  loadRecentTransactionsFailure
}
