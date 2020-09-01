export const accountActionTypes = {
  LOAD_METAMASK_WALLET: '[ACCOUNT] LOAD METAMASK WALLET',
  LOAD_METAMASK_WALLET_SUCCESS: '[ACCOUNT] LOAD METAMASK WALLET SUCCESS',
  LOAD_METAMASK_WALLET_FAILURE: '[ACCOUNT] LOAD METAMASK WALLET FAILURE',
  ACCOUNT_INFO: '[ACCOUNT] ACCOUNT INFO',
  ACCOUNT_INFO_SUCCESS: '[ACCOUNT] ACCOUNT INFO SUCCESS',
  ACCOUNT_INFO_FAILURE: '[ACCOUNT] ACCOUNT INFO FAILURE'
}

function loadMetamaskWallet () {
  return {
    type: accountActionTypes.LOAD_METAMASK_WALLET
  }
}

function loadMetamaskWalletSuccess (metaMaskWallet) {
  return {
    type: accountActionTypes.LOAD_METAMASK_WALLET_SUCCESS,
    metaMaskWallet
  }
}

function loadMetamaskWalletFailure (error) {
  return {
    type: accountActionTypes.LOAD_METAMASK_WALLET_FAILURE,
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
  loadMetamaskWallet,
  loadMetamaskWalletSuccess,
  loadMetamaskWalletFailure,
  loadAccountInfo,
  loadAccountInfoSuccess,
  loadAccountInfoFailure
}
