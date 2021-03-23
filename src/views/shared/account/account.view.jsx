import React from 'react'
import PropTypes from 'prop-types'

import useAccountStyles from './account.styles'
import { CurrencySymbol, getFixedTokenAmount } from '../../../utils/currencies'
import { getTxPendingTime } from '../../../utils/transactions'

function Account ({
  balance,
  fiatBalance,
  token,
  preferredCurrency,
  hasPendingDeposit,
  isDisabled,
  coordinatorState,
  timestamp,
  onClick
}) {
  const classes = useAccountStyles({
    hasPendingDeposit,
    isDisabled
  })

  const pendingTime = getTxPendingTime(coordinatorState, true, timestamp)

  return (
    <div
      className={`${classes.root} ${classes.account}`}
      onClick={() => {
        if (onClick) {
          onClick()
        }
      }}
    >
      <div className={`${classes.values} ${classes.topRow} ${classes.topRowText}`}>
        <p>{token.symbol}</p>
        <p>{getFixedTokenAmount(balance, token.decimals)} {token.symbol}</p>
      </div>
      <div className={`${classes.values} ${classes.bottomRow}`}>
        {
          hasPendingDeposit
            ? (
              <div className={classes.pendingContainer}>
                <div className={classes.pendingLabelContainer}>
                  <p className={classes.pendingLabelText}>Pending</p>
                </div>
                {pendingTime > 0 && <p className={classes.pendingTimer}>{pendingTime} min</p>}
              </div>
              )
            : <p className={classes.tokenName}>{token.name}</p>
        }
        <p>{CurrencySymbol[preferredCurrency].symbol} {fiatBalance.toFixed(2)}</p>
      </div>
    </div>
  )
}

Account.propTypes = {
  balance: PropTypes.string.isRequired,
  fiatBalance: PropTypes.number.isRequired,
  token: PropTypes.object.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  coordinatorState: PropTypes.object,
  onClick: PropTypes.func
}

export default Account
