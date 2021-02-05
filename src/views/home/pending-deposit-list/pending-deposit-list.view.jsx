import React from 'react'

import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../../utils/currencies'
import Account from '../../shared/account/account.view'
import usePendingDepositListStyles from './pending-deposit-list.styles'

function PendingDepositList ({ deposits, preferredCurrency, fiatExchangeRates }) {
  const classes = usePendingDepositListStyles(

  )
  return (
    <>
      {
        deposits.map((deposit) => (
          <div
            key={deposit.transactionHash}
            className={classes.pendingDeposit}
          >
            <Account
              hasPendingDeposit
              balance={getFixedTokenAmount(deposit.amount, deposit.token.decimals)}
              fiatBalance={getTokenAmountInPreferredCurrency(
                deposit.amount,
                deposit.token.USD,
                preferredCurrency,
                fiatExchangeRates
              )}
              tokenName={deposit.token.name}
              tokenSymbol={deposit.token.symbol}
              preferredCurrency={preferredCurrency}
            />
          </div>
        ))
      }
    </>
  )
}

export default PendingDepositList
