import React from 'react'
import { Link } from 'react-router-dom'

import useMainHeaderStyles from './main-header.styles'
import hermezLogo from '../../../images/hermez-logo.svg'
import { ReactComponent as UserAccountIcon } from '../../../images/icons/user-account.svg'
// import qrCodeIcon from '../../../images/icons/qr-code.svg'
import Container from '../container/container.view'

function MainHeader () {
  const classes = useMainHeaderStyles()

  return (
    <header className={classes.root}>
      <Container disableVerticalGutters>
        <Link to='/settings' className={`${classes.link} ${classes.settingsLink}`}>
          <UserAccountIcon className={classes.settingsIcon} />
          <p className={classes.linkText}>Settings</p>
        </Link>
        <div className={classes.headerContent}>
          <h1>
            <Link
              to='/'
              className={classes.logo}
            >
              <img src={hermezLogo} alt='Hermez logo' />
            </Link>
          </h1>
        </div>
        {/* <Link to='/my-address' className={`${classes.link} ${classes.addressLink}`}>
          <p className={classes.linkText}>My address</p>
          <img src={qrCodeIcon} alt='Settings' className={classes.addressIcon} />
        </Link> */}
      </Container>
    </header>
  )
}

export default MainHeader
