import React from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router";
import { BigNumber } from "@ethersproject/bignumber";
import { push } from "connected-react-router";

import {
  Account,
  FiatExchangeRates,
  HermezWallet,
  PooledTransaction,
  RecommendedFee,
  Token,
} from "src/domain/hermez";
import { AppDispatch, AppState } from "src/store";
import { AsyncTask } from "src/utils/types";
import useExitStyles from "src/views/transactions/exit/exit.styles";
import * as exitActions from "src/store/transactions/exit/exit.actions";
import * as exitThunks from "src/store/transactions/exit/exit.thunks";
import { EstimatedWithdrawFee, Header } from "src/domain";
import { changeHeader } from "src/store/global/global.actions";
import Spinner from "src/views/shared/spinner/spinner.view";
import TransactionForm from "src/views/transactions/components/transaction-form/transaction-form.view";
import TransactionOverview from "src/views/transactions/components/transaction-overview/transaction-overview.view";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

interface ExitState {
  pooledTransactionsTask: AsyncTask<PooledTransaction[], Error>;
  step: exitActions.Step;
  accountTask: AsyncTask<Account, string>;
  feesTask: AsyncTask<RecommendedFee, Error>;
  estimatedWithdrawFeeTask: AsyncTask<EstimatedWithdrawFee, Error>;
  isTransactionBeingApproved: boolean;
  transactionToReview: exitActions.TransactionToReview | undefined;
  wallet: HermezWallet.HermezWallet | undefined;
  preferredCurrency: string;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
  tokensPriceTask: AsyncTask<Token[], string>;
}

interface ExitHandlers {
  onChangeHeader: (step: exitActions.Step, accountIndex: string | null) => void;
  onLoadHermezAccount: (
    accountIndex: string,
    pooledTransactions: PooledTransaction[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) => void;
  onLoadFees: () => void;
  onLoadEstimatedWithdrawFee: (token: Token, amount: BigNumber) => void;
  onLoadPooledTransactions: () => void;
  onLoadAccounts: (
    fromItem: number | undefined,
    pooledTransactions: PooledTransaction[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) => void;
  onGoToChooseAccountStep: () => void;
  onGoToBuildTransactionStep: (account: Account) => void;
  onGoToTransactionOverviewStep: (transactionToReview: exitActions.TransactionToReview) => void;
  onExit: (amount: BigNumber, account: Account, fee: number) => void;
  onCleanup: () => void;
}

type ExitProps = ExitState & ExitHandlers;

function Exit({
  pooledTransactionsTask,
  step,
  accountTask,
  feesTask,
  estimatedWithdrawFeeTask,
  isTransactionBeingApproved,
  transactionToReview,
  wallet,
  preferredCurrency,
  fiatExchangeRatesTask,
  tokensPriceTask,
  onChangeHeader,
  onLoadHermezAccount,
  onLoadFees,
  onLoadEstimatedWithdrawFee,
  onLoadPooledTransactions,
  onGoToChooseAccountStep,
  onGoToTransactionOverviewStep,
  onExit,
  onCleanup,
}: ExitProps) {
  const classes = useExitStyles();
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const accountIndex = urlSearchParams.get("accountIndex");

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
          case "build-transaction": {
            return accountTask.status === "successful" || accountTask.status === "reloading" ? (
              <TransactionForm
                account={accountTask.data}
                transactionType={TxType.Exit}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={
                  fiatExchangeRatesTask.status === "successful" ||
                  fiatExchangeRatesTask.status === "reloading"
                    ? fiatExchangeRatesTask.data
                    : {}
                }
                feesTask={feesTask}
                tokensPriceTask={tokensPriceTask}
                estimatedWithdrawFeeTask={estimatedWithdrawFeeTask}
                // ToDo: To be removed START
                receiverAddress={undefined}
                accountBalanceTask={{ status: "pending" }}
                estimatedDepositFeeTask={{ status: "pending" }}
                onLoadAccountBalance={() => ({})}
                onLoadEstimatedDepositFee={() => ({})}
                // ToDo: To be removed END
                onLoadEstimatedWithdrawFee={onLoadEstimatedWithdrawFee}
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
                  type: TxType.Exit,
                  amount: transactionToReview.amount,
                  account: accountTask.data,
                  fee: transactionToReview.fee,
                  estimatedWithdrawFeeTask,
                  onExit,
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

const mapStateToProps = (state: AppState): ExitState => ({
  pooledTransactionsTask: state.exit.pooledTransactionsTask,
  step: state.exit.step,
  wallet: state.global.wallet,
  accountTask: state.exit.accountTask,
  feesTask: state.exit.feesTask,
  estimatedWithdrawFeeTask: state.exit.estimatedWithdrawFeeTask,
  isTransactionBeingApproved: state.exit.isTransactionBeingApproved,
  transactionToReview: state.exit.transaction,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.myAccount.preferredCurrency,
  tokensPriceTask: state.global.tokensPriceTask,
});

const getHeaderCloseAction = (accountIndex: string | null) => {
  return accountIndex === null ? push("/") : push(`/accounts/${accountIndex}`);
};

const getHeader = (step: exitActions.Step, accountIndex: string | null): Header => {
  switch (step) {
    case "build-transaction": {
      return {
        type: "page",
        data: {
          title: "Withdraw",
          closeAction: getHeaderCloseAction(accountIndex),
        },
      };
    }
    case "review-transaction": {
      return {
        type: "page",
        data: {
          title: "Withdraw",
          goBackAction: exitActions.changeCurrentStep("build-transaction"),
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
  onChangeHeader: (step: exitActions.Step, accountIndex: string | null) =>
    dispatch(changeHeader(getHeader(step, accountIndex))),
  onLoadHermezAccount: (
    accountIndex: string,
    pooledTransactions: PooledTransaction[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) =>
    dispatch(
      exitThunks.fetchHermezAccount(
        accountIndex,
        pooledTransactions,
        fiatExchangeRates,
        preferredCurrency
      )
    ),
  onLoadFees: () => dispatch(exitThunks.fetchFees()),
  onLoadEstimatedWithdrawFee: (token: Token, amount: BigNumber) => {
    void dispatch(exitThunks.fetchEstimatedWithdrawFee(token, amount));
  },
  onLoadPooledTransactions: () => dispatch(exitThunks.fetchPoolTransactions()),
  onGoToBuildTransactionStep: (account: Account) =>
    dispatch(exitActions.goToBuildTransactionStep(account)),
  onGoToTransactionOverviewStep: (transactionToReview: exitActions.TransactionToReview) =>
    dispatch(exitActions.goToReviewTransactionStep(transactionToReview)),
  onExit: (amount: BigNumber, from: Account, fee: number) =>
    dispatch(exitThunks.exit(amount, from, fee)),
  onCleanup: () => dispatch(exitActions.resetState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Exit);