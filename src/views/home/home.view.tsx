import React from "react";
import { connect } from "react-redux";
import { useTheme } from "react-jss";
import { push } from "connected-react-router";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import useHomeStyles from "src/views/home/home.styles";
import ReportIssueButton from "src/views/home/components/report-issue-button/report-issue-button.view";
import PendingDepositList from "src/views/home/components/pending-deposit-list/pending-deposit-list.view";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";
import AccountList from "src/views/shared/account-list/account-list.view";
import Spinner from "src/views/shared/spinner/spinner.view";
import Container from "src/views/shared/container/container.view";
import TransactionActions from "src/views/shared/transaction-actions/transaction-actions.view";
import ExitCardList from "src/views/shared/exit-card-list/exit-card-list.view";
import InfiniteScroll from "src/views/shared/infinite-scroll/infinite-scroll.view";
import Button from "src/views/shared/button/button.view";
import { changeHeader, openSnackbar } from "src/store/global/global.actions";
import * as globalThunks from "src/store/global/global.thunks";
import * as homeThunks from "src/store/home/home.thunks";
import { getPartiallyHiddenHermezAddress } from "src/utils/addresses";
import { resetState } from "src/store/home/home.actions";
import { copyToClipboard } from "src/utils/browser";
import * as storage from "src/utils/storage";
import { mergeExits } from "src/utils/transactions";
import { AsyncTask, isAsyncTaskDataAvailable } from "src/utils/types";
import { Pagination } from "src/utils/api";
import { Theme } from "src/styles/theme";
import { AppDispatch, AppState } from "src/store";
import { AUTO_REFRESH_RATE } from "src/constants";
//domain
import {
  Account,
  CoordinatorState,
  EthereumNetwork,
  Exits,
  FiatExchangeRates,
  HermezAccount,
  HermezWallet,
  isHermezAccount,
  PendingDelayedWithdraws,
  PendingDeposit,
  PendingDeposits,
  PendingWithdraws,
  PoolTransaction,
  TimerWithdraw,
  TimerWithdraws,
} from "src/domain";

interface ViewAccounts {
  accounts: HermezAccount[];
  fromItemHistory: number[];
  pagination: Pagination;
}

type HomeStateProps = {
  wallet: HermezWallet.HermezWallet | undefined;
  ethereumNetworkTask: AsyncTask<EthereumNetwork, string>;
  pendingDepositsCheckTask: AsyncTask<null, string>;
  totalBalanceTask: AsyncTask<number, string>;
  accountsTask: AsyncTask<ViewAccounts, string>;
  poolTransactionsTask: AsyncTask<PoolTransaction[], string>;
  exitsTask: AsyncTask<Exits, string>;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
  preferredCurrency: string;
  pendingDeposits: PendingDeposits;
  pendingWithdraws: PendingWithdraws;
  pendingDelayedWithdraws: PendingDelayedWithdraws;
  timerWithdraws: TimerWithdraws;
  coordinatorStateTask: AsyncTask<CoordinatorState, string>;
};
interface HomeHandlerProps {
  onChangeHeader: () => void;
  onCheckPendingDeposits: () => void;
  onLoadTotalBalance: (
    hermezEthereumAddress: string,
    poolTransactions: PoolTransaction[],
    pendingDeposits: PendingDeposit[],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) => void;
  onLoadAccounts: (
    hermezAddress: string,
    poolTransactions: PoolTransaction[],
    pendingDeposits: PendingDeposit[],
    preferredCurrency: string,
    fiatExchangeRates: FiatExchangeRates,
    fromItem?: number
  ) => void;
  onLoadPoolTransactions: () => void;
  onLoadExits: () => void;
  onCheckPendingDelayedWithdrawals: () => void;
  onCheckPendingWithdrawals: () => void;
  onAddTimerWithdraw: (timer: TimerWithdraw) => void;
  onRemoveTimerWithdraw: (message: string) => void;
  onNavigateToAccountDetails: (accountIndex: string) => void;
  onOpenSnackbar: (
    message:
      | {
          type: "info";
          text: string;
        }
      | {
          type: "error";
          text?: string;
          error: string;
        }
  ) => void;
  onCleanup: () => void;
}

type HomeProps = HomeStateProps & HomeHandlerProps;

function Home({
  wallet,
  ethereumNetworkTask,
  pendingDepositsCheckTask,
  totalBalanceTask,
  accountsTask,
  poolTransactionsTask,
  exitsTask,
  fiatExchangeRatesTask,
  preferredCurrency,
  pendingDeposits,
  pendingWithdraws,
  pendingDelayedWithdraws,
  timerWithdraws,
  coordinatorStateTask,
  onChangeHeader,
  onCheckPendingDeposits,
  onLoadTotalBalance,
  onLoadAccounts,
  onLoadPoolTransactions,
  onLoadExits,
  onCheckPendingDelayedWithdrawals,
  onCheckPendingWithdrawals,
  onAddTimerWithdraw,
  onRemoveTimerWithdraw,
  onNavigateToAccountDetails,
  onOpenSnackbar,
  onCleanup,
}: HomeProps): JSX.Element {
  const theme = useTheme<Theme>();
  const classes = useHomeStyles();
  const ethereumNetworkAndWalletLoaded = isAsyncTaskDataAvailable(ethereumNetworkTask) && wallet;
  const accountPendingDeposits = React.useMemo(
    () =>
      ethereumNetworkAndWalletLoaded
        ? storage.getPendingDepositsByHermezAddress(
            pendingDeposits,
            ethereumNetworkTask.data.chainId,
            wallet.hermezEthereumAddress
          )
        : [],
    [pendingDeposits, ethereumNetworkTask, wallet, ethereumNetworkAndWalletLoaded]
  );
  const accountPendingWithdraws = ethereumNetworkAndWalletLoaded
    ? storage.getPendingWithdrawsByHermezAddress(
        pendingWithdraws,
        ethereumNetworkTask.data.chainId,
        wallet.hermezEthereumAddress
      )
    : [];
  const accountPendingDelayedWithdraws = ethereumNetworkAndWalletLoaded
    ? storage.getPendingDelayedWithdrawsByHermezAddress(
        pendingDelayedWithdraws,
        ethereumNetworkTask.data.chainId,
        wallet.hermezEthereumAddress
      )
    : [];
  const accountTimerWithdraws = ethereumNetworkAndWalletLoaded
    ? storage.getTimerWithdrawsByHermezAddress(
        timerWithdraws,
        ethereumNetworkTask.data.chainId,
        wallet.hermezEthereumAddress
      )
    : [];
  const pendingOnTopDeposits = accountPendingDeposits.filter(
    (deposit) => deposit.type === TxType.Deposit
  );
  const pendingCreateAccountDeposits = accountPendingDeposits.filter(
    (deposit) => deposit.type === TxType.CreateAccountDeposit
  );
  const coordinatorState = isAsyncTaskDataAvailable(coordinatorStateTask)
    ? coordinatorStateTask.data
    : undefined;
  const fiatExchangeRates = isAsyncTaskDataAvailable(fiatExchangeRatesTask)
    ? fiatExchangeRatesTask.data
    : undefined;

  React.useEffect(() => {
    onChangeHeader();
  }, [onChangeHeader]);

  React.useEffect(() => {
    onCheckPendingDeposits();
    onLoadPoolTransactions();
    onLoadExits();
    onCheckPendingWithdrawals();
    onCheckPendingDelayedWithdrawals();
  }, [
    onCheckPendingDeposits,
    onLoadPoolTransactions,
    onLoadExits,
    onCheckPendingWithdrawals,
    onCheckPendingDelayedWithdrawals,
  ]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      onCheckPendingDeposits();
      onLoadPoolTransactions();
      onLoadExits();
      onCheckPendingWithdrawals();
      onCheckPendingDelayedWithdrawals();
    }, AUTO_REFRESH_RATE);

    return () => {
      clearInterval(intervalId);
    };
  }, [
    onCheckPendingDeposits,
    onLoadPoolTransactions,
    onLoadExits,
    onCheckPendingWithdrawals,
    onCheckPendingDelayedWithdrawals,
  ]);

  React.useEffect(() => {
    if (
      pendingDepositsCheckTask.status === "successful" &&
      poolTransactionsTask.status === "successful" &&
      fiatExchangeRatesTask.status === "successful" &&
      wallet
    ) {
      onLoadTotalBalance(
        wallet.publicKeyBase64,
        poolTransactionsTask.data,
        accountPendingDeposits,
        fiatExchangeRatesTask.data,
        preferredCurrency
      );
      onLoadAccounts(
        wallet.publicKeyBase64,
        poolTransactionsTask.data,
        accountPendingDeposits,
        preferredCurrency,
        fiatExchangeRatesTask.data
      );
    }
  }, [
    pendingDepositsCheckTask,
    poolTransactionsTask,
    fiatExchangeRatesTask,
    wallet,
    accountPendingDeposits,
    preferredCurrency,
    onLoadTotalBalance,
    onLoadAccounts,
  ]);

  React.useEffect(() => onCleanup, [onCleanup]);

  /**
   * Filters the transactions of type exit from the transaction pool
   */
  function getPendingExits() {
    if (isAsyncTaskDataAvailable(poolTransactionsTask)) {
      return poolTransactionsTask.data.filter((transaction) => transaction.type === TxType.Exit);
    }
    return [];
  }

  /**
   * Navigates to the AccountDetails view when an account is clicked
   */
  function handleAccountClick(account: Account) {
    isHermezAccount(account) && onNavigateToAccountDetails(account.accountIndex);
  }

  /**
   * Copies the Hermez Ethereum address to the clipboard when it's clicked
   */
  function handleEthereumAddressClick(hermezEthereumAddress: string) {
    copyToClipboard(hermezEthereumAddress);
    onOpenSnackbar({
      type: "info",
      text: "The Polygon Hermez address has been copied to the clipboard!",
    });
  }
  return (
    <>
      {ethereumNetworkAndWalletLoaded && (
        <div className={classes.root}>
          <Container backgroundColor={theme.palette.primary.main} addHeaderPadding disableTopGutter>
            <section className={classes.section}>
              {ethereumNetworkTask.data.chainId === 4 && (
                <p className={classes.networkLabel}>{ethereumNetworkTask.data.name}</p>
              )}
              <Button
                text={getPartiallyHiddenHermezAddress(wallet.hermezEthereumAddress)}
                className={classes.walletAddress}
                onClick={() => handleEthereumAddressClick(wallet.hermezEthereumAddress)}
              />
              <div className={classes.accountBalance}>
                <FiatAmount
                  amount={
                    isAsyncTaskDataAvailable(totalBalanceTask) ? totalBalanceTask.data : undefined
                  }
                  currency={preferredCurrency}
                  className={classes.fiatAmount}
                />
              </div>
              <TransactionActions
                hideSend={
                  isAsyncTaskDataAvailable(accountsTask)
                    ? accountsTask.data.accounts.length === 0
                    : true
                }
                hideWithdraw
              />
            </section>
          </Container>
          <Container fullHeight>
            <section className={`${classes.section} ${classes.sectionLast}`}>
              <ExitCardList
                transactions={getPendingExits()}
                fiatExchangeRates={fiatExchangeRates}
                preferredCurrency={preferredCurrency}
                babyJubJub={wallet.publicKeyCompressedHex}
                pendingWithdraws={accountPendingWithdraws}
                pendingDelayedWithdraws={accountPendingDelayedWithdraws}
                timerWithdraws={accountTimerWithdraws}
                onAddTimerWithdraw={onAddTimerWithdraw}
                onRemoveTimerWithdraw={onRemoveTimerWithdraw}
                coordinatorState={coordinatorState}
              />
              {isAsyncTaskDataAvailable(exitsTask) && (
                <ExitCardList
                  transactions={mergeExits(exitsTask.data.exits, accountPendingDelayedWithdraws)}
                  fiatExchangeRates={fiatExchangeRates}
                  preferredCurrency={preferredCurrency}
                  babyJubJub={wallet.publicKeyCompressedHex}
                  pendingWithdraws={accountPendingWithdraws}
                  pendingDelayedWithdraws={accountPendingDelayedWithdraws}
                  timerWithdraws={accountTimerWithdraws}
                  onAddTimerWithdraw={onAddTimerWithdraw}
                  onRemoveTimerWithdraw={onRemoveTimerWithdraw}
                  coordinatorState={coordinatorState}
                />
              )}
              {(() => {
                switch (accountsTask.status) {
                  case "pending":
                  case "loading":
                  case "failed": {
                    return <Spinner />;
                  }
                  case "reloading":
                  case "successful": {
                    if (
                      accountsTask.data.accounts.length === 0 &&
                      pendingCreateAccountDeposits.length === 0
                    ) {
                      return (
                        <p className={classes.emptyAccounts}>
                          Deposit tokens from your Ethereum account.
                        </p>
                      );
                    }

                    return (
                      <>
                        {pendingCreateAccountDeposits && (
                          <PendingDepositList
                            deposits={pendingCreateAccountDeposits}
                            preferredCurrency={preferredCurrency}
                            fiatExchangeRates={fiatExchangeRates}
                            onAccountClick={() =>
                              onOpenSnackbar({
                                type: "info",
                                text: "This token account is being created",
                              })
                            }
                            coordinatorState={coordinatorState}
                          />
                        )}
                        <InfiniteScroll
                          asyncTaskStatus={accountsTask.status}
                          paginationData={accountsTask.data.pagination}
                          onLoadNextPage={(fromItem) => {
                            if (fiatExchangeRates) {
                              onLoadAccounts(
                                wallet.publicKeyBase64,
                                isAsyncTaskDataAvailable(poolTransactionsTask)
                                  ? poolTransactionsTask.data
                                  : [],
                                accountPendingDeposits,
                                preferredCurrency,
                                fiatExchangeRates,
                                fromItem
                              );
                            }
                          }}
                        >
                          <AccountList
                            accounts={accountsTask.data.accounts}
                            preferredCurrency={preferredCurrency}
                            pendingDeposits={pendingOnTopDeposits}
                            coordinatorState={coordinatorState}
                            onAccountClick={handleAccountClick}
                          />
                        </InfiniteScroll>
                      </>
                    );
                  }
                }
              })()}
            </section>
          </Container>
          <ReportIssueButton />
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state: AppState): HomeStateProps => ({
  wallet: state.global.wallet,
  ethereumNetworkTask: state.global.ethereumNetworkTask,
  pendingDepositsCheckTask: state.global.pendingDepositsCheckTask,
  totalBalanceTask: state.home.totalBalanceTask,
  accountsTask: state.home.accountsTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.myAccount.preferredCurrency,
  poolTransactionsTask: state.global.poolTransactionsTask,
  exitsTask: state.home.exitsTask,
  pendingWithdraws: state.global.pendingWithdraws,
  pendingDelayedWithdraws: state.global.pendingDelayedWithdraws,
  pendingDeposits: state.global.pendingDeposits,
  timerWithdraws: state.global.timerWithdraws,
  coordinatorStateTask: state.global.coordinatorStateTask,
});

const mapDispatchToProps = (dispatch: AppDispatch): HomeHandlerProps => ({
  onChangeHeader: () => dispatch(changeHeader({ type: "main" })),
  onCheckPendingDeposits: () => dispatch(globalThunks.checkPendingDeposits()),
  onLoadTotalBalance: (
    hermezAddress,
    poolTransactions,
    pendingDeposits,
    fiatExchangeRates,
    preferredCurrency
  ) =>
    dispatch(
      homeThunks.fetchTotalBalance(
        hermezAddress,
        poolTransactions,
        pendingDeposits,
        fiatExchangeRates,
        preferredCurrency
      )
    ),
  onLoadAccounts: (
    hermezAddress,
    poolTransactions,
    pendingDeposits,
    preferredCurrency,
    fiatExchangeRates,
    fromItem
  ) =>
    dispatch(
      homeThunks.fetchAccounts(
        hermezAddress,
        poolTransactions,
        pendingDeposits,
        preferredCurrency,
        fiatExchangeRates,
        fromItem
      )
    ),
  onLoadPoolTransactions: () => dispatch(globalThunks.fetchPoolTransactions()),
  onLoadExits: () => dispatch(homeThunks.fetchExits()),
  onCheckPendingWithdrawals: () => dispatch(globalThunks.checkPendingWithdrawals()),
  onCheckPendingDelayedWithdrawals: () => dispatch(globalThunks.checkPendingDelayedWithdrawals()),
  onAddTimerWithdraw: (timerWithdraw) => dispatch(globalThunks.addTimerWithdraw(timerWithdraw)),
  onRemoveTimerWithdraw: (timerWithdrawId) =>
    dispatch(globalThunks.removeTimerWithdraw(timerWithdrawId)),
  onNavigateToAccountDetails: (accountIndex) => dispatch(push(`/accounts/${accountIndex}`)),
  onOpenSnackbar: (message) => dispatch(openSnackbar({ message })),
  onCleanup: () => dispatch(resetState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
