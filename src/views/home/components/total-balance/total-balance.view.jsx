import React from 'react'
import PropTypes from 'prop-types'

import useTotalBalanceStyles from './total-balance.styles'

function TotalBalance ({ amount, currency }) {
  const classes = useTotalBalanceStyles()

  return (
    <div className={classes.root}>
      <h1 className={classes.amount}>{amount?.toFixed(2) || '-'}</h1>
      <h2 className={classes.currency}>{currency}</h2>
    </div>
  )
}

TotalBalance.propTypes = {
  amount: PropTypes.number,
  currency: PropTypes.string.isRequired
}

export default TotalBalance
