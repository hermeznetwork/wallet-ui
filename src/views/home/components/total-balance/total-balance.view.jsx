import React from 'react'
import PropTypes from 'prop-types'

import useTotalBalanceStyles from './total-balance.styles'
import { CurrencySymbol } from '../../../../utils/currencies'

function TotalBalance ({ amount, currency }) {
  const classes = useTotalBalanceStyles()

  return (
    <div className={classes.root}>
      <h1 className={classes.amount}>
        {CurrencySymbol[currency].symbol} {amount?.toFixed(2) || '--'}
      </h1>
    </div>
  )
}

TotalBalance.propTypes = {
  amount: PropTypes.number,
  currency: PropTypes.string.isRequired
}

export default TotalBalance
