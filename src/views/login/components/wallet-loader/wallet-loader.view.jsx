import React from 'react'
import WalletButton from '../wallet-button/wallet-button.view'

import useWalletLoaderStyles from './wallet-loader.styles'

function WalletLoader ({ walletName, onLoadWallet }) {
  const classes = useWalletLoaderStyles()

  React.useEffect(() => {
    onLoadWallet()
  }, [onLoadWallet])

  return (
    <div>
      <WalletButton
        walletName={walletName}
        hideName
        isClickable={false}
      />
      <p className={classes.followInstructionsText}>
        Follow the instructions in the pop up.
      </p>
    </div>
  )
}

export default WalletLoader
