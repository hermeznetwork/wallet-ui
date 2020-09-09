import React from 'react'
import PropTypes from 'prop-types'

import useAccountListItemStyles from './account-list-item.styles'

function AccountListItem ({
  name,
  balance,
  symbol,
  fiatRate,
  preferredCurrency
}) {
  const classes = useAccountListItemStyles()
  // TODO: Apply conversion rate from API
  const balanceInFiat = balance * fiatRate

  return (
    <li className={classes.tokenListItem}>
      <div className={`${classes.values} ${classes.fiatValues}`}>
        <span className={classes.tokenName}>{name}</span>
        <span className={classes.tokenValueFiat}>{balanceInFiat.toFixed(2)} {preferredCurrency}</span>
      </div>
      <div className={`${classes.values} ${classes.tokenValues}`}>
        <span className={classes.tokenSymbol}>{symbol}</span>
        <span className={classes.tokenValueFiat}>{balance} {symbol}</span>
      </div>
    </li>
  )
}

AccountListItem.propTypes = {
  balance: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  fiatRate: PropTypes.number.isRequired,
  preferredCurrency: PropTypes.string.isRequired
}

export default AccountListItem
