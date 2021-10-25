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
  MerkleProof,
  NextForger,
  PoolTransaction,
  RecommendedFee,
  Signers,
  Token,
} from "@hermeznetwork/hermezjs";

export type Account = hermezjs.Account & { fiatBalance?: number };

export interface PendingDeposit {
  account: Account;
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

export interface PendingWithdraw {
  accountIndex: string;
  batchNum: number;
  hash: string;
  id: string;
  timestamp: hermezjs.ISOStringDate;
  // amount: string;
  // hermezEthereumAddress: string;
  // token: hermezjs.Token;
}

export type PendingDelayedWithdraw = PendingWithdraw & {
  instant: boolean;
  merkleProof: hermezjs.MerkleProof;
};
