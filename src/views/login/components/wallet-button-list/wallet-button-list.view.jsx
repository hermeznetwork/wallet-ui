import React from 'react'

import useWalletButtonListStyles from './wallet-button-list.styles'
import WalletButton from '../wallet-button/wallet-button.view'

function WalletButtonList ({ onClick }) {
  const classes = useWalletButtonListStyles()

  return (
    <div className={classes.root}>
      <div className={classes.walletButtonContainer}>
        <WalletButton
          isClickable
          walletName='metaMask'
          onClick={() => onClick('metaMask')}
        />
      </div>
    </div>
  )
}

export default WalletButtonList
