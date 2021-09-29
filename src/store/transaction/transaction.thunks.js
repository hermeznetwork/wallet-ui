import { CoordinatorAPI, Tx, TxFees, HermezCompressedAmount } from "@hermeznetwork/hermezjs";
import { TxType, TxState } from "@hermeznetwork/hermezjs/src/enums";
import { getProvider } from "@hermeznetwork/hermezjs/src/providers";
import { ETHER_TOKEN_ID } from "@hermeznetwork/hermezjs/src/constants";
import { getEthereumAddress } from "@hermeznetwork/hermezjs/src/addresses";
import { getPoolTransactions } from "@hermeznetwork/hermezjs/src/tx-pool";
import { ethers, BigNumber } from "ethers";
import { push } from "connected-react-router";

import * as transactionActions from "./transaction.actions";
import * as globalThunks from "../global/global.thunks";
import { openSnackbar } from "../global/global.actions";
import * as ethereum from "../../utils/ethereum";
import { createAccount } from "../../utils/accounts";
import { convertTokenAmountToFiat } from "../../utils/currencies";
import { mergeDelayedWithdraws } from "../../utils/transactions";
import { getNextBestForger, getNextForgerUrls } from "../../utils/coordinator";
import theme from "../../styles/theme";

import { WITHDRAW_WASM_URL, WITHDRAW_HEZ4_FINAL_ZKEY_URL } from "../../constants";

/**
 * Fetches the account details for a token id in an Ethereum wallet.
 * @param {string} tokenId - id of the token of the account
 * @returns {void}
 */
function fetchEthereumAccount(tokenId) {
  return (dispatch, getState) => {
    const {
      global: { wallet },
    } = getState();

    dispatch(transactionActions.loadAccount());

    if (!wallet) {
      return dispatch(transactionActions.loadAccountFailure("Ethereum wallet is not loaded"));
    }

    return CoordinatorAPI.getTokens(undefined, undefined, undefined, undefined, 2049).then(
      (res) => {
        ethereum
          .getTokens(wallet, res.tokens)
          .then((ethereumTokens) => {
            const account = ethereumTokens.find((token) => token.token.id === tokenId);

            if (account) {
              dispatch(transactionActions.loadAccountSuccess(account));
            } else {
              dispatch(transactionActions.loadAccountFailure("Token not found"));
            }
          })
          .catch((error) => dispatch(transactionActions.loadAccountFailure(error.message)));
      }
    );
  };
}

/**
 * Fetches the account details for an accountIndex in the Hermez API.
 * @param {string} accountIndex - accountIndex of the account
 * @returns {void}
 */
function fetchHermezAccount(
  accountIndex,
  poolTransactions,
  pendingDeposits,
  fiatExchangeRates,
  preferredCurrency
) {
  return (dispatch, getState) => {
    const {
      global: { wallet, tokensPriceTask },
    } = getState();

    dispatch(transactionActions.loadAccount());

    if (!wallet) {
      return dispatch(transactionActions.loadAccountFailure("Ethereum wallet is not loaded"));
    }

    return CoordinatorAPI.getAccount(accountIndex)
      .then((account) =>
        createAccount(
          account,
          poolTransactions,
          pendingDeposits,
          tokensPriceTask,
          fiatExchangeRates,
          preferredCurrency
        )
      )
      .then((res) => dispatch(transactionActions.loadAccountSuccess(res)))
      .catch((error) => dispatch(transactionActions.loadAccountFailure(error.message)));
  };
}

/**
 * Fetches the details of an exit
 * @param {string} accountIndex - account index
 * @param {Number} batchNum - batch number
 * @param {Boolean} completeDelayedWithdrawal - Whether we are completing a delayed withdrawal
 * @param {Array} pendingDelayedWithdraws - Pending delayed withdraws stored in LocalStorage
 * @returns {void}
 */
function fetchExit(accountIndex, batchNum, completeDelayedWithdrawal, pendingDelayedWithdraws) {
  return (dispatch, getState) => {
    const {
      global: { wallet },
    } = getState();

    if (!wallet) {
      return dispatch(transactionActions.loadExitFailure("Ethereum wallet is not loaded"));
    }

    dispatch(transactionActions.loadExit());

    Promise.all([
      CoordinatorAPI.getAccount(accountIndex),
      CoordinatorAPI.getExit(batchNum, accountIndex),
    ])
      .then(([account, exit]) => {
        // If we are completing a delayed withdrawal, we need to merge all delayed withdrawals
        // of the same token to show the correct amount in Transaction Overview
        if (completeDelayedWithdrawal) {
          const pendingDelayedWithdrawsWithToken = pendingDelayedWithdraws.filter(
            (pendingDelayedWithdraw) => pendingDelayedWithdraw.token.id === exit.token.id
          );
          const mergedPendingDelayedWithdraws = mergeDelayedWithdraws(
            pendingDelayedWithdrawsWithToken
          );
          exit = mergedPendingDelayedWithdraws[0];
        }
        dispatch(transactionActions.loadExitSuccess(account, exit, wallet.hermezEthereumAddress));
      })
      .catch((err) => dispatch(transactionActions.loadExitFailure(err.message)));
  };
}

/**
 * Fetches the transactions which are in the transactions pool
 * @returns {void}
 */
function fetchPoolTransactions() {
  return (dispatch, getState) => {
    dispatch(transactionActions.loadPoolTransactions());

    const {
      global: { wallet },
    } = getState();

    getPoolTransactions(null, wallet.publicKeyCompressedHex)
      .then((transactions) =>
        dispatch(transactionActions.loadPoolTransactionsSuccess(transactions))
      )
      .catch((err) => dispatch(transactionActions.loadPoolTransactionsFailure(err)));
  };
}

/**
 * Fetches the accounts to use in the transaction. If the transaction is a deposit it will
 * look for them on Ethereum, otherwise it will look for them on the rollup api
 * @param {string} transactionType - Transaction type
 * @param {Number} fromItem - id of the first account to be returned from the api
 * @returns {void}
 */
function fetchAccounts(
  transactionType,
  fromItem,
  poolTransactions,
  pendingDeposits,
  fiatExchangeRates,
  preferredCurrency
) {
  return (dispatch, getState) => {
    const {
      global: { wallet, tokensPriceTask },
    } = getState();

    dispatch(transactionActions.loadAccounts());

    if (transactionType === TxType.Deposit) {
      return CoordinatorAPI.getTokens(undefined, undefined, undefined, undefined, 2049).then(
        (res) => {
          ethereum
            .getTokens(wallet, res.tokens)
            .then((tokens) => {
              return tokens.map((token) => {
                const tokenBalance = token.balance.toString();
                const tokenPrice =
                  tokensPriceTask.status === "successful"
                    ? { ...tokensPriceTask.data[token.token.id] }
                    : { ...token.token };

                const fiatBalance = convertTokenAmountToFiat(
                  tokenBalance,
                  tokenPrice,
                  preferredCurrency,
                  fiatExchangeRates
                );

                return { ...token, balance: tokenBalance, fiatBalance };
              });
            })
            .then((metaMaskTokens) =>
              dispatch(transactionActions.loadAccountsSuccess(transactionType, metaMaskTokens))
            )
            .catch((err) => dispatch(transactionActions.loadAccountsFailure(err)));
        }
      );
    } else {
      return CoordinatorAPI.getAccounts(wallet.publicKeyBase64, undefined, fromItem)
        .then((res) => {
          const accounts = res.accounts.map((account) =>
            createAccount(
              account,
              poolTransactions,
              pendingDeposits,
              tokensPriceTask,
              fiatExchangeRates,
              preferredCurrency
            )
          );

          return { ...res, accounts };
        })
        .then((res) => dispatch(transactionActions.loadAccountsSuccess(transactionType, res)))
        .catch((err) => dispatch(transactionActions.loadAccountsFailure(err)));
    }
  };
}

function fetchAccountBalance() {
  return async (dispatch, getState) => {
    const {
      global: { wallet },
    } = getState();

    dispatch(transactionActions.loadAccountBalance());

    const ethereumAddress = getEthereumAddress(wallet.hermezEthereumAddress);
    const provider = getProvider();

    return provider
      .getBalance(ethereumAddress)
      .then((balance) =>
        dispatch(transactionActions.loadAccountBalanceSuccess(ethers.utils.formatUnits(balance)))
      )
      .catch((err) => dispatch(transactionActions.loadAccountBalanceFailure(err)));
  };
}

/**
 * Fetches the recommended fees from the Coordinator
 * @returns {void}
 */
function fetchFees() {
  return function (dispatch, getState) {
    const {
      global: { coordinatorStateTask },
    } = getState();
    const nextForger = getNextBestForger(coordinatorStateTask.data);

    dispatch(transactionActions.loadFees());

    return CoordinatorAPI.getState({}, nextForger.coordinator.URL)
      .then((res) => dispatch(transactionActions.loadFeesSuccess(res.recommendedFee)))
      .catch((err) => dispatch(transactionActions.loadFeesFailure(err)));
  };
}

function fetchEstimatedWithdrawFee(token, amount) {
  return async (dispatch, getState) => {
    dispatch(transactionActions.loadEstimatedWithdrawFee());

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
      const tokenUSD = tokensPriceTask.data?.[ETHER_TOKEN_ID].USD;
      const feeUSD = Number(ethers.utils.formatEther(feeBigNumber)) * tokenUSD;

      dispatch(
        transactionActions.loadEstimatedWithdrawFeeSuccess({
          amount: feeBigNumber.toString(),
          USD: feeUSD,
        })
      );
    } catch (err) {
      dispatch(transactionActions.loadEstimatedWithdrawFeeFailure(err));
    }
  };
}

function deposit(amount, account) {
  return (dispatch, getState) => {
    const {
      global: { wallet, signer },
    } = getState();

    dispatch(transactionActions.startTransactionApproval());

    return Tx.deposit(
      HermezCompressedAmount.compressAmount(amount),
      wallet.hermezEthereumAddress,
      account.token,
      wallet.publicKeyCompressedHex,
      signer
    )
      .then((txData) => {
        CoordinatorAPI.getAccounts(wallet.hermezEthereumAddress, [account.token.id]).then((res) => {
          dispatch(
            globalThunks.addPendingDeposit({
              hash: txData.hash,
              fromHezEthereumAddress: wallet.hermezEthereumAddress,
              toHezEthereumAddress: wallet.hermezEthereumAddress,
              token: account.token,
              amount: amount.toString(),
              state: TxState.Pending,
              timestamp: new Date().toISOString(),
              account: res.accounts.length && res.accounts[0],
              type: res.accounts.length ? TxType.Deposit : TxType.CreateAccountDeposit,
            })
          );
          handleTransactionSuccess(dispatch);
        });
      })
      .catch((error) => {
        console.error(error);
        dispatch(transactionActions.stopTransactionApproval());
        handleTransactionFailure(dispatch, error);
      });
  };
}

function withdraw(amount, account, exit, completeDelayedWithdrawal, instantWithdrawal) {
  return (dispatch, getState) => {
    const {
      global: { wallet, signer },
    } = getState();
    const withdrawalId = account.accountIndex + exit.batchNum;

    dispatch(transactionActions.startTransactionApproval());

    // Differentiate between a withdraw on the Hermez SC and the DelayedWithdrawal SC
    if (!completeDelayedWithdrawal) {
      return Tx.withdrawCircuit(
        exit,
        instantWithdrawal,
        WITHDRAW_WASM_URL,
        WITHDRAW_HEZ4_FINAL_ZKEY_URL,
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
                amount,
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
                amount,
                token: account.token,
                timestamp: new Date().toISOString(),
              })
            );
          }
          handleTransactionSuccess(dispatch);
        })
        .catch((error) => {
          console.error(error);
          dispatch(transactionActions.stopTransactionApproval());
          handleTransactionFailure(dispatch, error);
        });
    } else {
      return Tx.delayedWithdraw(wallet.hermezEthereumAddress, account.token, signer)
        .then((txData) => {
          dispatch(
            globalThunks.addPendingWithdraw({
              hash: txData.hash,
              hermezEthereumAddress: wallet.hermezEthereumAddress,
              id: withdrawalId,
              accountIndex: account.accountIndex,
              batchNum: exit.batchNum,
              amount,
              token: account.token,
            })
          );
          handleTransactionSuccess(dispatch);
        })
        .catch((error) => {
          console.error(error);
          dispatch(transactionActions.stopTransactionApproval());
          handleTransactionFailure(dispatch, error);
        });
    }
  };
}

function forceExit(amount, account) {
  return (dispatch, getState) => {
    const {
      global: { signer },
    } = getState();

    dispatch(transactionActions.startTransactionApproval());

    return Tx.forceExit(
      HermezCompressedAmount.compressAmount(amount),
      account.accountIndex,
      account.token,
      signer
    )
      .then(() => handleTransactionSuccess(dispatch))
      .catch((error) => {
        console.error(error);
        dispatch(transactionActions.stopTransactionApproval());
        handleTransactionFailure(dispatch, error);
      });
  };
}

function exit(amount, account, fee) {
  return (dispatch, getState) => {
    const {
      global: { wallet, coordinatorStateTask },
    } = getState();

    dispatch(transactionActions.startTransactionApproval());

    const nextForgerUrls = getNextForgerUrls(coordinatorStateTask.data);
    const txData = {
      type: TxType.Exit,
      from: account.accountIndex,
      amount: HermezCompressedAmount.compressAmount(amount),
      fee,
    };

    return Tx.generateAndSendL2Tx(txData, wallet, account.token, nextForgerUrls)
      .then(() => handleTransactionSuccess(dispatch))
      .catch((error) => {
        console.error(error);
        dispatch(transactionActions.stopTransactionApproval());
        handleTransactionFailure(dispatch, error);
      });
  };
}

function transfer(amount, from, to, fee) {
  return (dispatch, getState) => {
    const {
      global: { wallet, coordinatorStateTask },
    } = getState();

    dispatch(transactionActions.startTransactionApproval());

    const nextForgerUrls = getNextForgerUrls(coordinatorStateTask.data);
    const txData = {
      from: from.accountIndex,
      to: to.accountIndex || to.hezEthereumAddress || to.hezBjjAddress,
      amount: HermezCompressedAmount.compressAmount(amount),
      fee,
    };

    return Tx.generateAndSendL2Tx(txData, wallet, from.token, nextForgerUrls)
      .then(() => handleTransactionSuccess(dispatch, from.accountIndex))
      .catch((error) => {
        console.error(error);
        dispatch(transactionActions.stopTransactionApproval());
        handleTransactionFailure(dispatch, error);
      });
  };
}

function handleTransactionSuccess(dispatch, accountIndex) {
  const route = accountIndex ? `/accounts/${accountIndex}` : "/";
  dispatch(openSnackbar("Transaction submitted"));
  dispatch(push(route));
}

function handleTransactionFailure(dispatch, error) {
  dispatch(openSnackbar(`Transaction failed - ${error.message || error}`, theme.palette.red.main));
}

export {
  fetchEthereumAccount,
  fetchHermezAccount,
  fetchExit,
  fetchPoolTransactions,
  fetchAccounts,
  fetchAccountBalance,
  fetchFees,
  fetchEstimatedWithdrawFee,
  deposit,
  withdraw,
  forceExit,
  exit,
  transfer,
};
