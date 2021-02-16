import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import { push } from 'connected-react-router'
import { TxType } from '@hermeznetwork/hermezjs/src/enums'

import useAccountDetailsStyles from './account-details.styles'
import * as globalThunks from '../../store/global/global.thunks'
import * as accountDetailsThunks from '../../store/account-details/account-details.thunks'
import Spinner from '../shared/spinner/spinner.view'
import TransactionList from './components/transaction-list/transaction-list.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../utils/currencies'
import Container from '../shared/container/container.view'
import { changeHeader } from '../../store/global/global.actions'
import TransactionActions from '../shared/transaction-actions/transaction-actions.view'
import ExitList from '../shared/exit-list/exit-list.view'
import FiatAmount from '../shared/fiat-amount/fiat-amount.view'
import TokenBalance from '../shared/token-balance/token-balance.view'
import InfiniteScroll from '../shared/infinite-scroll/infinite-scroll.view'
import { resetState } from '../../store/account-details/account-details.actions'
import { WithdrawRedirectionRoute } from '../transaction/transaction.view'
import { AUTO_REFRESH_RATE } from '../../constants'

function AccountDetails ({
  preferredCurrency,
  accountTask,
  poolTransactionsTask,
  historyTransactionsTask,
  exitsTask,
  fiatExchangeRatesTask,
  wallet,
  pendingWithdraws,
  pendingDelayedWithdraws,
  pendingDeposits,
  pendingDepositsCheckTask,
  coordinatorStateTask,
  onChangeHeader,
  onLoadAccount,
  onLoadPoolTransactions,
  onLoadHistoryTransactions,
  onLoadExits,
  onCheckPendingDeposits,
  onAddPendingDelayedWithdraw,
  onRemovePendingDelayedWithdraw,
  onNavigateToTransactionDetails,
  onCleanup
}) {
  const theme = useTheme()
  const classes = useAccountDetailsStyles()
  const { accountIndex } = useParams()
  const accountPendingDeposits = pendingDeposits[wallet.hermezEthereumAddress]

  React.useEffect(() => {
    onChangeHeader(accountTask.data?.token.name)
  }, [accountTask, onChangeHeader])

  React.useEffect(() => {
    const autoRefreshFn = () => {
      onLoadAccount(accountIndex)
      onLoadPoolTransactions(accountIndex)
    }

    autoRefreshFn()

    const intervalId = setInterval(autoRefreshFn, AUTO_REFRESH_RATE)

    return () => {
      clearInterval(intervalId)
    }
  }, [accountIndex, onLoadAccount, onLoadPoolTransactions])

  React.useEffect(() => {
    if (accountTask.status === 'successful') {
      onLoadExits(accountTask.data.token.id)
    }
  }, [onLoadExits, accountTask])

  React.useEffect(() => {
    if (exitsTask.status === 'successful') {
      onLoadHistoryTransactions(accountIndex)
    }
  }, [exitsTask, accountIndex, onLoadHistoryTransactions])

  React.useEffect(() => {
    onCheckPendingDeposits()
  }, [onCheckPendingDeposits])

  React.useEffect(() => onCleanup, [onCleanup])

  /**
   * Gets the token balance of the account, including pending deposits
   */
  function getTokenBalance () {
    if (accountTask.status !== 'successful' && accountTask.status !== 'reloading') {
      return undefined
    }

    if (!accountPendingDeposits) {
      return accountTask.data.balance
    }

    const tokenBalance = accountPendingDeposits.reduce((totalAccountBalance, pendingDeposit) => {
      return totalAccountBalance + BigInt(pendingDeposit.amount)
    }, BigInt(accountTask.data.balance))

    return tokenBalance.toString()
  }

  /**
   * Calculates the total balance of the account in the user's preferred currency
   * @param {Object} accountTask - Asynchronous task of the account
   * @returns {number} The balance of the account in user's preferred currency
   */
  function getAccountBalance () {
    switch (accountTask.status) {
      case 'reloading':
      case 'successful': {
        if (fiatExchangeRatesTask.status !== 'successful') {
          return undefined
        }

        const accountTokenBalance = getTokenBalance()
        const fixedAccountBalance = getFixedTokenAmount(
          accountTokenBalance,
          accountTask.data.token.decimals
        )

        return getTokenAmountInPreferredCurrency(
          fixedAccountBalance,
          accountTask.data.token.USD,
          preferredCurrency,
          fiatExchangeRatesTask.data
        )
      }
      default: {
        return undefined
      }
    }
  }

  /**
   * Filters the transactions from the pool which are of type Exit
   * @param {Object[]} poolTransactions - Transactions from the pool
   * @returns {Object[]} Transactions from the pool which are of type Exit
   */
  function getPendingExits (poolTransactions) {
    return poolTransactions.filter((transaction) => transaction.type === TxType.Exit)
  }

  /**
   * Filters the transactions from the pool which are not of type Exit
   * @param {Object[]} poolTransactions - Transactions from the pool
   * @returns {Object[]} Transactions from the pool which are not of type Exit
   */
  function getPendingTransactions (poolTransactions) {
    return poolTransactions.filter((transaction) => transaction.type !== TxType.Exit)
  }

  /**
   * Navigates to the TransactionDetails view when a transaction is clicked
   * @param {Object} transaction - Transaction
   * @returns {void}
   */
  function handleTransactionClick (transaction) {
    onNavigateToTransactionDetails(accountIndex, transaction.id || transaction.hash)
  }

  return (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} disableTopGutter addHeaderPadding>
        <section className={classes.section}>
          <div className={classes.tokenBalance}>
            <TokenBalance
              amount={getFixedTokenAmount(getTokenBalance(), accountTask.data?.token.decimals)}
              symbol={accountTask.data?.token.symbol}
            />
          </div>
          <div className={classes.fiatBalance}>
            <FiatAmount
              amount={getAccountBalance()}
              currency={preferredCurrency}
            />
          </div>
          <TransactionActions accountIndex={accountIndex} tokenId={accountTask.data?.token.id} />
        </section>
      </Container>
      <Container>
        <section className={classes.section}>
          {(() => {
            if (
              accountTask.status === 'loading' ||
              accountTask.status === 'failed' ||
              poolTransactionsTask.status === 'loading' ||
              poolTransactionsTask.status === 'failed' ||
              historyTransactionsTask.status === 'loading' ||
              historyTransactionsTask.status === 'failed' ||
              exitsTask.status === 'loading' ||
              exitsTask.status === 'failed' ||
              pendingDepositsCheckTask.status === 'loading'
            ) {
              return <Spinner />
            }

            if (
              (poolTransactionsTask.status === 'successful' ||
              poolTransactionsTask.status === 'reloading') &&
              (historyTransactionsTask.status === 'successful' ||
              historyTransactionsTask.status === 'reloading') &&
              (exitsTask.status === 'successful' ||
              exitsTask.status === 'reloading')
            ) {
              return (
                <>
                  <ExitList
                    transactions={getPendingExits(poolTransactionsTask.data)}
                    fiatExchangeRates={fiatExchangeRatesTask.data}
                    preferredCurrency={preferredCurrency}
                    pendingWithdraws={pendingWithdraws[wallet.hermezEthereumAddress]}
                    pendingDelayedWithdraws={pendingDelayedWithdraws[wallet.hermezEthereumAddress]}
                    onAddPendingDelayedWithdraw={onAddPendingDelayedWithdraw}
                    onRemovePendingDelayedWithdraw={onRemovePendingDelayedWithdraw}
                    coordinatorState={coordinatorStateTask.data}
                    redirectTo={WithdrawRedirectionRoute.AccountDetails}
                  />
                  {exitsTask.status === 'successful' && (
                    <ExitList
                      transactions={exitsTask.data.exits}
                      fiatExchangeRates={fiatExchangeRatesTask.data}
                      preferredCurrency={preferredCurrency}
                      pendingWithdraws={pendingWithdraws[wallet.hermezEthereumAddress]}
                      pendingDelayedWithdraws={pendingDelayedWithdraws[wallet.hermezEthereumAddress]}
                      onAddPendingDelayedWithdraw={onAddPendingDelayedWithdraw}
                      onRemovePendingDelayedWithdraw={onRemovePendingDelayedWithdraw}
                      coordinatorState={coordinatorStateTask.data}
                      redirectTo={WithdrawRedirectionRoute.AccountDetails}
                    />
                  )}
                  {accountPendingDeposits && (
                    <TransactionList
                      arePending
                      accountIndex={accountIndex}
                      transactions={accountPendingDeposits}
                      fiatExchangeRates={fiatExchangeRatesTask.data}
                      preferredCurrency={preferredCurrency}
                      onTransactionClick={handleTransactionClick}
                    />
                  )}
                  <TransactionList
                    arePending
                    accountIndex={accountIndex}
                    transactions={getPendingTransactions(poolTransactionsTask.data)}
                    fiatExchangeRates={fiatExchangeRatesTask.data}
                    preferredCurrency={preferredCurrency}
                    onTransactionClick={handleTransactionClick}
                  />
                  <InfiniteScroll
                    asyncTaskStatus={historyTransactionsTask.status}
                    paginationData={historyTransactionsTask.data.pagination}
                    onLoadNextPage={(fromItem) => onLoadHistoryTransactions(accountIndex, fromItem)}
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
              )
            }

            return <></>
          })()}
        </section>
      </Container>
    </div>
  )
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
  onNavigateToTransactionDetails: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  preferredCurrency: state.myAccount.preferredCurrency,
  accountTask: state.accountDetails.accountTask,
  poolTransactionsTask: state.accountDetails.poolTransactionsTask,
  historyTransactionsTask: state.accountDetails.historyTransactionsTask,
  exitsTask: state.accountDetails.exitsTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  wallet: state.global.wallet,
  pendingWithdraws: state.global.pendingWithdraws,
  pendingDelayedWithdraws: state.global.pendingDelayedWithdraws,
  pendingDeposits: state.global.pendingDeposits,
  pendingDepositsCheckTask: state.global.pendingDepositsCheckTask,
  coordinatorStateTask: state.global.coordinatorStateTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadAccount: (accountIndex) =>
    dispatch(accountDetailsThunks.fetchAccount(accountIndex)),
  onChangeHeader: (tokenName) =>
    dispatch(changeHeader({
      type: 'page',
      data: {
        title: tokenName,
        goBackAction: push('/')
      }
    })),
  onCheckPendingDeposits: () => dispatch(globalThunks.checkPendingDeposits()),
  onLoadPoolTransactions: (accountIndex) =>
    dispatch(accountDetailsThunks.fetchPoolTransactions(accountIndex)),
  onLoadHistoryTransactions: (accountIndex, fromItem) =>
    dispatch(accountDetailsThunks.fetchHistoryTransactions(accountIndex, fromItem)),
  onLoadExits: (tokenId) =>
    dispatch(accountDetailsThunks.fetchExits(tokenId)),
  onAddPendingDelayedWithdraw: (hermezEthereumAddress, pendingDelayedWithdraw) =>
    dispatch(globalThunks.addPendingDelayedWithdraw(hermezEthereumAddress, pendingDelayedWithdraw)),
  onRemovePendingDelayedWithdraw: (hermezEthereumAddress, pendingDelayedWithdrawId) =>
    dispatch(globalThunks.removePendingDelayedWithdraw(hermezEthereumAddress, pendingDelayedWithdrawId)),
  onNavigateToTransactionDetails: (accountIndex, transactionId) =>
    dispatch(push(`/accounts/${accountIndex}/transactions/${transactionId}`)),
  onCleanup: () =>
    dispatch(resetState())
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(AccountDetails))
