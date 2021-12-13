import { BigNumber } from "@ethersproject/bignumber";

// domain
import { HermezAccount, PoolTransaction, RecommendedFee } from "src/domain/hermez";
import { TransactionReceiver } from "src/domain";
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
  LOAD_FEES = "[TRANSFER] LOAD FEES",
  LOAD_FEES_SUCCESS = "[TRANSFER] LOAD FEES SUCCESS",
  LOAD_FEES_FAILURE = "[TRANSFER] LOAD FEES FAILURE",
  LOAD_POOL_TRANSACTIONS = "[TRANSFER] LOAD POOL TRANSACTIONS",
  LOAD_POOL_TRANSACTIONS_SUCCESS = "[TRANSFER] LOAD POOL TRANSACTIONS SUCCESS",
  LOAD_POOL_TRANSACTIONS_FAILURE = "[TRANSFER] LOAD POOL TRANSACTIONS FAILURE",
  LOAD_ACCOUNTS = "[TRANSFER] LOAD ACCOUNTS",
  LOAD_ACCOUNTS_SUCCESS = "[TRANSFER] LOAD ACCOUNTS SUCCESS",
  LOAD_ACCOUNTS_FAILURE = "[TRANSFER] LOAD ACCOUNTS FAILURE",
  SET_RECEIVER_ACCOUNTS_CREATION_AUTHORIZATION = "[TRANSFER] SET RECEIVER ACCOUNTS CREATION AUTHORIZATION",
  START_TRANSACTION_APPROVAL = "[TRANSFER] START TRANSACTION APPROVAL",
  STOP_TRANSACTION_APPROVAL = "[TRANSFER] STOP TRANSACTION APPROVAL",
  RESET_STATE = "[TRANSFER] RESET STATE",
}

export interface TransactionToReview {
  amount: BigNumber;
  from: HermezAccount;
  fee: BigNumber;
  to: TransactionReceiver;
}

export type Step = "load-account" | "choose-account" | "build-transaction" | "review-transaction";

export interface GoToChooseAccountStep {
  type: TransferActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP;
}

export interface GoToBuildTransactionStep {
  type: TransferActionTypes.GO_TO_BUILD_TRANSACTION_STEP;
  account: HermezAccount;
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
  account: HermezAccount;
}

export interface LoadAccountFailure {
  type: TransferActionTypes.LOAD_ACCOUNT_FAILURE;
  error: string;
}

export interface LoadFees {
  type: TransferActionTypes.LOAD_FEES;
}

export interface LoadFeesSuccess {
  type: TransferActionTypes.LOAD_FEES_SUCCESS;
  fees: RecommendedFee;
}

export interface LoadFeesFailure {
  type: TransferActionTypes.LOAD_FEES_FAILURE;
  error: Error;
}

export interface LoadPoolTransactions {
  type: TransferActionTypes.LOAD_POOL_TRANSACTIONS;
}

export interface LoadPoolTransactionsSuccess {
  type: TransferActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS;
  transactions: PoolTransaction[];
}

export interface LoadPoolTransactionsFailure {
  type: TransferActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE;
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

export interface SetReceiverCreateAccountsAuthorizationStatus {
  type: TransferActionTypes.SET_RECEIVER_ACCOUNTS_CREATION_AUTHORIZATION;
  approval?: boolean;
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
  | LoadFees
  | LoadFeesSuccess
  | LoadFeesFailure
  | LoadPoolTransactions
  | LoadPoolTransactionsSuccess
  | LoadPoolTransactionsFailure
  | LoadAccounts
  | LoadAccountsSuccess
  | LoadAccountsFailure
  | SetReceiverCreateAccountsAuthorizationStatus
  | StartTransactionApproval
  | StopTransactionApproval
  | ResetState;

function goToChooseAccountStep(): GoToChooseAccountStep {
  return {
    type: TransferActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP,
  };
}

function goToBuildTransactionStep(account: HermezAccount): GoToBuildTransactionStep {
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

function loadAccountSuccess(account: HermezAccount): LoadAccountSuccess {
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

function loadFees(): LoadFees {
  return {
    type: TransferActionTypes.LOAD_FEES,
  };
}

function loadFeesSuccess(fees: RecommendedFee): LoadFeesSuccess {
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

function loadPoolTransactions(): LoadPoolTransactions {
  return {
    type: TransferActionTypes.LOAD_POOL_TRANSACTIONS,
  };
}

function loadPoolTransactionsSuccess(transactions: PoolTransaction[]): LoadPoolTransactionsSuccess {
  return {
    type: TransferActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS,
    transactions,
  };
}

function loadPoolTransactionsFailure(error: Error): LoadPoolTransactionsFailure {
  return {
    type: TransferActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE,
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

function setReceiverCreateAccountsAuthorizationStatus(
  approval?: boolean
): SetReceiverCreateAccountsAuthorizationStatus {
  return {
    type: TransferActionTypes.SET_RECEIVER_ACCOUNTS_CREATION_AUTHORIZATION,
    approval,
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
  loadPoolTransactions,
  loadPoolTransactionsSuccess,
  loadPoolTransactionsFailure,
  loadAccount,
  loadAccountSuccess,
  loadAccountFailure,
  loadFees,
  loadFeesSuccess,
  loadFeesFailure,
  setReceiverCreateAccountsAuthorizationStatus,
  startTransactionApproval,
  stopTransactionApproval,
  resetState,
};
