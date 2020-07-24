import React from 'react'
import PropTypes from 'prop-types'

import useTotalBalanceStyles from './total-balance.styles'

function TotalBalance ({ amount }) {
  const classes = useTotalBalanceStyles()

  return (
    <div className={classes.root}>
      <h1 className={classes.amount}>{amount || '-'}</h1>
      <h2 className={classes.currency}>DAI</h2>
    </div>
  )
}

TotalBalance.propTypes = {
  amount: PropTypes.number
}

export default TotalBalance
