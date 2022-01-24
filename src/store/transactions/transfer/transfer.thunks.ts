import { push } from "connected-react-router";
import { BigNumber } from "ethers";
import { HermezCompressedAmount, TxUtils } from "@hermeznetwork/hermezjs";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { isHermezBjjAddress } from "@hermeznetwork/hermezjs/src/addresses";

import { AppState, AppDispatch, AppThunk } from "src/store";
import * as transferActions from "src/store/transactions/transfer/transfer.actions";
import { openSnackbar } from "src/store/global/global.actions";
import { getNextBestForger, getNextForgerUrls } from "src/utils/coordinator";
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
      .catch((error: unknown) => {
        const errorMsg = adapters.parseError(error);
        dispatch(transferActions.loadAccountFailure(errorMsg));
        dispatch(
          openSnackbar({
            type: "error",
            raw: error,
            parsed: errorMsg,
          })
        );
      });
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
        .catch((error: unknown) => {
          const errorMsg = adapters.parseError(error);
          dispatch(transferActions.loadAccountsFailure(errorMsg));
          dispatch(
            openSnackbar({
              type: "error",
              raw: error,
              parsed: errorMsg,
            })
          );
        });
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
          .catch((error: unknown) => {
            const errorMsg = adapters.parseError(error);
            dispatch(transferActions.loadFeesFailure(errorMsg));
            dispatch(
              openSnackbar({
                type: "error",
                raw: error,
                parsed: errorMsg,
              })
            );
          });
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
          const errorMsg = adapters.parseError(error);
          dispatch(transferActions.stopTransactionApproval());
          dispatch(
            openSnackbar({
              type: "error",
              raw: error,
              parsed: errorMsg,
            })
          );
        });
    }
  };
}

function handleTransactionSuccess(dispatch: AppDispatch, accountIndex: string) {
  const route = accountIndex ? `/accounts/${accountIndex}` : "/";
  dispatch(openSnackbar({ type: "info-msg", text: "Transaction submitted" }));
  dispatch(push(route));
}

export { fetchHermezAccount, fetchAccounts, fetchFees, checkTxData, transfer };
