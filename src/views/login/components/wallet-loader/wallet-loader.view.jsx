import React from 'react'
import WalletButton from '../wallet-button/wallet-button.view'

import useWalletLoaderStyles from './wallet-loader.styles'

function WalletLoader ({
  walletName,
  accountData,
  walletTask,
  onLoadWallet,
  onLoadWalletSuccess
}) {
  const classes = useWalletLoaderStyles()

  React.useEffect(() => {
    if (walletTask.status === 'pending') {
      onLoadWallet(walletName, accountData)
    }
  }, [walletName, accountData, walletTask, onLoadWallet])

  React.useEffect(() => {
    if (walletTask.status === 'successful') {
      onLoadWalletSuccess()
    }
  }, [walletTask, onLoadWalletSuccess])

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
