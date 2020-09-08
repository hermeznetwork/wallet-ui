import React from 'react'
import { Link } from 'react-router-dom'

import useHeaderStyles from './header.styles'

function Header () {
  const classes = useHeaderStyles()

  return (
    <header className={classes.root}>
      <div class={classes.headerContent}>
        <h1>
          <Link
            to='/'
            className={classes.logo}
          >
            Hermez
          </Link>
        </h1>
        <Link to='/settings'>Settings</Link>
      </div>
    </header>
  )
}

export default Header
