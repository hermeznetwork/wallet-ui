import React from 'react'
import PropTypes from 'prop-types'

import useAccountStyles from './account.styles'
import { CurrencySymbol } from '../../../utils/currencies'

function Account ({
  tokenName,
  balance,
  tokenSymbol,
  fiatBalance,
  preferredCurrency,
  onClick
}) {
  const classes = useAccountStyles()

  return (
    <div className={classes.root} onClick={() => onClick()}>
      <div className={`${classes.values} ${classes.topRow}`}>
        <p className={classes.tokenSymbol}>{tokenSymbol}</p>
        <p className={classes.tokenBalance}>{balance} {tokenSymbol}</p>
      </div>
      <div className={`${classes.values} ${classes.bottomRow}`}>
        <p className={classes.tokenName}>{tokenName}</p>
        <p className={classes.fiatBalance}>{CurrencySymbol[preferredCurrency].symbol} {fiatBalance.toFixed(2)}</p>
      </div>
    </div>
  )
}

Account.propTypes = {
  balance: PropTypes.string.isRequired,
  tokenName: PropTypes.string.isRequired,
  tokenSymbol: PropTypes.string.isRequired,
  fiatBalance: PropTypes.number.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  onClick: PropTypes.func
}

export default Account
