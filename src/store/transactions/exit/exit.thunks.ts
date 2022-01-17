import { push } from "connected-react-router";
import { BigNumber } from "ethers";
import { HermezCompressedAmount } from "@hermeznetwork/hermezjs";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { getProvider } from "@hermeznetwork/hermezjs/src/providers";
import { getEthereumAddress } from "@hermeznetwork/hermezjs/src/addresses";

import { AppState, AppDispatch, AppThunk } from "src/store";
import * as exitActions from "src/store/transactions/exit/exit.actions";
import { openSnackbar } from "src/store/global/global.actions";
import theme from "src/styles/theme";
// utils
import { getNextBestForger, getNextForgerUrls } from "src/utils/coordinator";
import { feeBigIntToNumber } from "src/utils/fees";
// domain
import { HermezAccount, FiatExchangeRates, PoolTransaction, Token } from "src/domain";
import { ETHER_TOKEN_ID } from "src/constants";
// adapters
import * as adapters from "src/adapters";

/**
 * Fetches the account details for an accountIndex in the Hermez API.
 */
function fetchHermezAccount(
  accountIndex: string,
  poolTransactions: PoolTransaction[],
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { tokensPriceTask },
    } = getState();

    dispatch(exitActions.loadAccount());

    return adapters.hermezApi
      .fetchHermezAccount(
        accountIndex,
        tokensPriceTask,
        preferredCurrency,
        fiatExchangeRates,
        poolTransactions
      )
      .then((res) => dispatch(exitActions.loadAccountSuccess(res)))
      .catch((err: unknown) =>
        dispatch(
          exitActions.loadAccountFailure(
            adapters.getErrorMessage(err, "Oops... an error occurred on fetchHermezAccount")
          )
        )
      );
  };
}

/**
 * Fetches the recommended fees from the Coordinator
 */
function fetchFees(): AppThunk {
  return function (dispatch: AppDispatch, getState: () => AppState) {
    const {
      global: { coordinatorStateTask },
    } = getState();

    if (
      coordinatorStateTask.status === "successful" ||
      coordinatorStateTask.status === "reloading"
    ) {
      const nextForger = getNextBestForger(coordinatorStateTask.data);

      if (nextForger !== undefined) {
        dispatch(exitActions.loadFees());

        return adapters.hermezApi
          .getState({}, nextForger.coordinator.URL)
          .then((res) => dispatch(exitActions.loadFeesSuccess(res.recommendedFee)))
          .catch((err: unknown) =>
            dispatch(
              exitActions.loadFeesFailure(
                adapters.getErrorMessage(err, "Oops... an error occurred on fetchFees")
              )
            )
          );
      }
    }
  };
}

function fetchAccountBalance() {
  return (dispatch: AppDispatch, getState: () => AppState): void => {
    const {
      global: { wallet },
    } = getState();

    dispatch(exitActions.loadAccountBalance());

    if (wallet) {
      const ethereumAddress = getEthereumAddress(wallet.hermezEthereumAddress);
      const provider = getProvider();

      provider
        .getBalance(ethereumAddress)
        .then((balance) => dispatch(exitActions.loadAccountBalanceSuccess(balance)))
        .catch((err: unknown) =>
          dispatch(
            exitActions.loadAccountBalanceFailure(
              adapters.getErrorMessage(err, "Oops... an error occurred on fetchAccountBalance")
            )
          )
        );
    }
  };
}

function fetchEstimatedWithdrawFee(token: Token, amount: BigNumber) {
  return async (dispatch: AppDispatch, getState: () => AppState): Promise<void> => {
    dispatch(exitActions.loadEstimatedWithdrawFee());

    try {
      const {
        global: { signer, tokensPriceTask },
      } = getState();
      const provider = getProvider();
      const { maxFeePerGas } = await provider.getFeeData();
      const overrides = maxFeePerGas ? { maxFeePerGas } : {};
      const gasLimit = await adapters.hermezApi.estimateWithdrawCircuitGasLimit(
        token,
        amount,
        overrides,
        true,
        signer
      );
      const feeBigNumber = maxFeePerGas
        ? BigNumber.from(gasLimit).mul(maxFeePerGas)
        : BigNumber.from(gasLimit);

      if (tokensPriceTask.status === "successful" || tokensPriceTask.status === "reloading") {
        const ethToken = tokensPriceTask.data.find((token) => token.id === ETHER_TOKEN_ID);

        if (ethToken) {
          dispatch(
            exitActions.loadEstimatedWithdrawFeeSuccess({
              amount: feeBigNumber,
              token: ethToken,
            })
          );
        }
      }
    } catch (err) {
      dispatch(
        exitActions.loadEstimatedWithdrawFeeFailure(
          adapters.getErrorMessage(err, "Oops... an error occurred on fetchEstimatedWithdrawFee")
        )
      );
    }
  };
}

function exit(amount: BigNumber, account: HermezAccount, fee: BigNumber) {
  return (dispatch: AppDispatch, getState: () => AppState): void | Promise<void> => {
    const {
      global: { wallet, coordinatorStateTask },
    } = getState();

    dispatch(exitActions.startTransactionApproval());

    if (
      wallet !== undefined &&
      (coordinatorStateTask.status === "successful" || coordinatorStateTask.status === "reloading")
    ) {
      const nextForgerUrls = getNextForgerUrls(coordinatorStateTask.data);
      const txData = {
        type: TxType.Exit,
        from: account.accountIndex,
        to: null,
        amount: HermezCompressedAmount.compressAmount(amount.toString()),
        fee: feeBigIntToNumber(fee, account.token),
      };

      return adapters.hermezApi
        .generateAndSendL2Tx(txData, wallet, account.token, nextForgerUrls)
        .then(() => handleTransactionSuccess(dispatch, account.accountIndex))
        .catch((error: unknown) => handleTransactionFailure(dispatch, error));
    }
  };
}

function handleTransactionSuccess(dispatch: AppDispatch, accountIndex: string) {
  dispatch(openSnackbar("Transaction submitted"));
  dispatch(push(`/accounts/${accountIndex}`));
}

function handleTransactionFailure(dispatch: AppDispatch, error: unknown) {
  const errorMsg = adapters.getErrorMessage(error);
  console.error(error);
  dispatch(exitActions.stopTransactionApproval());
  dispatch(openSnackbar(`Transaction failed - ${errorMsg}`, theme.palette.red.main));
}

export { fetchHermezAccount, fetchFees, fetchAccountBalance, fetchEstimatedWithdrawFee, exit };
