import React from 'react'
import PropTypes from 'prop-types'

import useAccountStyles from './account.styles'

function Account ({ amount, abbreviation }) {
  const classes = useAccountStyles()

  return (
    <div className={classes.root}>
      <div className={classes.image} />
      <div className={classes.details}>
        <h3 className={classes.baseCurrency}>{amount} {abbreviation}</h3>
        <h4 className={classes.fiatCurrency}>-- USD</h4>
      </div>
    </div>
  )
}

Account.propTypes = {
  amount: PropTypes.number.isRequired,
  abbreviation: PropTypes.string.isRequired
}

export default Account
