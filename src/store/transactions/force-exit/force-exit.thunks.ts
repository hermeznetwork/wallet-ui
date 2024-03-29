import { push } from "@lagunovsky/redux-react-router";
import { BigNumber } from "ethers";

import { AppState, AppDispatch, AppThunk } from "src/store";
import * as forceExitActions from "src/store/transactions/force-exit/force-exit.actions";
import { processError } from "src/store/global/global.thunks";
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
          dispatch(processError(error, forceExitActions.loadAccountsFailure));
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
          dispatch(forceExitActions.stopTransactionApproval());
          dispatch(processError(error));
        });
    }
  };
}

function handleTransactionSuccess(dispatch: AppDispatch) {
  dispatch(openSnackbar({ type: "info-msg", text: "Transaction submitted" }));
  dispatch(push("/"));
}

export { fetchAccounts, forceExit };
