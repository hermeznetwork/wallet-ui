import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import useAccountListStyles from './account-list.styles'
import Account from '../account/account.view'
import '../../../utils/accounts'

function AccountList ({
  accounts,
  preferredCurrency,
  fiatExchangeRates,
  pendingDeposits,
  poolTransactions,
  disabledTokenIds,
  onAccountClick
}) {
  const classes = useAccountListStyles()

  function hasAccountPendingDeposit (account) {
    if (!pendingDeposits) {
      return false
    }

    return pendingDeposits.find((deposit) => deposit.token.id === account.token.id) !== undefined
  }

  function isAccountDisabled (account) {
    if (!disabledTokenIds) {
      return false
    }

    return disabledTokenIds.find((id) => account.token.id === id) !== undefined
  }

  /**
   * Bubbles up the onAccountClick event when an account is clicked
   * @returns {void}
   */
  function handleAccountListItemClick (account) {
    onAccountClick(account)
  }

  return (
    <div className={classes.root}>
      {accounts.map((account, index) => {
        return (
          <div
            key={account.accountIndex || account.token.id}
            className={clsx({ [classes.accountSpacer]: index > 0 })}
          >
            <Account
              balance={account.balance}
              tokenName={account.token.name}
              tokenSymbol={account.token.symbol}
              preferredCurrency={preferredCurrency}
              fiatBalance={account.fiatBalance}
              hasPendingDeposit={hasAccountPendingDeposit(account)}
              isDisabled={isAccountDisabled(account)}
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
