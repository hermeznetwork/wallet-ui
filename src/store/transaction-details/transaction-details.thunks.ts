import { CoordinatorAPI } from "@hermeznetwork/hermezjs";
import { HttpStatusCode } from "@hermeznetwork/hermezjs/src/http";
import { push } from "connected-react-router";

import { AppState, AppDispatch, AppThunk } from "src/store";
import * as transactionDetailsActionTypes from "./transaction-details.actions";
import * as storage from "../../utils/storage";
// domain
import { PendingDeposit, HistoryTransaction, PoolTransaction } from "src/domain/hermez";
import { AxiosError } from "axios";

/**
 * Fetches the details of a transaction
 * @param {string} transactionIdOrHash - HistoryTransaction id or hash
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

          CoordinatorAPI.getPoolTransaction(transactionIdOrHash)
            .then(resolve)
            .catch((err: AxiosError) => {
              if (err.response?.status === HttpStatusCode.NOT_FOUND) {
                CoordinatorAPI.getHistoryTransaction(transactionIdOrHash)
                  .then(resolve)
                  .catch(reject);
              } else {
                reject(err);
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
        .catch(() => dispatch(transactionDetailsActionTypes.loadTransactionFailure()));
    }
  };
}

export { fetchTransaction };
