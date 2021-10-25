import { PendingDeposit, PendingWithdraw, PendingDelayedWithdraw } from "src/domain/hermez";

export type ChainId = string;
export type HermezEthereumAddress = string;

export type PendingWithdraws = Record<ChainId, ChainPendingWithdraws>;
export type ChainPendingWithdraws = Record<HermezEthereumAddress, PendingWithdraw[]>;

export type PendingDelayedWithdraws = Record<ChainId, ChainPendingDelayedWithdraws>;
export type ChainPendingDelayedWithdraws = Record<HermezEthereumAddress, PendingDelayedWithdraw[]>;

export type PendingDeposits = Record<ChainId, ChainPendingDeposits>;
export type ChainPendingDeposits = Record<HermezEthereumAddress, PendingDeposit[]>;

export type AuthSignatures = Record<ChainId, ChainAuthSignatures>;
export type ChainAuthSignatures = Record<HermezEthereumAddress, string>;
