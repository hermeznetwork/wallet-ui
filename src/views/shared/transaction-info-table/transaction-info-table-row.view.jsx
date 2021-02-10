import React from 'react'
import PropTypes from 'prop-types'

import useTransactionInfoTableRowStyles from './transaction-info-table-row.styles'
import TransactionInfoRow from '../transaction-info-table-row/transaction-info-row.view'

function TransactionInfoTableRow ({ status, from, to, date, fee }) {
  const classes = useTransactionInfoTableRowStyles()

  return (
    <div className={classes.root}>
      {status && <TransactionInfoRow title='Status' subtitle={status.subtitle} value={status.value} />}
      {from && <TransactionInfoRow title='From' subtitle={from.subtitle} value={from.value} />}
      {to && <TransactionInfoRow title='To' subtitle={to.subtitle} value={to.value} />}
      {date && <TransactionInfoRow title='Date' subtitle={date.subtitle} value={date.value} />}
      {fee && <TransactionInfoRow title='Fee' subtitle={fee.value.fiat} value={fee.value.tokens} />}
    </div>
  )
}

TransactionInfoTableRow.propTypes = {
  status: PropTypes.object,
  from: PropTypes.object,
  to: PropTypes.object,
  date: PropTypes.object,
  fee: PropTypes.object
}

export default TransactionInfoTableRow