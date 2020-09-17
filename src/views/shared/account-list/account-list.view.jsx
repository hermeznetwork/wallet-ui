import React from 'react'
import PropTypes from 'prop-types'

import useAccountListStyles from './account-list.styles'
import Account from '../account/account.view'
import { getTokenFiatExchangeRate } from '../../../utils/currencies'
import clsx from 'clsx'

function AccountList ({
  accounts,
  preferredCurrency,
  usdTokenExchangeRates,
  fiatExchangeRates,
  onAccountClick
}) {
  const classes = useAccountListStyles()

  /**
   * When an account is selected, bubble it up with the onAccountClick prop function.
   */
  function handleAccountListItemClick (account) {
    onAccountClick(account)
  }

  return (
    <div className={classes.root}>
      {accounts.map((account, index) => {
        return (
          <div
            key={account.accountIndex}
            className={
              clsx({
                [classes.account]: true,
                [classes.accountSpacer]: index > 0
              })
            }
          >
            <Account
              balance={account.balance}
              tokenName={account.tokenName}
              tokenSymbol={account.tokenSymbol}
              preferredCurrency={preferredCurrency}
              tokenFiatExchangeRate={getTokenFiatExchangeRate(
                account.tokenSymbol,
                preferredCurrency,
                usdTokenExchangeRates,
                fiatExchangeRates
              )}
              onClick={() => handleAccountListItemClick(account)}
            />
          </div>
        )
      })}
    </div>
  )
}

AccountList.propTypes = {
  accounts: PropTypes.array,
  preferredCurrency: PropTypes.string.isRequired,
  usdTokenExchangeRates: PropTypes.object,
  fiatExchangeRates: PropTypes.object,
  onAccountClick: PropTypes.func
}

export default AccountList
