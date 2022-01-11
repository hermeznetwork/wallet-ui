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
import * as ethereum from "src/utils/ethereum";
import { convertTokenAmountToFiat } from "src/utils/currencies";
import { getTxFee } from "src/utils/fees";
import theme from "src/styles/theme";
// domain
import { FiatExchangeRates, EthereumAccount, HermezAccount } from "src/domain";
// persistence
import * as persistence from "src/persistence";

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
      return persistence.getTokens(undefined, undefined, undefined, undefined, 2049).then((res) => {
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
            const errorMsg = persistence.getErrorMessage(
              error,
              "Oops ... There was an error fetching the ethereum account"
            );
            dispatch(depositActions.loadEthereumAccountFailure(errorMsg));
          });
      });
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
      return persistence.getTokens(undefined, undefined, undefined, undefined, 2049).then((res) => {
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
      return persistence
        .deposit(
          HermezCompressedAmount.compressAmount(amount.toString()),
          wallet.hermezEthereumAddress,
          ethereumAccount.token,
          wallet.publicKeyCompressedHex,
          signer
        )
        .then((txData) => {
          void persistence
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
        .catch((error) => {
          dispatch(depositActions.stopTransactionApproval());
          handleTransactionFailure(dispatch, error);
        });
    }
  };
}

function handleTransactionSuccess(dispatch: AppDispatch, accountIndex?: string) {
  dispatch(openSnackbar("Transaction submitted"));
  if (accountIndex) {
    dispatch(push(`/accounts/${accountIndex}`));
  } else {
    dispatch(push("/"));
  }
}

function handleTransactionFailure(dispatch: AppDispatch, error: unknown) {
  const errorMsg = persistence.getErrorMessage(error);
  dispatch(depositActions.stopTransactionApproval());
  dispatch(openSnackbar(`Transaction failed - ${errorMsg}`, theme.palette.red.main));
}

export { fetchEthereumAccount, fetchAccounts, fetchEstimatedDepositFee, deposit };
