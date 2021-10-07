import React from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { push } from "connected-react-router";
import { BigNumber } from "@ethersproject/bignumber";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import { AppState, AppDispatch } from "src/store";
import * as transferThunks from "src/store/transactions/transfer/transfer.thunks";
import * as transferActions from "src/store/transactions/transfer/transfer.actions";
import * as transferReducer from "src/store/transactions/transfer/transfer.reducer";
import { changeHeader } from "src/store/global/global.actions";
import useTransferLayoutStyles from "src/views/transactions/transfer/transfer.styles";
import TransactionForm from "src/views/transactions/components/transaction-form/transaction-form.view";
import TransactionOverview from "src/views/transactions/components/transaction-overview/transaction-overview.view";
import AccountSelector from "src/views/transactions/components/account-selector/account-selector.view";
import Spinner from "src/views/shared/spinner/spinner.view";
import * as storage from "src/utils/storage";
import { AsyncTask } from "src/utils/types";
// domain
import { Header } from "src/domain/";
import { EthereumNetwork } from "src/domain/ethereum";
import {
  Account,
  HermezWallet,
  FiatExchangeRates,
  PooledTransaction,
  Deposit,
  Token,
  RecommendedFee,
} from "src/domain/hermez";
// persistence
import * as localStorageDomain from "src/domain/local-storage";

interface TransferViewState {
  ethereumNetworkTask: AsyncTask<EthereumNetwork, string>;
  pooledTransactionsTask: AsyncTask<PooledTransaction[], Error>;
  step: transferActions.Step;
  accountTask: AsyncTask<Account, string>;
  accountsTask: AsyncTask<transferReducer.AccountsWithPagination, Error>;
  feesTask: AsyncTask<RecommendedFee, Error>;
  isTransactionBeingApproved: boolean;
  transactionToReview: transferActions.TransactionToReview | undefined;
  wallet: HermezWallet.HermezWallet | undefined;
  preferredCurrency: string;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
  pendingDeposits: localStorageDomain.PendingDeposits;
  tokensPriceTask: AsyncTask<Token[], string>;
}

interface TransferViewHandlers {
  onChangeHeader: (step: transferActions.Step, accountIndex: string | null) => void;
  onLoadHermezAccount: (
    accountIndex: string,
    pooledTransactions: PooledTransaction[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) => void;
  onLoadFees: () => void;
  onLoadPooledTransactions: () => void;
  onLoadAccounts: (
    fromItem: number | undefined,
    pooledTransactions: PooledTransaction[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) => void;
  onGoToChooseAccountStep: () => void;
  onGoToBuildTransactionStep: (account: Account) => void;
  onGoToTransactionOverviewStep: (transactionToReview: transferActions.TransactionToReview) => void;
  onTransfer: (amount: BigNumber, account: Account, to: Partial<Account>, fee: number) => void;
  onCleanup: () => void;
}

type TransferViewProps = TransferViewState & TransferViewHandlers;

function Transfer({
  ethereumNetworkTask,
  pooledTransactionsTask,
  step,
  accountTask,
  accountsTask,
  feesTask,
  isTransactionBeingApproved,
  transactionToReview,
  wallet,
  preferredCurrency,
  fiatExchangeRatesTask,
  pendingDeposits,
  tokensPriceTask,
  onChangeHeader,
  onLoadHermezAccount,
  onLoadFees,
  onLoadPooledTransactions,
  onLoadAccounts,
  onGoToChooseAccountStep,
  onGoToBuildTransactionStep,
  onGoToTransactionOverviewStep,
  onTransfer,
  onCleanup,
}: TransferViewProps) {
  const classes = useTransferLayoutStyles();
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const receiver = urlSearchParams.get("receiver");
  const accountIndex = urlSearchParams.get("accountIndex");
  const accountPendingDeposits = React.useMemo(
    () =>
      (ethereumNetworkTask.status === "successful" || ethereumNetworkTask.status === "reloading") &&
      wallet !== undefined
        ? storage.getPendingDepositsByHermezAddress(
            pendingDeposits,
            ethereumNetworkTask.data.chainId,
            wallet.hermezEthereumAddress
          )
        : [],
    [ethereumNetworkTask, pendingDeposits, wallet]
  );

  React.useEffect(() => {
    onChangeHeader(step, accountIndex);
  }, [step, accountIndex, onChangeHeader]);

  React.useEffect(() => {
    onLoadPooledTransactions();
  }, [onLoadPooledTransactions]);

  React.useEffect(() => {
    if (
      pooledTransactionsTask.status === "successful" &&
      fiatExchangeRatesTask.status === "successful"
    ) {
      if (accountIndex) {
        onLoadHermezAccount(
          accountIndex,
          pooledTransactionsTask.data,
          fiatExchangeRatesTask.data,
          preferredCurrency
        );
      } else {
        onGoToChooseAccountStep();
      }
    }
  }, [
    accountIndex,
    pooledTransactionsTask,
    fiatExchangeRatesTask,
    preferredCurrency,
    onGoToChooseAccountStep,
    onLoadHermezAccount,
  ]);

  React.useEffect(() => {
    if (accountTask.status === "failed") {
      onGoToChooseAccountStep();
    }
  }, [accountTask, onGoToChooseAccountStep]);

  React.useEffect(() => onCleanup, [onCleanup]);

  return (
    <div className={classes.root}>
      {(() => {
        switch (step) {
          case "load-account": {
            return (
              <div className={classes.spinnerWrapper}>
                <Spinner />
              </div>
            );
          }
          case "choose-account": {
            return (
              <AccountSelector
                transactionType={TxType.Transfer}
                accountsTask={accountsTask}
                pooledTransactionsTask={pooledTransactionsTask}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={
                  fiatExchangeRatesTask.status === "successful" ||
                  fiatExchangeRatesTask.status === "reloading"
                    ? fiatExchangeRatesTask.data
                    : {}
                }
                pendingDeposits={accountPendingDeposits}
                onLoadAccounts={onLoadAccounts}
                onAccountClick={(account: Account) => onGoToBuildTransactionStep(account)}
              />
            );
          }
          case "build-transaction": {
            return accountTask.status === "successful" || accountTask.status === "reloading" ? (
              <TransactionForm
                account={accountTask.data}
                transactionType={TxType.Transfer}
                receiverAddress={receiver}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={
                  fiatExchangeRatesTask.status === "successful" ||
                  fiatExchangeRatesTask.status === "reloading"
                    ? fiatExchangeRatesTask.data
                    : {}
                }
                feesTask={feesTask}
                tokensPriceTask={tokensPriceTask}
                // ToDo: To be removed START
                accountBalanceTask={{ status: "pending" }}
                estimatedWithdrawFeeTask={{ status: "pending" }}
                estimatedDepositFeeTask={{ status: "pending" }}
                onLoadAccountBalance={() => ({})}
                onLoadEstimatedWithdrawFee={() => ({})}
                onLoadEstimatedDepositFee={() => ({})}
                // ToDo: To be removed END
                onLoadFees={onLoadFees}
                onSubmit={onGoToTransactionOverviewStep}
                onGoToChooseAccountStep={onGoToChooseAccountStep}
              />
            ) : null;
          }
          case "review-transaction": {
            return wallet !== undefined &&
              transactionToReview !== undefined &&
              (accountTask.status === "successful" || accountTask.status === "reloading") ? (
              <TransactionOverview
                wallet={wallet}
                isTransactionBeingApproved={isTransactionBeingApproved}
                transaction={{
                  type: TxType.Transfer,
                  amount: transactionToReview.amount,
                  account: accountTask.data,
                  to: transactionToReview.to,
                  fee: transactionToReview.fee,
                  onTransfer,
                }}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={
                  fiatExchangeRatesTask.status === "successful" ||
                  fiatExchangeRatesTask.status === "reloading"
                    ? fiatExchangeRatesTask.data
                    : {}
                }
              />
            ) : null;
          }
          default: {
            return <></>;
          }
        }
      })()}
    </div>
  );
}

const mapStateToProps = (state: AppState): TransferViewState => ({
  ethereumNetworkTask: state.global.ethereumNetworkTask,
  pooledTransactionsTask: state.transfer.pooledTransactionsTask,
  step: state.transfer.step,
  wallet: state.global.wallet,
  accountTask: state.transfer.accountTask,
  accountsTask: state.transfer.accountsTask,
  feesTask: state.transfer.feesTask,
  isTransactionBeingApproved: state.transfer.isTransactionBeingApproved,
  transactionToReview: state.transfer.transaction,
  pendingDeposits: state.global.pendingDeposits,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.myAccount.preferredCurrency,
  tokensPriceTask: state.global.tokensPriceTask,
});

const getHeaderCloseAction = (accountIndex: string | null) => {
  return accountIndex === null ? push("/") : push(`/accounts/${accountIndex}`);
};

const getHeader = (step: transferActions.Step, accountIndex: string | null): Header => {
  switch (step) {
    case "choose-account": {
      return {
        type: "page",
        data: {
          title: "Token",
          closeAction: getHeaderCloseAction(accountIndex),
        },
      };
    }
    case "build-transaction": {
      return {
        type: "page",
        data: {
          title: "Send",
          goBackAction: accountIndex
            ? push(`/accounts/${accountIndex}`)
            : transferActions.changeCurrentStep("choose-account"),
          closeAction: getHeaderCloseAction(accountIndex),
        },
      };
    }
    case "review-transaction": {
      return {
        type: "page",
        data: {
          title: "Send",
          goBackAction: transferActions.changeCurrentStep("build-transaction"),
          closeAction: getHeaderCloseAction(accountIndex),
        },
      };
    }
    default: {
      return { type: undefined };
    }
  }
};

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onChangeHeader: (step: transferActions.Step, accountIndex: string | null) =>
    dispatch(changeHeader(getHeader(step, accountIndex))),
  onLoadHermezAccount: (
    accountIndex: string,
    pooledTransactions: PooledTransaction[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) =>
    dispatch(
      transferThunks.fetchHermezAccount(
        accountIndex,
        pooledTransactions,
        fiatExchangeRates,
        preferredCurrency
      )
    ),
  onLoadFees: () => dispatch(transferThunks.fetchFees()),
  onLoadPooledTransactions: () => dispatch(transferThunks.fetchPoolTransactions()),
  onLoadAccounts: (
    fromItem: number | undefined,
    pooledTransactions: PooledTransaction[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) =>
    dispatch(
      transferThunks.fetchAccounts(
        fromItem,
        pooledTransactions,
        fiatExchangeRates,
        preferredCurrency
      )
    ),
  onGoToChooseAccountStep: () => dispatch(transferActions.goToChooseAccountStep()),
  onGoToBuildTransactionStep: (account: Account) =>
    dispatch(transferActions.goToBuildTransactionStep(account)),
  onGoToTransactionOverviewStep: (transactionToReview: transferActions.TransactionToReview) =>
    dispatch(transferActions.goToReviewTransactionStep(transactionToReview)),
  onTransfer: (amount: BigNumber, from: Account, to: Partial<Account>, fee: number) =>
    dispatch(transferThunks.transfer(amount, from, to, fee)),
  onCleanup: () => dispatch(transferActions.resetState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);
