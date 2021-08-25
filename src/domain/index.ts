/**
 * This module contains the abstract definition of the types that are used across the application.
 * These types should correspond to real entities of the domain of the application. Special care must
 * be taken on the decision of what constitutes a domain entity, as these types will determine the general
 * discourse of the code of the whole application. Think of it as the glossary of the application.
 */

// ToDo: Search for all the "unknown" and "any" and replace with proper types

import { BigNumber } from 'ethers'

export type ISOStringDate = string;

/**
 * Ethereum network types
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

/**
 * Hermez network types
 */

export interface HermezStatus {
  isUnderMaintenance: boolean;
}

export type HermezNetworkStatus = "online" | "offline";

export interface HermezWallet {
  publicKeyBase64: string;
  publicKeyCompressedHex: string;
  hermezEthereumAddress: string;
}

export interface Signer {
  address: string;
  type: string;
}

// ToDo: Consider explicitly setting the supported FIAT
export type FiatExchangeRates = Record<string, number>;

export interface Token {
  decimals: number;
  ethereumAddress: string;
  ethereumBlockNum: number;
  fiatUpdate: ISOStringDate;
  id: number;
  itemId: number;
  name: string;
  symbol: string;
  USD: number;
}

export interface MerkleProof {
  root: string;
  siblings: BigNumber[];
  // oldKey: string;
  // oldValue: string;
  // isOld0: boolean;
  // key: string;
  // value: string;
  // fnc: number;
}

export interface Exit {
  // itemId: number;
  batchNum: number;
  accountIndex: string;
  // bjj: string;
  // hezEthereumAddress: string;
  // merkleProof: MerkleProof;
  // balance: string;
  instantWithdraw: number;
  // delayedWithdrawRequest: unknown | null;
  delayedWithdraw: unknown | null;
  // token: Token;
}

export interface Withdraw {
  accountIndex: string;
  // amount: string;
  batchNum: number;
  hash: string;
  // hermezEthereumAddress: string;
  id: string;
  timestamp: ISOStringDate;
  // token: Token;
}

export type DelayedWithdraw = Withdraw & {
  // merkleProof: MerkleProof;
  instant: boolean;
}

export interface Deposit {
  // account: Account;
  hash: string;
  // fromHezEthereumAddress: string;
  // toHezEthereumAddress: string;
  // token: Token;
  // amount: string;
  timestamp: ISOStringDate;
  // ToDo: This states are yet to be validated
  // state: "fged" | "fing" | "pend" | "invl";
  // type: "Deposit";
  // transactionId is added by the frontend to track
  // the pending deposits stored in local storage
  transactionId?: string;
}

// ToDo: What is the shape of a reward? 
export type Reward = unknown;
export interface Account {
  accountIndex: string;
  // balance: string;
  bjj: string;
  // hezEthereumAddress: string;
  // itemId: number;
  // nonce: number;
  // token: Token;
}

export interface HermezTransaction {
  // accountIndex: string;
  amount: string;
  // balance: string;
  batchNum: number;
  fromAccountIndex: string;
  // hash: string;
  // historicUSD: number;
  // id: string;
  // itemId: number;
  timestamp: ISOStringDate;
  token: Token;
  // ToDo: According to the docs: https://apidoc.hermez.network/#model-TransactionType supported types are:
  //       CreateAccountDeposit, CreateAccountDepositTransfer, Deposit, DepositTransfer, Exit, ForceExit, ForceTransfer, Transfer, TransferToBJJ TransferToEthAddr
  type:
    | "CreateAccountDeposit"
    | "Deposit"
    | "Exit"
    | "ForceExit"
    | "Transfer"
    | "TransferToBJJ"
    | "TransferToEthAddr"
    | "Withdrawn";
  state: "fged" | "fing" | "pend" | "invl";
  toHezEthereumAddress: string | null;
  toAccountIndex: string;
  fee: number;
  // L1orL2: "L1" | "L2";
  // L1Info: L1Info | null;
  // L2Info?: L2Info | null;
}

// interface L1Info {
//   depositAmount: number;
// }

// interface L2Info {
//   fee: number;
//   historicFeeUSD: number;
//   nonce: number;
// }

// Coordinator State
export interface CoordinatorState {
  // node: Node;
  // network: Network;
  // metrics: Metrics;
  // rollup: Rollup;
  // auction: Auction;
  // withdrawalDelayer: WithdrawalDelayer;
  // recommendedFee: RecommendedFee;
}
// interface Node {
//   forgeDelay: number;
//   poolLoad: number;
// }

// interface CollectedFees {}

// interface LastBatch {
//   itemId: number;
//   batchNum: number;
//   ethereumTxHash: string;
//   ethereumBlockNum: number;
//   ethereumBlockHash: string;
//   timestamp: ISOStringDate;
//   forgerAddr: string;
//   collectedFees: CollectedFees;
//   historicTotalCollectedFeesUSD: number;
//   stateRoot: string;
//   numAccounts: number;
//   exitRoot: string;
//   forgeL1TransactionsNum: number;
//   slotNum: number;
//   forgedTransactions: number;
// }

// interface Coordinator {
//   itemId: number;
//   bidderAddr: string;
//   forgerAddr: string;
//   ethereumBlock: number;
//   URL: string;
// }

// interface Period {
//   slotNum: number;
//   fromBlock: number;
//   toBlock: number;
//   fromTimestamp: string;
//   toTimestamp: string;
// }

// interface NextForger {
//   coordinator: Coordinator;
//   period: Period;
// }

// interface Network {
//   lastEthereumBlock: number;
//   lastSynchedBlock: number;
//   lastBatch: LastBatch;
//   currentSlot: number;
//   nextForgers: NextForger[];
//   pendingL1Transactions: number;
// }

// interface Metrics {
//   transactionsPerBatch: number;
//   batchFrequency: number;
//   transactionsPerSecond: number;
//   tokenAccounts: number;
//   wallets: number;
//   avgTransactionFee: number;
//   estimatedTimeToForgeL1: number;
// }

// interface Bucket {
//   ceilUSD: string;
//   blockStamp: string;
//   withdrawals: string;
//   rateBlocks: string;
//   rateWithdrawals: string;
//   maxWithdrawals: string;
// }

// interface Rollup {
//   ethereumBlockNum: number;
//   feeAddToken: string;
//   forgeL1L2BatchTimeout: number;
//   withdrawalDelay: number;
//   buckets: Bucket[];
//   safeMode: boolean;
// }

// interface Auction {
//   ethereumBlockNum: number;
//   donationAddress: string;
//   bootCoordinator: string;
//   bootCoordinatorUrl: string;
//   defaultSlotSetBid: string[];
//   defaultSlotSetBidSlotNum: number;
//   closedAuctionSlots: number;
//   openAuctionSlots: number;
//   allocationRatio: number[];
//   outbidding: number;
//   slotDeadline: number;
// }

// interface WithdrawalDelayer {
//   ethereumBlockNum: number;
//   hermezGovernanceAddress: string;
//   emergencyCouncilAddress: string;
//   withdrawalDelay: number;
//   emergencyModeStartingBlock: number;
//   emergencyMode: boolean;
// }

// interface RecommendedFee {
//   existingAccount: number;
//   createAccount: number;
//   createAccountInternal: number;
// }


// ToDo: Header
// The types below are required to keep the state of the headers of the pages. They don't belong to the domain.
// We'll keep them in here until we migrate the views to typescript.
interface PageHeader {
  type: "page";
  data: {
    title: string;
    goBackAction: {
      type: string;
      payload: {
        method: string;
        args: string[];
      };
    };
    closeAction: {
      type: string;
      payload: {
        method: string;
        args: string[];
      };
    };
  };
}

export type Header =
  | {
      type: undefined;
    }
  | {
      type: "main";
    }
  | PageHeader;