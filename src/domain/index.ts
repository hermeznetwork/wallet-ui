/**
 * This namespace contains the abstract definition of the types that are used across the application.
 * These types should correspond to real entities of the domain of the application. Special care must
 * be taken on the decision of what constitutes a domain entity, as these types will determine the general
 * discourse of the code of the whole application. Think of it as the glossary of the application.
 */

import { BigNumber } from "@ethersproject/bignumber";
import * as hermezjs from "@hermeznetwork/hermezjs";

export type {
  AccountAuthorization,
  CoordinatorState,
  Exit,
  Exits,
  FiatExchangeRates,
  HermezApiResourceItem,
  HermezWallet,
  HistoryTransaction,
  HistoryTransactions,
  ISOStringDate,
  L1Info,
  L2Info,
  MerkleProof,
  NextForger,
  PaginationOrder,
  PoolTransaction,
  PoolTransactions,
  RecommendedFee,
  Signers,
  Tx,
  Token,
  Tokens,
} from "@hermeznetwork/hermezjs";

export type NetworkStatus = "online" | "offline";

export interface HermezStatus {
  isUnderMaintenance: boolean;
}

export interface EthereumNetwork {
  chainId: number;
  name: string;
}

export type HermezRawAccount = hermezjs.Account;

export type HermezAccount = hermezjs.Account & { fiatBalance?: number };

export interface HermezAccounts {
  accounts: HermezAccount[];
  pendingItems: number;
}

export interface EthereumAccount {
  balance: string;
  token: hermezjs.Token;
  fiatBalance?: number;
}

export type Account = HermezAccount | EthereumAccount;
export type Transaction = hermezjs.HistoryTransaction | hermezjs.PoolTransaction;

export interface PendingDeposit {
  accountIndex?: string;
  amount: string;
  fromHezEthereumAddress: string;
  hash: string;
  state: hermezjs.Enums.TxState;
  timestamp: hermezjs.ISOStringDate;
  toHezEthereumAddress: string;
  token: hermezjs.Token;
  type: hermezjs.Enums.TxType.Deposit | hermezjs.Enums.TxType.CreateAccountDeposit;
  transactionId?: string;
}

export type PendingWithdraw = hermezjs.Exit & {
  hermezEthereumAddress: string;
  hash: string;
  id: string;
  timestamp: hermezjs.ISOStringDate;
};

export type PendingDelayedWithdraw = PendingWithdraw & {
  isInstant: boolean;
};

export type TimerWithdraw = {
  id: string;
  timestamp: hermezjs.ISOStringDate;
  token: hermezjs.Token;
};

export interface EstimatedL1Fee {
  amount: BigNumber;
  token: hermezjs.Token;
}

export type TransactionReceiver =
  | Pick<HermezAccount, "bjj">
  | Pick<HermezAccount, "hezEthereumAddress">;

// Type Guards

export function isHermezAccount(account: Account): account is HermezAccount {
  return "accountIndex" in account;
}

export function isEthereumAccount(account: Account): account is EthereumAccount {
  return !isHermezAccount(account);
}

export function isPoolTransaction(
  entity: hermezjs.HistoryTransaction | hermezjs.PoolTransaction | PendingDeposit
): entity is hermezjs.PoolTransaction {
  if ("hash" in entity) {
    // entity // is PendingDeposit
    return false;
  } else if ("state" in entity) {
    // entity // is PoolTransaction
    return true;
  } else {
    // entity // is HistoryTransaction
    return false;
  }
}

export function isHistoryTransaction(
  entity: hermezjs.HistoryTransaction | hermezjs.PoolTransaction | PendingDeposit
): entity is hermezjs.HistoryTransaction {
  if ("state" in entity) {
    // entity // is PoolTransaction or PendingDeposit
    return false;
  } else {
    // entity // is HistoryTransaction
    return true;
  }
}

export function isPendingDeposit(
  entity: hermezjs.HistoryTransaction | hermezjs.PoolTransaction | PendingDeposit
): entity is PendingDeposit {
  if ("hash" in entity) {
    // entity // is PendingDeposit
    return true;
  } else {
    // entity // is HistoryTransaction or PoolTransaction
    return false;
  }
}

export function isExit(
  transaction: hermezjs.Exit | hermezjs.PoolTransaction
): transaction is hermezjs.Exit {
  return "balance" in transaction;
}

// Local Storage

export type ChainId = string;
export type HermezEthereumAddress = string;

export type PendingWithdraws = Record<ChainId, ChainPendingWithdraws>;
export type ChainPendingWithdraws = Record<HermezEthereumAddress, PendingWithdraw[]>;

export type PendingDelayedWithdraws = Record<ChainId, ChainPendingDelayedWithdraws>;
export type ChainPendingDelayedWithdraws = Record<HermezEthereumAddress, PendingDelayedWithdraw[]>;

export type PendingDeposits = Record<ChainId, ChainPendingDeposits>;
export type ChainPendingDeposits = Record<HermezEthereumAddress, PendingDeposit[]>;

export type TimerWithdraws = Record<ChainId, ChainTimerWithdraws>;
export type ChainTimerWithdraws = Record<HermezEthereumAddress, TimerWithdraw[]>;

export type AuthSignatures = Record<ChainId, ChainAuthSignatures>;
export type ChainAuthSignatures = Record<HermezEthereumAddress, string>;

// User reporting
export type Message =
  | {
      type: "info-msg" | "success-msg" | "error-msg";
      text: string;
    }
  | {
      type: "error";
      text?: string;
      raw: unknown;
      parsed: string;
    };

// Env

export interface ProductionLiteral {
  REACT_APP_ENV: "production";
}

export interface ProductionVars {
  REACT_APP_INFURA_API_KEY: string;
  REACT_APP_PRICE_UPDATER_API_URL: string;
  REACT_APP_PRICE_UPDATER_API_KEY: string;
  REACT_APP_WALLETCONNECT_BRIDGE: string;
}

export type ProductionEnv = ProductionLiteral & ProductionVars;

export interface DevelopmentLiteral {
  REACT_APP_ENV: "development";
}

export type DevelopmentVars = ProductionVars & {
  REACT_APP_HERMEZ_API_URL: string;
  REACT_APP_HERMEZ_CONTRACT_ADDRESS: string;
  REACT_APP_WITHDRAWAL_DELAYER_CONTRACT_ADDRESS: string;
  REACT_APP_BATCH_EXPLORER_URL: string;
  REACT_APP_ETHERSCAN_URL: string;
};

export type DevelopmentEnv = DevelopmentLiteral & DevelopmentVars;

export type Env = ProductionEnv | DevelopmentEnv;

// Metamask errors
// https://github.com/MetaMask/eth-rpc-errors/blob/main/src/error-constants.ts

export interface InvalidInputError {
  type: "invalidInputError";
  code: -32000;
  message: string;
}
export interface ResourceNotFoundError {
  type: "resourceNotFoundError";
  code: -32001;
  message: string;
}
export interface ResourceUnavailableError {
  type: "resourceUnavailableError";
  code: -32002;
  message: string;
}
export interface TransactionRejectedError {
  type: "transactionRejectedError";
  code: -32003;
  message: string;
}
export interface MethodNotSupportedError {
  type: "methodNotSupportedError";
  code: -32004;
  message: string;
}
export interface LimitExceededError {
  type: "limitExceededError";
  code: -32005;
  message: string;
}
export interface ParseError {
  type: "parseError";
  code: -32700;
  message: string;
}
export interface InvalidRequestError {
  type: "invalidRequestError";
  code: -32600;
  message: string;
}
export interface MethodNotFoundError {
  type: "methodNotFoundError";
  code: -32601;
  message: string;
}
export interface InvalidParamsError {
  type: "invalidParamsError";
  code: -32602;
  message: string;
}
export interface InternalError {
  type: "internalError";
  code: -32603;
  message: string;
}

export interface UserRejectedRequestError {
  type: "userRejectedRequestError";
  code: 4001;
  message: string;
}
export interface UnauthorizedError {
  type: "unauthorizedError";
  code: 4100;
  message: string;
}
export interface UnsupportedMethodError {
  type: "unsupportedMethodError";
  code: 4200;
  message: string;
}
export interface DisconnectedError {
  type: "disconnectedError";
  code: 4900;
  message: string;
}
export interface ChainDisconnectedError {
  type: "chainDisconnectedError";
  code: 4901;
  message: string;
}

export type MetamaskError =
  | InvalidInputError
  | ResourceNotFoundError
  | ResourceUnavailableError
  | TransactionRejectedError
  | MethodNotSupportedError
  | LimitExceededError
  | ParseError
  | InvalidRequestError
  | MethodNotFoundError
  | InvalidParamsError
  | InternalError
  | UserRejectedRequestError
  | UnauthorizedError
  | UnsupportedMethodError
  | DisconnectedError
  | ChainDisconnectedError;
