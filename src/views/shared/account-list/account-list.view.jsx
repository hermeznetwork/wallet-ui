import React from 'react'
import PropTypes from 'prop-types'

import useAccountListStyles from './account-list.styles'
import AccountListItem from '../account-list-item/account-list-item.view'
import { CurrencySymbol } from '../../../utils/currencies'

function AccountList ({
  tokens,
  preferredCurrency,
  fiatExchangeRates,
  onTokenSelected
}) {
  const classes = useAccountListStyles()

  function getAccountFiatRate (token) {
    return preferredCurrency === CurrencySymbol.USD.code
      ? token.USD
      : token.USD * fiatExchangeRates[preferredCurrency]
  }

  function handleAccountListItemClick (token) {
    onTokenSelected(token)
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
            onSelect={() => handleAccountListItemClick(token)}
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
  onTokenSelected: PropTypes.func,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object.isRequired
}

export default AccountList
