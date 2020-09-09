import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import useTransactionDetailsStyles from './transaction-details.styles'
import { fetchTransaction } from '../../store/transaction-details/transaction-details.thunks'
import Spinner from '../shared/spinner/spinner.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import { CurrencySymbol } from '../../utils/currencies'

function TransactionDetails ({
  tokensTask,
  transactionTask,
  fiatExchangeRatesTask,
  preferredCurrency,
  onLoadTransaction
}) {
  const classes = useTransactionDetailsStyles()
  const history = useHistory()
  const { tokenId, transactionId } = useParams()

  React.useEffect(() => {
    onLoadTransaction(transactionId)
  }, [transactionId, onLoadTransaction])

  function getTokenSymbol (tokenId) {
    if (tokensTask.status !== 'successful') {
      return '-'
    }

    return tokensTask.data.find((token) => token.tokenId === tokenId).symbol
  }

  function getAmountInFiat (tokenId, amount) {
    if (
      tokensTask.status !== 'successful' ||
      fiatExchangeRatesTask.status !== 'successful'
    ) {
      return '-'
    }

    const tokenRateInUSD = tokensTask.data
      .find((token) => token.tokenId === tokenId).USD
    const tokenFiatRate = preferredCurrency === CurrencySymbol.USD
      ? tokenRateInUSD
      : tokenRateInUSD * fiatExchangeRatesTask.data[preferredCurrency]

    return amount * tokenFiatRate
  }

  function handleNavigationToAccountDetails () {
    history.push(`/accounts/${tokenId}`)
  }

  return (
    <div className={classes.root}>
      {(() => {
        switch (transactionTask.status) {
          case 'loading': {
            return <Spinner />
          }
          case 'failed': {
            return <p>{transactionTask.error}</p>
          }
          case 'successful': {
            return (
              <>
                <button className={classes.closeButton} onClick={handleNavigationToAccountDetails}>
                  Close
                </button>
                <div className={classes.statusContainer}>
                  <h2>{transactionTask.data.Status || 'Completed'}</h2>
                  <a href='https://hermez.io' target='_blank' rel='noopener noreferrer'>
                    View in network explorer
                  </a>
                </div>
                <div className={classes.transactionInfoContainer}>
                  <h1>{transactionTask.data.type} {getAmountInFiat(transactionTask.data.tokenId, transactionTask.data.amount)} {preferredCurrency}</h1>
                  <p>{transactionTask.data.amount} {getTokenSymbol(transactionTask.data.tokenId)}</p>
                  <ul className={classes.transactionInfoList}>
                    <li className={classes.transactionInfoListItem}>
                      <p className={classes.transactionInfoListItemTitle}>To</p>
                      <p>{transactionTask.data.toEthAddr}</p>
                    </li>
                    <li className={classes.transactionInfoListItem}>
                      <p className={classes.transactionInfoListItemTitle}>
                        Fee
                      </p>
                      <div>
                        <p>{getAmountInFiat(transactionTask.data.tokenId, transactionTask.data.fee)} {preferredCurrency}</p>
                        <p>{transactionTask.data.fee} {getTokenSymbol(transactionTask.data.tokenId)}</p>
                      </div>
                    </li>
                    <li className={classes.transactionInfoListItem}>
                      <p className={classes.transactionInfoListItemTitle}>
                        Date
                      </p>
                      <p>{new Date().toLocaleString()}</p>
                    </li>
                  </ul>
                </div>
              </>
            )
          }
          default: {
            return <></>
          }
        }
      })()}
    </div>
  )
}

TransactionDetails.propTypes = {
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
  preferredCurrency: PropTypes.string.isRequired,
  transactionTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.shape({
      type: PropTypes.string.isRequired,
      toEthAddr: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      fee: PropTypes.number.isRequired,
      tokenId: PropTypes.number.isRequired
    }),
    error: PropTypes.string
  }),
  fiatExchangeRatesTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.object
  }),
  onLoadTransaction: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  tokensTask: state.global.tokensTask,
  preferredCurrency: state.settings.preferredCurrency,
  transactionTask: state.transactionDetails.transactionTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadTransaction: (transactionId) => dispatch(fetchTransaction(transactionId))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(TransactionDetails))
