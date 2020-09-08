export const depositActionTypes = {
  LOAD_METAMASK_TOKENS: '[DEPOSIT] LOAD METAMASK TOKENS',
  LOAD_METAMASK_TOKENS_SUCCESS: '[DEPOSIT] LOAD METAMASK TOKENS SUCCESS',
  LOAD_METAMASK_TOKENS_FAILURE: '[DEPOSIT] LOAD METAMASK TOKENS FAILURE'
}

function loadMetaMaskTokens () {
  return {
    type: depositActionTypes.LOAD_METAMASK_TOKENS
  }
}

function loadMetaMaskTokensSuccess (metaMaskTokens) {
  return {
    type: depositActionTypes.LOAD_METAMASK_TOKENS_SUCCESS,
    metaMaskTokens
  }
}

function loadMetaMaskTokensFailure (error) {
  return {
    type: depositActionTypes.LOAD_METAMASK_TOKENS_FAILURE,
    error
  }
}

export {
  loadMetaMaskTokens,
  loadMetaMaskTokensSuccess,
  loadMetaMaskTokensFailure
}
