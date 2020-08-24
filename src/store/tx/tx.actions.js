export const txActionTypes = {
  DEPOSIT: '[TX] DEPOSIT',
  DEPOSIT_SUCCESS: '[TX] DEPOSIT_SUCCESS',
  DEPOSIT_FAILURE: '[TX] DEPOSIT_FAILURE',
  WITHDRAW: '[TX] WITHDRAW',
  WITHDRAW_SUCCESS: '[TX] WITHDRAW_SUCCESS',
  WITHDRAW_FAILURE: '[TX] WITHDRAW_FAILURE',
  TRANSFER: '[TX] TRANSFER',
  TRANSFER_SUCCESS: '[TX] TRANSFER_SUCCESS',
  TRANSFER_FAILURE: '[TX] TRANSFER_FAILURE',
  EXIT: '[TX] EXIT',
  EXIT_SUCCESS: '[TX] EXIT_SUCCESS',
  EXIT_FAILURE: '[TX] EXIT_FAILURE',
  FORCE_EXIT: '[TX] FORCE_EXIT',
  FORCE_EXIT_SUCCESS: '[TX] FORCE_EXIT_SUCCESS',
  FORCE_EXIT_FAILURE: '[TX] FORCE_EXIT_FAILURE',
  APPROVE_TOKENS: '[TX] APPROVE_TOKENS',
  APPROVE_TOKENS_SUCCESS: '[TX] APPROVE_TOKENS_SUCCESS',
  APPROVE_TOKENS_FAILURE: '[TX] APPROVE_TOKENS_FAILURE',
  FETCH_TOKENS: '[TX] FETCH_TOKENS',
  FETCH_TOKENS_SUCCESS: '[TX] FETCH_TOKENS_SUCCESS',
  FETCH_TOKENS_FAILURE: '[TX] FETCH_TOKENS_FAILURE'
}

function deposit () {
  return {
    type: txActionTypes.DEPOSIT
  }
}

function depositSuccess (tx, currentBatch) {
  return {
    type: txActionTypes.DEPOSIT_SUCCESS,
    depositInfo: { tx, currentBatch }
  }
}

function depositFailure (error) {
  return {
    type: txActionTypes.DEPOSIT_FAILURE,
    error
  }
}

function withdraw () {
  return {
    type: txActionTypes.WITHDRAW
  }
}

function withdrawSuccess (tx, currentBatch) {
  return {
    type: txActionTypes.WITHDRAW_SUCCESS,
    withdrawInfo: { tx, currentBatch }
  }
}

function withdrawFailure (error) {
  return {
    type: txActionTypes.WITHDRAW_FAILURE,
    error
  }
}

function forceExit () {
  return {
    type: txActionTypes.FORCE_EXIT
  }
}

function forceExitSuccess (tx, currentBatch) {
  return {
    type: txActionTypes.FORCE_EXIT_SUCCESS,
    forceExitInfo: { tx, currentBatch }
  }
}

function forceExitFailure (error) {
  return {
    type: txActionTypes.FORCE_EXIT_FAILURE,
    error
  }
}

function transfer () {
  return {
    type: txActionTypes.TRANSFER
  }
}

function transferSuccess (nonce, currentBatch) {
  return {
    type: txActionTypes.TRANSFER_SUCCESS,
    transferInfo: { nonce, currentBatch }
  }
}

function transferFailure (error) {
  return {
    type: txActionTypes.TRANSFER_FAILURE,
    error
  }
}

function approveTokens () {
  return {
    type: txActionTypes.APPROVE_TOKENS
  }
}

function approveTokensSuccess (tx) {
  return {
    type: txActionTypes.APPROVE_TOKENS_SUCCESS,
    approveInfo: { tx }
  }
}

function approveTokensFailure (error) {
  return {
    type: txActionTypes.APPROVE_TOKENS_FAILURE,
    error
  }
}

function fetchTokens () {
  return {
    type: txActionTypes.FETCH_TOKENS
  }
}

function fetchTokensSuccess (tx) {
  return {
    type: txActionTypes.FETCH_TOKENS_SUCCESS,
    fetchTokensInfo: { tx }
  }
}

function fetchTokensFailure (error) {
  return {
    type: txActionTypes.FETCH_TOKENS_FAILURE,
    error
  }
}

export {
  deposit,
  depositSuccess,
  depositFailure,
  withdraw,
  withdrawSuccess,
  withdrawFailure,
  forceExit,
  forceExitSuccess,
  forceExitFailure,
  transfer,
  transferSuccess,
  transferFailure,
  approveTokens,
  approveTokensSuccess,
  approveTokensFailure,
  fetchTokens,
  fetchTokensSuccess,
  fetchTokensFailure
}
