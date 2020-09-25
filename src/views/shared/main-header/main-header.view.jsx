import React from 'react'
import { Link } from 'react-router-dom'

import useMainHeaderStyles from './main-header.styles'
import logo from '../../../images/logo.svg'
import userAccountIcon from '../../../images/icons/user-account.svg'
import Container from '../container/container.view'

function MainHeader () {
  const classes = useMainHeaderStyles()

  return (
    <header className={classes.root}>
      <Container disableVerticalGutters>
        <Link to='/settings' className={classes.link}>
          <img src={userAccountIcon} alt='Settings' className={classes.myAccountIcon} />
          <p className={classes.linkText}>Settings</p>
        </Link>
        <div className={classes.headerContent}>
          <h1>
            <Link
              to='/'
              className={classes.logo}
            >
              <img src={logo} alt='Hermez logo' />
            </Link>
          </h1>
        </div>
      </Container>
    </header>
  )
}

export default MainHeader
