// domain
import { HermezAccount, PoolTransaction } from "src/domain";
// persistence
import { HistoryTransactions, Exits } from "src/persistence";

export enum AccountDetailsActionTypes {
  LOAD_ACCOUNT = "[ACCOUNT DETAILS] LOAD ACCOUNT",
  LOAD_ACCOUNT_SUCCESS = "[ACCOUNT DETAILS] LOAD ACCOUNT SUCCESS",
  LOAD_ACCOUNT_FAILURE = "[ACCOUNT DETAILS] LOAD ACCOUNT FAILURE",
  LOAD_L1_TOKEN_BALANCE = "[ACCOUNT DETAILS] LOAD L1 TOKEN BALANCE",
  LOAD_L1_TOKEN_BALANCE_SUCCESS = "[ACCOUNT DETAILS] LOAD L1 TOKEN BALANCE SUCCESS",
  LOAD_L1_TOKEN_BALANCE_FAILURE = "[ACCOUNT DETAILS] LOAD L1 TOKEN BALANCE FAILURE",
  LOAD_POOL_TRANSACTIONS = "[ACCOUNT DETAILS] LOAD POOL TRANSACTIONS",
  LOAD_POOL_TRANSACTIONS_SUCCESS = "[ACCOUNT DETAILS] LOAD POOL TRANSACTIONS SUCCESS",
  LOAD_POOL_TRANSACTIONS_FAILURE = "[ACCOUNT DETAILS] LOAD POOL TRANSACTIONS FAILURE",
  LOAD_HISTORY_TRANSACTIONS = "[ACCOUNT DETAILS] LOAD HISTORY TRANSACTIONS",
  LOAD_HISTORY_TRANSACTIONS_SUCCESS = "[ACCOUNT DETAILS] LOAD HISTORY TRANSACTIONS SUCCESS",
  LOAD_HISTORY_TRANSACTIONS_FAILURE = "[ACCOUNT DETAILS] LOAD HISTORY TRANSACTIONS FAILURE",
  LOAD_EXITS = "[ACCOUNT DETAILS] LOAD EXITS",
  LOAD_EXITS_SUCCESS = "[ACCOUNT DETAILS] LOAD EXITS SUCCESS",
  LOAD_EXITS_FAILURE = "[ACCOUNT DETAILS] LOAD EXITS FAILURE",
  REFRESH_HISTORY_TRANSACTIONS = "[ACCOUNT DETAILS] REFRESH HISTORY TRANSACTIONS",
  REFRESH_HISTORY_TRANSACTIONS_SUCCESS = "[ACCOUNT DETAILS] REFRESH HISTORY TRANSACTIONS SUCCESS",
  RESET_STATE = "[ACCOUNT DETAILS] RESET STATE",
}

export interface LoadAccountAction {
  type: AccountDetailsActionTypes.LOAD_ACCOUNT;
}

export interface LoadAccountSuccessAction {
  type: AccountDetailsActionTypes.LOAD_ACCOUNT_SUCCESS;
  account: HermezAccount;
}

export interface LoadAccountFailureAction {
  type: AccountDetailsActionTypes.LOAD_ACCOUNT_FAILURE;
  error: Error;
}

export interface LoadL1TokenBalanceAction {
  type: AccountDetailsActionTypes.LOAD_L1_TOKEN_BALANCE;
}

export interface LoadL1TokenBalanceSuccessAction {
  type: AccountDetailsActionTypes.LOAD_L1_TOKEN_BALANCE_SUCCESS;
}

export interface LoadL1TokenBalanceFailureAction {
  type: AccountDetailsActionTypes.LOAD_L1_TOKEN_BALANCE_FAILURE;
}

export interface LoadPoolTransactionsAction {
  type: AccountDetailsActionTypes.LOAD_POOL_TRANSACTIONS;
}

export interface LoadPoolTransactionsSuccessAction {
  type: AccountDetailsActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS;
  transactions: PoolTransaction[];
}

export interface LoadPoolTransactionsFailureAction {
  type: AccountDetailsActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE;
  error: Error;
}

export interface LoadHistoryTransactionsAction {
  type: AccountDetailsActionTypes.LOAD_HISTORY_TRANSACTIONS;
}

export interface LoadHistoryTransactionsSuccessAction {
  type: AccountDetailsActionTypes.LOAD_HISTORY_TRANSACTIONS_SUCCESS;
  data: HistoryTransactions;
}

export interface LoadHistoryTransactionsFailureAction {
  type: AccountDetailsActionTypes.LOAD_HISTORY_TRANSACTIONS_FAILURE;
  error: Error;
}

export interface LoadExitsAction {
  type: AccountDetailsActionTypes.LOAD_EXITS;
}

export interface LoadExitsSuccessAction {
  type: AccountDetailsActionTypes.LOAD_EXITS_SUCCESS;
  exits: Exits;
}

export interface LoadExitsFailureAction {
  type: AccountDetailsActionTypes.LOAD_EXITS_FAILURE;
  error: Error;
}

export interface RefreshHistoryTransactionsAction {
  type: AccountDetailsActionTypes.REFRESH_HISTORY_TRANSACTIONS;
}

export interface RefreshHistoryTransactionsSuccessAction {
  type: AccountDetailsActionTypes.REFRESH_HISTORY_TRANSACTIONS_SUCCESS;
  historyTransactions: HistoryTransactions;
}

export interface ResetStateAction {
  type: AccountDetailsActionTypes.RESET_STATE;
}

export type AccountDetailsAction =
  | LoadAccountAction
  | LoadAccountSuccessAction
  | LoadAccountFailureAction
  | LoadL1TokenBalanceAction
  | LoadL1TokenBalanceSuccessAction
  | LoadL1TokenBalanceFailureAction
  | LoadPoolTransactionsAction
  | LoadPoolTransactionsSuccessAction
  | LoadPoolTransactionsFailureAction
  | LoadHistoryTransactionsAction
  | LoadHistoryTransactionsSuccessAction
  | LoadHistoryTransactionsFailureAction
  | LoadExitsAction
  | LoadExitsSuccessAction
  | LoadExitsFailureAction
  | RefreshHistoryTransactionsAction
  | RefreshHistoryTransactionsSuccessAction
  | ResetStateAction;

function loadAccount(): LoadAccountAction {
  return {
    type: AccountDetailsActionTypes.LOAD_ACCOUNT,
  };
}

function loadAccountSuccess(account: HermezAccount): LoadAccountSuccessAction {
  return {
    type: AccountDetailsActionTypes.LOAD_ACCOUNT_SUCCESS,
    account,
  };
}

function loadAccountFailure(error: Error): LoadAccountFailureAction {
  return {
    type: AccountDetailsActionTypes.LOAD_ACCOUNT_FAILURE,
    error,
  };
}

function loadL1TokenBalance(): LoadL1TokenBalanceAction {
  return {
    type: AccountDetailsActionTypes.LOAD_L1_TOKEN_BALANCE,
  };
}

function loadL1TokenBalanceSuccess(): LoadL1TokenBalanceSuccessAction {
  return {
    type: AccountDetailsActionTypes.LOAD_L1_TOKEN_BALANCE_SUCCESS,
  };
}

function loadL1TokenBalanceFailure(): LoadL1TokenBalanceFailureAction {
  return {
    type: AccountDetailsActionTypes.LOAD_L1_TOKEN_BALANCE_FAILURE,
  };
}

function loadPoolTransactions(): LoadPoolTransactionsAction {
  return {
    type: AccountDetailsActionTypes.LOAD_POOL_TRANSACTIONS,
  };
}

function loadPoolTransactionsSuccess(
  transactions: PoolTransaction[]
): LoadPoolTransactionsSuccessAction {
  return {
    type: AccountDetailsActionTypes.LOAD_POOL_TRANSACTIONS_SUCCESS,
    transactions,
  };
}

function loadPoolTransactionsFailure(error: Error): LoadPoolTransactionsFailureAction {
  return {
    type: AccountDetailsActionTypes.LOAD_POOL_TRANSACTIONS_FAILURE,
    error,
  };
}

function loadHistoryTransactions(): LoadHistoryTransactionsAction {
  return {
    type: AccountDetailsActionTypes.LOAD_HISTORY_TRANSACTIONS,
  };
}

function loadHistoryTransactionsSuccess(
  data: HistoryTransactions
): LoadHistoryTransactionsSuccessAction {
  return {
    type: AccountDetailsActionTypes.LOAD_HISTORY_TRANSACTIONS_SUCCESS,
    data,
  };
}

function loadHistoryTransactionsFailure(error: Error): LoadHistoryTransactionsFailureAction {
  return {
    type: AccountDetailsActionTypes.LOAD_HISTORY_TRANSACTIONS_FAILURE,
    error,
  };
}

function loadExits(): LoadExitsAction {
  return {
    type: AccountDetailsActionTypes.LOAD_EXITS,
  };
}

function loadExitsSuccess(exits: Exits): LoadExitsSuccessAction {
  return {
    type: AccountDetailsActionTypes.LOAD_EXITS_SUCCESS,
    exits,
  };
}

function loadExitsFailure(error: Error): LoadExitsFailureAction {
  return {
    type: AccountDetailsActionTypes.LOAD_EXITS_FAILURE,
    error,
  };
}

function refreshHistoryTransactions(): RefreshHistoryTransactionsAction {
  return {
    type: AccountDetailsActionTypes.REFRESH_HISTORY_TRANSACTIONS,
  };
}

function refreshHistoryTransactionsSuccess(
  historyTransactions: HistoryTransactions
): RefreshHistoryTransactionsSuccessAction {
  return {
    type: AccountDetailsActionTypes.REFRESH_HISTORY_TRANSACTIONS_SUCCESS,
    historyTransactions,
  };
}

function resetState(): ResetStateAction {
  return {
    type: AccountDetailsActionTypes.RESET_STATE,
  };
}

export {
  loadAccount,
  loadAccountSuccess,
  loadAccountFailure,
  loadL1TokenBalance,
  loadL1TokenBalanceSuccess,
  loadL1TokenBalanceFailure,
  loadPoolTransactions,
  loadPoolTransactionsSuccess,
  loadPoolTransactionsFailure,
  loadHistoryTransactions,
  loadHistoryTransactionsSuccess,
  loadHistoryTransactionsFailure,
  loadExits,
  loadExitsSuccess,
  loadExitsFailure,
  refreshHistoryTransactions,
  refreshHistoryTransactionsSuccess,
  resetState,
};
