import React from 'react'

import useWithdrawInfoSidenavStyles from './withdraw-info-sidenav.styles'
import Sidenav from '../../../shared/sidenav/sidenav.view'

function WithdrawInfoSidenav ({ onClose }) {
  const classes = useWithdrawInfoSidenavStyles()

  return (
    <Sidenav onClose={onClose}>
      <div className={classes.root}>
        <p className={classes.title}>
          Withdrawal of funds requires completing 2 steps. Once you have initiated withdrawal it can’t be canceled.
        </p>
        <div className={classes.stepCard}>
          <div className={classes.step}>
            <p className={classes.stepName}>Step 1</p>
          </div>
          <p className={classes.stepDescription}>
            You will pay for a fixed amount of Hermez fees.
          </p>
        </div>
        <div className={classes.stepCard}>
          <div className={classes.step}>
            <p className={classes.stepName}>Step 1</p>
          </div>
          <p className={classes.stepDescription}>
            You will pay for Ethereum gas fees and it may vary from the estimation in step 1.
          </p>
        </div>
      </div>
    </Sidenav>
  )
}

export default WithdrawInfoSidenav
