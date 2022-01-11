/**
 * This namespace contains the abstract definition of the types that are used across the application.
 * These types should correspond to real entities of the domain of the application. Special care must
 * be taken on the decision of what constitutes a domain entity, as these types will determine the general
 * discourse of the code of the whole application. Think of it as the glossary of the application.
 */

import { BigNumber } from "@ethersproject/bignumber";
import * as hermezjs from "@hermeznetwork/hermezjs";

export type {
  CoordinatorState,
  Exit,
  FiatExchangeRates,
  HermezApiResourceItem,
  HermezNetworkStatus,
  HermezStatus,
  HermezWallet,
  HistoryTransaction,
  ISOStringDate,
  L1Info,
  L2Info,
  MerkleProof,
  NextForger,
  PoolTransaction,
  RecommendedFee,
  Signers,
  Token,
} from "@hermeznetwork/hermezjs";

export interface EthereumNetwork {
  chainId: number;
  name: string;
}

export type HermezAccount = hermezjs.Account & { fiatBalance?: number };

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
