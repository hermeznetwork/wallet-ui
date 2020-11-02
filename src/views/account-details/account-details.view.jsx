import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import { push } from 'connected-react-router'

import useAccountDetailsStyles from './account-details.styles'
import { fetchAccount, fetchHistoryTransactions, fetchPoolTransactions, fetchExits } from '../../store/account-details/account-details.thunks'
import { removePendingWithdraw } from '../../store/global/global.thunks'
import Spinner from '../shared/spinner/spinner.view'
import TransactionList from './components/transaction-list/transaction-list.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../utils/currencies'
import Container from '../shared/container/container.view'
import { changeHeader } from '../../store/global/global.actions'
import TransactionActions from '../shared/transaction-actions/transaction-actions.view'
import ExitList from '../shared/exit-list/exit-list.view'
import AccountBalance from '../shared/account-balance/account-balance.view'
import TokenBalance from './components/token-balance/token-balance.view'
import { ACCOUNT_INDEX_SEPARATOR } from '../../constants'

function AccountDetails ({
  preferredCurrency,
  accountTask,
  poolTransactionsTask,
  historyTransactionsTask,
  exitsTask,
  fiatExchangeRatesTask,
  metaMaskWalletTask,
  pendingWithdraws,
  onChangeHeader,
  onLoadAccount,
  onLoadPoolTransactions,
  onLoadHistoryTransactions,
  onLoadExits,
  onRemovePendingWithdraw,
  onNavigateToTransactionDetails
}) {
  const theme = useTheme()
  const classes = useAccountDetailsStyles()
  const { accountIndex } = useParams()
  const [, accountTokenSymbol, accountTokenId] = accountIndex.split(ACCOUNT_INDEX_SEPARATOR)

  React.useEffect(() => {
    onLoadAccount(accountIndex)
    onLoadPoolTransactions(accountIndex)
    onLoadExits()
  }, [accountIndex, onLoadAccount, onLoadPoolTransactions, onLoadExits])

  React.useEffect(() => {
    if (exitsTask.status === 'successful') {
      onLoadHistoryTransactions(accountIndex)
    }
  }, [exitsTask, accountIndex, onLoadHistoryTransactions])

  React.useEffect(() => {
    if (accountTask.status === 'successful' || accountTask.status === 'reloading') {
      onChangeHeader(accountTask.data.token.name)
    }
  }, [accountTask, onChangeHeader])

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

  function getPendingExits () {
    return poolTransactionsTask.data.filter((transaction) => transaction.type === 'Exit')
  }

  function getPendingTransactions () {
    return poolTransactionsTask.data.filter((transaction) => transaction.type !== 'Exit')
  }

  function handleTransactionClick (transaction) {
    onNavigateToTransactionDetails(accountIndex, transaction.id)
  }

  return (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} disableTopGutter>
        <section className={classes.section}>
          <div className={classes.fiatBalance}>
            <AccountBalance
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
              historyTransactionsTask.status === 'failed' ||
              exitsTask.status === 'loading' ||
              exitsTask.status === 'failed'
            ) {
              return <Spinner />
            }

            if (
              (poolTransactionsTask.status === 'successful' ||
              poolTransactionsTask.status === 'reloading') &&
              (historyTransactionsTask.status === 'successful' ||
              historyTransactionsTask.status === 'reloading') &&
              (exitsTask.status === 'successful' ||
              exitsTask.status === 'reloading')
            ) {
              return (
                <>
                  <ExitList
                    transactions={getPendingExits()}
                    fiatExchangeRates={
                      fiatExchangeRatesTask.status === 'successful'
                        ? fiatExchangeRatesTask.data
                        : undefined
                    }
                    preferredCurrency={preferredCurrency}
                    pendingWithdraws={pendingWithdraws[metaMaskWalletTask.data.hermezEthereumAddress]}
                  />
                  {exitsTask.status === 'successful' &&
                    <ExitList
                      transactions={exitsTask.data.exits}
                      fiatExchangeRates={
                        fiatExchangeRatesTask.status === 'successful'
                          ? fiatExchangeRatesTask.data
                          : undefined
                      }
                      preferredCurrency={preferredCurrency}
                      pendingWithdraws={pendingWithdraws[metaMaskWalletTask.data.hermezEthereumAddress]}
                    />}
                  <TransactionList
                    transactions={getPendingTransactions()}
                    fiatExchangeRates={
                      fiatExchangeRatesTask.status === 'successful'
                        ? fiatExchangeRatesTask.data
                        : undefined
                    }
                    preferredCurrency={preferredCurrency}
                    onTransactionClick={handleTransactionClick}
                  />
                  <TransactionList
                    transactions={historyTransactionsTask.data.transactions}
                    fiatExchangeRates={
                      fiatExchangeRatesTask.status === 'successful'
                        ? fiatExchangeRatesTask.data
                        : undefined
                    }
                    preferredCurrency={preferredCurrency}
                    onTransactionClick={handleTransactionClick}
                  />
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
  metaMaskWalletTask: PropTypes.object.isRequired,
  pendingWithdraws: PropTypes.object.isRequired,
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
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  metaMaskWalletTask: state.global.metaMaskWalletTask,
  pendingWithdraws: state.global.pendingWithdraws
})

const mapDispatchToProps = (dispatch) => ({
  onLoadAccount: (accountIndex) => dispatch(fetchAccount(accountIndex)),
  onChangeHeader: (tokenName) =>
    dispatch(changeHeader({ type: 'page', data: { title: tokenName, previousRoute: '/' } })),
  onLoadPoolTransactions: (accountIndex) => dispatch(fetchPoolTransactions(accountIndex)),
  onLoadHistoryTransactions: (accountIndex) =>
    dispatch(fetchHistoryTransactions(accountIndex)),
  onLoadExits: (exitTransactions) =>
    dispatch(fetchExits(exitTransactions)),
  onRemovePendingWithdraw: (hermezEthereumAddress, pendingWithdrawId) => dispatch(removePendingWithdraw(hermezEthereumAddress, pendingWithdrawId)),
  onNavigateToTransactionDetails: (accountIndex, transactionId) =>
    dispatch(push(`/accounts/${accountIndex}/transactions/${transactionId}`))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(AccountDetails))
