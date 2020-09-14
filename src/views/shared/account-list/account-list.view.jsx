import React from 'react'
import PropTypes from 'prop-types'

import useAccountListStyles from './account-list.styles'
import Account from '../account/account.view'
import { CurrencySymbol } from '../../../utils/currencies'
import clsx from 'clsx'

function AccountList ({
  accounts,
  preferredCurrency,
  fiatExchangeRates,
  onAccountClick
}) {
  const classes = useAccountListStyles()

  function getAccountFiatRate (token) {
    return preferredCurrency === CurrencySymbol.USD.code
      ? token.USD
      : token.USD * fiatExchangeRates[preferredCurrency]
  }

  function handleAccountListItemClick (account) {
    onAccountClick(account)
  }

  return (
    <div className={classes.root}>
      {accounts.map((account, index) => {
        return (
          <div
            key={account.token.tokenId}
            className={
              clsx({
                [classes.account]: true,
                [classes.accountSpacer]: index > 0
              })
            }
          >
            <Account
              balance={account.balance}
              tokenName={account.token.name}
              tokenSymbol={account.token.symbol}
              preferredCurrency={preferredCurrency}
              tokenFiatRate={getAccountFiatRate(account.token)}
              onClick={() => handleAccountListItemClick(account)}
            />
          </div>
        )
      })}
    </div>
  )
}

AccountList.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      balance: PropTypes.number.isRequired,
      token: PropTypes.shape({
        tokenId: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        symbol: PropTypes.string.isRequired
      })
    })
  ),
  onTokenSelected: PropTypes.func,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object.isRequired,
  onAccountClick: PropTypes.func
}

export default AccountList
