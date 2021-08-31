// domain
import { EthereumNetwork } from "../../domain/ethereum";
import {
  HermezWallet,
  Signer,
  FiatExchangeRates,
  HermezNetworkStatus,
  Withdraw,
  DelayedWithdraw,
  Deposit,
  CoordinatorState,
  Reward,
  Tokens
} from "../../domain/hermez";
import { ISOStringDate, Header } from "../../domain/";

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
  OPEN_REWARDS_SIDENAV = "[GLOBAL] OPEN REWARDS SIDENAV",
  CLOSE_REWARDS_SIDENAV = "[GLOBAL] CLOSE REWARDS SIDENAV",
  LOAD_REWARD = "[GLOBAL] LOAD REWARD",
  LOAD_REWARD_SUCCESS = "[GLOBAL] LOAD REWARD SUCCESS",
  LOAD_REWARD_FAILURE = "[GLOBAL] LOAD REWARD FAILURE",
  LOAD_EARNED_REWARD = "[GLOBAL] LOAD EARNED REWARD",
  LOAD_EARNED_REWARD_SUCCESS = "[GLOBAL] LOAD EARNED REWARD SUCCESS",
  LOAD_EARNED_REWARD_FAILURE = "[GLOBAL] LOAD EARNED REWARD FAILURE",
  LOAD_REWARD_PERCENTAGE = "[GLOBAL] LOAD REWARD PERCENTAGE",
  LOAD_REWARD_PERCENTAGE_SUCCESS = "[GLOBAL] LOAD REWARD PERCENTAGE SUCCESS",
  LOAD_REWARD_PERCENTAGE_FAILURE = "[GLOBAL] LOAD REWARD PERCENTAGE FAILURE",
  LOAD_REWARD_ACCOUNT_ELIGIBILITY = "[GLOBAL] LOAD REWARD ACCOUNT ELIGIBILITY",
  LOAD_REWARD_ACCOUNT_ELIGIBILITY_SUCCESS = "[GLOBAL] LOAD REWARD ACCOUNT ELIGIBILITY SUCCESS",
  LOAD_REWARD_ACCOUNT_ELIGIBILITY_FAILURE = "[GLOBAL] LOAD REWARD ACCOUNT ELIGIBILITY FAILURE",
  LOAD_REWARD_TOKEN = "[GLOBAL] LOAD REWARD TOKEN",
  LOAD_REWARD_TOKEN_SUCCESS = "[GLOBAL] LOAD REWARD TOKEN SUCCESS",
  LOAD_REWARD_TOKEN_FAILURE = "[GLOBAL] LOAD REWARD TOKEN FAILURE",
  LOAD_TOKENS_PRICE = "[GLOBAL] LOAD TOKENS PRICE",
  LOAD_TOKENS_PRICE_SUCCESS = "[GLOBAL] LOAD TOKENS PRICE SUCCESS",
  LOAD_TOKENS_PRICE_FAILURE = "[GLOBAL] LOAD TOKENS PRICE FAILURE",
}

export interface LoadHermezStatus {
  type: typeof GlobalActionTypes.LOAD_HERMEZ_STATUS;
}

export interface LoadHermezStatusSuccess {
  type: typeof GlobalActionTypes.LOAD_HERMEZ_STATUS_SUCCESS;
  status: number;
}

export interface LoadHermezStatusFailure {
  type: typeof GlobalActionTypes.LOAD_HERMEZ_STATUS_FAILURE;
  error: string;
}

export interface LoadEthereumNetwork {
  type: typeof GlobalActionTypes.LOAD_ETHEREUM_NETWORK;
}

export interface LoadEthereumNetworkSuccess {
  type: typeof GlobalActionTypes.LOAD_ETHEREUM_NETWORK_SUCCESS;
  ethereumNetwork: EthereumNetwork;
}

export interface LoadWallet {
  type: typeof GlobalActionTypes.LOAD_WALLET;
  wallet: HermezWallet;
}

export interface UnloadWallet {
  type: typeof GlobalActionTypes.UNLOAD_WALLET;
}

export interface SetSigner {
  type: typeof GlobalActionTypes.SET_SIGNER;
  signer: Signer;
}

export interface ChangeHeader {
  type: typeof GlobalActionTypes.CHANGE_HEADER;
  header: Header;
}

export interface ChangeRedirectRoute {
  type: typeof GlobalActionTypes.CHANGE_REDIRECT_ROUTE;
  redirectRoute: string;
}

export interface LoadFiatExchangeRates {
  type: typeof GlobalActionTypes.LOAD_FIAT_EXCHANGE_RATES;
}

export interface LoadFiatExchangeRatesSuccess {
  type: typeof GlobalActionTypes.LOAD_FIAT_EXCHANGE_RATES_SUCCESS;
  fiatExchangeRates: FiatExchangeRates;
}

export interface OpenSnackbar {
  type: typeof GlobalActionTypes.OPEN_SNACKBAR;
  message: string;
  backgroundColor?: string;
}

export interface CloseSnackbar {
  type: typeof GlobalActionTypes.CLOSE_SNACKBAR;
}

export interface ChangeNetworkStatus {
  type: typeof GlobalActionTypes.CHANGE_NETWORK_STATUS;
  networkStatus: HermezNetworkStatus;
}

export interface AddPendingWithdraw {
  type: typeof GlobalActionTypes.ADD_PENDING_WITHDRAW;
  chainId: number;
  hermezEthereumAddress: string;
  pendingWithdraw: Withdraw;
}

export interface RemovePendingWithdraw {
  type: typeof GlobalActionTypes.REMOVE_PENDING_WITHDRAW;
  chainId: number;
  hermezEthereumAddress: string;
  hash: string;
}

export interface AddPendingDelayedWithdraw {
  type: typeof GlobalActionTypes.ADD_PENDING_DELAYED_WITHDRAW;
  chainId: number;
  hermezEthereumAddress: string;
  pendingDelayedWithdraw: DelayedWithdraw;
}

export interface RemovePendingDelayedWithdraw {
  type: typeof GlobalActionTypes.REMOVE_PENDING_DELAYED_WITHDRAW;
  chainId: number;
  hermezEthereumAddress: string;
  pendingDelayedWithdrawId: string;
}

export interface RemovePendingDelayedWithdrawByHash {
  type: typeof GlobalActionTypes.REMOVE_PENDING_DELAYED_WITHDRAW_BY_HASH;
  chainId: number;
  hermezEthereumAddress: string;
  pendingDelayedWithdrawHash: string;
}

export interface UpdatePendingDelayedWithdrawDate {
  type: typeof GlobalActionTypes.UPDATE_PENDING_DELAYED_WITHDRAW_DATE;
  chainId: number;
  hermezEthereumAddress: string;
  transactionHash: string;
  transactionDate: ISOStringDate;
}

export interface CheckPendingDelayedWithdrawals {
  type: typeof GlobalActionTypes.CHECK_PENDING_DELAYED_WITHDRAWALS;
}

export interface CheckPendingDelayedWithdrawalsSuccess {
  type: typeof GlobalActionTypes.CHECK_PENDING_DELAYED_WITHDRAWALS_SUCCESS;
}

export interface CheckPendingWithdrawals {
  type: typeof GlobalActionTypes.CHECK_PENDING_WITHDRAWALS;
}

export interface CheckPendingWithdrawalsSuccess {
  type: typeof GlobalActionTypes.CHECK_PENDING_WITHDRAWALS_SUCCESS;
}

export interface AddPendingDeposit {
  type: typeof GlobalActionTypes.ADD_PENDING_DEPOSIT;
  chainId: number;
  hermezEthereumAddress: string;
  pendingDeposit: Deposit;
}

export interface RemovePendingDepositByHash {
  type: typeof GlobalActionTypes.REMOVE_PENDING_DEPOSIT_BY_HASH;
  chainId: number;
  hermezEthereumAddress: string;
  hash: string;
}

export interface RemovePendingDepositByTransactionId {
  type: typeof GlobalActionTypes.REMOVE_PENDING_DEPOSIT_BY_TRANSACTION_ID;
  chainId: number;
  hermezEthereumAddress: string;
  transactionId: string;
}

export interface UpdatePendingDepositId {
  type: typeof GlobalActionTypes.UPDATE_PENDING_DEPOSIT_ID;
  chainId: number;
  hermezEthereumAddress: string;
  transactionHash: string;
  transactionId: string;
}

export interface CheckPendingDeposits {
  type: typeof GlobalActionTypes.CHECK_PENDING_DEPOSITS;
}

export interface CheckPendingDepositsSuccess {
  type: typeof GlobalActionTypes.CHECK_PENDING_DEPOSITS_SUCCESS;
}

export interface LoadCoordinatorState {
  type: typeof GlobalActionTypes.LOAD_COORDINATOR_STATE;
}

export interface LoadCoordinatorStateSuccess {
  type: typeof GlobalActionTypes.LOAD_COORDINATOR_STATE_SUCCESS;
  coordinatorState: CoordinatorState;
}

export interface LoadCoordinatorStateFailure {
  type: typeof GlobalActionTypes.LOAD_COORDINATOR_STATE_FAILURE;
  error: string;
}

export interface OpenRewardsSidenav {
  type: typeof GlobalActionTypes.OPEN_REWARDS_SIDENAV;
}

export interface CloseRewardsSidenav {
  type: typeof GlobalActionTypes.CLOSE_REWARDS_SIDENAV;
}

export interface LoadReward {
  type: typeof GlobalActionTypes.LOAD_REWARD;
}

export interface LoadRewardSuccess {
  type: typeof GlobalActionTypes.LOAD_REWARD_SUCCESS;
  reward: Reward;
}

export interface LoadRewardFailure {
  type: typeof GlobalActionTypes.LOAD_REWARD_FAILURE;
  error: string;
}

export interface LoadEarnedReward {
  type: typeof GlobalActionTypes.LOAD_EARNED_REWARD;
}

export interface LoadEarnedRewardSuccess {
  type: typeof GlobalActionTypes.LOAD_EARNED_REWARD_SUCCESS;
  earnedReward: Reward;
}

export interface LoadEarnedRewardFailure {
  type: typeof GlobalActionTypes.LOAD_EARNED_REWARD_FAILURE;
  error: string;
}

export interface LoadRewardPercentage {
  type: typeof GlobalActionTypes.LOAD_REWARD_PERCENTAGE;
}

export interface LoadRewardPercentageSuccess {
  type: typeof GlobalActionTypes.LOAD_REWARD_PERCENTAGE_SUCCESS;
  rewardPercentage: unknown;
}

export interface LoadRewardPercentageFailure {
  type: typeof GlobalActionTypes.LOAD_REWARD_PERCENTAGE_FAILURE;
  error: string;
}

export interface LoadRewardAccountEligibility {
  type: typeof GlobalActionTypes.LOAD_REWARD_ACCOUNT_ELIGIBILITY;
}

export interface LoadRewardAccountEligibilitySuccess {
  type: typeof GlobalActionTypes.LOAD_REWARD_ACCOUNT_ELIGIBILITY_SUCCESS;
  rewardAccountEligibility: unknown;
}

export interface LoadRewardAccountEligibilityFailure {
  type: typeof GlobalActionTypes.LOAD_REWARD_ACCOUNT_ELIGIBILITY_FAILURE;
  error: string;
}

export interface LoadRewardToken {
  type: typeof GlobalActionTypes.LOAD_REWARD_TOKEN;
}

export interface LoadRewardTokenSuccess {
  type: typeof GlobalActionTypes.LOAD_REWARD_TOKEN_SUCCESS;
  rewardToken: unknown;
}

export interface LoadRewardTokenFailure {
  type: typeof GlobalActionTypes.LOAD_REWARD_TOKEN_FAILURE;
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
  | OpenRewardsSidenav
  | CloseRewardsSidenav
  | LoadReward
  | LoadRewardSuccess
  | LoadRewardFailure
  | LoadEarnedReward
  | LoadEarnedRewardSuccess
  | LoadEarnedRewardFailure
  | LoadRewardPercentage
  | LoadRewardPercentageSuccess
  | LoadRewardPercentageFailure
  | LoadRewardAccountEligibility
  | LoadRewardAccountEligibilitySuccess
  | LoadRewardAccountEligibilityFailure
  | LoadRewardToken
  | LoadRewardTokenSuccess
  | LoadRewardTokenFailure
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

function loadEthereumNetworkSuccess(
  ethereumNetwork: EthereumNetwork
): LoadEthereumNetworkSuccess {
  return {
    type: GlobalActionTypes.LOAD_ETHEREUM_NETWORK_SUCCESS,
    ethereumNetwork,
  };
}

function loadWallet(wallet: HermezWallet): LoadWallet {
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

function changeNetworkStatus(
  networkStatus: HermezNetworkStatus
): ChangeNetworkStatus {
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

function loadCoordinatorStateFailure(
  error: Error
): LoadCoordinatorStateFailure {
  return {
    type: GlobalActionTypes.LOAD_COORDINATOR_STATE_FAILURE,
    error: error.message,
  };
}

function openRewardsSidenav(): OpenRewardsSidenav {
  return {
    type: GlobalActionTypes.OPEN_REWARDS_SIDENAV,
  };
}

function closeRewardsSidenav(): CloseRewardsSidenav {
  return {
    type: GlobalActionTypes.CLOSE_REWARDS_SIDENAV,
  };
}

function loadReward(): LoadReward {
  return {
    type: GlobalActionTypes.LOAD_REWARD,
  };
}

function loadRewardSuccess(reward: Reward): LoadRewardSuccess {
  return {
    type: GlobalActionTypes.LOAD_REWARD_SUCCESS,
    reward,
  };
}

function loadRewardFailure(error: string): LoadRewardFailure {
  return {
    type: GlobalActionTypes.LOAD_REWARD_FAILURE,
    error,
  };
}

function loadEarnedReward(): LoadEarnedReward {
  return {
    type: GlobalActionTypes.LOAD_EARNED_REWARD,
  };
}

function loadEarnedRewardSuccess(
  earnedReward: Reward
): LoadEarnedRewardSuccess {
  return {
    type: GlobalActionTypes.LOAD_EARNED_REWARD_SUCCESS,
    earnedReward,
  };
}

function loadEarnedRewardFailure(error: string): LoadEarnedRewardFailure {
  return {
    type: GlobalActionTypes.LOAD_EARNED_REWARD_FAILURE,
    error,
  };
}

function loadRewardPercentage(): LoadRewardPercentage {
  return {
    type: GlobalActionTypes.LOAD_REWARD_PERCENTAGE,
  };
}

// ToDo: What is the shape of a rewardPercentage?
function loadRewardPercentageSuccess(
  rewardPercentage: unknown
): LoadRewardPercentageSuccess {
  return {
    type: GlobalActionTypes.LOAD_REWARD_PERCENTAGE_SUCCESS,
    rewardPercentage,
  };
}

function loadRewardPercentageFailure(
  error: string
): LoadRewardPercentageFailure {
  return {
    type: GlobalActionTypes.LOAD_REWARD_PERCENTAGE_FAILURE,
    error,
  };
}

function loadRewardAccountEligibility(): LoadRewardAccountEligibility {
  return {
    type: GlobalActionTypes.LOAD_REWARD_ACCOUNT_ELIGIBILITY,
  };
}

// ToDo: What is the shape of a rewardAccountEligibility?
function loadRewardAccountEligibilitySuccess(
  rewardAccountEligibility: unknown
): LoadRewardAccountEligibilitySuccess {
  return {
    type: GlobalActionTypes.LOAD_REWARD_ACCOUNT_ELIGIBILITY_SUCCESS,
    rewardAccountEligibility,
  };
}

// ToDo: This action is never called. Dead code?
function loadRewardAccountEligibilityFailure(
  error: string
): LoadRewardAccountEligibilityFailure {
  return {
    type: GlobalActionTypes.LOAD_REWARD_ACCOUNT_ELIGIBILITY_FAILURE,
    error,
  };
}

function loadRewardToken(): LoadRewardToken {
  return {
    type: GlobalActionTypes.LOAD_REWARD_TOKEN,
  };
}

// ToDo: What is the shape of a rewardToken?
function loadRewardTokenSuccess(rewardToken: unknown): LoadRewardTokenSuccess {
  return {
    type: GlobalActionTypes.LOAD_REWARD_TOKEN_SUCCESS,
    rewardToken,
  };
}

function loadRewardTokenFailure(error: string): LoadRewardTokenFailure {
  return {
    type: GlobalActionTypes.LOAD_REWARD_TOKEN_FAILURE,
    error,
  };
}

function loadTokensPrice() {
  return {
    type: GlobalActionTypes.LOAD_TOKENS_PRICE,
  };
}

function loadTokensPriceSuccess(tokensPrice: Tokens) {
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
  openRewardsSidenav,
  closeRewardsSidenav,
  loadReward,
  loadRewardSuccess,
  loadRewardFailure,
  loadEarnedReward,
  loadEarnedRewardSuccess,
  loadEarnedRewardFailure,
  loadRewardPercentage,
  loadRewardPercentageSuccess,
  loadRewardPercentageFailure,
  loadRewardAccountEligibility,
  loadRewardAccountEligibilitySuccess,
  loadRewardAccountEligibilityFailure,
  loadRewardToken,
  loadRewardTokenSuccess,
  loadRewardTokenFailure,
  loadTokensPrice,
  loadTokensPriceSuccess,
  loadTokensPriceFailure,
};
