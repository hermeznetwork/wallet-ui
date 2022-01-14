import { BigNumber } from "@ethersproject/bignumber";

// domain
import { Accounts, HermezAccount } from "src/domain";

export enum ForceExitActionTypes {
  GO_TO_CHOOSE_ACCOUNT_STEP = "[FORCE EXIT] GO TO CHOOSE ACCOUNT STEP",
  GO_TO_BUILD_TRANSACTION_STEP = "[FORCE EXIT] GO TO BUILD TRANSACTION STEP",
  GO_TO_REVIEW_TRANSACTION_STEP = "[FORCE EXIT] GO TO REVIEW TRANSACTION STEP",
  LOAD_ACCOUNTS = "[FORCE EXIT] LOAD ACCOUNTS",
  LOAD_ACCOUNTS_SUCCESS = "[FORCE EXIT] LOAD ACCOUNTS SUCCESS",
  LOAD_ACCOUNTS_FAILURE = "[FORCE EXIT] LOAD ACCOUNTS FAILURE",
  START_TRANSACTION_APPROVAL = "[FORCE EXIT] START TRANSACTION APPROVAL",
  STOP_TRANSACTION_APPROVAL = "[FORCE EXIT] STOP TRANSACTION APPROVAL",
  RESET_STATE = "[FORCE EXIT] RESET STATE",
}

export type Step = "choose-account" | "build-transaction" | "review-transaction";

export interface TransactionToReview {
  amount: BigNumber;
  from: HermezAccount;
}

export interface GoToChooseAccountStep {
  type: ForceExitActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP;
}

export interface GoToBuildTransactionStep {
  type: ForceExitActionTypes.GO_TO_BUILD_TRANSACTION_STEP;
  account: HermezAccount;
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
  | StartTransactionApproval
  | StopTransactionApproval
  | ResetState;

function goToChooseAccountStep(): GoToChooseAccountStep {
  return {
    type: ForceExitActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP,
  };
}

function goToBuildTransactionStep(account: HermezAccount): GoToBuildTransactionStep {
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
  startTransactionApproval,
  stopTransactionApproval,
  resetState,
};
