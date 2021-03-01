import React from 'react'

import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../../utils/currencies'
import Account from '../../shared/account/account.view'
import usePendingDepositListStyles from './pending-deposit-list.styles'

function PendingDepositList ({ deposits, preferredCurrency, fiatExchangeRates, onAccountClick }) {
  const classes = usePendingDepositListStyles()

  return (
    <>
      {
        deposits.map((deposit) => {
          return (
            <div
              key={deposit.hash}
              className={classes.pendingDeposit}
            >
              <Account
                hasPendingDeposit
                balance={deposit.amount}
                fiatBalance={getTokenAmountInPreferredCurrency(
                  getFixedTokenAmount(deposit.amount, deposit.token.decimals),
                  deposit.token.USD,
                  preferredCurrency,
                  fiatExchangeRates
                )}
                token={deposit.token}
                preferredCurrency={preferredCurrency}
                onClick={onAccountClick}
              />
            </div>
          )
        })
      }
    </>
  )
}

export default PendingDepositList
