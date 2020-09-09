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
  fiatExchangeRates
}) {
  const classes = useAccountListStyles()

  function getTokenSymbol (tokenId) {
    return tokens.find((token) => token.tokenId === tokenId)?.symbol
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
    <div>
      {accounts.map((account, index) => {
        const tokenSymbol = getTokenSymbol(account.tokenId)
        const tokenFiatRate = getTokenFiatRate(tokenSymbol)

        return (
          <div
            key={account.tokenId}
            className={clsx({ [classes.account]: index > 0 })}
          >
            <Account
              tokenId={account.tokenId}
              amount={account.balance}
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
  preferredCurrency: PropTypes.string.isRequired
}

export default AccountList
