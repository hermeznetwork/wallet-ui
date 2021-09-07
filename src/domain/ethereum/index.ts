/**
 * Ethereum network types
 *
 * Some types and props are currently commented because are not used.
 * As we proceed with the migration of the application to typescript,
 * more properties and types will likely be required. We can uncomment
 * them as required and finally remove all those not required.
 */

export interface EthereumNetwork {
  // ToDo: It's ugly having "chainId" and "name" as optional, but currently setHermezEnvironment is called with no params
  //       from the mapDispatchToProps of the app.view, so we can't always build the EthereumNetwork object with values.
  //       For now, this interface reflects current reality, which should be reviewed so these value are mandatory.
  chainId?: number;
  name?: string;
}

export interface EthereumTransaction {
  hash: string;
  // type: number;
  blockNumber: number | null;
  // confirmations: number;
  // from: string;
  // gasPrice: BigNumber;
  // gasLimit: BigNumber;
  // to: string;
  // value: BigNumber;
  // nonce: number;
  // data: string;
  // r: string;
  // s: string;
  // v: number;
  // creates?: any;
  // chainId: number;
}

export interface EthereumBlock {
  // hash: string;
  // parentHash: string;
  // number: number;
  timestamp: number;
  // nonce: string;
  // difficulty: number;
  // gasLimit: BigNumber;
  // gasUsed: BigNumber;
  // miner: string;
  // extraData: string;
  // transactions: string[];
}

// export interface EthereumTransactionReceiptLog {
//   transactionIndex: number;
//   blockNumber: number;
//   transactionHash: string;
//   address: string;
//   topics: string[];
//   data: string;
//   logIndex: number;
//   blockHash: string;
// }

export interface EthereumTransactionReceipt {
  // to: string;
  // from: string;
  // contractAddress: string | null;
  // transactionIndex: number;
  // gasUsed: BigNumber;
  // logsBloom: string;
  // blockHash: string;
  transactionHash: string;
  // logs: EthereumTransactionReceiptLog[];
  // blockNumber: number;
  // confirmations: number;
  // cumulativeGasUsed: BigNumber;
  // status: number;
  // byzantium: boolean;
}
