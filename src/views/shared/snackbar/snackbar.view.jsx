import React from 'react'
import PropTypes from 'prop-types'

import Container from '../container/container.view'
import useSnackbarStyles from './snackbar.styles'
import { SNACKBAR_AUTO_HIDE_DURATION } from '../../../constants'

function Snackbar ({ show, message, onClose }) {
  const classes = useSnackbarStyles()

  React.useEffect(() => {
    if (show) {
      setTimeout(() => {
        onClose()
      }, SNACKBAR_AUTO_HIDE_DURATION)
    }
  }, [show, onClose])

  return show
    ? (
      <div className={classes.root}>
        <Container disableVerticalGutters>
          <div className={classes.wrapper}>
            <p className={classes.message}>{message}</p>
          </div>
        </Container>
      </div>
    )
    : <></>
}

Snackbar.propTypes = {
  show: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func
}

export default Snackbar
