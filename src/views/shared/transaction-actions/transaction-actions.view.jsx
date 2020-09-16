import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import useTransactionActionsStyles from './transaction-actions.styles'
import sendIcon from '../../../images/icons/transaction-actions/send.svg'
import depositIcon from '../../../images/icons/transaction-actions/deposit.svg'
import withdrawIcon from '../../../images/icons/transaction-actions/withdraw.svg'

function TransactionActions ({ hideWithdraw }) {
  const classes = useTransactionActionsStyles()

  return (
    <div className={classes.root}>
      <Link to='/transfer' className={classes.button}>
        <img src={sendIcon} alt='Send' />
        <p className={classes.buttonText}>Send</p>
      </Link>
      <Link to='/deposit' className={classes.button}>
        <img src={depositIcon} alt='Deposit' />
        <p className={classes.buttonText}>Deposit</p>
      </Link>
      {
        hideWithdraw
          ? <></>
          : (
            <Link to='/withdraw' className={classes.button}>
              <img src={withdrawIcon} alt='Deposit' />
              <p className={classes.buttonText}>Withdraw</p>
            </Link>
          )
      }
    </div>
  )
}

TransactionActions.propTypes = {
  hideWithdraw: PropTypes.bool
}

export default TransactionActions
