import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useTheme } from 'react-jss'
import { beautifyTransactionState } from 'hermezjs/src/tx'

import useTransactionDetailsStyles from './transaction-details.styles'
import { fetchTransaction } from '../../store/transaction-details/transaction-details.thunks'
import Spinner from '../shared/spinner/spinner.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import { CurrencySymbol, getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../utils/currencies'
import Container from '../shared/container/container.view'
import { changeHeader } from '../../store/global/global.actions'
import TransactionInfo from '../shared/transaction-info/transaction-info.view'
import { ReactComponent as OpenInNewTabIcon } from '../../images/icons/open-in-new-tab.svg'

function TransactionDetails ({
  transactionTask,
  fiatExchangeRatesTask,
  preferredCurrency,
  onLoadTransaction,
  onChangeHeader
}) {
  const theme = useTheme()
  const classes = useTransactionDetailsStyles()
  const { accountIndex, transactionId } = useParams()

  React.useEffect(() => {
    onLoadTransaction(transactionId)
  }, [transactionId, onLoadTransaction])

  React.useEffect(() => {
    if (transactionTask.status === 'successful') {
      onChangeHeader(transactionTask.data.type, accountIndex)
    }
  }, [transactionTask, accountIndex, onChangeHeader])

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

  return (
    <div>
      <Container backgroundColor={theme.palette.primary.main}>
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
                <section className={classes.section}>
                  <h1 className={classes.fiatAmount}>
                    {CurrencySymbol[preferredCurrency].symbol} {getAmountInFiat(transactionTask.data.amount, transactionTask.data.token)}
                  </h1>
                  <p className={classes.tokenAmount}>
                    {transactionTask.data.amount} {transactionTask.data.token.symbol}
                  </p>
                </section>
              )
            }
            default: {
              return <></>
            }
          }
        })()}
      </Container>
      <Container>
        <section className={classes.section}>
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
                  <TransactionInfo
                    status={beautifyTransactionState(transactionTask.data.state)}
                    from={transactionTask.data.fromAccountIndex}
                    to={transactionTask.data.toAccountIndex}
                    date={new Date(transactionTask.data.timestamp).toLocaleString()}
                  />
                )
              }
              default: {
                return <></>
              }
            }
          })()}
          {
            transactionTask.status === 'successful'
              ? (
                <a
                  className={classes.link}
                  href={`${process.env.REACT_APP_BATCH_EXPLORER_URL}`}
                  target='__blank'
                  rel='noopener noreferrer'
                >
                  <OpenInNewTabIcon className={classes.linkIcon} />
                  View in Explorer
                </a>
              )
              : <></>
          }
        </section>
      </Container>
    </div>
  )
}

TransactionDetails.propTypes = {
  preferredCurrency: PropTypes.string.isRequired,
  transactionTask: PropTypes.object.isRequired,
  fiatExchangeRatesTask: PropTypes.object.isRequired,
  onLoadTransaction: PropTypes.func.isRequired,
  onChangeHeader: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  preferredCurrency: state.settings.preferredCurrency,
  transactionTask: state.transactionDetails.transactionTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadTransaction: (transactionId) => dispatch(fetchTransaction(transactionId)),
  onChangeHeader: (transactionType, accountIndex) => dispatch(
    changeHeader({
      type: 'page',
      data: {
        title: transactionType,
        previousRoute: `/accounts/${accountIndex}`
      }
    })
  )
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(TransactionDetails))
