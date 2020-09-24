import React from 'react'
import PropTypes from 'prop-types'

import usePreferredCurrencySelectorStyles from './preferred-currency-selector.styles'
import clsx from 'clsx'

function PreferredCurrencySelector ({ preferredCurrency, currencies, onChange }) {
  const classes = usePreferredCurrencySelectorStyles()

  function handleOnInputClick (event) {
    onChange(event.currentTarget.value)
  }

  return (
    <div className={classes.root}>
      {currencies.map((currency, index) =>
        <div
          key={currency.code}
          className={clsx({ [classes.inputGroupSpacer]: index > 0 })}
        >
          <input
            className={classes.input}
            type='radio'
            name='currency'
            id={currency.code}
            value={currency.code}
            checked={preferredCurrency === currency.code}
            onChange={handleOnInputClick}
          />
          <label
            className={classes.label}
            htmlFor={currency.code}
          >
            {currency.code}
          </label>
        </div>
      )}
    </div>
  )
}

PreferredCurrencySelector.propTypes = {
  preferredCurrency: PropTypes.string,
  currencies: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}

export default PreferredCurrencySelector
