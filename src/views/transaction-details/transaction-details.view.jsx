import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useTheme } from 'react-jss'
import { push } from 'connected-react-router'
import { TxType, TxLevel } from '@hermeznetwork/hermezjs/src/enums'

import useTransactionDetailsStyles from './transaction-details.styles'
import * as transactionDetailsThunks from '../../store/transaction-details/transaction-details.thunks'
import Spinner from '../shared/spinner/spinner.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import { getFixedTokenAmount, getAmountInPreferredCurrency, getTokenAmountInPreferredCurrency, getFeeInUsd, CurrencySymbol } from '../../utils/currencies'
import Container from '../shared/container/container.view'
import { changeHeader } from '../../store/global/global.actions'
import FiatAmount from '../shared/fiat-amount/fiat-amount.view'
import TokenBalance from '../shared/token-balance/token-balance.view'
import { ACCOUNT_INDEX_SEPARATOR, MAX_TOKEN_DECIMALS } from '../../constants'

import { ReactComponent as InfoIcon } from '../../images/icons/info.svg'
import { getTransactionAmount, getTxPendingTime } from '../../utils/transactions'
import TransactionInfo from '../shared/transaction-info/transaction-info.view'
import ExploreTransactionButton from './components/explore-transaction-button.view'

function TransactionDetails ({
  transactionTask,
  fiatExchangeRatesTask,
  preferredCurrency,
  coordinatorStateTask,
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
  function getTransactionFiatAmount (transactionTask) {
    switch (transactionTask.status) {
      case 'reloading':
      case 'successful': {
        if (fiatExchangeRatesTask.status !== 'successful') {
          return undefined
        }

        const { token, historicUSD } = transactionTask.data
        const amount = getTransactionAmount(transactionTask.data)
        const fixedAccountBalance = getFixedTokenAmount(
          amount,
          token.decimals
        )

        if (historicUSD) {
          return getAmountInPreferredCurrency(
            historicUSD,
            preferredCurrency,
            fiatExchangeRatesTask.data
          )
        } else {
          return getTokenAmountInPreferredCurrency(
            fixedAccountBalance,
            token.USD,
            preferredCurrency,
            fiatExchangeRatesTask.data
          )
        }
      }
      default: {
        return undefined
      }
    }
  }

  /**
   * Converts the transaction fee to the supported value
   * @param {Object} transactionTask - Asynchronous task of the transaction
   * @returns {Object}
   */
  function getTransactionFee (transactionTask) {
    switch (transactionTask.status) {
      case 'reloading':
      case 'successful': {
        if (fiatExchangeRatesTask.status !== 'successful') {
          return undefined
        }

        const token = transactionTask.data.token

        if (transactionTask.data.fee) {
          const feeUsd = getFeeInUsd(transactionTask.data.fee, transactionTask.data.amount, token)
          const feePreferredCurrency = getAmountInPreferredCurrency(feeUsd, preferredCurrency, fiatExchangeRatesTask.data)
          return {
            fiat: `${CurrencySymbol[preferredCurrency].symbol} ${feePreferredCurrency.toFixed(2)}`,
            tokens: `${Number((feeUsd / token.USD).toFixed(MAX_TOKEN_DECIMALS))} ${token.symbol}`
          }
        } else if (transactionTask.data.L2Info) {
          const feeUsd = transactionTask.data.L2Info.historicFeeUSD
          const feePreferredCurrency = getAmountInPreferredCurrency(feeUsd, preferredCurrency, fiatExchangeRatesTask.data)
          return {
            fiat: `${CurrencySymbol[preferredCurrency].symbol} ${feePreferredCurrency.toFixed(2)}`,
            tokens: `${Number((feeUsd / token.USD).toFixed(MAX_TOKEN_DECIMALS))} ${token.symbol}`
          }
        } else {
          return undefined
        }
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
          <div className={classes.highlightedAmount}>
            <TokenBalance
              amount={getFixedTokenAmount(
                getTransactionAmount(transactionTask.data),
                transactionTask.data?.token.decimals
              )}
              symbol={accountTokenSymbol}
            />
          </div>
          <FiatAmount
            amount={getTransactionFiatAmount(transactionTask)}
            currency={preferredCurrency}
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
                  <>
                    {getTxPendingTime(coordinatorStateTask.data, transactionTask.data.timestamp) > 0 &&
                      <p className={classes.timeEstimate}>
                        <InfoIcon className={classes.timeEstimateIcon} />
                        <span className={classes.timeEstimateText}>The next block will be produced to Layer 2 in an estimated time of {getTxPendingTime(coordinatorStateTask.data, transactionTask.data.timestamp)} minutes.</span>
                      </p>}
                    <TransactionInfo
                      txData={{ ...transactionTask.data, ...{ fee: getTransactionFee(transactionTask) } }}
                      accountIndex={accountIndex}
                      showStatus
                    />
                    <ExploreTransactionButton
                      txLevel={transactionTask.data.fromAccountIndex ? TxLevel.L2 : TxLevel.L1}
                      transactionIdOrHash={transactionTask.data.id || transactionTask.data.hash}
                    />
                  </>
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
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  coordinatorStateTask: state.global.coordinatorStateTask
})

function getHeaderTitle (transactionType) {
  switch (transactionType) {
    case TxType.CreateAccountDeposit:
    case TxType.Deposit: {
      return 'Deposited'
    }
    case TxType.Withdraw:
    case TxType.Exit:
    case TxType.ForceExit: {
      return 'Withdrawn'
    }
    case TxType.TransferToEthAddr:
    case TxType.Transfer: {
      return 'Transfer'
    }
    default: {
      return ''
    }
  }
}

const mapDispatchToProps = (dispatch) => ({
  onLoadTransaction: (transactionIdOrHash) =>
    dispatch(transactionDetailsThunks.fetchTransaction(transactionIdOrHash)),
  onChangeHeader: (transactionType, accountIndex) =>
    dispatch(
      changeHeader({
        type: 'page',
        data: {
          title: getHeaderTitle(transactionType),
          closeAction: push(`/accounts/${accountIndex}`)
        }
      })
    )
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(TransactionDetails))
