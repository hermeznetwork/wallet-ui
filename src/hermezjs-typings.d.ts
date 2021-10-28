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

  export type ScalarValue = string | number;

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

  export interface L1Info {
    // amountSuccess: boolean;
    depositAmount: string;
    // depositAmountSuccess: boolean;
    // ethereumBlockNum: number;
    // historicDepositAmountUSD: number;
    // toForgeL1TransactionsNum: number;
    // userOrigin: boolean;
  }

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
    // balance: string;
    // bjj: string;
    // delayedWithdrawRequest: unknown | null;
    // fee: number;
    // hash: string;
    // hezEthereumAddress: string;
    // merkleProof: MerkleProof;
    // token: Token;
  };

  export type HistoryTransaction = HermezApiResourceItem & {
    batchNum: number;
    fromAccountIndex: string;
    fromHezEthereumAddress: string;
    id: string;
    toHezEthereumAddress: string | null;
    type: TxType;
    amount: string;
    // fromBJJ: string;
    // historicUSD: number | null;
    L1Info: L1Info | null;
    L1orL2: "L1" | "L2";
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
    node: Node;
    network: Network;
    // metrics: Metrics;
    // rollup: Rollup;
    // auction: Auction;
    // withdrawalDelayer: WithdrawalDelayer;
    recommendedFee: RecommendedFee;
  }

  interface Node {
    forgeDelay: number;
    poolLoad: number;
  }

  // interface CollectedFees;

  type LastBatch = HermezApiResourceItem & {
    //   batchNum: number;
    //   ethereumTxHash: string;
    //   ethereumBlockNum: number;
    //   ethereumBlockHash: string;
    timestamp: ISOStringDate;
    //   forgerAddr: string;
    //   collectedFees: CollectedFees;
    //   historicTotalCollectedFeesUSD: number;
    //   stateRoot: string;
    //   numAccounts: number;
    //   exitRoot: string;
    //   forgeL1TransactionsNum: number;
    //   slotNum: number;
    //   forgedTransactions: number;
  };

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
    lastBatch: LastBatch;
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

  export interface Tokens {
    tokens: Token[];
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
  import { SignerData } from "@hermeznetwork/hermezjs/src/signers";
  export class HermezWallet {
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

  // function createWalletFromEtherAccount();
  // function createWalletFromBjjPvtKey();
}

// Utils
declare module "@hermeznetwork/hermezjs/src/utils" {
  import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
  // function bufToHex();
  function hexToBuffer(hex: string): Buffer;
  function getTokenAmountString(amountBigInt: BigNumberish, decimals: number): string;
  function getTokenAmountBigInt(amountString: BigNumberish, decimals: number): BigNumber;
  // function padZeros();
  // function extract();
  // function getRandomBytes();
}

// Tx
declare module "@hermeznetwork/hermezjs/src/tx" {
  import { Token, HermezWallet } from "@hermeznetwork/hermezjs";
  import HermezCompressedAmount from "@hermeznetwork/hermezjs/src/hermez-compressed-amount";
  import { TxType } from "@hermeznetwork/hermezjs/src/enums";
  import { SignerData } from "@hermeznetwork/hermezjs/src/signers";

  export interface TxData {
    hash: string;
    // type: number;
    // accessList: unknown;
    // blockHash: unknown;
    // blockNumber: unknown;
    // transactionIndex: unknown;
    // confirmations: number;
    // from: string;
    // gasPrice: BigNumber;
    // maxPriorityFeePerGas: BigNumber;
    // maxFeePerGas: BigNumber;
    // gasLimit: BigNumber;
    // to: string;
    // value: BigNumber;
    // nonce: number;
    // data: string;
    // r: string;
    // s: string;
    // v: number;
    // creates: unknown;
    // chainId: number;
  }

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

  function deposit(
    amount: HermezCompressedAmount,
    hezEthereumAddress: string,
    token: Token,
    babyJubJub: string,
    signerData: SignerData,
    providerUrl?: string,
    gasLimit?: number,
    gasMultiplier?: number
  ): Promise<TxData>;

  // function forceExit();
  // function withdraw();
  // function delayedWithdraw();
  // function isInstantWithdrawalAllowed();
  // function sendL2Transaction();

  function generateAndSendL2Tx(
    tx: Tx,
    wallet: HermezWallet.HermezWallet,
    token: Token,
    nextForgers: string[],
    addToTxPool?: boolean
  ): Promise<SendL2TransactionResponse>;

  // function sendAtomicGroup();
  // function generateAndSendAtomicGroup();
  // function withdrawCircuit();
}

// TxUtils
declare module "@hermeznetwork/hermezjs/src/tx-utils" {
  import { ScalarValue } from "@hermeznetwork/hermezjs";

  // function _encodeTransaction();

  function getL1UserTxId(toForgeL1TxsNum: number, currentPosition: number): string;

  // function getL2TxId();
  function getFeeIndex(fee: ScalarValue, amount: ScalarValue): number;

  function getFeeValue(feeIndex: number, amount: ScalarValue): bigint;

  function getMaxAmountFromMinimumFee(minimumFee: ScalarValue, balance: ScalarValue): ScalarValue;

  // function getTransactionType();
  // function getNonce();
  // function _buildTxCompressedData();
  // function buildTransactionHashMessage();
  // function buildTxCompressedDataV2();
  // function generateL2Transaction();
  // function computeL2Transaction();
  // function generateAtomicTransaction();
  // function beautifyTransactionStat();
}

// TxFees
declare module "@hermeznetwork/hermezjs/src/tx-fees" {
  import { Token, Signers } from "@hermeznetwork/hermezjs";
  import { CallOverrides } from "ethers";
  import { BigNumber } from "ethers";

  // function estimateDepositGasLimit();

  function estimateWithdrawGasLimit(
    token: Token,
    estimatedMerkleSiblingsLength: number,
    amount: BigNumber,
    overrides: CallOverrides,
    signerData?: Signers.SignerData,
    providerUrl?: string,
    isInstant?: boolean
  ): Promise<number>;
}

// TxPool
declare module "@hermeznetwork/hermezjs/src/tx-pool" {
  import { PoolTransaction } from "@hermeznetwork/hermezjs";
  import { PaginationOrder } from "@hermeznetwork/hermezjs/src/api";

  function initializeTransactionPool(): void;

  function getPoolTransactions(
    address: string | undefined,
    state: string,
    type?: string,
    tokenId?: number,
    accountIndex?: string,
    fromItem?: number,
    order?: PaginationOrder,
    limit?: number,
    axiosConfig?: Record<string, unknown>
  ): Promise<PoolTransaction[]>;

  // function addPoolTransaction();
  // function removePoolTransaction();
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
    Tokens,
    PoolTransaction,
  } from "@hermeznetwork/hermezjs";

  export type PaginationOrder = "ASC" | "DESC";

  // function _getPageData();
  // function setBaseApiUrl();
  // function getBaseApiUrl();

  function getAccounts(
    address: string,
    tokenIds?: number[],
    fromItem?: number,
    order?: PaginationOrder,
    limit?: number,
    axiosConfig?: Record<string, unknown>
  ): Promise<Accounts>;

  function getAccount(accountIndex: string): Promise<Account>;

  function getTransactions(
    address?: string,
    tokenId?: number,
    batchNum?: number,
    accountIndex?: string,
    fromItem?: number,
    order?: PaginationOrder,
    limit?: number,
    axiosConfig?: Record<string, unknown>
  ): Promise<HistoryTransactions>;

  function getHistoryTransaction(
    transactionId: string,
    axiosConfig?: Record<string, unknown>
  ): Promise<HistoryTransaction>;

  function getPoolTransaction(
    transactionId: string,
    axiosConfig?: Record<string, unknown>
  ): Promise<PoolTransaction>;

  // function postPoolTransaction();
  // function postAtomicGroup();

  function getExit(
    batchNum: number,
    accountIndex: string,
    axiosConfig?: Record<string, unknown>
  ): Promise<Exit>;

  function getExits(
    address: string,
    onlyPendingWithdraws: boolean,
    tokenId?: number,
    fromItem?: number
  ): Promise<Exits>;

  function getTokens(
    tokenIds?: number[],
    tokenSymbols?: string[],
    fromItem?: number,
    order?: PaginationOrder,
    limit?: number,
    axiosConfig?: Record<string, unknown>
  ): Promise<Tokens>;

  function getToken(tokenId: number): Promise<Token>;

  function getState(
    axiosConfig?: Record<string, unknown>,
    apiUrl?: string
  ): Promise<CoordinatorState>;

  // function getBatches();
  // function getBatch();
  // function getCoordinators();
  // function getSlot();
  // function getBids();

  // ToDo: The app does not uses the response but it would be nice to type it at some point
  function postCreateAccountAuthorization(
    hezEthereumAddress: string,
    bJJ: string,
    signature: string,
    nextForgerUrls?: string[],
    axiosConfig?: Record<string, unknown>
  ): Promise<unknown>;
  // function getCreateAccountAuthorization();
  // function getConfig();

  function getPoolTransactions(
    accountIndex: string,
    publicKeyCompressedHex: string
  ): Promise<HistoryTransaction[]>;

  // function getHealth();
}

// Constants
declare module "@hermeznetwork/hermezjs/src/constants" {
  // const TRANSACTION_POOL_KEY: string;
  const METAMASK_MESSAGE: string;
  // const CREATE_ACCOUNT_AUTH_MESSAGE: string;
  // const EIP_712_VERSION: string;
  // const EIP_712_PROVIDER: string;
  const ETHER_TOKEN_ID: number;
  // const GAS_LIMIT: number;
  // const GAS_LIMIT_HIGH: number;
  const GAS_LIMIT_LOW: number;
  // const GAS_STANDARD_ERC20_TX: number;
  // const GAS_LIMIT_WITHDRAW: number;
  // const SIBLING_GAS_COST: number;
  // const NON_INSTANT_WITHDRAW_ERC20_GAS_COST: number;
  // const NON_INSTANT_WITHDRAW_ETH_GAS_COST: number;
  // const GAS_MULTIPLIER: number;
  // const DEFAULT_PAGE_SIZE: number;
  // const API_VERSION: string;
  // const BASE_API_URL: string;
  // const BATCH_EXPLORER_URL: string;
  // const ETHERSCAN_URL: string;
  const ContractNames: {
    Hermez: string;
    WithdrawalDelayer: string;
  };
  // const CONTRACT_ADDRESSES: Record<string, string>;
  // const STORAGE_VERSION_KEY: string;
  // const STORAGE_VERSION: number;
  // const APPROVE_AMOUNT: string;
  const INTERNAL_ACCOUNT_ETH_ADDR: string;
  // const EMPTY_BJJ_ADDR: string;
  // const MAX_NLEVELS: number;
  // const WITHDRAWAL_CIRCUIT_NLEVELS: number;
  // const WITHDRAWAL_WASM_URL: string;
  // const WITHDRAWAL_ZKEY_URL: string;
  // const ETHER_ADDRESS: string;
  // const TX_ID_BYTES: number;
}

// HermezCompressedAmount
declare module "@hermeznetwork/hermezjs/src/hermez-compressed-amount" {
  import { ScalarValue } from "@hermeznetwork/hermezjs";

  export default class HermezCompressedAmount {
    constructor(value: number);
    static type: "HermezCompressedAmount";
    static value: number;
    // static isHermezCompressedAmount(instance: HermezCompressedAmount): boolean;
    static decompressAmount(hermezCompressedAmount: HermezCompressedAmount): ScalarValue;
    static compressAmount(value: string): HermezCompressedAmount;
    static floorCompressAmount(value: ScalarValue): HermezCompressedAmount;
  }
}

// Addresses
declare module "@hermeznetwork/hermezjs/src/addresses" {
  function getHermezAddress(ethereumAddress: string): string;

  function getEthereumAddress(accountIndex: string): string;

  // function isEthereumAddress();
  // function isHermezEthereumAddress();
  // function isHermezBjjAddress();
  // function isHermezAccountIndex();
  // function getAccountIndex();
  // function hexToBase64BJJ();
  // function base64ToHexBJJ();
  // function getAySignFromBJJ();
}

// Providers
declare module "@hermeznetwork/hermezjs/src/providers" {
  import { Web3Provider } from "@ethersproject/providers";

  const PROVIDER_TYPES: {
    WEB3: "web3";
  };
  function setProvider(
    providerData?: string | Record<string, unknown>,
    providerType?: string
  ): Web3Provider;

  function getProvider(
    providerData?: string | Record<string, unknown>,
    providerType?: string
  ): Web3Provider;
}

// Signers
declare module "@hermeznetwork/hermezjs/src/signers" {
  import { Web3Provider } from "@ethersproject/providers";
  import { Signer } from "@ethersproject/abstract-signer";
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

  function getSigner(provider: Web3Provider, signerData: SignerData): Promise<Signer>;
}

// Environment
declare module "@hermeznetwork/hermezjs/src/environment" {
  function setEnvironment(env: number | Record<string, unknown>): void;

  // function getCurrentEnvironment();
  // function getSupportedEnvironments();

  function isEnvironmentSupported(chainId: number): boolean;

  // function getBatchExplorerUrl();
  // function getEtherscanUrl();
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
  // function hasLinkedTransaction();
  // function addLinkedTransaction();
  // function buildAtomicTransaction();
  // function generateAtomicGroup();
  // function generateAtomicID();
}

// HTTP
declare module "@hermeznetwork/hermezjs/src/http" {
  const HttpStatusCode: {
    NOT_FOUND: 404;
  };

  // function extractJSON()
}

// HermezABI
declare module "@hermeznetwork/hermezjs/src/abis/HermezABI" {
  import { Fragment, JsonFragment } from "@ethersproject/abi";
  const HermezABI: string | ReadonlyArray<Fragment | JsonFragment | string>;
  export default HermezABI;
}
