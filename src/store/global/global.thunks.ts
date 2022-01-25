import { push } from "connected-react-router";
import { ethers } from "ethers";
import { Block, TransactionReceipt, TransactionResponse } from "@ethersproject/providers";
import Connector from "@walletconnect/web3-provider";
import hermezjs, {
  Providers,
  TxUtils,
  HermezCompressedAmount,
  Addresses,
} from "@hermeznetwork/hermezjs";
import HermezABI from "@hermeznetwork/hermezjs/src/abis/HermezABI";
import { TxType, TxState } from "@hermeznetwork/hermezjs/src/enums";

import { REPORT_ERROR_FORM_URL, REPORT_ERROR_FORM_ENTRIES } from "src/constants";
import { AppState, AppDispatch, AppThunk } from "src/store";
import * as globalActions from "src/store/global/global.actions";
import { openSnackbar } from "src/store/global/global.actions";
import * as storage from "src/utils/storage";
import { CurrencySymbol } from "src/utils/currencies";
import { getNextForgerUrls } from "src/utils/coordinator";
import { isAsyncTaskDataAvailable } from "src/utils/types";
// domain
import {
  CoordinatorState,
  Env,
  Exit,
  Exits,
  FiatExchangeRates,
  NetworkStatus,
  HistoryTransaction,
  ISOStringDate,
  PendingDelayedWithdraw,
  PendingDeposit,
  PendingWithdraw,
  PoolTransaction,
  PoolTransactions,
  TimerWithdraw,
  Token,
} from "src/domain";
// adapters
import * as adapters from "src/adapters";

/**
 * Sets the environment to use in hermezjs. If the chainId is supported will pick it up
 * a known environment and if not will use the one provided in the .env file
 */
function setHermezEnvironment(chainId: number, chainName: string): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { env },
    } = getState();

    if (env) {
      dispatch(globalActions.loadEthereumNetwork());

      if (
        env.REACT_APP_ENV === "production" &&
        hermezjs.Environment.isEnvironmentSupported(chainId)
      ) {
        hermezjs.Environment.setEnvironment(chainId);
      }

      if (env.REACT_APP_ENV === "development") {
        hermezjs.Environment.setEnvironment({
          baseApiUrl: env.REACT_APP_HERMEZ_API_URL,
          contractAddresses: {
            [hermezjs.Constants.ContractNames.Hermez]: env.REACT_APP_HERMEZ_CONTRACT_ADDRESS,
            [hermezjs.Constants.ContractNames.WithdrawalDelayer]:
              env.REACT_APP_WITHDRAWAL_DELAYER_CONTRACT_ADDRESS,
          },
          batchExplorerUrl: env.REACT_APP_BATCH_EXPLORER_URL,
          etherscanUrl: env.REACT_APP_ETHERSCAN_URL,
        });
      }

      dispatch(globalActions.loadEthereumNetworkSuccess({ chainId, name: chainName }));
    }
  };
}

/**
 * Changes the route to which the user is going to be redirected to after a successful
 * login
 */
function changeRedirectRoute(redirectRoute: string): AppThunk {
  return (dispatch: AppDispatch) => {
    dispatch(globalActions.changeRedirectRoute(redirectRoute));
  };
}

/**
 * Fetches the USD exchange rates for the requested currency symbols
 */
function fetchFiatExchangeRates(env: Env): AppThunk {
  return (dispatch: AppDispatch) => {
    const symbols = Object.values(CurrencySymbol)
      .filter((currency) => currency.code !== CurrencySymbol.USD.code)
      .map((currency) => currency.code);

    dispatch(globalActions.loadFiatExchangeRates());

    return adapters.priceUpdater
      .getFiatExchangeRates(symbols, env)
      .then((fiatExchangeRates: FiatExchangeRates) =>
        dispatch(globalActions.loadFiatExchangeRatesSuccess(fiatExchangeRates))
      )
      .catch((error: unknown) => {
        const errorMsg = adapters.parseError(error);
        dispatch(globalActions.loadFiatExchangeRatesFailure(errorMsg));
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
 * Changes the current network status of the application
 */
function changeNetworkStatus(newNetworkStatus: NetworkStatus): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { networkStatus: previousNetworkStatus },
    } = getState();

    if (previousNetworkStatus === "online" && newNetworkStatus === "offline") {
      dispatch(
        globalActions.openSnackbar({
          type: "error-msg",
          text: "Connection lost",
        })
      );
    }

    if (previousNetworkStatus === "offline" && newNetworkStatus === "online") {
      dispatch(
        globalActions.openSnackbar({
          type: "success-msg",
          text: "Connection restored",
        })
      );
    }

    dispatch(globalActions.changeNetworkStatus(newNetworkStatus));
  };
}

function loadEnv(): AppThunk {
  return (dispatch: AppDispatch) => {
    dispatch(globalActions.loadEnv());

    const env = adapters.env.getEnv();
    if (env.success) {
      dispatch(globalActions.loadEnvSuccess(env.data));
    } else {
      const errorMsg = adapters.parseError(env.error);
      dispatch(globalActions.loadEnvFailure(errorMsg));
      dispatch(
        openSnackbar({
          type: "error",
          raw: env.error,
          parsed: errorMsg,
        })
      );
    }
  };
}

function checkHermezStatus(): AppThunk {
  return (dispatch: AppDispatch) => {
    dispatch(globalActions.loadHermezStatus());

    return adapters.hermezWeb
      .getNetworkStatus()
      .then((status: number) => dispatch(globalActions.loadHermezStatusSuccess(status)))
      .catch(() =>
        dispatch(
          globalActions.loadHermezStatusFailure("An error occurred loading Polygon Hermez status")
        )
      );
  };
}

/**
 * Fetches the transactions which are in the transactions pool
 */
function fetchPoolTransactions(): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const limit = 2049;

    dispatch(globalActions.loadPoolTransactions());

    const {
      global: { wallet },
    } = getState();

    if (wallet !== undefined) {
      adapters.hermezApi
        .getPoolTransactions(wallet.hermezEthereumAddress, "DESC", limit)
        .then((poolTransactions) =>
          dispatch(globalActions.loadPoolTransactionsSuccess(poolTransactions.transactions))
        )
        .catch((error: unknown) => {
          const errorMsg = adapters.parseError(error);
          dispatch(globalActions.loadPoolTransactionsFailure(errorMsg));
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
 * Adds a pendingWithdraw to the pendingWithdraw pool
 */
function addPendingWithdraw(pendingWithdraw: PendingWithdraw): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      const { hermezEthereumAddress } = wallet;
      if (chainId !== undefined) {
        adapters.localStorage.addPendingWithdraw(chainId, hermezEthereumAddress, pendingWithdraw);
        dispatch(globalActions.addPendingWithdraw(chainId, hermezEthereumAddress, pendingWithdraw));
      }
    }
  };
}

/**
 * Removes a pendingWithdraw from the pendingWithdraw pool
 */
function removePendingWithdraw(hash: string): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        const { hermezEthereumAddress } = wallet;
        adapters.localStorage.removePendingWithdrawByHash(chainId, hermezEthereumAddress, hash);
        dispatch(globalActions.removePendingWithdraw(chainId, hermezEthereumAddress, hash));
      }
    }
  };
}

/**
 * Adds a pendingWithdraw to the pendingDelayedWithdraw store
 */
function addPendingDelayedWithdraw(pendingDelayedWithdraw: PendingDelayedWithdraw): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        const { hermezEthereumAddress } = wallet;
        adapters.localStorage.addPendingDelayedWithdraw(
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
 */
function removePendingDelayedWithdraw(pendingDelayedWithdrawId: string): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        const { hermezEthereumAddress } = wallet;
        adapters.localStorage.removePendingDelayedWithdrawById(
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
 */
function removePendingDelayedWithdrawByHash(pendingDelayedWithdrawHash: string): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        const { hermezEthereumAddress } = wallet;
        adapters.localStorage.removePendingDelayedWithdrawByHash(
          chainId,
          hermezEthereumAddress,
          pendingDelayedWithdrawHash
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
 */
function updatePendingDelayedWithdrawDate(
  transactionHash: string,
  pendingDelayedWithdrawDate: ISOStringDate
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        const { hermezEthereumAddress } = wallet;
        adapters.localStorage.updatePendingDelayedWithdrawByHash(
          chainId,
          hermezEthereumAddress,
          transactionHash,
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
 */
function checkPendingDelayedWithdrawals(): AppThunk {
  return async (dispatch: AppDispatch, getState: () => AppState) => {
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
        const accountEthBalance = await provider.getBalance(
          Addresses.getEthereumAddress(hermezEthereumAddress)
        );
        const accountPendingDelayedWithdraws: PendingDelayedWithdraw[] =
          storage.getPendingDelayedWithdrawsByHermezAddress(
            pendingDelayedWithdraws,
            chainId,
            hermezEthereumAddress
          );

        // Gets the actual transaction and checks if it doesn't exist or is expected to fail
        const pendingDelayedWithdrawsTxs: Promise<TransactionResponse>[] =
          accountPendingDelayedWithdraws.map((pendingDelayedWithdraw) => {
            return provider.getTransaction(pendingDelayedWithdraw.hash).then((tx) => {
              if (tx.blockNumber !== undefined) {
                // Checks whether the date of pendingDelayedWithdraw needs to be updated
                provider
                  .getBlock(tx.blockNumber)
                  .then((block: Block) => {
                    // Converts timestamp from s to ms
                    const newTimestamp = block.timestamp * 1000;
                    if (new Date(pendingDelayedWithdraw.timestamp).getTime() !== newTimestamp) {
                      dispatch(
                        updatePendingDelayedWithdrawDate(
                          pendingDelayedWithdraw.hash,
                          new Date(newTimestamp).toISOString()
                        )
                      );
                    }
                  })
                  .catch((error: unknown) => {
                    const errorMsg = adapters.parseError(error);
                    dispatch(
                      openSnackbar({
                        type: "error",
                        raw: error,
                        parsed: errorMsg,
                      })
                    );
                  });
              }
              // Checks here to have access to pendingDelayedWithdraw.timestamp
              if (
                adapters.ethereum.isTxCanceled(tx) ||
                adapters.ethereum.isTxExpectedToFail(
                  tx,
                  pendingDelayedWithdraw.timestamp,
                  accountEthBalance
                )
              ) {
                dispatch(removePendingDelayedWithdrawByHash(pendingDelayedWithdraw.hash));
              }
              return tx;
            });
          });

        Promise.all(pendingDelayedWithdrawsTxs)
          .then((txs) => {
            const minedTxs = txs.filter(adapters.ethereum.isTxMined);
            const pendingDelayedWithdrawsTxReceipts = minedTxs.map((tx) =>
              provider.getTransactionReceipt(tx.hash)
            );

            // Checks receipts to see if transactions have been reverted
            Promise.all(pendingDelayedWithdrawsTxReceipts)
              .then((txReceipts) => {
                const revertedTxReceipts = txReceipts.filter(adapters.ethereum.hasTxBeenReverted);

                revertedTxReceipts.forEach((tx) => {
                  dispatch(removePendingDelayedWithdrawByHash(tx.transactionHash));
                });

                // Checks with Coordinator API if exit has been withdrawn
                const exitsApiPromises = accountPendingDelayedWithdraws.map(
                  (pendingDelayedWithdraw) => {
                    return adapters.hermezApi
                      .getExit(pendingDelayedWithdraw.batchNum, pendingDelayedWithdraw.accountIndex)
                      .then((exitTx: Exit) => {
                        // Checks here to have access to pendingDelayedWithdraw.id
                        if (exitTx.delayedWithdraw) {
                          dispatch(removePendingDelayedWithdraw(pendingDelayedWithdraw.id));
                        }
                      });
                  }
                );
                Promise.all(exitsApiPromises).finally(() =>
                  dispatch(globalActions.checkPendingDelayedWithdrawalsSuccess())
                );
              })
              .catch((error: unknown) => {
                const errorMsg = adapters.parseError(error);
                dispatch(
                  openSnackbar({
                    type: "error",
                    raw: error,
                    parsed: errorMsg,
                  })
                );
              });
          })
          .catch((error: unknown) => {
            const errorMsg = adapters.parseError(error);
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

function addTimerWithdraw(timerWithdraw: TimerWithdraw): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        const { hermezEthereumAddress } = wallet;
        adapters.localStorage.addTimerWithdraw(chainId, hermezEthereumAddress, timerWithdraw);
        dispatch(globalActions.addTimerWithdraw(chainId, hermezEthereumAddress, timerWithdraw));
      }
    }
  };
}

function removeTimerWithdraw(timerWithdrawId: string): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        const { hermezEthereumAddress } = wallet;
        adapters.localStorage.removeTimerWithdrawById(
          chainId,
          hermezEthereumAddress,
          timerWithdrawId
        );
        dispatch(
          globalActions.removeTimerWithdraw(chainId, hermezEthereumAddress, timerWithdrawId)
        );
      }
    }
  };
}

/**
 * Checks if we have some exit that is not saved in localStorage
 */
function recoverPendingDelayedWithdrawals(exits: Exits): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, pendingDelayedWithdraws, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        const { hermezEthereumAddress } = wallet;
        const provider = Providers.getProvider();
        const accountPendingDelayedWithdraws: PendingDelayedWithdraw[] =
          storage.getPendingDelayedWithdrawsByHermezAddress(
            pendingDelayedWithdraws,
            chainId,
            hermezEthereumAddress
          );
        const batchNumPendingDelayedWithdraws = accountPendingDelayedWithdraws.map(
          (account) => account.batchNum
        );

        exits.exits.forEach((exit) => {
          if (
            !batchNumPendingDelayedWithdraws.includes(exit.batchNum) &&
            exit.delayedWithdrawRequest
          ) {
            void provider
              .getBlockWithTransactions(exit.delayedWithdrawRequest)
              .then((blockWithTransactions) => {
                const pendingDelayedWithdraw = blockWithTransactions.transactions.find(
                  (tx) => Addresses.getEthereumAddress(hermezEthereumAddress) === tx.from
                );
                if (pendingDelayedWithdraw) {
                  dispatch(
                    addPendingDelayedWithdraw({
                      ...exit,
                      hash: pendingDelayedWithdraw.hash,
                      id: `${exit.accountIndex}${exit.batchNum}`,
                      hermezEthereumAddress: wallet.hermezEthereumAddress,
                      isInstant: false, // TODO I'll remove this key that it's unused with the ExitCard refactor
                      timestamp: new Date(blockWithTransactions.timestamp * 1000).toISOString(),
                    })
                  );
                }
              })
              .catch(() => ({}));
          }
        });
      }
    }
  };
}

/**
 * Checks pending exits to see if they have been completed
 * and delete them from storage
 */
function checkPendingWithdrawals(): AppThunk {
  return async (dispatch: AppDispatch, getState: () => AppState) => {
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
        const accountEthBalance = await provider.getBalance(
          Addresses.getEthereumAddress(hermezEthereumAddress)
        );

        const accountPendingWithdraws: PendingWithdraw[] =
          storage.getPendingWithdrawsByHermezAddress(
            pendingWithdraws,
            chainId,
            hermezEthereumAddress
          );
        // Gets the actual transaction and checks if it doesn't exist or is expected to fail
        const pendingWithdrawsTxs: Promise<TransactionResponse>[] = accountPendingWithdraws.map(
          (pendingWithdraw) => {
            return provider.getTransaction(pendingWithdraw.hash).then((tx: TransactionResponse) => {
              // Checks here to have access to pendingWithdraw.timestamp
              if (
                adapters.ethereum.isTxCanceled(tx) ||
                adapters.ethereum.isTxExpectedToFail(
                  tx,
                  pendingWithdraw.timestamp,
                  accountEthBalance
                )
              ) {
                dispatch(removePendingWithdraw(pendingWithdraw.hash));
              }
              return tx;
            });
          }
        );

        Promise.all(pendingWithdrawsTxs)
          .then((txs) => {
            const minedTxs = txs.filter(adapters.ethereum.isTxMined);
            const pendingWithdrawsTxReceipts: Promise<TransactionReceipt>[] = minedTxs.map((tx) =>
              provider.getTransactionReceipt(tx.hash)
            );

            // Checks receipts to see if transactions have been reverted
            Promise.all(pendingWithdrawsTxReceipts)
              .then((txReceipts) => {
                const revertedTxReceipts = txReceipts.filter(adapters.ethereum.hasTxBeenReverted);

                revertedTxReceipts.forEach((tx) => {
                  dispatch(removePendingWithdraw(tx.transactionHash));
                });

                // Checks with Coordinator API if exit has been withdrawn
                const exitsApiPromises = accountPendingWithdraws.map((pendingWithdraw) => {
                  return adapters.hermezApi
                    .getExit(pendingWithdraw.batchNum, pendingWithdraw.accountIndex)
                    .then((exitTx: Exit) => {
                      // Checks here to have access to pendingWithdraw.hash
                      if (exitTx.instantWithdraw || exitTx.delayedWithdraw) {
                        dispatch(removePendingWithdraw(pendingWithdraw.hash));
                        dispatch(removePendingDelayedWithdraw(pendingWithdraw.id));
                      }
                    });
                });

                Promise.all(exitsApiPromises).finally(() =>
                  dispatch(globalActions.checkPendingWithdrawalsSuccess())
                );
              })
              .catch(() => ({}));
          })
          .catch(() => ({}));
      }
    }
  };
}

/**
 * Adds a pendingDeposit to the pendingDeposits store
 */
function addPendingDeposit(pendingDeposit: PendingDeposit): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const { hermezEthereumAddress } = wallet;
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        adapters.localStorage.addPendingDeposit(chainId, hermezEthereumAddress, pendingDeposit);
        dispatch(globalActions.addPendingDeposit(chainId, hermezEthereumAddress, pendingDeposit));
      }
    }
  };
}

/**
 * Removes a pendingDeposit from the pendingDeposit store by id
 */
function removePendingDepositByTransactionId(transactionId: string): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const { hermezEthereumAddress } = wallet;
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        adapters.localStorage.removePendingDepositByTransactionId(
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
 */
function removePendingDepositByHash(hash: string): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const { hermezEthereumAddress } = wallet;
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        adapters.localStorage.removePendingDepositByHash(chainId, hermezEthereumAddress, hash);
        dispatch(globalActions.removePendingDepositByHash(chainId, hermezEthereumAddress, hash));
      }
    }
  };
}

function updatePendingDepositId(transactionHash: string, transactionId: string): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, ethereumNetworkTask },
    } = getState();
    if (wallet !== undefined && ethereumNetworkTask.status === "successful") {
      const { hermezEthereumAddress } = wallet;
      const {
        data: { chainId },
      } = ethereumNetworkTask;
      if (chainId !== undefined) {
        adapters.localStorage.updatePendingDepositByHash(
          chainId,
          hermezEthereumAddress,
          transactionHash,
          { transactionId }
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

function checkPendingDeposits(): AppThunk {
  return async (dispatch: AppDispatch, getState: () => AppState) => {
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
        const accountEthBalance = await provider.getBalance(
          Addresses.getEthereumAddress(hermezEthereumAddress)
        );
        const accountPendingDeposits: PendingDeposit[] = storage.getPendingDepositsByHermezAddress(
          pendingDeposits,
          chainId,
          hermezEthereumAddress
        );
        const pendingDepositsTxs: Promise<TransactionResponse>[] = accountPendingDeposits.map(
          (pendingDeposit) => {
            return provider.getTransaction(pendingDeposit.hash).then((tx: TransactionResponse) => {
              if (
                adapters.ethereum.isTxCanceled(tx) ||
                adapters.ethereum.isTxExpectedToFail(
                  tx,
                  pendingDeposit.timestamp,
                  accountEthBalance
                )
              ) {
                dispatch(removePendingDepositByHash(pendingDeposit.hash));
              }

              return tx;
            });
          }
        );

        Promise.all(pendingDepositsTxs)
          .then((txs) => {
            const minedTxs = txs.filter((tx) => tx !== null && tx.blockNumber !== null);
            const pendingDepositsTxReceipts = minedTxs.map((tx) =>
              provider.getTransactionReceipt(tx.hash)
            );

            Promise.all(pendingDepositsTxReceipts)
              .then((txReceipts) => {
                const hermezContractInterface = new ethers.utils.Interface(HermezABI);
                const revertedTxReceipts = txReceipts.filter(adapters.ethereum.hasTxBeenReverted);
                const successfulTxReceipts = txReceipts.filter(
                  (txReceipt) =>
                    txReceipt.status === 1 && txReceipt.logs && txReceipt.logs.length > 0
                );
                const transactionHistoryPromises = successfulTxReceipts.reduce(
                  (accL2Transactions: Promise<HistoryTransaction>[], txReceipt) => {
                    // Need to parse logs, but only events from the Hermez SC. Ignore errors when trying to parse others
                    const parsedLogs = [];
                    for (const txReceiptLog of txReceipt.logs) {
                      try {
                        const parsedLog = hermezContractInterface.parseLog(txReceiptLog);
                        parsedLogs.push(parsedLog);
                        // eslint-disable-next-line no-empty
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
                      dispatch(updatePendingDepositId(txReceipt.transactionHash, txId));
                    }

                    return [...accL2Transactions, adapters.hermezApi.getHistoryTransaction(txId)];
                  },
                  []
                );

                revertedTxReceipts.forEach((tx) => {
                  dispatch(removePendingDepositByHash(tx.transactionHash));
                });

                Promise.all(transactionHistoryPromises)
                  .then((results) => {
                    results.forEach((transaction) => {
                      if (transaction.batchNum !== null) {
                        dispatch(removePendingDepositByTransactionId(transaction.id));
                      }
                    });
                    dispatch(globalActions.checkPendingDepositsSuccess());
                  })
                  .catch(() => dispatch(globalActions.checkPendingDepositsSuccess()));
              })
              .catch(() => ({}));
          })
          .catch(() => ({}));
      }
    }
  };
}

function checkPendingTransactions(): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const poolTxsLimit = 2049;
    const {
      global: { wallet, coordinatorStateTask },
    } = getState();

    if (wallet !== undefined && coordinatorStateTask.status === "successful") {
      const nextForgerUrls = getNextForgerUrls(coordinatorStateTask.data);

      adapters.hermezApi
        .getPoolTransactions(wallet.hermezEthereumAddress, undefined, poolTxsLimit)
        .then((poolTransactions: PoolTransactions) => {
          const tenMinutesInMs = 10 * 60 * 1000;
          const oneDayInMs = 24 * 60 * 60 * 1000;
          const resendTransactionsRequests = poolTransactions.transactions
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
            .map((transaction: PoolTransaction) => {
              const txData = {
                type: transaction.type,
                from: transaction.fromAccountIndex,
                amount: HermezCompressedAmount.compressAmount(transaction.amount),
                ...(transaction.type === TxType.TransferToEthAddr
                  ? { to: transaction.toHezEthereumAddress }
                  : transaction.type === TxType.Transfer
                  ? { to: transaction.toAccountIndex }
                  : { to: null }),
                fee: transaction.fee,
              };

              return adapters.hermezApi
                .generateAndSendL2Tx(txData, wallet, transaction.token, nextForgerUrls)
                .catch(() => ({}));
            });

          return Promise.all(resendTransactionsRequests);
        })
        .catch((error: unknown) => {
          const errorMsg = adapters.parseError(error);
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
 * Fetches the state of the coordinator
 */
function fetchCoordinatorState(): AppThunk {
  return (dispatch: AppDispatch) => {
    dispatch(globalActions.loadCoordinatorState());

    return adapters.hermezApi
      .getState()
      .then((coordinatorState: CoordinatorState) =>
        dispatch(globalActions.loadCoordinatorStateSuccess(coordinatorState))
      )
      .catch((error: unknown) => {
        const errorMsg = adapters.parseError(error);
        dispatch(globalActions.loadCoordinatorStateFailure(errorMsg));
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
 * Removes the MetaMask wallet data from the Redux store and the localStorage
 */
function disconnectWallet(): AppThunk {
  return (dispatch: AppDispatch) => {
    const provider = Providers.getProvider();

    if (provider.provider instanceof Connector) {
      // Kills the stored Web Connect session to show QR with next login
      provider.provider.connector.killSession().catch(() => ({}));
    }

    dispatch(globalActions.unloadWallet());
    dispatch(push("/login"));
  };
}

/**
 * Reloads the webapp
 */
function reloadApp(): AppThunk {
  return () => {
    window.location.reload();
  };
}

/**
 * Fetch tokens price
 */
function fetchTokensPrice(): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { env },
    } = getState();

    if (env) {
      dispatch(globalActions.loadTokensPrice());

      return adapters.priceUpdater
        .getTokensPrice(env)
        .then((res: Token[]) => dispatch(globalActions.loadTokensPriceSuccess(res)))
        .catch((error: unknown) => {
          const errorMsg = adapters.parseError(error);
          dispatch(globalActions.loadTokensPriceFailure(errorMsg));
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
 * Report an error using the report issue form
 */
function reportError(raw: unknown, parsed: string): AppThunk {
  return (_: AppDispatch, getState: () => AppState) => {
    const {
      global: { ethereumNetworkTask },
    } = getState();

    const network = isAsyncTaskDataAvailable(ethereumNetworkTask)
      ? `${ethereumNetworkTask.data.name} with id ${ethereumNetworkTask.data.chainId}`
      : "Not available";

    const data = {
      [REPORT_ERROR_FORM_ENTRIES.url]: window.location.href,
      [REPORT_ERROR_FORM_ENTRIES.network]: network,
      [REPORT_ERROR_FORM_ENTRIES.error]: parsed,
    };

    void import("platform")
      .then((platform) => {
        const params = new URLSearchParams({
          ...data,
          [REPORT_ERROR_FORM_ENTRIES.platform]: platform.toString(),
        }).toString();
        window.open(`${REPORT_ERROR_FORM_URL}?${params}`, "_blank");
      })
      .catch(() => {
        console.error("An error occured dynamically loading the library 'platform'");
        const params = new URLSearchParams({
          ...data,
          [REPORT_ERROR_FORM_ENTRIES.platform]: "Not available",
        }).toString();
        window.open(`${REPORT_ERROR_FORM_URL}?${params}`, "_blank");
      });
  };
}

export {
  setHermezEnvironment,
  changeRedirectRoute,
  fetchFiatExchangeRates,
  changeNetworkStatus,
  loadEnv,
  checkHermezStatus,
  fetchPoolTransactions,
  addPendingWithdraw,
  removePendingWithdraw,
  addPendingDelayedWithdraw,
  removePendingDelayedWithdraw,
  updatePendingDelayedWithdrawDate,
  checkPendingDelayedWithdrawals,
  checkPendingWithdrawals,
  addTimerWithdraw,
  removeTimerWithdraw,
  recoverPendingDelayedWithdrawals,
  addPendingDeposit,
  removePendingDepositByTransactionId,
  removePendingDepositByHash,
  updatePendingDepositId,
  checkPendingDeposits,
  checkPendingTransactions,
  fetchCoordinatorState,
  disconnectWallet,
  reloadApp,
  fetchTokensPrice,
  reportError,
};
