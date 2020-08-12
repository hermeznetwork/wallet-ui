import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import Account from '../account/account.view'
import useAccountListStyles from './account-list.styles'

function AccountList ({ accounts, tokens, preferredCurrency }) {
  const classes = useAccountListStyles()

  function getToken (tokenId) {
    return tokens.find((token) => token.TokenID === tokenId)
  }

  return (
    <div>
      {accounts.map((account, index) =>
        <div
          key={account.TokenID}
          className={clsx({ [classes.account]: index > 0 })}
        >
          <Account
            tokenId={account.TokenID}
            amount={account.Balance}
            tokenSymbol={getToken(account.TokenID).Symbol}
            preferredCurrency={preferredCurrency}
          />
        </div>
      )}
    </div>
  )
}

AccountList.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      Balance: PropTypes.number.isRequired,
      TokenID: PropTypes.number.isRequired
    })
  ),
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      TokenID: PropTypes.number.isRequired,
      Name: PropTypes.string.isRequired,
      Symbol: PropTypes.string.isRequired
    })
  ),
  preferredCurrency: PropTypes.string.isRequired
}

export default AccountList
