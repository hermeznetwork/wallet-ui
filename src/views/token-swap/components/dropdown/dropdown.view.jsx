import React from 'react'
import PropTypes from 'prop-types'

import useDropdrownpStyles from './dropdown.style'
import List from '../list/list.view'
import { ReactComponent as Search } from '../../../../images/icons/search.svg'

function Dropdown ({ accounts, position, onClick, onClose }) {
  const classes = useDropdrownpStyles()

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
      <List
        accounts={accounts || []}
        onClick={onClickToken}
      />
    </div>
  )
}

Dropdown.propTypes = {
  accounts: PropTypes.array,
  position: PropTypes.string,
  setToken: PropTypes.func,
  close: PropTypes.func
}

export default Dropdown
