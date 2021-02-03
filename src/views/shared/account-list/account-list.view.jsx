import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import useAccountListStyles from './account-list.styles'
import Account from '../account/account.view'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../../utils/currencies'
import { BigNumber } from 'ethers'

function AccountList ({
  accounts,
  preferredCurrency,
  fiatExchangeRates,
  pendingDeposits,
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

  function getAccountBalance (account) {
    if (!pendingDeposits) {
      return account.balance
    }

    const pendingDeposit = pendingDeposits.find((deposit) => deposit.token.id === account.token.id)
    const newAccountBalance = BigNumber.from(account.balance).add(BigNumber.from(pendingDeposit.amount)).toString()

    return newAccountBalance
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
        const accountBalance = getAccountBalance(account)
        const fixedAccountBalance = getFixedTokenAmount(accountBalance, account.token.decimals)

        return (
          <div
            key={account.accountIndex || account.token.id}
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
