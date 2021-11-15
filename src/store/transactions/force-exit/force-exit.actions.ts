import { BigNumber } from "@ethersproject/bignumber";

// domain
import { Account, PoolTransaction } from "src/domain/hermez";
import { Accounts } from "src/persistence";

export enum ForceExitActionTypes {
  GO_TO_CHOOSE_ACCOUNT_STEP = "[FORCE EXIT] GO TO CHOOSE ACCOUNT STEP",
  GO_TO_BUILD_TRANSACTION_STEP = "[FORCE EXIT] GO TO BUILD TRANSACTION STEP",
  GO_TO_REVIEW_TRANSACTION_STEP = "[FORCE EXIT] GO TO REVIEW TRANSACTION STEP",
  LOAD_ACCOUNTS = "[FORCE EXIT] LOAD ACCOUNTS",
  LOAD_ACCOUNTS_SUCCESS = "[FORCE EXIT] LOAD ACCOUNTS SUCCESS",
  LOAD_ACCOUNTS_FAILURE = "[FORCE EXIT] LOAD ACCOUNTS FAILURE",
  LOAD_POOL_TRANSACTIONS = "[FORCE EXIT] LOAD POOL TRANSACTIONS",
  LOAD_POOL_TRANSACTIONS_SUCCESS = "[FORCE EXIT] LOAD POOL TRANSACTIONS SUCCESS",
  LOAD_POOL_TRANSACTIONS_FAILURE = "[FORCE EXIT] LOAD POOL TRANSACTIONS FAILURE",
  START_TRANSACTION_APPROVAL = "[FORCE EXIT] START TRANSACTION APPROVAL",
  STOP_TRANSACTION_APPROVAL = "[FORCE EXIT] STOP TRANSACTION APPROVAL",
  RESET_STATE = "[FORCE EXIT] RESET STATE",
}

export type Step = "choose-account" | "build-transaction" | "review-transaction";

export interface TransactionToReview {
  amount: BigNumber;
  fee: number;
  from: Account;
  to: Partial<Account>;
}

export interface GoToChooseAccountStep {
  type: ForceExitActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP;
}

export interface GoToBuildTransactionStep {
  type: ForceExitActionTypes.GO_TO_BUILD_TRANSACTION_STEP;
  account: Account;
}

export interface GoToReviewTransactionStep {
  type: ForceExitActionTypes.GO_TO_REVIEW_TRANSACTION_STEP;
  transaction: TransactionToReview;
}

export interface LoadAccounts {
  type: ForceExitActionTypes.LOAD_ACCOUNTS;
}

export interface LoadAccountsSuccess {
  type: ForceExitActionTypes.LOAD_ACCOUNTS_SUCCESS;
  accounts: Accounts;
}

export interface LoadAccountsFailure {
  type: ForceExitActionTypes.LOAD_ACCOUNTS_FAILURE;
  error: Error;
}

export interface LoadPoolTransactions {
  type: ForceExitActionTypes.LOAD_POOL_TRANSACTIONS;
}

export interface LoadPoolTransactionsSuccess {
  type: ForceExitActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS;
  transactions: PoolTransaction[];
}

export interface LoadPoolTransactionsFailure {
  type: ForceExitActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE;
  error: Error;
}

export interface StartTransactionApproval {
  type: ForceExitActionTypes.START_TRANSACTION_APPROVAL;
}

export interface StopTransactionApproval {
  type: ForceExitActionTypes.STOP_TRANSACTION_APPROVAL;
}

export interface ResetState {
  type: ForceExitActionTypes.RESET_STATE;
}

export type ForceExitAction =
  | GoToChooseAccountStep
  | GoToBuildTransactionStep
  | GoToReviewTransactionStep
  | LoadAccounts
  | LoadAccountsSuccess
  | LoadAccountsFailure
  | LoadPoolTransactions
  | LoadPoolTransactionsSuccess
  | LoadPoolTransactionsFailure
  | StartTransactionApproval
  | StopTransactionApproval
  | ResetState;

function goToChooseAccountStep(): GoToChooseAccountStep {
  return {
    type: ForceExitActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP,
  };
}

function goToBuildTransactionStep(account: Account): GoToBuildTransactionStep {
  return {
    type: ForceExitActionTypes.GO_TO_BUILD_TRANSACTION_STEP,
    account,
  };
}

function goToReviewTransactionStep(transaction: TransactionToReview): GoToReviewTransactionStep {
  return {
    type: ForceExitActionTypes.GO_TO_REVIEW_TRANSACTION_STEP,
    transaction,
  };
}

function loadAccounts(): LoadAccounts {
  return {
    type: ForceExitActionTypes.LOAD_ACCOUNTS,
  };
}

function loadAccountsSuccess(accounts: Accounts): LoadAccountsSuccess {
  return {
    type: ForceExitActionTypes.LOAD_ACCOUNTS_SUCCESS,
    accounts,
  };
}

function loadAccountsFailure(error: Error): LoadAccountsFailure {
  return {
    type: ForceExitActionTypes.LOAD_ACCOUNTS_FAILURE,
    error,
  };
}

function loadPoolTransactions(): LoadPoolTransactions {
  return {
    type: ForceExitActionTypes.LOAD_POOL_TRANSACTIONS,
  };
}

function loadPoolTransactionsSuccess(transactions: PoolTransaction[]): LoadPoolTransactionsSuccess {
  return {
    type: ForceExitActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS,
    transactions,
  };
}

function loadPoolTransactionsFailure(error: Error): LoadPoolTransactionsFailure {
  return {
    type: ForceExitActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE,
    error,
  };
}

function startTransactionApproval(): StartTransactionApproval {
  return {
    type: ForceExitActionTypes.START_TRANSACTION_APPROVAL,
  };
}

function stopTransactionApproval(): StopTransactionApproval {
  return {
    type: ForceExitActionTypes.STOP_TRANSACTION_APPROVAL,
  };
}

function resetState(): ResetState {
  return {
    type: ForceExitActionTypes.RESET_STATE,
  };
}

export {
  goToChooseAccountStep,
  goToBuildTransactionStep,
  goToReviewTransactionStep,
  loadAccounts,
  loadAccountsSuccess,
  loadAccountsFailure,
  loadPoolTransactions,
  loadPoolTransactionsSuccess,
  loadPoolTransactionsFailure,
  startTransactionApproval,
  stopTransactionApproval,
  resetState,
};
