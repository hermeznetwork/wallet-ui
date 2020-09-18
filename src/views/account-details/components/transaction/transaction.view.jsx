import React from 'react'
import PropTypes from 'prop-types'

import useTransactionStyles from './transaction.styles'
import TransactionType from '../transaction-type/transaction-type.view'

function Transaction ({
  type,
  amount,
  tokenSymbol,
  tokenFiatExchangeRate,
  date,
  preferredCurrency,
  onClick
}) {
  const classes = useTransactionStyles()
  const amountInFiat = tokenFiatExchangeRate
    ? (Number(amount) * tokenFiatExchangeRate).toFixed(2)
    : '-'

  function handleClick () {
    onClick()
  }

  return (
    <div className={classes.root} onClick={handleClick}>
      <div className={classes.type}>
        <TransactionType type={type} amount={amount} />
      </div>
      <div className={classes.info}>
        <div className={`${classes.row} ${classes.topRow}`}>
          <p>{type}</p>
          <p className={classes.preferredCurrency}>{amountInFiat}</p>
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
  type: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  tokenSymbol: PropTypes.string.isRequired,
  tokenFiatExchangeRate: PropTypes.number,
  date: PropTypes.string.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Transaction
