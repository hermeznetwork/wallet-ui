import hermezjs, {
  CoordinatorAPI,
  Providers,
  Tx,
  TxUtils,
  HermezCompressedAmount,
  Addresses,
} from "@hermeznetwork/hermezjs";
import { push } from "connected-react-router";
import { ethers } from "ethers";
import HermezABI from "@hermeznetwork/hermezjs/src/abis/HermezABI";
import { TxType, TxState } from "@hermeznetwork/hermezjs/src/enums";
import { HttpStatusCode } from "@hermeznetwork/hermezjs/src/http";
import { getEthereumAddress } from "@hermeznetwork/hermezjs/src/addresses";

import * as globalActions from "src/store/global/global.actions";
import * as fiatExchangeRatesApi from "src/apis/fiat-exchange-rates";
import * as hermezWebApi from "src/apis/hermez-web";
import * as airdropApi from "src/apis/rewards";
import * as storage from "src/utils/storage";
import * as constants from "src/constants";
import {
  isTxMined,
  hasTxBeenReverted,
  isTxCanceled,
  isTxExpectedToFail,
} from "src/utils/ethereum";
import { CurrencySymbol } from "src/utils/currencies";
import { getNextForgerUrls } from "src/utils/coordinator";

import { RootState } from "src/store";
import { AppDispatch } from "src";

// domain
import { ISOStringDate } from "src/domain/";
import {
  EthereumBlock,
  EthereumTransactionReceipt,
} from "src/domain/ethereum";
import {
  L1Transaction,
  CoordinatorState,
  Withdraw,
  DelayedWithdraw,
  FiatExchangeRates,
  HermezNetworkStatus,
  Exit,
  Deposit,
  L2Transaction,
  
} from "src/domain/hermez";

/**
 * Sets the environment to use in hermezjs. If the chainId is supported will pick it up
 * a known environment and if not will use the one provided in the .env file
 */
function setHermezEnvironment(chainId: number, chainName?: string) {
  return async (dispatch: AppDispatch) => {
    dispatch(globalActions.loadEthereumNetwork());

    hermezjs.TxPool.initializeTransactionPool();

    if (
      process.env.REACT_APP_ENV === "production" &&
      hermezjs.Environment.isEnvironmentSupported(chainId)
    ) {
      hermezjs.Environment.setEnvironment(chainId);
    }

    if (process.env.REACT_APP_ENV === "development") {
      hermezjs.Environment.setEnvironment({
        baseApiUrl: process.env.REACT_APP_HERMEZ_API_URL,
        contractAddresses: {
          [hermezjs.Constants.ContractNames.Hermez]:
            process.env.REACT_APP_HERMEZ_CONTRACT_ADDRESS,
          [hermezjs.Constants.ContractNames.WithdrawalDelayer]:
            process.env.REACT_APP_WITHDRAWAL_DELAYER_CONTRACT_ADDRESS,
        },
        batchExplorerUrl: process.env.REACT_APP_BATCH_EXPLORER_URL,
        etherscanUrl: process.env.REACT_APP_ETHERSCAN_URL,
      });
    }

    dispatch(
      globalActions.loadEthereumNetworkSuccess({ chainId, name: chainName })
    );
  };
}

/**
 * Changes the route to which the user is going to be redirected to after a successful
 * login
 * @param {string} redirectRoute - Route to be redirected to
 * @returns {void}
 */
function changeRedirectRoute(redirectRoute: string) {
  return (dispatch: AppDispatch) => {
    dispatch(globalActions.changeRedirectRoute(redirectRoute));
  };
}

/**
 * Fetches the USD exchange rates for the requested currency symbols
 * @param {string[]} symbols - ISO 4217 currency codes
 * @returns {void}
 */
function fetchFiatExchangeRates() {
  return (dispatch: AppDispatch) => {
    const symbols = Object.values(CurrencySymbol)
      .filter((currency) => currency.code !== CurrencySymbol.USD.code)
      .map((currency) => currency.code);

    dispatch(globalActions.loadFiatExchangeRates());

    return fiatExchangeRatesApi
      .getFiatExchangeRates(symbols)
      .then((fiatExchangeRates: FiatExchangeRates) =>
        dispatch(globalActions.loadFiatExchangeRatesSuccess(fiatExchangeRates))
      )
      .catch(() => {
        // ToDo: How are we returning simulated Fiat exchange rates when this request fails???
        dispatch(
          globalActions.loadFiatExchangeRatesSuccess(
            fiatExchangeRatesApi.mockedFiatExchangeRates
          )
        );
      });
  };
}

/**
 * Changes the current network status of the application
 * @param {HermezNetworkStatus} newNetworkStatus - Network status
 * @param {string} backgroundColor - Background color of the snackbar
 * @returns {void}
 */
function changeNetworkStatus(
  newNetworkStatus: HermezNetworkStatus,
  backgroundColor: string
) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { networkStatus: previousNetworkStatus },
    } = getState();

    if (previousNetworkStatus === "online" && newNetworkStatus === "offline") {
      dispatch(globalActions.openSnackbar("Connection lost"));
    }

    if (previousNetworkStatus === "offline" && newNetworkStatus === "online") {
      dispatch(
        globalActions.openSnackbar("Connection restored", backgroundColor)
      );
    }

    dispatch(globalActions.changeNetworkStatus(newNetworkStatus));
  };
}

function checkHermezStatus() {
  return (dispatch: AppDispatch) => {
    dispatch(globalActions.loadHermezStatus());

    return hermezWebApi
      .getNetworkStatus()
      .then((status: number) =>
        dispatch(globalActions.loadHermezStatusSuccess(status))
      )
      .catch(() =>
        dispatch(
          globalActions.loadHermezStatusFailure(
            "An error occurred loading Hermez status"
          )
        )
      );
  };
}

/**
 * Adds a pendingWithdraw to the pendingWithdraw pool
 * @param {string} pendingWithdraw - The pendingWithdraw to add to the pool
 * @returns {void}
 */
function addPendingWithdraw(pendingWithdraw: Withdraw) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      const { hermezEthereumAddress } = wallet;
      if (chainId !== undefined) {
        storage.addItem(
          constants.PENDING_WITHDRAWS_KEY,
          chainId,
          hermezEthereumAddress,
          pendingWithdraw
        );
        dispatch(
          globalActions.addPendingWithdraw(
            chainId,
            hermezEthereumAddress,
            pendingWithdraw
          )
        );
      }
    }
  };
}

/**
 * Removes a pendingWithdraw from the pendingWithdraw pool
 * @param {string} hash - The transaction hash used to remove a pendingWithdraw from the store
 * @returns {void}
 */
function removePendingWithdraw(hash: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        const { hermezEthereumAddress } = wallet;
        storage.removeItemByCustomProp(
          constants.PENDING_WITHDRAWS_KEY,
          chainId,
          hermezEthereumAddress,
          { name: "hash", value: hash }
        );
        dispatch(
          globalActions.removePendingWithdraw(
            chainId,
            hermezEthereumAddress,
            hash
          )
        );
      }
    }
  };
}

/**
 * Adds a pendingWithdraw to the pendingDelayedWithdraw store
 * @param {DelayedWithdraw} pendingDelayedWithdraw - The pendingDelayedWithdraw to add to the store
 * @returns {void}
 */
function addPendingDelayedWithdraw(pendingDelayedWithdraw: DelayedWithdraw) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        const { hermezEthereumAddress } = wallet;
        storage.addItem(
          constants.PENDING_DELAYED_WITHDRAWS_KEY,
          chainId,
          hermezEthereumAddress,
          pendingDelayedWithdraw
        );
        dispatch(
          globalActions.addPendingDelayedWithdraw(
            chainId,
            hermezEthereumAddress,
            pendingDelayedWithdraw
          )
        );
      }
    }
  };
}

/**
 * Removes a pendingWithdraw from the pendingDelayedWithdraw store
 * @param {string} pendingDelayedWithdrawId - The pendingDelayedWithdraw identifier to remove from the store
 * @returns {void}
 */
function removePendingDelayedWithdraw(pendingDelayedWithdrawId: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        const { hermezEthereumAddress } = wallet;
        storage.removeItem(
          constants.PENDING_DELAYED_WITHDRAWS_KEY,
          chainId,
          hermezEthereumAddress,
          pendingDelayedWithdrawId
        );
        dispatch(
          globalActions.removePendingDelayedWithdraw(
            chainId,
            hermezEthereumAddress,
            pendingDelayedWithdrawId
          )
        );
      }
    }
  };
}

/**
 * Removes a pendingWithdraw from the pendingDelayedWithdraws store by hash
 * @param {string} pendingDelayedWithdrawHash - The pendingDelayedWithdraw hash to remove from the store
 * @returns {void}
 */
function removePendingDelayedWithdrawByHash(
  pendingDelayedWithdrawHash: string
) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        const { hermezEthereumAddress } = wallet;
        storage.removeItemByCustomProp(
          constants.PENDING_DELAYED_WITHDRAWS_KEY,
          chainId,
          hermezEthereumAddress,
          { name: "hash", value: pendingDelayedWithdrawHash }
        );
        dispatch(
          globalActions.removePendingDelayedWithdrawByHash(
            chainId,
            hermezEthereumAddress,
            pendingDelayedWithdrawHash
          )
        );
      }
    }
  };
}

/**
 * Updates the date in a delayed withdraw transaction
 * to the time when the transaction was mined
 * @param {String} transactionHash - The L1 transaction hash for a non-instant withdraw
 * @param {ISOStringDate} pendingDelayedWithdrawDate - The date when the L1 transaction was mined
 */
function updatePendingDelayedWithdrawDate(
  transactionHash: string,
  pendingDelayedWithdrawDate: ISOStringDate
) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        const { hermezEthereumAddress } = wallet;
        storage.updatePartialItemByCustomProp(
          constants.PENDING_DELAYED_WITHDRAWS_KEY,
          chainId,
          hermezEthereumAddress,
          { name: "hash", value: transactionHash },
          { timestamp: pendingDelayedWithdrawDate }
        );
        dispatch(
          globalActions.updatePendingDelayedWithdrawDate(
            chainId,
            hermezEthereumAddress,
            transactionHash,
            pendingDelayedWithdrawDate
          )
        );
      }
    }
  };
}

/**
 * Checks L1 transactions for pending delayed withdrawals.
 * If they have failed, clear from storage.
 * Updates the date the transaction happened if necessary.
 * @returns {void}
 */
function checkPendingDelayedWithdrawals() {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet, pendingDelayedWithdraws, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        dispatch(globalActions.checkPendingDelayedWithdrawals());
        const { hermezEthereumAddress } = wallet;
        const provider = Providers.getProvider();
        const accountEthBalance = BigInt(
          await provider.getBalance(
            Addresses.getEthereumAddress(hermezEthereumAddress)
          ).then(
            // ToDo: Why is this conversion now required? Is it safe as it's?
            // Is the Provider really an ethers.providers.Web3Provider?
            (balance: ethers.BigNumber) => balance.toString()
          )
        );
        const accountPendingDelayedWithdraws: Withdraw[] =
          storage.getItemsByHermezAddress(
            pendingDelayedWithdraws,
            chainId,
            hermezEthereumAddress
          );

        // Gets the actual transaction and checks if it doesn't exist or is expected to fail
        const pendingDelayedWithdrawsTxs: Promise<L1Transaction>[] =
          accountPendingDelayedWithdraws.map((pendingDelayedWithdraw) => {
            return provider
              .getTransaction(pendingDelayedWithdraw.hash)
              .then((tx) => {
                if (tx.blockNumber !== undefined) {
                  // Checks whether the date of pendingDelayedWithdraw needs to be updated
                  provider
                    .getBlock(tx.blockNumber)
                    .then((block: EthereumBlock) => {
                      // Converts timestamp from s to ms
                      const newTimestamp = block.timestamp * 1000;
                      if (
                        new Date(pendingDelayedWithdraw.timestamp).getTime() !==
                        newTimestamp
                      ) {
                        dispatch(
                          updatePendingDelayedWithdrawDate(
                            pendingDelayedWithdraw.hash,
                            new Date(newTimestamp).toISOString()
                          )
                        );
                      }
                    });
                }
                // Checks here to have access to pendingDelayedWithdraw.timestamp
                if (
                  isTxCanceled(tx) ||
                  isTxExpectedToFail(
                    tx,
                    pendingDelayedWithdraw.timestamp,
                    accountEthBalance
                  )
                ) {
                  dispatch(
                    removePendingDelayedWithdrawByHash(
                      pendingDelayedWithdraw.hash
                    )
                  );
                }
                return tx;
              });
          });

        Promise.all(pendingDelayedWithdrawsTxs).then((txs) => {
          const minedTxs = txs.filter(isTxMined);
          const pendingDelayedWithdrawsTxReceipts = minedTxs.map((tx) =>
            provider.getTransactionReceipt(tx.hash)
          );

          // Checks receipts to see if transactions have been reverted
          Promise.all(pendingDelayedWithdrawsTxReceipts).then((txReceipts) => {
            const revertedTxReceipts = txReceipts.filter(hasTxBeenReverted);

            revertedTxReceipts.forEach((tx) => {
              dispatch(removePendingDelayedWithdrawByHash(tx.transactionHash));
            });

            // Checks with Coordinator API if exit has been withdrawn
            const exitsApiPromises = accountPendingDelayedWithdraws.map(
              (pendingDelayedWithdraw) => {
                return CoordinatorAPI.getExit(
                  pendingDelayedWithdraw.batchNum,
                  pendingDelayedWithdraw.accountIndex
                ).then((exitTx: Exit) => {
                  // Checks here to have access to pendingDelayedWithdraw.id
                  if (exitTx.delayedWithdraw) {
                    dispatch(
                      removePendingDelayedWithdraw(pendingDelayedWithdraw.id)
                    );
                  }
                });
              }
            );

            Promise.all(exitsApiPromises).finally(() =>
              dispatch(globalActions.checkPendingDelayedWithdrawalsSuccess())
            );
          });
        });
      }
    }
  };
}

/**
 * Checks pending exits to see if they have been completed
 * and delete them from storage
 * @returns {void}
 */
function checkPendingWithdrawals() {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet, ethereumNetworkTask, pendingWithdraws },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const { hermezEthereumAddress } = wallet;
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        dispatch(globalActions.checkPendingWithdrawals());

        const provider = Providers.getProvider();
        const accountEthBalance = BigInt(
          await provider.getBalance(
            Addresses.getEthereumAddress(hermezEthereumAddress)
          ).then(
            // ToDo: Why is this conversion now required? Is it safe as it's?
            // Is the Provider really an ethers.providers.Web3Provider?
            (balance: ethers.BigNumber) => balance.toString()
          )
        );
        const accountPendingWithdraws: Withdraw[] =
          storage.getItemsByHermezAddress(
            pendingWithdraws,
            chainId,
            hermezEthereumAddress
          );

        // Gets the actual transaction and checks if it doesn't exist or is expected to fail
        const pendingWithdrawsTxs: Promise<L1Transaction>[] =
          accountPendingWithdraws.map((pendingWithdraw) => {
            return provider
              .getTransaction(pendingWithdraw.hash)
              .then((tx: L1Transaction) => {
                // Checks here to have access to pendingWithdraw.timestamp
                if (
                  isTxCanceled(tx) ||
                  isTxExpectedToFail(
                    tx,
                    pendingWithdraw.timestamp,
                    accountEthBalance
                  )
                ) {
                  dispatch(removePendingWithdraw(pendingWithdraw.hash));
                }
                return tx;
              });
          });

        Promise.all(pendingWithdrawsTxs).then((txs) => {
          const minedTxs = txs.filter(isTxMined);
          const pendingWithdrawsTxReceipts: Promise<EthereumTransactionReceipt>[] =
            minedTxs.map((tx) => provider.getTransactionReceipt(tx.hash));

          // Checks receipts to see if transactions have been reverted
          Promise.all(pendingWithdrawsTxReceipts).then((txReceipts) => {
            const revertedTxReceipts = txReceipts.filter(hasTxBeenReverted);

            revertedTxReceipts.forEach((tx) => {
              dispatch(removePendingWithdraw(tx.transactionHash));
            });

            // Checks with Coordinator API if exit has been withdrawn
            const exitsApiPromises = accountPendingWithdraws.map(
              (pendingWithdraw) => {
                return CoordinatorAPI.getExit(
                  pendingWithdraw.batchNum,
                  pendingWithdraw.accountIndex
                ).then((exitTx: Exit) => {
                  // Checks here to have access to pendingWithdraw.hash
                  if (exitTx.instantWithdraw || exitTx.delayedWithdraw) {
                    dispatch(removePendingWithdraw(pendingWithdraw.hash));
                    dispatch(removePendingDelayedWithdraw(pendingWithdraw.id));
                  }
                });
              }
            );

            Promise.all(exitsApiPromises).finally(() =>
              dispatch(globalActions.checkPendingWithdrawalsSuccess())
            );
          });
        });
      }
    }
  };
}

/**
 * Adds a pendingDeposit to the pendingDeposits store
 * @param {Deposit} pendingDeposit - The pendingDeposit to add to the store
 * @returns {void}
 */
function addPendingDeposit(pendingDeposit: Deposit) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const { hermezEthereumAddress } = wallet;
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        storage.addItem(
          constants.PENDING_DEPOSITS_KEY,
          chainId,
          hermezEthereumAddress,
          pendingDeposit
        );
        dispatch(
          globalActions.addPendingDeposit(
            chainId,
            hermezEthereumAddress,
            pendingDeposit
          )
        );
      }
    }
  };
}

/**
 * Removes a pendingDeposit from the pendingDeposit store by id
 * @param {string} transactionId - The transaction identifier used to remove a pendingDeposit from the store
 * @returns {void}
 */
function removePendingDepositByTransactionId(transactionId: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const { hermezEthereumAddress } = wallet;
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        storage.removeItem(
          constants.PENDING_DEPOSITS_KEY,
          chainId,
          hermezEthereumAddress,
          transactionId
        );
        dispatch(
          globalActions.removePendingDepositByTransactionId(
            chainId,
            hermezEthereumAddress,
            transactionId
          )
        );
      }
    }
  };
}

/**
 * Removes a pendingDeposit from the pendingDeposit store by hash
 * @param {string} hash - The transaction hash used to remove a pendingDeposit from the store
 * @returns {void}
 */
function removePendingDepositByHash(hash: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const { hermezEthereumAddress } = wallet;
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        storage.removeItemByCustomProp(
          constants.PENDING_DEPOSITS_KEY,
          chainId,
          hermezEthereumAddress,
          { name: "hash", value: hash }
        );
        dispatch(
          globalActions.removePendingDepositByHash(
            chainId,
            hermezEthereumAddress,
            hash
          )
        );
      }
    }
  };
}

function updatePendingDepositId(
  transactionHash: string,
  transactionId: string
) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const { hermezEthereumAddress } = wallet;
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        storage.updatePartialItemByCustomProp(
          constants.PENDING_DEPOSITS_KEY,
          chainId,
          hermezEthereumAddress,
          { name: "hash", value: transactionHash },
          { id: transactionId }
        );
        dispatch(
          globalActions.updatePendingDepositId(
            chainId,
            hermezEthereumAddress,
            transactionHash,
            transactionId
          )
        );
      }
    }
  };
}

function checkPendingDeposits() {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet, pendingDeposits, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const { hermezEthereumAddress } = wallet;
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        dispatch(globalActions.checkPendingDeposits());

        const provider = Providers.getProvider();
        const accountEthBalance = BigInt(
          await provider.getBalance(
            Addresses.getEthereumAddress(hermezEthereumAddress)
          ).then(
            // ToDo: Why is this conversion now required? Is it safe as it's?
            // Is the Provider really an ethers.providers.Web3Provider?
            (balance: ethers.BigNumber) => balance.toString()
          )
          );
        const accountPendingDeposits: Deposit[] =
          storage.getItemsByHermezAddress(
            pendingDeposits,
            chainId,
            hermezEthereumAddress
          );
        const pendingDepositsTxs: Promise<L1Transaction>[] =
          accountPendingDeposits.map((pendingDeposit) => {
            return provider
              .getTransaction(pendingDeposit.hash)
              .then((tx: L1Transaction) => {
                if (
                  isTxCanceled(tx) ||
                  isTxExpectedToFail(
                    tx,
                    pendingDeposit.timestamp,
                    accountEthBalance
                  )
                ) {
                  dispatch(removePendingDepositByHash(pendingDeposit.hash));
                }

                return tx;
              });
          });

        Promise.all(pendingDepositsTxs).then((txs) => {
          const minedTxs = txs.filter(
            (tx) => tx !== null && tx.blockNumber !== null
          );
          const pendingDepositsTxReceipts = minedTxs.map((tx) =>
            provider.getTransactionReceipt(tx.hash)
          );

          Promise.all(pendingDepositsTxReceipts).then((txReceipts) => {
            const hermezContractInterface = new ethers.utils.Interface(
              HermezABI
            );
            const revertedTxReceipts = txReceipts.filter(hasTxBeenReverted);
            const successfulTxReceipts = txReceipts.filter(
              (txReceipt) =>
                txReceipt.status === 1 &&
                txReceipt.logs &&
                txReceipt.logs.length > 0
            );
            const transactionHistoryPromises = successfulTxReceipts.reduce((accL2Transactions: Promise<L2Transaction>[], txReceipt) => {
              // Need to parse logs, but only events from the Hermez SC. Ignore errors when trying to parse others
              const parsedLogs = [];
              for (const txReceiptLog of txReceipt.logs) {
                try {
                  const parsedLog =
                    hermezContractInterface.parseLog(txReceiptLog);
                  parsedLogs.push(parsedLog);
                } catch (e) {}
              }
              const l1UserTxEvent = parsedLogs.find(
                (event) => event.name === "L1UserTxEvent"
              );

              if (!l1UserTxEvent) {
                return accL2Transactions;
              }

              const txId = TxUtils.getL1UserTxId(
                l1UserTxEvent.args[0],
                l1UserTxEvent.args[1]
              );
              const pendingDeposit = accountPendingDeposits.find(
                (deposit) => deposit.hash === txReceipt.transactionHash
              );

              if (pendingDeposit && !pendingDeposit.transactionId) {
                dispatch(
                  updatePendingDepositId(txReceipt.transactionHash, txId)
                );
              }

              return [...accL2Transactions, CoordinatorAPI.getHistoryTransaction(txId)];
            },
            []
            );

            revertedTxReceipts.forEach((tx) => {
              dispatch(removePendingDepositByHash(tx.transactionHash));
            });

            Promise.all(transactionHistoryPromises)
              .then((results) => {
                results
                  .filter((result) => result !== undefined)
                  .forEach((transaction) => {
                    if (transaction.batchNum !== null) {
                      dispatch(
                        removePendingDepositByTransactionId(transaction.id)
                      );
                    }
                  });
                dispatch(globalActions.checkPendingDepositsSuccess());
              })
              .catch(() =>
                dispatch(globalActions.checkPendingDepositsSuccess())
              );
          });
        });
      }
    }
  };
}

function checkPendingTransactions() {
  return (_: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet, coordinatorStateTask },
    } = getState();

    if (wallet !== undefined && coordinatorStateTask.status === "successful") {
      const nextForgerUrls = getNextForgerUrls(coordinatorStateTask.data);

      hermezjs.TxPool.getPoolTransactions(
        undefined,
        wallet.publicKeyCompressedHex
      ).then((poolTransactions: L2Transaction[]) => {
        const tenMinutesInMs = 10 * 60 * 1000;
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const resendTransactionsRequests = poolTransactions
          .filter((transaction) => {
            const txTimestampInMs = new Date(transaction.timestamp).getTime();
            const nowInMs = new Date().getTime();

            // Retry the transaction if it hasn't been forged after 10min and it's not 24h old yet+
            return (
              transaction.state !== TxState.Forged &&
              txTimestampInMs + tenMinutesInMs < nowInMs &&
              txTimestampInMs + oneDayInMs > nowInMs
            );
          })
          .map((transaction) => {
            const txData = {
              type: transaction.type,
              from: transaction.fromAccountIndex,
              amount: HermezCompressedAmount.compressAmount(transaction.amount),
              ...(transaction.type === TxType.TransferToEthAddr
                ? { to: transaction.toHezEthereumAddress }
                : transaction.type === TxType.Transfer
                ? { to: transaction.toAccountIndex }
                : {}),
              fee: transaction.fee,
            };

            return Tx.generateAndSendL2Tx(
              txData,
              wallet,
              transaction.token,
              nextForgerUrls,
              false
            ).catch(() => {});
          });

        Promise.all(resendTransactionsRequests);
      });
    }
  };
}

/**
 * Fetches the state of the coordinator
 * @returns {void}
 */
function fetchCoordinatorState() {
  return (dispatch: AppDispatch) => {
    dispatch(globalActions.loadCoordinatorState());

    return hermezjs.CoordinatorAPI.getState()
      .then((coordinatorState: CoordinatorState) =>
        dispatch(globalActions.loadCoordinatorStateSuccess(coordinatorState))
      )
      .catch((err: Error) =>
        dispatch(globalActions.loadCoordinatorStateFailure(err))
      );
  };
}

/**
 * Removes the MetaMask wallet data from the Redux store and the localStorage
 * @returns {void}
 */
function disconnectWallet() {
  return (dispatch: AppDispatch) => {
    // const provider = Providers.getProvider();

    // ToDo: This does not seem to exist in the ethers.providers.Web3Provider
    //       Is the type wrong or the implementation outdated?

    // if (provider.provider?.connector) {
    //   // Kills the stored Web Connect session to show QR with next login
    //   provider.provider.connector.killSession();
    // }

    dispatch(globalActions.unloadWallet());
    dispatch(push("/login"));
    if (process.env.REACT_APP_ENABLE_AIRDROP === "true") {
      dispatch(globalActions.closeRewardsSidenav());
    }
  };
}

/**
 * Reloads the webapp
 * @returns {void}
 */
function reloadApp() {
  return () => {
    window.location.reload();
  };
}

/**
 * Fetches Airdrop estimated reward for a given ethAddr
 * @returns {void}
 */
function fetchReward() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(globalActions.loadReward());

    return airdropApi
      .getReward()
      .then((res: unknown) => dispatch(globalActions.loadRewardSuccess(res)))
      .catch(() =>
        dispatch(
          globalActions.loadRewardFailure(
            "An error occurred loading estimated reward."
          )
        )
      );
  };
}

/**
 * Fetches Airdrop earned reward for a given ethAddr
 * @returns {void}
 */
function fetchEarnedReward() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet },
    } = getState();
    if (wallet !== undefined) {
      const { hermezEthereumAddress } = wallet;
      dispatch(globalActions.loadEarnedReward());

      return airdropApi
        .getAccumulatedEarnedReward(getEthereumAddress(hermezEthereumAddress))
        .then((res) => dispatch(globalActions.loadEarnedRewardSuccess(res)))
        .catch((err) => {
          if (err.response?.status === HttpStatusCode.NOT_FOUND) {
            dispatch(globalActions.loadEarnedRewardSuccess(0));
          } else {
            dispatch(
              globalActions.loadEarnedRewardFailure(
                "An error occurred loading estimated reward."
              )
            );
          }
        });
    }
  };
}

/**
 * Fetches Airdrop reward percentage
 * @returns {void}
 */
function fetchRewardPercentage() {
  return (dispatch: AppDispatch) => {
    dispatch(globalActions.loadRewardPercentage());

    return airdropApi
      .getRewardPercentage()
      .then((res) => dispatch(globalActions.loadRewardPercentageSuccess(res)))
      .catch(() =>
        dispatch(
          globalActions.loadRewardPercentageFailure(
            "An error occurred loading reward percentage."
          )
        )
      );
  };
}

/**
 * Checks if an account is eligible for the Airdrop
 * @returns {void}
 */
function fetchRewardAccountEligibility() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      global: { wallet },
    } = getState();
    if (wallet !== undefined) {
      const { hermezEthereumAddress } = wallet;
      dispatch(globalActions.loadRewardAccountEligibility());

      return airdropApi
        .getAccountEligibility(getEthereumAddress(hermezEthereumAddress))
        .then((res) =>
          dispatch(globalActions.loadRewardAccountEligibilitySuccess(res))
        )
        .catch((err) => {
          if (err.response?.status === HttpStatusCode.NOT_FOUND) {
            dispatch(globalActions.loadRewardAccountEligibilitySuccess(false));
          } else {
            dispatch(
              globalActions.loadRewardAccountEligibilityFailure(
                "An error occurred loading account eligibility."
              )
            );
          }
        });
    }
  };
}

/**
 * Fetches details for the token used for the rewards
 * @param {Number} tokenId - A token ID
 * @returns {Object} Response data with a specific token
 */
function fetchRewardToken() {
  return (dispatch: AppDispatch) => {
    dispatch(globalActions.loadRewardToken());

    return CoordinatorAPI.getToken(constants.HEZ_TOKEN_ID)
      .then((res: unknown) =>
        dispatch(globalActions.loadRewardTokenSuccess(res))
      )
      .catch(() =>
        globalActions.loadRewardTokenFailure("An error occured loading token.")
      );
  };
}

export {
  setHermezEnvironment,
  changeRedirectRoute,
  fetchFiatExchangeRates,
  changeNetworkStatus,
  checkHermezStatus,
  addPendingWithdraw,
  removePendingWithdraw,
  addPendingDelayedWithdraw,
  removePendingDelayedWithdraw,
  updatePendingDelayedWithdrawDate,
  checkPendingDelayedWithdrawals,
  checkPendingWithdrawals,
  addPendingDeposit,
  removePendingDepositByTransactionId,
  removePendingDepositByHash,
  updatePendingDepositId,
  checkPendingDeposits,
  checkPendingTransactions,
  fetchCoordinatorState,
  disconnectWallet,
  reloadApp,
  fetchReward,
  fetchEarnedReward,
  fetchRewardPercentage,
  fetchRewardAccountEligibility,
  fetchRewardToken,
};
