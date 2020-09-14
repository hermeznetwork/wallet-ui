import React from 'react'
import PropTypes from 'prop-types'

import useTotalBalanceStyles from './total-balance.styles'

function TotalBalance ({ amount, currency }) {
  const classes = useTotalBalanceStyles()
  console.log(amount)

  return (
    <div className={classes.root}>
      <h1 className={classes.amount}>{currency} {amount?.toFixed(2) || '-'}</h1>
    </div>
  )
}

TotalBalance.propTypes = {
  amount: PropTypes.number,
  currency: PropTypes.string.isRequired
}

export default TotalBalance
