import React from 'react'
import PropTypes from 'prop-types'

import Exit from '../exit/exit.view'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../../utils/currencies'

function ExitList ({
  transactions,
  preferredCurrency,
  fiatExchangeRates,
  pendingWithdraws
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
            preferredCurrency={preferredCurrency}
            merkleProof={transaction.merkleProof}
            batchNum={transaction.batchNum}
            accountIndex={transaction.accountIndex}
            pendingWithdraws={pendingWithdraws}
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
  pendingWithdraws: PropTypes.array
}

export default ExitList
