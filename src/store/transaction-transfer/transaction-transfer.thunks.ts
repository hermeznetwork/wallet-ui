import { CoordinatorAPI, Tx, HermezCompressedAmount } from "@hermeznetwork/hermezjs";
import { getProvider } from "@hermeznetwork/hermezjs/src/providers";
import { getEthereumAddress } from "@hermeznetwork/hermezjs/src/addresses";
import { getPoolTransactions } from "@hermeznetwork/hermezjs/src/tx-pool";
import { ethers, BigNumber } from "ethers";
import { push } from "connected-react-router";

import { RootState } from "src/store";
import { AppDispatch, AppThunk } from "src";
import * as transactionActions from "./transaction-transfer.actions";
import { openSnackbar } from "../global/global.actions";
import { createAccount } from "../../utils/accounts";
import { getNextBestForger, getNextForgerUrls } from "../../utils/coordinator";
import theme from "../../styles/theme";
// domain
import { Account, FiatExchangeRates, PooledTransaction, Deposit } from "src/domain/hermez";

/**
 * Fetches the account details for an accountIndex in the Hermez API.
 * @param {string} accountIndex - accountIndex of the account
 * @returns {void}
 */
function fetchHermezAccount(
  accountIndex: string,
  pooledTransactions: PooledTransaction[],
  accountPendingDeposits: Deposit[],
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
): AppThunk {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet, tokensPriceTask },
    } = getState();

    dispatch(transactionActions.loadAccount());

    if (!wallet) {
      return dispatch(transactionActions.loadAccountFailure("Ethereum wallet is not loaded"));
    }

    return CoordinatorAPI.getAccount(accountIndex)
      .then((account) =>
        createAccount(
          account,
          pooledTransactions,
          accountPendingDeposits,
          tokensPriceTask,
          fiatExchangeRates,
          preferredCurrency
        )
      )
      .then((res) => dispatch(transactionActions.loadAccountSuccess(res)))
      .catch((error: Error) => dispatch(transactionActions.loadAccountFailure(error.message)));
  };
}

/**
 * Fetches the transactions which are in the transactions pool
 * @returns {void}
 */
function fetchPoolTransactions(): AppThunk {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(transactionActions.loadPoolTransactions());

    const {
      global: { wallet },
    } = getState();

    if (wallet !== undefined) {
      getPoolTransactions(undefined, wallet.publicKeyCompressedHex)
        .then((transactions) =>
          dispatch(transactionActions.loadPoolTransactionsSuccess(transactions))
        )
        .catch((err) => dispatch(transactionActions.loadPoolTransactionsFailure(err)));
    }
  };
}

/**
 * Fetches the accounts to use in the transaction. If the transaction is a deposit it will
 * look for them on Ethereum, otherwise it will look for them on the rollup api
 */
function fetchAccounts(
  fromItem: number | undefined,
  pooledTransactions: PooledTransaction[],
  pendingDeposits: Deposit[],
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
): AppThunk {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet, tokensPriceTask },
    } = getState();

    if (wallet !== undefined) {
      dispatch(transactionActions.loadAccounts());

      return CoordinatorAPI.getAccounts(wallet.publicKeyBase64, undefined, fromItem)
        .then((res) => {
          const accounts = res.accounts.map((account) =>
            createAccount(
              account,
              pooledTransactions,
              pendingDeposits,
              tokensPriceTask,
              fiatExchangeRates,
              preferredCurrency
            )
          );

          return { ...res, accounts };
        })
        .then((res) => dispatch(transactionActions.loadAccountsSuccess(res)))
        .catch((err) => dispatch(transactionActions.loadAccountsFailure(err)));
    }
  };
}

function fetchAccountBalance(): AppThunk {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet },
    } = getState();

    if (wallet !== undefined) {
      dispatch(transactionActions.loadAccountBalance());

      const ethereumAddress = getEthereumAddress(wallet.hermezEthereumAddress);
      const provider = getProvider();

      return provider
        .getBalance(ethereumAddress)
        .then((balance) =>
          dispatch(transactionActions.loadAccountBalanceSuccess(ethers.utils.formatUnits(balance)))
        )
        .catch((err) => dispatch(transactionActions.loadAccountBalanceFailure(err)));
    }
  };
}

/**
 * Fetches the recommended fees from the Coordinator
 * @returns {void}
 */
function fetchFees(): AppThunk {
  return function (dispatch: AppDispatch, getState: () => RootState) {
    const {
      global: { coordinatorStateTask },
    } = getState();

    if (
      coordinatorStateTask.status === "successful" ||
      coordinatorStateTask.status === "reloading"
    ) {
      const nextForger = getNextBestForger(coordinatorStateTask.data);

      if (nextForger !== undefined) {
        dispatch(transactionActions.loadFees());

        return CoordinatorAPI.getState({}, nextForger.coordinator.URL)
          .then((res) => dispatch(transactionActions.loadFeesSuccess(res.recommendedFee)))
          .catch((err) => dispatch(transactionActions.loadFeesFailure(err)));
      }
    }
  };
}

function transfer(amount: BigNumber, from: Account, to: Partial<Account>, fee: number): AppThunk {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet, coordinatorStateTask },
    } = getState();

    if (
      wallet !== undefined &&
      (coordinatorStateTask.status === "successful" || coordinatorStateTask.status === "reloading")
    ) {
      dispatch(transactionActions.startTransactionApproval());

      const nextForgerUrls = getNextForgerUrls(coordinatorStateTask.data);
      const txData = {
        type: "Transfer" as const,
        from: from.accountIndex,
        to: to.accountIndex || to.hezEthereumAddress || to.hezBjjAddress,
        amount: HermezCompressedAmount.compressAmount(amount.toString()),
        fee,
      };

      return Tx.generateAndSendL2Tx(txData, wallet, from.token, nextForgerUrls)
        .then(() => handleTransactionSuccess(dispatch, from.accountIndex))
        .catch((error) => {
          console.error(error);
          dispatch(transactionActions.stopTransactionApproval());
          handleTransactionFailure(dispatch, error);
        });
    }
  };
}

function handleTransactionSuccess(dispatch: AppDispatch, accountIndex: string) {
  const route = accountIndex ? `/accounts/${accountIndex}` : "/";
  dispatch(openSnackbar("Transaction submitted"));
  dispatch(push(route));
}

function handleTransactionFailure(dispatch: AppDispatch, error: Error | string) {
  const errorMsg = error instanceof Error ? error.message : error;
  dispatch(openSnackbar(`Transaction failed - ${errorMsg}`, theme.palette.red.main));
}

export {
  fetchHermezAccount,
  fetchPoolTransactions,
  fetchAccounts,
  fetchAccountBalance,
  fetchFees,
  transfer,
};
