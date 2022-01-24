import axios from "axios";
import { push } from "connected-react-router";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import { AppState, AppDispatch, AppThunk } from "src/store";
import * as accountDetailsActions from "src/store/account-details/account-details.actions";
import * as globalThunks from "src/store/global/global.thunks";
import { openSnackbar } from "src/store/global/global.actions";
// domain
import {
  Exit,
  Exits,
  FiatExchangeRates,
  HermezAccount,
  HistoryTransaction,
  HistoryTransactions,
  Token,
} from "src/domain";
// adapters
import * as adapters from "src/adapters";

let refreshCancelTokenSource = axios.CancelToken.source();

/**
 * Fetches the account details for the specified account index
 */
function fetchAccount(
  accountIndex: HermezAccount["accountIndex"],
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, tokensPriceTask },
    } = getState();
    dispatch(accountDetailsActions.loadAccount());

    return adapters.hermezApi
      .fetchHermezAccount(accountIndex, tokensPriceTask, preferredCurrency, fiatExchangeRates)
      .then((account: HermezAccount) => {
        if (wallet === undefined || account.bjj !== wallet.publicKeyBase64) {
          dispatch(push("/"));
        } else {
          dispatch(accountDetailsActions.loadAccountSuccess(account));
        }
      })
      .catch((error: unknown) => {
        const errorMsg = adapters.parseError(error);
        dispatch(accountDetailsActions.loadAccountFailure(errorMsg));
        dispatch(
          openSnackbar({
            type: "error",
            raw: error,
            parsed: errorMsg,
          })
        );
      });
  };
}

/**
 * Checks whether the Ethereum account has >0 balance for the token
 */
function fetchL1TokenBalance(
  token: Token,
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, tokensPriceTask },
    } = getState();

    if (wallet !== undefined) {
      dispatch(accountDetailsActions.loadL1TokenBalance());

      return adapters.ethereum
        .getEthereumAccounts(wallet, [token], tokensPriceTask, fiatExchangeRates, preferredCurrency)
        .then((ethereumAccounts) => {
          if (ethereumAccounts[0]) {
            // We need this to check if the user has balance of a specific token in his ethereum address.
            // If getEthereumAccounts returns one element when asking for the token it means that the user has balance.
            dispatch(accountDetailsActions.loadL1TokenBalanceSuccess());
          } else {
            dispatch(accountDetailsActions.loadL1TokenBalanceFailure());
          }
        })
        .catch(() => dispatch(accountDetailsActions.loadL1TokenBalanceFailure()));
    }
  };
}

function filterExitsFromHistoryTransactions(
  historyTransactions: HistoryTransaction[],
  exits: Exit[]
) {
  return historyTransactions.filter((transaction) => {
    if (transaction.type === TxType.Exit) {
      const exitTx = exits.find(
        (exit) =>
          exit.batchNum === transaction.batchNum &&
          exit.accountIndex === transaction.fromAccountIndex
      );

      // If the Exit isn't pending, return true and show in history
      return !exitTx || exitTx.instantWithdraw || exitTx.delayedWithdraw;
    } else {
      return true;
    }
  });
}

/**
 * Fetches the transactions details for the specified account index
 */
function fetchHistoryTransactions(
  accountIndex: HermezAccount["accountIndex"],
  exits: Exits,
  fromItem?: number
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      accountDetails: { historyTransactionsTask },
    } = getState();

    if (
      fromItem === undefined &&
      (historyTransactionsTask.status === "reloading" ||
        historyTransactionsTask.status === "successful")
    ) {
      return dispatch(refreshHistoryTransactions(accountIndex, exits));
    }

    dispatch(accountDetailsActions.loadHistoryTransactions());

    if (fromItem) {
      refreshCancelTokenSource.cancel();
    }

    return adapters.hermezApi
      .getHistoryTransactions(undefined, undefined, undefined, accountIndex, fromItem, "DESC")
      .then((historyTransactions: HistoryTransactions) => {
        const filteredTransactions = filterExitsFromHistoryTransactions(
          historyTransactions.transactions,
          exits.exits
        );

        return { ...historyTransactions, transactions: filteredTransactions };
      })
      .then((historyTransactions: HistoryTransactions) =>
        dispatch(accountDetailsActions.loadHistoryTransactionsSuccess(historyTransactions))
      )
      .catch((error: unknown) => {
        const errorMsg = adapters.parseError(error);
        dispatch(accountDetailsActions.loadHistoryTransactionsFailure(errorMsg));
        dispatch(
          openSnackbar({
            type: "error",
            raw: error,
            parsed: errorMsg,
          })
        );
      });
  };
}

/**
 * Refreshes the transactions information for the transactions that have already been
 * loaded
 */
function refreshHistoryTransactions(
  accountIndex: HermezAccount["accountIndex"],
  exits: Exits
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      accountDetails: { historyTransactionsTask },
    } = getState();

    if (historyTransactionsTask.status === "successful") {
      dispatch(accountDetailsActions.refreshHistoryTransactions());

      refreshCancelTokenSource = axios.CancelToken.source();

      const axiosConfig = { cancelToken: refreshCancelTokenSource.token };
      const initialReq = adapters.hermezApi.getHistoryTransactions(
        undefined,
        undefined,
        undefined,
        accountIndex,
        undefined,
        "DESC",
        undefined,
        axiosConfig
      );
      const requests = historyTransactionsTask.data.fromItemHistory.reduce(
        (requests, fromItem) => [
          ...requests,
          adapters.hermezApi.getHistoryTransactions(
            undefined,
            undefined,
            undefined,
            accountIndex,
            fromItem,
            "DESC",
            undefined,
            axiosConfig
          ),
        ],
        [initialReq]
      );

      Promise.all(requests)
        .then((results) => {
          const transactions = results.reduce(
            (acc: HistoryTransaction[], result: HistoryTransactions) => [
              ...acc,
              ...result.transactions,
            ],
            []
          );
          const filteredTransactions = filterExitsFromHistoryTransactions(
            transactions,
            exits.exits
          );
          const pendingItems: number = results[results.length - 1].pendingItems;

          return { transactions: filteredTransactions, pendingItems };
        })
        .then((historyTransactions: HistoryTransactions) =>
          dispatch(accountDetailsActions.refreshHistoryTransactionsSuccess(historyTransactions))
        )
        .catch(() => ({}));
    }
  };
}

/**
 * Fetches the exit data for transactions of type Exit that are still pending a withdraw
 */
function fetchExits(tokenId: Token["id"]): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    dispatch(accountDetailsActions.loadExits());

    const {
      global: { wallet },
    } = getState();
    if (wallet !== undefined) {
      return adapters.hermezApi
        .getExits(wallet.hermezEthereumAddress, true, tokenId)
        .then((exits: Exits) => {
          dispatch(globalThunks.recoverPendingDelayedWithdrawals(exits));
          dispatch(accountDetailsActions.loadExitsSuccess(exits));
        })
        .catch((error: unknown) => {
          const errorMsg = adapters.parseError(error);
          dispatch(accountDetailsActions.loadExitsFailure(errorMsg));
          dispatch(
            openSnackbar({
              type: "error",
              raw: error,
              parsed: errorMsg,
            })
          );
        });
    }
  };
}

export {
  fetchAccount,
  fetchL1TokenBalance,
  fetchHistoryTransactions,
  refreshHistoryTransactions,
  fetchExits,
};
