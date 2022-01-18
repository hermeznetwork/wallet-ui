// domain
import { Accounts, Exits } from "src/domain";

export enum HomeActionTypes {
  LOAD_TOTAL_BALANCE = "[HOME] LOAD TOTAL BALANCE",
  LOAD_TOTAL_BALANCE_SUCCESS = "[HOME] LOAD TOTAL BALANCE SUCCESS",
  LOAD_TOTAL_BALANCE_FAILURE = "[HOME] LOAD TOTAL BALANCE FAILURE",
  LOAD_ACCOUNTS = "[HOME] LOAD ACCOUNTS",
  LOAD_ACCOUNTS_SUCCESS = "[HOME] LOAD ACCOUNTS SUCCESS",
  LOAD_ACCOUNTS_FAILURE = "[HOME] LOAD ACCOUNTS FAILURE",
  LOAD_EXITS = "[HOME] LOAD EXITS",
  LOAD_EXITS_SUCCESS = "[HOME] LOAD EXITS SUCCESS",
  LOAD_EXITS_FAILURE = "[HOME] LOAD EXITS FAILURE",
  REFRESH_ACCOUNTS = "[HOME] REFRESH ACCOUNTS",
  REFRESH_ACCOUNTS_SUCCESS = "[HOME] REFRESH ACCOUNTS SUCCESS",
  RESET_STATE = "[HOME] RESET STATE",
}

export interface LoadTotalBalance {
  type: HomeActionTypes.LOAD_TOTAL_BALANCE;
}

export interface LoadTotalBalanceSuccess {
  type: HomeActionTypes.LOAD_TOTAL_BALANCE_SUCCESS;
  balance: number;
}

export interface LoadTotalBalanceFailure {
  type: HomeActionTypes.LOAD_TOTAL_BALANCE_FAILURE;
  error: string;
}

export interface LoadAccounts {
  type: HomeActionTypes.LOAD_ACCOUNTS;
}

export interface LoadAccountsSuccess {
  type: HomeActionTypes.LOAD_ACCOUNTS_SUCCESS;
  accounts: Accounts;
}

export interface LoadAccountsFailure {
  type: HomeActionTypes.LOAD_ACCOUNTS_FAILURE;
  error: string;
}

export interface LoadExits {
  type: HomeActionTypes.LOAD_EXITS;
}

export interface LoadExitsSuccess {
  type: HomeActionTypes.LOAD_EXITS_SUCCESS;
  exits: Exits;
}

export interface LoadExitsFailure {
  type: HomeActionTypes.LOAD_EXITS_FAILURE;
  error: string;
}

export interface RefreshAccounts {
  type: HomeActionTypes.REFRESH_ACCOUNTS;
}

export interface RefreshAccountsSuccess {
  type: HomeActionTypes.REFRESH_ACCOUNTS_SUCCESS;
  accounts: Accounts;
}

export interface ResetState {
  type: HomeActionTypes.RESET_STATE;
}

export type HomeAction =
  | LoadTotalBalance
  | LoadTotalBalanceSuccess
  | LoadTotalBalanceFailure
  | LoadAccounts
  | LoadAccountsSuccess
  | LoadAccountsFailure
  | LoadExits
  | LoadExitsSuccess
  | LoadExitsFailure
  | RefreshAccounts
  | RefreshAccountsSuccess
  | ResetState;

function loadTotalBalance(): LoadTotalBalance {
  return {
    type: HomeActionTypes.LOAD_TOTAL_BALANCE,
  };
}

function loadTotalBalanceSuccess(balance: number): LoadTotalBalanceSuccess {
  return {
    type: HomeActionTypes.LOAD_TOTAL_BALANCE_SUCCESS,
    balance,
  };
}

function loadTotalBalanceFailure(error: string): LoadTotalBalanceFailure {
  return {
    type: HomeActionTypes.LOAD_TOTAL_BALANCE_FAILURE,
    error,
  };
}

function loadAccounts(): LoadAccounts {
  return {
    type: HomeActionTypes.LOAD_ACCOUNTS,
  };
}

function loadAccountsSuccess(accounts: Accounts): LoadAccountsSuccess {
  return {
    type: HomeActionTypes.LOAD_ACCOUNTS_SUCCESS,
    accounts,
  };
}

function loadAccountsFailure(error: string): LoadAccountsFailure {
  return {
    type: HomeActionTypes.LOAD_ACCOUNTS_FAILURE,
    error,
  };
}

function loadExits(): LoadExits {
  return {
    type: HomeActionTypes.LOAD_EXITS,
  };
}

function loadExitsSuccess(exits: Exits): LoadExitsSuccess {
  return {
    type: HomeActionTypes.LOAD_EXITS_SUCCESS,
    exits,
  };
}

function loadExitsFailure(error: string): LoadExitsFailure {
  return {
    type: HomeActionTypes.LOAD_EXITS_FAILURE,
    error,
  };
}

function refreshAccounts(): RefreshAccounts {
  return {
    type: HomeActionTypes.REFRESH_ACCOUNTS,
  };
}

function refreshAccountsSuccess(accounts: Accounts): RefreshAccountsSuccess {
  return {
    type: HomeActionTypes.REFRESH_ACCOUNTS_SUCCESS,
    accounts,
  };
}

function resetState(): ResetState {
  return {
    type: HomeActionTypes.RESET_STATE,
  };
}

export {
  loadTotalBalance,
  loadTotalBalanceSuccess,
  loadTotalBalanceFailure,
  loadAccounts,
  loadAccountsSuccess,
  loadAccountsFailure,
  loadExits,
  loadExitsSuccess,
  loadExitsFailure,
  refreshAccounts,
  refreshAccountsSuccess,
  resetState,
};
