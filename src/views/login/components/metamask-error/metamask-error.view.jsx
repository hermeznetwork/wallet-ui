import React from 'react'

import useMetaMaskErrorStyles from './metamask-error.styles'
import { WalletName } from '../../login.view'
import WalletButton from '../wallet-button/wallet-button.view'
import { isAndroidDevice, isiOsDevice, isMobileDevice } from '../../../../utils/browser'

function MetaMaskError () {
  const classes = useMetaMaskErrorStyles()

  function getMetaMaskDownloadLink () {
    if (isAndroidDevice()) {
      return 'https://play.google.com/store/apps/details?id=io.metamask'
    }
    if (isiOsDevice()) {
      return 'itms-apps://itunes.apple.com/app/id1438144202'
    }

    return 'https://metamask.io/download.html'
  }

  return (
    <div className={classes.root}>
      <h1 className={classes.errorTitle}>
        {
          isMobileDevice()
            ? 'Install MetaMask app and access through the MetaMask browser'
            : 'Install MetaMask to continue'
        }
      </h1>
      <WalletButton walletName={WalletName.METAMASK} hideName />
      <a
        href={getMetaMaskDownloadLink()}
        target='_blank'
        rel='noopener noreferrer'
        className={classes.href}
      >
        Install MetaMask
      </a>
    </div>
  )
}

export default MetaMaskError
