import { CoordinatorAPI, Tx, HermezCompressedAmount } from "@hermeznetwork/hermezjs";
import { getProvider } from "@hermeznetwork/hermezjs/src/providers";
import { getEthereumAddress } from "@hermeznetwork/hermezjs/src/addresses";
import { getPoolTransactions } from "@hermeznetwork/hermezjs/src/tx-pool";
import { ethers, BigNumber } from "ethers";
import { push } from "connected-react-router";

import { RootState } from "src/store";
import { AppDispatch, AppThunk } from "src";
import * as transferActions from "src/store/transactions/transfer/transfer.actions";
import { openSnackbar } from "src/store/global/global.actions";
import { createAccount } from "src/utils/accounts";
import { getNextBestForger, getNextForgerUrls } from "src/utils/coordinator";
import theme from "src/styles/theme";
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

    dispatch(transferActions.loadAccount());

    if (!wallet) {
      return dispatch(transferActions.loadAccountFailure("Ethereum wallet is not loaded"));
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
      .then((res) => dispatch(transferActions.loadAccountSuccess(res)))
      .catch((error: Error) => dispatch(transferActions.loadAccountFailure(error.message)));
  };
}

/**
 * Fetches the transactions which are in the transactions pool
 * @returns {void}
 */
function fetchPoolTransactions(): AppThunk {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(transferActions.loadPooledTransactions());

    const {
      global: { wallet },
    } = getState();

    if (wallet !== undefined) {
      getPoolTransactions(undefined, wallet.publicKeyCompressedHex)
        .then((transactions) =>
          dispatch(transferActions.loadPooledTransactionsSuccess(transactions))
        )
        .catch((err) => dispatch(transferActions.loadPooledTransactionsFailure(err)));
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
      dispatch(transferActions.loadAccounts());

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
        .then((res) => dispatch(transferActions.loadAccountsSuccess(res)))
        .catch((err) => dispatch(transferActions.loadAccountsFailure(err)));
    }
  };
}

function fetchAccountBalance(): AppThunk {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet },
    } = getState();

    if (wallet !== undefined) {
      dispatch(transferActions.loadAccountBalance());

      const ethereumAddress = getEthereumAddress(wallet.hermezEthereumAddress);
      const provider = getProvider();

      return provider
        .getBalance(ethereumAddress)
        .then((balance) =>
          dispatch(transferActions.loadAccountBalanceSuccess(ethers.utils.formatUnits(balance)))
        )
        .catch((err) => dispatch(transferActions.loadAccountBalanceFailure(err)));
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
        dispatch(transferActions.loadFees());

        return CoordinatorAPI.getState({}, nextForger.coordinator.URL)
          .then((res) => dispatch(transferActions.loadFeesSuccess(res.recommendedFee)))
          .catch((err) => dispatch(transferActions.loadFeesFailure(err)));
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
      dispatch(transferActions.startTransactionApproval());

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
          dispatch(transferActions.stopTransactionApproval());
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