import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import useButtonStyles from './button.styles'

function Button ({ Icon, text, className, disabled, onClick }) {
  const classes = useButtonStyles({ rounded: !text })

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx({
        [classes.root]: true,
        [className]: className
      })}
    >
      {Icon || <></>}
      {text && (
        <p className={clsx({ [classes.textSpacer]: Icon !== undefined })}>
          {text}
        </p>
      )}
    </button>
  )
}

Button.propTypes = {
  Icon: PropTypes.element,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Button
