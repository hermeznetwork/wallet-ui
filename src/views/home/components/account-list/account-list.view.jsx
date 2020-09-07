import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import Account from '../account/account.view'
import useAccountListStyles from './account-list.styles'

function AccountList ({ accounts, tokens, preferredCurrency }) {
  const classes = useAccountListStyles()

  function getToken (tokenId) {
    return tokens.find((token) => token.tokenId === tokenId)
  }

  return (
    <div>
      {accounts.map((account, index) =>
        <div
          key={account.tokenId}
          className={clsx({ [classes.account]: index > 0 })}
        >
          <Account
            tokenId={account.tokenId}
            amount={account.balance}
            tokenSymbol={getToken(account.tokenId).symbol}
            preferredCurrency={getToken(preferredCurrency).symbol}
          />
        </div>
      )}
    </div>
  )
}

AccountList.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      balance: PropTypes.number.isRequired,
      tokenId: PropTypes.number.isRequired
    })
  ),
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      tokenId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired
    })
  ),
  preferredCurrency: PropTypes.number.isRequired
}

export default AccountList
