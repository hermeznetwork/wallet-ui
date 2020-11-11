import React from 'react'
import PropTypes from 'prop-types'

import useTransactionInfoStyles from './transaction-info.styles'
import TransactionInfoRow from '../transaction-info-row/transaction-info-row.view'

function TransactionInfo ({ status, from, to, date, fee }) {
  const classes = useTransactionInfoStyles()

  return (
    <div className={classes.root}>
      {status && <TransactionInfoRow title='Status' value={status} />}
      <TransactionInfoRow title='From' subtitle='My Ethereum address' value={from} />
      {to && <TransactionInfoRow title='To' subtitle='To Ethereum address' value={to} />}
      {date && <TransactionInfoRow title='Date' value={date} />}
      {fee && <TransactionInfoRow title='Fee' subtitle={fee.fiat} value={fee.tokens} />}
    </div>
  )
}

TransactionInfo.propTypes = {
  status: PropTypes.string,
  from: PropTypes.string.isRequired,
  to: PropTypes.string,
  date: PropTypes.string,
  fee: PropTypes.object
}

export default TransactionInfo
