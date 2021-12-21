import React from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { push } from "connected-react-router";
import { BigNumber } from "@ethersproject/bignumber";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import * as depositThunks from "src/store/transactions/deposit/deposit.thunks";
import * as depositActions from "src/store/transactions/deposit/deposit.actions";
import * as globalThunks from "src/store/global/global.thunks";
import { changeHeader } from "src/store/global/global.actions";
import { HeaderState } from "src/store/global/global.reducer";
import useTransactionStyles from "src/views/transactions/deposit/deposit.styles";
import TransactionOverview from "src/views/transactions/components/transaction-overview/transaction-overview.view";
import AccountSelector from "src/views/transactions/components/account-selector/account-selector.view";
import Spinner from "src/views/shared/spinner/spinner.view";
import DepositForm from "src/views/transactions/deposit/components/deposit-form/deposit-form.view";
import * as storage from "src/utils/storage";
import { AsyncTask, isAsyncTaskDataAvailable } from "src/utils/types";
import { AppDispatch, AppState } from "src/store";
// domain
import { EstimatedL1Fee } from "src/domain/";
import { HermezWallet, FiatExchangeRates, EthereumAccount } from "src/domain/hermez";
import { PendingDeposits } from "src/domain/local-storage";
import { EthereumNetwork } from "src/domain/ethereum";

interface DepositStateProps {
  ethereumAccountsTask: AsyncTask<EthereumAccount[], Error>;
  ethereumAccountTask: AsyncTask<EthereumAccount, string>;
  estimatedDepositFeeTask: AsyncTask<EstimatedL1Fee, Error>;
  ethereumNetworkTask: AsyncTask<EthereumNetwork, string>;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
  isTransactionBeingApproved: boolean;
  pendingDeposits: PendingDeposits;
  pendingDepositsCheckTask: AsyncTask<null, string>;
  preferredCurrency: string;
  step: depositActions.Step;
  transactionToReview: depositActions.TransactionToReview | undefined;
  wallet: HermezWallet.HermezWallet | undefined;
}

interface DepositHandlerProps {
  onChangeHeader: (step: depositActions.Step, accountIndex: string | null) => void;
  onCheckPendingDeposits: () => void;
  onCleanup: () => void;
  onDeposit: (amount: BigNumber, ethereumAccount: EthereumAccount) => void;
  onGoToBuildTransactionStep: (ethereumAccount: EthereumAccount) => void;
  onGoToChooseAccountStep: () => void;
  onGoToTransactionOverviewStep: (transactionToReview: depositActions.TransactionToReview) => void;
  onLoadEstimatedDepositFee: () => void;
  onLoadEthereumAccount: (tokenId: number) => void;
  onLoadEthereumAccounts: (fiatExchangeRates: FiatExchangeRates, preferredCurrency: string) => void;
}

type DepositProps = DepositStateProps & DepositHandlerProps;

function Deposit({
  ethereumAccountsTask,
  ethereumAccountTask,
  estimatedDepositFeeTask,
  ethereumNetworkTask,
  fiatExchangeRatesTask,
  isTransactionBeingApproved,
  pendingDeposits,
  pendingDepositsCheckTask,
  preferredCurrency,
  step,
  transactionToReview,
  wallet,
  onChangeHeader,
  onCheckPendingDeposits,
  onCleanup,
  onDeposit,
  onGoToBuildTransactionStep,
  onGoToChooseAccountStep,
  onGoToTransactionOverviewStep,
  onLoadEstimatedDepositFee,
  onLoadEthereumAccount,
  onLoadEthereumAccounts,
}: DepositProps) {
  const classes = useTransactionStyles();
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const tokenId = urlSearchParams.get("tokenId");
  const accountIndex = urlSearchParams.get("accountIndex");
  const accountPendingDeposits =
    wallet && isAsyncTaskDataAvailable(ethereumNetworkTask)
      ? storage.getPendingDepositsByHermezAddress(
          pendingDeposits,
          ethereumNetworkTask.data.chainId,
          wallet.hermezEthereumAddress
        )
      : [];

  React.useEffect(() => {
    onChangeHeader(step, accountIndex);
  }, [step, accountIndex, onChangeHeader]);

  React.useEffect(() => {
    onCheckPendingDeposits();
    onLoadEstimatedDepositFee();
  }, [onCheckPendingDeposits, onLoadEstimatedDepositFee]);

  React.useEffect(() => {
    if (pendingDepositsCheckTask.status === "successful") {
      if (tokenId) {
        onLoadEthereumAccount(Number(tokenId));
      } else {
        onGoToChooseAccountStep();
      }
    }
  }, [pendingDepositsCheckTask, tokenId, onLoadEthereumAccount, onGoToChooseAccountStep]);

  React.useEffect(() => {
    if (ethereumAccountTask.status === "failed") {
      onGoToChooseAccountStep();
    }
  }, [ethereumAccountTask, onGoToChooseAccountStep]);

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
                type={TxType.Deposit}
                accountsTask={ethereumAccountsTask}
                pendingDeposits={accountPendingDeposits}
                onLoadAccounts={onLoadEthereumAccounts}
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
              isAsyncTaskDataAvailable(ethereumAccountTask) && (
                <DepositForm
                  account={ethereumAccountTask.data}
                  preferredCurrency={preferredCurrency}
                  fiatExchangeRatesTask={fiatExchangeRatesTask}
                  estimatedDepositFeeTask={estimatedDepositFeeTask}
                  onGoToChooseAccountStep={onGoToChooseAccountStep}
                  onSubmit={onGoToTransactionOverviewStep}
                />
              )
            );
          }
          case "review-transaction": {
            return (
              wallet &&
              transactionToReview &&
              isAsyncTaskDataAvailable(ethereumAccountTask) && (
                <TransactionOverview
                  wallet={wallet}
                  isTransactionBeingApproved={isTransactionBeingApproved}
                  txType={TxType.Deposit}
                  amount={transactionToReview.amount}
                  account={ethereumAccountTask.data}
                  onDeposit={onDeposit}
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

const mapStateToProps = (state: AppState): DepositStateProps => ({
  ethereumAccountsTask: state.deposit.ethereumAccountsTask,
  ethereumAccountTask: state.deposit.ethereumAccountTask,
  estimatedDepositFeeTask: state.deposit.estimatedDepositFeeTask,
  ethereumNetworkTask: state.global.ethereumNetworkTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  isTransactionBeingApproved: state.deposit.isTransactionBeingApproved,
  pendingDeposits: state.global.pendingDeposits,
  pendingDepositsCheckTask: state.global.pendingDepositsCheckTask,
  preferredCurrency: state.myAccount.preferredCurrency,
  step: state.deposit.step,
  transactionToReview: state.deposit.transaction,
  wallet: state.global.wallet,
});

const getHeaderCloseAction = (accountIndex: string | null) => {
  return accountIndex === null ? push("/") : push(`/accounts/${accountIndex}`);
};

const getHeader = (step: depositActions.Step, accountIndex: string | null): HeaderState => {
  switch (step) {
    case "choose-account": {
      return {
        type: "page",
        data: {
          title: "Deposit",
          closeAction: getHeaderCloseAction(accountIndex),
        },
      };
    }
    case "build-transaction": {
      return {
        type: "page",
        data: {
          title: "Deposit",
          goBackAction: accountIndex
            ? push(`/accounts/${accountIndex}`)
            : depositActions.changeCurrentStep("choose-account"),
          closeAction: getHeaderCloseAction(accountIndex),
        },
      };
    }
    case "review-transaction": {
      return {
        type: "page",
        data: {
          title: "Deposit",
          goBackAction: depositActions.changeCurrentStep("build-transaction"),
          closeAction: getHeaderCloseAction(accountIndex),
        },
      };
    }
    default: {
      return { type: undefined };
    }
  }
};

const mapDispatchToProps = (dispatch: AppDispatch): DepositHandlerProps => ({
  onChangeHeader: (step: depositActions.Step, accountIndex: string | null) =>
    dispatch(changeHeader(getHeader(step, accountIndex))),
  onCheckPendingDeposits: () => dispatch(globalThunks.checkPendingDeposits()),
  onLoadEthereumAccount: (tokenId: number) => dispatch(depositThunks.fetchEthereumAccount(tokenId)),
  onLoadEthereumAccounts: (fiatExchangeRates: FiatExchangeRates, preferredCurrency: string) =>
    dispatch(depositThunks.fetchAccounts(fiatExchangeRates, preferredCurrency)),
  onGoToChooseAccountStep: () => dispatch(depositActions.goToChooseAccountStep()),
  onGoToBuildTransactionStep: (ethereumAccount: EthereumAccount) =>
    dispatch(depositActions.goToBuildTransactionStep(ethereumAccount)),
  onGoToTransactionOverviewStep: (transactionToReview: depositActions.TransactionToReview) =>
    dispatch(depositActions.goToReviewTransactionStep(transactionToReview)),
  onLoadEstimatedDepositFee: () => dispatch(depositThunks.fetchEstimatedDepositFee()),
  onDeposit: (amount: BigNumber, ethereumAccount: EthereumAccount) =>
    dispatch(depositThunks.deposit(amount, ethereumAccount)),
  onCleanup: () => dispatch(depositActions.resetState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Deposit);
