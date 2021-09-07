import axios from "axios";
import { CoordinatorAPI } from "@hermeznetwork/hermezjs";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { getPoolTransactions } from "@hermeznetwork/hermezjs/src/tx-pool";

import * as homeActions from "./home.actions";
import { getAccountBalance } from "src/utils/accounts";
import {
  getFixedTokenAmount,
  getTokenAmountInPreferredCurrency,
} from "src/utils/currencies";

import { RootState } from "src/store";
import { AppDispatch } from "src";

// domain
import {
  L2Transaction,
  Deposit,
  FiatExchangeRates,
  Account,
} from "src/domain/hermez";
import { Accounts } from "src/persistence";

let refreshCancelTokenSource = axios.CancelToken.source();

/**
 * Fetches the accounts for a Hermez Ethereum address and calculates the total balance.
 * @returns {void}
 */
function fetchTotalBalance(
  hermezEthereumAddress: string,
  poolTransactions: L2Transaction[],
  pendingDeposits: Deposit[],
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
) {
  return (dispatch: AppDispatch) => {
    dispatch(homeActions.loadTotalBalance());

    return CoordinatorAPI.getAccounts(
      hermezEthereumAddress,
      undefined,
      undefined,
      undefined,
      2049
    )
      .then((res: Accounts) => {
        const accounts = res.accounts.reduce(
          (accAccounts: Account[], account: Account): Account[] => {
            const accountBalance = getAccountBalance(
              account,
              poolTransactions,
              pendingDeposits
            );
            if (accountBalance !== undefined) {
              const fixedTokenAmount = getFixedTokenAmount(
                accountBalance,
                account.token.decimals
              );
              const fiatBalance = getTokenAmountInPreferredCurrency(
                fixedTokenAmount,
                account.token.USD.toString(),
                preferredCurrency,
                fiatExchangeRates
              );
              return [
                ...accAccounts,
                {
                  ...account,
                  balance: accountBalance,
                  fiatBalance,
                },
              ];
            } else {
              // ToDo: Should we keep or skip the accounts without accountBalance?
              //       Keeping them for now.
              return [...accAccounts, account];
            }
          },
          []
        );
        return { ...res, accounts };
      })
      .then((res: Accounts) => {
        const pendingCreateAccountDeposits = pendingDeposits.filter(
          (deposit) => deposit.type === TxType.CreateAccountDeposit
        );
        const totalPendingCreateAccountDepositsBalance =
          pendingCreateAccountDeposits.reduce((totalBalance, deposit) => {
            const fixedTokenAmount = getFixedTokenAmount(
              deposit.amount,
              deposit.token.decimals
            );
            const fiatBalance = getTokenAmountInPreferredCurrency(
              fixedTokenAmount,
              deposit.token.USD.toString(),
              preferredCurrency,
              fiatExchangeRates
            );

            return totalBalance + Number(fiatBalance);
          }, 0);
        const totalAccountsBalance = res.accounts.reduce(
          (totalBalance, account) => {
            return totalBalance + Number(account.fiatBalance);
          },
          0
        );
        const totalBalance =
          totalPendingCreateAccountDepositsBalance + totalAccountsBalance;

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
  poolTransactions: L2Transaction[],
  pendingDeposits: Deposit[],
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      home: { accountsTask },
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

    return CoordinatorAPI.getAccounts(
      hermezAddress,
      undefined,
      fromItem,
      undefined
    )
      .then((res) => {
        const accounts = res.accounts.reduce(
          (accAccounts: Account[], account: Account): Account[] => {
            const accountBalance = getAccountBalance(
              account,
              poolTransactions,
              pendingDeposits
            );
            if (accountBalance !== undefined) {
              const fixedTokenAmount = getFixedTokenAmount(
                accountBalance,
                account.token.decimals
              );
              const fiatBalance = getTokenAmountInPreferredCurrency(
                fixedTokenAmount,
                account.token.USD.toString(),
                preferredCurrency,
                fiatExchangeRates
              );
              return [
                ...accAccounts,
                {
                  ...account,
                  balance: accountBalance,
                  fiatBalance,
                },
              ];
            } else {
              // ToDo: Should we keep or skip the accounts without accountBalance?
              //       Keeping them for now.
              return [...accAccounts, account];
            }
          },
          []
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
  poolTransactions: L2Transaction[],
  pendingDeposits: Deposit[],
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      home: { accountsTask },
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
            .reduce(
              (accAccounts: Account[], result: Accounts): Account[] => [
                ...accAccounts,
                ...result.accounts,
              ],
              []
            )
            .reduce((accAccounts: Account[], account: Account): Account[] => {
              const accountBalance = getAccountBalance(
                account,
                poolTransactions,
                pendingDeposits
              );
              if (accountBalance !== undefined) {
                const fixedTokenAmount = getFixedTokenAmount(
                  accountBalance,
                  account.token.decimals
                );
                const fiatBalance = getTokenAmountInPreferredCurrency(
                  fixedTokenAmount,
                  account.token.USD.toString(),
                  preferredCurrency,
                  fiatExchangeRates
                );
                return [
                  ...accAccounts,
                  {
                    ...account,
                    balance: accountBalance,
                    fiatBalance,
                  },
                ];
              } else {
              // ToDo: Should we keep or skip the accounts without accountBalance?
              //       Keeping them for now.
              return [...accAccounts, account];
              }
            }, []);
          const pendingItems = results[results.length - 1]
            ? results[results.length - 1].pendingItems
            : 0;

          return { accounts, pendingItems };
        })
        .then((res) => dispatch(homeActions.refreshAccountsSuccess(res)));
    }
  };
}

/**
 * Fetches the transactions which are in the transactions pool
 * @returns {void}
 */
function fetchPoolTransactions() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(homeActions.loadPoolTransactions());

    const {
      global: { wallet },
    } = getState();

    if (wallet !== undefined) {
      getPoolTransactions(undefined, wallet.publicKeyCompressedHex)
        .then((transactions) =>
          dispatch(homeActions.loadPoolTransactionsSuccess(transactions))
        )
        .catch((err) => dispatch(homeActions.loadPoolTransactionsFailure(err)));
    }
  };
}

/**
 * Fetches the exit data for transactions of type Exit
 * @returns {void}
 */
function fetchExits() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
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

export {
  fetchTotalBalance,
  fetchAccounts,
  refreshAccounts,
  fetchPoolTransactions,
  fetchExits,
};
