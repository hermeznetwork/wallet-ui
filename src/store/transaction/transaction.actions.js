export const transactionActionTypes = {
  LOAD_TOKENS: '[TRANSACTION] LOAD TOKENS',
  LOAD_TOKENS_SUCCESS: '[TRANSACTION] LOAD TOKENS SUCCESS',
  LOAD_TOKENS_FAILURE: '[TRANSACTION] LOAD TOKENS FAILURE',
  LOAD_ACCOUNTS: '[TRANSACTION] LOAD ACCOUNTS',
  LOAD_ACCOUNTS_SUCCESS: '[TRANSACTION] LOAD ACCOUNTS SUCCESS',
  LOAD_ACCOUNTS_FAILURE: '[TRANSACTION] LOAD ACCOUNTS FAILURE',
  LOAD_METAMASK_TOKENS: '[TRANSACTION] LOAD METAMASK TOKENS',
  LOAD_METAMASK_TOKENS_SUCCESS: '[TRANSACTION] LOAD METAMASK TOKENS SUCCESS',
  LOAD_METAMASK_TOKENS_FAILURE: '[TRANSACTION] LOAD METAMASK TOKENS FAILURE',
  LOAD_FEES: '[TRANSACTION] LOAD FEES',
  LOAD_FEES_SUCCESS: '[TRANSACTION] LOAD FEES SUCCESS',
  LOAD_FEES_FAILURE: '[TRANSACTION] LOAD FEES FAILURE',
  LOAD_EXIT: '[TRANSACTION] LOAD EXIT',
  LOAD_EXIT_SUCCESS: '[TRANSACTION] LOAD EXIT SUCCESS',
  LOAD_EXIT_FAILURE: '[TRANSACTION] LOAD EXIT FAILURE',
  RESET_STATE: '[TRANSACTION] RESET STATE'
}

function loadTokens () {
  return {
    type: transactionActionTypes.LOAD_TOKENS
  }
}

function loadTokensSuccess (tokens) {
  return {
    type: transactionActionTypes.LOAD_TOKENS_SUCCESS,
    tokens
  }
}

function loadTokensFailure () {
  return {
    type: transactionActionTypes.LOAD_TOKENS_FAILURE
  }
}

function loadAccounts () {
  return {
    type: transactionActionTypes.LOAD_ACCOUNTS
  }
}

function loadAccountsSuccess (data) {
  return {
    type: transactionActionTypes.LOAD_ACCOUNTS_SUCCESS,
    data
  }
}

function loadAccountsFailure () {
  return {
    type: transactionActionTypes.LOAD_ACCOUNTS_FAILURE
  }
}

function loadMetaMaskTokens () {
  return {
    type: transactionActionTypes.LOAD_METAMASK_TOKENS
  }
}

function loadMetaMaskTokensSuccess (metaMaskTokens) {
  return {
    type: transactionActionTypes.LOAD_METAMASK_TOKENS_SUCCESS,
    metaMaskTokens
  }
}

function loadMetaMaskTokensFailure (error) {
  return {
    type: transactionActionTypes.LOAD_METAMASK_TOKENS_FAILURE,
    error
  }
}

function loadFees () {
  return {
    type: transactionActionTypes.LOAD_FEES
  }
}

function loadFeesSuccess (fees) {
  return {
    type: transactionActionTypes.LOAD_FEES_SUCCESS,
    fees
  }
}

function loadFeesFailure (error) {
  return {
    type: transactionActionTypes.LOAD_FEES_FAILURE,
    error
  }
}

function loadExit () {
  return {
    type: transactionActionTypes.LOAD_EXIT
  }
}

function loadExitSuccess (exit) {
  return {
    type: transactionActionTypes.LOAD_EXIT_SUCCESS,
    exit
  }
}

function loadExitFailure (error) {
  return {
    type: transactionActionTypes.LOAD_EXIT_FAILURE,
    error
  }
}

function resetState () {
  return {
    type: transactionActionTypes.RESET_STATE
  }
}

export {
  loadTokens,
  loadTokensSuccess,
  loadTokensFailure,
  loadAccounts,
  loadAccountsSuccess,
  loadAccountsFailure,
  loadMetaMaskTokens,
  loadMetaMaskTokensSuccess,
  loadMetaMaskTokensFailure,
  loadFees,
  loadFeesSuccess,
  loadFeesFailure,
  loadExit,
  loadExitSuccess,
  loadExitFailure,
  resetState
}
