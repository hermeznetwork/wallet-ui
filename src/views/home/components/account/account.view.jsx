import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import useAccountStyles from './account.styles'

function Account ({ tokenId, amount, tokenSymbol, fiatRate, preferredCurrency }) {
  const classes = useAccountStyles()
  const priceInFiat = amount * fiatRate

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
          fiatRate
            ? (
              <h4 className={classes.preferredCurrency}>
                {priceInFiat.toFixed(2)} {preferredCurrency}
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
  fiatRate: PropTypes.number,
  preferredCurrency: PropTypes.string.isRequired
}

export default Account
