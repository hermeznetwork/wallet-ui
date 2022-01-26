import { push } from "connected-react-router";
import { BigNumber } from "ethers";

import { AppState, AppDispatch, AppThunk } from "src/store";
import * as withdrawActions from "src/store/transactions/withdraw/withdraw.actions";
import * as globalThunks from "src/store/global/global.thunks";
import { openSnackbar } from "src/store/global/global.actions";
import { mergeDelayedWithdraws } from "src/utils/transactions";
import { WITHDRAWAL_ZKEY_URL, WITHDRAWAL_WASM_URL } from "src/constants";
// domain
import {
  Exit,
  FiatExchangeRates,
  HermezAccount,
  PendingDelayedWithdraw,
  PoolTransaction,
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

    dispatch(withdrawActions.loadAccount());

    return adapters.hermezApi
      .getHermezAccount(
        accountIndex,
        tokensPriceTask,
        preferredCurrency,
        fiatExchangeRates,
        poolTransactions
      )
      .then((res) => dispatch(withdrawActions.loadAccountSuccess(res)))
      .catch((error: unknown) => {
        const errorMsg = adapters.parseError(error);
        dispatch(withdrawActions.loadAccountFailure(errorMsg));
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
 * Fetches the details of an exit
 */
function fetchExit(
  accountIndex: string,
  batchNum: number,
  completeDelayedWithdrawal: boolean,
  pendingDelayedWithdraws: PendingDelayedWithdraw[]
) {
  return (dispatch: AppDispatch, getState: () => AppState): void => {
    const {
      global: { wallet },
    } = getState();

    dispatch(withdrawActions.loadExit());

    if (wallet) {
      adapters.hermezApi
        .getExit(batchNum, accountIndex)
        .then((exit: Exit) => {
          // If we are completing a delayed withdrawal, we need to merge all delayed withdrawals
          // of the same token to show the correct amount in Transaction Overview
          if (completeDelayedWithdrawal) {
            const pendingDelayedWithdrawsWithToken = pendingDelayedWithdraws.filter(
              (pendingDelayedWithdraw) => pendingDelayedWithdraw.token.id === exit.token.id
            );
            const mergedPendingDelayedWithdraws = mergeDelayedWithdraws(
              pendingDelayedWithdrawsWithToken
            );

            if (mergedPendingDelayedWithdraws.length > 0) {
              dispatch(withdrawActions.loadExitSuccess(mergedPendingDelayedWithdraws[0]));
            } else {
              dispatch(
                withdrawActions.loadExitFailure("Couldn't find the pending delayed withdraw")
              );
            }
          } else {
            dispatch(withdrawActions.loadExitSuccess(exit));
          }
        })
        .catch((error: unknown) => {
          const errorMsg = adapters.parseError(error);
          dispatch(withdrawActions.loadExitFailure(errorMsg));
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
 * Executes the withdraw operation
 */
function withdraw(
  amount: BigNumber,
  account: HermezAccount,
  exit: Exit,
  completeDelayedWithdrawal: boolean,
  instantWithdrawal: boolean
) {
  return (dispatch: AppDispatch, getState: () => AppState): void => {
    const {
      global: { wallet, signer },
    } = getState();
    const withdrawalId = `${account.accountIndex}${exit.batchNum}`;

    dispatch(withdrawActions.startTransactionApproval());

    if (wallet && signer) {
      if (!completeDelayedWithdrawal) {
        adapters.hermezApi
          .withdrawCircuit(
            exit,
            instantWithdrawal,
            WITHDRAWAL_WASM_URL,
            WITHDRAWAL_ZKEY_URL,
            signer
          )
          .then((txData) => {
            if (instantWithdrawal) {
              dispatch(
                globalThunks.addPendingWithdraw({
                  ...exit,
                  hash: txData.hash,
                  id: withdrawalId,
                  hermezEthereumAddress: wallet.hermezEthereumAddress,
                  timestamp: new Date().toISOString(),
                })
              );
            } else {
              dispatch(
                globalThunks.addPendingDelayedWithdraw({
                  ...exit,
                  hash: txData.hash,
                  id: withdrawalId,
                  hermezEthereumAddress: wallet.hermezEthereumAddress,
                  isInstant: false,
                  timestamp: new Date().toISOString(),
                })
              );
            }
            handleTransactionSuccess(dispatch, account.accountIndex);
          })
          .catch((error: unknown) => {
            handleTransactionFailure(dispatch, error);
          });
      } else {
        adapters.hermezApi
          .delayedWithdraw(wallet.hermezEthereumAddress, account.token, signer)
          .then((txData) => {
            dispatch(
              globalThunks.addPendingWithdraw({
                ...exit,
                hash: txData.hash,
                hermezEthereumAddress: wallet.hermezEthereumAddress,
                id: withdrawalId,
                accountIndex: account.accountIndex,
                batchNum: exit.batchNum,
                balance: amount.toString(),
                token: account.token,
                timestamp: new Date().toISOString(),
              })
            );
            handleTransactionSuccess(dispatch, account.accountIndex);
          })
          .catch((error: unknown) => {
            handleTransactionFailure(dispatch, error);
          });
      }
    }
  };
}

function handleTransactionSuccess(dispatch: AppDispatch, accountIndex: string) {
  dispatch(openSnackbar({ type: "info-msg", text: "Transaction submitted" }));
  dispatch(push(`/accounts/${accountIndex}`));
}

function handleTransactionFailure(dispatch: AppDispatch, error: unknown) {
  dispatch(withdrawActions.stopTransactionApproval());
  if (adapters.isMetamaskUserRejectedRequestError(error) === false) {
    const withdrawAlreadyDoneErrorCode = "WITHDRAW_ALREADY_DONE";
    const errorMsg = adapters.parseError(error);
    dispatch(
      openSnackbar(
        errorMsg.includes(withdrawAlreadyDoneErrorCode)
          ? {
              type: "info-msg",
              text: "The withdraw has already been done",
            }
          : {
              type: "error",
              raw: error,
              parsed: errorMsg,
            }
      )
    );
  }
}

export { fetchHermezAccount, fetchExit, withdraw };
