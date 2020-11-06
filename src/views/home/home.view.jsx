import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import { push } from 'connected-react-router'
import { TxType } from 'hermezjs/src/tx'

import useHomeStyles from './home.styles'
import { fetchAccounts, fetchHistoryTransactions, fetchPoolTransactions, fetchExits } from '../../store/home/home.thunks'
import { removePendingWithdraw, fetchCoordinatorState } from '../../store/global/global.thunks'
import FiatAmount from '../shared/fiat-amount/fiat-amount.view'
import AccountList from '../shared/account-list/account-list.view'
import Spinner from '../shared/spinner/spinner.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view.jsx'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../utils/currencies'
import Container from '../shared/container/container.view'
import { copyToClipboard } from '../../utils/dom'
import { changeHeader, openSnackbar } from '../../store/global/global.actions'
import TransactionActions from '../shared/transaction-actions/transaction-actions.view'
import ExitList from '../shared/exit-list/exit-list.view'
import { getPartiallyHiddenHermezAddress } from '../../utils/addresses'
import Button from '../shared/button/button.view'
import InfiniteScroll from '../shared/infinite-scroll/infinite-scroll.view'
import { resetState } from '../../store/home/home.actions'

function Home ({
  metaMaskWalletTask,
  accountsTask,
  poolTransactionsTask,
  historyTransactionsTask,
  exitsTask,
  fiatExchangeRatesTask,
  preferredCurrency,
  pendingWithdraws,
  coordinatorStateTask,
  onChangeHeader,
  onLoadAccounts,
  onLoadPoolTransactions,
  onLoadHistoryTransactions,
  onLoadExits,
  onLoadCoordinatorState,
  onNavigateToAccountDetails,
  onOpenSnackbar,
  onNavigateTest,
  onCleanup
}) {
  const theme = useTheme()
  const classes = useHomeStyles()

  React.useEffect(() => {
    onChangeHeader({ type: 'main' })
  }, [onChangeHeader])

  React.useEffect(() => {
    if (metaMaskWalletTask.status === 'successful') {
      onLoadAccounts(metaMaskWalletTask.data.hermezEthereumAddress)
    }
  }, [metaMaskWalletTask, onLoadAccounts])

  React.useEffect(() => {
    onLoadPoolTransactions()
    onLoadHistoryTransactions()
    onLoadCoordinatorState()
  }, [onLoadPoolTransactions, onLoadHistoryTransactions, onLoadCoordinatorState])

  React.useEffect(() => {
    if (historyTransactionsTask.status === 'successful') {
      const exitTransactions = historyTransactionsTask.data.transactions.filter((transaction) => transaction.type === TxType.Exit)
      onLoadExits(exitTransactions)
    }
  }, [historyTransactionsTask, onLoadExits])

  React.useEffect(() => onCleanup, [onCleanup])

  function getTotalBalance (accountsTask) {
    switch (accountsTask.status) {
      case 'reloading':
      case 'successful': {
        if (fiatExchangeRatesTask.status !== 'successful') {
          return undefined
        }

        const { accounts } = accountsTask.data

        return accounts.reduce((amount, account) => {
          const fixedAccountBalance = getFixedTokenAmount(
            account.balance,
            account.token.decimals
          )
          const fiatBalance = getTokenAmountInPreferredCurrency(
            fixedAccountBalance,
            account.token.USD,
            preferredCurrency,
            fiatExchangeRatesTask.data
          )

          return amount + fiatBalance
        }, 0)
      }
      default: {
        return undefined
      }
    }
  }

  function getPendingExits () {
    return poolTransactionsTask.data.filter((transaction) => transaction.type === 'Exit')
  }

  function handleAccountClick (account) {
    onNavigateToAccountDetails(account.accountIndex)
  }

  function handleEthereumAddressClick (hermezEthereumAddress) {
    copyToClipboard(hermezEthereumAddress)
    onOpenSnackbar('The Hermez address has been copied to the clipboard!')
  }

  return metaMaskWalletTask.status === 'successful' && (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} disableTopGutter>
        <section className={classes.section}>
          {
            <Button
              text={getPartiallyHiddenHermezAddress(metaMaskWalletTask.data.hermezEthereumAddress)}
              onClick={() => handleEthereumAddressClick(metaMaskWalletTask.data.hermezEthereumAddress)}
            />
          }
          <div className={classes.accountBalance}>
            <FiatAmount
              amount={getTotalBalance(accountsTask)}
              currency={preferredCurrency}
            />
          </div>
          <TransactionActions hideWithdraw />
        </section>
      </Container>
      <Container>
        <section className={classes.section}>
          {
            (poolTransactionsTask.status === 'successful' &&
            historyTransactionsTask.status === 'successful')
              ? (
                <>
                  <ExitList
                    transactions={getPendingExits()}
                    fiatExchangeRates={
                      fiatExchangeRatesTask.status === 'successful'
                        ? fiatExchangeRatesTask.data
                        : undefined
                    }
                    preferredCurrency={preferredCurrency}
                    pendingWithdraws={pendingWithdraws[metaMaskWalletTask.data.hermezEthereumAddress]}
                    coordinatorState={coordinatorStateTask.status === 'successful' ? coordinatorStateTask.data : undefined}
                  />
                  {exitsTask.status === 'successful' &&
                    <ExitList
                      transactions={exitsTask.data}
                      fiatExchangeRates={
                        fiatExchangeRatesTask.status === 'successful'
                          ? fiatExchangeRatesTask.data
                          : undefined
                      }
                      preferredCurrency={preferredCurrency}
                      pendingWithdraws={pendingWithdraws[metaMaskWalletTask.data.hermezEthereumAddress]}
                      coordinatorState={coordinatorStateTask.status === 'successful' ? coordinatorStateTask.data : undefined}
                    />}
                </>
              )
              : <></>
          }
          {(() => {
            switch (accountsTask.status) {
              case 'loading':
              case 'failed': {
                return <Spinner />
              }
              case 'reloading':
              case 'successful': {
                return (
                  <InfiniteScroll
                    asyncTaskStatus={accountsTask.status}
                    paginationData={accountsTask.data.pagination}
                    onLoadNextPage={(fromItem) => {
                      onLoadAccounts(
                        metaMaskWalletTask.data.hermezEthereumAddress,
                        fromItem
                      )
                    }}
                  >
                    <AccountList
                      accounts={accountsTask.data.accounts}
                      preferredCurrency={preferredCurrency}
                      fiatExchangeRates={
                        fiatExchangeRatesTask.status === 'successful'
                          ? fiatExchangeRatesTask.data
                          : undefined
                      }
                      onAccountClick={handleAccountClick}
                    />
                  </InfiniteScroll>
                )
              }
              default: {
                return <></>
              }
            }
          })()}
        </section>
      </Container>
    </div>
  )
}

Home.propTypes = {
  accountsTask: PropTypes.object,
  metaMaskWalletTask: PropTypes.object,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRatesTask: PropTypes.object,
  poolTransactionsTask: PropTypes.object.isRequired,
  historyTransactionsTask: PropTypes.object.isRequired,
  exitsTask: PropTypes.object.isRequired,
  pendingWithdraws: PropTypes.object.isRequired,
  onLoadAccounts: PropTypes.func.isRequired,
  onLoadPoolTransactions: PropTypes.func.isRequired,
  onLoadHistoryTransactions: PropTypes.func.isRequired,
  onLoadExits: PropTypes.func.isRequired,
  onLoadCoordinatorState: PropTypes.func.isRequired,
  onRemovePendingWithdraw: PropTypes.func.isRequired,
  onNavigateToAccountDetails: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.global.metaMaskWalletTask,
  accountsTask: state.home.accountsTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.settings.preferredCurrency,
  poolTransactionsTask: state.home.poolTransactionsTask,
  historyTransactionsTask: state.home.historyTransactionsTask,
  exitsTask: state.home.exitsTask,
  pendingWithdraws: state.global.pendingWithdraws,
  coordinatorStateTask: state.global.coordinatorStateTask
})

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: (headerData) => dispatch(changeHeader(headerData)),
  onLoadAccounts: (hermezEthereumAddress, fromItem) =>
    dispatch(fetchAccounts(hermezEthereumAddress, fromItem)),
  onLoadPoolTransactions: () => dispatch(fetchPoolTransactions()),
  onLoadHistoryTransactions: () =>
    dispatch(fetchHistoryTransactions()),
  onLoadExits: (exitTransactions) =>
    dispatch(fetchExits(exitTransactions)),
  onLoadCoordinatorState: () => dispatch(fetchCoordinatorState()),
  onRemovePendingWithdraw: (hermezEthereumAddress, pendingWithdrawId) => dispatch(removePendingWithdraw(hermezEthereumAddress, pendingWithdrawId)),
  onNavigateToAccountDetails: (accountIndex) =>
    dispatch(push(`/accounts/${accountIndex}`)),
  onOpenSnackbar: (message) => dispatch(openSnackbar(message)),
  onCleanup: () => dispatch(resetState())
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Home))
