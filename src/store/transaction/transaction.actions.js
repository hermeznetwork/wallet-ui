export const transactionActionTypes = {
  GO_TO_CHOOSE_ACCOUNT_STEP: '[TRANSACTION] GO TO CHOOSE ACCOUNT STEP',
  GO_TO_BUILD_TRANSACTION_STEP: '[TRANSACTION GO TO BUILD TRANSACTION STEP',
  GO_TO_REVIEW_TRANSACTION_STEP: '[TRANSACTION] GO TO REVIEW TRANSACTION STEP',
  GO_TO_FINISH_TRANSACTION_STEP: '[TRANSACTION] GO TO FINISH TRANSACTION STEP',
  CHANGE_CURRENT_STEP: '[TRANSACTION] CHANGE CURRENT STEP',
  LOAD_ACCOUNT: '[TRANSACTION] LOAD ACCOUNT',
  LOAD_ACCOUNT_SUCCESS: '[TRANSACTION] LOAD ACCOUNT SUCCESS',
  LOAD_ACCOUNT_FAILURE: '[TRANSACTION] LOAD ACCOUNT FAILURE',
  LOAD_EXIT: '[TRANSACTION] LOAD EXIT',
  LOAD_EXIT_SUCCESS: '[TRANSACTION] LOAD EXIT SUCCESS',
  LOAD_EXIT_FAILURE: '[TRANSACTION] LOAD EXIT FAILURE',
  LOAD_FEES: '[TRANSACTION] LOAD FEES',
  LOAD_FEES_SUCCESS: '[TRANSACTION] LOAD FEES SUCCESS',
  LOAD_FEES_FAILURE: '[TRANSACTION] LOAD FEES FAILURE',
  LOAD_ACCOUNTS: '[TRANSACTION] LOAD ACCOUNTS',
  LOAD_ACCOUNTS_SUCCESS: '[TRANSACTION] LOAD ACCOUNTS SUCCESS',
  LOAD_ACCOUNTS_FAILURE: '[TRANSACTION] LOAD ACCOUNTS FAILURE',
  RESET_STATE: '[TRANSACTION] RESET STATE'
}

function goToChooseAccountStep () {
  return {
    type: transactionActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP
  }
}

function goToBuildTransactionStep (account, receiver) {
  return {
    type: transactionActionTypes.GO_TO_BUILD_TRANSACTION_STEP,
    account,
    receiver
  }
}

function goToReviewTransactionStep (transaction) {
  return {
    type: transactionActionTypes.GO_TO_REVIEW_TRANSACTION_STEP,
    transaction
  }
}

function goToFinishTransactionStep () {
  return {
    type: transactionActionTypes.GO_TO_FINISH_TRANSACTION_STEP
  }
}

function changeCurrentStep (nextStep) {
  return {
    type: transactionActionTypes.CHANGE_CURRENT_STEP,
    nextStep
  }
}

function loadAccounts () {
  return {
    type: transactionActionTypes.LOAD_ACCOUNTS
  }
}

function loadAccountsSuccess (transactionType, data) {
  return {
    type: transactionActionTypes.LOAD_ACCOUNTS_SUCCESS,
    transactionType,
    data
  }
}

function loadAccountsFailure () {
  return {
    type: transactionActionTypes.LOAD_ACCOUNTS_FAILURE
  }
}

function loadAccount () {
  return {
    type: transactionActionTypes.LOAD_ACCOUNT
  }
}

function loadAccountSuccess (account) {
  return {
    type: transactionActionTypes.LOAD_ACCOUNT_SUCCESS,
    account
  }
}

function loadAccountFailure (error) {
  return {
    type: transactionActionTypes.LOAD_ACCOUNT_FAILURE,
    error
  }
}

function loadExit () {
  return {
    type: transactionActionTypes.LOAD_EXIT
  }
}

function loadExitSuccess (account, exit, hermezEthereumAddress) {
  return {
    type: transactionActionTypes.LOAD_EXIT_SUCCESS,
    account,
    exit,
    hermezEthereumAddress
  }
}

function loadExitFailure (error) {
  return {
    type: transactionActionTypes.LOAD_EXIT_FAILURE,
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

function resetState () {
  return {
    type: transactionActionTypes.RESET_STATE
  }
}

export {
  goToChooseAccountStep,
  goToBuildTransactionStep,
  goToReviewTransactionStep,
  goToFinishTransactionStep,
  changeCurrentStep,
  loadAccounts,
  loadAccountsSuccess,
  loadAccountsFailure,
  loadAccount,
  loadAccountSuccess,
  loadAccountFailure,
  loadExit,
  loadExitSuccess,
  loadExitFailure,
  loadFees,
  loadFeesSuccess,
  loadFeesFailure,
  resetState
}
