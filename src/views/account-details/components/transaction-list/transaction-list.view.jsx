import React from 'react'
import PropTypes from 'prop-types'
import { TxState } from '@hermeznetwork/hermezjs/src/tx-utils'

import Transaction from '../transaction/transaction.view'
import useTransactionListStyles from './transaction-list.styles'
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../../../utils/currencies'

function TransactionList ({
  accountIndex,
  transactions,
  preferredCurrency,
  fiatExchangeRates,
  onTransactionClick
}) {
  const classes = useTransactionListStyles()

  /**
   * Bubbles up the onClick event when a transaction is clicked
   * @param {Object} transaction - The transaction clicked
   */
  function handleTransactionClick (transaction) {
    onTransactionClick(transaction)
  }

  return (
    <>
      {transactions.map((transaction) => {
        const fixedTokenAmount = getFixedTokenAmount(
          transaction.L1Info?.depositAmount || transaction.amount,
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
              accountIndex={accountIndex}
              fromAccountIndex={transaction.fromAccountIndex}
              amount={fixedTokenAmount}
              tokenSymbol={transaction.token.symbol}
              fiatAmount={getTokenAmountInPreferredCurrency(
                fixedTokenAmount,
                transaction.historicUSD || transaction.token.USD,
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
