import React from 'react'

import useContainerStyles from './container.styles'
import PropTypes from 'prop-types'

function Container ({ backgroundColor, className, children }) {
  const classes = useContainerStyles({ backgroundColor })

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        {children}
      </div>
    </div>
  )
}

Container.propTypes = {
  backgroundColor: PropTypes.string,
  className: PropTypes.string
}

export default Container
