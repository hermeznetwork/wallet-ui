import React from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { useTheme } from "react-jss";
import { push } from "@lagunovsky/redux-react-router";
import { Enums, Constants, HermezWallet } from "@hermeznetwork/hermezjs";

import useAccountDetailsStyles from "src/views/account-details/account-details.styles";
import TransactionList from "src/views/account-details/components/transaction-list/transaction-list.view";
import Container from "src/views/shared/container/container.view";
import Spinner from "src/views/shared/spinner/spinner.view";
import TransactionActions from "src/views/shared/transaction-actions/transaction-actions.view";
import ExitCardList from "src/views/shared/exit-card-list/exit-card-list.view";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";
import TokenBalance from "src/views/shared/token-balance/token-balance.view";
import InfiniteScroll from "src/views/shared/infinite-scroll/infinite-scroll.view";
import * as globalThunks from "src/store/global/global.thunks";
import { changeHeader } from "src/store/global/global.actions";
import * as accountDetailsThunks from "src/store/account-details/account-details.thunks";
import { resetState } from "src/store/account-details/account-details.actions";
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from "src/utils/currencies";
import { mergeExits } from "src/utils/transactions";
import * as storage from "src/utils/storage";
import { AsyncTask, isAsyncTaskDataAvailable } from "src/utils/types";
import { AUTO_REFRESH_RATE } from "src/constants";
import { AppDispatch, AppState } from "src/store";
import { Theme } from "src/styles/theme";
//domain
import {
  CoordinatorState,
  EthereumNetwork,
  Exits,
  FiatExchangeRates,
  HermezAccount,
  HistoryTransaction,
  isPendingDeposit,
  PendingDelayedWithdraws,
  PendingDeposit,
  PendingDeposits,
  PendingWithdraws,
  PoolTransaction,
  TimerWithdraw,
  TimerWithdraws,
  Token,
} from "src/domain";
import { Pagination } from "src/utils/api";
// adapters
import { getAccountBalance } from "src/adapters/hermez-api";

const { TxType } = Enums;
const { INTERNAL_ACCOUNT_ETH_ADDR } = Constants;

interface ViewHistoryTransactions {
  transactions: HistoryTransaction[];
  fromItemHistory: number[];
  pagination: Pagination;
}

type AccountDetailsStateProps = {
  preferredCurrency: string;
  accountTask: AsyncTask<HermezAccount, string>;
  l1TokenBalanceTask: AsyncTask<null, string>;
  ethereumNetworkTask: AsyncTask<EthereumNetwork, string>;
  poolTransactionsTask: AsyncTask<PoolTransaction[], string>;
  historyTransactionsTask: AsyncTask<ViewHistoryTransactions, string>;
  exitsTask: AsyncTask<Exits, string>;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
  wallet: HermezWallet.HermezWallet | undefined;
  pendingWithdraws: PendingWithdraws;
  pendingDelayedWithdraws: PendingDelayedWithdraws;
  pendingDeposits: PendingDeposits;
  timerWithdraws: TimerWithdraws;
  coordinatorStateTask: AsyncTask<CoordinatorState, string>;
};

interface AccountDetailsHandlerProps {
  onChangeHeader: (tokenName: string) => void;
  onCheckPendingDeposits: () => void;
  onLoadAccount: (
    accountIndex: HermezAccount["accountIndex"],
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) => void;
  onLoadL1TokenBalance: (
    token: Token,
    fiatExchangeRates: FiatExchangeRates,
    preferredCurrency: string
  ) => void;
  onLoadHistoryTransactions: (
    accountIndex: HermezAccount["accountIndex"],
    exits: Exits,
    fromItem?: number
  ) => void;
  onLoadPoolTransactions: (accountIndex: HermezAccount["accountIndex"]) => void;
  onLoadExits: (tokenId: number) => void;
  onCheckPendingDelayedWithdrawals: () => void;
  onCheckPendingWithdrawals: () => void;
  onAddTimerWithdraw: (timer: TimerWithdraw) => void;
  onRemoveTimerWithdraw: (message: string) => void;
  onNavigateToTransactionDetails: (
    accountIndex: HermezAccount["accountIndex"],
    transactionId: string
  ) => void;
  onCleanup: () => void;
}

type AccountDetailsProps = AccountDetailsStateProps & AccountDetailsHandlerProps;

function AccountDetails({
  preferredCurrency,
  accountTask,
  l1TokenBalanceTask,
  ethereumNetworkTask,
  poolTransactionsTask,
  historyTransactionsTask,
  exitsTask,
  fiatExchangeRatesTask,
  wallet,
  pendingWithdraws,
  pendingDelayedWithdraws,
  pendingDeposits,
  timerWithdraws,
  coordinatorStateTask,
  onChangeHeader,
  onLoadAccount,
  onLoadL1TokenBalance,
  onLoadPoolTransactions,
  onLoadHistoryTransactions,
  onLoadExits,
  onCheckPendingDeposits,
  onCheckPendingDelayedWithdrawals,
  onCheckPendingWithdrawals,
  onAddTimerWithdraw,
  onRemoveTimerWithdraw,
  onNavigateToTransactionDetails,
  onCleanup,
}: AccountDetailsProps): JSX.Element {
  const theme = useTheme<Theme>();
  const classes = useAccountDetailsStyles();
  const { accountIndex } = useParams();
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

  React.useEffect(() => {
    if (accountTask.status === "successful") {
      onChangeHeader(accountTask.data.token.name);
    }
  }, [accountTask, onChangeHeader]);

  React.useEffect(() => {
    if (fiatExchangeRatesTask.status === "successful" && accountIndex) {
      const loadInitialData = () => {
        onCheckPendingDeposits();
        onLoadAccount(accountIndex, fiatExchangeRatesTask.data, preferredCurrency);
        onLoadPoolTransactions(accountIndex);
        onCheckPendingWithdrawals();
        onCheckPendingDelayedWithdrawals();
      };
      const intervalId = setInterval(loadInitialData, AUTO_REFRESH_RATE);

      loadInitialData();

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [
    accountIndex,
    onCheckPendingDeposits,
    onLoadAccount,
    onLoadPoolTransactions,
    onCheckPendingWithdrawals,
    onCheckPendingDelayedWithdrawals,
    fiatExchangeRatesTask,
    preferredCurrency,
  ]);

  React.useEffect(() => {
    if (accountTask.status === "successful" && fiatExchangeRatesTask.status === "successful") {
      onLoadL1TokenBalance(accountTask.data.token, fiatExchangeRatesTask.data, preferredCurrency);
    }
  }, [accountTask, fiatExchangeRatesTask, onLoadL1TokenBalance, preferredCurrency]);

  React.useEffect(() => {
    if (accountTask.status === "successful") {
      onLoadExits(accountTask.data.token.id);
    }
  }, [accountTask, onLoadExits]);

  React.useEffect(() => {
    if (exitsTask.status === "successful" && accountIndex) {
      onLoadHistoryTransactions(accountIndex, exitsTask.data);
    }
  }, [exitsTask, accountIndex, onLoadHistoryTransactions]);

  React.useEffect(() => onCleanup, [onCleanup]);

  function getAccountTokenBalance(account: HermezAccount) {
    if (!isAsyncTaskDataAvailable(poolTransactionsTask)) {
      return undefined;
    }

    const accountBalance = getAccountBalance(
      account,
      poolTransactionsTask.data,
      accountPendingDeposits
    );

    return getFixedTokenAmount(accountBalance, account.token.decimals);
  }

  function getAccountFiatBalance(account: HermezAccount) {
    const accountTokenBalance = getAccountTokenBalance(account);
    if (!accountTokenBalance || !isAsyncTaskDataAvailable(fiatExchangeRatesTask)) {
      return undefined;
    }

    return getTokenAmountInPreferredCurrency(
      accountTokenBalance,
      account.token,
      preferredCurrency,
      fiatExchangeRatesTask.data
    );
  }

  /**
   * Filters the transactions from the pool which are of type Exit
   */
  function getPendingExits(poolTransactions: PoolTransaction[]) {
    return poolTransactions.filter((transaction) => transaction.type === TxType.Exit);
  }

  /**
   * Filters the transactions from the pool which are not of type Exit
   */
  function getPendingTransactions(poolTransactions: PoolTransaction[]) {
    return poolTransactions.filter((transaction) => transaction.type !== TxType.Exit);
  }

  /**
   * Navigates to the TransactionDetails view when a transaction is clicked
   */
  function handleTransactionClick(
    transaction: PendingDeposit | HistoryTransaction | PoolTransaction
  ) {
    if (accountIndex) {
      const transactionId = isPendingDeposit(transaction) ? transaction.hash : transaction.id;
      onNavigateToTransactionDetails(accountIndex, transactionId);
    }
  }

  return (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} disableTopGutter addHeaderPadding>
        {isAsyncTaskDataAvailable(accountTask) && (
          <section className={classes.section}>
            <div className={classes.tokenBalance}>
              <TokenBalance
                amount={getAccountTokenBalance(accountTask.data)}
                symbol={accountTask.data.token.symbol}
              />
            </div>
            <div className={classes.fiatBalanceWrapper}>
              <FiatAmount
                amount={getAccountFiatBalance(accountTask.data)}
                currency={preferredCurrency}
                className={classes.fiatBalance}
              />
            </div>
            <TransactionActions
              accountIndex={accountIndex}
              tokenId={accountTask.data.token.id}
              hideDeposit={
                !isAsyncTaskDataAvailable(l1TokenBalanceTask) ||
                accountTask.data.hezEthereumAddress.toLowerCase() ===
                  INTERNAL_ACCOUNT_ETH_ADDR.toLowerCase()
              }
              hideWithdraw={
                accountTask.data.hezEthereumAddress.toLowerCase() ===
                INTERNAL_ACCOUNT_ETH_ADDR.toLowerCase()
              }
            />
          </section>
        )}
      </Container>
      <Container>
        <section className={classes.section}>
          {(() => {
            if (
              accountIndex &&
              wallet &&
              isAsyncTaskDataAvailable(coordinatorStateTask) &&
              isAsyncTaskDataAvailable(fiatExchangeRatesTask) &&
              isAsyncTaskDataAvailable(accountTask) &&
              isAsyncTaskDataAvailable(poolTransactionsTask) &&
              isAsyncTaskDataAvailable(historyTransactionsTask) &&
              isAsyncTaskDataAvailable(exitsTask)
            ) {
              const tokenPendingDeposits = accountPendingDeposits
                .filter((deposit) => deposit.accountIndex === accountTask.data.accountIndex)
                .reverse();
              const tokenPendingWithdraws = accountPendingWithdraws.filter(
                (withdraw) => withdraw.token.id === accountTask.data.token.id
              );
              const tokenPendingDelayedWithdraws = accountPendingDelayedWithdraws.filter(
                (withdraw) => withdraw.token.id === accountTask.data.token.id
              );
              const tokenTimerWithdraws = accountTimerWithdraws.filter(
                (withdraw) => withdraw.token.id === accountTask.data.token.id
              );
              const accountPoolTransactions = poolTransactionsTask.data.filter(
                (tx) => tx.fromAccountIndex === accountIndex
              );

              return (
                <>
                  <ExitCardList
                    transactions={getPendingExits(accountPoolTransactions)}
                    fiatExchangeRates={fiatExchangeRatesTask.data}
                    preferredCurrency={preferredCurrency}
                    babyJubJub={wallet.publicKeyCompressedHex}
                    pendingWithdraws={tokenPendingWithdraws}
                    pendingDelayedWithdraws={tokenPendingDelayedWithdraws}
                    timerWithdraws={tokenTimerWithdraws}
                    onAddTimerWithdraw={onAddTimerWithdraw}
                    onRemoveTimerWithdraw={onRemoveTimerWithdraw}
                    coordinatorState={coordinatorStateTask?.data}
                  />
                  <ExitCardList
                    transactions={mergeExits(exitsTask.data.exits, tokenPendingDelayedWithdraws)}
                    fiatExchangeRates={fiatExchangeRatesTask.data}
                    preferredCurrency={preferredCurrency}
                    babyJubJub={wallet.publicKeyCompressedHex}
                    pendingWithdraws={tokenPendingWithdraws}
                    pendingDelayedWithdraws={tokenPendingDelayedWithdraws}
                    timerWithdraws={tokenTimerWithdraws}
                    onAddTimerWithdraw={onAddTimerWithdraw}
                    onRemoveTimerWithdraw={onRemoveTimerWithdraw}
                    coordinatorState={coordinatorStateTask?.data}
                  />
                  {tokenPendingDeposits && (
                    <TransactionList
                      arePending
                      accountIndex={accountIndex}
                      transactions={tokenPendingDeposits}
                      fiatExchangeRates={fiatExchangeRatesTask.data}
                      preferredCurrency={preferredCurrency}
                      onTransactionClick={handleTransactionClick}
                      coordinatorState={coordinatorStateTask.data}
                    />
                  )}
                  <TransactionList
                    arePending
                    accountIndex={accountIndex}
                    transactions={getPendingTransactions(accountPoolTransactions)}
                    fiatExchangeRates={fiatExchangeRatesTask.data}
                    preferredCurrency={preferredCurrency}
                    onTransactionClick={handleTransactionClick}
                    coordinatorState={coordinatorStateTask.data}
                  />
                  <InfiniteScroll
                    asyncTaskStatus={historyTransactionsTask.status}
                    paginationData={historyTransactionsTask.data.pagination}
                    onLoadNextPage={(fromItem) =>
                      onLoadHistoryTransactions(accountIndex, exitsTask.data, fromItem)
                    }
                  >
                    <TransactionList
                      accountIndex={accountIndex}
                      transactions={historyTransactionsTask.data.transactions}
                      fiatExchangeRates={fiatExchangeRatesTask.data}
                      preferredCurrency={preferredCurrency}
                      onTransactionClick={handleTransactionClick}
                      coordinatorState={coordinatorStateTask.data}
                    />
                  </InfiniteScroll>
                </>
              );
            } else {
              return <Spinner />;
            }
          })()}
        </section>
      </Container>
    </div>
  );
}

const mapStateToProps = (state: AppState): AccountDetailsStateProps => ({
  preferredCurrency: state.myAccount.preferredCurrency,
  accountTask: state.accountDetails.accountTask,
  l1TokenBalanceTask: state.accountDetails.l1TokenBalanceTask,
  ethereumNetworkTask: state.global.ethereumNetworkTask,
  poolTransactionsTask: state.global.poolTransactionsTask,
  historyTransactionsTask: state.accountDetails.historyTransactionsTask,
  exitsTask: state.accountDetails.exitsTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  wallet: state.global.wallet,
  pendingWithdraws: state.global.pendingWithdraws,
  pendingDelayedWithdraws: state.global.pendingDelayedWithdraws,
  pendingDeposits: state.global.pendingDeposits,
  timerWithdraws: state.global.timerWithdraws,
  coordinatorStateTask: state.global.coordinatorStateTask,
});

const mapDispatchToProps = (dispatch: AppDispatch): AccountDetailsHandlerProps => ({
  onLoadAccount: (accountIndex, fiatExchangeRates, preferredCurrency) =>
    dispatch(accountDetailsThunks.fetchAccount(accountIndex, fiatExchangeRates, preferredCurrency)),
  onLoadL1TokenBalance: (token, fiatExchangeRates, preferredCurrency) =>
    dispatch(accountDetailsThunks.fetchL1TokenBalance(token, fiatExchangeRates, preferredCurrency)),
  onChangeHeader: (tokenName) =>
    dispatch(
      changeHeader({
        type: "page",
        data: {
          title: tokenName,
          goBackAction: push("/"),
        },
      })
    ),
  onCheckPendingDeposits: () => dispatch(globalThunks.checkPendingDeposits()),
  onLoadPoolTransactions: () => dispatch(globalThunks.fetchPoolTransactions()),
  onLoadHistoryTransactions: (accountIndex, exits, fromItem) =>
    dispatch(accountDetailsThunks.fetchHistoryTransactions(accountIndex, exits, fromItem)),
  onLoadExits: (tokenId) => dispatch(accountDetailsThunks.fetchExits(tokenId)),
  onAddTimerWithdraw: (timerWithdraw) => dispatch(globalThunks.addTimerWithdraw(timerWithdraw)),
  onRemoveTimerWithdraw: (timerWithdrawId) =>
    dispatch(globalThunks.removeTimerWithdraw(timerWithdrawId)),
  onCheckPendingWithdrawals: () => dispatch(globalThunks.checkPendingWithdrawals()),
  onCheckPendingDelayedWithdrawals: () => dispatch(globalThunks.checkPendingDelayedWithdrawals()),
  onNavigateToTransactionDetails: (accountIndex, transactionId) =>
    dispatch(push(`/accounts/${accountIndex}/transactions/${transactionId}`)),
  onCleanup: () => dispatch(resetState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountDetails);
