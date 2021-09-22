import { HermezWallet } from "src/domain/hermez";

export type AccountData = {
  accountType: number;
  accountIndex: number;
}

export enum WalletName {
  METAMASK = "metaMask",
  WALLET_CONNECT = "walletConnect",
  LEDGER = "ledger",
  TREZOR = "trezor",
}

export enum LoginActionTypes {
  GO_TO_WALLET_SELECTOR_STEP = "[LOGIN] GO TO WALLET SELECTOR STEP",
  GO_TO_ACCOUNT_SELECTOR_STEP = "[LOGIN] GO TO ACCOUNT SELECTOR STEP",
  GO_TO_WALLET_LOADER_STEP = "[LOGIN] GO TO WALLET LOADER STEP",
  GO_TO_CREATE_ACCOUNT_AUTH_STEP = "[LOGIN] GO TO CREATE ACCOUNT AUTH STEP",
  GO_TO_PREVIOUS_STEP = "[LOGIN] GO TO PREVIOUS STEP",
  LOAD_WALLET = "[LOGIN] LOAD WALLET",
  LOAD_WALLET_FAILURE = "[LOGIN] LOAD WALLET FAILURE",
  ADD_ACCOUNT_AUTH = "[LOGIN] ADD ACCOUNT AUTH",
  ADD_ACCOUNT_AUTH_SUCCESS = "[LOGIN] ADD ACCOUNT AUTH SUCCESS",
  ADD_ACCOUNT_AUTH_FAILURE = "[LOGIN] ADD ACCOUNT AUTH FAILURE",
  SET_ACCOUNT_AUTH_SIGNATURE = "[LOGIN] SET ACCOUNT AUTH SIGNATURE",
  RESET_STATE = "[LOGIN] RESET STATE",
}

export interface GoToWalletSelectorStep {
  type: LoginActionTypes.GO_TO_WALLET_SELECTOR_STEP;
}

export interface GoToAccountSelectorStep {
  type: LoginActionTypes.GO_TO_ACCOUNT_SELECTOR_STEP;
  walletName: WalletName;
}

export interface GoToWalletLoaderStep {
  type: LoginActionTypes.GO_TO_WALLET_LOADER_STEP;
  walletName: WalletName;
  accountData: AccountData;
}

export interface GoToCreateAccountAuthStep {
  type: LoginActionTypes.GO_TO_CREATE_ACCOUNT_AUTH_STEP;
  wallet: HermezWallet.HermezWallet;
}

export interface GoToPreviousStep {
  type: LoginActionTypes.GO_TO_PREVIOUS_STEP;
}

export interface LoadWallet {
  type: LoginActionTypes.LOAD_WALLET;
}

export interface LoadWalletFailure {
  type: LoginActionTypes.LOAD_WALLET_FAILURE;
  error: string;
}

export interface AddAccountAuth {
  type: LoginActionTypes.ADD_ACCOUNT_AUTH;
}

export interface AddAccountAuthSuccess {
  type: LoginActionTypes.ADD_ACCOUNT_AUTH_SUCCESS;
}

export interface AddAccountAuthFailure {
  type: LoginActionTypes.ADD_ACCOUNT_AUTH_FAILURE;
  error: string;
}

export interface SetAccountAuthSignature {
  type: LoginActionTypes.SET_ACCOUNT_AUTH_SIGNATURE;
  chainId: number;
  hermezEthereumAddress: string;
  signature: string;
}

export interface ResetState {
  type: LoginActionTypes.RESET_STATE;
}

export type LoginAction =
  | GoToWalletSelectorStep
  | GoToAccountSelectorStep
  | GoToWalletLoaderStep
  | GoToCreateAccountAuthStep
  | GoToPreviousStep
  | LoadWallet
  | LoadWalletFailure
  | AddAccountAuth
  | AddAccountAuthSuccess
  | AddAccountAuthFailure
  | SetAccountAuthSignature
  | ResetState;

function goToWalletSelectorStep(): GoToWalletSelectorStep {
  return {
    type: LoginActionTypes.GO_TO_WALLET_SELECTOR_STEP,
  };
}

function goToAccountSelectorStep(walletName: WalletName): GoToAccountSelectorStep {
  return {
    type: LoginActionTypes.GO_TO_ACCOUNT_SELECTOR_STEP,
    walletName,
  };
}

function goToWalletLoaderStep(walletName: WalletName, accountData: AccountData): GoToWalletLoaderStep {
  return {
    type: LoginActionTypes.GO_TO_WALLET_LOADER_STEP,
    walletName,
    accountData,
  };
}

function goToCreateAccountAuthStep(wallet: HermezWallet.HermezWallet): GoToCreateAccountAuthStep {
  return {
    type: LoginActionTypes.GO_TO_CREATE_ACCOUNT_AUTH_STEP,
    wallet,
  };
}

function goToPreviousStep(): GoToPreviousStep {
  return {
    type: LoginActionTypes.GO_TO_PREVIOUS_STEP,
  };
}

function loadWallet(): LoadWallet {
  return {
    type: LoginActionTypes.LOAD_WALLET,
  };
}

function loadWalletFailure(error: string): LoadWalletFailure {
  return {
    type: LoginActionTypes.LOAD_WALLET_FAILURE,
    error,
  };
}

function addAccountAuth(): AddAccountAuth {
  return {
    type: LoginActionTypes.ADD_ACCOUNT_AUTH,
  };
}

function addAccountAuthSuccess(): AddAccountAuthSuccess {
  return {
    type: LoginActionTypes.ADD_ACCOUNT_AUTH_SUCCESS,
  };
}

function addAccountAuthFailure(error: string): AddAccountAuthFailure {
  return {
    type: LoginActionTypes.ADD_ACCOUNT_AUTH_FAILURE,
    error,
  };
}

function setAccountAuthSignature(
  chainId: number,
  hermezEthereumAddress: string,
  signature: string
): SetAccountAuthSignature {
  return {
    type: LoginActionTypes.SET_ACCOUNT_AUTH_SIGNATURE,
    chainId,
    hermezEthereumAddress,
    signature,
  };
}

function resetState(): ResetState {
  return {
    type: LoginActionTypes.RESET_STATE,
  };
}

export {
  goToWalletSelectorStep,
  goToAccountSelectorStep,
  goToWalletLoaderStep,
  goToCreateAccountAuthStep,
  goToPreviousStep,
  loadWallet,
  loadWalletFailure,
  addAccountAuth,
  addAccountAuthSuccess,
  addAccountAuthFailure,
  setAccountAuthSignature,
  resetState,
};
