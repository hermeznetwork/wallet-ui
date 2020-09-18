export const transactionActionTypes = {
  LOAD_METAMASK_TOKENS: '[TRANSACTION] LOAD METAMASK TOKENS',
  LOAD_METAMASK_TOKENS_SUCCESS: '[TRANSACTION] LOAD METAMASK TOKENS SUCCESS',
  LOAD_METAMASK_TOKENS_FAILURE: '[TRANSACTION] LOAD METAMASK TOKENS FAILURE',
  LOAD_FEES: '[TRANSACTION] LOAD FEES',
  LOAD_FEES_SUCCESS: '[TRANSACTION] LOAD FEES SUCCESS',
  LOAD_FEES_FAILURE: '[TRANSACTION] LOAD FEESFAILURE'
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

export {
  loadMetaMaskTokens,
  loadMetaMaskTokensSuccess,
  loadMetaMaskTokensFailure,
  loadFees,
  loadFeesSuccess,
  loadFeesFailure
}
