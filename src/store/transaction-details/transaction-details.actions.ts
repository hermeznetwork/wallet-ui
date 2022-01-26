// domain
import { PendingDeposit, HistoryTransaction, PoolTransaction } from "src/domain";

export enum TransactionDetailsActionTypes {
  LOAD_TRANSACTION = "[TRANSACTION DETAILS] LOAD TRANSACTION",
  LOAD_TRANSACTION_SUCCESS = "[TRANSACTION DETAILS] LOAD TRANSACTION SUCCESS",
  LOAD_TRANSACTION_FAILURE = "[TRANSACTION DETAILS] LOAD TRANSACTION FAILURE",
}

export interface LoadTransaction {
  type: TransactionDetailsActionTypes.LOAD_TRANSACTION;
}

export interface LoadTransactionSuccess {
  type: TransactionDetailsActionTypes.LOAD_TRANSACTION_SUCCESS;
  transaction: PendingDeposit | HistoryTransaction | PoolTransaction;
}

export interface LoadTransactionFailure {
  type: TransactionDetailsActionTypes.LOAD_TRANSACTION_FAILURE;
  error: string;
}

export type TransactionDetailsAction =
  | LoadTransaction
  | LoadTransactionSuccess
  | LoadTransactionFailure;

function loadTransaction(): LoadTransaction {
  return {
    type: TransactionDetailsActionTypes.LOAD_TRANSACTION,
  };
}

function loadTransactionSuccess(
  transaction: PendingDeposit | HistoryTransaction | PoolTransaction
): LoadTransactionSuccess {
  return {
    type: TransactionDetailsActionTypes.LOAD_TRANSACTION_SUCCESS,
    transaction,
  };
}

function loadTransactionFailure(error: string): LoadTransactionFailure {
  return {
    type: TransactionDetailsActionTypes.LOAD_TRANSACTION_FAILURE,
    error,
  };
}

export { loadTransaction, loadTransactionSuccess, loadTransactionFailure };
