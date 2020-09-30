import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { push } from 'connected-react-router'

import useTransactionDetailsStyles from './transaction-details.styles'
import { fetchTransaction } from '../../store/transaction-details/transaction-details.thunks'
import Spinner from '../shared/spinner/spinner.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../utils/currencies'
import Container from '../shared/container/container.view'

function TransactionDetails ({
  transactionTask,
  fiatExchangeRatesTask,
  preferredCurrency,
  onLoadTransaction,
  onNavigateToAccountDetails
}) {
  const classes = useTransactionDetailsStyles()
  const { accountIndex, transactionId } = useParams()

  React.useEffect(() => {
    onLoadTransaction(transactionId)
  }, [transactionId, onLoadTransaction])

  function getAmountInFiat (amount, token) {
    if (fiatExchangeRatesTask.status !== 'successful') {
      return '-'
    }

    const fixedTokenAmount = getFixedTokenAmount(amount, token.decimals)
    const fiatTokenAmount = getTokenAmountInPreferredCurrency(
      fixedTokenAmount,
      token.USD,
      preferredCurrency,
      fiatExchangeRatesTask.data
    )

    return fiatTokenAmount.toFixed(2)
  }

  function handleNavigationToAccountDetails () {
    onNavigateToAccountDetails(accountIndex)
  }

  return (
    <Container>
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
                    <h1>{transactionTask.data.type} {getAmountInFiat(transactionTask.data.amount, transactionTask.data.token)} {preferredCurrency}</h1>
                    <p>{getFixedTokenAmount(transactionTask.data.fee, transactionTask.data.token.decimals)} {transactionTask.data.token.symbol}</p>
                    <ul className={classes.transactionInfoList}>
                      <li className={classes.transactionInfoListItem}>
                        <p className={classes.transactionInfoListItemTitle}>To</p>
                        <p>{transactionTask.data.toHezEthereumAddress}</p>
                      </li>
                      <li className={classes.transactionInfoListItem}>
                        <p className={classes.transactionInfoListItemTitle}>
                        Fee
                        </p>
                        <div>
                          <p>{getAmountInFiat(transactionTask.data.fee, transactionTask.data.token)} {preferredCurrency}</p>
                          <p>{getFixedTokenAmount(transactionTask.data.fee, transactionTask.data.token.decimals)} {transactionTask.data.token.symbol}</p>
                        </div>
                      </li>
                      <li className={classes.transactionInfoListItem}>
                        <p className={classes.transactionInfoListItemTitle}>
                        Date
                        </p>
                        <p>{new Date(transactionTask.data.timestamp).toLocaleString()}</p>
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
    </Container>
  )
}

TransactionDetails.propTypes = {
  preferredCurrency: PropTypes.string.isRequired,
  transactionTask: PropTypes.object.isRequired,
  fiatExchangeRatesTask: PropTypes.object.isRequired,
  onLoadTransaction: PropTypes.func.isRequired,
  onNavigateToAccountDetails: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  preferredCurrency: state.settings.preferredCurrency,
  transactionTask: state.transactionDetails.transactionTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadTransaction: (transactionId) => dispatch(fetchTransaction(transactionId)),
  onNavigateToAccountDetails: (accountIndex) => dispatch(push(`/accounts/${accountIndex}`))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(TransactionDetails))
