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
import { HeaderState } from "src/store/global/global.reducer";
import useTransferStyles from "src/views/transactions/transfer/transfer.styles";
import TransactionOverview from "src/views/transactions/components/transaction-overview/transaction-overview.view";
import AccountSelector from "src/views/transactions/components/account-selector/account-selector.view";
import Spinner from "src/views/shared/spinner/spinner.view";
import { AsyncTask, isAsyncTaskDataAvailable } from "src/utils/types";
import TransferForm, {
  TxData,
} from "src/views/transactions/transfer/components/transfer-form/transfer-form.view";
// domain
import {
  FiatExchangeRates,
  HermezAccount,
  HermezWallet,
  PoolTransaction,
  RecommendedFee,
  TransactionReceiver,
} from "src/domain";

interface TransferStateProps {
  poolTransactionsTask: AsyncTask<PoolTransaction[], Error>;
  step: transferActions.Step;
  accountTask: AsyncTask<HermezAccount, string>;
  accountsTask: AsyncTask<transferReducer.AccountsWithPagination, Error>;
  feesTask: AsyncTask<RecommendedFee, Error>;
  hasReceiverApprovedAccountsCreation?: boolean;
  isTransactionBeingApproved: boolean;
  transactionToReview: transferActions.TransactionToReview | undefined;
  wallet: HermezWallet.HermezWallet | undefined;
  preferredCurrency: string;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
}

interface TransferHandlerProps {
  onChangeHeader: (step: transferActions.Step, accountIndex?: string) => void;
  onLoadHermezAccount: (
    accountIndex: string,
    poolTransactions: PoolTransaction[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) => void;
  onLoadFees: () => void;
  onLoadPoolTransactions: () => void;
  onLoadAccounts: (
    fromItem: number | undefined,
    poolTransactions: PoolTransaction[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) => void;
  onGoToChooseAccountStep: () => void;
  onGoToBuildTransactionStep: (account: HermezAccount) => void;
  onGoToTransactionOverviewStep: (transactionToReview: transferActions.TransactionToReview) => void;
  onCheckTxData: (txData: TxData) => void;
  onResetReceiverCreateAccountsAuthorizationStatus: () => void;
  onTransfer: (
    amount: BigNumber,
    account: HermezAccount,
    to: TransactionReceiver,
    fee: BigNumber
  ) => void;
  onCleanup: () => void;
}

type TransferProps = TransferStateProps & TransferHandlerProps;

function Transfer({
  poolTransactionsTask,
  step,
  accountTask,
  accountsTask,
  feesTask,
  hasReceiverApprovedAccountsCreation,
  isTransactionBeingApproved,
  transactionToReview,
  wallet,
  preferredCurrency,
  fiatExchangeRatesTask,
  onChangeHeader,
  onLoadHermezAccount,
  onLoadFees,
  onLoadPoolTransactions,
  onLoadAccounts,
  onGoToChooseAccountStep,
  onGoToBuildTransactionStep,
  onCheckTxData,
  onResetReceiverCreateAccountsAuthorizationStatus,
  onTransfer,
  onCleanup,
}: TransferProps) {
  const classes = useTransferStyles();
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const receiver = urlSearchParams.get("receiver") || undefined;
  const accountIndex = urlSearchParams.get("accountIndex") || undefined;

  React.useEffect(() => {
    onChangeHeader(step, accountIndex);
  }, [step, accountIndex, onChangeHeader]);

  React.useEffect(() => {
    onLoadPoolTransactions();
    onLoadFees();
  }, [onLoadPoolTransactions, onLoadFees]);

  React.useEffect(() => {
    if (
      isAsyncTaskDataAvailable(poolTransactionsTask) &&
      isAsyncTaskDataAvailable(fiatExchangeRatesTask)
    ) {
      if (accountIndex) {
        onLoadHermezAccount(
          accountIndex,
          poolTransactionsTask.data,
          fiatExchangeRatesTask.data,
          preferredCurrency
        );
      } else {
        onGoToChooseAccountStep();
      }
    }
  }, [
    accountIndex,
    poolTransactionsTask,
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
                type={TxType.Transfer}
                accountsTask={accountsTask}
                poolTransactionsTask={poolTransactionsTask}
                onLoadAccounts={onLoadAccounts}
                onAccountClick={onGoToBuildTransactionStep}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={
                  fiatExchangeRatesTask.status === "successful" ||
                  fiatExchangeRatesTask.status === "reloading"
                    ? fiatExchangeRatesTask.data
                    : {}
                }
              />
            );
          }
          case "build-transaction": {
            return (
              isAsyncTaskDataAvailable(accountTask) && (
                <TransferForm
                  account={accountTask.data}
                  defaultReceiverAddress={receiver}
                  preferredCurrency={preferredCurrency}
                  fiatExchangeRatesTask={fiatExchangeRatesTask}
                  feesTask={feesTask}
                  hasReceiverApprovedAccountsCreation={hasReceiverApprovedAccountsCreation}
                  onGoToChooseAccountStep={onGoToChooseAccountStep}
                  onResetReceiverCreateAccountsAuthorizationStatus={
                    onResetReceiverCreateAccountsAuthorizationStatus
                  }
                  onSubmit={onCheckTxData}
                />
              )
            );
          }
          case "review-transaction": {
            return (
              wallet &&
              transactionToReview &&
              isAsyncTaskDataAvailable(accountTask) && (
                <TransactionOverview
                  wallet={wallet}
                  isTransactionBeingApproved={isTransactionBeingApproved}
                  txType={TxType.Transfer}
                  amount={transactionToReview.amount}
                  account={accountTask.data}
                  to={transactionToReview.to}
                  fee={transactionToReview.fee}
                  onTransfer={onTransfer}
                  preferredCurrency={preferredCurrency}
                  fiatExchangeRates={
                    fiatExchangeRatesTask.status === "successful" ||
                    fiatExchangeRatesTask.status === "reloading"
                      ? fiatExchangeRatesTask.data
                      : {}
                  }
                />
              )
            );
          }
        }
      })()}
    </div>
  );
}

const mapStateToProps = (state: AppState): TransferStateProps => ({
  poolTransactionsTask: state.transfer.poolTransactionsTask,
  step: state.transfer.step,
  wallet: state.global.wallet,
  accountTask: state.transfer.accountTask,
  accountsTask: state.transfer.accountsTask,
  feesTask: state.transfer.feesTask,
  hasReceiverApprovedAccountsCreation: state.transfer.hasReceiverApprovedAccountsCreation,
  isTransactionBeingApproved: state.transfer.isTransactionBeingApproved,
  transactionToReview: state.transfer.transaction,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.myAccount.preferredCurrency,
});

const getHeaderCloseAction = (accountIndex?: string) => {
  return accountIndex ? push(`/accounts/${accountIndex}`) : push("/");
};

const getHeader = (step: transferActions.Step, accountIndex?: string): HeaderState => {
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

const mapDispatchToProps = (dispatch: AppDispatch): TransferHandlerProps => ({
  onChangeHeader: (step: transferActions.Step, accountIndex?: string) =>
    dispatch(changeHeader(getHeader(step, accountIndex))),
  onLoadHermezAccount: (
    accountIndex: string,
    poolTransactions: PoolTransaction[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) =>
    dispatch(
      transferThunks.fetchHermezAccount(
        accountIndex,
        poolTransactions,
        fiatExchangeRates,
        preferredCurrency
      )
    ),
  onLoadFees: () => dispatch(transferThunks.fetchFees()),
  onLoadPoolTransactions: () => dispatch(transferThunks.fetchPoolTransactions()),
  onLoadAccounts: (
    fromItem: number | undefined,
    poolTransactions: PoolTransaction[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) =>
    dispatch(
      transferThunks.fetchAccounts(fromItem, poolTransactions, fiatExchangeRates, preferredCurrency)
    ),
  onGoToChooseAccountStep: () => dispatch(transferActions.goToChooseAccountStep()),
  onGoToBuildTransactionStep: (account: HermezAccount) =>
    dispatch(transferActions.goToBuildTransactionStep(account)),
  onGoToTransactionOverviewStep: (transactionToReview: transferActions.TransactionToReview) =>
    dispatch(transferActions.goToReviewTransactionStep(transactionToReview)),
  onCheckTxData: (txData: TxData) => dispatch(transferThunks.checkTxData(txData)),
  onResetReceiverCreateAccountsAuthorizationStatus: () =>
    dispatch(transferActions.setReceiverCreateAccountsAuthorizationStatus(undefined)),
  onTransfer: (amount: BigNumber, from: HermezAccount, to: TransactionReceiver, fee: BigNumber) =>
    dispatch(transferThunks.transfer(amount, from, to, fee)),
  onCleanup: () => dispatch(transferActions.resetState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);
