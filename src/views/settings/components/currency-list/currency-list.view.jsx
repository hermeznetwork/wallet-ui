import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import Currency from '../currency/token.view'
import useCurrencyListStyles from './currency-list.styles'

function CurrencyList ({ currencies, selectedCurrency, onSelectCurrency }) {
  const classes = useCurrencyListStyles()

  return (
    <div>
      <div>
        <h4>Default currency</h4>
        <Currency
          symbol={selectedCurrency}
          onSelect={onSelectCurrency}
        />
      </div>
      <div>
        <h4>Currency list</h4>
        {currencies.map((currency, index) =>
          <div
            key={currency}
            className={clsx({ [classes.currency]: index > 0 })}
          >
            <Currency
              symbol={currency}
              onSelect={onSelectCurrency}
            />
          </div>
        )}
      </div>
    </div>
  )
}

CurrencyList.propTypes = {
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCurrency: PropTypes.string.isRequired,
  onSelectCurrency: PropTypes.func.isRequired
}

export default CurrencyList
