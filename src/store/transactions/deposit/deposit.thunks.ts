import { HermezCompressedAmount } from "@hermeznetwork/hermezjs";
import { TxType, TxState } from "@hermeznetwork/hermezjs/src/enums";
import { getProvider } from "@hermeznetwork/hermezjs/src/providers";
import { ETHER_TOKEN_ID } from "@hermeznetwork/hermezjs/src/constants";
import { BigNumber } from "ethers";
import { push } from "connected-react-router";

import { AppState, AppDispatch, AppThunk } from "src/store";
import * as depositActions from "src/store/transactions/deposit/deposit.actions";
import * as globalThunks from "src/store/global/global.thunks";
import { openSnackbar } from "src/store/global/global.actions";
import { getTxFee } from "src/utils/fees";
// domain
import { FiatExchangeRates, EthereumAccount, HermezAccount } from "src/domain";
// adapters
import * as adapters from "src/adapters";

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
              const errorMsg = adapters.parseError(
                error,
                "An error occurred on src/store/transactions/deposit/deposit.thunks.ts:fetchEthereumAccount"
              );
              dispatch(depositActions.loadEthereumAccountFailure(errorMsg));
              dispatch(
                openSnackbar({
                  message: {
                    type: "error",
                    error: errorMsg,
                  },
                })
              );
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
              const errorMsg = adapters.parseError(
                error,
                "An error occurred on src/store/transactions/deposit/deposit.thunks.ts:fetchEthereumAccounts"
              );
              dispatch(depositActions.loadEthereumAccountsFailure(errorMsg));
              dispatch(
                openSnackbar({
                  message: {
                    type: "error",
                    error: errorMsg,
                  },
                })
              );
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
      const errorMsg = adapters.parseError(
        error,
        "An error occurred on src/store/transactions/deposit/deposit.thunks.ts:fetchEstimatedDepositFee"
      );
      dispatch(depositActions.loadEstimatedDepositFeeFailure(errorMsg));
      dispatch(
        openSnackbar({
          message: {
            type: "error",
            error: errorMsg,
          },
        })
      );
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
      return adapters.hermezApi
        .deposit(
          HermezCompressedAmount.compressAmount(amount.toString()),
          wallet.hermezEthereumAddress,
          ethereumAccount.token,
          wallet.publicKeyCompressedHex,
          signer
        )
        .then((txData) => {
          void adapters.hermezApi
            .getAccounts(wallet.hermezEthereumAddress, [ethereumAccount.token.id])
            .then((res) => {
              const account: HermezAccount | undefined = res.accounts[0];
              dispatch(
                globalThunks.addPendingDeposit({
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
          const errorMsg = adapters.parseError(
            error,
            "An error occurred on src/store/transactions/deposit/deposit.thunks.ts:deposit"
          );
          dispatch(depositActions.stopTransactionApproval());
          dispatch(
            openSnackbar({
              message: {
                type: "error",
                error: errorMsg,
              },
            })
          );
        });
    }
  };
}

function handleTransactionSuccess(dispatch: AppDispatch, accountIndex?: string) {
  dispatch(openSnackbar({ message: { type: "info", text: "Transaction submitted" } }));
  if (accountIndex) {
    dispatch(push(`/accounts/${accountIndex}`));
  } else {
    dispatch(push("/"));
  }
}

export { fetchEthereumAccount, fetchEthereumAccounts, fetchEstimatedDepositFee, deposit };
