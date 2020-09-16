import React from 'react'
import PropTypes from 'prop-types'

import useTransactionStyles from './transaction.styles'
import TransactionType from '../transaction-type/transaction-type.view'

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
      <div className={classes.type}>
        <TransactionType type={type} amount={amount} />
      </div>
      <div className={classes.info}>
        <div className={`${classes.row} ${classes.topRow}`}>
          <p>{type}</p>
          <p className={classes.preferredCurrency}>
            {
              fiatRate
                ? `${preferredCurrency} ${priceInFiat.toFixed(2)}`
                : '-'
            }
          </p>
        </div>
        <div className={`${classes.row} ${classes.bottomRow}`}>
          <p>{date}</p>
          <p>{amount} {tokenSymbol}</p>
        </div>
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
