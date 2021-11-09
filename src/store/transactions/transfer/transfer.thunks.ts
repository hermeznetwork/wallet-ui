import { push } from "connected-react-router";
import { BigNumber } from "ethers";
import { CoordinatorAPI, Tx, HermezCompressedAmount, TxUtils } from "@hermeznetwork/hermezjs";
import { getPoolTransactions } from "@hermeznetwork/hermezjs/src/tx-pool";

import { AppState, AppDispatch, AppThunk } from "src/store";
import * as transferActions from "src/store/transactions/transfer/transfer.actions";
import { openSnackbar } from "src/store/global/global.actions";
import { createAccount } from "src/utils/accounts";
import { getNextBestForger, getNextForgerUrls } from "src/utils/coordinator";
import theme from "src/styles/theme";
// domain
import { Account, FiatExchangeRates, PoolTransaction } from "src/domain/hermez";

/**
 * Fetches the account details for an accountIndex in the Hermez API.
 * @param {string} accountIndex - accountIndex of the account
 * @returns {void}
 */
function fetchHermezAccount(
  accountIndex: string,
  poolTransactions: PoolTransaction[],
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { tokensPriceTask },
    } = getState();

    dispatch(transferActions.loadAccount());

    return CoordinatorAPI.getAccount(accountIndex)
      .then((account) =>
        createAccount(
          account,
          poolTransactions,
          undefined,
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
  return (dispatch: AppDispatch, getState: () => AppState) => {
    dispatch(transferActions.loadPoolTransactions());

    const {
      global: { wallet },
    } = getState();

    if (wallet !== undefined) {
      getPoolTransactions(undefined, wallet.publicKeyCompressedHex)
        .then((transactions) => dispatch(transferActions.loadPoolTransactionsSuccess(transactions)))
        .catch((err) => dispatch(transferActions.loadPoolTransactionsFailure(err)));
    }
  };
}

/**
 * Fetches the accounts to use in the transaction in the rollup api.
 */
function fetchAccounts(
  fromItem: number | undefined,
  poolTransactions: PoolTransaction[],
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
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
              poolTransactions,
              undefined,
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

/**
 * Fetches the recommended fees from the Coordinator
 * @returns {void}
 */
function fetchFees(): AppThunk {
  return function (dispatch: AppDispatch, getState: () => AppState) {
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
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, coordinatorStateTask },
    } = getState();

    if (
      wallet !== undefined &&
      (coordinatorStateTask.status === "successful" || coordinatorStateTask.status === "reloading")
    ) {
      dispatch(transferActions.startTransactionApproval());

      const nextForgerUrls = getNextForgerUrls(coordinatorStateTask.data);
      const toAddress = to.accountIndex || to.hezEthereumAddress || to.bjj;
      const type = TxUtils.getTransactionType({ to: toAddress });
      const txData = {
        type,
        from: from.accountIndex,
        to: toAddress,
        amount: HermezCompressedAmount.compressAmount(amount.toString()),
        fee,
      };
      return Tx.generateAndSendL2Tx(txData, wallet, from.token, nextForgerUrls)
        .then(() => handleTransactionSuccess(dispatch, from.accountIndex))
        .catch((error) => {
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

export { fetchHermezAccount, fetchPoolTransactions, fetchAccounts, fetchFees, transfer };
