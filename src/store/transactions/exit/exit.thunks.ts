import { push } from "connected-react-router";
import { BigNumber } from "ethers";
import { CoordinatorAPI, Tx, HermezCompressedAmount, TxFees } from "@hermeznetwork/hermezjs";
import { getPoolTransactions } from "@hermeznetwork/hermezjs/src/tx-pool";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { formatEther } from "@ethersproject/units";
import { getProvider } from "@hermeznetwork/hermezjs/src/providers";

import { AppState, AppDispatch, AppThunk } from "src/store";
import * as exitActions from "src/store/transactions/exit/exit.actions";
import { openSnackbar } from "src/store/global/global.actions";
import { createAccount } from "src/utils/accounts";
import { getNextBestForger, getNextForgerUrls } from "src/utils/coordinator";
import theme from "src/styles/theme";
// domain
import { Account, FiatExchangeRates, PooledTransaction, Token } from "src/domain/hermez";
import { ETHER_TOKEN_ID } from "src/constants";

/**
 * Fetches the account details for an accountIndex in the Hermez API.
 * @param {string} accountIndex - accountIndex of the account
 * @returns {void}
 */
function fetchHermezAccount(
  accountIndex: string,
  pooledTransactions: PooledTransaction[],
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, tokensPriceTask },
    } = getState();

    dispatch(exitActions.loadAccount());

    if (!wallet) {
      return dispatch(exitActions.loadAccountFailure("Ethereum wallet is not loaded"));
    }

    return CoordinatorAPI.getAccount(accountIndex)
      .then((account) =>
        createAccount(
          account,
          pooledTransactions,
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
    dispatch(exitActions.loadPooledTransactions());

    const {
      global: { wallet },
    } = getState();

    if (wallet !== undefined) {
      getPoolTransactions(undefined, wallet.publicKeyCompressedHex)
        .then((transactions) => dispatch(exitActions.loadPooledTransactionsSuccess(transactions)))
        .catch((err) => dispatch(exitActions.loadPooledTransactionsFailure(err)));
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

function fetchEstimatedWithdrawFee(token: Token, amount: BigNumber) {
  return async (dispatch: AppDispatch, getState: () => AppState): Promise<void> => {
    dispatch(exitActions.loadEstimatedWithdrawFee());

    try {
      const {
        global: { signer, tokensPriceTask },
      } = getState();
      const provider = getProvider();
      const gasPrice = await provider.getGasPrice();
      const estimatedMerkleSiblingsLength = 4;
      const overrides = { gasPrice };
      const gasLimit = await TxFees.estimateWithdrawGasLimit(
        token,
        estimatedMerkleSiblingsLength,
        amount,
        overrides,
        signer
      );
      const feeBigNumber = BigNumber.from(gasLimit).mul(gasPrice);

      if (tokensPriceTask.status !== "successful") {
        throw new Error("Token prices haven't been loaded");
      }

      const tokenUSD = tokensPriceTask.data[ETHER_TOKEN_ID].USD;
      const feeUSD = Number(formatEther(feeBigNumber)) * tokenUSD;

      dispatch(
        exitActions.loadEstimatedWithdrawFeeSuccess({
          amount: feeBigNumber,
          USD: feeUSD,
        })
      );
    } catch (err) {
      if (err instanceof Error) {
        dispatch(exitActions.loadEstimatedWithdrawFeeFailure(err));
      } else {
        dispatch(exitActions.loadEstimatedWithdrawFeeFailure(new Error("Unexpected error")));
      }
    }
  };
}

function exit(amount: BigNumber, account: Account, fee: number) {
  return (dispatch: AppDispatch, getState: () => AppState): void | Promise<void> => {
    const {
      global: { wallet, coordinatorStateTask },
    } = getState();

    dispatch(exitActions.startTransactionApproval());

    if (
      coordinatorStateTask.status !== "successful" &&
      coordinatorStateTask.status !== "reloading"
    ) {
      return handleTransactionFailure(dispatch, new Error("Coordinator state hasn't been loaded"));
    }

    const nextForgerUrls = getNextForgerUrls(coordinatorStateTask.data);
    const txData = {
      type: TxType.Exit,
      from: account.accountIndex,
      amount: HermezCompressedAmount.compressAmount(amount.toString()),
      fee,
    };

    return Tx.generateAndSendL2Tx(txData, wallet, account.token, nextForgerUrls)
      .then(() => handleTransactionSuccess(dispatch, account.accountIndex))
      .catch((error) => handleTransactionFailure(dispatch, error));
  };
}

function handleTransactionSuccess(dispatch: AppDispatch, accountIndex: string) {
  dispatch(openSnackbar("Transaction submitted"));
  dispatch(push(`/accounts/${accountIndex}`));
}

function handleTransactionFailure(dispatch: AppDispatch, error: Error | string) {
  const errorMsg = error instanceof Error ? error.message : error;

  dispatch(exitActions.stopTransactionApproval());
  dispatch(openSnackbar(`Transaction failed - ${errorMsg}`, theme.palette.red.main));
}

export { fetchHermezAccount, fetchPoolTransactions, fetchFees, fetchEstimatedWithdrawFee, exit };
