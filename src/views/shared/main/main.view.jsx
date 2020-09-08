import React from 'react'
import useMainStyles from './main.styles'

function Main ({ children }) {
  const classes = useMainStyles()

  return <main className={classes.main}>{children}</main>
}

export default Main
