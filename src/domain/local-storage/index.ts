import { Deposit, Withdraw, DelayedWithdraw } from "src/domain/hermez";

type ChainId = string;
type HermezEthereumAddress = string;
export type PendingWithdraws = Record<ChainId, Record<HermezEthereumAddress, Withdraw[]>>;
export type PendingDelayedWithdraws = Record<
  ChainId,
  Record<HermezEthereumAddress, DelayedWithdraw[]>
>;
export type PendingDeposits = Record<ChainId, Record<HermezEthereumAddress, Deposit[]>>;
