import React from 'react'
import PropTypes from 'prop-types'

import useAccountListStyles from './account-list.styles'
import AccountListItem from '../account-list-item/account-list-item.view'
import { CurrencySymbol } from '../../../utils/currencies'

function AccountList ({
  tokens,
  preferredCurrency,
  fiatExchangeRates
}) {
  const classes = useAccountListStyles()

  function getAccountFiatRate (token) {
    return preferredCurrency === CurrencySymbol.USD
      ? token.USD
      : token.USD * fiatExchangeRates[preferredCurrency]
  }

  function handleAccountListItemClick () {

  }

  return (
    <ul className={classes.tokenList}>
      {tokens.map((token) => {
        return (
          <AccountListItem
            key={token.tokenId}
            name={token.name}
            balance={token.balance}
            symbol={token.symbol}
            preferredCurrency={preferredCurrency}
            fiatRate={getAccountFiatRate(token)}
            onClick={handleAccountListItemClick}
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
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object.isRequired
}

export default AccountList
