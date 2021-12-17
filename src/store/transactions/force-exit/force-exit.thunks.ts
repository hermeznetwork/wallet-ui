import { push } from "connected-react-router";
import { BigNumber } from "ethers";
import { CoordinatorAPI, Tx, HermezCompressedAmount } from "@hermeznetwork/hermezjs";
import { getPoolTransactions } from "@hermeznetwork/hermezjs/src/tx-pool";

import { AppState, AppDispatch, AppThunk } from "src/store";
import * as forceExitActions from "src/store/transactions/force-exit/force-exit.actions";
import { openSnackbar } from "src/store/global/global.actions";
import theme from "src/styles/theme";
// domain
import { HermezAccount, FiatExchangeRates, PoolTransaction } from "src/domain/hermez";
import { createAccount } from "src/utils/accounts";
// persistence
import * as persistence from "src/persistence";

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
      dispatch(forceExitActions.loadAccounts());

      return CoordinatorAPI.getAccounts(wallet.publicKeyBase64, undefined, fromItem)
        .then((res) => {
          const accounts = res.accounts.map((account) =>
            createAccount(
              account,
              poolTransactions,
              undefined,
              tokensPriceTask,
              preferredCurrency,
              fiatExchangeRates
            )
          );

          return { ...res, accounts };
        })
        .then((res) => dispatch(forceExitActions.loadAccountsSuccess(res)))
        .catch((err) => dispatch(forceExitActions.loadAccountsFailure(err)));
    }
  };
}

/**
 * Fetches the transactions which are in the transactions pool
 */
function fetchPoolTransactions(): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    dispatch(forceExitActions.loadPoolTransactions());

    const {
      global: { wallet },
    } = getState();

    if (wallet !== undefined) {
      getPoolTransactions(undefined, wallet.publicKeyCompressedHex)
        .then((transactions) =>
          dispatch(forceExitActions.loadPoolTransactionsSuccess(transactions))
        )
        .catch((err) => dispatch(forceExitActions.loadPoolTransactionsFailure(err)));
    }
  };
}

function forceExit(amount: BigNumber, account: HermezAccount) {
  return (dispatch: AppDispatch, getState: () => AppState): void => {
    const {
      global: { signer },
    } = getState();

    dispatch(forceExitActions.startTransactionApproval());

    if (signer) {
      Tx.forceExit(
        HermezCompressedAmount.compressAmount(amount.toString()),
        account.accountIndex,
        account.token,
        signer
      )
        .then(() => handleTransactionSuccess(dispatch))
        .catch((error) => {
          console.error(error);
          dispatch(forceExitActions.stopTransactionApproval());
          handleTransactionFailure(dispatch, error);
        });
    }
  };
}

function handleTransactionSuccess(dispatch: AppDispatch) {
  dispatch(openSnackbar("Transaction submitted"));
  dispatch(push("/"));
}

function handleTransactionFailure(dispatch: AppDispatch, error: unknown) {
  const errorMsg = persistence.getErrorMessage(error);
  dispatch(forceExitActions.stopTransactionApproval());
  dispatch(openSnackbar(`Transaction failed - ${errorMsg}`, theme.palette.red.main));
}

export { fetchAccounts, fetchPoolTransactions, forceExit };
