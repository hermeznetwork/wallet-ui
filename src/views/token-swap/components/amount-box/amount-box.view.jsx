import React from 'react'
import PropTypes from 'prop-types'

import useAmountBoxStyles from './amount-box.style'
import { ReactComponent as AngleDown } from '../../../../images/icons/angle-down.svg'
import FiatAmount from '../../../shared/fiat-amount/fiat-amount.view'
import AmountInput from '../../../shared/amount-input/amount-input.view'
import Dropdown from '../dropdown/dropdown.view'
import { getTokenIcon } from '../../../../utils/tokens'
import {
  getTokenAmountInPreferredCurrency,
  getFixedTokenAmount
} from '../../../../utils/currencies'

export const AmountBoxPosition = {
  TO: 'to',
  FROM: 'from'
}

function AmountBox ({
  account,
  preferredCurrency,
  fiatExchangeRates,
  value,
  amountToUpdate,
  position,
  positionUpdated,
  accounts,
  isDropdownActive,
  onInputChange,
  onTokenChange,
  onActiveDropdownChange,
  setPositionUpdated
}) {
  const classes = useAmountBoxStyles()
  const balance = getFixedTokenAmount(account?.balance, account?.token.decimals)
  const convertValue = getTokenAmountInPreferredCurrency(
    value,
    account?.token.USD,
    preferredCurrency,
    fiatExchangeRates
  )

  const switchDropdown = () => {
    const isActive = isDropdownActive ? '' : position
    onActiveDropdownChange(isActive)
  }

  const setMax = () => {
    setPositionUpdated(position)
    onInputChange({ target: { value: balance } })
  }

  const inputChange = value => {
    setPositionUpdated(position)
    onInputChange(value)
  }

  const Icon = getTokenIcon(account?.token.symbol)

  return (
    <div className={classes.frame}>
      <div className={classes.box}>
        <div className={classes.row}>
          <div className={classes.selectorBox} onClick={switchDropdown}>
            <p className={classes.tokenName}>
              {account
                ? (
                  <>
                    <Icon className={classes.tokenIcon} /> {account.token.symbol}
                  </>
                  )
                : 'Select token'} <AngleDown className={classes.angleColor} />
            </p>
          </div>
          <input
            className={classes.amountInput}
            type='text'
            value={value}
            placeholder='0'
            onChange={inputChange}
          />
        </div>
        <div className={`${classes.row} ${classes.rowMarginTop}`}>
          {account
            ? (
              <p className={classes.convertedText}>
                Balance: {`${balance} ${account.token.symbol} `}
                {position === AmountBoxPosition.FROM && (
                  <span className={classes.maxBtn} onClick={setMax}>
                    Max
                  </span>
                )}
              </p>
              )
            : <div />}
          <div className={classes.convertedText}>
            <FiatAmount amount={convertValue} currency={preferredCurrency} />
          </div>
        </div>
      </div>
      {
          isDropdownActive &&
            <Dropdown
              onClose={switchDropdown}
              accounts={accounts}
              onClick={onTokenChange}
              position={position}
            />
          }
    </div>
  )
}

AmountBox.propTypes = {
  accounts: PropTypes.array,
  account: PropTypes.object,
  value: PropTypes.string,
  amountToUpdate: PropTypes.string,
  position: PropTypes.string,
  positionUpdated: PropTypes.string,
  preferredCurrency: PropTypes.string,
  fiatExchangeRates: PropTypes.object,
  isDropdownActive: PropTypes.bool,
  onInputChange: PropTypes.func,
  onTokenClick: PropTypes.func,
  onDropdownChange: PropTypes.func,
  setPositionUpdated: PropTypes.func
}

export default AmountInput(AmountBox)
