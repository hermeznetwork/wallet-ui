import React from 'react'
import PropTypes from 'prop-types'

import useTransactionConfirmationStyles from './transaction-confirmation.styles'
import transactionConfirmation from '../../../../images/transaction-confirmation.png'
import { TransactionType } from '../../transaction.view'

function TransactionConfirmation ({ transactionType, onFinishTransaction }) {
  const classes = useTransactionConfirmationStyles()

  /**
   * Converts the transaction type to a readable explanation of it
   * @returns {string} - Explanation for the transaction type
   */
  function getExplanation () {
    switch (transactionType) {
      case TransactionType.Deposit:
        return 'Your transaction is awaiting verification.'
      case TransactionType.Transfer:
        return 'Your transaction is completed.'
      case TransactionType.Exit:
      case TransactionType.ForceExit:
      case TransactionType.Withdraw:
      case TransactionType.DelayedWithdrawal:
        return 'Withdrawal has been initiated and will require additional confirmation in a few minutes.'
      default:
        return ''
    }
  }

  return (
    <section className={classes.wrapper}>
      <img
        className={classes.image}
        src={transactionConfirmation}
        alt='Hermez transaction confirmed'
      />
      <p className={classes.text}>{getExplanation()}</p>
      <button className={classes.done} onClick={onFinishTransaction}>
        Done
      </button>
    </section>
  )
}

TransactionConfirmation.propTypes = {
  transactionType: PropTypes.string.isRequired,
  onFinishTransaction: PropTypes.func.isRequired
}

export default TransactionConfirmation
