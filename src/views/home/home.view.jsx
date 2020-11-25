import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import { push } from 'connected-react-router'

import useHomeStyles from './home.styles'
import { fetchCoordinatorState, addPendingDelayedWithdraw, removePendingDelayedWithdraw } from '../../store/global/global.thunks'
import * as homeThunks from '../../store/home/home.thunks'
import FiatAmount from '../shared/fiat-amount/fiat-amount.view'
import AccountList from '../shared/account-list/account-list.view'
import Spinner from '../shared/spinner/spinner.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view.jsx'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../utils/currencies'
import Container from '../shared/container/container.view'
import { copyToClipboard } from '../../utils/browser'
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
  exitsTask,
  fiatExchangeRatesTask,
  preferredCurrency,
  pendingWithdraws,
  pendingDelayedWithdraws,
  coordinatorStateTask,
  onChangeHeader,
  onLoadAccounts,
  onLoadPoolTransactions,
  onLoadExits,
  onLoadCoordinatorState,
  onAddPendingDelayedWithdraw,
  onRemovePendingDelayedWithdraw,
  onNavigateToAccountDetails,
  onOpenSnackbar,
  onCleanup
}) {
  const theme = useTheme()
  const classes = useHomeStyles()

  React.useEffect(() => {
    onChangeHeader(theme.palette.primary.main)
  }, [theme, onChangeHeader])

  React.useEffect(() => {
    if (metaMaskWalletTask.status === 'successful') {
      onLoadAccounts(metaMaskWalletTask.data.hermezEthereumAddress)
    }
  }, [metaMaskWalletTask, onLoadAccounts])

  React.useEffect(() => {
    onLoadPoolTransactions()
    onLoadExits()
    onLoadCoordinatorState()
  }, [onLoadPoolTransactions, onLoadExits, onLoadCoordinatorState])

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
      <Container backgroundColor={theme.palette.primary.main} addHeaderPadding disableTopGutter>
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
            (poolTransactionsTask.status === 'successful' ||
            poolTransactionsTask.status === 'reloading') &&
            (exitsTask.status === 'successful' ||
            exitsTask.status === 'reloading')
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
                    pendingDelayedWithdraws={pendingDelayedWithdraws[metaMaskWalletTask.data.hermezEthereumAddress]}
                    onAddPendingDelayedWithdraw={onAddPendingDelayedWithdraw}
                    onRemovePendingDelayedWithdraw={onRemovePendingDelayedWithdraw}
                    coordinatorState={coordinatorStateTask.data}
                  />
                  {exitsTask.status === 'successful' &&
                    <ExitList
                      transactions={exitsTask.data.exits}
                      fiatExchangeRates={
                        fiatExchangeRatesTask.status === 'successful'
                          ? fiatExchangeRatesTask.data
                          : undefined
                      }
                      preferredCurrency={preferredCurrency}
                      pendingWithdraws={pendingWithdraws[metaMaskWalletTask.data.hermezEthereumAddress]}
                      pendingDelayedWithdraws={pendingDelayedWithdraws[metaMaskWalletTask.data.hermezEthereumAddress]}
                      onAddPendingDelayedWithdraw={onAddPendingDelayedWithdraw}
                      onRemovePendingDelayedWithdraw={onRemovePendingDelayedWithdraw}
                      coordinatorState={coordinatorStateTask.data}
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
  exitsTask: PropTypes.object.isRequired,
  pendingWithdraws: PropTypes.object.isRequired,
  pendingDelayedWithdraws: PropTypes.object.isRequired,
  onLoadAccounts: PropTypes.func.isRequired,
  onLoadPoolTransactions: PropTypes.func.isRequired,
  onLoadExits: PropTypes.func.isRequired,
  onLoadCoordinatorState: PropTypes.func.isRequired,
  onAddPendingDelayedWithdraw: PropTypes.func.isRequired,
  onRemovePendingDelayedWithdraw: PropTypes.func.isRequired,
  onNavigateToAccountDetails: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.global.metaMaskWalletTask,
  accountsTask: state.home.accountsTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.settings.preferredCurrency,
  poolTransactionsTask: state.home.poolTransactionsTask,
  exitsTask: state.home.exitsTask,
  pendingWithdraws: state.global.pendingWithdraws,
  pendingDelayedWithdraws: state.global.pendingDelayedWithdraws,
  coordinatorStateTask: state.global.coordinatorStateTask
})

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: () =>
    dispatch(changeHeader({ type: 'main' })),
  onLoadAccounts: (hermezEthereumAddress, fromItem) =>
    dispatch(homeThunks.fetchAccounts(hermezEthereumAddress, fromItem)),
  onLoadPoolTransactions: () =>
    dispatch(homeThunks.fetchPoolTransactions()),
  onLoadExits: (exitTransactions) =>
    dispatch(homeThunks.fetchExits(exitTransactions)),
  onLoadCoordinatorState: () => dispatch(fetchCoordinatorState()),
  onAddPendingDelayedWithdraw: (hermezEthereumAddress, pendingDelayedWithdraw) =>
    dispatch(addPendingDelayedWithdraw(hermezEthereumAddress, pendingDelayedWithdraw)),
  onRemovePendingDelayedWithdraw: (hermezEthereumAddress, pendingDelayedWithdrawId) =>
    dispatch(removePendingDelayedWithdraw(hermezEthereumAddress, pendingDelayedWithdrawId)),
  onNavigateToAccountDetails: (accountIndex) =>
    dispatch(push(`/accounts/${accountIndex}`)),
  onOpenSnackbar: (message) =>
    dispatch(openSnackbar(message)),
  onCleanup: () => dispatch(resetState())
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Home))
