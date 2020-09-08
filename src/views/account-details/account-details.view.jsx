import React from 'react'
import PropTypes from 'prop-types'
import { useParams, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import useAccountDetailsStyles from './account-details.styles'
import { fetchAccount, fetchTransactions } from '../../store/account-details/account-details.thunks'
import Spinner from '../shared/spinner/spinner.view'
import TransactionList from './components/transaction-list/transaction-list.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import { CurrencySymbol } from '../../utils/currencies'

function AccountDetails ({
  metaMaskWalletTask,
  preferredCurrency,
  accountTask,
  transactionsTask,
  tokensTask,
  fiatExchangeRatesTask,
  onLoadAccount,
  onLoadTransactions
}) {
  const classes = useAccountDetailsStyles()
  const history = useHistory()
  const { tokenId } = useParams()

  React.useEffect(() => {
    if (metaMaskWalletTask.status === 'successful') {
      onLoadAccount(metaMaskWalletTask.data.ethereumAddress, tokenId)
      onLoadTransactions(metaMaskWalletTask.data.ethereumAddress, tokenId)
    }
  }, [metaMaskWalletTask, tokenId, onLoadAccount, onLoadTransactions])

  function getTokenSymbol (tokenId) {
    return tokensTask.data.find((token) => token.TokenID === tokenId).Symbol
  }

  function getAccountBalance () {
    if (
      accountTask.status !== 'successful' ||
      tokensTask.status !== 'successful' ||
      fiatExchangeRatesTask.status !== 'successful'
    ) {
      return '-'
    }
    const tokenSymbol = getTokenSymbol(accountTask.data.TokenID)
    const tokenRateInUSD = tokensTask.data
      .find((token) => token.Symbol === tokenSymbol).USD
    const tokenRate = preferredCurrency === CurrencySymbol.USD
      ? tokenRateInUSD
      : tokenRateInUSD * fiatExchangeRatesTask.data[preferredCurrency]

    return accountTask.data.Balance * tokenRate
  }

  function getTokenName (tokenId) {
    if (tokensTask.status !== 'successful') {
      return '-'
    }

    return tokensTask.data.find(token => token.TokenID === tokenId).Name
  }

  function handleTransactionClick (transactionId) {
    history.push(`/accounts/${tokenId}/transactions/${transactionId}`)
  }

  return (
    <div>
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
                  <h3>{getTokenName(accountTask.data.TokenID)}</h3>
                  <h1>{getAccountBalance().toFixed(2)} {preferredCurrency}</h1>
                  <p>{accountTask.data.Balance} {getTokenSymbol(accountTask.data.TokenID)}</p>
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
  )
}

AccountDetails.propTypes = {
  preferredCurrency: PropTypes.string.isRequired,
  accountTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.shape({
      Balance: PropTypes.number.isRequired,
      TokenID: PropTypes.number.isRequired
    }),
    error: PropTypes.string
  }),
  transactionsTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        TxID: PropTypes.string.isRequired,
        Type: PropTypes.string.isRequired,
        Amount: PropTypes.number.isRequired,
        TokenID: PropTypes.number.isRequired
      })
    ),
    error: PropTypes.string
  }),
  tokensTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        TokenID: PropTypes.number.isRequired,
        Name: PropTypes.string.isRequired,
        Symbol: PropTypes.string.isRequired
      })
    )
  }),
  tokensPriceTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        symbol: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired
      })
    ),
    error: PropTypes.string
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
  tokensPriceTask: state.home.tokensPriceTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadAccount: (ethereumAddress, tokenId) => dispatch(fetchAccount(ethereumAddress, tokenId)),
  onLoadTransactions: (ethereumAddress, tokenId) => dispatch(fetchTransactions(ethereumAddress, tokenId))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(AccountDetails))
