import React from 'react'
import PropTypes from 'prop-types'

import useDropdrownpStyles from './dropdown.style'
import { ReactComponent as Search } from '../../../../images/icons/search.svg'
import { getTokenIcon } from '../../../../utils/tokens'
import { getFixedTokenAmount } from '../../../../utils/currencies'

function Dropdown ({ accounts, position, setToken, close }) {
  const classes = useDropdrownpStyles()
  const onClickToken = account => {
    close()
    setToken({ [position]: account })
  }
  const renderList = accounts.map(account => {
    const Icon = getTokenIcon(account.token.symbol)
    const balance = `${getFixedTokenAmount(
      account.balance,
      account.token.decimals
    )} ${account.token.symbol}`
    return (
      <div
        key={account.token.symbol}
        className={classes.tokenBox}
        onClick={() => onClickToken(account)}
      >
        <div className={classes.tokenIcon}>
          <Icon />
        </div>
        <div className={classes.tokenText}>
          <p>{account.token.name}</p>
          <p className={classes.symbol}> {account.token.symbol}</p>
        </div>
        <span className={classes.balanceText}>{balance}</span>
      </div>
    )
  })
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
      <div className={classes.listBox}>{renderList}</div>
    </div>
  )
}

Dropdown.propTypes = {
  accounts: PropTypes.object,
  position: PropTypes.string,
  setToken: PropTypes.func,
  close: PropTypes.func
}

export default Dropdown
