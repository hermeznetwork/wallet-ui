import React from 'react'
import PropTypes from 'prop-types'

import Transaction from '../transaction/transaction.view'
import useTransactionListStyles from './transaction-list.styles'
import { getTokenFiatExchangeRate } from '../../../../utils/currencies'

function TransactionList ({
  transactions,
  preferredCurrency,
  usdTokenExchangeRate,
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
            tokenFiatExchangeRate={getTokenFiatExchangeRate(
              transaction.tokenSymbol,
              preferredCurrency,
              usdTokenExchangeRate,
              fiatExchangeRates
            )}
            date={new Date().toLocaleDateString()}
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
  usdTokenExchangeRate: PropTypes.object,
  fiatExchangeRates: PropTypes.object,
  onTransactionClick: PropTypes.func.isRequired
}

export default TransactionList
