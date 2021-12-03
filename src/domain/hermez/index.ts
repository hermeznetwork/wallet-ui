/**
 * HermezJS type definitions have been moved to the dedicated definitions file hermezjs-typings.d.ts
 * We may decide not to export them from the domain and let other layers import them from the lib.
 */
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
  MerkleProof,
  NextForger,
  PoolTransaction,
  RecommendedFee,
  Signers,
  Token,
} from "@hermeznetwork/hermezjs";

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

// Type Guards

export function isHermezAccount(account: Account): account is HermezAccount {
  return "accountIndex" in account;
}

export function isEthereumAccount(account: Account): account is EthereumAccount {
  return !isHermezAccount(account);
}

export function isPoolTransaction(
  transaction: Transaction
): transaction is hermezjs.PoolTransaction {
  return "state" in transaction;
}

export function isHistoryTransaction(
  transaction: Transaction
): transaction is hermezjs.HistoryTransaction {
  return !isPoolTransaction(transaction);
}

export function isExit(
  transaction: hermezjs.Exit | hermezjs.PoolTransaction
): transaction is hermezjs.Exit {
  return "balance" in transaction;
}
