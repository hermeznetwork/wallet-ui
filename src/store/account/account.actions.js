export const accountActionTypes = {
  LOAD_METAMASK: '[ACCOUNT] LOAD_METAMASK',
  LOAD_METAMASK_SUCCESS: '[ACCOUNT] LOAD_METAMASK_SUCCESS',
  LOAD_METAMASK_FAILURE: '[ACCOUNT] LOAD_METAMASK_FAILURE',
  ACCOUNT_INFO: '[ACCOUNT] ACCOUNT_INFO',
  ACCOUNT_INFO_SUCCESS: '[ACCOUNT] ACCOUNT_INFO_SUCCESS',
  ACCOUNT_INFO_FAILURE: '[ACCOUNT] ACCOUNT_INFO_FAILURE'
}

function loadMetamask () {
  return {
    type: accountActionTypes.LOAD_METAMASK
  }
}

function loadMetamaskSuccess (metamaskWallet) {
  return {
    type: accountActionTypes.LOAD_METAMASK_SUCCESS,
    metamaskWallet: metamaskWallet
  }
}

function loadMetamaskFailure (error) {
  return {
    type: accountActionTypes.LOAD_METAMASK_FAILURE,
    error
  }
}

function loadAccountInfo () {
  return {
    type: accountActionTypes.ACCOUNT_INFO
  }
}

function loadAccountInfoSuccess (balance, tokensList, tokens, tokensRollup, tokensApproved, tokensExit, tokensTotal, txs, txsExits, tokensArray, tokensApprovedArray, tokensRollupArray) {
  return {
    type: accountActionTypes.ACCOUNT_INFO_SUCCESS,
    accountInfo: {
      balance,
      tokensList,
      tokens,
      tokensRollup,
      tokensApproved,
      tokensExit,
      tokensTotal,
      txs,
      txsExits,
      tokensArray,
      tokensApprovedArray,
      tokensRollupArray
    }
  }
}

function loadAccountInfoFailure (error) {
  return {
    type: accountActionTypes.ACCOUNT_INFO_FAILURE,
    error
  }
}

export {
  loadMetamask,
  loadMetamaskSuccess,
  loadMetamaskFailure,
  loadAccountInfo,
  loadAccountInfoSuccess,
  loadAccountInfoFailure
}
