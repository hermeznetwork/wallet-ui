import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useHomeStyles from './home.styles'
import { fetchAccounts, fetchRecentTransactions } from '../../store/home/home.thunks'
import TotalBalance from './components/total-balance/total-balance.view'
import AccountList from './components/account-list/account-list.view'
import RecentTransactionList from './components/recent-transaction-list/recent-transaction-list.view'
import Spinner from '../shared/spinner/spinner.view'

function Home ({
  ethereumAddress,
  accountTask,
  recentTransactionsTask,
  preferredCurrency,
  onLoadAccounts,
  onLoadRecentTransactions
}) {
  const classes = useHomeStyles()

  React.useEffect(() => {
    onLoadAccounts(ethereumAddress)
    onLoadRecentTransactions(ethereumAddress)
  }, [ethereumAddress, onLoadAccounts, onLoadRecentTransactions])

  function getTotalBalance (accounts) {
    return accounts.reduce((amount, account) => amount + account.Balance, 0)
  }

  return (
    <div>
      <section>
        <h4 className={classes.title}>Total balance</h4>
        {(() => {
          switch (accountTask.status) {
            case 'loading': {
              return <Spinner />
            }
            case 'failed': {
              return (
                <TotalBalance
                  amount={undefined}
                  currency={preferredCurrency}
                />
              )
            }
            case 'successful': {
              return (
                <TotalBalance
                  amount={getTotalBalance(accountTask.data)}
                  currency={preferredCurrency}
                />
              )
            }
            default: {
              return <></>
            }
          }
        })()}
        <div className={classes.actionButtonsGroup}>
          <button className={classes.actionButton}>Deposit</button>
          <button className={classes.actionButton}>Withdraw</button>
        </div>
      </section>
      <section>
        <h4 className={classes.title}>Accounts</h4>
        {(() => {
          switch (accountTask.status) {
            case 'loading': {
              return <Spinner />
            }
            case 'failed': {
              return <p>{accountTask.error}</p>
            }
            case 'successful': {
              return (
                <AccountList
                  accounts={accountTask.data}
                  preferredCurrency={preferredCurrency}
                />
              )
            }
            default: {
              return <></>
            }
          }
        })()}
      </section>
      <section>
        <h4 className={classes.title}>Recent activity</h4>
        {(() => {
          switch (recentTransactionsTask.status) {
            case 'loading': {
              return <Spinner />
            }
            case 'failed': {
              return <p>{recentTransactionsTask.error}</p>
            }
            case 'successful': {
              return (
                <RecentTransactionList transactions={recentTransactionsTask.data} />
              )
            }
            default: {
              return <></>
            }
          }
        })()}
      </section>
    </div>
  )
}

Home.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
  accounts: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        ID: PropTypes.string.isRequired,
        Balance: PropTypes.number.isRequired,
        Token: PropTypes.shape({
          Id: PropTypes.number.isRequired,
          Symbol: PropTypes.string.isRequired
        })
      })
    ),
    error: PropTypes.string
  }),
  preferredCurrency: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  ethereumAddress: state.account.ethereumAddress,
  accountTask: state.home.accountTask,
  preferredCurrency: state.account.preferredCurrency,
  recentTransactionsTask: state.home.recentTransactionsTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadAccounts: (ethereumAddress) => dispatch(fetchAccounts(ethereumAddress)),
  onLoadRecentTransactions: (ethereumAddress) => dispatch(fetchRecentTransactions(ethereumAddress))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
