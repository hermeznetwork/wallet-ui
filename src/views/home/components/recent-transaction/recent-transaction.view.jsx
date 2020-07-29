import React from 'react'
import PropTypes from 'prop-types'

import useRecentTransactionStyles from './recent-transaction.styles'

function RecentTransaction ({ amount, currency, date, toAddress }) {
  const classes = useRecentTransactionStyles()

  return (
    <div>
      <h3 className={classes.amount}>{amount} {currency}</h3>
      <p className={classes.date}>{date}</p>
    </div>
  )
}

RecentTransaction.propTypes = {
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired
}

export default RecentTransaction
