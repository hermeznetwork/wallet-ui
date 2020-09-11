import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import Account from '../../../shared/account/account.view'
import useAccountListStyles from './account-list.styles'
import { CurrencySymbol } from '../../../../utils/currencies'

function AccountList ({
  accounts,
  tokens,
  preferredCurrency,
  fiatExchangeRates,
  onAccountClick
}) {
  const classes = useAccountListStyles()

  function getToken (tokenId) {
    return tokens.find((token) => token.tokenId === tokenId)
  }

  function getTokenFiatRate (tokenSymbol) {
    if (!tokens || !fiatExchangeRates) {
      return undefined
    }

    const tokenRateInUSD = tokens
      .find((token) => token.symbol === tokenSymbol).USD

    return preferredCurrency === CurrencySymbol.USD
      ? tokenRateInUSD
      : tokenRateInUSD * fiatExchangeRates[preferredCurrency]
  }

  return (
    <>
      {accounts.map((account, index) => {
        const token = getToken(account.tokenId)
        const tokenFiatRate = getTokenFiatRate(token.symbol)

        return (
          <div
            key={account.tokenId}
            className={
              clsx({
                [classes.account]: true,
                [classes.accountSpacer]: index > 0
              })
            }
          >
            <Account
              balance={account.balance}
              tokenName={token.name}
              tokenSymbol={token.symbol}
              preferredCurrency={preferredCurrency}
              tokenFiatRate={tokenFiatRate}
              onClick={() => onAccountClick(account)}
            />
          </div>
        )
      }
      )}
    </>
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
  fiatExchangeRates: PropTypes.object,
  preferredCurrency: PropTypes.string.isRequired,
  onAccountClick: PropTypes.func
}

export default AccountList
