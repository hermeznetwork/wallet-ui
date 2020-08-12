import React from 'react'
import { Link } from 'react-router-dom'

import useHeaderStyles from './header.styles'

function Header () {
  const classes = useHeaderStyles()

  return (
    <header>
      <h1>
        <Link
          to='/'
          className={classes.logo}
        >
          Hermez
        </Link>
      </h1>
    </header>
  )
}

export default Header
