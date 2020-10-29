import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import { push } from 'connected-react-router'

import useAccountDetailsStyles from './account-details.styles'
import { fetchAccount, fetchHistoryTransactions, fetchPoolTransactions, fetchExits } from '../../store/account-details/account-details.thunks'
import Spinner from '../shared/spinner/spinner.view'
import TransactionList from './components/transaction-list/transaction-list.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../utils/currencies'
import Container from '../shared/container/container.view'
import { changeHeader } from '../../store/global/global.actions'
import TransactionActions from '../shared/transaction-actions/transaction-actions.view'
import ExitList from '../shared/exit-list/exit-list.view'
import { TxType } from '../../utils/tx'
import FiatAmount from '../shared/fiat-amount/fiat-amount.view'
import TokenBalance from '../shared/token-balance/token-balance.view'
import { ACCOUNT_INDEX_SEPARATOR } from '../../constants'
import InfiniteScroll from '../shared/infinite-scroll/infinite-scroll.view'
import { resetState } from '../../store/account-details/account-details.actions'

function AccountDetails ({
  preferredCurrency,
  accountTask,
  poolTransactionsTask,
  historyTransactionsTask,
  exitsTask,
  fiatExchangeRatesTask,
  onChangeHeader,
  onLoadAccount,
  onLoadPoolTransactions,
  onLoadHistoryTransactions,
  onLoadExits,
  onNavigateToTransactionDetails,
  onCleanup
}) {
  const theme = useTheme()
  const classes = useAccountDetailsStyles()
  const { accountIndex } = useParams()
  const [, accountTokenSymbol, accountTokenId] = accountIndex.split(ACCOUNT_INDEX_SEPARATOR)

  React.useEffect(() => {
    onLoadAccount(accountIndex)
    onLoadPoolTransactions(accountIndex)
    onLoadHistoryTransactions(accountIndex)
  }, [accountIndex, onLoadAccount, onLoadPoolTransactions, onLoadHistoryTransactions])

  React.useEffect(() => {
    if (historyTransactionsTask.status === 'successful') {
      const exitTransactions = historyTransactionsTask.data.transactions.filter((transaction) => transaction.type === TxType.Exit)

      onLoadExits(exitTransactions)
    }
  }, [historyTransactionsTask, onLoadExits])

  React.useEffect(() => {
    if (accountTask.status === 'successful') {
      onChangeHeader(accountTask.data.token.name)
    }
  }, [accountTask, onChangeHeader])

  React.useEffect(() => {
    return onCleanup
  }, [onCleanup])

  /**
   * Returns the total balance of the account in the preferred currency
   *
   * @returns {Number} The balance of the account in the preferred currency
   */
  function getAccountBalance (accountTask) {
    switch (accountTask.status) {
      case 'reloading':
      case 'successful': {
        if (fiatExchangeRatesTask.status !== 'successful') {
          return undefined
        }

        const account = accountTask.data
        const fixedAccountBalance = getFixedTokenAmount(
          account.balance,
          account.token.decimals
        )

        return getTokenAmountInPreferredCurrency(
          fixedAccountBalance,
          account.token.USD,
          preferredCurrency,
          fiatExchangeRatesTask.data
        )
      }
      default: {
        return undefined
      }
    }
  }

  function getPendingExits (poolTransactions) {
    return poolTransactions.filter((transaction) => transaction.type === 'Exit')
  }

  function getPendingTransactions (poolTransactions) {
    return poolTransactions.filter((transaction) => transaction.type !== 'Exit')
  }

  function getHistoryTransactions (historyTransactions) {
    return historyTransactions.filter((transaction) => transaction.type !== 'Exit')
  }

  function handleTransactionClick (transaction) {
    onNavigateToTransactionDetails(accountIndex, transaction.id)
  }

  return (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} disableTopGutter>
        <section className={classes.section}>
          <div className={classes.fiatBalance}>
            <FiatAmount
              amount={getAccountBalance(accountTask)}
              currency={preferredCurrency}
            />
          </div>
          <div className={classes.tokenBalance}>
            <TokenBalance
              amount={getFixedTokenAmount(accountTask.data?.balance, accountTask.data?.token.decimals)}
              symbol={accountTokenSymbol}
            />
          </div>
          <TransactionActions tokenId={accountTokenId} />
        </section>
      </Container>
      <Container>
        <section className={classes.section}>
          {(() => {
            if (
              poolTransactionsTask.status === 'loading' ||
              poolTransactionsTask.status === 'failed' ||
              historyTransactionsTask.status === 'loading' ||
              historyTransactionsTask.status === 'failed'
            ) {
              return <Spinner />
            }

            if (
              (poolTransactionsTask.status === 'successful' ||
              poolTransactionsTask.status === 'reloading') &&
              (historyTransactionsTask.status === 'successful' ||
              historyTransactionsTask.status === 'reloading')
            ) {
              return (
                <>
                  <ExitList
                    transactions={getPendingExits(poolTransactionsTask.data)}
                    fiatExchangeRates={
                      fiatExchangeRatesTask.status === 'successful'
                        ? fiatExchangeRatesTask.data
                        : undefined
                    }
                    preferredCurrency={preferredCurrency}
                  />
                  {exitsTask.status === 'successful' &&
                    <ExitList
                      transactions={exitsTask.data}
                      fiatExchangeRates={
                        fiatExchangeRatesTask.status === 'successful'
                          ? fiatExchangeRatesTask.data
                          : undefined
                      }
                      preferredCurrency={preferredCurrency}
                    />}
                  <TransactionList
                    transactions={getPendingTransactions(poolTransactionsTask.data)}
                    fiatExchangeRates={
                      fiatExchangeRatesTask.status === 'successful'
                        ? fiatExchangeRatesTask.data
                        : undefined
                    }
                    preferredCurrency={preferredCurrency}
                    onTransactionClick={handleTransactionClick}
                  />
                  <InfiniteScroll
                    asyncTaskStatus={historyTransactionsTask.status}
                    paginationData={historyTransactionsTask.data.pagination}
                    onLoadNextPage={(fromItem) => onLoadHistoryTransactions(accountIndex, fromItem)}
                  >
                    <TransactionList
                      transactions={getHistoryTransactions(historyTransactionsTask.data.transactions)}
                      fiatExchangeRates={
                        fiatExchangeRatesTask.status === 'successful'
                          ? fiatExchangeRatesTask.data
                          : undefined
                      }
                      preferredCurrency={preferredCurrency}
                      onTransactionClick={handleTransactionClick}
                    />
                  </InfiniteScroll>
                </>
              )
            }

            return <></>
          })()}
        </section>
      </Container>
    </div>
  )
}

AccountDetails.propTypes = {
  preferredCurrency: PropTypes.string.isRequired,
  accountTask: PropTypes.object.isRequired,
  poolTransactionsTask: PropTypes.object.isRequired,
  historyTransactionsTask: PropTypes.object.isRequired,
  exitsTask: PropTypes.object.isRequired,
  fiatExchangeRatesTask: PropTypes.object.isRequired,
  onLoadAccount: PropTypes.func.isRequired,
  onChangeHeader: PropTypes.func.isRequired,
  onLoadPoolTransactions: PropTypes.func.isRequired,
  onLoadHistoryTransactions: PropTypes.func.isRequired,
  onLoadExits: PropTypes.func.isRequired,
  onNavigateToTransactionDetails: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  preferredCurrency: state.settings.preferredCurrency,
  accountTask: state.accountDetails.accountTask,
  poolTransactionsTask: state.accountDetails.poolTransactionsTask,
  historyTransactionsTask: state.accountDetails.historyTransactionsTask,
  exitsTask: state.accountDetails.exitsTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadAccount: (accountIndex) => dispatch(fetchAccount(accountIndex)),
  onChangeHeader: (tokenName) =>
    dispatch(changeHeader({ type: 'page', data: { title: tokenName, previousRoute: '/' } })),
  onLoadPoolTransactions: (accountIndex) => dispatch(fetchPoolTransactions(accountIndex)),
  onLoadHistoryTransactions: (accountIndex, fromItem) =>
    dispatch(fetchHistoryTransactions(accountIndex, fromItem)),
  onLoadExits: (exitTransactions) =>
    dispatch(fetchExits(exitTransactions)),
  onNavigateToTransactionDetails: (accountIndex, transactionId) =>
    dispatch(push(`/accounts/${accountIndex}/transactions/${transactionId}`)),
  onCleanup: () => dispatch(resetState())
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(AccountDetails))
