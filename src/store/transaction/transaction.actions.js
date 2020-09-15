export const transactionActionTypes = {
  LOAD_METAMASK_TOKENS: '[TRANSACTION] LOAD METAMASK TOKENS',
  LOAD_METAMASK_TOKENS_SUCCESS: '[TRANSACTION] LOAD METAMASK TOKENS SUCCESS',
  LOAD_METAMASK_TOKENS_FAILURE: '[TRANSACTION] LOAD METAMASK TOKENS FAILURE'
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

export {
  loadMetaMaskTokens,
  loadMetaMaskTokensSuccess,
  loadMetaMaskTokensFailure
}
