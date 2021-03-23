import React from 'react'

import useChainIdErrorStyles from './chain-id-error.styles'
import { ReactComponent as SwitchNetworkIcon } from '../../../../images/icons/switch-network.svg'

function ChainIdError ({ supportedEnvironments }) {
  const classes = useChainIdErrorStyles()

  return (
    <div className={classes.root}>
      <SwitchNetworkIcon className={classes.image} />
      <h1 className={classes.errorTitle}>Switch network</h1>
      <p className={classes.errorDescription}>
        Select the Mainnet or Rinkeby network in your Metamask wallet to connect your Hermez wallet.
      </p>
    </div>
  )
}

export default ChainIdError
