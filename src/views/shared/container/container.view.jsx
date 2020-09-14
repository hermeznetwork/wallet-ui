import React from 'react'

import useContainerStyles from './container.styles'
import PropTypes from 'prop-types'

function Container ({ backgroundColor, disableVerticalGutters, disableTopGutter, children }) {
  const classes = useContainerStyles({ disableVerticalGutters, disableTopGutter, backgroundColor })

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
  disableVerticalGutters: PropTypes.bool,
  disableTopGutter: PropTypes.bool
}

export default Container
