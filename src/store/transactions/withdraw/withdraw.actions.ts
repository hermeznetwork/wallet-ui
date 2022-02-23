import { BigNumber } from "@ethersproject/bignumber";

// domain
import { HermezAccount, Exit, EstimatedL1Fee } from "src/domain";

export enum WithdrawActionTypes {
  LOAD_ACCOUNT = "[WITHDRAW] LOAD ACCOUNT",
  LOAD_ACCOUNT_SUCCESS = "[WITHDRAW] LOAD ACCOUNT SUCCESS",
  LOAD_ACCOUNT_FAILURE = "[WITHDRAW] LOAD ACCOUNT FAILURE",
  LOAD_EXIT = "[WITHDRAW] LOAD EXIT",
  LOAD_EXIT_SUCCESS = "[WITHDRAW] LOAD EXIT SUCCESS",
  LOAD_EXIT_FAILURE = "[WITHDRAW] LOAD EXIT FAILURE",
  LOAD_ESTIMATED_WITHDRAW_FEE = "[WITHDRAW] LOAD ESTIMATED WITHDRAW FEE",
  LOAD_ESTIMATED_WITHDRAW_FEE_SUCCESS = "[WITHDRAW] LOAD ESTIMATED WITHDRAW FEE SUCCESS",
  LOAD_ESTIMATED_WITHDRAW_FEE_FAILURE = "[WITHDRAW] LOAD ESTIMATED WITHDRAW FEE FAILURE",
  START_TRANSACTION_APPROVAL = "[WITHDRAW] START TRANSACTION APPROVAL",
  STOP_TRANSACTION_APPROVAL = "[WITHDRAW] STOP TRANSACTION APPROVAL",
  RESET_STATE = "[WITHDRAW] RESET STATE",
}

export type Step = "load-data" | "review-transaction";

export interface TransactionToReview {
  amount: BigNumber;
  fee: number;
  from: HermezAccount;
  to: Partial<HermezAccount>;
}

export interface LoadExit {
  type: WithdrawActionTypes.LOAD_EXIT;
}

export interface LoadExitSuccess {
  type: WithdrawActionTypes.LOAD_EXIT_SUCCESS;
  exit: Exit;
}

export interface LoadExitFailure {
  type: WithdrawActionTypes.LOAD_EXIT_FAILURE;
  error: string;
}

export interface LoadEstimatedWithdrawFee {
  type: WithdrawActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE;
}

export interface LoadEstimatedWithdrawFeeSuccess {
  type: WithdrawActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE_SUCCESS;
  estimatedFee: EstimatedL1Fee;
}

export interface LoadEstimatedWithdrawFeeFailure {
  type: WithdrawActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE_FAILURE;
  error: string;
}

export interface StartTransactionApproval {
  type: WithdrawActionTypes.START_TRANSACTION_APPROVAL;
}

export interface StopTransactionApproval {
  type: WithdrawActionTypes.STOP_TRANSACTION_APPROVAL;
}

export interface ResetState {
  type: WithdrawActionTypes.RESET_STATE;
}

export type WithdrawAction =
  | LoadAccount
  | LoadAccountSuccess
  | LoadAccountFailure
  | LoadExit
  | LoadExitSuccess
  | LoadExitFailure
  | LoadEstimatedWithdrawFee
  | LoadEstimatedWithdrawFeeSuccess
  | LoadEstimatedWithdrawFeeFailure
  | StartTransactionApproval
  | StopTransactionApproval
  | ResetState;

export interface LoadAccount {
  type: WithdrawActionTypes.LOAD_ACCOUNT;
}

export interface LoadAccountSuccess {
  type: WithdrawActionTypes.LOAD_ACCOUNT_SUCCESS;
  account: HermezAccount;
}

export interface LoadAccountFailure {
  type: WithdrawActionTypes.LOAD_ACCOUNT_FAILURE;
  error: string;
}

function loadExit(): LoadExit {
  return {
    type: WithdrawActionTypes.LOAD_EXIT,
  };
}

function loadExitSuccess(exit: Exit): LoadExitSuccess {
  return {
    type: WithdrawActionTypes.LOAD_EXIT_SUCCESS,
    exit,
  };
}

function loadExitFailure(error: string): LoadExitFailure {
  return {
    type: WithdrawActionTypes.LOAD_EXIT_FAILURE,
    error,
  };
}

function loadAccount(): LoadAccount {
  return {
    type: WithdrawActionTypes.LOAD_ACCOUNT,
  };
}

function loadAccountSuccess(account: HermezAccount): LoadAccountSuccess {
  return {
    type: WithdrawActionTypes.LOAD_ACCOUNT_SUCCESS,
    account,
  };
}

function loadAccountFailure(error: string): LoadAccountFailure {
  return {
    type: WithdrawActionTypes.LOAD_ACCOUNT_FAILURE,
    error,
  };
}

function loadEstimatedWithdrawFee(): LoadEstimatedWithdrawFee {
  return {
    type: WithdrawActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE,
  };
}

function loadEstimatedWithdrawFeeSuccess(
  estimatedFee: EstimatedL1Fee
): LoadEstimatedWithdrawFeeSuccess {
  return {
    type: WithdrawActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE_SUCCESS,
    estimatedFee,
  };
}

function loadEstimatedWithdrawFeeFailure(error: string): LoadEstimatedWithdrawFeeFailure {
  return {
    type: WithdrawActionTypes.LOAD_ESTIMATED_WITHDRAW_FEE_FAILURE,
    error,
  };
}

function startTransactionApproval(): StartTransactionApproval {
  return {
    type: WithdrawActionTypes.START_TRANSACTION_APPROVAL,
  };
}

function stopTransactionApproval(): StopTransactionApproval {
  return {
    type: WithdrawActionTypes.STOP_TRANSACTION_APPROVAL,
  };
}

function resetState(): ResetState {
  return {
    type: WithdrawActionTypes.RESET_STATE,
  };
}

export {
  loadAccount,
  loadAccountSuccess,
  loadAccountFailure,
  loadExit,
  loadExitSuccess,
  loadExitFailure,
  loadEstimatedWithdrawFee,
  loadEstimatedWithdrawFeeSuccess,
  loadEstimatedWithdrawFeeFailure,
  startTransactionApproval,
  stopTransactionApproval,
  resetState,
};
