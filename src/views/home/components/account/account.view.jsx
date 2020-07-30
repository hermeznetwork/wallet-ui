import React from 'react'
import PropTypes from 'prop-types'

import useAccountStyles from './account.styles'

function Account ({ amount, tokenSymbol, preferredCurrency }) {
  const classes = useAccountStyles()

  return (
    <div className={classes.root}>
      <div className={classes.image} />
      <div className={classes.details}>
        <h3 className={classes.amount}>{amount} {tokenSymbol}</h3>
        <h4 className={classes.preferredCurrency}>-- {preferredCurrency}</h4>
      </div>
    </div>
  )
}

Account.propTypes = {
  amount: PropTypes.number.isRequired,
  tokenSymbol: PropTypes.string.isRequired,
  preferredCurrency: PropTypes.string.isRequired
}

export default Account
