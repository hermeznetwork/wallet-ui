export const transactionDetailsActionTypes = {
  LOAD_TRANSACTION: '[TRANSACTION DETAILS] LOAD TRANSACTION',
  LOAD_TRANSACTION_SUCCESS: '[TRANSACTION DETAILS] LOAD TRANSACTION SUCCESS',
  LOAD_TRANSACTION_FAILURE: '[TRANSACTION DETAILS] LOAD TRANSACTION FAILURE'
}

function loadTransaction () {
  return {
    type: transactionDetailsActionTypes.LOAD_TRANSACTION
  }
}

function loadTransactionSuccess (transaction) {
  return {
    type: transactionDetailsActionTypes.LOAD_TRANSACTION_SUCCESS,
    transaction
  }
}

function loadTransactionFailure () {
  return {
    type: transactionDetailsActionTypes.LOAD_TRANSACTION_FAILURE
  }
}

export {
  loadTransaction,
  loadTransactionSuccess,
  loadTransactionFailure
}
