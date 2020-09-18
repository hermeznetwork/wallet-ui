import React from 'react'
import PropTypes from 'prop-types'

import useAccountStyles from './account.styles'

function Account ({
  tokenName,
  balance,
  tokenSymbol,
  tokenFiatExchangeRate,
  preferredCurrency,
  onClick
}) {
  const classes = useAccountStyles()
  const balanceInFiat = tokenFiatExchangeRate
    ? (Number(balance) * tokenFiatExchangeRate).toFixed(2)
    : '-'

  return (
    <div className={classes.root} onClick={() => onClick()}>
      <div className={`${classes.values} ${classes.topRow}`}>
        <p className={classes.tokenName}>{tokenName}</p>
        <p>{preferredCurrency} {balanceInFiat}</p>
      </div>
      <div className={`${classes.values} ${classes.bottomRow}`}>
        <p>{tokenSymbol}</p>
        <p>{balance} {tokenSymbol}</p>
      </div>
    </div>
  )
}

Account.propTypes = {
  balance: PropTypes.string.isRequired,
  tokenName: PropTypes.string.isRequired,
  tokenSymbol: PropTypes.string.isRequired,
  tokenFiatExchangeRate: PropTypes.number,
  preferredCurrency: PropTypes.string.isRequired,
  onClick: PropTypes.func
}

export default Account
