import { BigNumber } from "@ethersproject/bignumber";

// domain
import { HermezAccount, PoolTransaction, RecommendedFee } from "src/domain/hermez";
import { EstimatedL1Fee } from "src/domain";

export enum ExitActionTypes {
  GO_TO_BUILD_TRANSACTION_STEP = "[EXIT] GO TO BUILD TRANSACTION STEP",
  GO_TO_REVIEW_TRANSACTION_STEP = "[EXIT] GO TO REVIEW TRANSACTION STEP",
  CHANGE_CURRENT_STEP = "[EXIT] CHANGE CURRENT STEP",
  LOAD_ACCOUNT = "[EXIT] LOAD ACCOUNT",
  LOAD_ACCOUNT_SUCCESS = "[EXIT] LOAD ACCOUNT SUCCESS",
  LOAD_ACCOUNT_FAILURE = "[EXIT] LOAD ACCOUNT FAILURE",
  LOAD_FEES = "[EXIT] LOAD FEES",
  LOAD_FEES_SUCCESS = "[EXIT] LOAD FEES SUCCESS",
  LOAD_FEES_FAILURE = "[EXIT] LOAD FEES FAILURE",
  LOAD_ACCOUNT_BALANCE = "[EXIT] LOAD ACCOUNT BALANCE",
  LOAD_ACCOUNT_BALANCE_SUCCESS = "[EXIT] LOAD ACCOUNT BALANCE SUCCESS",
  LOAD_ACCOUNT_BALANCE_FAILURE = "[EXIT] LOAD ACCOUNT BALANCE FAILURE",
  LOAD_ESTIMATED_WITHDRAW_FEE = "[EXIT] LOAD ESTIMATED WITHDRAW FEE",
  LOAD_ESTIMATED_WITHDRAW_FEE_SUCCESS = "[EXIT] LOAD ESTIMATED WITHDRAW FEE SUCCESS",
  LOAD_ESTIMATED_WITHDRAW_FEE_FAILURE = "[EXIT] LOAD ESTIMATED WITHDRAW FEE FAILURE",
  LOAD_POOL_TRANSACTIONS = "[EXIT] LOAD POOL TRANSACTIONS",
  LOAD_POOL_TRANSACTIONS_SUCCESS = "[EXIT] LOAD POOL TRANSACTIONS SUCCESS",
  LOAD_POOL_TRANSACTIONS_FAILURE = "[EXIT] LOAD POOL TRANSACTIONS FAILURE",
  START_TRANSACTION_APPROVAL = "[EXIT] START TRANSACTION APPROVAL",
  STOP_TRANSACTION_APPROVAL = "[EXIT] STOP TRANSACTION APPROVAL",
  RESET_STATE = "[EXIT] RESET STATE",
}

export interface TransactionToReview {
  amount: BigNumber;
  from: HermezAccount;
  fee: BigNumber;
}

export type Step = "load-account" | "build-transaction" | "review-transaction";

export interface GoToBuildTransactionStep {
  type: ExitActionTypes.GO_TO_BUILD_TRANSACTION_STEP;
  account: HermezAccount;
}

export interface GoToReviewTransactionStep {
  type: ExitActionTypes.GO_TO_REVIEW_TRANSACTION_STEP;
  transaction: TransactionToReview;
}

export interface ChangeCurrentStep {
  type: ExitActionTypes.CHANGE_CURRENT_STEP;
  nextStep: Step;
}

export interface LoadAccount {
  type: ExitActionTypes.LOAD_ACCOUNT;
}

export interface LoadAccountSuccess {
  type: ExitActionTypes.LOAD_ACCOUNT_SUCCESS;
  account: HermezAccount;
}

export interface LoadAccountFailure {
  type: ExitActionTypes.LOAD_ACCOUNT_FAILURE;
  error: string;
}

export interface LoadFees {
  type: ExitActionTypes.LOAD_FEES;
}

export interface LoadFeesSuccess {
  type: ExitActionTypes.LOAD_FEES_SUCCESS;
  fees: RecommendedFee;
}

export interface LoadFeesFailure {
  type: ExitActionTypes.LOAD_FEES_FAILURE;
  error: Error;
}

export interface LoadAccountBalance {
  type: ExitActionTypes.LOAD_ACCOUNT_BALANCE;
}

export interface LoadAccountBalanceSuccess {
  type: ExitActionTypes.LOAD_ACCOUNT_BALANCE_SUCCESS;
  balance: string;
}

export interface LoadAccountBalanceFailure {
  type: ExitActionTypes.LOAD_ACCOUNT_BALANCE_FAILURE;
  error: Error;
}

export interface LoadEstimatedWithdrawFee {
  type: ExitActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE;
}

export interface LoadEstimatedWithdrawFeeSuccess {
  type: ExitActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE_SUCCESS;
  estimatedFee: EstimatedL1Fee;
}

export interface LoadEstimatedWithdrawFeeFailure {
  type: ExitActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE_FAILURE;
  error: Error;
}

export interface LoadPoolTransactions {
  type: ExitActionTypes.LOAD_POOL_TRANSACTIONS;
}

export interface LoadPoolTransactionsSuccess {
  type: ExitActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS;
  transactions: PoolTransaction[];
}

export interface LoadPoolTransactionsFailure {
  type: ExitActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE;
  error: Error;
}

export interface StartTransactionApproval {
  type: ExitActionTypes.START_TRANSACTION_APPROVAL;
}

export interface StopTransactionApproval {
  type: ExitActionTypes.STOP_TRANSACTION_APPROVAL;
}

export interface ResetState {
  type: ExitActionTypes.RESET_STATE;
}

export type ExitAction =
  | GoToBuildTransactionStep
  | GoToReviewTransactionStep
  | ChangeCurrentStep
  | LoadAccount
  | LoadAccountSuccess
  | LoadAccountFailure
  | LoadFees
  | LoadFeesSuccess
  | LoadFeesFailure
  | LoadAccountBalance
  | LoadAccountBalanceSuccess
  | LoadAccountBalanceFailure
  | LoadEstimatedWithdrawFee
  | LoadEstimatedWithdrawFeeSuccess
  | LoadEstimatedWithdrawFeeFailure
  | LoadPoolTransactions
  | LoadPoolTransactionsSuccess
  | LoadPoolTransactionsFailure
  | StartTransactionApproval
  | StopTransactionApproval
  | ResetState;

function goToBuildTransactionStep(account: HermezAccount): GoToBuildTransactionStep {
  return {
    type: ExitActionTypes.GO_TO_BUILD_TRANSACTION_STEP,
    account,
  };
}

function goToReviewTransactionStep(transaction: TransactionToReview): GoToReviewTransactionStep {
  return {
    type: ExitActionTypes.GO_TO_REVIEW_TRANSACTION_STEP,
    transaction,
  };
}

function changeCurrentStep(nextStep: Step): ChangeCurrentStep {
  return {
    type: ExitActionTypes.CHANGE_CURRENT_STEP,
    nextStep,
  };
}

function loadAccount(): LoadAccount {
  return {
    type: ExitActionTypes.LOAD_ACCOUNT,
  };
}

function loadAccountSuccess(account: HermezAccount): LoadAccountSuccess {
  return {
    type: ExitActionTypes.LOAD_ACCOUNT_SUCCESS,
    account,
  };
}

function loadAccountFailure(error: string): LoadAccountFailure {
  return {
    type: ExitActionTypes.LOAD_ACCOUNT_FAILURE,
    error,
  };
}

function loadFees(): LoadFees {
  return {
    type: ExitActionTypes.LOAD_FEES,
  };
}

function loadFeesSuccess(fees: RecommendedFee): LoadFeesSuccess {
  return {
    type: ExitActionTypes.LOAD_FEES_SUCCESS,
    fees,
  };
}

function loadFeesFailure(error: Error): LoadFeesFailure {
  return {
    type: ExitActionTypes.LOAD_FEES_FAILURE,
    error,
  };
}

function loadAccountBalance(): LoadAccountBalance {
  return {
    type: ExitActionTypes.LOAD_ACCOUNT_BALANCE,
  };
}

function loadAccountBalanceSuccess(balance: string): LoadAccountBalanceSuccess {
  return {
    type: ExitActionTypes.LOAD_ACCOUNT_BALANCE_SUCCESS,
    balance,
  };
}

function loadAccountBalanceFailure(error: Error): LoadAccountBalanceFailure {
  return {
    type: ExitActionTypes.LOAD_ACCOUNT_BALANCE_FAILURE,
    error,
  };
}

function loadEstimatedWithdrawFee(): LoadEstimatedWithdrawFee {
  return {
    type: ExitActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE,
  };
}

function loadEstimatedWithdrawFeeSuccess(
  estimatedFee: EstimatedL1Fee
): LoadEstimatedWithdrawFeeSuccess {
  return {
    type: ExitActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE_SUCCESS,
    estimatedFee,
  };
}

function loadEstimatedWithdrawFeeFailure(error: Error): LoadEstimatedWithdrawFeeFailure {
  return {
    type: ExitActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE_FAILURE,
    error,
  };
}

function loadPoolTransactions(): LoadPoolTransactions {
  return {
    type: ExitActionTypes.LOAD_POOL_TRANSACTIONS,
  };
}

function loadPoolTransactionsSuccess(transactions: PoolTransaction[]): LoadPoolTransactionsSuccess {
  return {
    type: ExitActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS,
    transactions,
  };
}

function loadPoolTransactionsFailure(error: Error): LoadPoolTransactionsFailure {
  return {
    type: ExitActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE,
    error,
  };
}

function startTransactionApproval(): StartTransactionApproval {
  return {
    type: ExitActionTypes.START_TRANSACTION_APPROVAL,
  };
}

function stopTransactionApproval(): StopTransactionApproval {
  return {
    type: ExitActionTypes.STOP_TRANSACTION_APPROVAL,
  };
}

function resetState(): ResetState {
  return {
    type: ExitActionTypes.RESET_STATE,
  };
}

export {
  goToBuildTransactionStep,
  goToReviewTransactionStep,
  changeCurrentStep,
  loadPoolTransactions,
  loadPoolTransactionsSuccess,
  loadPoolTransactionsFailure,
  loadAccount,
  loadAccountSuccess,
  loadAccountFailure,
  loadFees,
  loadFeesSuccess,
  loadFeesFailure,
  loadAccountBalance,
  loadAccountBalanceSuccess,
  loadAccountBalanceFailure,
  loadEstimatedWithdrawFee,
  loadEstimatedWithdrawFeeSuccess,
  loadEstimatedWithdrawFeeFailure,
  startTransactionApproval,
  stopTransactionApproval,
  resetState,
};
