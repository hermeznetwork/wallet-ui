import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import Transaction from '../transaction/transaction.view'
import useTransactionListStyles from './transaction-list.styles'

function TransactionList ({ transactions, tokens }) {
  const classes = useTransactionListStyles()

  function getToken (tokenId) {
    return tokens.find((token) => token.TokenID === tokenId)
  }

  return (
    <div>
      {transactions.map((transaction, index) =>
        <div
          key={transaction.ID}
          className={clsx({ [classes.transaction]: index > 0 })}
        >
          <Transaction
            type={transaction.Type}
            amount={transaction.Amount}
            currency={getToken(transaction.TokenID).Symbol}
            date={new Date().toLocaleString()}
          />
        </div>
      )}
    </div>
  )
}

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      ID: PropTypes.string.isRequired,
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
  )
}

export default TransactionList
