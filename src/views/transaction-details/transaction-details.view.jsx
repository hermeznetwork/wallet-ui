import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import useTransactionDetailsStyles from './transaction-details.styles'
import { fetchTransaction } from '../../store/transaction-details/transaction-details.thunks'
import Spinner from '../shared/spinner/spinner.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'

function TransactionDetails ({
  tokensTask,
  transactionTask,
  preferredCurrency,
  onLoadTransaction
}) {
  const classes = useTransactionDetailsStyles()
  const history = useHistory()
  const { tokenId, transactionId } = useParams()

  React.useEffect(() => {
    onLoadTransaction(transactionId)
  }, [transactionId, onLoadTransaction])

  function getToken (tokenId) {
    return tokensTask.data.find((token) => token.TokenID === tokenId)
  }

  function handleNavigationToAccountDetails () {
    history.push(`/accounts/${tokenId}`)
  }

  return (
    <div>
      {(() => {
        switch (tokensTask.status) {
          case 'loading': {
            return <Spinner />
          }
          case 'failed': {
            return <p>{tokensTask.error}</p>
          }
          case 'successful': {
            return (
              <>
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
                            <h1>{transactionTask.data.Type} - {getToken(preferredCurrency).Symbol}</h1>
                            <p>{transactionTask.data.Amount} {getToken(transactionTask.data.TokenID).Symbol}</p>
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
                                  <p>- {getToken(preferredCurrency).Symbol}</p>
                                  <p>{transactionTask.data.Fee} {getToken(transactionTask.data.TokenID).Symbol}</p>
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
  preferredCurrency: PropTypes.number.isRequired,
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
  onLoadTransaction: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  tokensTask: state.global.tokensTask,
  preferredCurrency: state.settings.preferredCurrency,
  transactionTask: state.transactionDetails.transactionTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadTransaction: (transactionId) => dispatch(fetchTransaction(transactionId))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(TransactionDetails))
