import React from 'react'
import { NavLink } from 'react-router-dom'

import useHeaderStyles from './header.styles'
import routes from '../../../routing/routes'

function Header () {
  const classes = useHeaderStyles()

  return (
    <header>
      <h1>Hermez</h1>
      <nav>
        <ul className={classes.navbar}>
          {routes.map(route =>
            <li key={route.path} className={classes.navbarItem}>
              <NavLink
                exact
                to={route.path}
                className={classes.navbarLink}
                activeClassName={classes.activeNavbarLink}
              >
                {route.label}
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header
