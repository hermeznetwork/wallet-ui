import React from 'react'
import PropTypes from 'prop-types'

import useAccountListStyles from './account-list.styles'
import Account from '../account/account.view'
import { getTokenAmountInPreferredCurrency } from '../../../utils/currencies'
import clsx from 'clsx'

function AccountList ({
  accounts,
  preferredCurrency,
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
      {accounts.map((account, index) => (
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
            fiatBalance={getTokenAmountInPreferredCurrency(
              account.tokenSymbol,
              preferredCurrency,
              account.balanceUSD,
              fiatExchangeRates
            )}
            onClick={() => handleAccountListItemClick(account)}
          />
        </div>
      ))}
    </div>
  )
}

AccountList.propTypes = {
  accounts: PropTypes.array,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object,
  onAccountClick: PropTypes.func
}

export default AccountList
