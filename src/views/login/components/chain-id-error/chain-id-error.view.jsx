import React from 'react'

import useChainIdErrorStyles from './chain-id-error.styles'

function ChainIdError ({ supportedEnvironments }) {
  const classes = useChainIdErrorStyles()
  const supportedEnvironmentNames = supportedEnvironments
    .map((ethereumNetwork) => ethereumNetwork.name)
    .join(', ')

  return (
    <div className={classes.root}>
      <h1 className={classes.errorTitle}>Switch network</h1>
      <p className={classes.errorDescription}>Switch your wallet's network to one of these networks: {supportedEnvironmentNames} and connect your wallet again.</p>
    </div>
  )
}

export default ChainIdError
