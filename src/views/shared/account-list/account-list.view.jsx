import React from 'react'
import PropTypes from 'prop-types'

import useAccountListStyles from './account-list.styles'
import Account from '../account/account.view'
import { CurrencySymbol } from '../../../utils/currencies'

function AccountList ({
  accounts,
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
      {accounts.map((account) => {
        return (
          <Account
            key={account.tokenId}
            balance={account.balance}
            tokenName={account.name}
            tokenSymbol={account.symbol}
            preferredCurrency={preferredCurrency}
            tokenFiatRate={getAccountFiatRate(account)}
            onClick={handleAccountListItemClick}
          />
        )
      })}
    </ul>
  )
}

AccountList.propTypes = {
  accounts: PropTypes.arrayOf(
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
