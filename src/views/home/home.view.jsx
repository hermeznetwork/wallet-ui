import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import { push } from 'connected-react-router'

import useHomeStyles from './home.styles'
import { addPendingDelayedWithdraw, removePendingDelayedWithdraw } from '../../store/global/global.thunks'
import * as homeThunks from '../../store/home/home.thunks'
import FiatAmount from '../shared/fiat-amount/fiat-amount.view'
import AccountList from '../shared/account-list/account-list.view'
import Spinner from '../shared/spinner/spinner.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view.jsx'
import Container from '../shared/container/container.view'
import { copyToClipboard } from '../../utils/browser'
import { changeHeader, openSnackbar } from '../../store/global/global.actions'
import TransactionActions from '../shared/transaction-actions/transaction-actions.view'
import ExitList from '../shared/exit-list/exit-list.view'
import { getPartiallyHiddenHermezAddress } from '../../utils/addresses'
import Button from '../shared/button/button.view'
import InfiniteScroll from '../shared/infinite-scroll/infinite-scroll.view'
import { resetState } from '../../store/home/home.actions'
import { WithdrawRedirectionRoute } from '../transaction/transaction.view'

function Home ({
  wallet,
  totalAccountsBalanceTask,
  accountsTask,
  poolTransactionsTask,
  exitsTask,
  fiatExchangeRatesTask,
  preferredCurrency,
  pendingWithdraws,
  pendingDelayedWithdraws,
  coordinatorStateTask,
  onChangeHeader,
  onLoadTotalAccountsBalance,
  onLoadAccounts,
  onLoadPoolTransactions,
  onLoadExits,
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
    if (fiatExchangeRatesTask.status === 'successful') {
      onLoadTotalAccountsBalance(
        wallet.hermezEthereumAddress,
        preferredCurrency,
        fiatExchangeRatesTask.data
      )
    }
  }, [wallet, preferredCurrency, fiatExchangeRatesTask, onLoadTotalAccountsBalance])

  React.useEffect(() => {
    if (wallet && coordinatorStateTask.status === 'successful') {
      onLoadAccounts(wallet.hermezEthereumAddress)
    }
  }, [wallet, coordinatorStateTask, onLoadAccounts])

  React.useEffect(() => {
    if (coordinatorStateTask.status === 'successful') {
      onLoadPoolTransactions()
      onLoadExits()
    }
  }, [coordinatorStateTask, onLoadPoolTransactions, onLoadExits])

  React.useEffect(() => onCleanup, [onCleanup])

  /**
   * Filters the transactions of type exit from the transaction pool
   * @returns {void}
   */
  function getPendingExits () {
    return poolTransactionsTask.data.filter((transaction) => transaction.type === 'Exit')
  }

  /**
   * Navigates to the AccountDetails view when an account is clicked
   * @param {Object} account - Account
   * @returns {void}
   */
  function handleAccountClick (account) {
    onNavigateToAccountDetails(account.accountIndex)
  }

  /**
   * Copies the Hermez Ethereum address to the clipboard when it's clicked
   * @param {string} hermezEthereumAddress - Hermez Ethereum address
   * @returns {void}
   */
  function handleEthereumAddressClick (hermezEthereumAddress) {
    copyToClipboard(hermezEthereumAddress)
    onOpenSnackbar('The Hermez address has been copied to the clipboard!')
  }

  return wallet && (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} addHeaderPadding disableTopGutter>
        <section className={classes.section}>
          {
            <Button
              text={getPartiallyHiddenHermezAddress(wallet.hermezEthereumAddress)}
              className={classes.walletAddress}
              onClick={() => handleEthereumAddressClick(wallet.hermezEthereumAddress)}
            />
          }
          <div className={classes.accountBalance}>
            <FiatAmount
              amount={totalAccountsBalanceTask.data}
              currency={preferredCurrency}
            />
          </div>
          <TransactionActions
            hideSend={
              accountsTask.status === 'successful'
                ? accountsTask.data.accounts.length === 0
                : true
            }
            hideWithdraw
          />
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
                    pendingWithdraws={pendingWithdraws[wallet.hermezEthereumAddress]}
                    pendingDelayedWithdraws={pendingDelayedWithdraws[wallet.hermezEthereumAddress]}
                    onAddPendingDelayedWithdraw={onAddPendingDelayedWithdraw}
                    onRemovePendingDelayedWithdraw={onRemovePendingDelayedWithdraw}
                    coordinatorState={coordinatorStateTask.data}
                    redirectTo={WithdrawRedirectionRoute.Home}
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
                      pendingWithdraws={pendingWithdraws[wallet.hermezEthereumAddress]}
                      pendingDelayedWithdraws={pendingDelayedWithdraws[wallet.hermezEthereumAddress]}
                      onAddPendingDelayedWithdraw={onAddPendingDelayedWithdraw}
                      onRemovePendingDelayedWithdraw={onRemovePendingDelayedWithdraw}
                      coordinatorState={coordinatorStateTask.data}
                      redirectTo={WithdrawRedirectionRoute.Home}
                    />}
                </>
              )
              : <></>
          }
          {(() => {
            switch (accountsTask.status) {
              case 'loading':
                return <Spinner />
              case 'reloading':
              case 'successful': {
                if (accountsTask.data.accounts.length === 0) {
                  return (
                    <p className={classes.emptyAccounts}>
                      Deposit tokens from your Ethereum account.
                    </p>
                  )
                }

                return (
                  <InfiniteScroll
                    asyncTaskStatus={accountsTask.status}
                    paginationData={accountsTask.data.pagination}
                    onLoadNextPage={(fromItem) => {
                      onLoadAccounts(
                        wallet.hermezEthereumAddress,
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
  totalAccountsBalanceTask: PropTypes.object,
  accountsTask: PropTypes.object,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRatesTask: PropTypes.object,
  poolTransactionsTask: PropTypes.object.isRequired,
  exitsTask: PropTypes.object.isRequired,
  pendingWithdraws: PropTypes.object.isRequired,
  pendingDelayedWithdraws: PropTypes.object.isRequired,
  onLoadTotalAccountsBalance: PropTypes.func.isRequired,
  onLoadAccounts: PropTypes.func.isRequired,
  onLoadPoolTransactions: PropTypes.func.isRequired,
  onLoadExits: PropTypes.func.isRequired,
  onAddPendingDelayedWithdraw: PropTypes.func.isRequired,
  onRemovePendingDelayedWithdraw: PropTypes.func.isRequired,
  onNavigateToAccountDetails: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  wallet: state.global.wallet,
  totalAccountsBalanceTask: state.home.totalAccountsBalanceTask,
  accountsTask: state.home.accountsTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.myAccount.preferredCurrency,
  poolTransactionsTask: state.home.poolTransactionsTask,
  exitsTask: state.home.exitsTask,
  pendingWithdraws: state.global.pendingWithdraws,
  pendingDelayedWithdraws: state.global.pendingDelayedWithdraws,
  coordinatorStateTask: state.global.coordinatorStateTask
})

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: () =>
    dispatch(changeHeader({ type: 'main' })),
  onLoadTotalAccountsBalance: (hermezEthereumAddress, preferredCurrency, fiatExchangeRates) =>
    dispatch(homeThunks.fetchTotalAccountsBalance(hermezEthereumAddress, preferredCurrency, fiatExchangeRates)),
  onLoadAccounts: (hermezEthereumAddress, fromItem) =>
    dispatch(homeThunks.fetchAccounts(hermezEthereumAddress, fromItem)),
  onLoadPoolTransactions: () =>
    dispatch(homeThunks.fetchPoolTransactions()),
  onLoadExits: (exitTransactions) =>
    dispatch(homeThunks.fetchExits(exitTransactions)),
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
