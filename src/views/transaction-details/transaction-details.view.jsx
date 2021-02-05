import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useTheme } from 'react-jss'
import hermezjs from '@hermeznetwork/hermezjs'
import { TxType } from '@hermeznetwork/hermezjs/src/tx-utils'

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
import { getTransactionAmount } from '../../utils/transactions'
import { getEthereumAddressFromHermezAddress, getPartiallyHiddenEthereumAddress, getPartiallyHiddenHermezAddress } from '../../utils/addresses'

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
              amount={getTransactionFiatAmount(transactionTask)}
              currency={preferredCurrency}
            />
          </div>
          {
            <TokenBalance
              amount={getFixedTokenAmount(
                getTransactionAmount(transactionTask.data),
                transactionTask.data?.token.decimals
              )}
              symbol={accountTokenSymbol}
            />
          }
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
                const status = {
                  subtitle: transactionTask.data.state !== undefined ? 'Confirmed' : 'Pending'
                }
                const date = {
                  subtitle: new Date(transactionTask.data.timestamp).toLocaleString()
                }

                switch (transactionTask.data.type) {
                  case TxType.CreateAccountDeposit:
                  case TxType.Deposit: {
                    return (
                      <TransactionInfo
                        status={status}
                        from={{
                          subtitle: 'My Ethereum address',
                          value: getPartiallyHiddenEthereumAddress(
                            getEthereumAddressFromHermezAddress(transactionTask.data.fromHezEthereumAddress)
                          )
                        }}
                        to={{
                          subtitle: 'My Hermez address',
                          value: getPartiallyHiddenHermezAddress(transactionTask.data.fromHezEthereumAddress)
                        }}
                        date={date}
                      />
                    )
                  }
                  case TxType.Transfer: {
                    return (
                      <TransactionInfo
                        status={status}
                        from={{
                          subtitle: 'My Hermez address',
                          value: getPartiallyHiddenHermezAddress(transactionTask.data.fromHezEthereumAddress)
                        }}
                        to={{
                          subtitle: getPartiallyHiddenHermezAddress(transactionTask.data.toHezEthereumAddress)
                        }}
                        date={date}
                      />
                    )
                  }
                  case TxType.Withdraw:
                  case TxType.Exit:
                  case TxType.ForceExit: {
                    return (
                      <TransactionInfo
                        status={status}
                        from={{
                          subtitle: 'My Hermez address',
                          value: getPartiallyHiddenHermezAddress(transactionTask.data.fromHezEthereumAddress)
                        }}
                        to={{
                          subtitle: 'My Ethereum address',
                          value: getPartiallyHiddenEthereumAddress(
                            getEthereumAddressFromHermezAddress(transactionTask.data.toHezEthereumAddress)
                          )
                        }}
                        date={date}
                      />
                    )
                  }
                  default: {
                    return <></>
                  }
                }
              }
              default: {
                return <></>
              }
            }
          })()}
          <a
            className={classes.link}
            href={`${hermezjs.Environment.getBatchExplorerUrl()}/transaction/${transactionId}`}
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
  onLoadTransaction: (transactionId) =>
    dispatch(transactionDetailsThunks.fetchTransaction(transactionId)),
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
