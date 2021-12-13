import axios from "axios";
import { push } from "connected-react-router";
import { CoordinatorAPI } from "@hermeznetwork/hermezjs";
import { getPoolTransactions } from "@hermeznetwork/hermezjs/src/tx-pool";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import { AppState, AppDispatch, AppThunk } from "src/store";
import * as ethereum from "src/utils/ethereum";
import { createAccount } from "src/utils/accounts";
import * as accountDetailsActions from "src/store/account-details/account-details.actions";
import * as globalThunks from "src/store/global/global.thunks";
// domain
import {
  HermezAccount,
  Token,
  HistoryTransaction,
  PoolTransaction,
  Exit,
  FiatExchangeRates,
} from "src/domain/hermez";
// persistence
import { HistoryTransactions, Exits } from "src/persistence";

let refreshCancelTokenSource = axios.CancelToken.source();

/**
 * Fetches the account details for the specified account index
 * @param {string} accountIndex - Account index
 * @returns {void}
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

    return CoordinatorAPI.getAccount(accountIndex)
      .then((account: HermezAccount) => {
        if (wallet === undefined || account.bjj !== wallet.publicKeyBase64) {
          dispatch(push("/"));
        } else {
          const accountTokenUpdated = createAccount(
            account,
            undefined,
            undefined,
            tokensPriceTask,
            fiatExchangeRates,
            preferredCurrency
          );

          dispatch(accountDetailsActions.loadAccountSuccess(accountTokenUpdated));
        }
      })
      .catch((err: Error) => dispatch(accountDetailsActions.loadAccountFailure(err)));
  };
}

/**
 * Checks whether the Ethereum account has >0 balance for the token
 * @param {Object} token - Hermez token object for the loaded account
 * @returns {void}
 */
function fetchL1TokenBalance(token: Token): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet },
    } = getState();

    if (wallet !== undefined) {
      dispatch(accountDetailsActions.loadL1TokenBalance());

      return ethereum
        .getTokens(wallet, [token])
        .then((metamaskTokens) => {
          if (metamaskTokens[0]) {
            // We need this to check if the user has balance of a specific token in his ethereum address.
            // If getTokens returns one element when asking for the token it means that the user has balance.
            dispatch(accountDetailsActions.loadL1TokenBalanceSuccess());
          } else {
            dispatch(accountDetailsActions.loadL1TokenBalanceFailure());
          }
        })
        .catch(() => dispatch(accountDetailsActions.loadL1TokenBalanceFailure()));
    }
  };
}

/**
 * Fetches the transaction details for each transaction in the pool for the specified account index
 * @param {string} accountIndex - Account index
 * @returns {void}
 */
function fetchPoolTransactions(accountIndex: HermezAccount["accountIndex"]): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    dispatch(accountDetailsActions.loadPoolTransactions());

    const {
      global: { wallet },
    } = getState();
    if (wallet !== undefined) {
      getPoolTransactions(accountIndex, wallet.publicKeyCompressedHex)
        // We need to reverse the txs to match the order of the txs from the history (DESC)
        .then((transactions: PoolTransaction[]) => transactions.reverse())
        .then((transactions: PoolTransaction[]) =>
          dispatch(accountDetailsActions.loadPoolTransactionsSuccess(transactions))
        )
        .catch((err: Error) => dispatch(accountDetailsActions.loadPoolTransactionsFailure(err)));
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
 * @param {string} accountIndex - Account index
 * @returns {void}
 */
// ToDo: Define fromItem type
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

    return CoordinatorAPI.getTransactions(
      undefined,
      undefined,
      undefined,
      accountIndex,
      fromItem,
      "DESC"
    )
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
      .catch((err: Error) => dispatch(accountDetailsActions.loadHistoryTransactionsFailure(err)));
  };
}

/**
 * Refreshes the transactions information for the transactions that have already been
 * loaded
 * @param {string} accountIndex - Account index
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
      const initialReq = CoordinatorAPI.getTransactions(
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
          CoordinatorAPI.getTransactions(
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
 * @param {Number} tokenId - The token ID for the current account
 * @returns {void}
 */
function fetchExits(tokenId: Token["id"]): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    dispatch(accountDetailsActions.loadExits());

    const {
      global: { wallet },
    } = getState();
    if (wallet !== undefined) {
      return CoordinatorAPI.getExits(wallet.hermezEthereumAddress, true, tokenId)
        .then((exits: Exits) => {
          dispatch(globalThunks.recoverPendingDelayedWithdrawals(exits));
          dispatch(accountDetailsActions.loadExitsSuccess(exits));
        })
        .catch((err: Error) => dispatch(accountDetailsActions.loadExitsFailure(err)));
    }
  };
}

export {
  fetchAccount,
  fetchL1TokenBalance,
  fetchPoolTransactions,
  fetchHistoryTransactions,
  refreshHistoryTransactions,
  fetchExits,
};
