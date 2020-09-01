import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useHomeStyles from './home.styles'
import { fetchAccounts, fetchTransactions } from '../../store/home/home.thunks'
import TotalBalance from './components/total-balance/total-balance.view'
import AccountList from './components/account-list/account-list.view'
import Spinner from '../shared/spinner/spinner.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view.jsx'

function Home ({
  tokensTask,
  accountsTask,
  metamaskWalletTask,
  preferredCurrency,
  onLoadAccounts,
  onLoadRecentTransactions
}) {
  const classes = useHomeStyles()

  React.useEffect(() => {
    if (metamaskWalletTask.status === 'successful') {
      onLoadAccounts(metamaskWalletTask.data.ethereumAddress)
      onLoadRecentTransactions(metamaskWalletTask.data.ethereumAddress)
    }
  }, [metamaskWalletTask, onLoadAccounts, onLoadRecentTransactions])

  function getTotalBalance (accounts) {
    return accounts.reduce((amount, account) => amount + account.Balance, 0)
  }

  function getToken (tokenId) {
    return tokensTask.data.find((token) => token.TokenID === tokenId)
  }

  return (
    <div>
      {(() => {
        switch (metamaskWalletTask.status) {
          case 'loading': {
            return <Spinner />
          }
          case 'failed': {
            return <p>{metamaskWalletTask.error}</p>
          }
          case 'successful': {
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
                        switch (accountsTask.status) {
                          case 'loading': {
                            return <Spinner />
                          }
                          case 'failed': {
                            return (
                              <TotalBalance
                                amount={undefined}
                                currency={getToken(preferredCurrency).Symbol}
                              />
                            )
                          }
                          case 'successful': {
                            return (
                              <TotalBalance
                                amount={getTotalBalance(accountsTask.data)}
                                currency={getToken(preferredCurrency).Symbol}
                              />
                            )
                          }
                          default: {
                            return <></>
                          }
                        }
                      })()}
                      <div className={classes.actionButtonsGroup}>
                        <button className={classes.actionButton}>Send</button>
                        <button className={classes.actionButton}>Add funds</button>
                      </div>
                    </section>
                    <section>
                      <h4 className={classes.title}>Accounts</h4>
                      {(() => {
                        switch (accountsTask.status) {
                          case 'loading': {
                            return <Spinner />
                          }
                          case 'failed': {
                            return <p>{accountsTask.error}</p>
                          }
                          case 'successful': {
                            return (
                              <AccountList
                                accounts={accountsTask.data}
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
                  </>
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
    </div>
  )
}

Home.propTypes = {
  accountsTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        Balance: PropTypes.number.isRequired,
        TokenID: PropTypes.number.isRequired
      })
    ),
    error: PropTypes.string
  }),
  metamaskWalletTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.object,
    error: PropTypes.string
  }),
  preferredCurrency: PropTypes.number.isRequired,
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
  metamaskWalletTask: state.account.metamaskWalletTask,
  accountsTask: state.home.accountsTask,
  preferredCurrency: state.settings.preferredCurrency
})

const mapDispatchToProps = (dispatch) => ({
  onLoadAccounts: (ethereumAddress) => dispatch(fetchAccounts(ethereumAddress)),
  onLoadRecentTransactions: (ethereumAddress) => dispatch(fetchTransactions(ethereumAddress))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Home))
