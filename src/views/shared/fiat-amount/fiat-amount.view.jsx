import React from 'react'
import PropTypes from 'prop-types'

import useFiatAmountStyles from './fiat-amount.styles'
import { CurrencySymbol } from '../../../utils/currencies'

function FiatAmount ({ amount, currency }) {
  const classes = useFiatAmountStyles()

  return (
    <div className={classes.root}>
      {CurrencySymbol[currency].symbol} {!isNaN(amount) ? amount.toFixed(2) : '--'}
    </div>
  )
}

FiatAmount.propTypes = {
  amount: PropTypes.number,
  currency: PropTypes.string.isRequired
}

export default FiatAmount
