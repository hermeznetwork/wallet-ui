import React from 'react'
import PropTypes from 'prop-types'

import useTransactionStyles from './transaction.styles'

function Transaction ({
  id,
  type,
  amount,
  tokenSymbol,
  fiatRate,
  date,
  preferredCurrency,
  onClick
}) {
  const classes = useTransactionStyles()
  const priceInFiat = amount * fiatRate

  function handleClick () {
    onClick(id)
  }

  return (
    <div className={classes.root} onClick={handleClick}>
      <div className={classes.typeContainer}>
        <p className={classes.type}>{type.charAt(0)}</p>
      </div>
      <div>
        <h3 className={classes.amount}>{amount} {tokenSymbol}</h3>
        {
          fiatRate
            ? (
              <h4 className={classes.preferredCurrency}>
                {priceInFiat.toFixed(2)} {preferredCurrency}
              </h4>
            )
            : <></>
        }
        <p className={classes.date}>{date}</p>
      </div>
    </div>
  )
}

Transaction.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  tokenSymbol: PropTypes.string.isRequired,
  fiatRate: PropTypes.number,
  date: PropTypes.string.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Transaction
