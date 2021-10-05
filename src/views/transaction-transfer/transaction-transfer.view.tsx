// /* eslint-disable */
// // @ts-nocheck
import React from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { push } from "connected-react-router";
import { BigNumber } from "@ethersproject/bignumber";

import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { RootState } from "src/store";
import { AppDispatch } from "src";
import * as transactionThunks from "src/store/transaction-transfer/transaction-transfer.thunks";
import * as transactionActions from "src/store/transaction-transfer/transaction-transfer.actions";
import * as transactionReducer from "src/store/transaction-transfer/transaction-transfer.reducer";
import { changeHeader } from "src/store/global/global.actions";
import useTransactionStyles from "src/views/transaction-transfer/transaction-transfer.styles";
import TransactionForm from "src/views/transaction-transfer/components/transaction-form/transaction-form.view";
import TransactionOverview from "src/views/transaction-transfer/components/transaction-overview/transaction-overview.view";
import AccountSelector from "src/views/transaction-transfer/components/account-selector/account-selector.view";
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
} from "src/domain/hermez";
// persistence
import * as localStorageDomain from "src/domain/local-storage";

interface TransactionViewState {
  ethereumNetworkTask: AsyncTask<EthereumNetwork, string>;
  pooledTransactionsTask: AsyncTask<PooledTransaction[], Error>;
  step: transactionActions.Step;
  accountTask: AsyncTask<Account, string>;
  accountsTask: AsyncTask<transactionReducer.AccountsWithPagination, Error>;
  accountBalanceTask: AsyncTask<unknown, Error>;
  feesTask: AsyncTask<unknown, Error>;
  isTransactionBeingApproval: boolean;
  transactionToReview: transactionActions.TransactionToReview | undefined;
  wallet: HermezWallet.HermezWallet | undefined;
  preferredCurrency: string;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
  pendingDeposits: localStorageDomain.PendingDeposits;
}

interface TransactionViewHandlers {
  onChangeHeader: (step: transactionActions.Step, accountIndex: string | null) => void;
  onLoadHermezAccount: (
    accountIndex: string,
    pooledTransactions: PooledTransaction[],
    accountPendingDeposits: Deposit[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) => void;
  onLoadAccountBalance: () => void;
  onLoadFees: () => void;
  onLoadPooledTransactions: () => void;
  onLoadAccounts: (
    fromItem: number | undefined,
    pooledTransactions: PooledTransaction[],
    pendingDeposits: Deposit[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) => void;
  onGoToChooseAccountStep: () => void;
  onGoToBuildTransactionStep: (account: Account) => void;
  onGoToTransactionOverviewStep: (
    transactionToReview: transactionActions.TransactionToReview
  ) => void;
  onTransfer: (amount: BigNumber, account: Account, to: Partial<Account>, fee: number) => void;
  onCleanup: () => void;
}

type TransactionViewProps = TransactionViewState & TransactionViewHandlers;

function Transaction({
  ethereumNetworkTask,
  pooledTransactionsTask,
  step,
  accountTask,
  accountsTask,
  accountBalanceTask,
  feesTask,
  isTransactionBeingApproval,
  transactionToReview,
  wallet,
  preferredCurrency,
  fiatExchangeRatesTask,
  pendingDeposits,
  onChangeHeader,
  onLoadHermezAccount,
  onLoadAccountBalance,
  onLoadFees,
  onLoadPooledTransactions,
  onLoadAccounts,
  onGoToChooseAccountStep,
  onGoToBuildTransactionStep,
  onGoToTransactionOverviewStep,
  onTransfer,
  onCleanup,
}: TransactionViewProps) {
  const classes = useTransactionStyles();
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
          accountPendingDeposits,
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
    accountPendingDeposits,
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
                accountBalanceTask={accountBalanceTask}
                feesTask={feesTask}
                // ToDo: To be removed
                estimatedWithdrawFeeTask={{ status: "pending" }}
                onLoadAccountBalance={onLoadAccountBalance}
                onLoadFees={onLoadFees}
                // ToDo: To be removed
                onLoadEstimatedWithdrawFee={() => ({})}
                onSubmit={onGoToTransactionOverviewStep}
              />
            ) : null;
          }
          case "review-transaction": {
            return wallet !== undefined &&
              transactionToReview !== undefined &&
              (accountTask.status === "successful" || accountTask.status === "reloading") ? (
              <TransactionOverview
                wallet={wallet}
                isTransactionBeingApproval={isTransactionBeingApproval}
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

const mapStateToProps = (state: RootState): TransactionViewState => ({
  ethereumNetworkTask: state.global.ethereumNetworkTask,
  pooledTransactionsTask: state.transactionTransfer.pooledTransactionsTask,
  step: state.transactionTransfer.step,
  wallet: state.global.wallet,
  accountTask: state.transactionTransfer.accountTask,
  accountsTask: state.transactionTransfer.accountsTask,
  accountBalanceTask: state.transactionTransfer.accountBalanceTask,
  feesTask: state.transactionTransfer.feesTask,
  isTransactionBeingApproval: state.transactionTransfer.isTransactionBeingApproval,
  transactionToReview: state.transactionTransfer.transaction,
  pendingDeposits: state.global.pendingDeposits,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.myAccount.preferredCurrency,
});

const getHeaderCloseAction = (accountIndex: string | null) => {
  return accountIndex === null ? push("/") : push(`/accounts/${accountIndex}`);
};

const getHeader = (step: transactionActions.Step, accountIndex: string | null): Header => {
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
            : transactionActions.changeCurrentStep("choose-account"),
          closeAction: getHeaderCloseAction(accountIndex),
        },
      };
    }
    case "review-transaction": {
      return {
        type: "page",
        data: {
          title: "Send",
          goBackAction: transactionActions.changeCurrentStep("build-transaction"),
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
  onChangeHeader: (step: transactionActions.Step, accountIndex: string | null) =>
    dispatch(changeHeader(getHeader(step, accountIndex))),
  onLoadHermezAccount: (
    accountIndex: string,
    pooledTransactions: PooledTransaction[],
    accountPendingDeposits: Deposit[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) =>
    dispatch(
      transactionThunks.fetchHermezAccount(
        accountIndex,
        pooledTransactions,
        accountPendingDeposits,
        fiatExchangeRates,
        preferredCurrency
      )
    ),
  onLoadAccountBalance: () => dispatch(transactionThunks.fetchAccountBalance()),
  onLoadFees: () => dispatch(transactionThunks.fetchFees()),
  onLoadPooledTransactions: () => dispatch(transactionThunks.fetchPoolTransactions()),
  onLoadAccounts: (
    fromItem: number | undefined,
    pooledTransactions: PooledTransaction[],
    pendingDeposits: Deposit[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) =>
    dispatch(
      transactionThunks.fetchAccounts(
        fromItem,
        pooledTransactions,
        pendingDeposits,
        fiatExchangeRates,
        preferredCurrency
      )
    ),
  onGoToChooseAccountStep: () => dispatch(transactionActions.goToChooseAccountStep()),
  onGoToBuildTransactionStep: (account: Account) =>
    dispatch(transactionActions.goToBuildTransactionStep(account)),
  onGoToTransactionOverviewStep: (transactionToReview: transactionActions.TransactionToReview) =>
    dispatch(transactionActions.goToReviewTransactionStep(transactionToReview)),
  onTransfer: (amount: BigNumber, from: Account, to: Partial<Account>, fee: number) =>
    dispatch(transactionThunks.transfer(amount, from, to, fee)),
  onCleanup: () => dispatch(transactionActions.resetState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
