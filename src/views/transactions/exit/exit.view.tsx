import React from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router";
import { BigNumber } from "@ethersproject/bignumber";
import { push } from "connected-react-router";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import {
  HermezAccount,
  FiatExchangeRates,
  HermezWallet,
  PoolTransaction,
  RecommendedFee,
  Token,
} from "src/domain/hermez";
import { AppDispatch, AppState } from "src/store";
import { AsyncTask, isAsyncTaskDataAvailable } from "src/utils/types";
import useExitStyles from "src/views/transactions/exit/exit.styles";
import * as exitActions from "src/store/transactions/exit/exit.actions";
import * as exitThunks from "src/store/transactions/exit/exit.thunks";
import { EstimatedL1Fee, Header } from "src/domain";
import { changeHeader } from "src/store/global/global.actions";
import Spinner from "src/views/shared/spinner/spinner.view";
import ExitForm from "src/views/transactions/exit/components/exit-form/exit-form.view";
import TransactionOverview from "src/views/transactions/components/transaction-overview/transaction-overview.view";
import { getFixedTokenAmount } from "src/utils/currencies";

interface ExitStateProps {
  poolTransactionsTask: AsyncTask<PoolTransaction[], Error>;
  step: exitActions.Step;
  accountTask: AsyncTask<HermezAccount, string>;
  feesTask: AsyncTask<RecommendedFee, Error>;
  accountBalanceTask: AsyncTask<BigNumber, Error>;
  estimatedWithdrawFeeTask: AsyncTask<EstimatedL1Fee, Error>;
  isTransactionBeingApproved: boolean;
  transactionToReview: exitActions.TransactionToReview | undefined;
  wallet: HermezWallet.HermezWallet | undefined;
  preferredCurrency: string;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
}

interface ExitHandlerProps {
  onChangeHeader: (step: exitActions.Step, accountIndex: string | null) => void;
  onLoadHermezAccount: (
    accountIndex: string,
    poolTransactions: PoolTransaction[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) => void;
  onLoadFees: () => void;
  onLoadAccountBalance: () => void;
  onLoadEstimatedWithdrawFee: (token: Token, amount: BigNumber) => void;
  onLoadPoolTransactions: () => void;
  onGoToHome: () => void;
  onGoToBuildTransactionStep: (account: HermezAccount) => void;
  onGoToTransactionOverviewStep: (transactionToReview: exitActions.TransactionToReview) => void;
  onExit: (amount: BigNumber, account: HermezAccount, fee: BigNumber) => void;
  onCleanup: () => void;
}

type ExitProps = ExitStateProps & ExitHandlerProps;

function Exit({
  poolTransactionsTask,
  step,
  accountTask,
  feesTask,
  accountBalanceTask,
  estimatedWithdrawFeeTask,
  isTransactionBeingApproved,
  transactionToReview,
  wallet,
  preferredCurrency,
  fiatExchangeRatesTask,
  onChangeHeader,
  onLoadHermezAccount,
  onLoadFees,
  onLoadEstimatedWithdrawFee,
  onLoadPoolTransactions,
  onGoToHome,
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
    onLoadPoolTransactions();
    onLoadFees();
  }, [onLoadPoolTransactions, onLoadFees, onLoadEstimatedWithdrawFee]);

  React.useEffect(() => {
    if (
      poolTransactionsTask.status === "successful" &&
      fiatExchangeRatesTask.status === "successful"
    ) {
      if (accountIndex) {
        onLoadHermezAccount(
          accountIndex,
          poolTransactionsTask.data,
          fiatExchangeRatesTask.data,
          preferredCurrency
        );
      } else {
        onGoToHome();
      }
    }
  }, [
    accountIndex,
    poolTransactionsTask,
    fiatExchangeRatesTask,
    preferredCurrency,
    onGoToHome,
    onLoadHermezAccount,
  ]);

  React.useEffect(() => {
    if (accountTask.status === "failed") {
      onGoToHome();
    }
  }, [accountTask, onGoToHome]);

  React.useEffect(() => onCleanup, [onCleanup]);

  function doesUserHaveEnoughEthForWithdraw(): boolean {
    if (
      isAsyncTaskDataAvailable(accountBalanceTask) &&
      isAsyncTaskDataAvailable(estimatedWithdrawFeeTask)
    ) {
      const formattedEstimatedWithdrawFee = getFixedTokenAmount(
        estimatedWithdrawFeeTask.data.amount.toString()
      );

      return accountBalanceTask.data.lt(formattedEstimatedWithdrawFee);
    } else {
      return true;
    }
  }

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
            return isAsyncTaskDataAvailable(accountTask) ? (
              <ExitForm
                account={accountTask.data}
                preferredCurrency={preferredCurrency}
                fiatExchangeRatesTask={fiatExchangeRatesTask}
                feesTask={feesTask}
                estimatedWithdrawFeeTask={estimatedWithdrawFeeTask}
                doesUserHaveEnoughEthForWithdraw={doesUserHaveEnoughEthForWithdraw()}
                onLoadEstimatedWithdrawFee={onLoadEstimatedWithdrawFee}
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
                isTransactionBeingApproved={isTransactionBeingApproved}
                txType={TxType.Exit}
                amount={transactionToReview.amount}
                account={accountTask.data}
                fee={transactionToReview.fee}
                estimatedWithdrawFeeTask={estimatedWithdrawFeeTask}
                onExit={onExit}
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
        }
      })()}
    </div>
  );
}

const mapStateToProps = (state: AppState): ExitStateProps => ({
  poolTransactionsTask: state.exit.poolTransactionsTask,
  step: state.exit.step,
  wallet: state.global.wallet,
  accountTask: state.exit.accountTask,
  feesTask: state.exit.feesTask,
  accountBalanceTask: state.exit.accountBalanceTask,
  estimatedWithdrawFeeTask: state.exit.estimatedWithdrawFeeTask,
  isTransactionBeingApproved: state.exit.isTransactionBeingApproved,
  transactionToReview: state.exit.transaction,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.myAccount.preferredCurrency,
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

const mapDispatchToProps = (dispatch: AppDispatch): ExitHandlerProps => ({
  onChangeHeader: (step: exitActions.Step, accountIndex: string | null) =>
    dispatch(changeHeader(getHeader(step, accountIndex))),
  onLoadHermezAccount: (
    accountIndex: string,
    poolTransactions: PoolTransaction[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) =>
    dispatch(
      exitThunks.fetchHermezAccount(
        accountIndex,
        poolTransactions,
        fiatExchangeRates,
        preferredCurrency
      )
    ),
  onLoadFees: () => dispatch(exitThunks.fetchFees()),
  onLoadAccountBalance: () => dispatch(exitThunks.fetchAccountBalance()),
  onLoadEstimatedWithdrawFee: (token: Token, amount: BigNumber) => {
    void dispatch(exitThunks.fetchEstimatedWithdrawFee(token, amount));
  },
  onLoadPoolTransactions: () => dispatch(exitThunks.fetchPoolTransactions()),
  onGoToHome: () => dispatch(push("/")),
  onGoToBuildTransactionStep: (account: HermezAccount) =>
    dispatch(exitActions.goToBuildTransactionStep(account)),
  onGoToTransactionOverviewStep: (transactionToReview: exitActions.TransactionToReview) =>
    dispatch(exitActions.goToReviewTransactionStep(transactionToReview)),
  onExit: (amount: BigNumber, from: HermezAccount, fee: BigNumber) =>
    dispatch(exitThunks.exit(amount, from, fee)),
  onCleanup: () => dispatch(exitActions.resetState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Exit);
