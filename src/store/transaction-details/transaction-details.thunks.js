import { CoordinatorAPI } from "@hermeznetwork/hermezjs";
import { HttpStatusCode } from "@hermeznetwork/hermezjs/src/http";
import { push } from "connected-react-router";

import * as transactionDetailsActionTypes from "./transaction-details.actions";
import * as storage from "../../utils/storage";

/**
 * Fetches the details of a transaction
 * @param {string} transactionIdOrHash - Transaction id or hash
 */
function fetchTransaction(transactionIdOrHash) {
  return (dispatch, getState) => {
    const {
      global: { wallet, ethereumNetworkTask, pendingDeposits },
    } = getState();
    const accountPendingDeposits = storage.getPendingDepositsByHermezAddress(
      pendingDeposits,
      ethereumNetworkTask.data.chainId,
      wallet.hermezEthereumAddress
    );
    dispatch(transactionDetailsActionTypes.loadTransaction());

    const transactionPromise = new Promise((resolve, reject) => {
      if (accountPendingDeposits !== undefined) {
        const pendingDeposit = accountPendingDeposits.find(
          (deposit) => deposit.hash === transactionIdOrHash
        );

        if (pendingDeposit !== undefined) {
          return resolve(pendingDeposit);
        }
      }

      return CoordinatorAPI.getPoolTransaction(transactionIdOrHash)
        .then(resolve)
        .catch((err) => {
          if (err.response.status === HttpStatusCode.NOT_FOUND) {
            return CoordinatorAPI.getHistoryTransaction(transactionIdOrHash)
              .then(resolve)
              .catch(reject);
          } else {
            reject(err);
          }
        });
    });

    return transactionPromise
      .then((res) => {
        if (
          res.fromBJJ !== wallet.publicKeyBase64 &&
          res.toBJJ !== wallet.publicKeyBase64 &&
          res.fromHezEthereumAddress !== wallet.hermezEthereumAddress &&
          res.toHezEthereumAddress !== wallet.hermezEthereumAddress
        ) {
          dispatch(push("/"));
        } else {
          dispatch(transactionDetailsActionTypes.loadTransactionSuccess(res));
        }
      })
      .catch(() => dispatch(transactionDetailsActionTypes.loadTransactionFailure()));
  };
}

export { fetchTransaction };
