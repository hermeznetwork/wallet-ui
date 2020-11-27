import React from 'react'
import PropTypes from 'prop-types'

import Exit from '../exit/exit.view'
import { CurrencySymbol, getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../../utils/currencies'

function ExitList ({
  transactions,
  preferredCurrency,
  fiatExchangeRates,
  pendingWithdraws,
  pendingDelayedWithdraws,
  coordinatorState,
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
            fiatAmount={getTokenAmountInPreferredCurrency(
              fixedTokenAmount,
              transaction.historicUSD || transaction.token.USD,
              preferredCurrency,
              fiatExchangeRates
            )}
            fiatAmountUSD={getTokenAmountInPreferredCurrency(
              fixedTokenAmount,
              transaction.historicUSD || transaction.token.USD,
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
