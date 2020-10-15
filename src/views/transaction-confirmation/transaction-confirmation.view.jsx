import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import useTransactionConfirmationStyles from './transaction-confirmation.styles'
import handsTransaction from '../../images/transaction-confirmation.png'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'

function TransactionConfirmation ({ transactionType }) {
  const classes = useTransactionConfirmationStyles()

  function getExplanation () {
    switch (transactionType) {
      case 'deposit':
        return 'Your transaction is awaiting verification.'
      case 'transfer':
        return 'Your transaction is completed.'
      case 'withdraw':
        return 'Withdrawal has been initiated and will require additional confirmation in a few minutes.'
      default:
        return ''
    }
  }

  return (
    <section className={classes.wrapper}>
      <img
        className={classes.image}
        src={handsTransaction}
        alt='Hermez transaction confirmed'
      />
      <p className={classes.text}>{getExplanation()}</p>
      <Link to='/' className={classes.doneWrapper}><button className={classes.done}>Done</button></Link>
    </section>
  )
}

TransactionConfirmation.propTypes = {
  transactionType: PropTypes.string.isRequired
}

export default withAuthGuard(TransactionConfirmation)
