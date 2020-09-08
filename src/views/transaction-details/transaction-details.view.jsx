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

    return tokensTask.data.find((token) => token.TokenID === tokenId).Symbol
  }

  function getAmountInFiat (tokenId, amount) {
    if (
      tokensTask.status !== 'successful' ||
      fiatExchangeRatesTask.status !== 'successful'
    ) {
      return '-'
    }

    const tokenRateInUSD = tokensTask.data
      .find((token) => token.TokenID === tokenId).USD
    const tokenFiatRate = preferredCurrency === CurrencySymbol.USD
      ? tokenRateInUSD
      : tokenRateInUSD * fiatExchangeRatesTask.data[preferredCurrency]

    return amount * tokenFiatRate
  }

  function handleNavigationToAccountDetails () {
    history.push(`/accounts/${tokenId}`)
  }

  return (
    <div>
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
                  <h1>{transactionTask.data.Type} {getAmountInFiat(transactionTask.data.TokenID, transactionTask.data.Amount)} {preferredCurrency}</h1>
                  <p>{transactionTask.data.Amount} {getTokenSymbol(transactionTask.data.TokenID)}</p>
                  <ul className={classes.transactionInfoList}>
                    <li className={classes.transactionInfoListItem}>
                      <p className={classes.transactionInfoListItemTitle}>To</p>
                      <p>{transactionTask.data.ToEthAddr}</p>
                    </li>
                    <li className={classes.transactionInfoListItem}>
                      <p className={classes.transactionInfoListItemTitle}>
                        Fee
                      </p>
                      <div>
                        <p>{getAmountInFiat(transactionTask.data.TokenID, transactionTask.data.Fee)} {preferredCurrency}</p>
                        <p>{transactionTask.data.Fee} {getTokenSymbol(transactionTask.data.TokenID)}</p>
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
        TokenID: PropTypes.number.isRequired,
        Name: PropTypes.string.isRequired,
        Symbol: PropTypes.string.isRequired
      })
    )
  }),
  preferredCurrency: PropTypes.string.isRequired,
  transactionTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.shape({
      Type: PropTypes.string.isRequired,
      ToEthAddr: PropTypes.string.isRequired,
      Amount: PropTypes.number.isRequired,
      Fee: PropTypes.number.isRequired,
      TokenID: PropTypes.number.isRequired
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
