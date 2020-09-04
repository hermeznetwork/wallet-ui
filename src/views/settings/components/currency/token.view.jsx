import React from 'react'
import PropTypes from 'prop-types'

import useCurrencyStyles from './currency.styles'

function Currency ({ symbol, onSelect }) {
  const classes = useCurrencyStyles()

  return (
    <div
      className={classes.root}
      onClick={() => onSelect(symbol)}
    >
      <div className={classes.image} />
      <div className={classes.details}>
        <h3 className={classes.symbol}>{symbol}</h3>
      </div>
    </div>
  )
}

Currency.propTypes = {
  symbol: PropTypes.string.isRequired,
  onSelect: PropTypes.func
}

export default Currency
