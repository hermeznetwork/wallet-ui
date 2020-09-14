import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import useAccountDetailsStyles from './account-details.styles'
import { fetchAccount, fetchTransactions } from '../../store/account-details/account-details.thunks'
import Spinner from '../shared/spinner/spinner.view'
import TransactionList from './components/transaction-list/transaction-list.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import { CurrencySymbol } from '../../utils/currencies'
import Container from '../shared/container/container.view'
import { push } from 'connected-react-router'

function AccountDetails ({
  metaMaskWalletTask,
  preferredCurrency,
  accountTask,
  transactionsTask,
  tokensTask,
  fiatExchangeRatesTask,
  onLoadAccount,
  onLoadTransactions,
  onNavigateToTransactionDetails
}) {
  const classes = useAccountDetailsStyles()
  const { tokenId } = useParams()

  React.useEffect(() => {
    if (metaMaskWalletTask.status === 'successful') {
      onLoadAccount(metaMaskWalletTask.data.ethereumAddress, tokenId)
      onLoadTransactions(metaMaskWalletTask.data.ethereumAddress, tokenId)
    }
  }, [metaMaskWalletTask, tokenId, onLoadAccount, onLoadTransactions])

  function getTokenSymbol (tokenId) {
    return tokensTask.data.find((token) => token.tokenId === tokenId).symbol
  }

  function getAccountBalance () {
    if (
      accountTask.status !== 'successful' ||
      tokensTask.status !== 'successful' ||
      fiatExchangeRatesTask.status !== 'successful'
    ) {
      return '-'
    }
    const tokenSymbol = getTokenSymbol(accountTask.data.tokenId)
    const tokenRateInUSD = tokensTask.data
      .find((token) => token.symbol === tokenSymbol).USD
    const tokenRate = preferredCurrency === CurrencySymbol.USD
      ? tokenRateInUSD
      : tokenRateInUSD * fiatExchangeRatesTask.data[preferredCurrency]

    return accountTask.data.balance * tokenRate
  }

  function getTokenName (tokenId) {
    if (tokensTask.status !== 'successful') {
      return '-'
    }

    return tokensTask.data.find(token => token.tokenId === tokenId).name
  }

  function handleTransactionClick (transactionId) {
    onNavigateToTransactionDetails(tokenId, transactionId)
  }

  return (
    <Container>

      <div className={classes.root}>
        <section>
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
                    <h3>{getTokenName(accountTask.data.tokenId)}</h3>
                    <h1>{getAccountBalance().toFixed(2)} {preferredCurrency}</h1>
                    <p>{accountTask.data.balance} {getTokenSymbol(accountTask.data.tokenId)}</p>
                  </div>
                )
              }
              default: {
                return <></>
              }
            }
          })()}
          <div className={classes.actionButtonsGroup}>
            <button className={classes.actionButton}>Send</button>
            <button className={classes.actionButton}>Add funds</button>
            <button className={classes.actionButton}>Withdrawal</button>
          </div>
        </section>
        <section>
          <h4 className={classes.title}>Activity</h4>
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
                    transactions={transactionsTask.data}
                    tokens={tokensTask.status === 'successful' ? tokensTask.data : undefined}
                    fiatExchangeRates={fiatExchangeRatesTask.status === 'successful' ? fiatExchangeRatesTask.data : undefined}
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
      </div>
    </Container>
  )
}

AccountDetails.propTypes = {
  preferredCurrency: PropTypes.string.isRequired,
  accountTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.shape({
      balance: PropTypes.number.isRequired,
      tokenId: PropTypes.number.isRequired
    }),
    error: PropTypes.string
  }),
  transactionsTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        txId: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        tokenId: PropTypes.number.isRequired
      })
    ),
    error: PropTypes.string
  }),
  tokensTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        tokenId: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        symbol: PropTypes.string.isRequired
      })
    )
  }),
  fiatExchangeRatesTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.object,
    error: PropTypes.string
  }),
  onLoadAccount: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.account.metaMaskWalletTask,
  preferredCurrency: state.settings.preferredCurrency,
  accountTask: state.accountDetails.accountTask,
  transactionsTask: state.accountDetails.transactionsTask,
  tokensTask: state.global.tokensTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadAccount: (ethereumAddress, tokenId) => dispatch(fetchAccount(ethereumAddress, tokenId)),
  onLoadTransactions: (ethereumAddress, tokenId) => dispatch(fetchTransactions(ethereumAddress, tokenId)),
  onNavigateToTransactionDetails: (tokenId, transactionId) =>
    dispatch(push(`/accounts/${tokenId}/transactions/${transactionId}`))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(AccountDetails))
