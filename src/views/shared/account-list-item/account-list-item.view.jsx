import React from 'react'
import PropTypes from 'prop-types'

import useAccountListItemStyles from './account-list-item.styles'

function AccountListItem ({
  token
}) {
  const classes = useAccountListItemStyles()
  // TODO: Apply conversion rate from API
  const conversionRate = 1

  return (
    <li className={classes.tokenListItem}>
      <div className={`${classes.values} ${classes.fiatValues}`}>
        <span className={classes.tokenName}>{token.name}</span>
        <span className={classes.tokenValueFiat}>{token.balance}</span>
      </div>
      <div className={`${classes.values} ${classes.tokenValues}`}>
        <span className={classes.tokenSymbol}>{token.symbol}</span>
        <span className={classes.tokenValueFiat}>{token.balance * conversionRate} {token.symbol}</span>
      </div>
    </li>
  )
}

AccountListItem.propTypes = {
  token: PropTypes.shape({
    balance: PropTypes.number.isRequired,
    tokenId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired
  })
}

export default AccountListItem
