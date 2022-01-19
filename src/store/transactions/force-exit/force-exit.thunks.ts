import { push } from "connected-react-router";
import { BigNumber } from "ethers";

import { AppState, AppDispatch, AppThunk } from "src/store";
import * as forceExitActions from "src/store/transactions/force-exit/force-exit.actions";
import { openSnackbar } from "src/store/global/global.actions";
// domain
import { HermezAccount, FiatExchangeRates, PoolTransaction } from "src/domain";
// adapters
import * as adapters from "src/adapters";

/**
 * Fetches the accounts to use in the transaction in the rollup api.
 */
function fetchAccounts(
  poolTransactions: PoolTransaction[],
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string,
  fromItem?: number
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, tokensPriceTask },
    } = getState();

    if (wallet !== undefined) {
      dispatch(forceExitActions.loadAccounts());

      const hermezEthereumAddress = wallet.publicKeyBase64;
      return adapters.hermezApi
        .getHermezAccounts({
          hermezEthereumAddress,
          tokensPriceTask,
          poolTransactions,
          fiatExchangeRates,
          preferredCurrency,
          fromItem,
        })
        .then((accounts) => dispatch(forceExitActions.loadAccountsSuccess(accounts)))
        .catch((error: unknown) => {
          const errorMsg = adapters.parseError(
            error,
            "An error occurred on src/store/transactions/force-exit/force-exit.thunks.ts:fetchAccounts"
          );
          dispatch(forceExitActions.loadAccountsFailure(errorMsg));
          dispatch(
            openSnackbar({
              message: {
                type: "error",
                raw: error,
                parsed: errorMsg,
              },
            })
          );
        });
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
      adapters.hermezApi
        .forceExit(amount, account.accountIndex, account.token, signer)
        .then(() => handleTransactionSuccess(dispatch))
        .catch((error: unknown) => {
          const errorMsg = adapters.parseError(
            error,
            "An error occurred on src/store/transactions/force-exit/force-exit.thunks.ts:forceExit"
          );
          dispatch(forceExitActions.stopTransactionApproval());
          dispatch(
            openSnackbar({
              message: {
                type: "error",
                raw: error,
                parsed: errorMsg,
              },
            })
          );
        });
    }
  };
}

function handleTransactionSuccess(dispatch: AppDispatch) {
  dispatch(openSnackbar({ message: { type: "info", text: "Transaction submitted" } }));
  dispatch(push("/"));
}

export { fetchAccounts, forceExit };
