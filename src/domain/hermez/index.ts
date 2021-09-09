/**
 * HermezJS type definitions have been moved to the dedicated definitions file hermezjs-typings.d.ts
 * We may decide not to export them from the domain and let other layers import them from the lib.
 */

import * as hermezjs from "@hermeznetwork/hermezjs";

export type {
  Account,
  CoordinatorState,
  DelayedWithdraw,
  Exit,
  FiatExchangeRates,
  HermezApiResourceItem,
  HermezNetworkStatus,
  HermezStatus,
  Transaction,
  Wallet,
  ISOStringDate,
  MerkleProof,
  Signer,
  Token,
  Withdraw,
} from "@hermeznetwork/hermezjs";

export type Deposit = hermezjs.Deposit & { transactionId?: string };
