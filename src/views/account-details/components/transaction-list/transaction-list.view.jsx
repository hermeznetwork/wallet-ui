import React from 'react'
import PropTypes from 'prop-types'

import Transaction from '../transaction/transaction.view'
import useTransactionListStyles from './transaction-list.styles'
import { getTokenAmountInPreferredCurrency } from '../../../../utils/currencies'
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
      {transactions.map((transaction, index) =>
        <div
          key={transaction.id}
          className={classes.transaction}
        >
          <Transaction
            id={transaction.id}
            type={transaction.type}
            amount={transaction.amount}
            tokenSymbol={transaction.tokenSymbol}
            fiatAmount={getTokenAmountInPreferredCurrency(
              transaction.tokenSymbol,
              preferredCurrency,
              transaction.historicUSD || (transaction.amount * transaction.USD),
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
