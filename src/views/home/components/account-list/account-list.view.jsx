import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import Account from '../account/account.view'
import useAccountListStyles from './account-list.styles'
import { CurrencySymbol } from '../../../../utils/currencies'

function AccountList ({
  accounts,
  tokens,
  preferredCurrency,
  tokensPrice,
  fiatExchangeRates
}) {
  const classes = useAccountListStyles()

  function getTokenSymbol (tokenId) {
    return tokens.find((token) => token.TokenID === tokenId)?.Symbol
  }

  function getTokenFiatRate (tokenSymbol) {
    if (!tokensPrice || !fiatExchangeRates) {
      return undefined
    }

    const tokenRateInUSD = tokensPrice
      .find((tokenPrice) => tokenPrice.symbol === tokenSymbol).value

    return preferredCurrency === CurrencySymbol.USD
      ? tokenRateInUSD
      : tokenRateInUSD * fiatExchangeRates[preferredCurrency]
  }

  return (
    <div>
      {accounts.map((account, index) => {
        const tokenSymbol = getTokenSymbol(account.TokenID)
        const tokenFiatRate = getTokenFiatRate(tokenSymbol)

        return (
          <div
            key={account.TokenID}
            className={clsx({ [classes.account]: index > 0 })}
          >
            <Account
              tokenId={account.TokenID}
              amount={account.Balance}
              tokenSymbol={tokenSymbol}
              preferredCurrency={preferredCurrency}
              fiatRate={tokenFiatRate}
            />
          </div>
        )
      }
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
  fiatExchangeRates: PropTypes.object,
  preferredCurrency: PropTypes.string.isRequired
}

export default AccountList
