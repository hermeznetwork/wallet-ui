import React from 'react'
import PropTypes from 'prop-types'

import Transaction from '../transaction/transaction.view'
import useTransactionListStyles from './transaction-list.styles'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../../../utils/currencies'
import { TxState } from '../../../../utils/tx'

function TransactionList ({
  transactions,
  preferredCurrency,
  fiatExchangeRates,
  onTransactionClick
}) {
  const classes = useTransactionListStyles()

  function handleTransactionClick (transaction) {
    onTransactionClick(transaction)
  }

  return (
    <>
      {transactions.map((transaction, index) => {
        const fixedTokenAmount = getFixedTokenAmount(
          transaction.amount,
          transaction.token.decimals
        )

        return (
          <div
            key={transaction.id}
            className={classes.transaction}
          >
            <Transaction
              id={transaction.id}
              type={transaction.type}
              amount={fixedTokenAmount}
              tokenSymbol={transaction.token.symbol}
              fiatAmount={getTokenAmountInPreferredCurrency(
                fixedTokenAmount,
                transaction.historicUSD || transaction.USD,
                preferredCurrency,
                fiatExchangeRates
              )}
              timestamp={
                transaction.state === TxState.Pending
                  ? undefined
                  : transaction.timestamp
              }
              preferredCurrency={preferredCurrency}
              onClick={() => handleTransactionClick(transaction)}
            />
          </div>
        )
      }
      )}
    </>
  )
}

TransactionList.propTypes = {
  transactions: PropTypes.array,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object,
  onTransactionClick: PropTypes.func.isRequired
}

export default TransactionList
