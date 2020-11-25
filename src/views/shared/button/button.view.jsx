import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import useButtonStyles from './button.styles'

function Button ({ Icon, text, className, onClick }) {
  const classes = useButtonStyles()

  return (
    <button
      onClick={onClick} className={clsx({
        [classes.root]: true,
        [className]: className
      })}
    >
      {Icon || <></>}
      <p className={clsx({ [classes.textSpacer]: Icon !== undefined })}>
        {text}
      </p>
    </button>
  )
}

Button.propTypes = {
  Icon: PropTypes.element,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Button
