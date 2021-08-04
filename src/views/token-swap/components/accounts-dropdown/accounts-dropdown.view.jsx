import React from 'react'
import PropTypes from 'prop-types'

import useAccountDropdrownStyles from './accounts-dropdown.styles'
import AccountList from '../account-list/account-list.view'
import { ReactComponent as Search } from '../../../../images/icons/search.svg'

function AccountsDropdown ({ accounts, position, onClick, onClose }) {
  const classes = useAccountDropdrownStyles()

  const onClickToken = account => {
    onClose()
    onClick({ [position]: account })
  }

  return (
    <div className={classes.dropDown}>
      <div className={classes.searchRow}>
        <div className={classes.searchBox}>
          <input
            type='text'
            className={classes.searchInput}
            placeholder='Search token'
          />
          <div className={classes.searchIcon}>
            <Search />
          </div>
        </div>
      </div>
      <AccountList
        accounts={accounts || []}
        onClick={onClickToken}
      />
    </div>
  )
}

AccountsDropdown.propTypes = {
  accounts: PropTypes.array,
  position: PropTypes.string,
  setToken: PropTypes.func,
  close: PropTypes.func
}

export default AccountsDropdown
