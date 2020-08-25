import React from 'react'
import PropTypes from 'prop-types'

import useTransactionStyles from './transaction.styles'

function Transaction ({ type, amount, currency, date, toAddress }) {
  const classes = useTransactionStyles()

  return (
    <div className={classes.root}>
      <div className={classes.typeContainer}>
        <p className={classes.type}>{type.charAt(0)}</p>
      </div>
      <div>
        <h3 className={classes.amount}>{amount} {currency}</h3>
        <p className={classes.date}>{date}</p>
      </div>
    </div>
  )
}

Transaction.propTypes = {
  type: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired
}

export default Transaction
