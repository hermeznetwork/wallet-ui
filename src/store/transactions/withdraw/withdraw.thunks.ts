import { push } from "connected-react-router";
import { BigNumber } from "ethers";
import { CoordinatorAPI, Tx, TxFees } from "@hermeznetwork/hermezjs";
import { getPoolTransactions } from "@hermeznetwork/hermezjs/src/tx-pool";
import { getProvider } from "@hermeznetwork/hermezjs/src/providers";
import { formatEther } from "@ethersproject/units";

import { AppState, AppDispatch, AppThunk } from "src/store";
import * as withdrawActions from "src/store/transactions/withdraw/withdraw.actions";
import * as globalThunks from "src/store/global/global.thunks";
import { openSnackbar } from "src/store/global/global.actions";
import theme from "src/styles/theme";
// domain
import {
  Account,
  Exit,
  FiatExchangeRates,
  PendingDelayedWithdraw,
  PoolTransaction,
  Token,
} from "src/domain/hermez";
import { mergeDelayedWithdraws } from "src/utils/transactions";
import { ETHER_TOKEN_ID, WITHDRAWAL_ZKEY_URL, WITHDRAWAL_WASM_URL } from "src/constants";
import { createAccount } from "src/utils/accounts";

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
      .then((res) => dispatch(withdrawActions.loadAccountSuccess(res)))
      .catch((error: Error) => dispatch(withdrawActions.loadAccountFailure(error.message)));
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
      CoordinatorAPI.getExit(batchNum, accountIndex)
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
                withdrawActions.loadExitFailure(
                  new Error("Couldn't find the pending delayed withdraw")
                )
              );
            }
          } else {
            dispatch(withdrawActions.loadExitSuccess(exit));
          }
        })
        .catch((err) => dispatch(withdrawActions.loadExitFailure(err)));
    }
  };
}

/**
 * Fetches the transactions which are in the transactions pool
 */
function fetchPoolTransactions(): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    dispatch(withdrawActions.loadPoolTransactions());

    const {
      global: { wallet },
    } = getState();

    if (wallet !== undefined) {
      getPoolTransactions(undefined, wallet.publicKeyCompressedHex)
        .then((transactions) => dispatch(withdrawActions.loadPoolTransactionsSuccess(transactions)))
        .catch((err) => dispatch(withdrawActions.loadPoolTransactionsFailure(err)));
    }
  };
}

/**
 * Fetches the estimated L1 fee for the withdraw
 */
function fetchEstimatedWithdrawFee(token: Token, amount: BigNumber) {
  return async (dispatch: AppDispatch, getState: () => AppState): Promise<void> => {
    dispatch(withdrawActions.loadEstimatedWithdrawFee());

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

      if (tokensPriceTask.status === "successful" || tokensPriceTask.status === "reloading") {
        const tokenUSD = tokensPriceTask.data[ETHER_TOKEN_ID].USD;
        const feeUSD = Number(formatEther(feeBigNumber)) * tokenUSD;

        dispatch(
          withdrawActions.loadEstimatedWithdrawFeeSuccess({
            amount: feeBigNumber,
            USD: feeUSD,
          })
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        dispatch(withdrawActions.loadEstimatedWithdrawFeeFailure(err));
      } else {
        dispatch(withdrawActions.loadEstimatedWithdrawFeeFailure(new Error("Unexpected error")));
      }
    }
  };
}

/**
 * Executes the withdraw operation
 */
function withdraw(
  amount: BigNumber,
  account: Account,
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
        Tx.withdrawCircuit(
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
                  hash: txData.hash,
                  hermezEthereumAddress: wallet.hermezEthereumAddress,
                  id: withdrawalId,
                  accountIndex: account.accountIndex,
                  batchNum: exit.batchNum,
                  amount: amount.toString(),
                  token: account.token,
                  timestamp: new Date().toISOString(),
                })
              );
            } else {
              dispatch(
                globalThunks.addPendingDelayedWithdraw({
                  hash: txData.hash,
                  hermezEthereumAddress: wallet.hermezEthereumAddress,
                  id: withdrawalId,
                  accountIndex: account.accountIndex,
                  batchNum: exit.batchNum,
                  merkleProof: exit.merkleProof,
                  instant: false,
                  amount: amount.toString(),
                  token: account.token,
                  timestamp: new Date().toISOString(),
                })
              );
            }
            handleTransactionSuccess(dispatch, account.accountIndex);
          })
          .catch((error) => {
            console.error(error);
            dispatch(withdrawActions.stopTransactionApproval());
            handleTransactionFailure(dispatch, error);
          });
      } else {
        Tx.delayedWithdraw(wallet.hermezEthereumAddress, account.token, signer)
          .then((txData) => {
            dispatch(
              globalThunks.addPendingWithdraw({
                hash: txData.hash,
                hermezEthereumAddress: wallet.hermezEthereumAddress,
                id: withdrawalId,
                accountIndex: account.accountIndex,
                batchNum: exit.batchNum,
                amount: amount.toString(),
                token: account.token,
                timestamp: new Date().toISOString(),
              })
            );
            handleTransactionSuccess(dispatch, account.accountIndex);
          })
          .catch((error) => {
            console.error(error);
            dispatch(withdrawActions.stopTransactionApproval());
            handleTransactionFailure(dispatch, error);
          });
      }
    }
  };
}

function handleTransactionSuccess(dispatch: AppDispatch, accountIndex: string) {
  dispatch(openSnackbar("Transaction submitted"));
  dispatch(push(`/accounts/${accountIndex}`));
}

function handleTransactionFailure(dispatch: AppDispatch, error: Error | string) {
  const errorMsg = error instanceof Error ? error.message : error;
  dispatch(openSnackbar(`Transaction failed - ${errorMsg}`, theme.palette.red.main));
}

export {
  fetchHermezAccount,
  fetchExit,
  fetchPoolTransactions,
  fetchEstimatedWithdrawFee,
  withdraw,
};
