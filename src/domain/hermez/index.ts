/**
 * Hermez network types.
 *
 * Some types and props are currently commented because are not used.
 * As we proceed with the migration of the application to typescript,
 * more properties and types will likely be required. We can uncomment
 * them as required and finally remove all those not required.
 */

import { BigNumber } from 'ethers'
import { ISOStringDate } from 'src/domain'

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

export interface HermezApiResourceItem {
  itemId: number;
}

export type Token = HermezApiResourceItem & {
  decimals: number;
  ethereumAddress: string;
  ethereumBlockNum: number;
  fiatUpdate: ISOStringDate;
  id: number;
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

export type Exit = HermezApiResourceItem & {
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

export type Account = HermezApiResourceItem & {
  accountIndex: string;
  // balance: string;
  bjj: string;
  // fiatBalance: number;
  // hezEthereumAddress: string;
  // nonce: number;
  // token: Token;
}

export type HermezTransaction = HermezApiResourceItem & {
  // accountIndex: string;
  amount: string;
  // balance: string;
  batchNum: number;
  fromAccountIndex: string;
  // hash: string;
  // historicUSD: number;
  // id: string;
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

// type LastBatch = HermezApiResourceItem & {
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

// type Coordinator = HermezApiResourceItem & {
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
