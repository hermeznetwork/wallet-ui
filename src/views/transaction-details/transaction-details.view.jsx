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
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../utils/currencies'
import Container from '../shared/container/container.view'
import { changeHeader } from '../../store/global/global.actions'
import TransactionInfo from '../shared/transaction-info/transaction-info.view'
import { ReactComponent as OpenInNewTabIcon } from '../../images/icons/open-in-new-tab.svg'
import { ACCOUNT_INDEX_SEPARATOR } from '../../constants'
import AccountBalance from '../shared/account-balance/account-balance.view'
import TokenBalance from '../account-details/components/token-balance/token-balance.view'

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
  const [, accountTokenSymbol] = accountIndex.split(ACCOUNT_INDEX_SEPARATOR)

  React.useEffect(() => {
    onLoadTransaction(transactionId)
  }, [transactionId, onLoadTransaction])

  React.useEffect(() => {
    if (transactionTask.status === 'successful') {
      onChangeHeader(transactionTask.data.type, accountIndex)
    }
  }, [transactionTask, accountIndex, onChangeHeader])

  function getAmountInFiat (transactionTask) {
    switch (transactionTask.status) {
      case 'reloading':
      case 'successful': {
        if (fiatExchangeRatesTask.status !== 'successful') {
          return undefined
        }

        const { amount, token } = transactionTask.data
        const fixedTokenAmount = getFixedTokenAmount(amount, token.decimals)
        const fiatTokenAmount = getTokenAmountInPreferredCurrency(
          fixedTokenAmount,
          token.USD,
          preferredCurrency,
          fiatExchangeRatesTask.data
        )

        return fiatTokenAmount
      }
      default: {
        return undefined
      }
    }
  }

  return (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} disableTopGutter>
        <section className={classes.section}>
          <div className={classes.fiatAmount}>
            <AccountBalance
              amount={getAmountInFiat(transactionTask)}
              currency={preferredCurrency}
            />
          </div>
          <TokenBalance
            amount={getFixedTokenAmount(transactionTask.data?.amount, transactionTask.data?.token.decimals)}
            symbol={accountTokenSymbol}
          />
        </section>
      </Container>
      <Container>
        <section className={classes.section}>
          {(() => {
            switch (transactionTask.status) {
              case 'loading':
              case 'failed': {
                return <Spinner />
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
