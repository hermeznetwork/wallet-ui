import React from 'react'

import useAlertStyles from './alert.styles'
import { ReactComponent as InfoIcon } from '../../../images/icons/info.svg'

function Alert ({ message, showHelpButton, onHelpClick }) {
  const classes = useAlertStyles()

  return (
    <div className={classes.root}>
      <div className={classes.messageWrapper}>
        <InfoIcon className={classes.icon} />
        <p className={classes.message}>
          {message}
        </p>
      </div>
      {showHelpButton && (
        <button className={classes.helpButton} onClick={onHelpClick}>
          More info
        </button>
      )}
    </div>
  )
}

export default Alert
