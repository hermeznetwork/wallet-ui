import React from 'react'
import PropTypes from 'prop-types'

import useTransactionInfoRowStyles from './transaction-info-row.styles'

function TransactionInfoRow ({ title, subtitle, value }) {
  const classes = useTransactionInfoRowStyles()

  return (
    <div className={classes.root}>
      <p className={classes.title}>{title}</p>
      <div className={classes.content}>
        <p className={classes.subtitle}>{subtitle}</p>
        {value ? <p className={classes.value}>{value}</p> : <p className={classes.value}>&nbsp;</p>}
      </div>
    </div>
  )
}

TransactionInfoRow.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  value: PropTypes.string
}

export default TransactionInfoRow
