import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import RecentTransaction from '../recent-transaction/recent-transaction.view'
import useRecentTransactionListStyles from './recent-transaction-list.styles'

function RecentTransactionList ({ transactions }) {
  const classes = useRecentTransactionListStyles()

  return (
    <div>
      {transactions.map((transaction, index) =>
        <div
          key={transaction.ID}
          className={clsx({ [classes.recentTransaction]: index > 0 })}
        >
          <RecentTransaction
            type={transaction.Type}
            amount={transaction.Amount}
            currency={transaction.Token.Symbol}
            date={new Date().toLocaleString()}
          />
        </div>
      )}
    </div>
  )
}

RecentTransactionList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      ID: PropTypes.string.isRequired,
      Type: PropTypes.string.isRequired,
      Amount: PropTypes.number.isRequired,
      Token: PropTypes.shape({
        ID: PropTypes.number.isRequired,
        Symbol: PropTypes.string.isRequired
      })
    })
  )
}

export default RecentTransactionList
