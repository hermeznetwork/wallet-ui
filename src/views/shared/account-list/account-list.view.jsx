import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import useAccountListStyles from './account-list.styles'
import Account from '../account/account.view'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../../utils/currencies'

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
      {accounts.map((account, index) => {
        const fixedAccountBalance = getFixedTokenAmount(
          account.balance,
          account.token.decimals
        )

        return (
          <div
            key={account.token.id}
            className={clsx({ [classes.accountSpacer]: index > 0 })}
          >
            <Account
              balance={fixedAccountBalance}
              tokenName={account.token.name}
              tokenSymbol={account.token.symbol}
              preferredCurrency={preferredCurrency}
              fiatBalance={getTokenAmountInPreferredCurrency(
                fixedAccountBalance,
                account.token.USD,
                preferredCurrency,
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
  fiatExchangeRates: PropTypes.object,
  onAccountClick: PropTypes.func
}

export default AccountList
