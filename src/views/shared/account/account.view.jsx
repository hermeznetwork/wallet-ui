import React from 'react'
import PropTypes from 'prop-types'

import useAccountStyles from './account.styles'

function Account ({
  tokenName,
  balance,
  tokenSymbol,
  tokenFiatRate,
  preferredCurrency,
  onClick
}) {
  const classes = useAccountStyles()
  const balanceInFiat = balance * tokenFiatRate

  return (
    <div className={classes.root} onClick={() => onClick()}>
      <div className={`${classes.values} ${classes.topRow}`}>
        <p className={classes.tokenName}>{tokenName}</p>
        <p>{preferredCurrency} {balanceInFiat.toFixed(2)}</p>
      </div>
      <div className={`${classes.values} ${classes.bottomRow}`}>
        <p>{tokenSymbol}</p>
        <p>{balance} {tokenSymbol}</p>
      </div>
    </div>
  )
}

Account.propTypes = {
  balance: PropTypes.number.isRequired,
  tokenName: PropTypes.string.isRequired,
  tokenSymbol: PropTypes.string.isRequired,
  tokenFiatRate: PropTypes.number.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  onClick: PropTypes.func
}

export default Account
