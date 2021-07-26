import React from 'react'
import PropTypes from 'prop-types'

import useAmountBoxStyles from './amount-box.style'
import { ReactComponent as AngleDown } from '../../../../images/icons/angle-down.svg'
import FiatAmount from '../../../shared/fiat-amount/fiat-amount.view'
import AmountInput from '../../../shared/amount-input/amount-input'
import Dropdown from '../dropdown/dropdown.view'
import { getTokenIcon } from '../../../../utils/tokens'
import {
  getTokenAmountInPreferredCurrency,
  getFixedTokenAmount
} from '../../../../utils/currencies'

function AmountBox ({
  account,
  preferredCurrency,
  fiatExchangeRates,
  value,
  amount,
  onInputChange,
  position,
  accounts,
  setToken,
  setDropdown,
  isDropdownActive
}) {
  const classes = useAmountBoxStyles()
  const balance = getFixedTokenAmount(account?.balance, account?.token.decimals)
  const setMax = () => {
    onInputChange({
      target: { value: balance }
    })
  }
  const switchDropdown = () => {
    const isActive = isDropdownActive ? '' : position
    setDropdown(isActive)
  }
  const convertValue = getTokenAmountInPreferredCurrency(
    value,
    account?.token.USD,
    preferredCurrency,
    fiatExchangeRates
  )
  const Icon = getTokenIcon(account?.token.symbol)
  const renderName = () => {
    if (account) {
      return (
        <div className={classes.tokenName}>
          <Icon className={classes.tokenIcon} /> {account.token.symbol}
        </div>
      )
    }
    return 'Select token'
  }
  const renderBalance = () => {
    if (account) {
      return (
        <span className={classes.convertedText}>
          Balance: {balance} {account.token.symbol}{' '}
          {position === 'from' && (
            <span className={classes.maxBtn} onClick={setMax}>
              Max
            </span>
          )}
        </span>
      )
    }
    return <div />
  }
  const renderDropdown = () => {
    if (isDropdownActive) {
      return (
        <Dropdown
          close={switchDropdown}
          accounts={accounts}
          setToken={setToken}
          position={position}
        />
      )
    }
    return null
  }
  return (
    <div className={classes.frame}>
      <div className={classes.box}>
        <div className={classes.row}>
          <div className={classes.selectorBox} onClick={switchDropdown}>
            {renderName()} <AngleDown className={classes.angleColor} />
          </div>
          <input
            className={classes.amountInput}
            type='text'
            value={value}
            placeholder='0'
            onChange={onInputChange}
          />
          {renderDropdown()}
        </div>
        <div className={`${classes.row} ${classes.rowMarginTop}`}>
          {renderBalance()}
          <span className={classes.convertedText}>
            <FiatAmount amount={convertValue} currency={preferredCurrency} />
          </span>
        </div>
      </div>
    </div>
  )
}

AmountBox.propTypes = {
  accounts: PropTypes.object,
  account: PropTypes.object,
  value: PropTypes.number,
  amount: PropTypes.number,
  onInputChange: PropTypes.func,
  position: PropTypes.string,
  setToken: PropTypes.func,
  preferredCurrency: PropTypes.string,
  fiatExchangeRates: PropTypes.object,
  setDropdown: PropTypes.func,
  isDropdownActive: PropTypes.bool
}

export default AmountInput(AmountBox)
