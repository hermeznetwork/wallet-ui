import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Container from '../container/container.view'
import useSnackbarStyles from './snackbar.styles'
import { SNACKBAR_AUTO_HIDE_DURATION } from '../../../constants'

function Snackbar ({ message, onClose }) {
  const classes = useSnackbarStyles()
  const [closingTimeoutId, setClosingTimeoutId] = useState()

  React.useEffect(() => {
    setClosingTimeoutId(
      setTimeout(onClose, SNACKBAR_AUTO_HIDE_DURATION)
    )

    return () => {
      clearTimeout(closingTimeoutId)
    }
  }, [onClose])

  return (
    <div className={classes.root}>
      <Container disableVerticalGutters>
        <div className={classes.wrapper}>
          <p className={classes.message}>{message}</p>
        </div>
      </Container>
    </div>
  )
}

Snackbar.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func
}

export default Snackbar
