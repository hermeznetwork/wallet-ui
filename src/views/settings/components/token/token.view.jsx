import React from 'react'
import PropTypes from 'prop-types'

import useTokenStyles from './token.styles'

function Token ({ tokenSymbol, tokenName, tokenId, handleTokenSelection }) {
  const classes = useTokenStyles()

  return (
    <div
      className={classes.root}
      onClick={() => handleTokenSelection(tokenId)}
    >
      <div className={classes.image} />
      <div className={classes.details}>
        <h3 className={classes.symbol}>{tokenSymbol}</h3>
        {tokenName}
      </div>
    </div>
  )
}

Token.propTypes = {
  tokenId: PropTypes.number.isRequired,
  tokenSymbol: PropTypes.string.isRequired,
  tokenName: PropTypes.string.isRequired,
  handleTokenSelection: PropTypes.func.isRequired
}

export default Token
