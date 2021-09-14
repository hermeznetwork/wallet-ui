import { Deposit, Withdraw, DelayedWithdraw } from "src/domain/hermez";

export type ChainId = string;
export type HermezEthereumAddress = string;

export type PendingWithdraws = Record<ChainId, ChainPendingWithdraws>;
export type ChainPendingWithdraws = Record<HermezEthereumAddress, Withdraw[]>;

export type PendingDelayedWithdraws = Record<ChainId, ChainPendingDelayedWithdraws>;
export type ChainPendingDelayedWithdraws = Record<HermezEthereumAddress, DelayedWithdraw[]>;

export type PendingDeposits = Record<ChainId, Record<HermezEthereumAddress, Deposit[]>>;
