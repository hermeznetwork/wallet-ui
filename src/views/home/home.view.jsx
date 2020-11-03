import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import { push } from 'connected-react-router'
import { TxType } from 'hermezjs/src/tx'

import useHomeStyles from './home.styles'
import * as homeThunks from '../../store/home/home.thunks'
import AccountBalance from '../shared/account-balance/account-balance.view'
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

function Home ({
  metaMaskWalletTask,
  accountsTask,
  poolTransactionsTask,
  historyTransactionsTask,
  exitsTask,
  fiatExchangeRatesTask,
  preferredCurrency,
  onChangeHeader,
  onLoadAccounts,
  onLoadPoolTransactions,
  onLoadHistoryTransactions,
  onLoadExits,
  onNavigateToAccountDetails,
  onOpenSnackbar,
  onNavigateTest
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
    onLoadHistoryTransactions()
  }, [onLoadPoolTransactions, onLoadHistoryTransactions])

  React.useEffect(() => {
    if (historyTransactionsTask.status === 'successful') {
      const exitTransactions = historyTransactionsTask.data.transactions.filter((transaction) => transaction.type === TxType.Exit)

      onLoadExits(exitTransactions)
    }
  }, [historyTransactionsTask, onLoadExits])

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

  function renderExits () {
    if (
      poolTransactionsTask.status === 'successful' &&
      historyTransactionsTask.status === 'successful'
    ) {
      return (
        <>
          <ExitList
            transactions={getPendingExits()}
            fiatExchangeRates={
              fiatExchangeRatesTask.status === 'successful'
                ? fiatExchangeRatesTask.data
                : undefined
            }
            preferredCurrency={preferredCurrency}
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
            />}
        </>
      )
    }
  }

  return (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} addHeaderPadding disableTopGutter>
        <section className={classes.section}>
          {
            metaMaskWalletTask.status !== 'successful'
              ? <></>
              : (
                <Button
                  text={getPartiallyHiddenHermezAddress(metaMaskWalletTask.data.hermezEthereumAddress)}
                  onClick={() => handleEthereumAddressClick(metaMaskWalletTask.data.hermezEthereumAddress)}
                />
              )
          }
          <div className={classes.accountBalance}>
            <AccountBalance
              amount={getTotalBalance(accountsTask)}
              currency={preferredCurrency}
            />
          </div>
          <TransactionActions hideWithdraw />
        </section>
      </Container>
      <Container>
        <section className={classes.section}>
          {renderExits()}
          {(() => {
            switch (accountsTask.status) {
              case 'loading':
              case 'failed': {
                return <Spinner />
              }
              case 'reloading':
              case 'successful': {
                return (
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
  onLoadAccounts: PropTypes.func.isRequired,
  onLoadPoolTransactions: PropTypes.func.isRequired,
  onLoadHistoryTransactions: PropTypes.func.isRequired,
  onLoadExits: PropTypes.func.isRequired,
  onNavigateToAccountDetails: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.global.metaMaskWalletTask,
  accountsTask: state.home.accountsTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.settings.preferredCurrency,
  poolTransactionsTask: state.home.poolTransactionsTask,
  historyTransactionsTask: state.home.historyTransactionsTask,
  exitsTask: state.home.exitsTask
})

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: (backgroundColor) =>
    dispatch(changeHeader({ type: 'main', data: { backgroundColor } })),
  onLoadAccounts: (hermezEthereumAddress) =>
    dispatch(homeThunks.fetchAccounts(hermezEthereumAddress)),
  onLoadPoolTransactions: () =>
    dispatch(homeThunks.fetchPoolTransactions()),
  onLoadHistoryTransactions: () =>
    dispatch(homeThunks.fetchHistoryTransactions()),
  onLoadExits: (exitTransactions) =>
    dispatch(homeThunks.fetchExits(exitTransactions)),
  onNavigateToAccountDetails: (accountIndex) =>
    dispatch(push(`/accounts/${accountIndex}`)),
  onOpenSnackbar: (message) =>
    dispatch(openSnackbar(message))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Home))
