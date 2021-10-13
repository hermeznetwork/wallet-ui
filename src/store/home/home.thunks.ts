import axios from "axios";
import { CoordinatorAPI } from "@hermeznetwork/hermezjs";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { getPoolTransactions } from "@hermeznetwork/hermezjs/src/tx-pool";

import { AppState, AppDispatch, AppThunk } from "src/store";
import { createAccount } from "src/utils/accounts";
import { convertTokenAmountToFiat } from "src/utils/currencies";
import * as homeActions from "src/store/home/home.actions";
// domain
import { PooledTransaction, Deposit, FiatExchangeRates, Account } from "src/domain/hermez";
import { Accounts } from "src/persistence";

let refreshCancelTokenSource = axios.CancelToken.source();

/**
 * Fetches the accounts for a Hermez Ethereum address and calculates the total balance.
 * @returns {void}
 */
function fetchTotalBalance(
  hermezEthereumAddress: string,
  poolTransactions: PooledTransaction[],
  pendingDeposits: Deposit[],
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { tokensPriceTask },
    } = getState();
    dispatch(homeActions.loadTotalBalance());

    return CoordinatorAPI.getAccounts(hermezEthereumAddress, undefined, undefined, undefined, 2049)
      .then((res) => {
        const accounts = res.accounts.map((account) =>
          createAccount(
            account,
            poolTransactions,
            pendingDeposits,
            tokensPriceTask,
            fiatExchangeRates,
            preferredCurrency
          )
        );

        return { ...res, accounts };
      })
      .then((res) => {
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
        const totalAccountsBalance = res.accounts.reduce((totalBalance, account) => {
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
 * @param {Number} fromItem - id of the first account to be returned from the API
 * @returns {void}
 */
function fetchAccounts(
  hermezAddress: string,
  fromItem: number,
  poolTransactions: PooledTransaction[],
  pendingDeposits: Deposit[],
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      home: { accountsTask },
      global: { tokensPriceTask },
    } = getState();

    if (fromItem === undefined && accountsTask.status === "successful") {
      return dispatch(
        refreshAccounts(
          hermezAddress,
          poolTransactions,
          pendingDeposits,
          fiatExchangeRates,
          preferredCurrency
        )
      );
    }

    dispatch(homeActions.loadAccounts());

    if (fromItem) {
      refreshCancelTokenSource.cancel();
    }

    return CoordinatorAPI.getAccounts(hermezAddress, undefined, fromItem, undefined)
      .then((res) => {
        const accounts = res.accounts.map((account) =>
          createAccount(
            account,
            poolTransactions,
            pendingDeposits,
            tokensPriceTask,
            fiatExchangeRates,
            preferredCurrency
          )
        );

        return { ...res, accounts };
      })
      .then((res) => dispatch(homeActions.loadAccountsSuccess(res)))
      .catch((err) => dispatch(homeActions.loadAccountsFailure(err)));
  };
}

/**
 * Refreshes the accounts information for the accounts that have already been
 * loaded
 * @param {string} accountIndex - Account index
 */
function refreshAccounts(
  hermezAddress: string,
  poolTransactions: PooledTransaction[],
  pendingDeposits: Deposit[],
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
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
      const initialReq = CoordinatorAPI.getAccounts(
        hermezAddress,
        undefined,
        undefined,
        undefined,
        undefined,
        axiosConfig
      );
      const requests = accountsTask.data.fromItemHistory.reduce(
        (requests, fromItem) => [
          ...requests,
          CoordinatorAPI.getAccounts(
            hermezAddress,
            undefined,
            fromItem,
            undefined,
            undefined,
            axiosConfig
          ),
        ],
        [initialReq]
      );

      Promise.all(requests)
        .then((results) => {
          const accounts = results
            .reduce((acc: Account[], result: Accounts) => [...acc, ...result.accounts], [])
            .map((account) =>
              createAccount(
                account,
                poolTransactions,
                pendingDeposits,
                tokensPriceTask,
                fiatExchangeRates,
                preferredCurrency
              )
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
 * Fetches the transactions which are in the transactions pool
 * @returns {void}
 */
function fetchPoolTransactions(): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    dispatch(homeActions.loadPoolTransactions());

    const {
      global: { wallet },
    } = getState();

    if (wallet !== undefined) {
      getPoolTransactions(undefined, wallet.publicKeyCompressedHex)
        .then((transactions) => dispatch(homeActions.loadPoolTransactionsSuccess(transactions)))
        .catch((err) => dispatch(homeActions.loadPoolTransactionsFailure(err)));
    }
  };
}

/**
 * Fetches the exit data for transactions of type Exit
 * @returns {void}
 */
function fetchExits(): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet },
    } = getState();

    if (wallet !== undefined) {
      dispatch(homeActions.loadExits());

      return CoordinatorAPI.getExits(wallet.hermezEthereumAddress, true)
        .then((exits) => dispatch(homeActions.loadExitsSuccess(exits)))
        .catch((err) => dispatch(homeActions.loadExitsFailure(err)));
    }
  };
}

export { fetchTotalBalance, fetchAccounts, refreshAccounts, fetchPoolTransactions, fetchExits };
