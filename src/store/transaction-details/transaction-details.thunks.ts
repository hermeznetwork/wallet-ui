import { HttpStatusCode } from "@hermeznetwork/hermezjs/src/http";
import { push } from "connected-react-router";

import { AppState, AppDispatch, AppThunk } from "src/store";
import { processError } from "src/store/global/global.thunks";
import * as transactionDetailsActionTypes from "src/store/transaction-details/transaction-details.actions";
import * as storage from "src/utils/storage";
// domain
import { PendingDeposit, HistoryTransaction, PoolTransaction } from "src/domain";
import { AxiosError } from "axios";
// adapters
import * as adapters from "src/adapters";

/**
 * Fetches the details of a transaction
 */
function fetchTransaction(transactionIdOrHash: string): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, ethereumNetworkTask, pendingDeposits },
    } = getState();

    if (
      wallet !== undefined &&
      (ethereumNetworkTask.status === "successful" || ethereumNetworkTask.status === "reloading")
    ) {
      const accountPendingDeposits = storage.getPendingDepositsByHermezAddress(
        pendingDeposits,
        ethereumNetworkTask.data.chainId,
        wallet.hermezEthereumAddress
      );
      dispatch(transactionDetailsActionTypes.loadTransaction());

      const transactionPromise: Promise<PendingDeposit | HistoryTransaction | PoolTransaction> =
        new Promise((resolve, reject) => {
          if (accountPendingDeposits !== undefined) {
            const pendingDeposit = accountPendingDeposits.find(
              (deposit) => deposit.hash === transactionIdOrHash
            );
            if (pendingDeposit !== undefined) {
              resolve(pendingDeposit);
            }
          }

          adapters.hermezApi
            .getPoolTransaction(transactionIdOrHash)
            .then(resolve)
            .catch((error: AxiosError) => {
              if (error.response?.status === HttpStatusCode.NOT_FOUND) {
                adapters.hermezApi
                  .getHistoryTransaction(transactionIdOrHash)
                  .then(resolve)
                  .catch(reject);
              } else {
                reject(error);
              }
            });
        });

      return transactionPromise
        .then((res: PendingDeposit | HistoryTransaction | PoolTransaction) => {
          const txContainsBJJUserAddress =
            "fromBJJ" in res &&
            (res.fromBJJ === wallet.publicKeyBase64 || res.toBJJ === wallet.publicKeyBase64);
          const txContainsHezEthereumAddressUserValue =
            res.fromHezEthereumAddress === wallet.hermezEthereumAddress ||
            res.toHezEthereumAddress === wallet.hermezEthereumAddress;

          if (txContainsBJJUserAddress || txContainsHezEthereumAddressUserValue) {
            dispatch(transactionDetailsActionTypes.loadTransactionSuccess(res));
          } else {
            dispatch(push("/"));
          }
        })
        .catch((error: unknown) => {
          dispatch(processError(error, transactionDetailsActionTypes.loadTransactionFailure));
        });
    }
  };
}

export { fetchTransaction };
