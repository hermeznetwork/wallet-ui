import { push } from "connected-react-router";
import { BigNumber } from "ethers";
import { HermezCompressedAmount, TxUtils } from "@hermeznetwork/hermezjs";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { isHermezBjjAddress } from "@hermeznetwork/hermezjs/src/addresses";

import { AppState, AppDispatch, AppThunk } from "src/store";
import * as transferActions from "src/store/transactions/transfer/transfer.actions";
import { openSnackbar } from "src/store/global/global.actions";
import { getNextBestForger, getNextForgerUrls } from "src/utils/coordinator";
import theme from "src/styles/theme";
import { feeBigIntToNumber, getMinimumL2Fee, getTxFee } from "src/utils/fees";
import { TxData } from "src/views/transactions/transfer/components/transfer-form/transfer-form.view";
// domain
import {
  Accounts,
  FiatExchangeRates,
  HermezAccount,
  PoolTransaction,
  TransactionReceiver,
} from "src/domain";
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

    dispatch(transferActions.loadAccount());

    return adapters.hermezApi
      .fetchHermezAccount(
        accountIndex,
        tokensPriceTask,
        preferredCurrency,
        fiatExchangeRates,
        poolTransactions
      )
      .then((res) => dispatch(transferActions.loadAccountSuccess(res)))
      .catch((err: unknown) =>
        dispatch(
          transferActions.loadAccountFailure(
            adapters.getErrorMessage(err, "Oops... an error occurred on fetchHermezAccount")
          )
        )
      );
  };
}

/**
 * Fetches the transactions which are in the transactions pool
 */
function fetchPoolTransactions(): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    dispatch(transferActions.loadPoolTransactions());

    const {
      global: { wallet },
    } = getState();

    if (wallet !== undefined) {
      adapters.hermezApi
        .getPoolTransactions(undefined, wallet.publicKeyCompressedHex)
        .then((transactions) => dispatch(transferActions.loadPoolTransactionsSuccess(transactions)))
        .catch((err: unknown) =>
          dispatch(
            transferActions.loadPoolTransactionsFailure(
              adapters.getErrorMessage(err, "Oops... an error occurred on fetchPoolTransactions")
            )
          )
        );
    }
  };
}

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
      dispatch(transferActions.loadAccounts());
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
        .then((accounts) => dispatch(transferActions.loadAccountsSuccess(accounts)))
        .catch((err: unknown) =>
          dispatch(
            transferActions.loadAccountsFailure(
              adapters.getErrorMessage(err, "Oops... an error occurred on fetchAccounts")
            )
          )
        );
    }
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
        dispatch(transferActions.loadFees());

        return adapters.hermezApi
          .getState({}, nextForger.coordinator.URL)
          .then((res) => dispatch(transferActions.loadFeesSuccess(res.recommendedFee)))
          .catch((err: unknown) =>
            dispatch(
              transferActions.loadFeesFailure(
                adapters.getErrorMessage(err, "Oops... an error occurred on fetchFees")
              )
            )
          );
      }
    }
  };
}

function checkTxData(txData: TxData) {
  return (dispatch: AppDispatch): void => {
    const { amount, from, to, feesTask } = txData;

    if (isHermezBjjAddress(txData.to)) {
      void adapters.hermezApi.getAccounts(to, [from.token.id]).then((accounts: Accounts) => {
        const doesAccountAlreadyExist: boolean = accounts.accounts[0] !== undefined;
        const minimumFee = getMinimumL2Fee({
          txType: TxType.Transfer,
          receiverAddress: to,
          feesTask,
          token: from.token,
          doesAccountAlreadyExist,
        });
        const fee = getTxFee({
          txType: TxType.Transfer,
          amount,
          token: from.token,
          minimumFee,
        });

        dispatch(
          transferActions.goToReviewTransactionStep({
            amount: amount,
            from: txData.from,
            to: { bjj: txData.to },
            fee,
          })
        );
      });
    } else {
      void Promise.allSettled([
        adapters.hermezApi.getAccounts(to, [from.token.id]),
        adapters.hermezApi.getCreateAccountAuthorization(to),
      ]).then(([accountsResult, accountAuthorizationResult]) => {
        const doesAccountAlreadyExist: boolean =
          accountsResult.status === "fulfilled" && accountsResult.value.accounts[0] !== undefined;

        if (!doesAccountAlreadyExist && accountAuthorizationResult.status === "rejected") {
          dispatch(transferActions.setReceiverCreateAccountsAuthorizationStatus(false));
        } else {
          const minimumFee = getMinimumL2Fee({
            txType: TxType.Transfer,
            receiverAddress: to,
            feesTask,
            token: from.token,
            doesAccountAlreadyExist,
          });
          const fee = getTxFee({
            txType: TxType.Transfer,
            amount,
            token: from.token,
            minimumFee,
          });

          dispatch(
            transferActions.goToReviewTransactionStep({
              amount: amount,
              from,
              to: { hezEthereumAddress: to },
              fee: fee,
            })
          );
        }
      });
    }
  };
}

function transfer(
  amount: BigNumber,
  from: HermezAccount,
  to: TransactionReceiver,
  fee: BigNumber
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, coordinatorStateTask },
    } = getState();

    if (
      wallet !== undefined &&
      (coordinatorStateTask.status === "successful" || coordinatorStateTask.status === "reloading")
    ) {
      dispatch(transferActions.startTransactionApproval());

      const nextForgerUrls = getNextForgerUrls(coordinatorStateTask.data);
      const toAddress = "bjj" in to ? to.bjj : to.hezEthereumAddress;
      const type = TxUtils.getTransactionType({ to: toAddress });
      const txData = {
        type,
        from: from.accountIndex,
        to: toAddress,
        amount: HermezCompressedAmount.compressAmount(amount.toString()),
        fee: feeBigIntToNumber(fee, from.token),
      };
      return adapters.hermezApi
        .generateAndSendL2Tx(txData, wallet, from.token, nextForgerUrls)
        .then(() => handleTransactionSuccess(dispatch, from.accountIndex))
        .catch((error: unknown) => {
          dispatch(transferActions.stopTransactionApproval());
          handleTransactionFailure(dispatch, error);
        });
    }
  };
}

function handleTransactionSuccess(dispatch: AppDispatch, accountIndex: string) {
  const route = accountIndex ? `/accounts/${accountIndex}` : "/";
  dispatch(openSnackbar({ message: "Transaction submitted" }));
  dispatch(push(route));
}

function handleTransactionFailure(dispatch: AppDispatch, error: unknown) {
  const errorMsg = adapters.getErrorMessage(error);
  dispatch(
    openSnackbar({
      message: `Transaction failed - ${errorMsg}`,
      backgroundColor: theme.palette.red.main,
    })
  );
}

export {
  fetchHermezAccount,
  fetchPoolTransactions,
  fetchAccounts,
  fetchFees,
  checkTxData,
  transfer,
};
