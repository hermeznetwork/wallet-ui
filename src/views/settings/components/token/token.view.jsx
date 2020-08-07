import React from 'react'
import PropTypes from 'prop-types'

import useTokenStyles from './token.styles'

function Token ({ tokenSymbol, tokenName }) {
  const classes = useTokenStyles()

  return (
    <div className={classes.root}>
      <div className={classes.image} />
      <div className={classes.details}>
        <h3 className={classes.symbol}>{tokenSymbol}</h3>
        {tokenName}
      </div>
    </div>
  )
}

Token.propTypes = {
  tokenSymbol: PropTypes.string.isRequired,
  tokenName: PropTypes.string.isRequired
}

export default Token
