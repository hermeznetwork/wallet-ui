import React from 'react'
import { Link } from 'react-router-dom'

import useHeaderStyles from './header.styles'
import logo from '../../../images/logo.svg'
import userAccountIcon from '../../../images/icons/user-account.svg'
import qrScannerIcon from '../../../images/icons/qr-scanner.svg'
import Container from '../container/container.view'

function Header () {
  const classes = useHeaderStyles()

  return (
    <header className={classes.root}>
      <Container disableVerticalGutters>
        <div className={classes.headerContent}>
          <Link to='/settings' className={classes.link}>
            <img src={userAccountIcon} alt='My account' className={classes.myAccountIcon} />
            <p className={classes.linkText}>My account</p>
          </Link>
          <h1>
            <Link
              to='/'
              className={classes.logo}
            >
              <img src={logo} alt='Hermez logo' />
            </Link>
          </h1>
          <Link to='/' className={classes.link}>
            <p className={classes.linkText}>Scan QR</p>
            <img src={qrScannerIcon} alt='QR Scanner' className={classes.qrScannerIcon} />
          </Link>
        </div>
      </Container>
    </header>
  )
}

export default Header
