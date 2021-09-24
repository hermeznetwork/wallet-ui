import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { useTheme } from "react-jss";
import { push } from "connected-react-router";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { INTERNAL_ACCOUNT_ETH_ADDR } from "@hermeznetwork/hermezjs/src/constants";

import useAccountDetailsStyles from "./account-details.styles";
import * as globalThunks from "../../store/global/global.thunks";
import * as accountDetailsThunks from "../../store/account-details/account-details.thunks";
import Spinner from "../shared/spinner/spinner.view";
import TransactionList from "./components/transaction-list/transaction-list.view";
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from "../../utils/currencies";
import Container from "../shared/container/container.view";
import { changeHeader } from "../../store/global/global.actions";
import TransactionActions from "../shared/transaction-actions/transaction-actions.view";
import ExitList from "../shared/exit-list/exit-list.view";
import FiatAmount from "../shared/fiat-amount/fiat-amount.view";
import TokenBalance from "../shared/token-balance/token-balance.view";
import InfiniteScroll from "../shared/infinite-scroll/infinite-scroll.view";
import { resetState } from "../../store/account-details/account-details.actions";
import { WithdrawRedirectionRoute } from "../transaction/transaction.view";
import { AUTO_REFRESH_RATE } from "../../constants";
import { getAccountBalance } from "../../utils/accounts";
import { mergeExits } from "../../utils/transactions";
import * as storage from "../../utils/storage";

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
  coordinatorStateTask,
  onChangeHeader,
  onLoadAccount,
  onLoadL1TokenBalance,
  onLoadPoolTransactions,
  onLoadHistoryTransactions,
  onLoadExits,
  onCheckPendingDeposits,
  onAddPendingDelayedWithdraw,
  onRemovePendingDelayedWithdraw,
  onCheckPendingDelayedWithdrawals,
  onCheckPendingWithdrawals,
  onNavigateToTransactionDetails,
  onCleanup,
}) {
  const theme = useTheme();
  const classes = useAccountDetailsStyles();
  const { accountIndex } = useParams();
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
    onChangeHeader(accountTask.data?.token.name);
  }, [accountTask, onChangeHeader]);

  React.useEffect(() => {
    if (fiatExchangeRatesTask.status === "successful") {
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
  }, [accountIndex, onCheckPendingDeposits, onLoadAccount, onLoadPoolTransactions]);

  React.useEffect(() => {
    if (accountTask.status === "successful") {
      onLoadL1TokenBalance(accountTask.data.token);
    }
  }, [accountTask, onLoadL1TokenBalance]);

  React.useEffect(() => {
    if (accountTask.status === "successful") {
      onLoadExits(accountTask.data.token.id);
    }
  }, [accountTask, onLoadExits]);

  React.useEffect(() => {
    if (exitsTask.status === "successful") {
      onLoadHistoryTransactions(accountIndex, undefined, exitsTask.data);
    }
  }, [exitsTask, accountIndex, onLoadHistoryTransactions]);

  React.useEffect(() => onCleanup, [onCleanup]);

  function getAccountTokenBalance(account) {
    if (!account) {
      return undefined;
    }

    const accountBalance = getAccountBalance(
      account,
      poolTransactionsTask.data,
      accountPendingDeposits
    );

    return getFixedTokenAmount(accountBalance, account.token.decimals);
  }

  function getAccountFiatBalance(account) {
    if (!account || fiatExchangeRatesTask.status !== "successful") {
      return undefined;
    }

    return getTokenAmountInPreferredCurrency(
      getAccountTokenBalance(account),
      account.token.USD,
      preferredCurrency,
      fiatExchangeRatesTask.data
    );
  }

  /**
   * Filters the transactions from the pool which are of type Exit
   * @param {Object[]} poolTransactions - Transactions from the pool
   * @returns {Object[]} Transactions from the pool which are of type Exit
   */
  function getPendingExits(poolTransactions) {
    return poolTransactions.filter((transaction) => transaction.type === TxType.Exit);
  }

  /**
   * Filters the transactions from the pool which are not of type Exit
   * @param {Object[]} poolTransactions - Transactions from the pool
   * @returns {Object[]} Transactions from the pool which are not of type Exit
   */
  function getPendingTransactions(poolTransactions) {
    return poolTransactions.filter((transaction) => transaction.type !== TxType.Exit);
  }

  /**
   * Navigates to the TransactionDetails view when a transaction is clicked
   * @param {Object} transaction - Transaction
   * @returns {void}
   */
  function handleTransactionClick(transaction) {
    onNavigateToTransactionDetails(accountIndex, transaction.id || transaction.hash);
  }

  return (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} disableTopGutter addHeaderPadding>
        <section className={classes.section}>
          <div className={classes.tokenBalance}>
            <TokenBalance
              amount={getAccountTokenBalance(accountTask.data)}
              symbol={accountTask.data?.token.symbol}
            />
          </div>
          <div className={classes.fiatBalance}>
            <FiatAmount
              amount={getAccountFiatBalance(accountTask.data)}
              currency={preferredCurrency}
            />
          </div>
          <TransactionActions
            accountIndex={accountIndex}
            tokenId={accountTask.data?.token.id}
            hideDeposit={
              l1TokenBalanceTask.status !== "successful" ||
              accountTask.data?.hezEthereumAddress.toLowerCase() ===
                INTERNAL_ACCOUNT_ETH_ADDR.toLowerCase()
            }
            hideWithdraw={
              accountTask.data?.hezEthereumAddress.toLowerCase() ===
              INTERNAL_ACCOUNT_ETH_ADDR.toLowerCase()
            }
            hideSwap
          />
        </section>
      </Container>
      <Container>
        <section className={classes.section}>
          {(() => {
            if (
              accountTask.status === "loading" ||
              accountTask.status === "failed" ||
              poolTransactionsTask.status === "loading" ||
              poolTransactionsTask.status === "failed" ||
              historyTransactionsTask.status === "loading" ||
              historyTransactionsTask.status === "failed" ||
              exitsTask.status === "loading" ||
              exitsTask.status === "failed"
            ) {
              return <Spinner />;
            }

            if (
              (poolTransactionsTask.status === "successful" ||
                poolTransactionsTask.status === "reloading") &&
              (historyTransactionsTask.status === "successful" ||
                historyTransactionsTask.status === "reloading") &&
              (exitsTask.status === "successful" || exitsTask.status === "reloading")
            ) {
              const tokenPendingDeposits = accountPendingDeposits
                .filter(
                  (deposit) => deposit.account?.accountIndex === accountTask.data.accountIndex
                )
                .reverse();
              const tokenPendingWithdraws = accountPendingWithdraws.filter(
                (withdraw) => withdraw.token.id === accountTask.data.token.id
              );
              const tokenPendingDelayedWithdraws = accountPendingDelayedWithdraws.filter(
                (withdraw) => withdraw.token.id === accountTask.data.token.id
              );

              return (
                <>
                  {poolTransactionsTask.status === "successful" ||
                  poolTransactionsTask.status === "reloading" ? (
                    <ExitList
                      transactions={getPendingExits(poolTransactionsTask.data)}
                      fiatExchangeRates={fiatExchangeRatesTask.data}
                      preferredCurrency={preferredCurrency}
                      babyJubJub={wallet.publicKeyCompressedHex}
                      pendingWithdraws={tokenPendingWithdraws}
                      pendingDelayedWithdraws={tokenPendingDelayedWithdraws}
                      onAddPendingDelayedWithdraw={onAddPendingDelayedWithdraw}
                      onRemovePendingDelayedWithdraw={onRemovePendingDelayedWithdraw}
                      coordinatorState={coordinatorStateTask?.data}
                      redirectTo={WithdrawRedirectionRoute.AccountDetails}
                    />
                  ) : (
                    <></>
                  )}
                  {exitsTask.status === "successful" || exitsTask.status === "reloading" ? (
                    <ExitList
                      transactions={mergeExits(
                        exitsTask.data.exits,
                        accountPendingDelayedWithdraws
                      )}
                      fiatExchangeRates={fiatExchangeRatesTask.data}
                      preferredCurrency={preferredCurrency}
                      babyJubJub={wallet.publicKeyCompressedHex}
                      pendingWithdraws={tokenPendingWithdraws}
                      pendingDelayedWithdraws={tokenPendingDelayedWithdraws}
                      onAddPendingDelayedWithdraw={onAddPendingDelayedWithdraw}
                      onRemovePendingDelayedWithdraw={onRemovePendingDelayedWithdraw}
                      coordinatorState={coordinatorStateTask?.data}
                      redirectTo={WithdrawRedirectionRoute.AccountDetails}
                    />
                  ) : (
                    <></>
                  )}
                  {tokenPendingDeposits && (
                    <TransactionList
                      arePending
                      accountIndex={accountIndex}
                      transactions={tokenPendingDeposits}
                      fiatExchangeRates={fiatExchangeRatesTask.data}
                      preferredCurrency={preferredCurrency}
                      onTransactionClick={handleTransactionClick}
                      coordinatorState={coordinatorStateTask?.data}
                    />
                  )}
                  <TransactionList
                    arePending
                    accountIndex={accountIndex}
                    transactions={getPendingTransactions(poolTransactionsTask.data)}
                    fiatExchangeRates={fiatExchangeRatesTask.data}
                    preferredCurrency={preferredCurrency}
                    onTransactionClick={handleTransactionClick}
                    coordinatorState={coordinatorStateTask?.data}
                  />
                  <InfiniteScroll
                    asyncTaskStatus={historyTransactionsTask.status}
                    paginationData={historyTransactionsTask.data.pagination}
                    onLoadNextPage={(fromItem) =>
                      onLoadHistoryTransactions(accountIndex, fromItem, exitsTask.data)
                    }
                  >
                    <TransactionList
                      accountIndex={accountIndex}
                      transactions={historyTransactionsTask.data.transactions}
                      fiatExchangeRates={fiatExchangeRatesTask.data}
                      preferredCurrency={preferredCurrency}
                      onTransactionClick={handleTransactionClick}
                    />
                  </InfiniteScroll>
                </>
              );
            }

            return <></>;
          })()}
        </section>
      </Container>
    </div>
  );
}

AccountDetails.propTypes = {
  preferredCurrency: PropTypes.string.isRequired,
  accountTask: PropTypes.object.isRequired,
  poolTransactionsTask: PropTypes.object.isRequired,
  historyTransactionsTask: PropTypes.object.isRequired,
  exitsTask: PropTypes.object.isRequired,
  fiatExchangeRatesTask: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  pendingWithdraws: PropTypes.object.isRequired,
  pendingDelayedWithdraws: PropTypes.object.isRequired,
  coordinatorStateTask: PropTypes.object.isRequired,
  onLoadAccount: PropTypes.func.isRequired,
  onChangeHeader: PropTypes.func.isRequired,
  onLoadPoolTransactions: PropTypes.func.isRequired,
  onLoadHistoryTransactions: PropTypes.func.isRequired,
  onLoadExits: PropTypes.func.isRequired,
  onAddPendingDelayedWithdraw: PropTypes.func.isRequired,
  onRemovePendingDelayedWithdraw: PropTypes.func.isRequired,
  onNavigateToTransactionDetails: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  preferredCurrency: state.myAccount.preferredCurrency,
  accountTask: state.accountDetails.accountTask,
  l1TokenBalanceTask: state.accountDetails.l1TokenBalanceTask,
  ethereumNetworkTask: state.global.ethereumNetworkTask,
  poolTransactionsTask: state.accountDetails.poolTransactionsTask,
  historyTransactionsTask: state.accountDetails.historyTransactionsTask,
  exitsTask: state.accountDetails.exitsTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  wallet: state.global.wallet,
  pendingWithdraws: state.global.pendingWithdraws,
  pendingDelayedWithdraws: state.global.pendingDelayedWithdraws,
  pendingDeposits: state.global.pendingDeposits,
  coordinatorStateTask: state.global.coordinatorStateTask,
});

const mapDispatchToProps = (dispatch) => ({
  onLoadAccount: (accountIndex, fiatExchangeRates, preferredCurrency) =>
    dispatch(accountDetailsThunks.fetchAccount(accountIndex, fiatExchangeRates, preferredCurrency)),
  onLoadL1TokenBalance: (token) => dispatch(accountDetailsThunks.fetchL1TokenBalance(token)),
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
  onLoadPoolTransactions: (accountIndex) =>
    dispatch(accountDetailsThunks.fetchPoolTransactions(accountIndex)),
  onLoadHistoryTransactions: (accountIndex, fromItem, exits) =>
    dispatch(accountDetailsThunks.fetchHistoryTransactions(accountIndex, fromItem, exits)),
  onLoadExits: (tokenId) => dispatch(accountDetailsThunks.fetchExits(tokenId)),
  onAddPendingDelayedWithdraw: (pendingDelayedWithdraw) =>
    dispatch(globalThunks.addPendingDelayedWithdraw(pendingDelayedWithdraw)),
  onRemovePendingDelayedWithdraw: (pendingDelayedWithdrawId) =>
    dispatch(globalThunks.removePendingDelayedWithdraw(pendingDelayedWithdrawId)),
  onCheckPendingWithdrawals: () => dispatch(globalThunks.checkPendingWithdrawals()),
  onCheckPendingDelayedWithdrawals: () => dispatch(globalThunks.checkPendingDelayedWithdrawals()),
  onNavigateToTransactionDetails: (accountIndex, transactionId) =>
    dispatch(push(`/accounts/${accountIndex}/transactions/${transactionId}`)),
  onCleanup: () => dispatch(resetState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountDetails);
