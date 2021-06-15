import React from 'react'

import useWalletButtonListStyles from './wallet-button-list.styles'
import WalletButton from '../wallet-button/wallet-button.view'
import { WalletName } from '../../login.view'

function WalletButtonList ({ onClick }) {
  const classes = useWalletButtonListStyles()

  return (
    <div className={classes.root}>
      {window.ethereum && (
        <div className={classes.walletButtonContainer}>
          <WalletButton
            isClickable
            walletName={WalletName.METAMASK}
            onClick={() => onClick(WalletName.METAMASK)}
          />
        </div>
      )}
      <div className={classes.walletButtonContainer}>
        <WalletButton
          isClickable
          walletName={WalletName.WALLET_CONNECT}
          onClick={() => onClick(WalletName.WALLET_CONNECT)}
        />
      </div>
      {
        process.env.REACT_APP_ENABLE_HARDWARE_WALLETS === 'true'
          ? (
            <>
              <div className={classes.walletButtonContainer}>
                <WalletButton
                  isClickable
                  walletName={WalletName.LEDGER}
                  onClick={() => onClick(WalletName.LEDGER)}
                />
              </div>
              <div className={classes.walletButtonContainer}>
                <WalletButton
                  isClickable
                  walletName={WalletName.TREZOR}
                  onClick={() => onClick(WalletName.TREZOR)}
                />
              </div>
            </>
            )
          : <></>
      }
    </div>
  )
}

export default WalletButtonList
