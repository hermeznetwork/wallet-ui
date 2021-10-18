import { BigNumber } from "@ethersproject/bignumber";

// domain
import { Account, PooledTransaction, RecommendedFee } from "src/domain/hermez";
import { EstimatedWithdrawFee } from "src/domain";

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
  LOAD_ESTIMATED_WITHDRAW_FEE = "[EXIT] LOAD ESTIMATED WITHDRAW FEE",
  LOAD_ESTIMATED_WITHDRAW_FEE_SUCCESS = "[EXIT] LOAD ESTIMATED WITHDRAW FEE SUCCESS",
  LOAD_ESTIMATED_WITHDRAW_FEE_FAILURE = "[EXIT] LOAD ESTIMATED WITHDRAW FEE FAILURE",
  LOAD_POOLED_TRANSACTIONS = "[EXIT] LOAD POOLED TRANSACTIONS",
  LOAD_POOLED_TRANSACTIONS_SUCCESS = "[EXIT] LOAD POOLED TRANSACTIONS SUCCESS",
  LOAD_POOLED_TRANSACTIONS_FAILURE = "[EXIT] LOAD POOLED TRANSACTIONS FAILURE",
  START_TRANSACTION_APPROVAL = "[EXIT] START TRANSACTION APPROVAL",
  STOP_TRANSACTION_APPROVAL = "[EXIT] STOP TRANSACTION APPROVAL",
  RESET_STATE = "[EXIT] RESET STATE",
}

export type Step = "load-account" | "build-transaction" | "review-transaction";

export interface GoToBuildTransactionStep {
  type: ExitActionTypes.GO_TO_BUILD_TRANSACTION_STEP;
  account: Account;
}

export interface TransactionToReview {
  amount: BigNumber;
  fee: number;
  from: Account;
  to: Partial<Account>;
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
  account: Account;
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

export interface LoadEstimatedWithdrawFee {
  type: ExitActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE;
}

export interface LoadEstimatedWithdrawFeeSuccess {
  type: ExitActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE_SUCCESS;
  estimatedFee: EstimatedWithdrawFee;
}

export interface LoadEstimatedWithdrawFeeFailure {
  type: ExitActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE_FAILURE;
  error: Error;
}

export interface LoadPooledTransactions {
  type: ExitActionTypes.LOAD_POOLED_TRANSACTIONS;
}

export interface LoadPooledTransactionsSuccess {
  type: ExitActionTypes.LOAD_POOLED_TRANSACTIONS_SUCCESS;
  transactions: PooledTransaction[];
}

export interface LoadPooledTransactionsFailure {
  type: ExitActionTypes.LOAD_POOLED_TRANSACTIONS_FAILURE;
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
  | LoadEstimatedWithdrawFee
  | LoadEstimatedWithdrawFeeSuccess
  | LoadEstimatedWithdrawFeeFailure
  | LoadPooledTransactions
  | LoadPooledTransactionsSuccess
  | LoadPooledTransactionsFailure
  | StartTransactionApproval
  | StopTransactionApproval
  | ResetState;

function goToBuildTransactionStep(account: Account): GoToBuildTransactionStep {
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

function loadAccountSuccess(account: Account): LoadAccountSuccess {
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

function loadEstimatedWithdrawFee(): LoadEstimatedWithdrawFee {
  return {
    type: ExitActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE,
  };
}

function loadEstimatedWithdrawFeeSuccess(
  estimatedFee: EstimatedWithdrawFee
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

function loadPooledTransactions(): LoadPooledTransactions {
  return {
    type: ExitActionTypes.LOAD_POOLED_TRANSACTIONS,
  };
}

function loadPooledTransactionsSuccess(
  transactions: PooledTransaction[]
): LoadPooledTransactionsSuccess {
  return {
    type: ExitActionTypes.LOAD_POOLED_TRANSACTIONS_SUCCESS,
    transactions,
  };
}

function loadPooledTransactionsFailure(error: Error): LoadPooledTransactionsFailure {
  return {
    type: ExitActionTypes.LOAD_POOLED_TRANSACTIONS_FAILURE,
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
  loadPooledTransactions,
  loadPooledTransactionsSuccess,
  loadPooledTransactionsFailure,
  loadAccount,
  loadAccountSuccess,
  loadAccountFailure,
  loadFees,
  loadFeesSuccess,
  loadFeesFailure,
  loadEstimatedWithdrawFee,
  loadEstimatedWithdrawFeeSuccess,
  loadEstimatedWithdrawFeeFailure,
  startTransactionApproval,
  stopTransactionApproval,
  resetState,
};
