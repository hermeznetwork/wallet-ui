import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useHomeStyles from './home.styles'
import TotalBalance from './components/total-balance/total-balance.view'
import AccountList from './components/account-list/account-list.view'
import { fetchAccounts } from '../../store/home/home.thunks'
import Spinner from '../shared/spinner/spinner.view'

function Home ({
  ethereumAddress,
  accountTask,
  preferredCurrency,
  onLoadAccounts
}) {
  const classes = useHomeStyles()

  React.useEffect(() => {
    onLoadAccounts(ethereumAddress)
  }, [ethereumAddress, onLoadAccounts])

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
    </div>
  )
}

Home.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
  accounts: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
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
  preferredCurrency: state.account.preferredCurrency
})

const mapDispatchToProps = (dispatch) => ({
  onLoadAccounts: (ethereumAddress) => dispatch(fetchAccounts(ethereumAddress))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
