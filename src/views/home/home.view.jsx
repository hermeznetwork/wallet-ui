import React from 'react'
import PropTypes from 'prop-types'

import useHomeStyles from './home.styles'
import TotalBalance from './components/total-balance/total-balance.view'
import AccountList from './components/account-list/account-list.view'
import { connect } from 'react-redux'

function Home ({ totalBalance, accounts }) {
  const classes = useHomeStyles()

  function getTotalBalance () {
    if (!accounts) {
      return undefined
    }

    return accounts.reduce((amount, account) => amount + account.amount, 0)
  }

  return (
    <div>
      <section>
        <h4 className={classes.title}>Total balance</h4>
        <TotalBalance amount={getTotalBalance()} />
        <div className={classes.actionButtons}>
          <button>Deposit</button>
          <button>Withdraw</button>
        </div>
      </section>
      <section>
        <h4 className={classes.title}>Accounts</h4>
        <AccountList accounts={accounts} />
      </section>
    </div>
  )
}

Home.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      coin: PropTypes.shape({
        id: PropTypes.number.isRequired,
        abbreviation: PropTypes.string.isRequired
      })
    })
  )
}

const mapStateToProps = (state) => ({
  accounts: state.home.accounts
})

export default connect(mapStateToProps)(Home)
