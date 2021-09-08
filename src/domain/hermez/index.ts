/**
 * HermezJS type definitions have been moved to the dedicated definitions file hermezjs-typings.d.ts
 * We may decide not to export them from the domain and let other layers import them from the lib.
 */

import { Deposit as HermezJSDeposit } from "@hermeznetwork/hermezjs";

export type {
  Account,
  BigNumber,
  CoordinatorState,
  DelayedWithdraw,
  L1Transaction,
  Exit,
  FiatExchangeRates,
  HermezApiResourceItem,
  HermezNetworkStatus,
  HermezStatus,
  L2Transaction,
  Wallet,
  ISOStringDate,
  MerkleProof,
  Reward,
  Signer,
  Token,
  Withdraw,
} from "@hermeznetwork/hermezjs";

export type Deposit = HermezJSDeposit & {
  transactionId?: string;
};
