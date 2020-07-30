import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import Account from '../account/account.view'
import useAccountListStyles from './account-list.styles'

function AccountList ({ accounts, preferredCurrency }) {
  const classes = useAccountListStyles()

  return (
    <div>
      {accounts.map((account, index) =>
        <div
          key={account.Token.ID}
          className={clsx({ [classes.account]: index > 0 })}
        >
          <Account
            amount={account.Balance}
            tokenSymbol={account.Token.Symbol}
            preferredCurrency={preferredCurrency}
          />
        </div>
      )}
    </div>
  )
}

AccountList.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      EthAddr: PropTypes.string.isRequired,
      Balance: PropTypes.number.isRequired,
      Token: PropTypes.shape({
        ID: PropTypes.number.isRequired,
        Symbol: PropTypes.string.isRequired
      })
    })
  ),
  preferredCurrency: PropTypes.string.isRequired
}

export default AccountList
