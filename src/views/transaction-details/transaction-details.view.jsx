import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useTheme } from 'react-jss'
import { beautifyTransactionState } from '@hermeznetwork/hermezjs/src/tx-utils'

import useTransactionDetailsStyles from './transaction-details.styles'
import * as transactionDetailsThunks from '../../store/transaction-details/transaction-details.thunks'
import Spinner from '../shared/spinner/spinner.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../utils/currencies'
import Container from '../shared/container/container.view'
import { changeHeader } from '../../store/global/global.actions'
import TransactionInfo from '../shared/transaction-info/transaction-info.view'
import { ReactComponent as OpenInNewTabIcon } from '../../images/icons/open-in-new-tab.svg'
import FiatAmount from '../shared/fiat-amount/fiat-amount.view'
import TokenBalance from '../shared/token-balance/token-balance.view'
import { ACCOUNT_INDEX_SEPARATOR } from '../../constants'
import { push } from 'connected-react-router'

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
    onChangeHeader(transactionTask.data?.type, accountIndex)
  }, [transactionTask, accountIndex, onChangeHeader])

  /**
   * Converts the transaction amount in USD to an amount in the user's preferred currency
   * @param {Object} transactionTask - Asynchronous task of the transaction
   * @returns {number}
   */
  function getTransactionAmount (transactionTask) {
    switch (transactionTask.status) {
      case 'reloading':
      case 'successful': {
        if (fiatExchangeRatesTask.status !== 'successful') {
          return undefined
        }

        const { token, historicUSD, L1Info, amount } = transactionTask.data
        const fixedAccountBalance = getFixedTokenAmount(
          L1Info?.depositAmount || amount,
          token.decimals
        )

        return getTokenAmountInPreferredCurrency(
          fixedAccountBalance,
          historicUSD || token.USD,
          preferredCurrency,
          fiatExchangeRatesTask.data
        )
      }
      default: {
        return undefined
      }
    }
  }

  return (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} disableTopGutter addHeaderPadding>
        <section className={classes.section}>
          <div className={classes.fiatAmount}>
            <FiatAmount
              amount={getTransactionAmount(transactionTask)}
              currency={preferredCurrency}
            />
          </div>
          <TokenBalance
            amount={getFixedTokenAmount(
              transactionTask.data?.L1Info?.depositAmount || transactionTask.data?.amount,
              transactionTask.data?.token.decimals
            )}
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
          <a
            className={classes.link}
            href={`${process.env.REACT_APP_BATCH_EXPLORER_URL}/transaction/${transactionId}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <OpenInNewTabIcon className={classes.linkIcon} />
            View in Explorer
          </a>
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
  preferredCurrency: state.myAccount.preferredCurrency,
  transactionTask: state.transactionDetails.transactionTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadTransaction: (transactionId) =>
    dispatch(transactionDetailsThunks.fetchTransaction(transactionId)),
  onChangeHeader: (transactionType, accountIndex) =>
    dispatch(
      changeHeader({
        type: 'page',
        data: {
          title: transactionType,
          closeAction: push(`/accounts/${accountIndex}`)
        }
      })
    )
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(TransactionDetails))
