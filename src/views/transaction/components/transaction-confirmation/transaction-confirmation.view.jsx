import React from 'react'
import PropTypes from 'prop-types'

import useTransactionConfirmationStyles from './transaction-confirmation.styles'
import transactionConfirmation from '../../../../images/transaction-confirmation.png'
import { TransactionType } from '../../transaction.view'

function TransactionConfirmation ({ transactionType, onFinishTransaction }) {
  const classes = useTransactionConfirmationStyles()

  function getExplanation () {
    switch (transactionType) {
      case TransactionType.Deposit:
        return 'Your transaction is awaiting verification.'
      case TransactionType.Transfer:
        return 'Your transaction is completed.'
      case TransactionType.Exit:
        return 'Withdrawal has been initiated and will require additional confirmation in a few minutes.'
      case TransactionType.ForceExit:
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
      <button className={classes.done} click={onFinishTransaction}>
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
