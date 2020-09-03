import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import useAccountStyles from './account.styles'

function Account ({ tokenId, amount, tokenSymbol, tokenPrice, preferredCurrency }) {
  const classes = useAccountStyles()
  const priceInFiat = amount * tokenPrice

  return (
    <Link
      to={`/accounts/${tokenId}`}
      className={classes.root}
    >
      <div className={classes.image} />
      <div className={classes.details}>
        {
          tokenSymbol
            ? <h3 className={classes.amount}>{amount} {tokenSymbol}</h3>
            : <></>
        }
        {
          tokenPrice
            ? (
              <h4 className={classes.preferredCurrency}>
                {priceInFiat} {preferredCurrency}
              </h4>
            )
            : <></>
        }
      </div>
    </Link>
  )
}

Account.propTypes = {
  tokenId: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  tokenSymbol: PropTypes.string,
  tokenPrice: PropTypes.number,
  preferredCurrency: PropTypes.string.isRequired
}

export default Account
