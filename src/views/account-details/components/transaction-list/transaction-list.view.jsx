import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import Transaction from '../transaction/transaction.view'
import useTransactionListStyles from './transaction-list.styles'

function TransactionList ({ transactions, tokens, onTransactionClick }) {
  const classes = useTransactionListStyles()

  function getToken (tokenId) {
    return tokens.find((token) => token.tokenId === tokenId)
  }

  function handleTransactionClick (transactionId) {
    onTransactionClick(transactionId)
  }

  return (
    <div>
      {transactions.map((transaction, index) =>
        <div
          key={transaction.txId}
          className={clsx({
            [classes.transaction]: true,
            [classes.transactionSpacer]: index > 0
          })}
        >
          <Transaction
            id={transaction.txId}
            type={transaction.type}
            amount={transaction.amount}
            currency={getToken(transaction.tokenId).symbol}
            date={new Date().toLocaleString()}
            onClick={handleTransactionClick}
          />
        </div>
      )}
    </div>
  )
}

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      txId: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      tokenId: PropTypes.number.isRequired
    })
  ),
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      tokenId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired
    })
  ),
  onTransactionClick: PropTypes.func.isRequired
}

export default TransactionList
