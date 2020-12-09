import React from 'react'

import useWalletButtonStyles from './wallet-button-logo.styles'
import { ReactComponent as MetaMaskLogo } from '../../../../images/wallet-logos/metamask.svg'
import { ReactComponent as LedgerLogo } from '../../../../images/wallet-logos/ledger.svg'
import { ReactComponent as TrezorLogo } from '../../../../images/wallet-logos/trezor.svg'

function WalletButtonLogo ({ walletName }) {
  const classes = useWalletButtonStyles()

  switch (walletName) {
    case 'metaMask': {
      return <MetaMaskLogo className={classes.root} />
    }
    case 'ledger': {
      return <LedgerLogo className={classes.root} />
    }
    case 'trezor': {
      return <TrezorLogo className={classes.root} />
    }
    default: {
      return <></>
    }
  }
}

export default WalletButtonLogo
