import { CoordinatorAPI, Tx, HermezCompressedAmount } from "@hermeznetwork/hermezjs";
import { TxType, TxState } from "@hermeznetwork/hermezjs/src/enums";
import { getProvider } from "@hermeznetwork/hermezjs/src/providers";
import { ETHER_TOKEN_ID } from "@hermeznetwork/hermezjs/src/constants";
import { getPoolTransactions } from "@hermeznetwork/hermezjs/src/tx-pool";
import { BigNumber } from "ethers";
import { push } from "connected-react-router";

import { AppState, AppDispatch, AppThunk } from "src/store";
import * as depositActions from "src/store/transactions/deposit/deposit.actions";
import * as globalThunks from "src/store/global/global.thunks";
import { openSnackbar } from "src/store/global/global.actions";
import * as ethereum from "src/utils/ethereum";
import { convertTokenAmountToFiat, getFixedTokenAmount } from "src/utils/currencies";
import { getNextBestForger } from "src/utils/coordinator";
import { getDepositFee } from "src/utils/fees";
import theme from "src/styles/theme";
// domain
import { FiatExchangeRates, EthereumAccount } from "src/domain/hermez";

/**
 * Fetches the account details for a token id in an Ethereum wallet.
 */
function fetchEthereumAccount(tokenId: number): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet },
    } = getState();

    dispatch(depositActions.loadEthereumAccount());

    if (wallet !== undefined) {
      return CoordinatorAPI.getTokens(undefined, undefined, undefined, undefined, 2049).then(
        (res) => {
          ethereum
            .getTokens(wallet, res.tokens)
            .then((ethereumAccounts) => {
              const ethereumAccount = ethereumAccounts.find((token) => token.token.id === tokenId);

              if (ethereumAccount) {
                dispatch(depositActions.loadEthereumAccountSuccess(ethereumAccount));
              } else {
                dispatch(depositActions.loadEthereumAccountFailure("Ethereum account not found"));
              }
            })
            .catch((error) => {
              const errorMsg =
                error instanceof Error
                  ? error.message
                  : "Oops ... There was an error fetching the ethereum account";
              dispatch(depositActions.loadEthereumAccountFailure(errorMsg));
            });
        }
      );
    }
  };
}

/**
 * Fetches the transactions which are in the transactions pool
 * @returns {void}
 */
function fetchPoolTransactions(): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    dispatch(depositActions.loadPoolTransactions());

    const {
      global: { wallet },
    } = getState();

    if (wallet !== undefined) {
      getPoolTransactions(undefined, wallet.publicKeyCompressedHex)
        .then((transactions) => dispatch(depositActions.loadPoolTransactionsSuccess(transactions)))
        .catch((err) => dispatch(depositActions.loadPoolTransactionsFailure(err)));
    }
  };
}

/**
 * Fetches the accounts to use in the transaction on Ethereum
 */
function fetchAccounts(fiatExchangeRates: FiatExchangeRates, preferredCurrency: string): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, tokensPriceTask },
    } = getState();

    dispatch(depositActions.loadEthereumAccounts());

    if (wallet !== undefined) {
      return CoordinatorAPI.getTokens(undefined, undefined, undefined, undefined, 2049).then(
        (res) => {
          ethereum
            .getTokens(wallet, res.tokens)
            .then((ethereumAccounts): EthereumAccount[] => {
              return ethereumAccounts.map((ethereumAccount) => {
                const tokenFromTokensPrice =
                  tokensPriceTask.status === "successful" &&
                  tokensPriceTask.data[ethereumAccount.token.id];
                const token = tokenFromTokensPrice ? tokenFromTokensPrice : ethereumAccount.token;

                const fiatBalance = convertTokenAmountToFiat(
                  ethereumAccount.balance,
                  token,
                  preferredCurrency,
                  fiatExchangeRates
                );

                return { ...ethereumAccount, balance: ethereumAccount.balance, fiatBalance };
              });
            })
            .then((metaMaskTokens) =>
              dispatch(depositActions.loadEthereumAccountsSuccess(metaMaskTokens))
            )
            .catch((err) => dispatch(depositActions.loadEthereumAccountsFailure(err)));
        }
      );
    }
  };
}

/**
 * Fetches the recommended fees from the Coordinator
 * @returns {void}
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
        dispatch(depositActions.loadFees());

        return CoordinatorAPI.getState({}, nextForger.coordinator.URL)
          .then((res) => dispatch(depositActions.loadFeesSuccess(res.recommendedFee)))
          .catch((err) => dispatch(depositActions.loadFeesFailure(err)));
      }
    }
  };
}

function fetchEstimatedDepositFee(): AppThunk {
  return async (dispatch: AppDispatch, getState: () => AppState) => {
    dispatch(depositActions.loadEstimatedDepositFee());

    try {
      const {
        global: { tokensPriceTask },
      } = getState();
      const provider = getProvider();
      const { maxFeePerGas } = await provider.getFeeData();

      if (tokensPriceTask.status === "successful" && maxFeePerGas !== null) {
        const ethToken = tokensPriceTask.data.find((token) => token.id === ETHER_TOKEN_ID);
        if (ethToken) {
          const depositFee = getDepositFee(ethToken, maxFeePerGas);
          const amount = getFixedTokenAmount(depositFee.toString(), ethToken.decimals);
          dispatch(
            depositActions.loadEstimatedDepositFeeSuccess({
              amount,
              gasPrice: maxFeePerGas,
              USD: ethToken.USD,
            })
          );
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        dispatch(depositActions.loadEstimatedDepositFeeFailure(err));
      } else {
        dispatch(depositActions.loadEstimatedDepositFeeFailure(new Error("Unexpected error")));
      }
    }
  };
}

function deposit(amount: BigNumber, ethereumAccount: EthereumAccount): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, signer },
    } = getState();

    dispatch(depositActions.startTransactionApproval());

    if (wallet !== undefined && signer !== undefined) {
      return Tx.deposit(
        HermezCompressedAmount.compressAmount(amount.toString()),
        wallet.hermezEthereumAddress,
        ethereumAccount.token,
        wallet.publicKeyCompressedHex,
        signer
      )
        .then((txData) => {
          CoordinatorAPI.getAccounts(wallet.hermezEthereumAddress, [ethereumAccount.token.id])
            .then((res) => {
              // ToDo: What if there's no account?
              const account = res.accounts.length && res.accounts[0];
              if (account) {
                dispatch(
                  globalThunks.addPendingDeposit({
                    hash: txData.hash,
                    fromHezEthereumAddress: wallet.hermezEthereumAddress,
                    toHezEthereumAddress: wallet.hermezEthereumAddress,
                    token: account.token,
                    amount: amount.toString(),
                    state: TxState.Pending,
                    timestamp: new Date().toISOString(),
                    account,
                    type: res.accounts.length ? TxType.Deposit : TxType.CreateAccountDeposit,
                  })
                );
                handleTransactionSuccess(dispatch, account.accountIndex);
              }
            })
            .catch(() => ({}));
        })
        .catch((error) => {
          dispatch(depositActions.stopTransactionApproval());
          handleTransactionFailure(dispatch, error);
        });
    }
  };
}

function handleTransactionSuccess(dispatch: AppDispatch, accountIndex: string) {
  dispatch(openSnackbar("Transaction submitted"));
  dispatch(push(`/accounts/${accountIndex}`));
}

function handleTransactionFailure(dispatch: AppDispatch, error: Error | string) {
  const errorMsg = error instanceof Error ? error.message : error;

  dispatch(depositActions.stopTransactionApproval());
  dispatch(openSnackbar(`Transaction failed - ${errorMsg}`, theme.palette.red.main));
}

export {
  fetchEthereumAccount,
  fetchPoolTransactions,
  fetchAccounts,
  fetchFees,
  fetchEstimatedDepositFee,
  deposit,
};
