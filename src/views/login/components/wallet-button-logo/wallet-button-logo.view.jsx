import React from 'react'

import useWalletButtonStyles from './wallet-button-logo.styles'
import { ReactComponent as MetaMaskLogo } from '../../../../images/wallet-logos/metamask.svg'
import { ReactComponent as LedgerLogo } from '../../../../images/wallet-logos/ledger.svg'
import { ReactComponent as TrezorLogo } from '../../../../images/wallet-logos/trezor.svg'
import { ReactComponent as WalletConnectLogo } from '../../../../images/wallet-logos/walletconnect.svg'
import { WalletName } from '../../login.view'

function WalletButtonLogo ({ walletName }) {
  const classes = useWalletButtonStyles()

  switch (walletName) {
    case WalletName.METAMASK: {
      return <MetaMaskLogo className={classes.root} />
    }
    case WalletName.LEDGER: {
      return <LedgerLogo className={classes.root} />
    }
    case WalletName.TREZOR: {
      return <TrezorLogo className={classes.root} />
    }
    case WalletName.WALLET_CONNECT: {
      return <WalletConnectLogo className={classes.root} />
    }
    default: {
      return <></>
    }
  }
}

export default WalletButtonLogo
