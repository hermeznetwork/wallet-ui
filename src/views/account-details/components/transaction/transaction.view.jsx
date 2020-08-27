import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import useTransactionStyles from './transaction.styles'

function Transaction ({ id, type, amount, currency, date, toAddress }) {
  const classes = useTransactionStyles()

  return (
    <Link to={`/transactions/${id}`} className={classes.root}>
      <div className={classes.typeContainer}>
        <p className={classes.type}>{type.charAt(0)}</p>
      </div>
      <div>
        <h3 className={classes.amount}>{amount} {currency}</h3>
        <p className={classes.date}>{date}</p>
      </div>
    </Link>
  )
}

Transaction.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired
}

export default Transaction
