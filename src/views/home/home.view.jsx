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
  tokensTask,
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
                            tokens={tokensTask.data}
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
                          <RecentTransactionList
                            transactions={recentTransactionsTask.data}
                            tokens={tokensTask.data}
                          />
                        )
                      }
                      default: {
                        return <></>
                      }
                    }
                  })()}
                </section>
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

Home.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
  accountTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        Balance: PropTypes.number.isRequired,
        TokenID: PropTypes.number.isRequired
      })
    ),
    error: PropTypes.string
  }),
  preferredCurrency: PropTypes.string.isRequired,
  recentTransactionsTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        ID: PropTypes.string.isRequired,
        Type: PropTypes.string.isRequired,
        Amount: PropTypes.number.isRequired,
        TokenID: PropTypes.number.isRequired
      })
    ),
    error: PropTypes.string
  }),
  tokensTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        TokenID: PropTypes.number.isRequired,
        Name: PropTypes.string.isRequired,
        Symbol: PropTypes.string.isRequired
      })
    ),
    error: PropTypes.string
  })
}

const mapStateToProps = (state) => ({
  tokensTask: state.global.tokensTask,
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
