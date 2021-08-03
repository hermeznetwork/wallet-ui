export const tokenSwapActionTypes = {
  GO_TO_SWAP: '[TOKEN SWAP] GO TO SWAP',
  GO_TO_QUOTES: '[TOKEN SWAP] GO TO QUOTES',
  RESET_STATE: '[TOKEN SWAP] RESET STATE',
  LOAD_ACCOUNTS: '[TOKEN SWAP] LOAD ACCOUNTS',
  LOAD_ACCOUNTS_SUCCESS: '[TOKEN SWAP] LOAD ACCOUNTS SUCCESS',
  LOAD_ACCOUNTS_FAILURE: '[TOKEN SWAP] LOAD ACCOUNTS FAILURE',
  REFRESH_ACCOUNTS: '[TOKEN SWAP] REFRESH ACCOUNTS',
  REFRESH_ACCOUNTS_SUCCESS: '[TOKEN SWAP] REFRESH ACCOUNTS SUCCESS',
  GET_QUOTES: '[TOKEN SWAP] GET QUOTES',
  GET_QUOTES_SUCCESS: '[TOKEN SWAP] GET QUOTES SUCCESS',
  GET_QUOTES_FAILURE: '[TOKEN SWAP] GET QUOTES FAILURE'
}

function goToSwap () {
  return {
    type: tokenSwapActionTypes.GO_TO_SWAP
  }
}

function goToQuotes () {
  return {
    type: tokenSwapActionTypes.GO_TO_QUOTES
  }
}

function resetState () {
  return {
    type: tokenSwapActionTypes.RESET_STATE
  }
}

function loadAccounts () {
  return {
    type: tokenSwapActionTypes.LOAD_ACCOUNTS
  }
}

function loadAccountsSuccess (data) {
  return {
    type: tokenSwapActionTypes.LOAD_ACCOUNTS_SUCCESS,
    data
  }
}

function loadAccountsFailure () {
  return {
    type: tokenSwapActionTypes.LOAD_ACCOUNTS_FAILURE
  }
}

function refreshAccounts () {
  return {
    type: tokenSwapActionTypes.REFRESH_ACCOUNTS
  }
}

function refreshAccountsSuccess (data) {
  return {
    type: tokenSwapActionTypes.REFRESH_ACCOUNTS_SUCCESS,
    data
  }
}

function getQuotes () {
  return {
    type: tokenSwapActionTypes.GET_QUOTES
  }
}

function getQuotesSuccess (data) {
  return {
    type: tokenSwapActionTypes.GET_QUOTES_SUCCESS,
    data
  }
}

function getQuoteFailure (error) {
  return {
    type: tokenSwapActionTypes.GET_QUOTES_FAILURE,
    error
  }
}

export {
  goToSwap,
  goToQuotes,
  resetState,
  loadAccounts,
  loadAccountsSuccess,
  loadAccountsFailure,
  refreshAccounts,
  refreshAccountsSuccess,
  getQuotes,
  getQuotesSuccess,
  getQuoteFailure
}
