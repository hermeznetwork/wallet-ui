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
  position,
  accounts,
  isDropdownActive,
  onInputChange,
  onTokenChange,
  onActiveDropdownChange
}) {
  const classes = useAmountBoxStyles()
  const balance = getFixedTokenAmount(account?.balance, account?.token.decimals)
  const convertValue = getTokenAmountInPreferredCurrency(
    value,
    account?.token.USD,
    preferredCurrency,
    fiatExchangeRates
  )

  const setMax = () => {
    onInputChange({ target: { value: balance } })
  }

  const switchDropdown = () => {
    const isActive = isDropdownActive ? '' : position
    onActiveDropdownChange(isActive)
  }

  const Icon = getTokenIcon(account?.token.symbol)

  return (
    <div className={classes.frame}>
      <div className={classes.box}>
        <div className={classes.row}>
          <div className={classes.selectorBox} onClick={switchDropdown}>
            {account
              ? (
                <div className={classes.tokenName}>
                  <Icon className={classes.tokenIcon} /> {account.token.symbol}
                </div>
                )
              : 'Select token'} <AngleDown className={classes.angleColor} />
          </div>
          <input
            className={classes.amountInput}
            type='text'
            value={value}
            placeholder='0'
            onChange={onInputChange}
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
          <span className={classes.convertedText}>
            <FiatAmount amount={convertValue} currency={preferredCurrency} />
          </span>
        </div>
      </div>
      {
          isDropdownActive &&
            <Dropdown
              close={switchDropdown}
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
  position: PropTypes.string,
  preferredCurrency: PropTypes.string,
  fiatExchangeRates: PropTypes.object,
  isDropdownActive: PropTypes.bool,
  onInputChange: PropTypes.func,
  onTokenClick: PropTypes.func,
  onDropdownChange: PropTypes.func
}

export default AmountInput(AmountBox)
