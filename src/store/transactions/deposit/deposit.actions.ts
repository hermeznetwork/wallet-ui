import { BigNumber } from "@ethersproject/bignumber";

// domain
import { EstimatedDepositFee } from "src/domain";
import { HermezAccount, EthereumAccount } from "src/domain/hermez";

export enum DepositActionTypes {
  GO_TO_CHOOSE_ACCOUNT_STEP = "[DEPOSIT] GO TO CHOOSE ACCOUNT STEP",
  GO_TO_BUILD_TRANSACTION_STEP = "[DEPOSIT] GO TO BUILD TRANSACTION STEP",
  GO_TO_REVIEW_TRANSACTION_STEP = "[DEPOSIT] GO TO REVIEW TRANSACTION STEP",
  CHANGE_CURRENT_STEP = "[DEPOSIT] CHANGE CURRENT STEP",
  LOAD_ETHEREUM_ACCOUNTS = "[DEPOSIT] LOAD ETHEREUM ACCOUNTS",
  LOAD_ETHEREUM_ACCOUNTS_SUCCESS = "[DEPOSIT] LOAD ETHEREUM ACCOUNTS SUCCESS",
  LOAD_ETHEREUM_ACCOUNTS_FAILURE = "[DEPOSIT] LOAD ETHEREUM ACCOUNTS FAILURE",
  LOAD_ETHEREUM_ACCOUNT = "[DEPOSIT] LOAD ETHEREUM ACCOUNT",
  LOAD_ETHEREUM_ACCOUNT_SUCCESS = "[DEPOSIT] LOAD ETHEREUM ACCOUNT SUCCESS",
  LOAD_ETHEREUM_ACCOUNT_FAILURE = "[DEPOSIT] LOAD ETHEREUM ACCOUNT FAILURE",
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
  ethereumAccount: EthereumAccount;
}

export interface TransactionToReview {
  amount: BigNumber;
  fee: number;
  from: HermezAccount;
  to: Partial<HermezAccount>;
}

export interface GoToReviewTransactionStep {
  type: DepositActionTypes.GO_TO_REVIEW_TRANSACTION_STEP;
  transaction: TransactionToReview;
}

export interface ChangeCurrentStep {
  type: DepositActionTypes.CHANGE_CURRENT_STEP;
  nextStep: Step;
}

export interface LoadEthereumAccounts {
  type: DepositActionTypes.LOAD_ETHEREUM_ACCOUNTS;
}

export interface LoadEthereumAccountsSuccess {
  type: DepositActionTypes.LOAD_ETHEREUM_ACCOUNTS_SUCCESS;
  ethereumAccounts: EthereumAccount[];
}

export interface LoadEthereumAccountsFailure {
  type: DepositActionTypes.LOAD_ETHEREUM_ACCOUNTS_FAILURE;
  error: Error;
}

export interface LoadEthereumAccount {
  type: DepositActionTypes.LOAD_ETHEREUM_ACCOUNT;
}

export interface LoadEthereumAccountSuccess {
  type: DepositActionTypes.LOAD_ETHEREUM_ACCOUNT_SUCCESS;
  ethereumAccount: EthereumAccount;
}

export interface LoadEthereumAccountFailure {
  type: DepositActionTypes.LOAD_ETHEREUM_ACCOUNT_FAILURE;
  error: string;
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

export type DepositAction =
  | GoToChooseAccountStep
  | GoToBuildTransactionStep
  | GoToReviewTransactionStep
  | ChangeCurrentStep
  | LoadEthereumAccounts
  | LoadEthereumAccountsSuccess
  | LoadEthereumAccountsFailure
  | LoadEthereumAccount
  | LoadEthereumAccountSuccess
  | LoadEthereumAccountFailure
  | LoadEstimatedDepositFee
  | LoadEstimatedDepositFeeSuccess
  | LoadEstimatedDepositFeeFailure
  | StartTransactionApproval
  | StopTransactionApproval
  | ResetState;

function goToChooseAccountStep(): GoToChooseAccountStep {
  return {
    type: DepositActionTypes.GO_TO_CHOOSE_ACCOUNT_STEP,
  };
}

function goToBuildTransactionStep(ethereumAccount: EthereumAccount): GoToBuildTransactionStep {
  return {
    type: DepositActionTypes.GO_TO_BUILD_TRANSACTION_STEP,
    ethereumAccount,
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

function loadEthereumAccounts(): LoadEthereumAccounts {
  return {
    type: DepositActionTypes.LOAD_ETHEREUM_ACCOUNTS,
  };
}

function loadEthereumAccountsSuccess(
  ethereumAccounts: EthereumAccount[]
): LoadEthereumAccountsSuccess {
  return {
    type: DepositActionTypes.LOAD_ETHEREUM_ACCOUNTS_SUCCESS,
    ethereumAccounts,
  };
}

function loadEthereumAccountsFailure(error: Error): LoadEthereumAccountsFailure {
  return {
    type: DepositActionTypes.LOAD_ETHEREUM_ACCOUNTS_FAILURE,
    error,
  };
}

function loadEthereumAccount(): LoadEthereumAccount {
  return {
    type: DepositActionTypes.LOAD_ETHEREUM_ACCOUNT,
  };
}

function loadEthereumAccountSuccess(ethereumAccount: EthereumAccount): LoadEthereumAccountSuccess {
  return {
    type: DepositActionTypes.LOAD_ETHEREUM_ACCOUNT_SUCCESS,
    ethereumAccount,
  };
}

function loadEthereumAccountFailure(error: string): LoadEthereumAccountFailure {
  return {
    type: DepositActionTypes.LOAD_ETHEREUM_ACCOUNT_FAILURE,
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
  loadEthereumAccounts,
  loadEthereumAccountsSuccess,
  loadEthereumAccountsFailure,
  loadEthereumAccount,
  loadEthereumAccountSuccess,
  loadEthereumAccountFailure,
  loadEstimatedDepositFee,
  loadEstimatedDepositFeeSuccess,
  loadEstimatedDepositFeeFailure,
  startTransactionApproval,
  stopTransactionApproval,
  resetState,
};
