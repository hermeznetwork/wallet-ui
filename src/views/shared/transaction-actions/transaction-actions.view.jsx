import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import useTransactionActionsStyles from './transaction-actions.styles'
import { ReactComponent as SendIcon } from '../../../images/icons/send.svg'
import { ReactComponent as DepositIcon } from '../../../images/icons/deposit.svg'
import { ReactComponent as WithdrawIcon } from '../../../images/icons/withdraw.svg'

function TransactionActions ({ hideWithdraw, accountIndex }) {
  const classes = useTransactionActionsStyles()
  const queryString = accountIndex ? `?accountIndex=${accountIndex}` : ''

  return (
    <div className={classes.root}>
      <Link to={`/transfer${queryString}`} className={classes.button}>
        <SendIcon />
        <p className={classes.buttonText}>Send</p>
      </Link>
      <Link to={`/deposit${queryString}`} className={classes.button}>
        <DepositIcon />
        <p className={classes.buttonText}>Deposit</p>
      </Link>
      {
        hideWithdraw
          ? <></>
          : (
            <Link to={`/withdraw${queryString}`} className={classes.button}>
              <WithdrawIcon />
              <p className={classes.buttonText}>Withdraw</p>
            </Link>
          )
      }
    </div>
  )
}

TransactionActions.propTypes = {
  hideWithdraw: PropTypes.bool,
  accountIndex: PropTypes.string
}

export default TransactionActions
