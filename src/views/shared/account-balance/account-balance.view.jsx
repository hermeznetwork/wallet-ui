import React from 'react'
import PropTypes from 'prop-types'

import useAccountBalanceStyles from './account-balance.styles'
import { CurrencySymbol } from '../../../utils/currencies'

function AccountBalance ({ amount, currency }) {
  const classes = useAccountBalanceStyles()

  return (
    <div className={classes.root}>
      <h1 className={classes.amount}>
        {CurrencySymbol[currency].symbol} {amount?.toFixed(2) || '--'}
      </h1>
    </div>
  )
}

AccountBalance.propTypes = {
  amount: PropTypes.number,
  currency: PropTypes.string.isRequired
}

export default AccountBalance
