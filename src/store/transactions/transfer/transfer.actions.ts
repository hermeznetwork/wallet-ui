import { BigNumber } from "@ethersproject/bignumber";
// domain
import { Account, PooledTransaction } from "src/domain/hermez";
// persistence
import { Accounts } from "src/persistence";
export enum TransferActionTypes {
  GO_TO_CHOOSE_ACCOUNT_STEP = "[TRANSFER] GO TO CHOOSE ACCOUNT STEP",
  GO_TO_BUILD_TRANSACTION_STEP = "[TRANSFER] GO TO BUILD TRANSACTION STEP",
  GO_TO_REVIEW_TRANSACTION_STEP = "[TRANSFER] GO TO REVIEW TRANSACTION STEP",
  CHANGE_CURRENT_STEP = "[TRANSFER] CHANGE CURRENT STEP",
  LOAD_ACCOUNT = "[TRANSFER] LOAD ACCOUNT",
  LOAD_ACCOUNT_SUCCESS = "[TRANSFER] LOAD ACCOUNT SUCCESS",
  LOAD_ACCOUNT_FAILURE = "[TRANSFER] LOAD ACCOUNT FAILURE",
  LOAD_ACCOUNT_BALANCE = "[TRANSFER] LOAD ACCOUNT BALANCE",
  LOAD_ACCOUNT_BALANCE_SUCCESS = "[TRANSFER] LOAD ACCOUNT BALANCE SUCCESS",
  LOAD_ACCOUNT_BALANCE_FAILURE = "[TRANSFER] LOAD ACCOUNT BALANCE FAILURE",
  LOAD_FEES = "[TRANSFER] LOAD FEES",
  LOAD_FEES_SUCCESS = "[TRANSFER] LOAD FEES SUCCESS",
  LOAD_FEES_FAILURE = "[TRANSFER] LOAD FEES FAILURE",
  LOAD_POOLED_TRANSACTIONS = "[TRANSFER] LOAD POOLED TRANSACTIONS",
  LOAD_POOLED_TRANSACTIONS_SUCCESS = "[TRANSFER] LOAD POOLED TRANSACTIONS SUCCESS",
  LOAD_POOLED_TRANSACTIONS_FAILURE = "[TRANSFER] LOAD POOLED TRANSACTIONS FAILURE",
  LOAD_ACCOUNTS = "[TRANSFER] LOAD ACCOUNTS",
  LOAD_ACCOUNTS_SUCCESS = "[TRANSFER] LOAD ACCOUNTS SUCCESS",
  LOAD_ACCOUNTS_FAILURE = "[TRANSFER] LOAD ACCOUNTS FAILURE",
  START_TRANSACTION_APPROVAL = "[TRANSFER] START TRANSACTION APPROVAL",
  STOP_TRANSACTION_APPROVAL = "[TRANSFER] STOP TRANSACTION APPROVAL",
  RESET_STATE = "[TRANSFER] RESET STATE",
}

export type Step = "load-account" | "choose-account" | "build-transaction" | "review-transaction";

export interface GoToChooseAccountStep {
  type: TransferActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP;
}

export interface GoToBuildTransactionStep {
  type: TransferActionTypes.GO_TO_BUILD_TRANSACTION_STEP;
  account: Account;
}

export interface TransactionToReview {
  amount: BigNumber;
  fee: number;
  from: {
    accountIndex: string;
  };
  to: Partial<Account>;
}

export interface GoToReviewTransactionStep {
  type: TransferActionTypes.GO_TO_REVIEW_TRANSACTION_STEP;
  transaction: TransactionToReview;
}

export interface ChangeCurrentStep {
  type: TransferActionTypes.CHANGE_CURRENT_STEP;
  nextStep: Step;
}

export interface LoadAccount {
  type: TransferActionTypes.LOAD_ACCOUNT;
}

export interface LoadAccountSuccess {
  type: TransferActionTypes.LOAD_ACCOUNT_SUCCESS;
  account: Account;
}

export interface LoadAccountFailure {
  type: TransferActionTypes.LOAD_ACCOUNT_FAILURE;
  error: string;
}

export interface LoadAccountBalance {
  type: TransferActionTypes.LOAD_ACCOUNT_BALANCE;
}

export interface LoadAccountBalanceSuccess {
  type: TransferActionTypes.LOAD_ACCOUNT_BALANCE_SUCCESS;
  accountBalance: string;
}

export interface LoadAccountBalanceFailure {
  type: TransferActionTypes.LOAD_ACCOUNT_BALANCE_FAILURE;
  error: Error;
}

export interface LoadFees {
  type: TransferActionTypes.LOAD_FEES;
}

interface Fees {
  existingAccount: number;
  createAccount: number;
  createAccountInternal: number;
}

export interface LoadFeesSuccess {
  type: TransferActionTypes.LOAD_FEES_SUCCESS;
  fees: Fees;
}

export interface LoadFeesFailure {
  type: TransferActionTypes.LOAD_FEES_FAILURE;
  error: Error;
}

export interface LoadPooledTransactions {
  type: TransferActionTypes.LOAD_POOLED_TRANSACTIONS;
}

export interface LoadPooledTransactionsSuccess {
  type: TransferActionTypes.LOAD_POOLED_TRANSACTIONS_SUCCESS;
  transactions: PooledTransaction[];
}

export interface LoadPooledTransactionsFailure {
  type: TransferActionTypes.LOAD_POOLED_TRANSACTIONS_FAILURE;
  error: Error;
}

export interface LoadAccounts {
  type: TransferActionTypes.LOAD_ACCOUNTS;
}

export interface LoadAccountsSuccess {
  type: TransferActionTypes.LOAD_ACCOUNTS_SUCCESS;
  accounts: Accounts;
}

export interface LoadAccountsFailure {
  type: TransferActionTypes.LOAD_ACCOUNTS_FAILURE;
  error: Error;
}

export interface StartTransactionApproval {
  type: TransferActionTypes.START_TRANSACTION_APPROVAL;
}

export interface StopTransactionApproval {
  type: TransferActionTypes.STOP_TRANSACTION_APPROVAL;
}

export interface ResetState {
  type: TransferActionTypes.RESET_STATE;
}

export type TransferAction =
  | GoToChooseAccountStep
  | GoToBuildTransactionStep
  | GoToReviewTransactionStep
  | ChangeCurrentStep
  | LoadAccount
  | LoadAccountSuccess
  | LoadAccountFailure
  | LoadAccountBalance
  | LoadAccountBalanceSuccess
  | LoadAccountBalanceFailure
  | LoadFees
  | LoadFeesSuccess
  | LoadFeesFailure
  | LoadPooledTransactions
  | LoadPooledTransactionsSuccess
  | LoadPooledTransactionsFailure
  | LoadAccounts
  | LoadAccountsSuccess
  | LoadAccountsFailure
  | StartTransactionApproval
  | StopTransactionApproval
  | ResetState;

function goToChooseAccountStep(): GoToChooseAccountStep {
  return {
    type: TransferActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP,
  };
}

function goToBuildTransactionStep(account: Account): GoToBuildTransactionStep {
  return {
    type: TransferActionTypes.GO_TO_BUILD_TRANSACTION_STEP,
    account,
  };
}

function goToReviewTransactionStep(transaction: TransactionToReview): GoToReviewTransactionStep {
  return {
    type: TransferActionTypes.GO_TO_REVIEW_TRANSACTION_STEP,
    transaction,
  };
}

function changeCurrentStep(nextStep: Step): ChangeCurrentStep {
  return {
    type: TransferActionTypes.CHANGE_CURRENT_STEP,
    nextStep,
  };
}

function loadAccount(): LoadAccount {
  return {
    type: TransferActionTypes.LOAD_ACCOUNT,
  };
}

function loadAccountSuccess(account: Account): LoadAccountSuccess {
  return {
    type: TransferActionTypes.LOAD_ACCOUNT_SUCCESS,
    account,
  };
}

function loadAccountFailure(error: string): LoadAccountFailure {
  return {
    type: TransferActionTypes.LOAD_ACCOUNT_FAILURE,
    error,
  };
}

function loadAccountBalance(): LoadAccountBalance {
  return {
    type: TransferActionTypes.LOAD_ACCOUNT_BALANCE,
  };
}

function loadAccountBalanceSuccess(accountBalance: string): LoadAccountBalanceSuccess {
  return {
    type: TransferActionTypes.LOAD_ACCOUNT_BALANCE_SUCCESS,
    accountBalance,
  };
}

function loadAccountBalanceFailure(error: Error): LoadAccountBalanceFailure {
  return {
    type: TransferActionTypes.LOAD_ACCOUNT_BALANCE_FAILURE,
    error,
  };
}

function loadFees(): LoadFees {
  return {
    type: TransferActionTypes.LOAD_FEES,
  };
}

function loadFeesSuccess(fees: Fees): LoadFeesSuccess {
  return {
    type: TransferActionTypes.LOAD_FEES_SUCCESS,
    fees,
  };
}

function loadFeesFailure(error: Error): LoadFeesFailure {
  return {
    type: TransferActionTypes.LOAD_FEES_FAILURE,
    error,
  };
}

function loadPooledTransactions(): LoadPooledTransactions {
  return {
    type: TransferActionTypes.LOAD_POOLED_TRANSACTIONS,
  };
}

function loadPooledTransactionsSuccess(
  transactions: PooledTransaction[]
): LoadPooledTransactionsSuccess {
  return {
    type: TransferActionTypes.LOAD_POOLED_TRANSACTIONS_SUCCESS,
    transactions,
  };
}

function loadPooledTransactionsFailure(error: Error): LoadPooledTransactionsFailure {
  return {
    type: TransferActionTypes.LOAD_POOLED_TRANSACTIONS_FAILURE,
    error,
  };
}

function loadAccounts(): LoadAccounts {
  return {
    type: TransferActionTypes.LOAD_ACCOUNTS,
  };
}

function loadAccountsSuccess(accounts: Accounts): LoadAccountsSuccess {
  return {
    type: TransferActionTypes.LOAD_ACCOUNTS_SUCCESS,
    accounts,
  };
}

function loadAccountsFailure(error: Error): LoadAccountsFailure {
  return {
    type: TransferActionTypes.LOAD_ACCOUNTS_FAILURE,
    error,
  };
}

function startTransactionApproval(): StartTransactionApproval {
  return {
    type: TransferActionTypes.START_TRANSACTION_APPROVAL,
  };
}

function stopTransactionApproval(): StopTransactionApproval {
  return {
    type: TransferActionTypes.STOP_TRANSACTION_APPROVAL,
  };
}

function resetState(): ResetState {
  return {
    type: TransferActionTypes.RESET_STATE,
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
  loadPooledTransactions,
  loadPooledTransactionsSuccess,
  loadPooledTransactionsFailure,
  loadAccount,
  loadAccountSuccess,
  loadAccountFailure,
  loadAccountBalance,
  loadAccountBalanceSuccess,
  loadAccountBalanceFailure,
  loadFees,
  loadFeesSuccess,
  loadFeesFailure,
  startTransactionApproval,
  stopTransactionApproval,
  resetState,
};
