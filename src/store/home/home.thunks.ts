import axios from "axios";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import { AppState, AppDispatch, AppThunk } from "src/store";
import { convertTokenAmountToFiat } from "src/utils/currencies";
import * as globalThunks from "src/store/global/global.thunks";
import * as homeActions from "src/store/home/home.actions";
// adapters
import * as adapters from "src/adapters";
// domain
import {
  Accounts,
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
      .catch((err) => dispatch(homeActions.loadTotalBalanceFailure(err)));
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

    if (fromItem === undefined && accountsTask.status === "successful") {
      return dispatch(
        refreshAccounts(
          hermezEthereumAddress,
          poolTransactions,
          pendingDeposits,
          preferredCurrency,
          fiatExchangeRates
        )
      );
    }

    dispatch(homeActions.loadAccounts());

    if (fromItem) {
      refreshCancelTokenSource.cancel();
    }

    return adapters.hermezApi
      .getHermezAccounts({
        hermezEthereumAddress,
        tokensPriceTask,
        poolTransactions,
        fiatExchangeRates,
        preferredCurrency,
        fromItem,
      })
      .then((res) => dispatch(homeActions.loadAccountsSuccess(res)))
      .catch((err) => dispatch(homeActions.loadAccountsFailure(err)));
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
      const initialReq = adapters.hermezApi.getAccounts(
        hermezEthereumAddress,
        undefined,
        undefined,
        undefined,
        undefined,
        axiosConfig
      );
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
            (acc: HermezAccount[], result: Accounts) => [...acc, ...result.accounts],
            []
          );
          const pendingItems = results[results.length - 1]
            ? results[results.length - 1].pendingItems
            : 0;

          return { accounts, pendingItems };
        })
        .then((res) => dispatch(homeActions.refreshAccountsSuccess(res)))
        .catch(() => ({}));
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
          dispatch(globalThunks.recoverPendingDelayedWithdrawals(exits));
          dispatch(homeActions.loadExitsSuccess(exits));
        })
        .catch((err) => dispatch(homeActions.loadExitsFailure(err)));
    }
  };
}

export { fetchTotalBalance, fetchAccounts, refreshAccounts, fetchExits };
