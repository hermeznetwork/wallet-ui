import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { push } from "connected-react-router";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import * as transactionThunks from "../../store/transaction/transaction.thunks";
import * as transactionActions from "../../store/transaction/transaction.actions";
import * as globalThunks from "../../store/global/global.thunks";
import useTransactionStyles from "./transaction.styles";
import TransactionForm from "./components/transaction-form/transaction-form.view";
import TransactionOverview from "./components/transaction-overview/transaction-overview.view";
import { STEP_NAME } from "../../store/transaction/transaction.reducer";
import AccountSelector from "./components/account-selector/account-selector.view";
import TransactionConfirmation from "./components/transaction-confirmation/transaction-confirmation.view";
import { changeHeader, openSnackbar } from "../../store/global/global.actions";
import Spinner from "../shared/spinner/spinner.view";
import * as storage from "../../utils/storage";
import TransactionError from "./components/transaction-error/transaction-error.view";
import theme from "../../styles/theme";

export const WithdrawRedirectionRoute = {
  Home: "home",
  AccountDetails: "account-details",
};

function Transaction({
  pendingDepositsCheckTask,
  ethereumNetworkTask,
  poolTransactionsTask,
  currentStep,
  steps,
  wallet,
  preferredCurrency,
  fiatExchangeRatesTask,
  transactionType,
  pendingDeposits,
  pendingWithdraws,
  pendingDelayedWithdraws,
  tokensPriceTask,
  onChangeHeader,
  onCheckPendingDeposits,
  onLoadEthereumAccount,
  onLoadHermezAccount,
  onLoadExit,
  onLoadAccountBalance,
  onLoadFees,
  onLoadPoolTransactions,
  onLoadAccounts,
  onGoToChooseAccountStep,
  onGoToBuildTransactionStep,
  onGoToTransactionOverviewStep,
  onFinishTransaction,
  onLoadEstimatedWithdrawFee,
  onLoadEstimatedDepositFee,
  onDeposit,
  onForceExit,
  onWithdraw,
  onExit,
  onTransfer,
  onCleanup,
}) {
  const classes = useTransactionStyles();
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const tokenId = urlSearchParams.get("tokenId");
  const batchNum = urlSearchParams.get("batchNum");
  const receiver = urlSearchParams.get("receiver");
  const instantWithdrawal = urlSearchParams.get("instantWithdrawal") === "true";
  const completeDelayedWithdrawal = urlSearchParams.get("completeDelayedWithdrawal") === "true";
  const accountIndex = urlSearchParams.get("accountIndex");
  const accountPendingDeposits = storage.getPendingDepositsByHermezAddress(
    pendingDeposits,
    ethereumNetworkTask.data.chainId,
    wallet.hermezEthereumAddress
  );
  const accountPendingWithdraws = storage.getPendingWithdrawsByHermezAddress(
    pendingWithdraws,
    ethereumNetworkTask.data.chainId,
    wallet.hermezEthereumAddress
  );
  const accountPendingDelayedWithdraws = storage.getPendingDelayedWithdrawsByHermezAddress(
    pendingDelayedWithdraws,
    ethereumNetworkTask.data.chainId,
    wallet.hermezEthereumAddress
  );

  React.useEffect(() => {
    onChangeHeader(currentStep, transactionType, accountIndex);
  }, [currentStep, transactionType, accountIndex, onChangeHeader]);

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
      if (accountIndex && tokenId) {
        onLoadEthereumAccount(Number(tokenId));
      } else if (accountIndex && !tokenId) {
        if (batchNum) {
          onLoadExit(
            accountIndex,
            Number(batchNum),
            completeDelayedWithdrawal,
            accountPendingDelayedWithdraws
          );
        } else {
          onLoadHermezAccount(
            accountIndex,
            poolTransactionsTask.data,
            accountPendingDeposits,
            fiatExchangeRatesTask.data,
            preferredCurrency
          );
        }
      } else {
        onGoToChooseAccountStep();
      }
    }
  }, [
    pendingDepositsCheckTask,
    poolTransactionsTask,
    tokenId,
    batchNum,
    accountIndex,
    completeDelayedWithdrawal,
  ]);

  React.useEffect(() => {
    const stepData = steps[STEP_NAME.LOAD_INITIAL_DATA];
    if (stepData.status === "failed") {
      onGoToChooseAccountStep();
    }
  }, [steps, onGoToChooseAccountStep]);

  React.useEffect(() => onCleanup, [onCleanup]);

  return (
    <div className={classes.root}>
      {(() => {
        switch (currentStep) {
          case STEP_NAME.LOAD_INITIAL_DATA: {
            return (
              <div className={classes.spinnerWrapper}>
                <Spinner />
              </div>
            );
          }
          case STEP_NAME.CHOOSE_ACCOUNT: {
            const stepData = steps[STEP_NAME.CHOOSE_ACCOUNT];

            return (
              <AccountSelector
                transactionType={transactionType}
                accountsTask={stepData.accountsTask}
                poolTransactionsTask={poolTransactionsTask}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={fiatExchangeRatesTask.data || {}}
                pendingDeposits={accountPendingDeposits}
                pendingWithdraws={accountPendingWithdraws}
                pendingDelayedWithdraws={accountPendingDelayedWithdraws}
                onLoadAccounts={onLoadAccounts}
                onAccountClick={(account) => onGoToBuildTransactionStep(account, receiver)}
              />
            );
          }
          case STEP_NAME.BUILD_TRANSACTION: {
            const stepData = steps[STEP_NAME.BUILD_TRANSACTION];

            return (
              <TransactionForm
                account={stepData.account}
                transactionType={transactionType}
                receiverAddress={stepData.receiver}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={fiatExchangeRatesTask.data || {}}
                accountBalanceTask={stepData.accountBalanceTask}
                feesTask={stepData.feesTask}
                tokensPriceTask={tokensPriceTask}
                estimatedWithdrawFeeTask={stepData.estimatedWithdrawFeeTask}
                estimatedDepositFeeTask={stepData.estimatedDepositFeeTask}
                onLoadAccountBalance={onLoadAccountBalance}
                onLoadFees={onLoadFees}
                onLoadEstimatedWithdrawFee={onLoadEstimatedWithdrawFee}
                onLoadEstimatedDepositFee={onLoadEstimatedDepositFee}
                onSubmit={onGoToTransactionOverviewStep}
                onGoToChooseAccountStep={onGoToChooseAccountStep}
              />
            );
          }
          case STEP_NAME.REVIEW_TRANSACTION: {
            const stepData = steps[STEP_NAME.REVIEW_TRANSACTION];
            const buildTransactionStepData = steps[STEP_NAME.BUILD_TRANSACTION];

            return (
              <TransactionOverview
                wallet={wallet}
                isTransactionBeingApproval={stepData.isTransactionBeingApproval}
                transactionType={transactionType}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={fiatExchangeRatesTask.data || {}}
                account={buildTransactionStepData.account}
                to={stepData.transaction.to}
                amount={stepData.transaction.amount}
                fee={stepData.transaction.fee}
                exit={stepData.transaction.exit}
                instantWithdrawal={instantWithdrawal}
                completeDelayedWithdrawal={completeDelayedWithdrawal}
                estimatedWithdrawFeeTask={buildTransactionStepData.estimatedWithdrawFeeTask}
                onDeposit={onDeposit}
                onForceExit={onForceExit}
                onWithdraw={onWithdraw}
                onExit={onExit}
                onTransfer={onTransfer}
              />
            );
          }
          default: {
            return <></>;
          }
        }
      })()}
    </div>
  );
}

Transaction.propTypes = {
  wallet: PropTypes.object,
  accountsTask: PropTypes.object,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRatesTask: PropTypes.object.isRequired,
  transactionType: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  ethereumNetworkTask: state.global.ethereumNetworkTask,
  pendingDepositsCheckTask: state.global.pendingDepositsCheckTask,
  poolTransactionsTask: state.transaction.poolTransactionsTask,
  currentStep: state.transaction.currentStep,
  steps: state.transaction.steps,
  wallet: state.global.wallet,
  accountsTask: state.transaction.accountsTask,
  pendingDeposits: state.global.pendingDeposits,
  pendingWithdraws: state.global.pendingWithdraws,
  pendingDelayedWithdraws: state.global.pendingDelayedWithdraws,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.myAccount.preferredCurrency,
  tokensPriceTask: state.global.tokensPriceTask,
});

const getTransactionOverviewHeaderTitle = (transactionType) => {
  switch (transactionType) {
    case TxType.Deposit:
      return "Deposit";
    case TxType.Transfer:
      return "Send";
    case TxType.Exit:
    case TxType.Withdraw:
      return "Withdraw";
    case TxType.ForceExit:
      return "Force Withdrawal";
    default:
      return undefined;
  }
};

const getHeaderCloseAction = (accountIndex) => {
  return accountIndex ? push(`/accounts/${accountIndex}`) : push("/");
};

const getHeader = (currentStep, transactionType, accountIndex) => {
  switch (currentStep) {
    case STEP_NAME.CHOOSE_ACCOUNT: {
      return {
        type: "page",
        data: {
          title: transactionType === TxType.Deposit ? "Deposit" : "Token",
          closeAction: getHeaderCloseAction(accountIndex),
        },
      };
    }
    case STEP_NAME.BUILD_TRANSACTION: {
      return {
        type: "page",
        data: {
          title: getTransactionOverviewHeaderTitle(transactionType),
          goBackAction: accountIndex
            ? push(`/accounts/${accountIndex}`)
            : transactionActions.changeCurrentStep(STEP_NAME.CHOOSE_ACCOUNT),
          closeAction: getHeaderCloseAction(accountIndex),
        },
      };
    }
    case STEP_NAME.REVIEW_TRANSACTION: {
      if (transactionType === TxType.Withdraw) {
        return {
          type: "page",
          data: {
            title: getTransactionOverviewHeaderTitle(transactionType),
            goBackAction: push(`/accounts/${accountIndex}`),
            closeAction: push(`/accounts/${accountIndex}`),
          },
        };
      } else {
        return {
          type: "page",
          data: {
            title: getTransactionOverviewHeaderTitle(transactionType),
            goBackAction: transactionActions.changeCurrentStep(STEP_NAME.BUILD_TRANSACTION),
            closeAction: getHeaderCloseAction(accountIndex),
          },
        };
      }
    }
    default: {
      return { type: undefined };
    }
  }
};

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: (currentStep, transactionType, accountIndex) =>
    dispatch(changeHeader(getHeader(currentStep, transactionType, accountIndex))),
  onCheckPendingDeposits: () => dispatch(globalThunks.checkPendingDeposits()),
  onLoadEthereumAccount: (tokenId) => dispatch(transactionThunks.fetchEthereumAccount(tokenId)),
  onLoadHermezAccount: (
    accountIndex,
    poolTransactions,
    pendingDeposits,
    fiatExchangeRates,
    preferredCurrency
  ) =>
    dispatch(
      transactionThunks.fetchHermezAccount(
        accountIndex,
        poolTransactions,
        pendingDeposits,
        fiatExchangeRates,
        preferredCurrency
      )
    ),
  onLoadExit: (accountIndex, batchNum, completeDelayedWithdrawal, pendingDelayedWithdraws) =>
    dispatch(
      transactionThunks.fetchExit(
        accountIndex,
        batchNum,
        completeDelayedWithdrawal,
        pendingDelayedWithdraws
      )
    ),
  onLoadAccountBalance: () => dispatch(transactionThunks.fetchAccountBalance()),
  onLoadFees: () => dispatch(transactionThunks.fetchFees()),
  onLoadPoolTransactions: () => dispatch(transactionThunks.fetchPoolTransactions()),
  onLoadAccounts: (
    transactionType,
    fromItem,
    poolTransactions,
    pendingDeposits,
    fiatExchangeRates,
    preferredCurrency
  ) =>
    dispatch(
      transactionThunks.fetchAccounts(
        transactionType,
        fromItem,
        poolTransactions,
        pendingDeposits,
        fiatExchangeRates,
        preferredCurrency
      )
    ),
  onGoToChooseAccountStep: () => dispatch(transactionActions.goToChooseAccountStep()),
  onGoToBuildTransactionStep: (account, receiver) =>
    dispatch(transactionActions.goToBuildTransactionStep(account, receiver)),
  onGoToTransactionOverviewStep: (transaction) =>
    dispatch(transactionActions.goToReviewTransactionStep(transaction)),
  onLoadEstimatedWithdrawFee: (token, amount) => {
    dispatch(transactionThunks.fetchEstimatedWithdrawFee(token, amount));
  },
  onLoadEstimatedDepositFee: () => dispatch(transactionThunks.fetchEstimatedDepositFee()),
  onDeposit: (amount, account) => dispatch(transactionThunks.deposit(amount, account)),
  onForceExit: (amount, account) => dispatch(transactionThunks.forceExit(amount, account)),
  onWithdraw: (amount, account, exit, completeDelayedWithdrawal, instantWithdrawal) =>
    dispatch(
      transactionThunks.withdraw(
        amount,
        account,
        exit,
        completeDelayedWithdrawal,
        instantWithdrawal
      )
    ),
  onExit: (amount, account, fee) => dispatch(transactionThunks.exit(amount, account, fee)),
  onTransfer: (amount, from, to, fee) =>
    dispatch(transactionThunks.transfer(amount, from, to, fee)),
  onCleanup: () => dispatch(transactionActions.resetState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
