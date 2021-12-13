import { push } from "connected-react-router";
import { BigNumber } from "ethers";
import { CoordinatorAPI, Tx, HermezCompressedAmount, TxFees } from "@hermeznetwork/hermezjs";
import { getPoolTransactions } from "@hermeznetwork/hermezjs/src/tx-pool";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { getProvider } from "@hermeznetwork/hermezjs/src/providers";
import { getEthereumAddress } from "@hermeznetwork/hermezjs/src/addresses";

import { AppState, AppDispatch, AppThunk } from "src/store";
import * as exitActions from "src/store/transactions/exit/exit.actions";
import { openSnackbar } from "src/store/global/global.actions";
import theme from "src/styles/theme";
// utils
import { getNextBestForger, getNextForgerUrls } from "src/utils/coordinator";
import { createAccount } from "src/utils/accounts";
import { feeBigIntToNumber } from "src/utils/fees";
// domain
import { HermezAccount, FiatExchangeRates, PoolTransaction, Token } from "src/domain/hermez";
import { ETHER_TOKEN_ID } from "src/constants";
// persistence
import * as persistence from "src/persistence";

/**
 * Fetches the account details for an accountIndex in the Hermez API.
 * @param {string} accountIndex - accountIndex of the account
 * @returns {void}
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

    return CoordinatorAPI.getAccount(accountIndex)
      .then((account) =>
        createAccount(
          account,
          poolTransactions,
          undefined,
          tokensPriceTask,
          fiatExchangeRates,
          preferredCurrency
        )
      )
      .then((res) => dispatch(exitActions.loadAccountSuccess(res)))
      .catch((error: Error) => dispatch(exitActions.loadAccountFailure(error.message)));
  };
}

/**
 * Fetches the transactions which are in the transactions pool
 * @returns {void}
 */
function fetchPoolTransactions(): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    dispatch(exitActions.loadPoolTransactions());

    const {
      global: { wallet },
    } = getState();

    if (wallet !== undefined) {
      getPoolTransactions(undefined, wallet.publicKeyCompressedHex)
        .then((transactions) => dispatch(exitActions.loadPoolTransactionsSuccess(transactions)))
        .catch((err) => dispatch(exitActions.loadPoolTransactionsFailure(err)));
    }
  };
}

/**
 * Fetches the recommended fees from the Coordinator
 * @returns {void}
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

        return CoordinatorAPI.getState({}, nextForger.coordinator.URL)
          .then((res) => dispatch(exitActions.loadFeesSuccess(res.recommendedFee)))
          .catch((err) => dispatch(exitActions.loadFeesFailure(err)));
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
        .catch((err) => dispatch(exitActions.loadAccountBalanceFailure(err)));
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
      const estimatedMerkleSiblingsLength = 4;
      const overrides = maxFeePerGas ? { maxFeePerGas } : {};
      const gasLimit = await TxFees.estimateWithdrawGasLimit(
        token,
        estimatedMerkleSiblingsLength,
        amount,
        overrides,
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
      if (err instanceof Error) {
        dispatch(exitActions.loadEstimatedWithdrawFeeFailure(err));
      } else {
        dispatch(exitActions.loadEstimatedWithdrawFeeFailure(new Error("Unexpected error")));
      }
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
        amount: HermezCompressedAmount.compressAmount(amount.toString()),
        fee: feeBigIntToNumber(fee, account.token),
      };

      return Tx.generateAndSendL2Tx(txData, wallet, account.token, nextForgerUrls)
        .then(() => handleTransactionSuccess(dispatch, account.accountIndex))
        .catch((error) => handleTransactionFailure(dispatch, error));
    }
  };
}

function handleTransactionSuccess(dispatch: AppDispatch, accountIndex: string) {
  dispatch(openSnackbar("Transaction submitted"));
  dispatch(push(`/accounts/${accountIndex}`));
}

function handleTransactionFailure(dispatch: AppDispatch, error: unknown) {
  const errorMsg = persistence.getErrorMessage(error);
  console.error(error);
  dispatch(exitActions.stopTransactionApproval());
  dispatch(openSnackbar(`Transaction failed - ${errorMsg}`, theme.palette.red.main));
}

export {
  fetchHermezAccount,
  fetchPoolTransactions,
  fetchFees,
  fetchAccountBalance,
  fetchEstimatedWithdrawFee,
  exit,
};
