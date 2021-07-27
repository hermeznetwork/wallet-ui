import React from 'react'

import usePrivateLayoutStyles from './private-layout.styles'

function PrivateLayout ({ children }) {
  const classes = usePrivateLayoutStyles()

  return (
    <div className={classes.root}>
      <main className={classes.main}>{children}</main>
    </div>
  )
}

export default PrivateLayout
