import React from 'react'
import PropTypes from 'prop-types'

import useTransactionStyles from './transaction.styles'
import TransactionType from '../transaction-type/transaction-type.view'
import TransactionLabel from '../transaction-label/transaction-label.view'
import TransactionAmount from '../transaction-amount/transaction-amount.view'

function Transaction ({
  accountIndex,
  type,
  fromAccountIndex,
  amount,
  tokenSymbol,
  fiatAmount,
  state,
  timestamp,
  isPending,
  preferredCurrency,
  onClick
}) {
  const classes = useTransactionStyles()

  return (
    <div className={classes.root} onClick={onClick}>
      <div className={classes.type}>
        <TransactionType
          type={type}
          amount={amount}
          fromAccountIndex={fromAccountIndex}
          accountIndex={accountIndex}
        />
      </div>
      <div className={classes.info}>
        <div className={`${classes.row} ${classes.topRow}`}>
          <TransactionLabel
            type={type}
            fromAccountIndex={fromAccountIndex}
            accountIndex={accountIndex}
          />
          <TransactionAmount
            fiatAmount={fiatAmount}
            preferredCurrency={preferredCurrency}
            type={type}
            fromAccountIndex={fromAccountIndex}
            accountIndex={accountIndex}
          />
        </div>
        <div className={`${classes.row} ${classes.bottomRow}`}>
          {
            isPending
              ? (
                <div className={classes.pendingLabelContainer}>
                  <p className={classes.pendingLabelText}>Pending</p>
                </div>
                )
              : <p>{new Date(timestamp).toLocaleDateString()}</p>
          }
          <p>{amount} {tokenSymbol}</p>
        </div>
      </div>
    </div>
  )
}

Transaction.propTypes = {
  type: PropTypes.string.isRequired,
  fromAccountIndex: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  tokenSymbol: PropTypes.string.isRequired,
  fiatAmount: PropTypes.number.isRequired,
  timestamp: PropTypes.string,
  preferredCurrency: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Transaction
