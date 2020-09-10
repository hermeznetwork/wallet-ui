import React from 'react'
import PropTypes from 'prop-types'

import useAccountListStyles from './account-list.styles'
import AccountListItem from '../account-list-item/account-list-item.view'

function AccountList ({
  tokens,
  onSelect
}) {
  const classes = useAccountListStyles()

  function handleAccountListItemClick (token) {
    onSelect(token)
  }

  return (
    <ul className={classes.tokenList}>
      {tokens.map((token) => {
        return (
          <AccountListItem
            key={token.tokenId}
            token={token}
            onSelect={handleAccountListItemClick}
          />
        )
      })}
    </ul>
  )
}

AccountList.propTypes = {
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      balance: PropTypes.number.isRequired,
      tokenId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired
    })
  ),
  onSelect: PropTypes.func
}

export default AccountList
