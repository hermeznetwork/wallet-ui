import { BigNumber } from "@ethersproject/bignumber";
// domain
import { Account, PooledTransaction } from "src/domain/hermez";
// persistence
import { Accounts } from "src/persistence";
export enum TransactionTransferActionTypes {
  GO_TO_CHOOSE_ACCOUNT_STEP = "[TRANSACTION-TRANSFER] GO TO CHOOSE ACCOUNT STEP",
  GO_TO_BUILD_TRANSACTION_STEP = "[TRANSACTION-TRANSFER] GO TO BUILD TRANSACTION STEP",
  GO_TO_REVIEW_TRANSACTION_STEP = "[TRANSACTION-TRANSFER] GO TO REVIEW TRANSACTION STEP",
  CHANGE_CURRENT_STEP = "[TRANSACTION-TRANSFER] CHANGE CURRENT STEP",
  LOAD_ACCOUNT = "[TRANSACTION-TRANSFER] LOAD ACCOUNT",
  LOAD_ACCOUNT_SUCCESS = "[TRANSACTION-TRANSFER] LOAD ACCOUNT SUCCESS",
  LOAD_ACCOUNT_FAILURE = "[TRANSACTION-TRANSFER] LOAD ACCOUNT FAILURE",
  LOAD_ACCOUNT_BALANCE = "[TRANSACTION-TRANSFER] LOAD ACCOUNT BALANCE",
  LOAD_ACCOUNT_BALANCE_SUCCESS = "[TRANSACTION-TRANSFER] LOAD ACCOUNT BALANCE SUCCESS",
  LOAD_ACCOUNT_BALANCE_FAILURE = "[TRANSACTION-TRANSFER] LOAD ACCOUNT BALANCE FAILURE",
  LOAD_FEES = "[TRANSACTION-TRANSFER] LOAD FEES",
  LOAD_FEES_SUCCESS = "[TRANSACTION-TRANSFER] LOAD FEES SUCCESS",
  LOAD_FEES_FAILURE = "[TRANSACTION-TRANSFER] LOAD FEES FAILURE",
  LOAD_POOLED_TRANSACTIONS = "[TRANSACTION-TRANSFER] LOAD POOLED TRANSACTIONS",
  LOAD_POOLED_TRANSACTIONS_SUCCESS = "[TRANSACTION-TRANSFER] LOAD POOLED TRANSACTIONS SUCCESS",
  LOAD_POOLED_TRANSACTIONS_FAILURE = "[TRANSACTION-TRANSFER] LOAD POOLED TRANSACTIONS FAILURE",
  LOAD_ACCOUNTS = "[TRANSACTION-TRANSFER] LOAD ACCOUNTS",
  LOAD_ACCOUNTS_SUCCESS = "[TRANSACTION-TRANSFER] LOAD ACCOUNTS SUCCESS",
  LOAD_ACCOUNTS_FAILURE = "[TRANSACTION-TRANSFER] LOAD ACCOUNTS FAILURE",
  START_TRANSACTION_APPROVAL = "[TRANSACTION-TRANSFER] START TRANSACTION APPROVAL",
  STOP_TRANSACTION_APPROVAL = "[TRANSACTION-TRANSFER] STOP TRANSACTION APPROVAL",
  RESET_STATE = "[TRANSACTION-TRANSFER] RESET STATE",
}

export type Step = "load-account" | "choose-account" | "build-transaction" | "review-transaction";

export interface GoToChooseAccountStep {
  type: TransactionTransferActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP;
}

export interface GoToBuildTransactionStep {
  type: TransactionTransferActionTypes.GO_TO_BUILD_TRANSACTION_STEP;
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
  type: TransactionTransferActionTypes.GO_TO_REVIEW_TRANSACTION_STEP;
  transaction: TransactionToReview;
}

export interface ChangeCurrentStep {
  type: TransactionTransferActionTypes.CHANGE_CURRENT_STEP;
  nextStep: Step;
}

export interface LoadAccount {
  type: TransactionTransferActionTypes.LOAD_ACCOUNT;
}

export interface LoadAccountSuccess {
  type: TransactionTransferActionTypes.LOAD_ACCOUNT_SUCCESS;
  account: Account;
}

export interface LoadAccountFailure {
  type: TransactionTransferActionTypes.LOAD_ACCOUNT_FAILURE;
  error: string;
}

export interface LoadAccountBalance {
  type: TransactionTransferActionTypes.LOAD_ACCOUNT_BALANCE;
}

export interface LoadAccountBalanceSuccess {
  type: TransactionTransferActionTypes.LOAD_ACCOUNT_BALANCE_SUCCESS;
  accountBalance: string;
}

export interface LoadAccountBalanceFailure {
  type: TransactionTransferActionTypes.LOAD_ACCOUNT_BALANCE_FAILURE;
  error: Error;
}

export interface LoadFees {
  type: TransactionTransferActionTypes.LOAD_FEES;
}

interface Fees {
  existingAccount: number;
  createAccount: number;
  createAccountInternal: number;
}

export interface LoadFeesSuccess {
  type: TransactionTransferActionTypes.LOAD_FEES_SUCCESS;
  fees: Fees;
}

export interface LoadFeesFailure {
  type: TransactionTransferActionTypes.LOAD_FEES_FAILURE;
  error: Error;
}

export interface LoadPoolTransactions {
  type: TransactionTransferActionTypes.LOAD_POOLED_TRANSACTIONS;
}

export interface LoadPooledTransactionsSuccess {
  type: TransactionTransferActionTypes.LOAD_POOLED_TRANSACTIONS_SUCCESS;
  transactions: PooledTransaction[];
}

export interface LoadPoolTransactionsFailure {
  type: TransactionTransferActionTypes.LOAD_POOLED_TRANSACTIONS_FAILURE;
  error: Error;
}

export interface LoadAccounts {
  type: TransactionTransferActionTypes.LOAD_ACCOUNTS;
}

export interface LoadAccountsSuccess {
  type: TransactionTransferActionTypes.LOAD_ACCOUNTS_SUCCESS;
  accounts: Accounts;
}

export interface LoadAccountsFailure {
  type: TransactionTransferActionTypes.LOAD_ACCOUNTS_FAILURE;
  error: Error;
}

export interface StartTransactionApproval {
  type: TransactionTransferActionTypes.START_TRANSACTION_APPROVAL;
}

export interface StopTransactionApproval {
  type: TransactionTransferActionTypes.STOP_TRANSACTION_APPROVAL;
}

export interface ResetState {
  type: TransactionTransferActionTypes.RESET_STATE;
}

export type TransactionTransferAction =
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
  | LoadPoolTransactions
  | LoadPooledTransactionsSuccess
  | LoadPoolTransactionsFailure
  | LoadAccounts
  | LoadAccountsSuccess
  | LoadAccountsFailure
  | StartTransactionApproval
  | StopTransactionApproval
  | ResetState;

function goToChooseAccountStep(): GoToChooseAccountStep {
  return {
    type: TransactionTransferActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP,
  };
}

function goToBuildTransactionStep(account: Account): GoToBuildTransactionStep {
  return {
    type: TransactionTransferActionTypes.GO_TO_BUILD_TRANSACTION_STEP,
    account,
  };
}

function goToReviewTransactionStep(transaction: TransactionToReview): GoToReviewTransactionStep {
  return {
    type: TransactionTransferActionTypes.GO_TO_REVIEW_TRANSACTION_STEP,
    transaction,
  };
}

function changeCurrentStep(nextStep: Step): ChangeCurrentStep {
  return {
    type: TransactionTransferActionTypes.CHANGE_CURRENT_STEP,
    nextStep,
  };
}

function loadAccount(): LoadAccount {
  return {
    type: TransactionTransferActionTypes.LOAD_ACCOUNT,
  };
}

function loadAccountSuccess(account: Account): LoadAccountSuccess {
  return {
    type: TransactionTransferActionTypes.LOAD_ACCOUNT_SUCCESS,
    account,
  };
}

function loadAccountFailure(error: string): LoadAccountFailure {
  return {
    type: TransactionTransferActionTypes.LOAD_ACCOUNT_FAILURE,
    error,
  };
}

function loadAccountBalance(): LoadAccountBalance {
  return {
    type: TransactionTransferActionTypes.LOAD_ACCOUNT_BALANCE,
  };
}

function loadAccountBalanceSuccess(accountBalance: string): LoadAccountBalanceSuccess {
  return {
    type: TransactionTransferActionTypes.LOAD_ACCOUNT_BALANCE_SUCCESS,
    accountBalance,
  };
}

function loadAccountBalanceFailure(error: Error): LoadAccountBalanceFailure {
  return {
    type: TransactionTransferActionTypes.LOAD_ACCOUNT_BALANCE_FAILURE,
    error,
  };
}

function loadFees(): LoadFees {
  return {
    type: TransactionTransferActionTypes.LOAD_FEES,
  };
}

function loadFeesSuccess(fees: Fees): LoadFeesSuccess {
  return {
    type: TransactionTransferActionTypes.LOAD_FEES_SUCCESS,
    fees,
  };
}

function loadFeesFailure(error: Error): LoadFeesFailure {
  return {
    type: TransactionTransferActionTypes.LOAD_FEES_FAILURE,
    error,
  };
}

function loadPoolTransactions(): LoadPoolTransactions {
  return {
    type: TransactionTransferActionTypes.LOAD_POOLED_TRANSACTIONS,
  };
}

function loadPoolTransactionsSuccess(
  transactions: PooledTransaction[]
): LoadPooledTransactionsSuccess {
  return {
    type: TransactionTransferActionTypes.LOAD_POOLED_TRANSACTIONS_SUCCESS,
    transactions,
  };
}

function loadPoolTransactionsFailure(error: Error): LoadPoolTransactionsFailure {
  return {
    type: TransactionTransferActionTypes.LOAD_POOLED_TRANSACTIONS_FAILURE,
    error,
  };
}

function loadAccounts(): LoadAccounts {
  return {
    type: TransactionTransferActionTypes.LOAD_ACCOUNTS,
  };
}

function loadAccountsSuccess(accounts: Accounts): LoadAccountsSuccess {
  return {
    type: TransactionTransferActionTypes.LOAD_ACCOUNTS_SUCCESS,
    accounts,
  };
}

function loadAccountsFailure(error: Error): LoadAccountsFailure {
  return {
    type: TransactionTransferActionTypes.LOAD_ACCOUNTS_FAILURE,
    error,
  };
}

function startTransactionApproval(): StartTransactionApproval {
  return {
    type: TransactionTransferActionTypes.START_TRANSACTION_APPROVAL,
  };
}

function stopTransactionApproval(): StopTransactionApproval {
  return {
    type: TransactionTransferActionTypes.STOP_TRANSACTION_APPROVAL,
  };
}

function resetState(): ResetState {
  return {
    type: TransactionTransferActionTypes.RESET_STATE,
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
