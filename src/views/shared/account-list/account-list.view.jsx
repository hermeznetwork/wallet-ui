import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import useAccountListStyles from './account-list.styles'
import Account from '../account/account.view'
import '../../../utils/accounts'

function AccountList ({
  accounts,
  preferredCurrency,
  pendingDeposits,
  coordinatorState,
  disabledTokenIds,
  onAccountClick
}) {
  const classes = useAccountListStyles()

  function getAccountPendingDeposit (account) {
    return pendingDeposits?.find((deposit) => deposit.token.id === account.token.id)
  }

  function hasAccountPendingDeposit (account) {
    if (!pendingDeposits) {
      return false
    }

    return getAccountPendingDeposit(account) !== undefined
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
              preferredCurrency={preferredCurrency}
              fiatBalance={account.fiatBalance}
              token={account.token}
              hasPendingDeposit={hasAccountPendingDeposit(account)}
              isDisabled={isAccountDisabled(account)}
              coordinatorState={coordinatorState}
              timestamp={getAccountPendingDeposit(account)?.timestamp}
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
