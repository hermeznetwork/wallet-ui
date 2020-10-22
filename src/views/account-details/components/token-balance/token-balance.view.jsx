import React from 'react'
import PropTypes from 'prop-types'

import useTokenBalanceStyles from './token-balance.styles'

function TokenBalance ({ amount, symbol }) {
  const classes = useTokenBalanceStyles()

  return (
    <p className={classes.root}>
      {amount || '--'} {symbol || <></>}
    </p>
  )
}

TokenBalance.propTypes = {
  amount: PropTypes.string,
  symbol: PropTypes.string
}

export default TokenBalance
