import React from 'react'

import useTransactionButtonStyles from './transaction-button.styles'

function TransactionButton ({ label, type, disabled }) {
  const classes = useTransactionButtonStyles()

  return (
    <button
      className={classes.root}
      type={type || 'button'}
      disabled={disabled || false}
    >
      {label}
    </button>
  )
}

export default TransactionButton
