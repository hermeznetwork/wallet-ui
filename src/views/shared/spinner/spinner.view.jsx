import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from 'react-jss'

import useSpinnerStyles from './spinner.styles'

const SIZE = 44
const THICKNESS = 6

function Spinner ({ size }) {
  const theme = useTheme()
  const classes = useSpinnerStyles({ size: size !== undefined ? size : theme.spacing(6) })

  return (
    <svg
      className={classes.root}
      viewBox={`${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`}
    >
      <circle
        className={classes.bottomCircle}
        cx={SIZE}
        cy={SIZE}
        r={(SIZE - THICKNESS) / 2}
        fill='none'
        strokeWidth={THICKNESS}
      />
      <circle
        className={classes.topCircle}
        cx={SIZE}
        cy={SIZE}
        r={(SIZE - THICKNESS) / 2}
        fill='none'
        strokeWidth={THICKNESS}
      />
    </svg>
  )
}

Spinner.propTypes = {
  size: PropTypes.number
}

export default Spinner
