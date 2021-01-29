import React from 'react'

import useWalletButtonStyles from './wallet-button.styles'
import WalletButtonLogo from '../wallet-button-logo/wallet-button-logo.view'

function WalletButton ({ walletName, hideName, onClick }) {
  const classes = useWalletButtonStyles()
  const isClickable = onClick !== undefined
  const Component = isClickable ? 'button' : 'div'

  function getButtonLabel (walletName) {
    return walletName[0].toUpperCase() + walletName.slice(1)
  }

  return (
    <div className={classes.root}>
      {
        <Component
          className={isClickable ? classes.walletButtonContainer : classes.walletDivContainer}
          onClick={onClick}
        >
          <WalletButtonLogo walletName={walletName} />
        </Component>
      }
      {!hideName && <p className={classes.walletName}>{getButtonLabel(walletName)}</p>}
    </div>
  )
}

export default WalletButton
