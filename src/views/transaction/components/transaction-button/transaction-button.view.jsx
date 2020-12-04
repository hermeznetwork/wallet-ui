import React from 'react'

import useTransactionButtonStyles from './transaction-button.styles'

function TransactionButton ({ label, type, disabled, onClick }) {
  const classes = useTransactionButtonStyles()

  return (
    <button
      className={classes.root}
      type={type || 'button'}
      disabled={disabled || false}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default TransactionButton
