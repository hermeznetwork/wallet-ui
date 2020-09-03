import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import Account from '../account/account.view'
import useAccountListStyles from './account-list.styles'

function AccountList ({ accounts, tokens, preferredCurrency, tokensPrice }) {
  const classes = useAccountListStyles()

  function getTokenSymbol (tokenId) {
    return tokens.find((token) => token.TokenID === tokenId)?.Symbol
  }

  function getTokenPrice (tokenSymbol) {
    return tokensPrice.find((tokenPrice) => tokenPrice.symbol === tokenSymbol)?.value
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
            tokenSymbol={getTokenSymbol(account.TokenID)}
            preferredCurrency={getTokenSymbol(preferredCurrency)}
            tokenPrice={getTokenPrice(getTokenSymbol(account.TokenID))}
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
  tokensPrice: PropTypes.arrayOf(
    PropTypes.shape({
      symbol: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    })
  ),
  preferredCurrency: PropTypes.number.isRequired
}

export default AccountList
