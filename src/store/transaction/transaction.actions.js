export const transactionActionTypes = {
  GO_TO_CHOOSE_ACCOUNT_STEP: '[TRANSACTION] GO TO CHOOSE ACCOUNT STEP',
  GO_TO_BUILD_TRANSACTION_STEP: '[TRANSACTION GO TO BUILD TRANSACTION STEP',
  GO_TO_REVIEW_TRANSACTION_STEP: '[TRANSACTION] GO TO REVIEW TRANSACTION STEP',
  GO_TO_FINISH_TRANSACTION_STEP: '[TRANSACTION] GO TO FINISH TRANSACTION STEP',
  GO_TO_TRANSACTION_ERROR_STEP: '[TRANSACTION] GO TO TRANSACTION ERROR STEP',
  CHANGE_CURRENT_STEP: '[TRANSACTION] CHANGE CURRENT STEP',
  LOAD_ACCOUNT: '[TRANSACTION] LOAD ACCOUNT',
  LOAD_ACCOUNT_SUCCESS: '[TRANSACTION] LOAD ACCOUNT SUCCESS',
  LOAD_ACCOUNT_FAILURE: '[TRANSACTION] LOAD ACCOUNT FAILURE',
  LOAD_EXIT: '[TRANSACTION] LOAD EXIT',
  LOAD_EXIT_SUCCESS: '[TRANSACTION] LOAD EXIT SUCCESS',
  LOAD_EXIT_FAILURE: '[TRANSACTION] LOAD EXIT FAILURE',
  LOAD_ACCOUNT_BALANCE: '[TRANSACTION] LOAD ACCOUNT BALANCE',
  LOAD_ACCOUNT_BALANCE_SUCCESS: '[TRANSACTION] LOAD ACCOUNT BALANCE SUCCESS',
  LOAD_ACCOUNT_BALANCE_FAILURE: '[TRANSACTION] LOAD ACCOUNT BALANCE FAILURE',
  LOAD_FEES: '[TRANSACTION] LOAD FEES',
  LOAD_FEES_SUCCESS: '[TRANSACTION] LOAD FEES SUCCESS',
  LOAD_FEES_FAILURE: '[TRANSACTION] LOAD FEES FAILURE',
  LOAD_POOL_TRANSACTIONS: '[TRANSACTION] LOAD POOL TRANSACTIONS',
  LOAD_POOL_TRANSACTIONS_SUCCESS: '[TRANSACTION] LOAD POOL TRANSACTIONS SUCCESS',
  LOAD_POOL_TRANSACTIONS_FAILURE: '[TRANSACTION] LOAD POOL TRANSACTIONS FAILURE',
  LOAD_ACCOUNTS: '[TRANSACTION] LOAD ACCOUNTS',
  LOAD_ACCOUNTS_SUCCESS: '[TRANSACTION] LOAD ACCOUNTS SUCCESS',
  LOAD_ACCOUNTS_FAILURE: '[TRANSACTION] LOAD ACCOUNTS FAILURE',
  LOAD_ESTIMATED_WITHDRAW_FEE: '[TRANSACTION] LOAD ESTIMATED WITHDRAW FEE',
  LOAD_ESTIMATED_WITHDRAW_FEE_SUCCESS: '[TRANSACTION] LOAD ESTIMATED WITHDRAW FEE SUCCESS',
  LOAD_ESTIMATED_WITHDRAW_FEE_FAILURE: '[TRANSACTION] LOAD ESTIMATED WITHDRAW FEE FAILURE',
  START_TRANSACTION_SIGNING: '[TRANSACTION] START TRANSACTION SIGNING',
  STOP_TRANSACTION_SIGNING: '[TRANSACTION] STOP TRANSACTION SIGNING',
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

function goToTransactionErrorStep () {
  return {
    type: transactionActionTypes.GO_TO_TRANSACTION_ERROR_STEP
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

function loadPoolTransactions () {
  return {
    type: transactionActionTypes.LOAD_POOL_TRANSACTIONS
  }
}

function loadPoolTransactionsSuccess (transactions) {
  return {
    type: transactionActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS,
    transactions
  }
}

function loadPoolTransactionsFailure () {
  return {
    type: transactionActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE
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

function loadAccountBalance () {
  return {
    type: transactionActionTypes.LOAD_ACCOUNT_BALANCE
  }
}

function loadAccountBalanceSuccess (accountBalance) {
  return {
    type: transactionActionTypes.LOAD_ACCOUNT_BALANCE_SUCCESS,
    accountBalance
  }
}

function loadAccountBalanceFailure () {
  return {
    type: transactionActionTypes.LOAD_ACCOUNT_BALANCE_FAILURE
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

function loadEstimatedWithdrawFee () {
  return {
    type: transactionActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE
  }
}

function loadEstimatedWithdrawFeeSuccess (estimatedFee) {
  return {
    type: transactionActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE_SUCCESS,
    estimatedFee
  }
}

function loadEstimatedWithdrawFeeFailure (error) {
  return {
    type: transactionActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE_FAILURE,
    error
  }
}

function startTransactionSigning () {
  return {
    type: transactionActionTypes.START_TRANSACTION_SIGNING
  }
}

function stopTransactionSigning () {
  return {
    type: transactionActionTypes.STOP_TRANSACTION_SIGNING
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
  goToTransactionErrorStep,
  changeCurrentStep,
  loadAccounts,
  loadAccountsSuccess,
  loadAccountsFailure,
  loadPoolTransactions,
  loadPoolTransactionsSuccess,
  loadPoolTransactionsFailure,
  loadAccount,
  loadAccountSuccess,
  loadAccountFailure,
  loadExit,
  loadExitSuccess,
  loadExitFailure,
  loadAccountBalance,
  loadAccountBalanceSuccess,
  loadAccountBalanceFailure,
  loadFees,
  loadFeesSuccess,
  loadFeesFailure,
  loadEstimatedWithdrawFee,
  loadEstimatedWithdrawFeeSuccess,
  loadEstimatedWithdrawFeeFailure,
  startTransactionSigning,
  stopTransactionSigning,
  resetState
}
