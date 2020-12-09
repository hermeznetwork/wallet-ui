import React from 'react'

import useWalletButtonStyles from './wallet-button.styles'
import WalletButtonLogo from '../wallet-button-logo/wallet-button-logo.view'

function WalletButton ({ walletName, isClickable, onClick }) {
  const classes = useWalletButtonStyles()

  function getButtonLabel (walletName) {
    return walletName[0].toUpperCase() + walletName.slice(1)
  }

  return (
    <div className={classes.root}>
      {
        isClickable
          ? (
            <div className={classes.walletDivContainer}>
              <WalletButtonLogo walletName={walletName} />
            </div>
          )
          : (
            <button className={classes.walletButtonContainer} onClick={onClick}>
              <WalletButtonLogo walletName={walletName} />
            </button>
          )
      }
      <p className={classes.walletName}>{getButtonLabel(walletName)}</p>
    </div>
  )
}

export default WalletButton
