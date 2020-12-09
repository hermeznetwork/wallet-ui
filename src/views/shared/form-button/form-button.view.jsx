import React from 'react'

import useFormButtonStyles from './form-button.styles'

function FormButton ({ label, type, disabled, onClick }) {
  const classes = useFormButtonStyles()

  return (
    <button
      type={type || 'button'}
      className={classes.root}
      disabled={disabled}
      {...(type !== 'submit') ? { onClick: onClick } : {}}
    >
      {label}
    </button>
  )
}

export default FormButton
