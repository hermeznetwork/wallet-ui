import React from 'react'

import useWalletButtonListStyles from './wallet-button-list.styles'
import WalletButton from '../wallet-button/wallet-button.view'
import { WalletName } from '../../login.view'

function WalletButtonList ({ onClick }) {
  const classes = useWalletButtonListStyles()

  return (
    <div className={classes.root}>
      <div className={classes.walletButtonContainer}>
        <WalletButton
          isClickable
          walletName={WalletName.METAMASK}
          onClick={() => onClick(WalletName.METAMASK)}
        />
        <WalletButton
          isClickable
          walletName={WalletName.LEDGER}
          onClick={() => onClick(WalletName.LEDGER)}
        />
        <WalletButton
          isClickable
          walletName={WalletName.TREZOR}
          onClick={() => onClick(WalletName.TREZOR)}
        />
      </div>
    </div>
  )
}

export default WalletButtonList
