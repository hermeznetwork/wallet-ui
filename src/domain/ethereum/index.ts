/**
 * HermezJS type definitions have been moved to the dedicated definitions file hermezjs-typings.d.ts
 * We may decide not to export them from the domain and let other layers import them from the lib.
 */

export type { EthereumTransactionReceipt } from "@hermeznetwork/hermezjs";

export interface EthereumNetwork {
  chainId: number;
  name: string;
}
