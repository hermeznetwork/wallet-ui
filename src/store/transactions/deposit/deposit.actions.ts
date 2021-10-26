import { BigNumber } from "@ethersproject/bignumber";

// domain
import { EstimatedDepositFee } from "src/domain";
import { Account, PoolTransaction, RecommendedFee } from "src/domain/hermez";
// persistence
import { Accounts } from "src/persistence";

export enum DepositActionTypes {
  GO_TO_CHOOSE_ACCOUNT_STEP = "[DEPOSIT] GO TO CHOOSE ACCOUNT STEP",
  GO_TO_BUILD_TRANSACTION_STEP = "[DEPOSIT] GO TO BUILD TRANSACTION STEP",
  GO_TO_REVIEW_TRANSACTION_STEP = "[DEPOSIT] GO TO REVIEW TRANSACTION STEP",
  CHANGE_CURRENT_STEP = "[DEPOSIT] CHANGE CURRENT STEP",
  LOAD_ACCOUNTS = "[DEPOSIT] LOAD ACCOUNTS",
  LOAD_ACCOUNTS_SUCCESS = "[DEPOSIT] LOAD ACCOUNTS SUCCESS",
  LOAD_ACCOUNTS_FAILURE = "[DEPOSIT] LOAD ACCOUNTS FAILURE",
  LOAD_POOL_TRANSACTIONS = "[DEPOSIT] LOAD POOL TRANSACTIONS",
  LOAD_POOL_TRANSACTIONS_SUCCESS = "[DEPOSIT] LOAD POOL TRANSACTIONS SUCCESS",
  LOAD_POOL_TRANSACTIONS_FAILURE = "[DEPOSIT] LOAD POOL TRANSACTIONS FAILURE",
  LOAD_ACCOUNT = "[DEPOSIT] LOAD ACCOUNT",
  LOAD_ACCOUNT_SUCCESS = "[DEPOSIT] LOAD ACCOUNT SUCCESS",
  LOAD_ACCOUNT_FAILURE = "[DEPOSIT] LOAD ACCOUNT FAILURE",
  LOAD_FEES = "[DEPOSIT] LOAD FEES",
  LOAD_FEES_SUCCESS = "[DEPOSIT] LOAD FEES SUCCESS",
  LOAD_FEES_FAILURE = "[DEPOSIT] LOAD FEES FAILURE",
  LOAD_ESTIMATED_DEPOSIT_FEE = "[DEPOSIT] LOAD ESTIMATED DEPOSIT FEE",
  LOAD_ESTIMATED_DEPOSIT_FEE_SUCCESS = "[DEPOSIT] LOAD ESTIMATED DEPOSIT FEE SUCCESS",
  LOAD_ESTIMATED_DEPOSIT_FEE_FAILURE = "[DEPOSIT] LOAD ESTIMATED DEPOSIT FEE FAILURE",
  START_TRANSACTION_APPROVAL = "[DEPOSIT] START TRANSACTION APPROVAL",
  STOP_TRANSACTION_APPROVAL = "[DEPOSIT] STOP TRANSACTION APPROVAL",
  RESET_STATE = "[DEPOSIT] RESET STATE",
}

export type Step = "load-account" | "choose-account" | "build-transaction" | "review-transaction";

export interface GoToChooseAccountStep {
  type: DepositActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP;
}

export interface GoToBuildTransactionStep {
  type: DepositActionTypes.GO_TO_BUILD_TRANSACTION_STEP;
  account: Account;
}

export interface TransactionToReview {
  amount: BigNumber;
  fee: number;
  from: Account;
  to: Partial<Account>;
}

export interface GoToReviewTransactionStep {
  type: DepositActionTypes.GO_TO_REVIEW_TRANSACTION_STEP;
  transaction: TransactionToReview;
}

export interface ChangeCurrentStep {
  type: DepositActionTypes.CHANGE_CURRENT_STEP;
  nextStep: Step;
}

export interface LoadAccounts {
  type: DepositActionTypes.LOAD_ACCOUNTS;
}

export interface LoadAccountsSuccess {
  type: DepositActionTypes.LOAD_ACCOUNTS_SUCCESS;
  accounts: Accounts;
}

export interface LoadAccountsFailure {
  type: DepositActionTypes.LOAD_ACCOUNTS_FAILURE;
  error: Error;
}

export interface LoadPoolTransactions {
  type: DepositActionTypes.LOAD_POOL_TRANSACTIONS;
}

export interface LoadPoolTransactionsSuccess {
  type: DepositActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS;
  transactions: PoolTransaction[];
}

export interface LoadPoolTransactionsFailure {
  type: DepositActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE;
  error: Error;
}

export interface LoadAccount {
  type: DepositActionTypes.LOAD_ACCOUNT;
}

export interface LoadAccountSuccess {
  type: DepositActionTypes.LOAD_ACCOUNT_SUCCESS;
  account: Account;
}

export interface LoadAccountFailure {
  type: DepositActionTypes.LOAD_ACCOUNT_FAILURE;
  error: string;
}

export interface LoadFees {
  type: DepositActionTypes.LOAD_FEES;
}

export interface LoadFeesSuccess {
  type: DepositActionTypes.LOAD_FEES_SUCCESS;
  fees: RecommendedFee;
}

export interface LoadFeesFailure {
  type: DepositActionTypes.LOAD_FEES_FAILURE;
  error: Error;
}

export interface LoadEstimatedDepositFee {
  type: DepositActionTypes.LOAD_ESTIMATED_DEPOSIT_FEE;
}

export interface LoadEstimatedDepositFeeSuccess {
  type: DepositActionTypes.LOAD_ESTIMATED_DEPOSIT_FEE_SUCCESS;
  estimatedFee: EstimatedDepositFee;
}

export interface LoadEstimatedDepositFeeFailure {
  type: DepositActionTypes.LOAD_ESTIMATED_DEPOSIT_FEE_FAILURE;
  error: Error;
}

export interface StartTransactionApproval {
  type: DepositActionTypes.START_TRANSACTION_APPROVAL;
}

export interface StopTransactionApproval {
  type: DepositActionTypes.STOP_TRANSACTION_APPROVAL;
}

export interface ResetState {
  type: DepositActionTypes.RESET_STATE;
}

function goToChooseAccountStep(): GoToChooseAccountStep {
  return {
    type: DepositActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP,
  };
}

function goToBuildTransactionStep(account: Account): GoToBuildTransactionStep {
  return {
    type: DepositActionTypes.GO_TO_BUILD_TRANSACTION_STEP,
    account,
  };
}

function goToReviewTransactionStep(transaction: TransactionToReview): GoToReviewTransactionStep {
  return {
    type: DepositActionTypes.GO_TO_REVIEW_TRANSACTION_STEP,
    transaction,
  };
}

function changeCurrentStep(nextStep: Step): ChangeCurrentStep {
  return {
    type: DepositActionTypes.CHANGE_CURRENT_STEP,
    nextStep,
  };
}

function loadAccounts(): LoadAccounts {
  return {
    type: DepositActionTypes.LOAD_ACCOUNTS,
  };
}

function loadAccountsSuccess(accounts: Accounts): LoadAccountsSuccess {
  return {
    type: DepositActionTypes.LOAD_ACCOUNTS_SUCCESS,
    accounts,
  };
}

function loadAccountsFailure(error: Error): LoadAccountsFailure {
  return {
    type: DepositActionTypes.LOAD_ACCOUNTS_FAILURE,
    error,
  };
}

function loadPoolTransactions(): LoadPoolTransactions {
  return {
    type: DepositActionTypes.LOAD_POOL_TRANSACTIONS,
  };
}

function loadPoolTransactionsSuccess(transactions: PoolTransaction[]): LoadPoolTransactionsSuccess {
  return {
    type: DepositActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS,
    transactions,
  };
}

function loadPoolTransactionsFailure(error: Error): LoadPoolTransactionsFailure {
  return {
    type: DepositActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE,
    error,
  };
}

function loadAccount(): LoadAccount {
  return {
    type: DepositActionTypes.LOAD_ACCOUNT,
  };
}

function loadAccountSuccess(account: Account): LoadAccountSuccess {
  return {
    type: DepositActionTypes.LOAD_ACCOUNT_SUCCESS,
    account,
  };
}

function loadAccountFailure(error: string): LoadAccountFailure {
  return {
    type: DepositActionTypes.LOAD_ACCOUNT_FAILURE,
    error,
  };
}

function loadFees(): LoadFees {
  return {
    type: DepositActionTypes.LOAD_FEES,
  };
}

function loadFeesSuccess(fees: RecommendedFee): LoadFeesSuccess {
  return {
    type: DepositActionTypes.LOAD_FEES_SUCCESS,
    fees,
  };
}

function loadFeesFailure(error: Error): LoadFeesFailure {
  return {
    type: DepositActionTypes.LOAD_FEES_FAILURE,
    error,
  };
}

function loadEstimatedDepositFee(): LoadEstimatedDepositFee {
  return {
    type: DepositActionTypes.LOAD_ESTIMATED_DEPOSIT_FEE,
  };
}

function loadEstimatedDepositFeeSuccess(
  estimatedFee: EstimatedDepositFee
): LoadEstimatedDepositFeeSuccess {
  return {
    type: DepositActionTypes.LOAD_ESTIMATED_DEPOSIT_FEE_SUCCESS,
    estimatedFee,
  };
}

function loadEstimatedDepositFeeFailure(error: Error): LoadEstimatedDepositFeeFailure {
  return {
    type: DepositActionTypes.LOAD_ESTIMATED_DEPOSIT_FEE_FAILURE,
    error,
  };
}

function startTransactionApproval(): StartTransactionApproval {
  return {
    type: DepositActionTypes.START_TRANSACTION_APPROVAL,
  };
}

function stopTransactionApproval(): StopTransactionApproval {
  return {
    type: DepositActionTypes.STOP_TRANSACTION_APPROVAL,
  };
}

function resetState(): ResetState {
  return {
    type: DepositActionTypes.RESET_STATE,
  };
}

export {
  goToChooseAccountStep,
  goToBuildTransactionStep,
  goToReviewTransactionStep,
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
  loadFees,
  loadFeesSuccess,
  loadFeesFailure,
  loadEstimatedDepositFee,
  loadEstimatedDepositFeeSuccess,
  loadEstimatedDepositFeeFailure,
  startTransactionApproval,
  stopTransactionApproval,
  resetState,
};
