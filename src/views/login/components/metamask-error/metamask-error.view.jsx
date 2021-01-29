import React from 'react'

import useMetaMaskErrorStyles from './metamask-error.styles'
import { WalletName } from '../../login.view'
import WalletButton from '../wallet-button/wallet-button.view'

function MetaMaskError () {
  const classes = useMetaMaskErrorStyles()

  return (
    <div className={classes.root}>
      <h1 className={classes.errorTitle}>Install MetaMask to continue</h1>
      <WalletButton walletName={WalletName.METAMASK} hideName />
      <a
        href='https://metamask.io/download.html'
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
