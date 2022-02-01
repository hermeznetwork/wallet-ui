import axios from "axios";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import { AppState, AppDispatch, AppThunk } from "src/store";
import { recoverPendingDelayedWithdrawals, processError } from "src/store/global/global.thunks";
import * as homeActions from "src/store/home/home.actions";
import { convertTokenAmountToFiat } from "src/utils/currencies";
import { isAsyncTaskDataAvailable } from "src/utils/types";
// adapters
import * as adapters from "src/adapters";
// domain
import {
  HermezAccounts,
  FiatExchangeRates,
  HermezAccount,
  PendingDeposit,
  PoolTransaction,
} from "src/domain";

let refreshCancelTokenSource = axios.CancelToken.source();

/**
 * Fetches the accounts for a Hermez Ethereum address and calculates the total balance.
 */
function fetchTotalBalance(
  hermezEthereumAddress: string,
  poolTransactions: PoolTransaction[],
  pendingDeposits: PendingDeposit[],
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { tokensPriceTask },
    } = getState();
    dispatch(homeActions.loadTotalBalance());

    const limit = 2049;
    return adapters.hermezApi
      .getHermezAccounts({
        hermezEthereumAddress,
        tokensPriceTask,
        poolTransactions,
        fiatExchangeRates,
        preferredCurrency,
        limit,
      })
      .then((accounts) => {
        const pendingCreateAccountDeposits = pendingDeposits.filter(
          (deposit) => deposit.type === TxType.CreateAccountDeposit
        );
        const totalPendingCreateAccountDepositsBalance = pendingCreateAccountDeposits.reduce(
          (totalBalance, deposit) => {
            const tokenPrice =
              tokensPriceTask.status === "successful"
                ? { ...tokensPriceTask.data[deposit.token.id] }
                : { ...deposit.token };

            const fiatBalance = convertTokenAmountToFiat(
              deposit.amount,
              tokenPrice,
              preferredCurrency,
              fiatExchangeRates
            );

            return totalBalance + Number(fiatBalance);
          },
          0
        );
        const totalAccountsBalance = accounts.accounts.reduce((totalBalance, account) => {
          return account.fiatBalance !== undefined
            ? totalBalance + Number(account.fiatBalance)
            : totalBalance;
        }, 0);
        const totalBalance = totalPendingCreateAccountDepositsBalance + totalAccountsBalance;

        dispatch(homeActions.loadTotalBalanceSuccess(totalBalance));
      })
      .catch((error: unknown) => {
        dispatch(processError(error, homeActions.loadTotalBalanceFailure));
      });
  };
}

/**
 * Fetches the accounts for a Hermez address
 */
function fetchAccounts(
  hermezEthereumAddress: string,
  poolTransactions: PoolTransaction[],
  pendingDeposits: PendingDeposit[],
  preferredCurrency: string,
  fiatExchangeRates: FiatExchangeRates,
  fromItem?: number
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      home: { accountsTask },
      global: { tokensPriceTask },
    } = getState();

    const isPaginationRequest = fromItem !== undefined;
    const isRefreshRequest =
      isPaginationRequest === false && isAsyncTaskDataAvailable(accountsTask);

    if (isRefreshRequest) {
      dispatch(
        refreshAccounts(
          hermezEthereumAddress,
          poolTransactions,
          pendingDeposits,
          preferredCurrency,
          fiatExchangeRates
        )
      );
    } else {
      dispatch(homeActions.loadAccounts());

      if (isPaginationRequest) {
        // new data prevails over reloading
        refreshCancelTokenSource.cancel();
      }

      adapters.hermezApi
        .getHermezAccounts({
          hermezEthereumAddress,
          tokensPriceTask,
          poolTransactions,
          fiatExchangeRates,
          preferredCurrency,
          fromItem,
        })
        .then((res) => {
          dispatch(homeActions.loadAccountsSuccess(res));
        })
        .catch((error: unknown) => {
          dispatch(processError(error, homeActions.loadAccountsFailure));
        });
    }
  };
}

/**
 * Refreshes the accounts information for the accounts that have already been
 * loaded
 */
function refreshAccounts(
  hermezEthereumAddress: string,
  poolTransactions: PoolTransaction[],
  pendingDeposits: PendingDeposit[],
  preferredCurrency: string,
  fiatExchangeRates: FiatExchangeRates
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      home: { accountsTask },
      global: { tokensPriceTask },
    } = getState();

    if (accountsTask.status === "successful") {
      dispatch(homeActions.refreshAccounts());

      refreshCancelTokenSource = axios.CancelToken.source();

      const axiosConfig = { cancelToken: refreshCancelTokenSource.token };
      const initialReq = adapters.hermezApi.getHermezAccounts({
        hermezEthereumAddress,
        tokensPriceTask,
        preferredCurrency,
        poolTransactions,
        fiatExchangeRates,
        axiosConfig,
      });
      const requests = accountsTask.data.fromItemHistory.reduce(
        (requests, fromItem) => [
          ...requests,
          adapters.hermezApi.getHermezAccounts({
            hermezEthereumAddress,
            tokensPriceTask,
            poolTransactions,
            fiatExchangeRates,
            preferredCurrency,
            pendingDeposits,
            fromItem,
            axiosConfig,
          }),
        ],
        [initialReq]
      );

      Promise.all(requests)
        .then((results) => {
          const accounts = results.reduce(
            (acc: HermezAccount[], result: HermezAccounts) => [...acc, ...result.accounts],
            []
          );
          const pendingItems = results[results.length - 1]
            ? results[results.length - 1].pendingItems
            : 0;

          return { accounts, pendingItems };
        })
        .then((res) => {
          dispatch(homeActions.refreshAccountsSuccess(res));
        })
        .catch((error: unknown) => {
          dispatch(processError(error, homeActions.refreshAccountsFailure));
        });
    }
  };
}

/**
 * Fetches the exit data for transactions of type Exit
 */
function fetchExits(): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet },
    } = getState();

    if (wallet !== undefined) {
      dispatch(homeActions.loadExits());

      return adapters.hermezApi
        .getExits(wallet.hermezEthereumAddress, true)
        .then((exits) => {
          dispatch(recoverPendingDelayedWithdrawals(exits));
          dispatch(homeActions.loadExitsSuccess(exits));
        })
        .catch((error: unknown) => {
          dispatch(processError(error, homeActions.loadExitsFailure));
        });
    }
  };
}

export { fetchTotalBalance, fetchAccounts, refreshAccounts, fetchExits };
