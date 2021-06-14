import React from 'react'
import PropTypes from 'prop-types'

import useTransactionInfoRowStyles from './transaction-info-row.styles'
import { ReactComponent as CopyIcon } from '../../../images/icons/copy.svg'

function TransactionInfoRow ({ title, subtitle, hint, value, showCopyButton, onCopySubtitle }) {
  const classes = useTransactionInfoRowStyles()

  return (
    <div className={classes.root}>
      <div className={`${classes.row} ${classes.topRow}`}>
        <p className={classes.title}>{title}</p>
        <div className={classes.subtitle}>
          {
            showCopyButton && (
              <button className={classes.copyButton} onClick={onCopySubtitle}>
                <CopyIcon className={classes.copyIcon} />
              </button>
            )
          }
          <p>{subtitle}</p>
        </div>
      </div>
      <div className={classes.row}>
        {hint ? <p className={classes.hint}>{hint}</p> : <p className={classes.hint}>&nbsp;</p>}
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
