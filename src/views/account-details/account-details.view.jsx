import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import { push } from 'connected-react-router'

import useAccountDetailsStyles from './account-details.styles'
import { fetchAccount, fetchHistoryTransactions, fetchPoolTransactions } from '../../store/account-details/account-details.thunks'
import Spinner from '../shared/spinner/spinner.view'
import TransactionList from './components/transaction-list/transaction-list.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import { getTokenAmountInPreferredCurrency } from '../../utils/currencies'
import Container from '../shared/container/container.view'
import { changeHeader } from '../../store/global/global.actions'
import TransactionActions from '../shared/transaction-actions/transaction-actions.view'

function AccountDetails ({
  metaMaskWalletTask,
  preferredCurrency,
  accountTask,
  poolTransactionsTask,
  historyTransactionsTask,
  fiatExchangeRatesTask,
  onChangeHeader,
  onLoadAccount,
  onLoadPoolTransactions,
  onLoadHistoryTransactions,
  onNavigateToTransactionDetails
}) {
  const theme = useTheme()
  const classes = useAccountDetailsStyles()
  const { accountIndex } = useParams()

  React.useEffect(() => {
    onLoadAccount(accountIndex)
    onLoadPoolTransactions(accountIndex)
    onLoadHistoryTransactions(accountIndex)
  }, [accountIndex, onLoadAccount, onLoadPoolTransactions, onLoadHistoryTransactions])

  React.useEffect(() => {
    if (accountTask.status === 'successful') {
      onChangeHeader(accountTask.data.tokenName)
    }
  }, [accountTask, onChangeHeader])

  /**
   * Returns the total balance of the account in the preferred currency
   *
   * @returns {Number} The balance of the account in the preferred currency
   */
  function getAccountBalance (account) {
    if (fiatExchangeRatesTask.status !== 'successful') {
      return '-'
    }

    const tokenFiatExchangeRate = getTokenAmountInPreferredCurrency(
      account.tokenSymbol,
      preferredCurrency,
      account.balanceUSD,
      fiatExchangeRatesTask.data
    )

    return (account.balance * tokenFiatExchangeRate).toFixed(2)
  }

  function handleTransactionClick (transaction) {
    onNavigateToTransactionDetails(accountIndex, transaction.id)
  }

  return (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} disableTopGutter>
        <section className={classes.section}>
          {(() => {
            switch (accountTask.status) {
              case 'loading': {
                return <Spinner />
              }
              case 'failed': {
                return <p>{accountTask.error}</p>
              }
              case 'successful': {
                return (
                  <div>
                    <h1 className={classes.fiatBalance}>
                      {preferredCurrency} {getAccountBalance(accountTask.data)}
                    </h1>
                    <p className={classes.tokenBalance}>
                      {accountTask.data.balance} {accountTask.data.tokenSymbol}
                    </p>
                  </div>
                )
              }
              default: {
                return <></>
              }
            }
          })()}
          <TransactionActions />
        </section>
      </Container>
      <Container>
        <section className={classes.section}>
          {(() => {
            if (
              poolTransactionsTask.status === 'loading' ||
              historyTransactionsTask.status === 'loading'
            ) {
              return <Spinner />
            }

            if (
              poolTransactionsTask.status === 'failed' ||
              historyTransactionsTask.status === 'failed'
            ) {
              return (
                <>
                  {
                    poolTransactionsTask.status === 'failed'
                      ? <p>{poolTransactionsTask.error}</p>
                      : <></>
                  }
                  {
                    historyTransactionsTask.status === 'failed'
                      ? <p>{historyTransactionsTask.error}</p>
                      : <></>
                  }
                </>
              )
            }

            if (
              poolTransactionsTask.status === 'successful' &&
              historyTransactionsTask.status === 'successful'
            ) {
              return (
                <>
                  <TransactionList
                    transactions={poolTransactionsTask.data}
                    fiatExchangeRates={
                      fiatExchangeRatesTask.status === 'successful'
                        ? fiatExchangeRatesTask.data
                        : undefined
                    }
                    preferredCurrency={preferredCurrency}
                    onTransactionClick={handleTransactionClick}
                  />
                  <TransactionList
                    transactions={historyTransactionsTask.data.transactions}
                    fiatExchangeRates={
                      fiatExchangeRatesTask.status === 'successful'
                        ? fiatExchangeRatesTask.data
                        : undefined
                    }
                    preferredCurrency={preferredCurrency}
                    onTransactionClick={handleTransactionClick}
                  />
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
  fiatExchangeRatesTask: PropTypes.object.isRequired,
  onLoadAccount: PropTypes.func.isRequired,
  onChangeHeader: PropTypes.func.isRequired,
  onLoadPoolTransactions: PropTypes.func.isRequired,
  onLoadHistoryTransactions: PropTypes.func.isRequired,
  onNavigateToTransactionDetails: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.account.metaMaskWalletTask,
  preferredCurrency: state.settings.preferredCurrency,
  accountTask: state.accountDetails.accountTask,
  poolTransactionsTask: state.accountDetails.poolTransactionsTask,
  historyTransactionsTask: state.accountDetails.historyTransactionsTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadAccount: (accountIndex) => dispatch(fetchAccount(accountIndex)),
  onChangeHeader: (tokenName) =>
    dispatch(changeHeader({ type: 'page', data: { title: tokenName, previousRoute: '/' } })),
  onLoadPoolTransactions: (accountIndex) => dispatch(fetchPoolTransactions(accountIndex)),
  onLoadHistoryTransactions: (accountIndex) =>
    dispatch(fetchHistoryTransactions(accountIndex)),
  onNavigateToTransactionDetails: (accountIndex, transactionId) =>
    dispatch(push(`/accounts/${accountIndex}/transactions/${transactionId}`))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(AccountDetails))
