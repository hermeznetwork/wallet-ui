import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import { push } from 'connected-react-router'

import useAccountDetailsStyles from './account-details.styles'
import { fetchAccount, fetchTransactions, fetchUSDTokenExchangeRate } from '../../store/account-details/account-details.thunks'
import Spinner from '../shared/spinner/spinner.view'
import TransactionList from './components/transaction-list/transaction-list.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import { getTokenFiatExchangeRate } from '../../utils/currencies'
import Container from '../shared/container/container.view'
import { changeHeader } from '../../store/global/global.actions'
import TransactionActions from '../shared/transaction-actions/transaction-actions.view'

function AccountDetails ({
  metaMaskWalletTask,
  preferredCurrency,
  accountTask,
  transactionsTask,
  usdTokenExchangeRateTask,
  fiatExchangeRatesTask,
  onChangeHeader,
  onLoadAccount,
  onLoadTransactions,
  onNavigateToTransactionDetails,
  onLoadUSDTokenExchangeRate
}) {
  const theme = useTheme()
  const classes = useAccountDetailsStyles()
  const { accountIndex } = useParams()

  React.useEffect(() => {
    onLoadAccount(accountIndex)
  }, [accountIndex, onLoadAccount])

  React.useEffect(() => {
    if (accountTask.status === 'successful') {
      onLoadUSDTokenExchangeRate(accountTask.data.tokenId)
    }
  }, [accountTask, onLoadUSDTokenExchangeRate])

  React.useEffect(() => {
    if (accountTask.status === 'successful') {
      onChangeHeader(accountTask.data.tokenName)
    }
  }, [accountTask, onChangeHeader])

  React.useEffect(() => {
    if (metaMaskWalletTask.status === 'successful') {
      onLoadTransactions(metaMaskWalletTask.data.hermezEthereumAddress)
    }
  }, [metaMaskWalletTask, onLoadTransactions])

  /**
   * Returns the total balance of the account in the preferred currency
   *
   * @returns {Number} The balance of the account in the preferred currency
   */
  function getAccountBalance (account) {
    if (
      usdTokenExchangeRateTask.status !== 'successful' ||
      fiatExchangeRatesTask.status !== 'successful'
    ) {
      return '-'
    }

    const tokenFiatExchangeRate = getTokenFiatExchangeRate(
      account.tokenSymbol,
      preferredCurrency,
      usdTokenExchangeRateTask.data,
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
            switch (transactionsTask.status) {
              case 'loading': {
                return <Spinner />
              }
              case 'failed': {
                return <p>{transactionsTask.error}</p>
              }
              case 'successful': {
                return (
                  <TransactionList
                    transactions={transactionsTask.data.transactions}
                    usdTokenExchangeRate={
                      usdTokenExchangeRateTask.status === 'successful'
                        ? usdTokenExchangeRateTask.data
                        : undefined
                    }
                    fiatExchangeRates={
                      fiatExchangeRatesTask.status === 'successful'
                        ? fiatExchangeRatesTask.data
                        : undefined
                    }
                    preferredCurrency={preferredCurrency}
                    onTransactionClick={handleTransactionClick}
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

AccountDetails.propTypes = {
  preferredCurrency: PropTypes.string.isRequired,
  accountTask: PropTypes.object.isRequired,
  transactionsTask: PropTypes.object.isRequired,
  usdTokenExchangeRateTask: PropTypes.object.isRequired,
  fiatExchangeRatesTask: PropTypes.object.isRequired,
  onLoadAccount: PropTypes.func.isRequired,
  onChangeHeader: PropTypes.func.isRequired,
  onLoadTransactions: PropTypes.func.isRequired,
  onNavigateToTransactionDetails: PropTypes.func.isRequired,
  onLoadUSDTokenExchangeRate: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.account.metaMaskWalletTask,
  preferredCurrency: state.settings.preferredCurrency,
  accountTask: state.accountDetails.accountTask,
  transactionsTask: state.accountDetails.transactionsTask,
  usdTokenExchangeRateTask: state.accountDetails.usdTokenExchangeRateTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadAccount: (accountIndex) => dispatch(fetchAccount(accountIndex)),
  onChangeHeader: (tokenName) =>
    dispatch(changeHeader({ type: 'page', data: { title: tokenName, previousRoute: '/' } })),
  onLoadUSDTokenExchangeRate: (tokenId) => dispatch(fetchUSDTokenExchangeRate(tokenId)),
  onLoadTransactions: (ethereumAddress, tokenId) => dispatch(fetchTransactions(ethereumAddress, tokenId)),
  onNavigateToTransactionDetails: (accountIndex, transactionId) =>
    dispatch(push(`/accounts/${accountIndex}/transactions/${transactionId}`))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(AccountDetails))
