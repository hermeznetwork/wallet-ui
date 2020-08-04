export const globalActionTypes = {
  LOAD_TOKENS: '[GLOBAL] LOAD TOKENS',
  LOAD_TOKENS_SUCCESS: '[GLOBAL] LOAD TOKENS SUCCESS',
  LOAD_TOKENS_FAILURE: '[GLOBAL] LOAD TOKENS FAILURE'
}

function loadTokens () {
  return {
    type: globalActionTypes.LOAD_TOKENS
  }
}

function loadTokensSuccess (accounts) {
  return {
    type: globalActionTypes.LOAD_TOKENS_SUCCESS,
    accounts: accounts
  }
}

function loadTokensFailure () {
  return {
    type: globalActionTypes.LOAD_TOKENS_FAILURE
  }
}

export {
  loadTokens,
  loadTokensSuccess,
  loadTokensFailure
}
