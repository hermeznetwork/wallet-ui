import React from 'react'
import PropTypes from 'prop-types'

import Exit from '../exit/exit.view'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../../utils/currencies'

function ExitList ({
  transactions,
  preferredCurrency,
  fiatExchangeRates
}) {
  return (
    <>
      {transactions.map((transaction) => {
        const fixedTokenAmount = getFixedTokenAmount(
          transaction.amount,
          transaction.token.decimals
        )

        return (
          <Exit
            key={transaction.id}
            amount={fixedTokenAmount}
            tokenSymbol={transaction.token.symbol}
            fiatAmount={getTokenAmountInPreferredCurrency(
              fixedTokenAmount,
              transaction.historicUSD || transaction.token.USD,
              preferredCurrency,
              fiatExchangeRates
            )}
            preferredCurrency={preferredCurrency}
          />
        )
      })}
    </>
  )
}

ExitList.propTypes = {
  transactions: PropTypes.array,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object
}

export default ExitList
