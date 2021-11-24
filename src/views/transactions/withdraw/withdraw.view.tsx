import React from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { push } from "connected-react-router";
import { BigNumber } from "@ethersproject/bignumber";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import { AppState, AppDispatch } from "src/store";
import * as withdrawThunks from "src/store/transactions/withdraw/withdraw.thunks";
import * as withdrawActions from "src/store/transactions/withdraw/withdraw.actions";
import { changeHeader } from "src/store/global/global.actions";
import useWithdrawStyles from "src/views/transactions/transfer/transfer.styles";
import TransactionOverview from "src/views/transactions/components/transaction-overview/transaction-overview.view";
import Spinner from "src/views/shared/spinner/spinner.view";
import { AsyncTask } from "src/utils/types";
import * as storage from "src/utils/storage";
// domain
import { EstimatedL1Fee } from "src/domain/";
import {
  HermezAccount,
  HermezWallet,
  FiatExchangeRates,
  PoolTransaction,
  Exit,
  PendingDelayedWithdraw,
} from "src/domain/hermez";
import { PendingDelayedWithdraws } from "src/domain/local-storage";
import { EthereumNetwork } from "src/domain/ethereum";
import { account } from "src/persistence/parsers";

interface WithdrawStateProps {
  poolTransactionsTask: AsyncTask<PoolTransaction[], Error>;
  step: withdrawActions.Step;
  exitTask: AsyncTask<Exit, Error>;
  accountTask: AsyncTask<HermezAccount, string>;
  estimatedWithdrawFeeTask: AsyncTask<EstimatedL1Fee, Error>;
  isTransactionBeingApproved: boolean;
  pendingDelayedWithdraws: PendingDelayedWithdraws;
  ethereumNetworkTask: AsyncTask<EthereumNetwork, string>;
  wallet: HermezWallet.HermezWallet | undefined;
  preferredCurrency: string;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
}

interface WithdrawHandlerProps {
  onChangeHeader: (accountIndex: string) => void;
  onGoToHome: () => void;
  onLoadHermezAccount: (
    accountIndex: string,
    poolTransactions: PoolTransaction[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) => void;
  onLoadPoolTransactions: () => void;
  onLoadExit: (
    accountIndex: string,
    batchNum: number,
    completeDelayedWithdrawal: boolean,
    pendingDelayedWithdraws: PendingDelayedWithdraw[]
  ) => void;
  onWithdraw: (
    amount: BigNumber,
    account: HermezAccount,
    exit: Exit,
    completeDelayedWithdrawal: boolean,
    instantWithdrawal: boolean
  ) => void;
  onCleanup: () => void;
}

type WithdrawProps = WithdrawStateProps & WithdrawHandlerProps;

function Withdraw({
  poolTransactionsTask,
  step,
  accountTask,
  exitTask,
  estimatedWithdrawFeeTask,
  isTransactionBeingApproved,
  pendingDelayedWithdraws,
  ethereumNetworkTask,
  wallet,
  preferredCurrency,
  fiatExchangeRatesTask,
  onChangeHeader,
  onGoToHome,
  onLoadPoolTransactions,
  onLoadHermezAccount,
  onLoadExit,
  onWithdraw,
  onCleanup,
}: WithdrawProps) {
  const classes = useWithdrawStyles();
  const { search } = useLocation();
  const [accountPendingDelayedWithdraws, setAccountPendingDelayedWithdraws] =
    React.useState<PendingDelayedWithdraw[]>();
  const urlSearchParams = new URLSearchParams(search);
  const accountIndex = urlSearchParams.get("accountIndex");
  const batchNum = urlSearchParams.get("batchNum");
  const instantWithdrawal = urlSearchParams.get("instantWithdrawal") === "true";
  const completeDelayedWithdrawal = urlSearchParams.get("completeDelayedWithdrawal") === "true";

  React.useEffect(() => {
    if (!account || !batchNum) {
      onGoToHome();
    }
  }, [accountIndex, batchNum, onGoToHome]);

  React.useEffect(() => {
    if (accountIndex) {
      onChangeHeader(accountIndex);
    }
  }, [step, accountIndex, onChangeHeader]);

  React.useEffect(() => {
    onLoadPoolTransactions();
  }, [onLoadPoolTransactions]);

  React.useEffect(() => {
    if (ethereumNetworkTask.status === "successful" && wallet) {
      setAccountPendingDelayedWithdraws(
        storage.getPendingDelayedWithdrawsByHermezAddress(
          pendingDelayedWithdraws,
          ethereumNetworkTask.data.chainId,
          wallet.hermezEthereumAddress
        )
      );
    }
  }, [ethereumNetworkTask, wallet, pendingDelayedWithdraws]);

  React.useEffect(() => {
    if (
      poolTransactionsTask.status === "successful" &&
      fiatExchangeRatesTask.status === "successful" &&
      accountIndex
    ) {
      onLoadHermezAccount(
        accountIndex,
        poolTransactionsTask.data,
        fiatExchangeRatesTask.data,
        preferredCurrency
      );
    }
  }, [
    accountIndex,
    poolTransactionsTask,
    fiatExchangeRatesTask,
    preferredCurrency,
    onLoadHermezAccount,
  ]);

  React.useEffect(() => {
    if (accountIndex && batchNum && accountPendingDelayedWithdraws) {
      onLoadExit(
        accountIndex,
        Number(batchNum),
        completeDelayedWithdrawal,
        accountPendingDelayedWithdraws
      );
    }
  }, [
    accountIndex,
    batchNum,
    completeDelayedWithdrawal,
    accountPendingDelayedWithdraws,
    onLoadExit,
  ]);

  React.useEffect(() => onCleanup, [onCleanup]);

  return (
    <div className={classes.root}>
      {(() => {
        switch (step) {
          case "load-data": {
            return (
              <div className={classes.spinnerWrapper}>
                <Spinner />
              </div>
            );
          }
          case "review-transaction": {
            return wallet !== undefined &&
              accountTask.status === "successful" &&
              exitTask.status === "successful" ? (
              <TransactionOverview
                wallet={wallet}
                isTransactionBeingApproved={isTransactionBeingApproved}
                type={TxType.Withdraw}
                amount={BigNumber.from(exitTask.data.balance)}
                account={accountTask.data}
                exit={exitTask.data}
                completeDelayedWithdrawal={completeDelayedWithdrawal}
                instantWithdrawal={instantWithdrawal}
                estimatedWithdrawFeeTask={estimatedWithdrawFeeTask}
                onWithdraw={onWithdraw}
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

const mapStateToProps = (state: AppState): WithdrawStateProps => ({
  poolTransactionsTask: state.withdraw.poolTransactionsTask,
  step: state.withdraw.step,
  wallet: state.global.wallet,
  ethereumNetworkTask: state.global.ethereumNetworkTask,
  accountTask: state.withdraw.accountTask,
  exitTask: state.withdraw.exitTask,
  estimatedWithdrawFeeTask: state.withdraw.estimatedWithdrawFeeTask,
  isTransactionBeingApproved: state.withdraw.isTransactionBeingApproved,
  pendingDelayedWithdraws: state.global.pendingDelayedWithdraws,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.myAccount.preferredCurrency,
});

const mapDispatchToProps = (dispatch: AppDispatch): WithdrawHandlerProps => ({
  onChangeHeader: (accountIndex: string) =>
    dispatch(
      changeHeader({
        type: "page",
        data: {
          title: "Withdraw",
          closeAction: push(`/accounts/${accountIndex}`),
        },
      })
    ),
  onGoToHome: () => dispatch(push("/")),
  onLoadPoolTransactions: () => dispatch(withdrawThunks.fetchPoolTransactions()),
  onLoadHermezAccount: (
    accountIndex: string,
    poolTransactions: PoolTransaction[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) =>
    dispatch(
      withdrawThunks.fetchHermezAccount(
        accountIndex,
        poolTransactions,
        fiatExchangeRates,
        preferredCurrency
      )
    ),
  onLoadExit: (
    accountIndex: string,
    batchNum: number,
    completeDelayedWithdrawal: boolean,
    pendingDelayedWithdraws: PendingDelayedWithdraw[]
  ) =>
    dispatch(
      withdrawThunks.fetchExit(
        accountIndex,
        batchNum,
        completeDelayedWithdrawal,
        pendingDelayedWithdraws
      )
    ),
  onWithdraw: (
    amount: BigNumber,
    account: HermezAccount,
    exit: Exit,
    completeDelayedWithdrawal: boolean,
    instantWithdrawal: boolean
  ) =>
    dispatch(
      withdrawThunks.withdraw(amount, account, exit, completeDelayedWithdrawal, instantWithdrawal)
    ),
  onCleanup: () => dispatch(withdrawActions.resetState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Withdraw);
