export const txActionTypes = {
  DEPOSIT: '[TX] DEPOSIT',
  DEPOSIT_SUCCESS: '[TX] DEPOSIT SUCCESS',
  DEPOSIT_FAILURE: '[TX] DEPOSIT FAILURE',
  WITHDRAW: '[TX] WITHDRAW',
  WITHDRAW_SUCCESS: '[TX] WITHDRAW SUCCESS',
  WITHDRAW_FAILURE: '[TX] WITHDRAW FAILURE',
  TRANSFER: '[TX] TRANSFER',
  TRANSFER_SUCCESS: '[TX] TRANSFER SUCCESS',
  TRANSFER_FAILURE: '[TX] TRANSFER FAILURE',
  EXIT: '[TX] EXIT',
  EXIT_SUCCESS: '[TX] EXIT SUCCESS',
  EXIT_FAILURE: '[TX] EXIT FAILURE',
  FORCE_EXIT: '[TX] FORCE_EXIT',
  FORCE_EXIT_SUCCESS: '[TX] FORCE EXIT SUCCESS',
  FORCE_EXIT_FAILURE: '[TX] FORCE EXIT FAILURE',
  APPROVE_TOKENS: '[TX] APPROVE TOKENS',
  APPROVE_TOKENS_SUCCESS: '[TX] APPROVE TOKENS SUCCESS',
  APPROVE_TOKENS_FAILURE: '[TX] APPROVE TOKENS FAILURE',
  FETCH_TOKENS: '[TX] FETCH TOKENS',
  FETCH_TOKENS_SUCCESS: '[TX] FETCH TOKENS SUCCESS',
  FETCH_TOKENS_FAILURE: '[TX] FETCH TOKENS FAILURE'
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
