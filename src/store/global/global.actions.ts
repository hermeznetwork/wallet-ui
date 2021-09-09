// domain
import { EthereumNetwork } from "src/domain/ethereum";
import {
  Wallet,
  Signer,
  FiatExchangeRates,
  HermezNetworkStatus,
  Withdraw,
  DelayedWithdraw,
  Deposit,
  CoordinatorState,
  Token,
} from "src/domain/hermez";
import { ISOStringDate, Header } from "src/domain/";

export enum GlobalActionTypes {
  LOAD_HERMEZ_STATUS = "[GLOBAL] LOAD HERMEZ STATUS",
  LOAD_HERMEZ_STATUS_SUCCESS = "[GLOBAL] LOAD HERMEZ STATUS SUCCESS",
  LOAD_HERMEZ_STATUS_FAILURE = "[GLOBAL] LOAD HERMEZ STATUS FAILURE",
  LOAD_ETHEREUM_NETWORK = "[GLOBAL] LOAD ETHEREUM NETWORK",
  LOAD_ETHEREUM_NETWORK_SUCCESS = "[GLOBAL] LOAD ETHEREUM NETWORK SUCCESS",
  LOAD_WALLET = "[GLOBAL] LOAD WALLET",
  UNLOAD_WALLET = "[GLOBAL] UNLOAD WALLET",
  SET_SIGNER = "[GLOBAL] SET SIGNER",
  CHANGE_HEADER = "[GLOBAL] CHANGE HEADER",
  CHANGE_REDIRECT_ROUTE = "[GLOBAL] CHANGE REDIRECT ROUTE",
  LOAD_FIAT_EXCHANGE_RATES = "[GLOBAL] LOAD FIAT EXCHANGE RATES",
  LOAD_FIAT_EXCHANGE_RATES_SUCCESS = "[GLOBAL] LOAD FIAT EXCHANGE RATES SUCCESS",
  OPEN_SNACKBAR = "[GLOBAL] OPEN SNACKBAR",
  CLOSE_SNACKBAR = "[GLOBAL] CLOSE SNACKBAR",
  CHANGE_NETWORK_STATUS = "[GLOBAL] CHANGE NETWORK STATUS",
  ADD_PENDING_WITHDRAW = "[GLOBAL] ADD PENDING WITHRAW",
  REMOVE_PENDING_WITHDRAW = "[GLOBAL] REMOVE PENDING WITHRAW",
  ADD_PENDING_DELAYED_WITHDRAW = "[GLOBAL] ADD PENDING DELAYED WITHRAW",
  REMOVE_PENDING_DELAYED_WITHDRAW = "[GLOBAL] REMOVE PENDING DELAYED WITHRAW",
  REMOVE_PENDING_DELAYED_WITHDRAW_BY_HASH = "[GLOBAL] REMOVE PENDING DELAYED WITHRAW BY HASH",
  UPDATE_PENDING_DELAYED_WITHDRAW_DATE = "[GLOBAL] UPDATE PENDING DELAYED WITHDRAW DATE",
  CHECK_PENDING_DELAYED_WITHDRAWALS = "[GLOBAL] CHECK PENDING DELAYED WITHDRAWALS",
  CHECK_PENDING_DELAYED_WITHDRAWALS_SUCCESS = "[GLOBAL] CHECK PENDING DELAYED WITHDRAWALS SUCCESS",
  CHECK_PENDING_WITHDRAWALS = "[GLOBAL] CHECK PENDING WITHDRAWALS",
  CHECK_PENDING_WITHDRAWALS_SUCCESS = "[GLOBAL] CHECK PENDING WITHDRAWALS SUCCESS",
  ADD_PENDING_DEPOSIT = "[GLOBAL] ADD PENDING DEPOSIT",
  REMOVE_PENDING_DEPOSIT_BY_HASH = "[GLOBAL] REMOVE PENDING DEPOSIT BY HASH",
  REMOVE_PENDING_DEPOSIT_BY_TRANSACTION_ID = "[GLOBAL] REMOVE PENDING DEPOSIT BY TRANSACTION ID",
  UPDATE_PENDING_DEPOSIT_ID = "[GLOBAL] UPDATE PENDING DEPOSIT ID",
  CHECK_PENDING_DEPOSITS = "[GLOBAL] CHECK PENDING DEPOSITS",
  CHECK_PENDING_DEPOSITS_SUCCESS = "[GLOBAL] CHECK PENDING DEPOSITS SUCCESS",
  LOAD_COORDINATOR_STATE = "[GLOBAL] LOAD COORDINATOR STATE",
  LOAD_COORDINATOR_STATE_SUCCESS = "[GLOBAL] LOAD COORDINATOR STATE SUCCESS",
  LOAD_COORDINATOR_STATE_FAILURE = "[GLOBAL] LOAD COORDINATOR STATE FAILURE",
  LOAD_TOKENS_PRICE = "[GLOBAL] LOAD TOKENS PRICE",
  LOAD_TOKENS_PRICE_SUCCESS = "[GLOBAL] LOAD TOKENS PRICE SUCCESS",
  LOAD_TOKENS_PRICE_FAILURE = "[GLOBAL] LOAD TOKENS PRICE FAILURE",
}

export interface LoadHermezStatus {
  type: GlobalActionTypes.LOAD_HERMEZ_STATUS;
}

export interface LoadHermezStatusSuccess {
  type: GlobalActionTypes.LOAD_HERMEZ_STATUS_SUCCESS;
  status: number;
}

export interface LoadHermezStatusFailure {
  type: GlobalActionTypes.LOAD_HERMEZ_STATUS_FAILURE;
  error: string;
}

export interface LoadEthereumNetwork {
  type: GlobalActionTypes.LOAD_ETHEREUM_NETWORK;
}

export interface LoadEthereumNetworkSuccess {
  type: GlobalActionTypes.LOAD_ETHEREUM_NETWORK_SUCCESS;
  ethereumNetwork: EthereumNetwork;
}

export interface LoadWallet {
  type: GlobalActionTypes.LOAD_WALLET;
  wallet: Wallet;
}

export interface UnloadWallet {
  type: GlobalActionTypes.UNLOAD_WALLET;
}

export interface SetSigner {
  type: GlobalActionTypes.SET_SIGNER;
  signer: Signer;
}

export interface ChangeHeader {
  type: GlobalActionTypes.CHANGE_HEADER;
  header: Header;
}

export interface ChangeRedirectRoute {
  type: GlobalActionTypes.CHANGE_REDIRECT_ROUTE;
  redirectRoute: string;
}

export interface LoadFiatExchangeRates {
  type: GlobalActionTypes.LOAD_FIAT_EXCHANGE_RATES;
}

export interface LoadFiatExchangeRatesSuccess {
  type: GlobalActionTypes.LOAD_FIAT_EXCHANGE_RATES_SUCCESS;
  fiatExchangeRates: FiatExchangeRates;
}

export interface OpenSnackbar {
  type: GlobalActionTypes.OPEN_SNACKBAR;
  message: string;
  backgroundColor?: string;
}

export interface CloseSnackbar {
  type: GlobalActionTypes.CLOSE_SNACKBAR;
}

export interface ChangeNetworkStatus {
  type: GlobalActionTypes.CHANGE_NETWORK_STATUS;
  networkStatus: HermezNetworkStatus;
}

export interface AddPendingWithdraw {
  type: GlobalActionTypes.ADD_PENDING_WITHDRAW;
  chainId: number;
  hermezEthereumAddress: string;
  pendingWithdraw: Withdraw;
}

export interface RemovePendingWithdraw {
  type: GlobalActionTypes.REMOVE_PENDING_WITHDRAW;
  chainId: number;
  hermezEthereumAddress: string;
  hash: string;
}

export interface AddPendingDelayedWithdraw {
  type: GlobalActionTypes.ADD_PENDING_DELAYED_WITHDRAW;
  chainId: number;
  hermezEthereumAddress: string;
  pendingDelayedWithdraw: DelayedWithdraw;
}

export interface RemovePendingDelayedWithdraw {
  type: GlobalActionTypes.REMOVE_PENDING_DELAYED_WITHDRAW;
  chainId: number;
  hermezEthereumAddress: string;
  pendingDelayedWithdrawId: string;
}

export interface RemovePendingDelayedWithdrawByHash {
  type: GlobalActionTypes.REMOVE_PENDING_DELAYED_WITHDRAW_BY_HASH;
  chainId: number;
  hermezEthereumAddress: string;
  pendingDelayedWithdrawHash: string;
}

export interface UpdatePendingDelayedWithdrawDate {
  type: GlobalActionTypes.UPDATE_PENDING_DELAYED_WITHDRAW_DATE;
  chainId: number;
  hermezEthereumAddress: string;
  transactionHash: string;
  transactionDate: ISOStringDate;
}

export interface CheckPendingDelayedWithdrawals {
  type: GlobalActionTypes.CHECK_PENDING_DELAYED_WITHDRAWALS;
}

export interface CheckPendingDelayedWithdrawalsSuccess {
  type: GlobalActionTypes.CHECK_PENDING_DELAYED_WITHDRAWALS_SUCCESS;
}

export interface CheckPendingWithdrawals {
  type: GlobalActionTypes.CHECK_PENDING_WITHDRAWALS;
}

export interface CheckPendingWithdrawalsSuccess {
  type: GlobalActionTypes.CHECK_PENDING_WITHDRAWALS_SUCCESS;
}

export interface AddPendingDeposit {
  type: GlobalActionTypes.ADD_PENDING_DEPOSIT;
  chainId: number;
  hermezEthereumAddress: string;
  pendingDeposit: Deposit;
}

export interface RemovePendingDepositByHash {
  type: GlobalActionTypes.REMOVE_PENDING_DEPOSIT_BY_HASH;
  chainId: number;
  hermezEthereumAddress: string;
  hash: string;
}

export interface RemovePendingDepositByTransactionId {
  type: GlobalActionTypes.REMOVE_PENDING_DEPOSIT_BY_TRANSACTION_ID;
  chainId: number;
  hermezEthereumAddress: string;
  transactionId: string;
}

export interface UpdatePendingDepositId {
  type: GlobalActionTypes.UPDATE_PENDING_DEPOSIT_ID;
  chainId: number;
  hermezEthereumAddress: string;
  transactionHash: string;
  transactionId: string;
}

export interface CheckPendingDeposits {
  type: GlobalActionTypes.CHECK_PENDING_DEPOSITS;
}

export interface CheckPendingDepositsSuccess {
  type: GlobalActionTypes.CHECK_PENDING_DEPOSITS_SUCCESS;
}

export interface LoadCoordinatorState {
  type: GlobalActionTypes.LOAD_COORDINATOR_STATE;
}

export interface LoadCoordinatorStateSuccess {
  type: GlobalActionTypes.LOAD_COORDINATOR_STATE_SUCCESS;
  coordinatorState: CoordinatorState;
}

export interface LoadCoordinatorStateFailure {
  type: GlobalActionTypes.LOAD_COORDINATOR_STATE_FAILURE;
  error: string;
}
export interface LoadTokensPrice {
  type: typeof GlobalActionTypes.LOAD_TOKENS_PRICE;
}

export interface LoadTokensPriceSuccess {
  type: typeof GlobalActionTypes.LOAD_TOKENS_PRICE_SUCCESS;
  tokensPrice: unknown;
}

export interface LoadTokensPriceFailure {
  type: typeof GlobalActionTypes.LOAD_TOKENS_PRICE_FAILURE;
  error: string;
}

export type GlobalAction =
  | LoadHermezStatus
  | LoadHermezStatusSuccess
  | LoadHermezStatusFailure
  | LoadEthereumNetwork
  | LoadEthereumNetworkSuccess
  | LoadWallet
  | UnloadWallet
  | SetSigner
  | ChangeHeader
  | ChangeRedirectRoute
  | LoadFiatExchangeRates
  | LoadFiatExchangeRatesSuccess
  | OpenSnackbar
  | CloseSnackbar
  | ChangeNetworkStatus
  | AddPendingWithdraw
  | RemovePendingWithdraw
  | AddPendingDelayedWithdraw
  | RemovePendingDelayedWithdraw
  | RemovePendingDelayedWithdrawByHash
  | UpdatePendingDelayedWithdrawDate
  | CheckPendingDelayedWithdrawals
  | CheckPendingDelayedWithdrawalsSuccess
  | CheckPendingWithdrawals
  | CheckPendingWithdrawalsSuccess
  | AddPendingDeposit
  | RemovePendingDepositByHash
  | RemovePendingDepositByTransactionId
  | UpdatePendingDepositId
  | CheckPendingDeposits
  | CheckPendingDepositsSuccess
  | LoadCoordinatorState
  | LoadCoordinatorStateSuccess
  | LoadCoordinatorStateFailure
  | LoadTokensPrice
  | LoadTokensPriceSuccess
  | LoadTokensPriceFailure;

function loadHermezStatus(): LoadHermezStatus {
  return {
    type: GlobalActionTypes.LOAD_HERMEZ_STATUS,
  };
}

function loadHermezStatusSuccess(status: number): LoadHermezStatusSuccess {
  return {
    type: GlobalActionTypes.LOAD_HERMEZ_STATUS_SUCCESS,
    status,
  };
}

function loadHermezStatusFailure(error: string): LoadHermezStatusFailure {
  return {
    type: GlobalActionTypes.LOAD_HERMEZ_STATUS_FAILURE,
    error,
  };
}

function loadEthereumNetwork(): LoadEthereumNetwork {
  return {
    type: GlobalActionTypes.LOAD_ETHEREUM_NETWORK,
  };
}

function loadEthereumNetworkSuccess(ethereumNetwork: EthereumNetwork): LoadEthereumNetworkSuccess {
  return {
    type: GlobalActionTypes.LOAD_ETHEREUM_NETWORK_SUCCESS,
    ethereumNetwork,
  };
}

function loadWallet(wallet: Wallet): LoadWallet {
  return {
    type: GlobalActionTypes.LOAD_WALLET,
    wallet,
  };
}

function unloadWallet(): UnloadWallet {
  return {
    type: GlobalActionTypes.UNLOAD_WALLET,
  };
}

function setSigner(signer: Signer): SetSigner {
  return {
    type: GlobalActionTypes.SET_SIGNER,
    signer,
  };
}

function changeHeader(header: Header): ChangeHeader {
  return {
    type: GlobalActionTypes.CHANGE_HEADER,
    header,
  };
}

function changeRedirectRoute(redirectRoute: string): ChangeRedirectRoute {
  return {
    type: GlobalActionTypes.CHANGE_REDIRECT_ROUTE,
    redirectRoute,
  };
}

function loadFiatExchangeRates(): LoadFiatExchangeRates {
  return {
    type: GlobalActionTypes.LOAD_FIAT_EXCHANGE_RATES,
  };
}

function loadFiatExchangeRatesSuccess(
  fiatExchangeRates: FiatExchangeRates
): LoadFiatExchangeRatesSuccess {
  return {
    type: GlobalActionTypes.LOAD_FIAT_EXCHANGE_RATES_SUCCESS,
    fiatExchangeRates,
  };
}

function openSnackbar(message: string, backgroundColor?: string): OpenSnackbar {
  return {
    type: GlobalActionTypes.OPEN_SNACKBAR,
    message,
    backgroundColor,
  };
}

function closeSnackbar(): CloseSnackbar {
  return {
    type: GlobalActionTypes.CLOSE_SNACKBAR,
  };
}

function changeNetworkStatus(networkStatus: HermezNetworkStatus): ChangeNetworkStatus {
  return {
    type: GlobalActionTypes.CHANGE_NETWORK_STATUS,
    networkStatus,
  };
}

function addPendingWithdraw(
  chainId: number,
  hermezEthereumAddress: string,
  pendingWithdraw: Withdraw
): AddPendingWithdraw {
  return {
    type: GlobalActionTypes.ADD_PENDING_WITHDRAW,
    chainId,
    hermezEthereumAddress,
    pendingWithdraw,
  };
}

function removePendingWithdraw(
  chainId: number,
  hermezEthereumAddress: string,
  hash: string
): RemovePendingWithdraw {
  return {
    type: GlobalActionTypes.REMOVE_PENDING_WITHDRAW,
    chainId,
    hermezEthereumAddress,
    hash,
  };
}

function addPendingDelayedWithdraw(
  chainId: number,
  hermezEthereumAddress: string,
  pendingDelayedWithdraw: DelayedWithdraw
): AddPendingDelayedWithdraw {
  return {
    type: GlobalActionTypes.ADD_PENDING_DELAYED_WITHDRAW,
    chainId,
    hermezEthereumAddress,
    pendingDelayedWithdraw,
  };
}

function removePendingDelayedWithdraw(
  chainId: number,
  hermezEthereumAddress: string,
  pendingDelayedWithdrawId: string
): RemovePendingDelayedWithdraw {
  return {
    type: GlobalActionTypes.REMOVE_PENDING_DELAYED_WITHDRAW,
    chainId,
    hermezEthereumAddress,
    pendingDelayedWithdrawId,
  };
}

function removePendingDelayedWithdrawByHash(
  chainId: number,
  hermezEthereumAddress: string,
  pendingDelayedWithdrawHash: string
): RemovePendingDelayedWithdrawByHash {
  return {
    type: GlobalActionTypes.REMOVE_PENDING_DELAYED_WITHDRAW_BY_HASH,
    chainId,
    hermezEthereumAddress,
    pendingDelayedWithdrawHash,
  };
}

function updatePendingDelayedWithdrawDate(
  chainId: number,
  hermezEthereumAddress: string,
  transactionHash: string,
  transactionDate: ISOStringDate
): UpdatePendingDelayedWithdrawDate {
  return {
    type: GlobalActionTypes.UPDATE_PENDING_DELAYED_WITHDRAW_DATE,
    chainId,
    hermezEthereumAddress,
    transactionHash,
    transactionDate,
  };
}

function checkPendingDelayedWithdrawals(): CheckPendingDelayedWithdrawals {
  return {
    type: GlobalActionTypes.CHECK_PENDING_DELAYED_WITHDRAWALS,
  };
}

function checkPendingDelayedWithdrawalsSuccess(): CheckPendingDelayedWithdrawalsSuccess {
  return {
    type: GlobalActionTypes.CHECK_PENDING_DELAYED_WITHDRAWALS_SUCCESS,
  };
}

function checkPendingWithdrawals(): CheckPendingWithdrawals {
  return {
    type: GlobalActionTypes.CHECK_PENDING_WITHDRAWALS,
  };
}

function checkPendingWithdrawalsSuccess(): CheckPendingWithdrawalsSuccess {
  return {
    type: GlobalActionTypes.CHECK_PENDING_WITHDRAWALS_SUCCESS,
  };
}

function addPendingDeposit(
  chainId: number,
  hermezEthereumAddress: string,
  pendingDeposit: Deposit
): AddPendingDeposit {
  return {
    type: GlobalActionTypes.ADD_PENDING_DEPOSIT,
    chainId,
    hermezEthereumAddress,
    pendingDeposit,
  };
}

function removePendingDepositByHash(
  chainId: number,
  hermezEthereumAddress: string,
  hash: string
): RemovePendingDepositByHash {
  return {
    type: GlobalActionTypes.REMOVE_PENDING_DEPOSIT_BY_HASH,
    chainId,
    hermezEthereumAddress,
    hash,
  };
}

function removePendingDepositByTransactionId(
  chainId: number,
  hermezEthereumAddress: string,
  transactionId: string
): RemovePendingDepositByTransactionId {
  return {
    type: GlobalActionTypes.REMOVE_PENDING_DEPOSIT_BY_TRANSACTION_ID,
    chainId,
    hermezEthereumAddress,
    transactionId,
  };
}

function updatePendingDepositId(
  chainId: number,
  hermezEthereumAddress: string,
  transactionHash: string,
  transactionId: string
): UpdatePendingDepositId {
  return {
    type: GlobalActionTypes.UPDATE_PENDING_DEPOSIT_ID,
    chainId,
    hermezEthereumAddress,
    transactionHash,
    transactionId,
  };
}

function checkPendingDeposits(): CheckPendingDeposits {
  return {
    type: GlobalActionTypes.CHECK_PENDING_DEPOSITS,
  };
}

function checkPendingDepositsSuccess(): CheckPendingDepositsSuccess {
  return {
    type: GlobalActionTypes.CHECK_PENDING_DEPOSITS_SUCCESS,
  };
}

function loadCoordinatorState(): LoadCoordinatorState {
  return {
    type: GlobalActionTypes.LOAD_COORDINATOR_STATE,
  };
}

function loadCoordinatorStateSuccess(
  coordinatorState: CoordinatorState
): LoadCoordinatorStateSuccess {
  return {
    type: GlobalActionTypes.LOAD_COORDINATOR_STATE_SUCCESS,
    coordinatorState,
  };
}

function loadCoordinatorStateFailure(error: Error): LoadCoordinatorStateFailure {
  return {
    type: GlobalActionTypes.LOAD_COORDINATOR_STATE_FAILURE,
    error: error.message,
  };
}

function loadTokensPrice() {
  return {
    type: GlobalActionTypes.LOAD_TOKENS_PRICE,
  };
}

function loadTokensPriceSuccess(tokensPrice: Token[]) {
  return {
    type: GlobalActionTypes.LOAD_TOKENS_PRICE_SUCCESS,
    tokensPrice,
  };
}

function loadTokensPriceFailure(error: string) {
  return {
    type: GlobalActionTypes.LOAD_TOKENS_PRICE_FAILURE,
    error,
  };
}

export {
  loadHermezStatus,
  loadHermezStatusSuccess,
  loadHermezStatusFailure,
  loadEthereumNetwork,
  loadEthereumNetworkSuccess,
  loadWallet,
  unloadWallet,
  setSigner,
  changeHeader,
  changeRedirectRoute,
  loadFiatExchangeRates,
  loadFiatExchangeRatesSuccess,
  openSnackbar,
  closeSnackbar,
  changeNetworkStatus,
  addPendingWithdraw,
  removePendingWithdraw,
  addPendingDelayedWithdraw,
  removePendingDelayedWithdraw,
  removePendingDelayedWithdrawByHash,
  updatePendingDelayedWithdrawDate,
  checkPendingDelayedWithdrawals,
  checkPendingDelayedWithdrawalsSuccess,
  checkPendingWithdrawals,
  checkPendingWithdrawalsSuccess,
  addPendingDeposit,
  removePendingDepositByHash,
  removePendingDepositByTransactionId,
  updatePendingDepositId,
  checkPendingDeposits,
  checkPendingDepositsSuccess,
  loadCoordinatorState,
  loadCoordinatorStateSuccess,
  loadCoordinatorStateFailure,
  loadTokensPrice,
  loadTokensPriceSuccess,
  loadTokensPriceFailure,
};
