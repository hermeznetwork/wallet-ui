import React from 'react'
import PropTypes from 'prop-types'

import Account from '../account/account.view'

function AccountList ({ accounts }) {
  return (
    <div>
      {accounts.map(account =>
        <div key={account.coin.id}>
          <Account
            amount={account.amount}
            abbreviation={account.coin.abbreviation}
          />
        </div>
      )}
    </div>
  )
}

AccountList.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      coin: PropTypes.shape({
        id: PropTypes.number.isRequired,
        abbreviation: PropTypes.string.isRequired
      })
    })
  )
}

export default AccountList
