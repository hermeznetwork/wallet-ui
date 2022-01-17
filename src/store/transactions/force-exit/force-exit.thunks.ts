import { push } from "connected-react-router";
import { BigNumber } from "ethers";
import { HermezCompressedAmount } from "@hermeznetwork/hermezjs";

import { AppState, AppDispatch, AppThunk } from "src/store";
import * as forceExitActions from "src/store/transactions/force-exit/force-exit.actions";
import { openSnackbar } from "src/store/global/global.actions";
import theme from "src/styles/theme";
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
        .catch((err: unknown) =>
          dispatch(
            forceExitActions.loadAccountsFailure(
              adapters.getErrorMessage(err, "Oops... an error occurred on fetchAccounts")
            )
          )
        );
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
        .forceExit(
          HermezCompressedAmount.compressAmount(amount.toString()),
          account.accountIndex,
          account.token,
          signer
        )
        .then(() => handleTransactionSuccess(dispatch))
        .catch((error: unknown) => {
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
  const errorMsg = adapters.getErrorMessage(error);
  dispatch(forceExitActions.stopTransactionApproval());
  dispatch(openSnackbar(`Transaction failed - ${errorMsg}`, theme.palette.red.main));
}

export { fetchAccounts, forceExit };
