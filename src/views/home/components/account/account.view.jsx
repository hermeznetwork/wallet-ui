import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import useAccountStyles from './account.styles'

function Account ({ tokenId, amount, tokenSymbol, preferredCurrency }) {
  const classes = useAccountStyles()

  return (
    <Link
      to={`/accounts/${tokenId}`}
      className={classes.root}
    >
      <div className={classes.image} />
      <div className={classes.details}>
        <h3 className={classes.amount}>{amount} {tokenSymbol}</h3>
        <h4 className={classes.preferredCurrency}>-- {preferredCurrency}</h4>
      </div>
    </Link>
  )
}

Account.propTypes = {
  tokenId: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  tokenSymbol: PropTypes.string.isRequired,
  preferredCurrency: PropTypes.string.isRequired
}

export default Account
