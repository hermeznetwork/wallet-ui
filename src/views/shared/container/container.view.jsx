import React from 'react'

import useContainerStyles from './container.styles'
import PropTypes from 'prop-types'

function Container ({
  backgroundColor,
  addHeaderPadding,
  disableGutters,
  disableVerticalGutters,
  disableTopGutter,
  children,
  fullHeight
}) {
  const classes = useContainerStyles({
    addHeaderPadding,
    disableGutters,
    disableVerticalGutters,
    disableTopGutter,
    backgroundColor,
    fullHeight
  })

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
  disableTopGutter: PropTypes.bool,
  fullHeight: PropTypes.bool
}

export default Container
