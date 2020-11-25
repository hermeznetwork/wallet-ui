import React from 'react'
import { Link } from 'react-router-dom'

import useMainHeaderStyles from './main-header.styles'
import { ReactComponent as HermezLogo } from '../../../images/hermez-logo.svg'
import { ReactComponent as UserAccountIcon } from '../../../images/icons/user-account.svg'
import { ReactComponent as QRCodeIcon } from '../../../images/icons/qr-code.svg'
import Container from '../container/container.view'

function MainHeader () {
  const classes = useMainHeaderStyles()

  return (
    <header className={classes.root}>
      <Container disableVerticalGutters>
        <div className={classes.headerContent}>
          <Link to='/settings' className={`${classes.link} ${classes.settingsLink}`}>
            <UserAccountIcon className={classes.settingsIcon} />
            <p className={classes.linkText}>Settings</p>
          </Link>
          <h1>
            <Link
              to='/'
              className={classes.logo}
            >
              <HermezLogo />
            </Link>
          </h1>
          <Link to='/my-address' className={`${classes.link} ${classes.addressLink}`}>
            <p className={classes.linkText}>My address</p>
            <QRCodeIcon className={classes.addressIcon} />
          </Link>
        </div>
      </Container>
    </header>
  )
}

export default MainHeader
