import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import useTransactionConfirmationStyles from './transaction-confirmation.styles'
import handsTransaction from '../../images/handstransaction.png'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'

function TransactionConfirmation () {
  const classes = useTransactionConfirmationStyles()

  return (
    <section className={classes.wrapper}>
      <img
        className={classes.image}
        src={handsTransaction}
        alt='Hermez transactionn confirmed'
      />
      <p className={classes.text}>Your transaction is completed.</p>
      <Link to='/' className={classes.doneWrapper}><button className={classes.done}>Done</button></Link>
    </section>
  )
}

export default withAuthGuard(connect()(TransactionConfirmation))
