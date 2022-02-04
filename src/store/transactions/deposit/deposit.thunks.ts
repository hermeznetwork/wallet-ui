import { Enums, Providers, Constants } from "@hermeznetwork/hermezjs";
import { BigNumber } from "ethers";
import { push } from "@lagunovsky/redux-react-router";

import { AppState, AppDispatch, AppThunk } from "src/store";
import * as depositActions from "src/store/transactions/deposit/deposit.actions";
import { processError, addPendingDeposit } from "src/store/global/global.thunks";
import { openSnackbar } from "src/store/global/global.actions";
import { getTxFee } from "src/utils/fees";
import { isAsyncTaskDataAvailable } from "src/utils/types";
// domain
import { FiatExchangeRates, EthereumAccount, HermezAccount } from "src/domain";
// adapters
import * as adapters from "src/adapters";

const { getProvider } = Providers;
const { ETHER_TOKEN_ID } = Constants;
const { TxState, TxType } = Enums;

/**
 * Fetches the account details for a token id in an Ethereum wallet.
 */
function fetchEthereumAccount(
  tokenId: number,
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, tokensPriceTask },
    } = getState();

    dispatch(depositActions.loadEthereumAccount());

    if (wallet !== undefined) {
      return adapters.hermezApi
        .getTokens(undefined, undefined, undefined, undefined, 2049)
        .then((getTokensResponse) => {
          adapters.ethereum
            .getEthereumAccounts(
              wallet,
              getTokensResponse.tokens,
              tokensPriceTask,
              fiatExchangeRates,
              preferredCurrency
            )
            .then((ethereumAccounts) => {
              const ethereumAccount = ethereumAccounts.find((token) => token.token.id === tokenId);

              if (ethereumAccount) {
                dispatch(depositActions.loadEthereumAccountSuccess(ethereumAccount));
              } else {
                dispatch(depositActions.loadEthereumAccountFailure("Ethereum account not found"));
              }
            })
            .catch((error: unknown) => {
              dispatch(processError(error, depositActions.loadEthereumAccountFailure));
            });
        });
    }
  };
}

/**
 * Fetches the accounts to use in the transaction on Ethereum
 */
function fetchEthereumAccounts(
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, tokensPriceTask },
    } = getState();

    dispatch(depositActions.loadEthereumAccounts());

    if (wallet !== undefined) {
      return adapters.hermezApi
        .getTokens(undefined, undefined, undefined, undefined, 2049)
        .then((getTokensResponse) => {
          adapters.ethereum
            .getEthereumAccounts(
              wallet,
              getTokensResponse.tokens,
              tokensPriceTask,
              fiatExchangeRates,
              preferredCurrency
            )
            .then((ethereumAccounts) =>
              dispatch(depositActions.loadEthereumAccountsSuccess(ethereumAccounts))
            )
            .catch((error: unknown) => {
              dispatch(processError(error, depositActions.loadEthereumAccountsFailure));
            });
        });
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
          const depositFee = getTxFee({
            txType: TxType.Deposit,
            gasPrice: maxFeePerGas,
          });

          dispatch(
            depositActions.loadEstimatedDepositFeeSuccess({
              amount: depositFee,
              token: ethToken,
            })
          );
        }
      }
    } catch (error: unknown) {
      dispatch(processError(error, depositActions.loadEstimatedDepositFeeFailure));
    }
  };
}

function deposit(
  amount: BigNumber,
  ethereumAccount: EthereumAccount,
  preferredCurrency: string
): AppThunk {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const {
      global: { wallet, signer, tokensPriceTask, poolTransactionsTask, fiatExchangeRatesTask },
    } = getState();

    dispatch(depositActions.startTransactionApproval());

    if (
      wallet !== undefined &&
      signer !== undefined &&
      isAsyncTaskDataAvailable(fiatExchangeRatesTask) &&
      isAsyncTaskDataAvailable(poolTransactionsTask)
    ) {
      return adapters.hermezApi
        .deposit(
          amount,
          wallet.hermezEthereumAddress,
          ethereumAccount.token,
          wallet.publicKeyCompressedHex,
          signer
        )
        .then((txData) => {
          void adapters.hermezApi
            .getHermezAccounts({
              hermezEthereumAddress: wallet.hermezEthereumAddress,
              tokenIds: [ethereumAccount.token.id],
              poolTransactions: poolTransactionsTask.data,
              fiatExchangeRates: fiatExchangeRatesTask.data,
              tokensPriceTask,
              preferredCurrency,
            })
            .then((res) => {
              const account: HermezAccount | undefined = res.accounts[0];
              dispatch(
                addPendingDeposit({
                  hash: txData.hash,
                  fromHezEthereumAddress: wallet.hermezEthereumAddress,
                  toHezEthereumAddress: wallet.hermezEthereumAddress,
                  token: ethereumAccount.token,
                  amount: amount.toString(),
                  state: TxState.Pending,
                  accountIndex: account?.accountIndex,
                  timestamp: new Date().toISOString(),
                  type: account ? TxType.Deposit : TxType.CreateAccountDeposit,
                })
              );
              handleTransactionSuccess(dispatch, account?.accountIndex);
            });
        })
        .catch((error: unknown) => {
          dispatch(depositActions.stopTransactionApproval());
          dispatch(processError(error));
        });
    }
  };
}

function handleTransactionSuccess(dispatch: AppDispatch, accountIndex?: string) {
  dispatch(openSnackbar({ type: "info-msg", text: "Transaction submitted" }));
  if (accountIndex) {
    dispatch(push(`/accounts/${accountIndex}`));
  } else {
    dispatch(push("/"));
  }
}

export { fetchEthereumAccount, fetchEthereumAccounts, fetchEstimatedDepositFee, deposit };
