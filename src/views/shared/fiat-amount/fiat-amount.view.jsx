import React from 'react'
import PropTypes from 'prop-types'

import useFiatAmountStyles from './fiat-amount.styles'
import { CurrencySymbol } from '../../../utils/currencies'

function FiatAmount ({ amount, currency, size }) {
  const classes = useFiatAmountStyles({ size })

  return (
    <div className={classes.root}>
      <h1 className={classes.amount}>
        {CurrencySymbol[currency].symbol} {amount?.toFixed(2) || '--'}
      </h1>
    </div>
  )
}

FiatAmount.propTypes = {
  amount: PropTypes.number,
  currency: PropTypes.string.isRequired,
  size: PropTypes.oneOf('normal', 'big')
}

export default FiatAmount
