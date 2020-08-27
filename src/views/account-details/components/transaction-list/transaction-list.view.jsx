import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import Transaction from '../transaction/transaction.view'
import useTransactionListStyles from './transaction-list.styles'

function TransactionList ({ transactions, tokens, onTransactionClick }) {
  const classes = useTransactionListStyles()

  function getToken (tokenId) {
    return tokens.find((token) => token.TokenID === tokenId)
  }

  function handleTransactionClick (transactionId) {
    onTransactionClick(transactionId)
  }

  return (
    <div>
      {transactions.map((transaction, index) =>
        <div
          key={transaction.TxID}
          className={clsx({
            [classes.transaction]: true,
            [classes.transactionSpacer]: index > 0
          })}
        >
          <Transaction
            id={transaction.TxID}
            type={transaction.Type}
            amount={transaction.Amount}
            currency={getToken(transaction.TokenID).Symbol}
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
      TxID: PropTypes.string.isRequired,
      Type: PropTypes.string.isRequired,
      Amount: PropTypes.number.isRequired,
      TokenID: PropTypes.number.isRequired
    })
  ),
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      TokenID: PropTypes.number.isRequired,
      Name: PropTypes.string.isRequired,
      Symbol: PropTypes.string.isRequired
    })
  ),
  onTransactionClick: PropTypes.func.isRequired
}

export default TransactionList
