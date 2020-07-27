import React from 'react'
import PropTypes from 'prop-types'

import useCoinBalanceStyles from './coin-balance.styles'

function CoinBalance ({ amount, currency, fiatCurrency }) {
  const classes = useCoinBalanceStyles()

  return (
    <div className={classes.root}>
      <div className={classes.image} />
      <div className={classes.details}>
        <h3 className={classes.baseCurrency}>{amount} {currency}</h3>
        <h4 className={classes.fiatCurrency}>-- {fiatCurrency}</h4>
      </div>
    </div>
  )
}

CoinBalance.propTypes = {
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  fiatCurrency: PropTypes.string.isRequired
}

export default CoinBalance
