import React from 'react'
import PropTypes from 'prop-types'

import useExitStyles from './exit.styles'
import { CurrencySymbol } from '../../../utils/currencies'

function Exit ({
  amount,
  tokenSymbol,
  fiatAmount,
  preferredCurrency
}) {
  const classes = useExitStyles()

  function getStep () {
    return 1
  }

  function getTag () {
    switch (getStep()) {
      case 1:
        return 'Initiated'
      case 2:
        return 'On hold'
      case 3:
        return 'Pending'
      default:
        return ''
    }
  }

  return (
    <div className={classes.root}>
      <p className={classes.step}>Step {getStep()}/3</p>
      <div className={classes.rowTop}>
        <span className={classes.txType}>Withdrawal</span>
        <span className={classes.amountFiat}>{CurrencySymbol[preferredCurrency].symbol}{fiatAmount}</span>
      </div>
      <div className={classes.rowBottom}>
        <div className={classes.stepTagWrapper}><span className={classes.stepTag}>{getTag()}</span></div>
        <span className={classes.tokenAmount}>{amount} {tokenSymbol}</span>
      </div>
    </div>
  )
}

Exit.propTypes = {
  amount: PropTypes.string.isRequired,
  tokenSymbol: PropTypes.string.isRequired,
  fiatAmount: PropTypes.number.isRequired,
  preferredCurrency: PropTypes.string.isRequired
}

export default Exit
