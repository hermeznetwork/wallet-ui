import React from 'react'
import PropTypes from 'prop-types'
import useAmountBoxStyles from './amount-box.style'
import { ReactComponent as AngleDown } from '../../../../images/icons/angle-down.svg'
import FiatAmount from '../../../shared/fiat-amount/fiat-amount.view'
import AmountInput from '../../../shared/amount-input/amount-input'
import Dropdown from '../dropdown/dropdown.view'
import { getTokenIcon } from '../../../../utils/tokens'

function AmountBox ({
  account,
  preferredCurrency,
  value,
  amount,
  onInputChange,
  position,
  accounts,
  hideSearch,
  setToken
}) {
  const classes = useAmountBoxStyles()
  const [isVisible, setVisible] = React.useState(false)
  const decimals = Math.pow(10, account?.token.decimals)
  const balance = account?.balance / decimals
  const setMax = () => {
    onInputChange({
      target: { value: balance }
    })
  }
  const switchDropdown = () => {
    setVisible(!isVisible)
    // hideSearch(!isVisible)
  }
  const convertValue =
    (account?.fiatBalance * value * decimals) / account?.balance

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
    if (isVisible) {
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
    <div
      className={classes.frame}
      style={position === 'from' ? { zIndex: 30 } : null}
    >
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
        </div>
        <div className={`${classes.row} ${classes.rowMarginTop}`}>
          {renderBalance()}
          <span className={classes.convertedText}>
            <FiatAmount amount={convertValue} currency={preferredCurrency} />
          </span>
        </div>
      </div>
      {renderDropdown()}
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
  hideSearch: PropTypes.bool,
  setToken: PropTypes.func
}

export default AmountInput(AmountBox)
