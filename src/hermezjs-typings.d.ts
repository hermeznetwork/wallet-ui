/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-extra-semi */
/**
 * HermezJS Type Definitions
 *
 * Some types and props are currently commented because are not used by this app.
 * As we proceed with the migration of the application to typescript, more
 * properties and types will likely be required. We can uncomment them as
 * required and finally remove all those not required.
 */
declare module "@hermeznetwork/*" {
  import { TxState, TxType } from "@hermeznetwork/hermezjs/src/enums";

  export type ISOStringDate = string;

  export interface HermezStatus {
    isUnderMaintenance: boolean;
  }

  export type HermezNetworkStatus = "online" | "offline";

  // ToDo: Consider explicitly setting the supported FIAT
  export type FiatExchangeRates = Record<string, number>;

  export interface HermezApiResourceItem {
    itemId: number;
  }

  export type Token = HermezApiResourceItem & {
    decimals: number;
    ethereumAddress: string;
    ethereumBlockNum: number;
    id: number;
    name: string;
    symbol: string;
    USD: number;
    // fiatUpdate: ISOStringDate;
  };

  // interface L1Info {
  //   amountSuccess: boolean;
  //   depositAmount: string;
  //   depositAmountSuccess: boolean;
  //   ethereumBlockNum: number;
  //   historicDepositAmountUSD: number;
  //   toForgeL1TransactionsNum: number;
  //   userOrigin: boolean;
  // }

  // interface L2Info {
  //   fee: number;
  //   historicFeeUSD: number;
  //   nonce: number;
  // }

  export interface MerkleProof {
    root: string;
    siblings: string[];
    // fnc: number;
    // isOld0: boolean;
    // key: string;
    // oldKey: string;
    // oldValue: string;
    // value: string;
  }

  export type Exit = HermezApiResourceItem & {
    accountIndex: string;
    batchNum: number;
    delayedWithdraw: unknown | null;
    instantWithdraw: number | null;
    token: Token;
    merkleProof: MerkleProof;
    balance: string;
    // bjj: string;
    // delayedWithdrawRequest: unknown | null;
    // fee: number;
    // hash: string;
    // hezEthereumAddress: string;
  };

  export type HistoryTransaction = HermezApiResourceItem & {
    batchNum: number;
    fromAccountIndex: string;
    fromHezEthereumAddress: string;
    id: string;
    toHezEthereumAddress: string | null;
    type: TxType;
    // amount: string;
    // fromBJJ: string;
    // historicUSD: number | null;
    // L1Info: L1Info | null;
    // L1orL2: "L1" | "L2";
    // L2Info: L2Info | null;
    // position: number;
    // timestamp: ISOStringDate;
    // toAccountIndex: string;
    // toBJJ: string | null;
    // token: Token;
  };

  export type PoolTransaction = HermezApiResourceItem & {
    amount: string;
    errorCode: number | null;
    fee: number;
    fromAccountIndex: string;
    fromBJJ: string;
    fromHezEthereumAddress: string;
    state: TxState;
    timestamp: ISOStringDate;
    toAccountIndex: string;
    toBJJ: string | null;
    toHezEthereumAddress: string;
    token: Token;
    type: TxType;
    // batchNum: number | null;
    // errorType: string | null;
    // id: string;
    // info: string | null;
    // maxNumBatch: number;
    // nonce: number;
    // requestAmount: unknown | null;
    // requestFee: unknown | null;
    // requestFromAccountIndex: unknown | null;
    // requestNonce: unknown | null;
    // requestToAccountIndex: unknown | null;
    // requestToBJJ: unknown | null;
    // requestToHezEthereumAddress: unknown | null;
    // requestTokenId: unknown | null;
    // signature: string;
  };

  export type Account = HermezApiResourceItem & {
    accountIndex: string;
    balance: string;
    bjj: string;
    hezEthereumAddress: string;
    // nonce: number;
    token: Token;
  };

  // Coordinator State
  export interface CoordinatorState {
    // node: Node;
    network: Network;
    // metrics: Metrics;
    // rollup: Rollup;
    // auction: Auction;
    // withdrawalDelayer: WithdrawalDelayer;
    recommendedFee: RecommendedFee;
  }

  // interface Node {
  //   forgeDelay: number;
  //   poolLoad: number;
  // };

  // interface CollectedFees {};

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
  // };

  type Coordinator = HermezApiResourceItem & {
    // bidderAddr: string;
    forgerAddr: string;
    // ethereumBlock: number;
    URL: string;
  };

  interface Period {
    // slotNum: number;
    // fromBlock: number;
    // toBlock: number;
    // fromTimestamp: string;
    toTimestamp: string;
  }

  export interface NextForger {
    coordinator: Coordinator;
    period: Period;
  }

  interface Network {
    // lastEthereumBlock: number;
    // lastSynchedBlock: number;
    // lastBatch: LastBatch;
    // currentSlot: number;
    nextForgers: NextForger[];
    // pendingL1Transactions: number;
  }

  // interface Metrics {
  //   transactionsPerBatch: number;
  //   batchFrequency: number;
  //   transactionsPerSecond: number;
  //   tokenAccounts: number;
  //   wallets: number;
  //   avgTransactionFee: number;
  //   estimatedTimeToForgeL1: number;
  // };

  // interface Bucket {
  //   ceilUSD: string;
  //   blockStamp: string;
  //   withdrawals: string;
  //   rateBlocks: string;
  //   rateWithdrawals: string;
  //   maxWithdrawals: string;
  // };

  // interface Rollup {
  //   ethereumBlockNum: number;
  //   feeAddToken: string;
  //   forgeL1L2BatchTimeout: number;
  //   withdrawalDelay: number;
  //   buckets: Bucket[];
  //   safeMode: boolean;
  // };

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
  // };

  // interface WithdrawalDelayer {
  //   ethereumBlockNum: number;
  //   hermezGovernanceAddress: string;
  //   emergencyCouncilAddress: string;
  //   withdrawalDelay: number;
  //   emergencyModeStartingBlock: number;
  //   emergencyMode: boolean;
  // };

  export interface RecommendedFee {
    existingAccount: number;
    createAccount: number;
    createAccountInternal: number;
  }

  // persistence
  export interface HistoryTransactions {
    transactions: HistoryTransaction[];
    pendingItems: number;
  }

  export interface Exits {
    exits: Exit[];
    pendingItems: number;
  }

  export interface Accounts {
    accounts: Account[];
    pendingItems: number;
  }

  // library modules
  export { default as HermezWallet } from "@hermeznetwork/hermezjs/src/hermez-wallet";
  export { default as Utils } from "@hermeznetwork/hermezjs/src/utils";
  export { default as Tx } from "@hermeznetwork/hermezjs/src/tx";
  export { default as TxUtils } from "@hermeznetwork/hermezjs/src/tx-utils";
  export { default as TxFees } from "@hermeznetwork/hermezjs/src/tx-fees";
  export { default as TxPool } from "@hermeznetwork/hermezjs/src/tx-pool";
  export { default as CoordinatorAPI } from "@hermeznetwork/hermezjs/src/api";
  export { default as Constants } from "@hermeznetwork/hermezjs/src/constants";
  export { default as HermezCompressedAmount } from "@hermeznetwork/hermezjs/src/hermez-compressed-amount";
  export { default as Addresses } from "@hermeznetwork/hermezjs/src/addresses";
  export { default as Providers } from "@hermeznetwork/hermezjs/src/providers";
  export { default as Signers } from "@hermeznetwork/hermezjs/src/signers";
  export { default as Environment } from "@hermeznetwork/hermezjs/src/environment";
  export { default as Enums } from "@hermeznetwork/hermezjs/src/enums";
  export { default as AtomicUtils } from "@hermeznetwork/hermezjs/src/atomic-utils";
  export { default as HTTP } from "@hermeznetwork/hermezjs/src/http";
}

// Wallet
declare module "@hermeznetwork/hermezjs/src/hermez-wallet" {
  import { SignerData, SignerData } from "@hermeznetwork/hermezjs/src/signers";
  export declare class HermezWallet {
    constructor(privateKey: Buffer, hermezEthereumAddress: string);
    privateKey: Buffer;
    hermezEthereumAddress: string;
    publicKeyBase64: string;
    publicKeyCompressedHex: string;
    // publicKey: string[];
    // publicKeyHex: string[];
    // publicKeyCompressed: string;
    // signTransaction (transaction, encodedTransaction): HistoryTransaction;
    signCreateAccountAuthorization(providerUrl?: string, signerData?: SignerData): Promise<string>;
  }

  // declare function createWalletFromEtherAccount() {};
  // declare function createWalletFromBjjPvtKey() {};
}

// Utils
declare module "@hermeznetwork/hermezjs/src/utils" {
  // declare function bufToHex() {};
  declare function hexToBuffer(hex: string): Buffer {};
  // declare function getTokenAmountString() {};
  // declare function getTokenAmountBigInt() {};
  // declare function padZeros() {};
  // declare function extract() {};
  // declare function getRandomBytes() {};
}

// Tx
declare module "@hermeznetwork/hermezjs/src/tx" {
  import { Token, HermezWallet, Exit, Signers } from "@hermeznetwork/hermezjs";
  import { HermezCompressedAmount } from "@hermeznetwork/hermezjs/src/hermez-compressed-amount";
  import { TxType } from "@hermeznetwork/hermezjs/src/enums";

  // declare function deposit() {};
  // declare function forceExit() {};
  // declare function withdraw() {};
  // declare function delayedWithdraw() {};
  // declare function isInstantWithdrawalAllowed() {};
  // declare function sendL2Transaction() {};

  interface Tx {
    type: TxType;
    from: string;
    to?: string;
    amount: HermezCompressedAmount;
    fee: number;
    nonce?: number;
    maxNumBatch?: number;
  }

  interface SendL2TransactionResponse {
    status: number;
    id: string;
    nonce: number;
  }

  interface WithdrawResponse {
    hash: string;
  }

  declare function generateAndSendL2Tx(
    tx: Tx,
    wallet: HermezWallet.HermezWallet,
    token: Token,
    nextForgers: string[],
    addToTxPool?: boolean
  ): Promise<SendL2TransactionResponse> {};

  declare function withdrawCircuit(
    exit: Exit,
    isInstant: boolean,
    wasmFilePath: string,
    zkeyFilePath: string,
    signerData: Signers.SignerData
  ): Promise<WithdrawResponse> {};

  declare function delayedWithdraw(
    hezEthereumAddress: string,
    token: Token,
    signerData: Signers.SignerData
  ): Promise<WithdrawResponse> {};

  // declare function sendAtomicGroup() {};
  // declare function generateAndSendAtomicGroup() {};
}

// TxUtils
declare module "@hermeznetwork/hermezjs/src/tx-utils" {
  // declare function _encodeTransaction() {};

  declare function getL1UserTxId(toForgeL1TxsNum: number, currentPosition: number): string {};

  // declare function getL2TxId() {};
  // declare function getFeeIndex() {};

  // ToDo: amount is expected to be a ffjavascript Scalar, but since the functions in a Scalar convert
  //       their inputs to BigInt's, amount can be a string | number | bigint | boolean
  declare function getFeeValue(
    feeIndex: number,
    amount: string | number | bigint | boolean
  ): bigint {};
  // declare function getMaxAmountFromMinimumFee() {};
  // declare function getTransactionType() {};
  // declare function getNonce() {};
  // declare function _buildTxCompressedData() {};
  // declare function buildTransactionHashMessage() {};
  // declare function buildTxCompressedDataV2() {};
  // declare function generateL2Transaction() {};
  // declare function computeL2Transaction() {};
  // declare function generateAtomicTransaction() {};
  // declare function beautifyTransactionStat() {};
}

// TxFees
declare module "@hermeznetwork/hermezjs/src/tx-fees" {
  import { Token, Signers } from "@hermeznetwork/hermezjs";
  import { CallOverrides, BigNumber } from "ethers";

  // declare function estimateDepositGasLimit() {};

  declare function estimateWithdrawGasLimit(
    token: Token,
    estimatedMerkleSiblingsLength: number,
    amount: BigNumber,
    overrides: CallOverrides,
    signerData?: Signers.SignerData,
    providerUrl?: string,
    isInstant?: boolean
  ): Promise<number> {};
}

// TxPool
declare module "@hermeznetwork/hermezjs/src/tx-pool" {
  import { PoolTransaction } from "@hermeznetwork/hermezjs";
  import { PaginationOrder } from "@hermeznetwork/hermezjs/src/api";

  declare function initializeTransactionPool() {};

  declare function getPoolTransactions(
    address?: string,
    state: string,
    type?: string,
    tokenId?: number,
    accountIndex?: string,
    fromItem?: number,
    order?: PaginationOrder,
    limit?: number,
    axiosConfig?: Record<string, unknown>
  ): Promise<PoolTransaction[]> {};

  // declare function addPoolTransaction() {};
  // declare function removePoolTransaction() {};
}

// CoordinatorAPI
declare module "@hermeznetwork/hermezjs/src/api" {
  import {
    Account,
    Accounts,
    HistoryTransaction,
    Exit,
    Exits,
    HistoryTransactions,
    CoordinatorState,
    Token,
    PoolTransaction,
  } from "@hermeznetwork/hermezjs";

  export type PaginationOrder = "ASC" | "DESC";

  // declare function _getPageData() {};
  // declare function setBaseApiUrl() {};
  // declare function getBaseApiUrl() {};

  declare function getAccounts(
    address: string,
    tokenIds?: number[],
    fromItem?: number,
    order?: PaginationOrder,
    limit?: number,
    axiosConfig?: Record<string, unknown>
  ): Promise<Accounts> {};

  declare function getAccount(accountIndex: string): Promise<Account> {};

  declare function getTransactions(
    address?: string,
    tokenId?: number,
    batchNum?: number,
    accountIndex: string,
    fromItem?: number,
    order?: PaginationOrder,
    limit?: number,
    axiosConfig?: Record<string, unknown>
  ): Promise<HistoryTransactions> {};

  declare function getHistoryTransaction(
    transactionId: string,
    axiosConfig?: Record<string, unknown>
  ): Promise<HistoryTransaction> {};

  declare function getPoolTransaction(
    transactionId: string,
    axiosConfig?: Record<string, unknown>
  ): Promise<PoolTransaction> {};

  // declare function postPoolTransaction() {};
  // declare function postAtomicGroup() {};

  declare function getExit(
    batchNum: number,
    accountIndex: string,
    axiosConfig?: Record<string, unknown>
  ): Promise<Exit> {};

  declare function getExits(
    address: string,
    onlyPendingWithdraws: boolean,
    tokenId?: number,
    fromItem?: number
  ): Promise<Exits> {};

  // declare function getTokens() {};

  declare function getToken(tokenId: number): Promise<Token> {};

  declare function getState(
    axiosConfig?: Record<string, unknown>,
    apiUrl?: string
  ): Promise<CoordinatorState> {};

  // declare function getBatches() {};
  // declare function getBatch() {};
  // declare function getCoordinators() {};
  // declare function getSlot() {};
  // declare function getBids() {};

  // ToDo: The app does not uses the response but it would be nice to type it at some point
  declare function postCreateAccountAuthorization(
    hezEthereumAddress: string,
    bJJ: string,
    signature: string,
    nextForgerUrls?: string[],
    axiosConfig?: Record<string, unknown>
  ): Promise<unknown> {};
  // declare function getCreateAccountAuthorization() {};
  // declare function getConfig() {};

  declare function getPoolTransactions(
    accountIndex: string,
    publicKeyCompressedHex: string
  ): Promise<HistoryTransaction[]> {};

  // declare function getHealth() {};
}

// Constants
declare module "@hermeznetwork/hermezjs/src/constants" {
  // declare const TRANSACTION_POOL_KEY: string;
  declare const METAMASK_MESSAGE: string;
  // declare const CREATE_ACCOUNT_AUTH_MESSAGE: string;
  // declare const EIP_712_VERSION: string;
  // declare const EIP_712_PROVIDER: string;
  declare const ETHER_TOKEN_ID: number;
  // declare const GAS_LIMIT: number;
  // declare const GAS_LIMIT_HIGH: number;
  // declare const GAS_LIMIT_LOW: number;
  // declare const GAS_STANDARD_ERC20_TX: number;
  // declare const GAS_LIMIT_WITHDRAW: number;
  // declare const SIBLING_GAS_COST: number;
  // declare const NON_INSTANT_WITHDRAW_ERC20_GAS_COST: number;
  // declare const NON_INSTANT_WITHDRAW_ETH_GAS_COST: number;
  // declare const GAS_MULTIPLIER: number;
  // declare const DEFAULT_PAGE_SIZE: number;
  // declare const API_VERSION: string;
  // declare const BASE_API_URL: string;
  // declare const BATCH_EXPLORER_URL: string;
  // declare const ETHERSCAN_URL: string;
  declare const ContractNames: {
    Hermez: string;
    WithdrawalDelayer: string;
  };
  // declare const CONTRACT_ADDRESSES: Record<string, string>;
  // declare const STORAGE_VERSION_KEY: string;
  // declare const STORAGE_VERSION: number;
  // declare const APPROVE_AMOUNT: string;
  declare const INTERNAL_ACCOUNT_ETH_ADDR: string;
  // declare const EMPTY_BJJ_ADDR: string;
  // declare const MAX_NLEVELS: number;
  // declare const WITHDRAWAL_CIRCUIT_NLEVELS: number;
  // declare const WITHDRAWAL_WASM_URL: string;
  // declare const WITHDRAWAL_ZKEY_URL: string;
  // declare const ETHER_ADDRESS: string;
  // declare const TX_ID_BYTES: number;
}

// HermezCompressedAmount
declare module "@hermeznetwork/hermezjs/src/hermez-compressed-amount" {
  export interface HermezCompressedAmount {
    type: "HermezCompressedAmount";
    value: number;
  }
  declare function compressAmount(_f: string): HermezCompressedAmount;
}

// Addresses
declare module "@hermeznetwork/hermezjs/src/addresses" {
  declare function getHermezAddress(ethereumAddress: string): string {};

  declare function getEthereumAddress(accountIndex: string): string {};

  // declare function isEthereumAddress() {};
  // declare function isHermezEthereumAddress() {};
  // declare function isHermezBjjAddress() {};
  // declare function isHermezAccountIndex() {};
  // declare function getAccountIndex() {};
  // declare function hexToBase64BJJ() {};
  // declare function base64ToHexBJJ() {};
  // declare function getAySignFromBJJ() {};
}

// Providers
declare module "@hermeznetwork/hermezjs/src/providers" {
  import { Web3Provider } from "@ethersproject/providers";

  declare const PROVIDER_TYPES: {
    WEB3: "web3";
  };
  declare function setProvider(
    providerData?: string | Record<string, unknown>,
    providerType?: string
  ): Web3Provider {};

  declare function getProvider(
    providerData?: string | Record<string, unknown>,
    providerType?: string
  ): Web3Provider {};
}

// Signers
declare module "@hermeznetwork/hermezjs/src/signers" {
  import { Web3Provider } from "@ethersproject/providers";
  import { Signer, Signer } from "@ethersproject/abstract-signer";
  import { Manifest } from "trezor-connect";

  export enum SignerType {
    JSON_RPC = "JSON-RPC",
    LEDGER = "LEDGER",
    TREZOR = "TREZOR",
    WALLET = "WALLET",
  }

  export interface JsonRpcSignerData {
    type: "JSON-RPC";
    addressOrIndex?: null | string | number;
  }

  export interface LedgerSignerData {
    type: "LEDGER";
    path?: string;
  }

  export interface TrezorSignerData {
    type: "TREZOR";
    path?: string;
    manifest: Manifest;
    address?: string;
  }

  export interface WalletSignerData {
    type: "WALLET";
    privateKey: string;
  }

  export type SignerData =
    | JsonRpcSignerData
    | LedgerSignerData
    | TrezorSignerData
    | WalletSignerData;

  declare function getSigner(provider: Web3Provider, signerData: SignerData): Promise<Signer> {};
}

// Environment
declare module "@hermeznetwork/hermezjs/src/environment" {
  declare function setEnvironment(env: number | Record<string, unknown>) {};

  // declare function getCurrentEnvironment() {};
  // declare function getSupportedEnvironments() {};

  declare function isEnvironmentSupported(chainId: number): boolean {};

  // declare function getBatchExplorerUrl() {};
  // declare function getEtherscanUrl() {};
}

// Enums
declare module "@hermeznetwork/hermezjs/src/enums" {
  export enum TxType {
    Deposit = "Deposit",
    CreateAccountDeposit = "CreateAccountDeposit",
    Transfer = "Transfer",
    TransferToEthAddr = "TransferToEthAddr",
    TransferToBJJ = "TransferToBJJ",
    Withdraw = "Withdrawn",
    Exit = "Exit",
    ForceExit = "ForceExit",
  }

  export enum TxState {
    Forged = "fged",
    Forging = "fing",
    Pending = "pend",
    Invalid = "invl",
  }

  // declare enum TxLevel {
  //   L1 = "L1",
  //   L2 = "L2",
  // }
}

// AtomicUtils
declare module "@hermeznetwork/hermezjs/src/atomic-utils" {
  // declare function hasLinkedTransaction() {};
  // declare function addLinkedTransaction() {};
  // declare function buildAtomicTransaction() {};
  // declare function generateAtomicGroup() {};
  // declare function generateAtomicID() {};
}

// HTTP
declare module "@hermeznetwork/hermezjs/src/http" {
  declare const HttpStatusCode = {
    NOT_FOUND = 404,
  };

  // declare function extractJSON() {}
}

// HermezABI
declare module "@hermeznetwork/hermezjs/src/abis/HermezABI" {
  declare const HermezABI: string | ReadonlyArray<Fragment | JsonFragment | string>;
  export default HermezABI;
}
