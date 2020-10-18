import React from 'react'
import PropTypes from 'prop-types'

import useTransactionInfoRowStyles from './transaction-info-row.styles'

function TransactionInfoRow ({ title, subtitle, value }) {
  const classes = useTransactionInfoRowStyles()

  return (
    <div className={classes.root}>
      <p className={classes.title}>{title}</p>
      <div className={classes.content}>
        {(() => {
          if (subtitle === undefined && value !== undefined) {
            return (
              <>
                <p className={classes.subtitle}>{value}</p>
                <p className={classes.value}>&nbsp;</p>
              </>
            )
          }

          if (subtitle !== undefined && value !== undefined) {
            return (
              <>
                <p className={classes.subtitle}>{subtitle}</p>
                <p className={classes.value}>{value}</p>
              </>
            )
          }

          return <></>
        })()}
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
