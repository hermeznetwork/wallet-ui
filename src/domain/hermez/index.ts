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
  PendingDelayedWithdraw,
  PendingWithdraw,
  PooledTransaction,
  RecommendedFee,
  Token,
} from "@hermeznetwork/hermezjs";

export type { JsonRpcSignerData, SignerData } from "@hermeznetwork/hermezjs/src/signers";

export { SignerType } from "@hermeznetwork/hermezjs/src/signers";

export type Account = hermezjs.Account & { fiatBalance?: number };

export type PendingDeposit = hermezjs.PendingDeposit & {
  transactionId?: string;
};
