import React from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { push } from "connected-react-router";
import { BigNumber } from "@ethersproject/bignumber";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import * as depositThunks from "src/store/transactions/deposit/deposit.thunks";
import * as depositActions from "src/store/transactions/deposit/deposit.actions";
import * as globalThunks from "src/store/global/global.thunks";
import useTransactionStyles from "src/views/transactions/deposit/deposit.styles";
import TransactionForm from "src/views/transactions/components/transaction-form/transaction-form.view";
import TransactionOverview from "src/views/transactions/components/transaction-overview/transaction-overview.view";
import AccountSelector from "src/views/transactions/components/account-selector/account-selector.view";
import { changeHeader } from "src/store/global/global.actions";
import Spinner from "src/views/shared/spinner/spinner.view";
import * as storage from "src/utils/storage";
import { AsyncTask } from "src/utils/types";
import { AppDispatch, AppState } from "src/store";
// domain
import { Header, EstimatedDepositFee } from "src/domain/";
import {
  HermezWallet,
  FiatExchangeRates,
  PoolTransaction,
  Token,
  RecommendedFee,
  EthereumAccount,
} from "src/domain/hermez";
import { PendingDeposits } from "src/domain/local-storage";
import { EthereumNetwork } from "src/domain/ethereum";

interface DepositStateProps {
  ethereumAccountsTask: AsyncTask<EthereumAccount[], Error>;
  ethereumAccountTask: AsyncTask<EthereumAccount, string>;
  estimatedDepositFeeTask: AsyncTask<EstimatedDepositFee, Error>;
  ethereumNetworkTask: AsyncTask<EthereumNetwork, string>;
  feesTask: AsyncTask<RecommendedFee, Error>;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
  isTransactionBeingApproved: boolean;
  pendingDeposits: PendingDeposits;
  pendingDepositsCheckTask: AsyncTask<null, string>;
  poolTransactionsTask: AsyncTask<PoolTransaction[], Error>;
  preferredCurrency: string;
  step: depositActions.Step;
  tokensPriceTask: AsyncTask<Token[], string>;
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
  onLoadEstimatedDepositFee: (token: Token, amount: BigNumber) => void;
  onLoadEthereumAccount: (tokenId: number) => void;
  onLoadEthereumAccounts: (fiatExchangeRates: FiatExchangeRates, preferredCurrency: string) => void;
  onLoadFees: () => void;
  onLoadPoolTransactions: () => void;
}

type DepositProps = DepositStateProps & DepositHandlerProps;

function Deposit({
  ethereumAccountsTask,
  ethereumAccountTask,
  estimatedDepositFeeTask,
  ethereumNetworkTask,
  feesTask,
  fiatExchangeRatesTask,
  isTransactionBeingApproved,
  pendingDeposits,
  pendingDepositsCheckTask,
  poolTransactionsTask,
  preferredCurrency,
  step,
  tokensPriceTask,
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
  onLoadFees,
  onLoadPoolTransactions,
}: DepositProps) {
  const classes = useTransactionStyles();
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const tokenId = urlSearchParams.get("tokenId");
  const accountIndex = urlSearchParams.get("accountIndex");
  const accountPendingDeposits =
    wallet !== undefined &&
    (ethereumNetworkTask.status === "successful" || ethereumNetworkTask.status === "reloading")
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
  }, [onCheckPendingDeposits]);

  React.useEffect(() => {
    onLoadPoolTransactions();
  }, [onLoadPoolTransactions]);

  React.useEffect(() => {
    if (
      pendingDepositsCheckTask.status === "successful" &&
      poolTransactionsTask.status === "successful"
    ) {
      if (tokenId) {
        onLoadEthereumAccount(Number(tokenId));
      } else {
        onGoToChooseAccountStep();
      }
    }
  }, [
    pendingDepositsCheckTask,
    poolTransactionsTask,
    tokenId,
    accountIndex,
    onLoadEthereumAccount,
    onGoToChooseAccountStep,
  ]);

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
                transactionType={TxType.Deposit}
                accountsTask={ethereumAccountsTask}
                poolTransactionsTask={poolTransactionsTask}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={
                  fiatExchangeRatesTask.status === "successful" ||
                  fiatExchangeRatesTask.status === "reloading"
                    ? fiatExchangeRatesTask.data
                    : {}
                }
                pendingDeposits={accountPendingDeposits}
                onLoadAccounts={onLoadEthereumAccounts}
                onAccountClick={(ethereumAccount: EthereumAccount) =>
                  onGoToBuildTransactionStep(ethereumAccount)
                }
              />
            );
          }
          case "build-transaction": {
            return ethereumAccountTask.status === "successful" ||
              ethereumAccountTask.status === "reloading" ? (
              <TransactionForm
                account={ethereumAccountTask.data}
                transactionType={TxType.Deposit}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={
                  fiatExchangeRatesTask.status === "successful" ||
                  fiatExchangeRatesTask.status === "reloading"
                    ? fiatExchangeRatesTask.data
                    : {}
                }
                feesTask={feesTask}
                tokensPriceTask={tokensPriceTask}
                estimatedDepositFeeTask={estimatedDepositFeeTask}
                // ToDo: To be removed START
                receiverAddress={undefined}
                accountBalanceTask={{ status: "pending" }}
                estimatedWithdrawFeeTask={{ status: "pending" }}
                onLoadAccountBalance={() => ({})}
                onLoadEstimatedWithdrawFee={() => ({})}
                // ToDo: To be removed END
                onLoadEstimatedDepositFee={onLoadEstimatedDepositFee}
                onLoadFees={onLoadFees}
                onSubmit={onGoToTransactionOverviewStep}
                onGoToChooseAccountStep={onGoToChooseAccountStep}
              />
            ) : null;
          }
          case "review-transaction": {
            return wallet !== undefined &&
              transactionToReview !== undefined &&
              (ethereumAccountTask.status === "successful" ||
                ethereumAccountTask.status === "reloading") ? (
              <TransactionOverview
                wallet={wallet}
                isTransactionBeingApproved={isTransactionBeingApproved}
                transaction={{
                  type: TxType.Deposit,
                  amount: transactionToReview.amount,
                  account: ethereumAccountTask.data,
                  onDeposit,
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

const mapStateToProps = (state: AppState): DepositStateProps => ({
  ethereumAccountsTask: state.deposit.ethereumAccountsTask,
  ethereumAccountTask: state.deposit.ethereumAccountTask,
  estimatedDepositFeeTask: state.deposit.estimatedDepositFeeTask,
  ethereumNetworkTask: state.global.ethereumNetworkTask,
  feesTask: state.deposit.feesTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  isTransactionBeingApproved: state.deposit.isTransactionBeingApproved,
  pendingDeposits: state.global.pendingDeposits,
  pendingDepositsCheckTask: state.global.pendingDepositsCheckTask,
  poolTransactionsTask: state.deposit.poolTransactionsTask,
  preferredCurrency: state.myAccount.preferredCurrency,
  step: state.deposit.step,
  tokensPriceTask: state.global.tokensPriceTask,
  transactionToReview: state.deposit.transaction,
  wallet: state.global.wallet,
});

const getHeaderCloseAction = (accountIndex: string | null) => {
  return accountIndex === null ? push("/") : push(`/accounts/${accountIndex}`);
};

const getHeader = (step: depositActions.Step, accountIndex: string | null): Header => {
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
  onLoadFees: () => dispatch(depositThunks.fetchFees()),
  onLoadPoolTransactions: () => dispatch(depositThunks.fetchPoolTransactions()),
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
