import React from 'react'
import PropTypes from 'prop-types'

import useSpinnerStyles from './spinner.styles'

const SIZE = 44
const THICKNESS = 6

function Spinner ({ size }) {
  const classes = useSpinnerStyles({ size })

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
  size: PropTypes.number.isRequired
}

export default Spinner
