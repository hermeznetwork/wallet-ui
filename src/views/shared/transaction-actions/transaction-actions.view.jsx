import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import useTransactionActionsStyles from './transaction-actions.styles'
import { ReactComponent as SendIcon } from '../../../images/icons/send.svg'
import { ReactComponent as DepositIcon } from '../../../images/icons/deposit.svg'
import { ReactComponent as WithdrawIcon } from '../../../images/icons/withdraw.svg'

function TransactionActions ({ hideWithdraw, hideSend, accountIndex }) {
  const classes = useTransactionActionsStyles()
  const queryString = accountIndex ? `?accountIndex=${accountIndex}` : ''

  return (
    <div className={classes.root}>
      {
        hideSend
          ? <></>
          : (
            <div className={classes.action}>
              <Link to={`/transfer${queryString}`} className={classes.button}>
                <SendIcon className={classes.buttonIcon} />
              </Link>
              <p className={classes.buttonText}>Send</p>
            </div>
          )
      }
      <div className={classes.action}>
        <Link to={`/deposit${queryString}`} className={classes.button}>
          <DepositIcon className={classes.buttonIcon} />
        </Link>
        <p className={classes.buttonText}>Deposit</p>
      </div>
      {
        hideWithdraw
          ? <></>
          : (
            <div className={classes.action}>
              <Link to={`/withdraw${queryString}`} className={classes.button}>
                <WithdrawIcon className={classes.buttonIcon} />
              </Link>
              <p className={classes.buttonText}>Withdraw</p>
            </div>
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
