import React from 'react'
import PropTypes from 'prop-types'

import Exit from '../exit/exit.view'
import { CurrencySymbol, getFixedTokenAmount, getAmountInPreferredCurrency, getTokenAmountInPreferredCurrency } from '../../../utils/currencies'

function ExitList ({
  transactions,
  preferredCurrency,
  fiatExchangeRates,
  pendingWithdraws,
  pendingDelayedWithdraws,
  coordinatorState,
  redirectTo,
  onAddPendingDelayedWithdraw,
  onRemovePendingDelayedWithdraw
}) {
  return (
    <>
      {transactions.map((transaction) => {
        const fixedTokenAmount = getFixedTokenAmount(
          transaction.amount || transaction.balance,
          transaction.token.decimals
        )

        return (
          <Exit
            key={transaction.id || transaction.itemId}
            amount={fixedTokenAmount}
            token={transaction.token}
            fiatAmount={transaction.historicUSD
              ? getAmountInPreferredCurrency(
                  transaction.historicUSD,
                  preferredCurrency,
                  fiatExchangeRates
                )
              : getTokenAmountInPreferredCurrency(
                fixedTokenAmount,
                transaction.token.USD,
                preferredCurrency,
                fiatExchangeRates
              )}
            fiatAmountUSD={transaction.historicUSD || getTokenAmountInPreferredCurrency(
              fixedTokenAmount,
              transaction.token.USD,
              CurrencySymbol.USD.code,
              fiatExchangeRates
            )}
            preferredCurrency={preferredCurrency}
            merkleProof={transaction.merkleProof}
            batchNum={transaction.batchNum}
            accountIndex={transaction.accountIndex}
            pendingWithdraws={pendingWithdraws}
            pendingDelayedWithdraws={pendingDelayedWithdraws}
            onAddPendingDelayedWithdraw={onAddPendingDelayedWithdraw}
            onRemovePendingDelayedWithdraw={onRemovePendingDelayedWithdraw}
            coordinatorState={coordinatorState}
            redirectTo={redirectTo}
          />
        )
      })}
    </>
  )
}

ExitList.propTypes = {
  transactions: PropTypes.array,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object,
  pendingWithdraws: PropTypes.array,
  pendingDelayedWithdraws: PropTypes.array,
  coordinatorState: PropTypes.object,
  onAddPendingDelayedWithdraw: PropTypes.func.isRequired,
  onRemovePendingDelayedWithdraw: PropTypes.func.isRequired
}

export default ExitList
