import React from 'react'
import PropTypes from 'prop-types'
import { TxType } from '@hermeznetwork/hermezjs/src/enums'

import useTransactionStyles from './transaction.styles'
import TransactionType from '../transaction-type/transaction-type.view'
import TransactionLabel from '../transaction-label/transaction-label.view'
import TransactionAmount from '../transaction-amount/transaction-amount.view'
import { getTxPendingTime } from '../../../../utils/transactions'

function Transaction ({
  accountIndex,
  type,
  fromAccountIndex,
  amount,
  tokenSymbol,
  fiatAmount,
  timestamp,
  isPending,
  preferredCurrency,
  coordinatorState,
  onClick
}) {
  const classes = useTransactionStyles()

  const isL1 = type === TxType.Deposit ||
    type === TxType.CreateAccountDeposit ||
    type === TxType.ForceExit
  const pendingTime = getTxPendingTime(coordinatorState, isL1, timestamp)

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
          <p className={classes.tokenSymbol}>{amount} {tokenSymbol}</p>
        </div>
        <div className={`${classes.row} ${classes.bottomRow}`}>
          {
            isPending
              ? (
                <div className={classes.pendingContainer}>
                  <div className={classes.pendingLabelContainer}>
                    <p className={classes.pendingLabelText}>Pending</p>
                  </div>
                  {pendingTime > 0 && <p className={classes.pendingTimer}>{pendingTime} min</p>}
                </div>
                )
              : <p>{new Date(timestamp).toLocaleDateString()}</p>
          }
          <TransactionAmount
            fiatAmount={fiatAmount}
            preferredCurrency={preferredCurrency}
            type={type}
            fromAccountIndex={fromAccountIndex}
            accountIndex={accountIndex}
          />
        </div>
      </div>
    </div>
  )
}

Transaction.propTypes = {
  type: PropTypes.string.isRequired,
  fromAccountIndex: PropTypes.string,
  amount: PropTypes.string.isRequired,
  tokenSymbol: PropTypes.string.isRequired,
  fiatAmount: PropTypes.number.isRequired,
  timestamp: PropTypes.string,
  preferredCurrency: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Transaction
