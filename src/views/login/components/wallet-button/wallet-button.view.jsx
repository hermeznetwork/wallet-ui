import React from 'react'

import useWalletButtonStyles from './wallet-button.styles'
import WalletButtonLogo from '../wallet-button-logo/wallet-button-logo.view'

function WalletButton ({ walletName, hideName, isClickable, onClick }) {
  const classes = useWalletButtonStyles()

  function getButtonLabel (walletName) {
    return walletName[0].toUpperCase() + walletName.slice(1)
  }

  return (
    <div className={classes.root}>
      {
        isClickable
          ? (
            <button className={classes.walletButtonContainer} onClick={onClick}>
              <WalletButtonLogo walletName={walletName} />
            </button>
          ) : (
            <div className={classes.walletDivContainer}>
              <WalletButtonLogo walletName={walletName} />
            </div>
          )
      }
      {!hideName && <p className={classes.walletName}>{getButtonLabel(walletName)}</p>}
    </div>
  )
}

export default WalletButton
