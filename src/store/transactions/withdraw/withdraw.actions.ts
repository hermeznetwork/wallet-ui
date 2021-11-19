import { BigNumber } from "@ethersproject/bignumber";

// domain
import { EstimatedL1Fee } from "src/domain";
import { Account, Exit, PoolTransaction } from "src/domain/hermez";

export enum WithdrawActionTypes {
  LOAD_ACCOUNT = "[WITHDRAW] LOAD ACCOUNT",
  LOAD_ACCOUNT_SUCCESS = "[WITHDRAW] LOAD ACCOUNT SUCCESS",
  LOAD_ACCOUNT_FAILURE = "[WITHDRAW] LOAD ACCOUNT FAILURE",
  LOAD_EXIT = "[WITHDRAW] LOAD EXIT",
  LOAD_EXIT_SUCCESS = "[WITHDRAW] LOAD EXIT SUCCESS",
  LOAD_EXIT_FAILURE = "[WITHDRAW] LOAD EXIT FAILURE",
  LOAD_POOL_TRANSACTIONS = "[WITHDRAW] LOAD POOL TRANSACTIONS",
  LOAD_POOL_TRANSACTIONS_SUCCESS = "[WITHDRAW] LOAD POOL TRANSACTIONS SUCCESS",
  LOAD_POOL_TRANSACTIONS_FAILURE = "[WITHDRAW] LOAD POOL TRANSACTIONS FAILURE",
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
  from: Account;
  to: Partial<Account>;
}

export interface LoadPoolTransactions {
  type: WithdrawActionTypes.LOAD_POOL_TRANSACTIONS;
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
  error: Error;
}

export interface LoadPoolTransactionsSuccess {
  type: WithdrawActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS;
  transactions: PoolTransaction[];
}

export interface LoadPoolTransactionsFailure {
  type: WithdrawActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE;
  error: Error;
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
  error: Error;
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
  | LoadPoolTransactions
  | LoadPoolTransactionsSuccess
  | LoadPoolTransactionsFailure
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
  account: Account;
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

function loadExitFailure(error: Error): LoadExitFailure {
  return {
    type: WithdrawActionTypes.LOAD_EXIT_FAILURE,
    error,
  };
}

function loadPoolTransactions(): LoadPoolTransactions {
  return {
    type: WithdrawActionTypes.LOAD_POOL_TRANSACTIONS,
  };
}

function loadPoolTransactionsSuccess(transactions: PoolTransaction[]): LoadPoolTransactionsSuccess {
  return {
    type: WithdrawActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS,
    transactions,
  };
}

function loadPoolTransactionsFailure(error: Error): LoadPoolTransactionsFailure {
  return {
    type: WithdrawActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE,
    error,
  };
}

function loadAccount(): LoadAccount {
  return {
    type: WithdrawActionTypes.LOAD_ACCOUNT,
  };
}

function loadAccountSuccess(account: Account): LoadAccountSuccess {
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

function loadEstimatedWithdrawFeeFailure(error: Error): LoadEstimatedWithdrawFeeFailure {
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
  loadPoolTransactions,
  loadPoolTransactionsSuccess,
  loadPoolTransactionsFailure,
  loadEstimatedWithdrawFee,
  loadEstimatedWithdrawFeeSuccess,
  loadEstimatedWithdrawFeeFailure,
  startTransactionApproval,
  stopTransactionApproval,
  resetState,
};
