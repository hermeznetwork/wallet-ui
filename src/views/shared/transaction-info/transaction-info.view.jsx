import React from 'react'
import PropTypes from 'prop-types'

import useTransactionInfoStyles from './transaction-info.styles'
import TransactionInfoRow from '../transaction-info-row/transaction-info-row.view'

function TransactionInfo ({ status, from, to, date, fee }) {
  const classes = useTransactionInfoStyles()
  console.log(to.subtitle)
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

TransactionInfo.propTypes = {
  status: PropTypes.string,
  from: PropTypes.string.isRequired,
  to: PropTypes.string,
  date: PropTypes.string,
  fee: PropTypes.object
}

export default TransactionInfo
